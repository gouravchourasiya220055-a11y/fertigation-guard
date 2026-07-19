/**
 * @file esp32_node.ino
 * @brief Main application entry point for the ESP32 Node.
 */
#include <Arduino.h>
#include "config.h"
#include "lora_node.h"
#include "irrigation_controller.h"
#include "telemetry_manager.h"
#include "command_processor.h"
#include "config_manager.h"
#include "health_manager.h"
#include "ota_manager.h"
#include "production_manager.h"

void setup() {
  Serial.begin(115200);
  
  // Very short delay at boot to allow serial to attach safely
  unsigned long bootStart = millis();
  while(millis() - bootStart < 1000) {} 

  Serial.println("=== Fertigation Node Starting ===");

  setupLogger();
  setupConfigManager();
  setupHealthManager();
  setupOTA();
  setupLoRa();
  setupIrrigationController();
  setupTelemetry();
  setupCommandProcessor();
  
  runProductionSelfTest();
  generateDiagnosticReport();
  
  // Start in automatic mode as an example
  startAutomaticCycle();
}

void loop() {
  startLoopMonitor();

  // 1. Process Incoming LoRa Commands
  updateCommandProcessor();
  
  // 2. Refresh Sensor Data (Non-blocking)
  updateSensors();
  
  // 3. Evaluate Irrigation Logic
  updateIrrigationController();
  
  // 4. Send Telemetry
  updateTelemetry();
  
  // 5. System Health Watchdog & Diagnostics
  updateHealthManager();

  // 6. Over-The-Air Update Manager
  updateOTA();
  
  endLoopMonitor();
}