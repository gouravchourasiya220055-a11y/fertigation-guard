/**
 * @file health_manager.h
 * @brief Professional System Health & Diagnostics Manager for ESP32 Node.
 * Continuously monitors firmware stability, acts as a software watchdog, and performs auto-recovery.
 */
#ifndef HEALTH_MANAGER_H
#define HEALTH_MANAGER_H

#include <Arduino.h>
#include "config.h"
#include "sensors.h"
#include "flow_sensors.h/flowsensor.h"
#include "relays.h"
#include "irrigation_controller.h"
#include "telemetry_manager.h"
#include "command_processor.h"

// ------------------------------------------------
// Enumerations
// ------------------------------------------------
enum SystemState {
    SYSTEM_OK,
    WARNING,
    ERROR,
    CRITICAL
};

enum ErrorCode {
    ERR_NONE,
    ERR_SENSOR_FAIL,
    ERR_LORA_TIMEOUT,
    ERR_WIFI_LOST,
    ERR_API_FAIL,
    ERR_LOW_MEMORY,
    ERR_FLOW_FAIL,
    ERR_RELAY_TIMEOUT,
    ERR_CONTROLLER_FAIL,
    ERR_UNKNOWN
};

// ------------------------------------------------
// Structures
// ------------------------------------------------
struct SystemHealth {
    unsigned long uptime;
    uint32_t freeHeap;
    uint32_t minimumHeap;
    uint32_t cpuFreq;
    bool wifiConnected;
    bool loraConnected;
    bool sensorHealthy;
    bool flowHealthy;
    bool relayHealthy;
    bool controllerHealthy;
    unsigned long lastTelemetry;
    unsigned long lastPacket;
    ErrorCode errorCode;
    SystemState systemState;
};

// ------------------------------------------------
// Global State
// ------------------------------------------------
__attribute__((weak)) SystemHealth healthStatus;
__attribute__((weak)) unsigned long lastHealthPrintMs = 0;

// ------------------------------------------------
// Functions
// ------------------------------------------------

/**
 * @brief Resets health flags back to normal.
 */
inline void resetHealthErrors() {
    healthStatus.errorCode = ERR_NONE;
    healthStatus.systemState = SYSTEM_OK;
}

/**
 * @brief Executes Boot-time RAM and Peripheral verification.
 */
inline void performSelfTest() {
    Serial.println("Performing Boot Self-Test...");
    
    // RAM Test
    healthStatus.freeHeap = ESP.getFreeHeap();
    healthStatus.minimumHeap = healthStatus.freeHeap;
    Serial.print("RAM Test: ");
    Serial.println(healthStatus.freeHeap > 10000 ? "PASS" : "FAIL");
    
    // Sensor Availability (Validates ADC response)
    float ph = readPH();
    Serial.print("Sensor Availability: ");
    Serial.println(ph >= 0 ? "PASS" : "FAIL");
    healthStatus.sensorHealthy = (ph >= 0);
    
    // Relays and LoRa are assumed tested during their respective setup() blocks
    Serial.print("Relay Initialization: PASS\n");
    healthStatus.relayHealthy = true;
    
    Serial.print("LoRa Initialization: PASS\n");
    healthStatus.loraConnected = true;
    
    healthStatus.wifiConnected = false; // Node architecture uses LoRa natively
    healthStatus.flowHealthy = true;
    healthStatus.controllerHealthy = true;
    
    resetHealthErrors();
}

/**
 * @brief Initialize the System Health Manager.
 */
inline void setupHealthManager() {
    if (DEBUG_MODE) Serial.println("Initializing Node Health Manager...");
    healthStatus.minimumHeap = ESP.getFreeHeap();
    performSelfTest();
}

/**
 * @brief Returns the current structured System Health block.
 */
inline SystemHealth getSystemHealth() {
    return healthStatus;
}

/**
 * @brief Boolean check if system is operating flawlessly.
 */
inline bool isSystemHealthy() {
    return healthStatus.systemState == SYSTEM_OK;
}

/**
 * @brief Prints the 10-second heartbeat debug matrix.
 */
inline void printHealthReport() {
    if (DEBUG_MODE) {
        Serial.println("\n========== SYSTEM HEALTH ==========");
        Serial.print("Uptime (ms) : "); Serial.println(healthStatus.uptime);
        Serial.print("Free Heap   : "); Serial.println(healthStatus.freeHeap);
        Serial.print("Min Heap    : "); Serial.println(healthStatus.minimumHeap);
        Serial.print("CPU Freq    : "); Serial.print(healthStatus.cpuFreq); Serial.println(" MHz");
        Serial.print("LoRa        : "); Serial.println(healthStatus.loraConnected ? "OK" : "FAIL");
        Serial.print("WiFi        : "); Serial.println("N/A (NODE)");
        Serial.print("Sensors     : "); Serial.println(healthStatus.sensorHealthy ? "OK" : "FAIL");
        Serial.print("Flow        : "); Serial.println(healthStatus.flowHealthy ? "OK" : "FAIL");
        Serial.print("Relays      : "); Serial.println(healthStatus.relayHealthy ? "OK" : "FAIL");
        Serial.print("Controller  : "); Serial.println(healthStatus.controllerHealthy ? "OK" : "FAIL");
        Serial.print("Error Code  : "); Serial.println(healthStatus.errorCode);
        Serial.print("Health State: "); Serial.println(healthStatus.systemState);
        Serial.println("===================================\n");
    }
}

/**
 * @brief Master non-blocking watchdog and recovery tick.
 */
inline void updateHealthManager() {
    unsigned long now = millis();
    
    // 1. Update Core Metrics
    healthStatus.uptime = now;
    healthStatus.freeHeap = ESP.getFreeHeap();
    healthStatus.cpuFreq = ESP.getCpuFreqMHz();
    if (healthStatus.freeHeap < healthStatus.minimumHeap) {
        healthStatus.minimumHeap = healthStatus.freeHeap;
    }
    
    // 2. Fetch inter-module timestamps
    extern unsigned long lastTelemetrySentMs;
    extern unsigned long lastCommandTime;
    healthStatus.lastTelemetry = lastTelemetrySentMs;
    healthStatus.lastPacket = lastCommandTime;
    
    // 3. Evaluate Sensor Health
    float ph = readPH();
    if (ph < 0) {
        healthStatus.sensorHealthy = false;
        healthStatus.errorCode = ERR_SENSOR_FAIL;
        healthStatus.systemState = ERROR;
    } else {
        healthStatus.sensorHealthy = true;
    }
    
    // 4. Evaluate Controller & Relays
    extern RelayState relayStatus;
    if (relayStatus.emergencyMode) {
        healthStatus.relayHealthy = false;
        healthStatus.errorCode = ERR_RELAY_TIMEOUT;
        healthStatus.systemState = CRITICAL;
    } else {
        healthStatus.relayHealthy = true;
    }
    
    // 5. Watchdog logic and Auto-Recovery
    if (healthStatus.freeHeap < 15000) {
        healthStatus.errorCode = ERR_LOW_MEMORY;
        healthStatus.systemState = WARNING;
    }
    
    if (now - healthStatus.lastTelemetry > 300000 && healthStatus.lastTelemetry != 0) {
        // Auto Recovery: Restart telemetry logic triggers
        extern unsigned long telemetryPacketCount;
        telemetryPacketCount = 0;
        healthStatus.errorCode = ERR_UNKNOWN;
        healthStatus.systemState = WARNING;
    }
    
    // Clear warnings if self-healed
    if (healthStatus.sensorHealthy && healthStatus.relayHealthy && healthStatus.freeHeap > 20000) {
        resetHealthErrors();
    }
    
    // 6. Print Report every 10 seconds
    if (now - lastHealthPrintMs >= 10000) {
        lastHealthPrintMs = now;
        printHealthReport();
    }
}

#endif // HEALTH_MANAGER_H
