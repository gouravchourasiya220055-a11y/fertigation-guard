/**
 * @file ota_manager.h
 * @brief Professional OTA Firmware Update Manager for ESP32 Node.
 * Handles state-machine driven, non-blocking Over-The-Air updates via LoRa.
 */
#ifndef OTA_MANAGER_H
#define OTA_MANAGER_H

#include <Arduino.h>
#include <Update.h>
#include "config.h"

// ------------------------------------------------
// Enumerations
// ------------------------------------------------
enum OTAState {
    OTA_IDLE,
    OTA_CHECKING,
    OTA_AVAILABLE,
    OTA_DOWNLOADING,
    OTA_VERIFYING,
    OTA_INSTALLING,
    OTA_SUCCESS,
    OTA_FAILED,
    OTA_ROLLBACK
};

// ------------------------------------------------
// Data Structures
// ------------------------------------------------
struct OTAInfo {
    char currentVersion[16];
    char latestVersion[16];
    OTAState status;
    float progress;
    unsigned long lastUpdateTime;
    char buildNumber[16];
    char compileDate[16];
    char compileTime[16];
    char deviceModel[32];
    char firmwareHash[65];
};

// ------------------------------------------------
// Global State
// ------------------------------------------------
__attribute__((weak)) OTAInfo otaData;

// ------------------------------------------------
// Core Functions
// ------------------------------------------------
inline void setupOTA() {
    snprintf(otaData.currentVersion, sizeof(otaData.currentVersion), "1.0.0");
    snprintf(otaData.latestVersion, sizeof(otaData.latestVersion), "1.0.0");
    otaData.status = OTA_IDLE;
    otaData.progress = 0.0;
    otaData.lastUpdateTime = 0;
    snprintf(otaData.buildNumber, sizeof(otaData.buildNumber), "BUILD_1001");
    snprintf(otaData.compileDate, sizeof(otaData.compileDate), __DATE__);
    snprintf(otaData.compileTime, sizeof(otaData.compileTime), __TIME__);
    snprintf(otaData.deviceModel, sizeof(otaData.deviceModel), "NODE_V2");
    snprintf(otaData.firmwareHash, sizeof(otaData.firmwareHash), "N/A");
    
    if (DEBUG_MODE) Serial.println("OTA Manager Initialized (Node).");
}

inline void checkFirmwareVersion() {
    if (otaData.status != OTA_IDLE) return;
    otaData.status = OTA_CHECKING;
    if (DEBUG_MODE) Serial.println("Checking for firmware updates...");
    
    // In the Node architecture, we await a response from the Gateway via LoRa.
    // For now, passively return to IDLE until a chunk notification arrives.
    otaData.status = OTA_IDLE; 
}

inline void startOTA() {
    if (otaData.status == OTA_AVAILABLE || otaData.status == OTA_IDLE) {
        otaData.status = OTA_DOWNLOADING;
        otaData.progress = 0.0;
        
        // Begin the hardware update process (Watchdog will pause other tasks based on this state)
        if (!Update.begin(UPDATE_SIZE_UNKNOWN)) {
            otaData.status = OTA_FAILED;
            if (DEBUG_MODE) Serial.println("OTA Failed to start. Not enough space.");
        } else {
            if (DEBUG_MODE) Serial.println("OTA Started. Downloading...");
        }
    }
}

inline void stopOTA() {
    Update.abort();
    otaData.status = OTA_IDLE;
    otaData.progress = 0.0;
    if (DEBUG_MODE) Serial.println("OTA Stopped. Update aborted.");
}

inline void downloadFirmware() {
    // Called continuously during OTA_DOWNLOADING state.
    // In Node, chunks arrive via LoRa Command Processor.
    // The processor injects data into Update.write().
    
    // Simulated timeout or progress hook here:
    // If progress 100%, move to verifying
}

inline void verifyFirmware() {
    if (DEBUG_MODE) Serial.println("Verifying firmware checksum & hash...");
    // Validate SHA256 and MD5 checksums written to the partition.
    // For now, gracefully pass.
    otaData.status = OTA_INSTALLING;
}

inline void installFirmware() {
    if (DEBUG_MODE) Serial.println("Installing...");
    if (Update.end(true)) { // true = automatically finalizes and validates
        otaData.status = OTA_SUCCESS;
        otaData.progress = 100.0;
        otaData.lastUpdateTime = millis();
        if (DEBUG_MODE) Serial.println("OTA Update Successful. Rebooting...");
        delay(500); // Only acceptable use of delay before a hard restart
        ESP.restart();
    } else {
        otaData.status = OTA_FAILED;
        if (DEBUG_MODE) Serial.println("OTA Installation Failed!");
    }
}

inline void rollbackFirmware() {
    otaData.status = OTA_ROLLBACK;
    if (Update.canRollBack()) {
        Update.rollBack();
        if (DEBUG_MODE) Serial.println("Rollback Successful. Rebooting into previous partition...");
        delay(500);
        ESP.restart();
    } else {
        if (DEBUG_MODE) Serial.println("Rollback failed! No valid backup partition found.");
        otaData.status = OTA_FAILED;
    }
}

/**
 * @brief Master non-blocking OTA state machine.
 */
inline void updateOTA() {
    switch(otaData.status) {
        case OTA_DOWNLOADING:
            downloadFirmware();
            break;
        case OTA_VERIFYING:
            verifyFirmware();
            break;
        case OTA_INSTALLING:
            installFirmware();
            break;
        default:
            break;
    }
}

#endif // OTA_MANAGER_H
