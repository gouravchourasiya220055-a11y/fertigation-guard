/**
 * @file wifi_manager.h
 * @brief Handles WiFi connectivity for the ESP32 Gateway.
 */
#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <WiFi.h>
#include "config.h"
#include "system_logger.h"

extern unsigned long lastWiFiCheck;
const unsigned long WIFI_CHECK_INTERVAL = 10000; // Check every 10 seconds

inline void setupWiFi() {
    String msg = "Connecting to ";
    msg += WIFI_SSID;
    logInfo("WiFi", msg.c_str());
    
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

inline void checkWiFi() {
    if (millis() - lastWiFiCheck >= WIFI_CHECK_INTERVAL) {
        lastWiFiCheck = millis();
        if (WiFi.status() != WL_CONNECTED) {
            logWarning("WiFi", "Disconnected\nAttempting reconnect");
            WiFi.disconnect();
            WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
        } else {
            // Uncomment if you want spam: logInfo("WiFi", "Connected");
        }
    }
}

#endif // WIFI_MANAGER_H
