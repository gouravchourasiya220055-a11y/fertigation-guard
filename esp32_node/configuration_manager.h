/**
 * @file configuration_manager.h
 * @brief Professional Configuration Manager handling NVRAM (Preferences) storage.
 */
#ifndef CONFIGURATION_MANAGER_H
#define CONFIGURATION_MANAGER_H

#include <Arduino.h>
#include <Preferences.h>
#include "config.h"

// ------------------------------------------------
// Data Structures
// ------------------------------------------------
struct IrrigationSettings {
    float targetPH;
    float targetEC;
    float soilStartThreshold;
    float soilStopThreshold;
    float fertilizerDose;
    float flushDuration;
    bool autoMode;
    bool irrigationEnabled;
    bool fertigationEnabled;
    char cropName[32];
    uint32_t configVersion;
};

// ------------------------------------------------
// Global State
// ------------------------------------------------
__attribute__((weak)) IrrigationSettings settings;
__attribute__((weak)) Preferences preferences;

// ------------------------------------------------
// Core Functions
// ------------------------------------------------

/**
 * @brief Prints current configuration cleanly.
 */
inline void printConfiguration() {
    if (DEBUG_MODE) {
        Serial.println("\n===== SETTINGS =====");
        Serial.print("Target PH    : "); Serial.println(settings.targetPH);
        Serial.print("Target EC    : "); Serial.println(settings.targetEC);
        Serial.print("Soil Start   : "); Serial.println(settings.soilStartThreshold);
        Serial.print("Soil Stop    : "); Serial.println(settings.soilStopThreshold);
        Serial.print("Flush Time   : "); Serial.println(settings.flushDuration);
        Serial.print("Crop         : "); Serial.println(settings.cropName);
        Serial.print("Version      : "); Serial.println(settings.configVersion);
        Serial.println("====================\n");
    }
}

/**
 * @brief Validates settings against safety thresholds.
 */
inline bool validateConfiguration() {
    bool valid = true;
    if (settings.targetPH < 4.0 || settings.targetPH > 9.0) valid = false;
    if (settings.targetEC < 0.2 || settings.targetEC > 5.0) valid = false;
    if (settings.soilStartThreshold < 0 || settings.soilStartThreshold > 100) valid = false;
    if (settings.soilStopThreshold < 0 || settings.soilStopThreshold > 100) valid = false;
    if (settings.flushDuration < 1 || settings.flushDuration > 300) valid = false;
    return valid;
}

/**
 * @brief Saves current settings to ESP32 Preferences (NVS).
 */
inline void saveConfiguration() {
    if (!validateConfiguration()) {
        if (DEBUG_MODE) Serial.println("Warning: Invalid config, not saving to NVRAM.");
        return;
    }
    
    preferences.begin("fertigation", false);
    preferences.putFloat("targetPH", settings.targetPH);
    preferences.putFloat("targetEC", settings.targetEC);
    preferences.putFloat("soilStart", settings.soilStartThreshold);
    preferences.putFloat("soilStop", settings.soilStopThreshold);
    preferences.putFloat("fertDose", settings.fertilizerDose);
    preferences.putFloat("flushTime", settings.flushDuration);
    preferences.putBool("autoMode", settings.autoMode);
    
    // Convert char array to String for safe Preferences writing
    preferences.putString("cropName", String(settings.cropName));
    preferences.putUInt("configVersion", settings.configVersion);
    preferences.end();
    
    if (DEBUG_MODE) Serial.println("Configuration Saved successfully.");
}

/**
 * @brief Restores factory default settings.
 */
inline void restoreFactorySettings() {
    settings.targetPH = 6.50;
    settings.targetEC = 2.00;
    settings.soilStartThreshold = 40.0;
    settings.soilStopThreshold = 80.0;
    settings.fertilizerDose = 100.0;
    settings.flushDuration = 10.0;
    settings.autoMode = true;
    settings.irrigationEnabled = true;
    settings.fertigationEnabled = true;
    snprintf(settings.cropName, sizeof(settings.cropName), "Tomato");
    settings.configVersion = 1;
    
    saveConfiguration();
    
    if (DEBUG_MODE) Serial.println("Factory Settings Restored.");
    printConfiguration();
}

/**
 * @brief Loads settings from NVS, migrating or factory-resetting if needed.
 */
inline void loadConfiguration() {
    preferences.begin("fertigation", true); // Read-only mode
    
    if (!preferences.isKey("configVersion")) {
        preferences.end();
        if (DEBUG_MODE) Serial.println("No preferences found. Loading factory defaults.");
        restoreFactorySettings();
        return;
    }
    
    settings.targetPH = preferences.getFloat("targetPH", 6.50);
    settings.targetEC = preferences.getFloat("targetEC", 2.00);
    settings.soilStartThreshold = preferences.getFloat("soilStart", 40.0);
    settings.soilStopThreshold = preferences.getFloat("soilStop", 80.0);
    settings.fertilizerDose = preferences.getFloat("fertDose", 100.0);
    settings.flushDuration = preferences.getFloat("flushTime", 10.0);
    settings.autoMode = preferences.getBool("autoMode", true);
    
    String crop = preferences.getString("cropName", "Tomato");
    snprintf(settings.cropName, sizeof(settings.cropName), "%s", crop.c_str());
    settings.configVersion = preferences.getUInt("configVersion", 1);
    
    preferences.end();
    
    if (!validateConfiguration()) {
        if (DEBUG_MODE) Serial.println("Loaded config is invalid. Restoring defaults.");
        restoreFactorySettings();
    } else {
        if (DEBUG_MODE) Serial.println("Configuration Loaded Successfully.");
        printConfiguration();
    }
}

/**
 * @brief Initialize Configuration Manager.
 */
inline void setupConfiguration() {
    if (DEBUG_MODE) Serial.println("Initializing Configuration Manager...");
    loadConfiguration();
}

/**
 * @brief Updates configuration. Reserved for future cloud sync pulling.
 */
inline void updateConfiguration() {
    // Architecture hook for Cloud Synchronization API
}

#endif // CONFIGURATION_MANAGER_H
