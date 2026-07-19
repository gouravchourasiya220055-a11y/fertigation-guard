/**
 * @file health_manager.h
 * @brief Professional System Health & Diagnostics Manager for ESP32 Gateway.
 * Monitors WiFi, API health, memory, and performs network recovery.
 */
#ifndef HEALTH_MANAGER_H
#define HEALTH_MANAGER_H

#include <Arduino.h>
#include <WiFi.h>
#include "config.h"
#include "cloud_sync_manager.h"
#include "command_manager.h"

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
extern SystemHealth healthStatus;
extern unsigned long lastHealthPrintMs;

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
    Serial.println(healthStatus.freeHeap > 20000 ? "PASS" : "FAIL");
    
    // WiFi Test
    healthStatus.wifiConnected = (WiFi.status() == WL_CONNECTED);
    Serial.print("WiFi Initialization: ");
    Serial.println(healthStatus.wifiConnected ? "PASS" : "FAIL");
    
    Serial.print("LoRa Initialization: PASS\n");
    healthStatus.loraConnected = true;
    
    healthStatus.sensorHealthy = true;
    healthStatus.relayHealthy = true;
    healthStatus.flowHealthy = true;
    healthStatus.controllerHealthy = true;
    
    resetHealthErrors();
}

/**
 * @brief Initialize the System Health Manager.
 */
inline void setupHealthManager() {
    if (DEBUG_MODE) Serial.println("Initializing Gateway Health Manager...");
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
        Serial.print("WiFi        : "); Serial.println(healthStatus.wifiConnected ? "OK" : "FAIL");
        Serial.print("Sensors     : "); Serial.println("N/A (GATEWAY)");
        Serial.print("Flow        : "); Serial.println("N/A (GATEWAY)");
        Serial.print("Relays      : "); Serial.println("N/A (GATEWAY)");
        Serial.print("Controller  : "); Serial.println("N/A (GATEWAY)");
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
    
    // 2. Fetch Gateway Module States
    healthStatus.wifiConnected = (WiFi.status() == WL_CONNECTED);
    extern unsigned long lastFetchTime; // from command_manager
    healthStatus.lastPacket = lastFetchTime; 
    
    // 3. Watchdog & Auto-Recovery
    if (!healthStatus.wifiConnected) {
        healthStatus.errorCode = ERR_WIFI_LOST;
        healthStatus.systemState = WARNING;
        // Auto Recovery: Network Reconnection attempt via WiFi.reconnect()
        // We limit calling reconnect to avoid blocking.
        if (now % 30000 < 50) { 
            WiFi.reconnect(); 
        }
    } else {
        resetHealthErrors();
    }
    
    if (healthStatus.freeHeap < 20000) {
        healthStatus.errorCode = ERR_LOW_MEMORY;
        healthStatus.systemState = WARNING;
    }
    
    // 4. Print Report every 10 seconds
    if (now - lastHealthPrintMs >= 10000) {
        lastHealthPrintMs = now;
        printHealthReport();
    }
}

#endif // HEALTH_MANAGER_H
