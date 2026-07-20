/**
 * @file cloud_sync_manager.h
 * @brief Professional Cloud Synchronization Manager.
 * Handles telemetry upload, command fetching, configuration sync, and heartbeats.
 */
#ifndef CLOUD_SYNC_MANAGER_H
#define CLOUD_SYNC_MANAGER_H

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "config.h"
#include "time.h"

// ------------------------------------------------
// Settings & Endpoints
// ------------------------------------------------
#define HEARTBEAT_INTERVAL_MS 60000
#define NTP_SYNC_INTERVAL_MS  (12 * 60 * 60 * 1000) // 12 hours
#define RETRY_INTERVAL_MS     10000 // 10 seconds
#define MAX_UPLOAD_RETRIES    5
#define MAX_OFFLINE_QUEUE     100

// ------------------------------------------------
// Data Structures
// ------------------------------------------------
struct TelemetryPacket {
    char payload[256];
    uint8_t retryCount;
    unsigned long lastAttemptMs;
    bool active;
};

// ------------------------------------------------
// Global State
// ------------------------------------------------
extern TelemetryPacket offlineQueue[MAX_OFFLINE_QUEUE];
extern int offlineQueueHead;
extern int offlineQueueTail;
extern int offlineQueueSize;

extern unsigned long lastHeartbeatMs;
extern unsigned long lastNtpSyncMs;
extern bool isNetworkOnline;

// NTP server
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 0;
const int   daylightOffset_sec = 0;

// ------------------------------------------------
// Forward Declarations
// ------------------------------------------------
inline void processOfflineQueue();

// ------------------------------------------------
// Core Helper Functions
// ------------------------------------------------
inline void checkNetworkRecovery() {
    bool currentStatus = (WiFi.status() == WL_CONNECTED);
    if (currentStatus && !isNetworkOnline) {
        logInfo("Network", "Recovered! Resuming synchronization.");
        isNetworkOnline = true;
    } else if (!currentStatus && isNetworkOnline) {
        logWarning("Network", "Lost! Buffering offline.");
        isNetworkOnline = false;
    }
}

inline void syncClock() {
    if (!isNetworkOnline) return;
    
    unsigned long now = millis();
    // Sync on boot or every 12 hours
    if (lastNtpSyncMs == 0 || (now - lastNtpSyncMs >= NTP_SYNC_INTERVAL_MS)) {
        configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
        
        struct tm timeinfo;
        if (getLocalTime(&timeinfo, 5000)) { // 5s timeout
            lastNtpSyncMs = now;
            logInfo("Clock", "Time Synchronized via NTP");
        } else {
            logWarning("Clock", "Failed to synchronize time");
        }
    }
}

inline void sendHeartbeat() {
    if (!isNetworkOnline) return;
    
    unsigned long now = millis();
    if (now - lastHeartbeatMs >= HEARTBEAT_INTERVAL_MS) {
        lastHeartbeatMs = now;
        
        String url = String(API_BASE_URL) + "/api/heartbeat";
        String payload = "{";
        payload += "\"gatewayId\":\"" + String(DEVICE_ID) + "\",";
        payload += "\"fwVersion\":\"1.0.0\",";
        payload += "\"wifiRssi\":" + String(WiFi.RSSI()) + ",";
        payload += "\"freeHeap\":" + String(ESP.getFreeHeap()) + ",";
        payload += "\"uptime\":" + String(millis());
        payload += "}";

        HTTPClient http;
        http.begin(url);
        http.addHeader("Content-Type", "application/json");
        int httpCode = http.POST(payload);
        
        if (httpCode > 0) {
            logInfo("Heartbeat", "Sent Successfully");
        } else {
            logWarning("Heartbeat", "Failed to send");
        }
        
        http.end();
    }
}

// ------------------------------------------------
// Telemetry Queue Management
// ------------------------------------------------
inline void queueTelemetry(const String& payload) {
    if (offlineQueueSize == MAX_OFFLINE_QUEUE) {
        logWarning("Queue", "Buffer full. Discarding oldest.");
        offlineQueue[offlineQueueHead].active = false;
        offlineQueueHead = (offlineQueueHead + 1) % MAX_OFFLINE_QUEUE;
        offlineQueueSize--;
    }
    
    strncpy(offlineQueue[offlineQueueTail].payload, payload.c_str(), sizeof(offlineQueue[offlineQueueTail].payload) - 1);
    offlineQueue[offlineQueueTail].payload[sizeof(offlineQueue[offlineQueueTail].payload) - 1] = '\0';
    offlineQueue[offlineQueueTail].retryCount = 0;
    offlineQueue[offlineQueueTail].lastAttemptMs = 0;
    offlineQueue[offlineQueueTail].active = true;
    
    offlineQueueTail = (offlineQueueTail + 1) % MAX_OFFLINE_QUEUE;
    offlineQueueSize++;
    
    logInfo("Queue", "Stored");
}

inline bool attemptUpload(const String& payload) {
    if (!isNetworkOnline) return false;
    
    HTTPClient http;
    String url = String(API_BASE_URL) + "/api/telemetry";
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    http.setTimeout(3000); // Prevent blocking indefinitely
    
    int httpCode = http.POST(payload);
    http.end();
    
    if (httpCode >= 200 && httpCode < 300) {
        return true;
    } else {
        return false;
    }
}

inline void uploadTelemetry(const String& payload) {
    if (attemptUpload(payload)) {
        logInfo("API", "Upload Success");
    } else {
        logError("API", "Upload Failed\nRetry");
        queueTelemetry(payload);
    }
}

inline void retryFailedUploads() {
    processOfflineQueue();
}

inline void processOfflineQueue() {
    if (offlineQueueSize == 0 || !isNetworkOnline) return;
    
    TelemetryPacket* packet = &offlineQueue[offlineQueueHead];
    if (!packet->active) return;
    
    unsigned long now = millis();
    
    // Auto Retry logic based on INTERVAL
    if (packet->retryCount == 0 || (now - packet->lastAttemptMs >= RETRY_INTERVAL_MS)) {
        if (attemptUpload(String(packet->payload))) {
            // Success, remove from queue
            packet->active = false;
            offlineQueueHead = (offlineQueueHead + 1) % MAX_OFFLINE_QUEUE;
            offlineQueueSize--;
            logInfo("Queue", "Uploaded");
        } else {
            // Failed, increment retries
            packet->retryCount++;
            packet->lastAttemptMs = now;
            
            if (packet->retryCount >= MAX_UPLOAD_RETRIES) {
                logWarning("Queue", "Max retries reached. Discarding.");
                packet->active = false;
                offlineQueueHead = (offlineQueueHead + 1) % MAX_OFFLINE_QUEUE;
                offlineQueueSize--;
            } else {
                logError("API", "Upload Failed\nRetry");
            }
        }
    }
}

// ------------------------------------------------
// Downloads
// ------------------------------------------------
inline void downloadCommands() {
    if (!isNetworkOnline) return;
    
    // Hook for fetching commands from /api/commands explicitly
    // This allows Future AI Integration where endpoints are strictly defined
    HTTPClient http;
    String url = String(API_BASE_URL) + "/api/commands";
    http.begin(url);
    http.setTimeout(3000);
    
    int httpCode = http.GET();
    if (httpCode == 200) {
        String payload = http.getString();
        // The payload could be passed to command_manager here.
    }
    http.end();
}

inline void downloadConfiguration() {
    if (!isNetworkOnline) return;
    
    // Future AI hook
    // HTTP GET /api/config
}

// ------------------------------------------------
// Lifecycle & Debug
// ------------------------------------------------
inline void printCloudStatus() {
    if (DEBUG_MODE) {
        Serial.println("\n========== CLOUD ==========");
        Serial.print("WiFi Status    : "); Serial.println(isNetworkOnline ? "ONLINE" : "OFFLINE");
        Serial.print("Cloud Status   : "); Serial.println(isNetworkOnline ? "CONNECTED" : "DISCONNECTED");
        Serial.print("Queued Packets : "); Serial.println(offlineQueueSize);
        Serial.println("===========================\n");
    }
}

inline void setupCloudSync() {
    if (DEBUG_MODE) Serial.println("Initializing Cloud Synchronization Manager...");
    offlineQueueHead = 0;
    offlineQueueTail = 0;
    offlineQueueSize = 0;
    
    checkNetworkRecovery();
    syncClock();
}

inline void updateCloudSync() {
    checkNetworkRecovery();
    
    syncClock();
    sendHeartbeat();
    processOfflineQueue();
    // downloadConfiguration() and downloadCommands() can be polled here based on timers if desired.
}

#endif // CLOUD_SYNC_MANAGER_H
