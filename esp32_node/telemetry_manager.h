/**
 * @file telemetry_manager.h
 * @brief Professional Telemetry Manager for ESP32 Node.
 * Handles data aggregation, JSON generation, and LoRa transmission.
 */
#ifndef TELEMETRY_MANAGER_H
#define TELEMETRY_MANAGER_H

#include <Arduino.h>
#include "config.h"
#include "sensors.h"
#include "flow_sensors.h/flowsensor.h"
#include "relays.h"
#include "irrigation_controller.h"
#include "lora_node.h"
#include "config_manager.h"
#include "ota_manager.h"

#ifndef TELEMETRY_INTERVAL_MS
#define TELEMETRY_INTERVAL_MS 2000
#endif

// ------------------------------------------------
// Telemetry State
// ------------------------------------------------
__attribute__((weak)) unsigned long lastTelemetrySentMs = 0;
__attribute__((weak)) unsigned long telemetryPacketCount = 0;
__attribute__((weak)) String currentTelemetryPacket = "";

// ------------------------------------------------
// Helper Functions
// ------------------------------------------------

/**
 * @brief Converts the ControllerState enum to a String representation.
 */
inline String stateToString(ControllerState state) {
    switch(state) {
        case IDLE: return "IDLE";
        case PREPARE: return "PREPARE";
        case IRRIGATING: return "IRRIGATING";
        case FERTIGATING: return "FERTIGATING";
        case FLUSHING: return "FLUSHING";
        case COMPLETE: return "COMPLETE";
        case EMERGENCY: return "EMERGENCY";
        default: return "UNKNOWN";
    }
}

/**
 * @brief Safely formats a float to a String. If it's -1, returns "null" or "0".
 */
inline String formatSensorValue(float val) {
    if (val < 0) {
        return "null";
    }
    return String(val, 2);
}

// ------------------------------------------------
// Core Functions
// ------------------------------------------------

/**
 * @brief Initializes the telemetry manager.
 */
inline void setupTelemetry() {
    Serial.println("Initializing Telemetry Manager...");
    
    // Pre-allocate memory for the JSON string to prevent heap fragmentation
    currentTelemetryPacket.reserve(256);
    
    lastTelemetrySentMs = millis();
}

/**
 * @brief Builds a compact JSON string containing all system data.
 */
inline void buildTelemetryPacket() {
    telemetryPacketCount++;
    
    float ph = readPH();
    float ec = readEC();
    float tds = readTDS();
    float soil = readSoilMoisture();
    
    float wFlow = getWaterFlowRate();
    float fFlow = getFertilizerFlowRate();
    float wTotal = getTotalWater();
    float fTotal = getTotalFertilizer();
    
    ControllerState state = getControllerState();
    
    // Battery voltage is a placeholder since no dedicated sensor exists yet.
    float battery = 12.0; 
    
    // Build JSON string manually to avoid heavy libraries and dynamic allocations
    currentTelemetryPacket = "{";
    
    currentTelemetryPacket += "\"id\":\"" + String(sysConfig.deviceId) + "\",";
    
    currentTelemetryPacket += "\"ph\":" + formatSensorValue(ph) + ",";
    currentTelemetryPacket += "\"ec\":" + formatSensorValue(ec) + ",";
    currentTelemetryPacket += "\"tds\":" + formatSensorValue(tds) + ",";
    currentTelemetryPacket += "\"soil\":" + formatSensorValue(soil) + ",";
    
    currentTelemetryPacket += "\"waterFlow\":" + formatSensorValue(wFlow) + ",";
    currentTelemetryPacket += "\"fertFlow\":" + formatSensorValue(fFlow) + ",";
    currentTelemetryPacket += "\"waterTotal\":" + formatSensorValue(wTotal) + ",";
    currentTelemetryPacket += "\"fertTotal\":" + formatSensorValue(fTotal) + ",";
    
    currentTelemetryPacket += "\"state\":\"" + stateToString(state) + "\",";
    currentTelemetryPacket += "\"battery\":" + formatSensorValue(battery) + ",";
    currentTelemetryPacket += "\"uptime\":" + String(millis()) + ",";
    currentTelemetryPacket += "\"packet\":" + String(telemetryPacketCount) + ",";
    
    currentTelemetryPacket += "\"otaVer\":\"" + String(otaData.currentVersion) + "\",";
    currentTelemetryPacket += "\"otaStatus\":" + String(otaData.status) + ",";
    currentTelemetryPacket += "\"otaProg\":" + String(otaData.progress, 1);
    
    currentTelemetryPacket += "}";
}

/**
 * @brief Prints the telemetry packet to the Serial monitor for debugging.
 */
inline void printTelemetry() {
    if (DEBUG_MODE) {
        Serial.println("\n===== TELEMETRY =====");
        Serial.println(currentTelemetryPacket);
        Serial.print("Packet Length : ");
        Serial.println(currentTelemetryPacket.length());
        Serial.print("Free Heap     : ");
        Serial.println(ESP.getFreeHeap());
        Serial.println("=====================\n");
    }
}

/**
 * @brief Sends the current telemetry packet via LoRa.
 */
inline void sendTelemetry() {
    sendPacket(currentTelemetryPacket);
}

/**
 * @brief Master non-blocking update loop for telemetry.
 * Called continuously in main loop().
 */
inline void updateTelemetry() {
    unsigned long now = millis();
    
    if (now - lastTelemetrySentMs >= sysConfig.telemetryInterval) {
        lastTelemetrySentMs = now;
        
        buildTelemetryPacket();
        
        printTelemetry();
        
        sendTelemetry();
    }
}

#endif // TELEMETRY_MANAGER_H
