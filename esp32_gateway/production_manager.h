/**
 * @file production_manager.h
 * @brief Final Production Manager, Performance Optimizer, and Security auditor for Gateway.
 */
#ifndef PRODUCTION_MANAGER_H
#define PRODUCTION_MANAGER_H

#include <Arduino.h>
#include "config.h"
#include "system_logger.h"
#include "health_manager.h"
#include "config_manager.h"
#include "ota_manager.h"

extern unsigned long loopStartTime;
extern unsigned long maxLoopTime;
extern unsigned long minLoopTime;
extern unsigned long totalLoopTime;
extern unsigned long loopIterations;
extern uint32_t prodMinHeap;

inline void startLoopMonitor() {
    loopStartTime = micros();
}

inline void endLoopMonitor() {
    unsigned long loopTime = micros() - loopStartTime;
    if (loopTime > maxLoopTime) maxLoopTime = loopTime;
    if (loopTime < minLoopTime) minLoopTime = loopTime;
    totalLoopTime += loopTime;
    loopIterations++;
    
    uint32_t currentHeap = ESP.getFreeHeap();
    if (currentHeap < prodMinHeap) prodMinHeap = currentHeap;
}

inline void runProductionSelfTest() {
    logInfo("SYS", "Running Boot Self-Test");
    
    bool pass = true;
    
    // 1. Memory Check
    if (ESP.getFreeHeap() < 25000) {
        logError("SYS", "Initial Memory Low");
        pass = false;
    }
    
    // 2. Configuration Integrity
    if (!validateConfiguration()) {
        logError("SYS", "Config Invalid/Corrupt");
        pass = false;
    }
    
    // 3. Firmware Manifest Integrity
    if (String(otaData.currentVersion) == "N/A") {
        logWarning("SYS", "Firmware version undefined");
    }
    
    if (pass) {
        logInfo("SYS", "Self-Test PASS. System Ready.");
    } else {
        logCritical("SYS", "Self-Test FAIL. Degraded Mode.");
    }
}

inline void generateDiagnosticReport() {
    if (!DEBUG_MODE) return;
    
    Serial.println("\n==================================================");
    Serial.println("          FINAL DIAGNOSTIC REPORT                 ");
    Serial.println("==================================================");
    Serial.print("Firmware Version : "); Serial.println(otaData.currentVersion);
    Serial.print("Hardware Version : "); Serial.println(otaData.deviceModel);
    Serial.print("Device ID        : "); Serial.println(sysConfig.deviceId);
    Serial.print("Node Name        : "); Serial.println(sysConfig.nodeName);
    
    Serial.println("--------------------------------------------------");
    Serial.print("Current Heap     : "); Serial.print(ESP.getFreeHeap()); Serial.println(" bytes");
    Serial.print("Minimum Heap     : "); Serial.print(prodMinHeap); Serial.println(" bytes");
    
    if (loopIterations > 0) {
        unsigned long avgLoop = totalLoopTime / loopIterations;
        Serial.print("Avg Loop Time    : "); Serial.print(avgLoop); Serial.println(" us");
        Serial.print("Max Loop Time    : "); Serial.print(maxLoopTime); Serial.println(" us");
        Serial.print("Min Loop Time    : "); Serial.print(minLoopTime); Serial.println(" us");
    }
    
    Serial.println("--------------------------------------------------");
    Serial.print("Uptime (ms)      : "); Serial.println(millis());
    Serial.print("Config Version   : "); Serial.println(sysConfig.configVersion);
    
    Serial.print("Health State     : "); 
    SystemHealth h = getSystemHealth();
    switch(h.systemState) {
        case SYSTEM_OK: Serial.println("OK"); break;
        case WARNING: Serial.println("WARNING"); break;
        case ERROR: Serial.println("ERROR"); break;
        case CRITICAL: Serial.println("CRITICAL"); break;
    }
    Serial.println("==================================================\n");
}

#endif // PRODUCTION_MANAGER_H
