/**
 * @file config_manager.h
 * @brief Professional Configuration & Preferences Manager using ESP32 NVS.
 */
#ifndef CONFIG_MANAGER_H
#define CONFIG_MANAGER_H

#include <Arduino.h>
#include <Preferences.h>
#include <ArduinoJson.h>
#include "config.h"

// ------------------------------------------------
// Data Structures
// ------------------------------------------------
struct SystemConfig {
    float phMin;
    float phMax;
    float ecMin;
    float ecMax;
    float soilStart;
    float soilStop;
    unsigned long telemetryInterval;
    unsigned long loraInterval;
    float flowCalibration;
    float phCalibration;
    float ecCalibration;
    float tdsFactor;
    char deviceId[32];
    char nodeName[32];
    char wifiSsid[32];
    char wifiPassword[64];
    char backendUrl[128];
    bool aiModeEnabled;
    bool automaticMode;
    bool manualMode;
    uint32_t configVersion;
};

// ------------------------------------------------
// Global State
// ------------------------------------------------
__attribute__((weak)) SystemConfig sysConfig;
__attribute__((weak)) Preferences prefs;
__attribute__((weak)) Preferences backupPrefs;

// ------------------------------------------------
// Forward Declarations
// ------------------------------------------------
inline void saveConfiguration();

// ------------------------------------------------
// Core Functions
// ------------------------------------------------
inline void factoryReset() {
    if (DEBUG_MODE) Serial.println("Executing Factory Reset...");
    sysConfig.phMin = 5.5;
    sysConfig.phMax = 6.5;
    sysConfig.ecMin = 1.0;
    sysConfig.ecMax = 2.5;
    sysConfig.soilStart = 40.0;
    sysConfig.soilStop = 80.0;
    sysConfig.telemetryInterval = 10000;
    sysConfig.loraInterval = 10000;
    sysConfig.flowCalibration = 1.0;
    sysConfig.phCalibration = 0.0;
    sysConfig.ecCalibration = 1.0;
    sysConfig.tdsFactor = 0.5;
    snprintf(sysConfig.deviceId, sizeof(sysConfig.deviceId), "NODE01");
    snprintf(sysConfig.nodeName, sizeof(sysConfig.nodeName), "FertigationNode");
    snprintf(sysConfig.wifiSsid, sizeof(sysConfig.wifiSsid), "FarmWiFi");
    snprintf(sysConfig.wifiPassword, sizeof(sysConfig.wifiPassword), "password");
    snprintf(sysConfig.backendUrl, sizeof(sysConfig.backendUrl), "http://api.farm.local");
    sysConfig.aiModeEnabled = false;
    sysConfig.automaticMode = true;
    sysConfig.manualMode = false;
    sysConfig.configVersion = 2; // v2 Configuration format
}

inline void resetConfiguration() {
    factoryReset();
}

inline bool validateConfiguration() {
    bool valid = true;
    if (sysConfig.phMin < 0 || sysConfig.phMin > 14) valid = false;
    if (sysConfig.phMax < 0 || sysConfig.phMax > 14) valid = false;
    if (sysConfig.ecMin < 0 || sysConfig.ecMin > 10) valid = false;
    if (sysConfig.ecMax < 0 || sysConfig.ecMax > 10) valid = false;
    if (sysConfig.soilStart < 0 || sysConfig.soilStart > 100) valid = false;
    if (sysConfig.soilStop < 0 || sysConfig.soilStop > 100) valid = false;
    if (sysConfig.telemetryInterval < 500 || sysConfig.telemetryInterval > 60000) valid = false;
    if (sysConfig.loraInterval < 500 || sysConfig.loraInterval > 60000) valid = false;
    if (strlen(sysConfig.deviceId) == 0) valid = false;
    if (strlen(sysConfig.backendUrl) == 0) valid = false;
    return valid;
}

inline void saveToPrefs(Preferences& p) {
    p.putFloat("phMin", sysConfig.phMin);
    p.putFloat("phMax", sysConfig.phMax);
    p.putFloat("ecMin", sysConfig.ecMin);
    p.putFloat("ecMax", sysConfig.ecMax);
    p.putFloat("soilStart", sysConfig.soilStart);
    p.putFloat("soilStop", sysConfig.soilStop);
    p.putUInt("telInt", sysConfig.telemetryInterval);
    p.putUInt("loraInt", sysConfig.loraInterval);
    p.putFloat("flowCal", sysConfig.flowCalibration);
    p.putFloat("phCal", sysConfig.phCalibration);
    p.putFloat("ecCal", sysConfig.ecCalibration);
    p.putFloat("tdsFactor", sysConfig.tdsFactor);
    p.putString("devId", String(sysConfig.deviceId));
    p.putString("nodeName", String(sysConfig.nodeName));
    p.putString("wifiSsid", String(sysConfig.wifiSsid));
    p.putString("wifiPass", String(sysConfig.wifiPassword));
    p.putString("backend", String(sysConfig.backendUrl));
    p.putBool("aiMode", sysConfig.aiModeEnabled);
    p.putBool("autoMode", sysConfig.automaticMode);
    p.putBool("manMode", sysConfig.manualMode);
    p.putUInt("cfgVer", sysConfig.configVersion);
}

inline void loadFromPrefs(Preferences& p) {
    sysConfig.phMin = p.getFloat("phMin", 5.5);
    sysConfig.phMax = p.getFloat("phMax", 6.5);
    sysConfig.ecMin = p.getFloat("ecMin", 1.0);
    sysConfig.ecMax = p.getFloat("ecMax", 2.5);
    sysConfig.soilStart = p.getFloat("soilStart", 40.0);
    sysConfig.soilStop = p.getFloat("soilStop", 80.0);
    sysConfig.telemetryInterval = p.getUInt("telInt", 10000);
    sysConfig.loraInterval = p.getUInt("loraInt", 10000);
    sysConfig.flowCalibration = p.getFloat("flowCal", 1.0);
    sysConfig.phCalibration = p.getFloat("phCal", 0.0);
    sysConfig.ecCalibration = p.getFloat("ecCal", 1.0);
    sysConfig.tdsFactor = p.getFloat("tdsFactor", 0.5);
    
    String str;
    str = p.getString("devId", "NODE01"); snprintf(sysConfig.deviceId, sizeof(sysConfig.deviceId), "%s", str.c_str());
    str = p.getString("nodeName", "FertigationNode"); snprintf(sysConfig.nodeName, sizeof(sysConfig.nodeName), "%s", str.c_str());
    str = p.getString("wifiSsid", "FarmWiFi"); snprintf(sysConfig.wifiSsid, sizeof(sysConfig.wifiSsid), "%s", str.c_str());
    str = p.getString("wifiPass", "password"); snprintf(sysConfig.wifiPassword, sizeof(sysConfig.wifiPassword), "%s", str.c_str());
    str = p.getString("backend", "http://api.farm.local"); snprintf(sysConfig.backendUrl, sizeof(sysConfig.backendUrl), "%s", str.c_str());
    
    sysConfig.aiModeEnabled = p.getBool("aiMode", false);
    sysConfig.automaticMode = p.getBool("autoMode", true);
    sysConfig.manualMode = p.getBool("manMode", false);
    sysConfig.configVersion = p.getUInt("cfgVer", 2);
}

inline void saveConfiguration() {
    if (!validateConfiguration()) {
        if (DEBUG_MODE) Serial.println("Invalid configuration. Save aborted to prevent corruption.");
        return;
    }
    prefs.begin("fertigation", false);
    saveToPrefs(prefs);
    prefs.end();
    if (DEBUG_MODE) Serial.println("Configuration Saved.");
}

inline void backupConfiguration() {
    backupPrefs.begin("fert_backup", false);
    saveToPrefs(backupPrefs);
    backupPrefs.end();
    if (DEBUG_MODE) Serial.println("Configuration Backed Up.");
}

inline void restoreConfiguration() {
    backupPrefs.begin("fert_backup", true);
    if (backupPrefs.isKey("cfgVer")) {
        loadFromPrefs(backupPrefs);
        if (DEBUG_MODE) Serial.println("Configuration Restored from Backup.");
        saveConfiguration(); // Write restored config back to main namespace
    } else {
        if (DEBUG_MODE) Serial.println("No Backup Found!");
    }
    backupPrefs.end();
}

inline bool configurationExists() {
    prefs.begin("fertigation", true);
    bool exists = prefs.isKey("cfgVer");
    prefs.end();
    return exists;
}

inline void loadConfiguration() {
    if (DEBUG_MODE) Serial.println("Loading Configuration...");
    if (!configurationExists()) {
        factoryReset();
        saveConfiguration();
        backupConfiguration();
    } else {
        prefs.begin("fertigation", true);
        loadFromPrefs(prefs);
        prefs.end();
        
        if (!validateConfiguration()) {
            if (DEBUG_MODE) Serial.println("Corrupted config detected. Restoring defaults.");
            factoryReset();
            saveConfiguration();
        } else {
            // Version migration
            if (sysConfig.configVersion < 2) {
                sysConfig.configVersion = 2;
                saveConfiguration();
                backupConfiguration();
            }
            if (DEBUG_MODE) Serial.println("Configuration Loaded.");
        }
    }
}

inline void printConfiguration() {
    if (!DEBUG_MODE) return;
    Serial.println("\n========== CONFIGURATION ==========");
    Serial.print("Device ID : "); Serial.println(sysConfig.deviceId);
    Serial.print("pH Min/Max: "); Serial.print(sysConfig.phMin); Serial.print(" / "); Serial.println(sysConfig.phMax);
    Serial.print("EC Min/Max: "); Serial.print(sysConfig.ecMin); Serial.print(" / "); Serial.println(sysConfig.ecMax);
    Serial.print("Soil Thres: "); Serial.print(sysConfig.soilStart); Serial.print(" / "); Serial.println(sysConfig.soilStop);
    Serial.print("Telemetry : "); Serial.println(sysConfig.telemetryInterval);
    Serial.print("AI Mode   : "); Serial.println(sysConfig.aiModeEnabled ? "YES" : "NO");
    Serial.print("Version   : "); Serial.println(sysConfig.configVersion);
    Serial.println("Preferences Used: ESP32 NVS (Namespace 'fertigation')");
    Serial.println("===================================\n");
}

inline SystemConfig getConfiguration() {
    return sysConfig;
}

inline void setupConfigManager() {
    loadConfiguration();
    printConfiguration();
}

// ------------------------------------------------
// JSON Data Exchange
// ------------------------------------------------
inline void exportConfiguration(char* buffer, size_t size) {
    snprintf(buffer, size,
        "{\"id\":\"%s\",\"phMin\":%.1f,\"phMax\":%.1f,\"ecMin\":%.1f,\"ecMax\":%.1f,\"soilStart\":%.1f,\"soilStop\":%.1f,\"telemetry\":%lu}",
        sysConfig.deviceId, sysConfig.phMin, sysConfig.phMax, sysConfig.ecMin, sysConfig.ecMax, sysConfig.soilStart, sysConfig.soilStop, sysConfig.telemetryInterval);
}

inline void importConfiguration(const String& jsonStr) {
#if ARDUINOJSON_VERSION_MAJOR == 6
    StaticJsonDocument<512> doc;
    DeserializationError err = deserializeJson(doc, jsonStr);
#else
    JsonDocument doc; // v7 fallback
    DeserializationError err = deserializeJson(doc, jsonStr);
#endif
    
    if (!err) {
        if (doc.containsKey("id")) snprintf(sysConfig.deviceId, sizeof(sysConfig.deviceId), "%s", doc["id"].as<const char*>());
        if (doc.containsKey("phMin")) sysConfig.phMin = doc["phMin"].as<float>();
        if (doc.containsKey("phMax")) sysConfig.phMax = doc["phMax"].as<float>();
        if (doc.containsKey("ecMin")) sysConfig.ecMin = doc["ecMin"].as<float>();
        if (doc.containsKey("ecMax")) sysConfig.ecMax = doc["ecMax"].as<float>();
        if (doc.containsKey("soilStart")) sysConfig.soilStart = doc["soilStart"].as<float>();
        if (doc.containsKey("soilStop")) sysConfig.soilStop = doc["soilStop"].as<float>();
        if (doc.containsKey("telemetry")) sysConfig.telemetryInterval = doc["telemetry"].as<unsigned long>();
        
        saveConfiguration();
    } else {
        if (DEBUG_MODE) Serial.println("Failed to parse JSON configuration.");
    }
}

inline void updateConfiguration() {
    // Non-blocking tick for real-time config patching (e.g. over Serial or secondary bus)
}

#endif // CONFIG_MANAGER_H
