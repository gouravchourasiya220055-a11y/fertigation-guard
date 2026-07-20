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
#include "flow.h"
#include "relays.h"
#include "fertigation.h"
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
        case FILLING_WATER: return "FILLING_WATER";
        case ADDING_FERTILIZER: return "ADDING_FERTILIZER";
        case MIXING: return "MIXING";
        case CORRECTING_PH_TDS: return "CORRECTING_PH_TDS";
        case IRRIGATING: return "IRRIGATING";
        case DRAINING: return "DRAINING";
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
    currentTelemetryPacket.reserve(512); // Increased for new fields
    
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
    
    // Old flow variables mapping
    float wFlow = getWaterFlowRate();
    float fFlow = getFertilizerFlowRate();
    float wTotal = getTotalWater();
    float fTotal = getTotalFertilizer();
    
    // New flow variables
    float flowMixed = getMixedFlowRate();
    float mixedDelivered = getTotalMixed();
    
    ControllerState state = getControllerState();
    RelayState rState = getRelayStatus();
    
    float battery = 12.0; 
    
    currentTelemetryPacket = "{";
    currentTelemetryPacket += "\"id\":\"" + String(sysConfig.deviceId) + "\",";
    
    // Old JSON Keys (preserved)
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
    currentTelemetryPacket += "\"otaProg\":" + String(otaData.progress, 1) + ",";

    // New JSON Keys for v2.1
    currentTelemetryPacket += "\"soilMoisture\":" + formatSensorValue(soil) + ",";
    currentTelemetryPacket += "\"flowMixed\":" + formatSensorValue(flowMixed) + ",";
    currentTelemetryPacket += "\"flowWater\":" + formatSensorValue(wFlow) + ",";
    currentTelemetryPacket += "\"flowFertilizer\":" + formatSensorValue(fFlow) + ",";
    currentTelemetryPacket += "\"waterUsed\":" + formatSensorValue(wTotal) + ",";
    currentTelemetryPacket += "\"fertilizerUsed\":" + formatSensorValue(fTotal) + ",";
    currentTelemetryPacket += "\"mixedDelivered\":" + formatSensorValue(mixedDelivered) + ",";
    
    currentTelemetryPacket += "\"relay1\":" + String(rState.isWaterPumpOn ? "true" : "false") + ",";
    currentTelemetryPacket += "\"relay2\":" + String(rState.isFertilizerPumpOn ? "true" : "false") + ",";
    currentTelemetryPacket += "\"relay3\":" + String(rState.isStirrerOn ? "true" : "false") + ",";
    currentTelemetryPacket += "\"relay4\":" + String(rState.isMainPumpOn ? "true" : "false") + ",";
    currentTelemetryPacket += "\"relay5\":" + String(rState.isBasePumpOn ? "true" : "false") + ",";
    currentTelemetryPacket += "\"relay6\":" + String(rState.isDrainValveOpen ? "true" : "false") + ",";
    
    currentTelemetryPacket += "\"systemState\":\"" + stateToString(state) + "\"";
    
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
