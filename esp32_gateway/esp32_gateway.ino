/**
 * @file esp32_gateway.ino
 * @brief Main application entry point for the ESP32 Gateway.
 */
#include <Arduino.h>
#include <SPI.h>
#include <LoRa.h>
#include <ArduinoJson.h>
#include "config.h"
#include "lora_gateway.h"
#include "api_client.h"
#include "command_manager.h"
#include "config_manager.h"
#include "cloud_sync_manager.h"
#include "health_manager.h"
#include "ota_manager.h"
#include "production_manager.h"
#include "wifi_manager.h"

// ------------------------------------------------
// Global Variable Definitions
// ------------------------------------------------

// command_manager.h
GatewayCommand commandQueue[MAX_QUEUE_SIZE];
int cmdQueueHead = 0;
int cmdQueueTail = 0;
int cmdQueueSize = 0;
String lastCommandString = "";
unsigned long lastCommandTime = 0;
unsigned long lastFetchTime = 0;

// cloud_sync_manager.h
TelemetryPacket offlineQueue[MAX_OFFLINE_QUEUE];
int offlineQueueHead = 0;
int offlineQueueTail = 0;
int offlineQueueSize = 0;
unsigned long lastHeartbeatMs = 0;
unsigned long lastNtpSyncMs = 0;
bool isNetworkOnline = false;

// wifi_manager.h
unsigned long lastWiFiCheck = 0;

// health_manager.h
SystemHealth healthStatus;
unsigned long lastHealthPrintMs = 0;

// ota_manager.h
OTAInfo otaData;
unsigned long otaTimer = 0;

// production_manager.h
unsigned long loopStartTime = 0;
unsigned long maxLoopTime = 0;
unsigned long minLoopTime = 0xFFFFFFFF;
unsigned long totalLoopTime = 0;
unsigned long loopIterations = 0;
uint32_t prodMinHeap = 0xFFFFFFFF;

// system_logger.h
LogEntry logBuffer[MAX_LOG_ENTRIES];
int logHead = 0;
int logCount = 0;

// config_manager.h
SystemConfig sysConfig;
Preferences prefs;
Preferences backupPrefs;

void setup() {
  Serial.begin(115200);
  
  // Non-blocking wait for serial
  unsigned long bootStart = millis();
  while(millis() - bootStart < 1000) {} 

  Serial.println("================================");
  Serial.println("      LoRa Gateway Test");
  Serial.println("================================");

  setupLogger();
  setupConfigManager();
  setupHealthManager();
  setupOTA();
  setupCloudSync();
  setupLoRa();
  setupCommandManager();
  setupWiFi();
  
  runProductionSelfTest();
  generateDiagnosticReport();

  Serial.println("Waiting for packets & fetching commands...");
}

void loop() {
  startLoopMonitor();
  
  // 1. Service Incoming Telemetry from Nodes
  String packet = receiveLoRaPacket();

  if (packet.length() > 0) {
    StaticJsonDocument<512> doc;
    DeserializationError error = deserializeJson(doc, packet);
    
    if (!error) {
        String deviceId = doc["id"] | "UNKNOWN";
        
        String logMsg = "Packet Received\nNode: " + deviceId + 
                        " | RSSI: " + String(LoRa.packetRssi()) + 
                        " | SNR: " + String(LoRa.packetSnr()) +
                        " | Size: " + String(packet.length()) + 
                        " | TS: " + String(millis());
        logInfo("LoRa", logMsg.c_str());
        
        // Route telemetry packets to the Cloud Sync Manager
        uploadTelemetry(packet);
    } else {
        logWarning("LoRa", "Ignored Invalid JSON Packet");
    }
  }

  // 2. Fetch and Route Commands from Backend API
  updateCommandManager();
  
  // 3. Service Cloud Synchronization (Heartbeats, NTP, Offline Queue)
  updateCloudSync();
  
  // 4. System Health Watchdog & Diagnostics
  updateHealthManager();
  
  // 5. Over-The-Air Update Manager
  updateOTA();

  endLoopMonitor();
}