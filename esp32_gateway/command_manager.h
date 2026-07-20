/**
 * @file command_manager.h
 * @brief Professional Gateway Command Manager.
 * Fetches commands from backend API and forwards them to ESP32 Nodes via LoRa.
 */
#ifndef COMMAND_MANAGER_H
#define COMMAND_MANAGER_H

#include <Arduino.h>
#include <ArduinoJson.h>
#include "config.h"
#include "lora_gateway.h"
#include "api_client.h"

// ------------------------------------------------
// Configuration
// ------------------------------------------------
#define MAX_QUEUE_SIZE 20
#define COMMAND_TIMEOUT_MS 10000
#define MAX_RETRIES 3
#define RETRY_INTERVAL_MS 500
#define DUPLICATE_IGNORE_WINDOW_MS 2000
#define FETCH_INTERVAL_MS 5000 // Poll API every 5 seconds

// ------------------------------------------------
// Structures
// ------------------------------------------------
struct GatewayCommand {
    String target;
    String command;
    unsigned long queuedTime;
    uint8_t retryCount;
    unsigned long lastRetryTime;
    bool active;
};

// ------------------------------------------------
// Global State
// ------------------------------------------------
extern GatewayCommand commandQueue[MAX_QUEUE_SIZE];
extern int cmdQueueHead;
extern int cmdQueueTail;
extern int cmdQueueSize;

extern String lastCommandString;
extern unsigned long lastCommandTime;
extern unsigned long lastFetchTime;

// ------------------------------------------------
// Queue Operations
// ------------------------------------------------
inline void pushCommand(const String& target, const String& cmd) {
    if (cmdQueueSize == MAX_QUEUE_SIZE) {
        // Discard oldest by advancing head
        commandQueue[cmdQueueHead].active = false;
        cmdQueueHead = (cmdQueueHead + 1) % MAX_QUEUE_SIZE;
        cmdQueueSize--;
        logWarning("Command", "Queue full. Discarding oldest.");
    }
    
    commandQueue[cmdQueueTail].target = target;
    commandQueue[cmdQueueTail].command = cmd;
    commandQueue[cmdQueueTail].queuedTime = millis();
    commandQueue[cmdQueueTail].retryCount = 0;
    commandQueue[cmdQueueTail].lastRetryTime = 0;
    commandQueue[cmdQueueTail].active = true;
    
    cmdQueueTail = (cmdQueueTail + 1) % MAX_QUEUE_SIZE;
    cmdQueueSize++;
}

inline GatewayCommand* peekCommand() {
    if (cmdQueueSize == 0) return nullptr;
    return &commandQueue[cmdQueueHead];
}

inline void popCommand() {
    if (cmdQueueSize == 0) return;
    commandQueue[cmdQueueHead].active = false;
    cmdQueueHead = (cmdQueueHead + 1) % MAX_QUEUE_SIZE;
    cmdQueueSize--;
}

// ------------------------------------------------
// Core Functions
// ------------------------------------------------

/**
 * @brief Initializes the Command Manager.
 */
inline void setupCommandManager() {
    if (DEBUG_MODE) Serial.println("Initializing Command Manager...");
    cmdQueueHead = 0;
    cmdQueueTail = 0;
    cmdQueueSize = 0;
    lastFetchTime = millis();
    
    // Prevent memory fragmentation for duplicate checking
    lastCommandString.reserve(64); 
}

/**
 * @brief Prints command state to Serial for debugging.
 */
inline void printCommand(const GatewayCommand* cmd, const String& status) {
    if (DEBUG_MODE && cmd != nullptr) {
        String msg = status + " -> " + cmd->target + " : " + cmd->command;
        logInfo("Command", msg.c_str());
    }
}

/**
 * @brief Parses JSON payload and queues the command.
 */
inline void parseCommand(const String& jsonPayload) {
    if (jsonPayload.length() == 0) return;
    
    StaticJsonDocument<256> doc;
    DeserializationError error = deserializeJson(doc, jsonPayload);
    
    if (error) {
        logWarning("Command", "API returned invalid JSON");
        return;
    }
    
    if (!doc.containsKey("target") || !doc.containsKey("command")) {
        logWarning("Command", "JSON missing keys");
        return;
    }
    
    String target = doc["target"].as<String>();
    String cmd = doc["command"].as<String>();
    
    // Duplicate Protection (Ignore identical commands within 2 seconds)
    String cmdSignature = target + ":" + cmd;
    unsigned long now = millis();
    if (cmdSignature == lastCommandString && (now - lastCommandTime < DUPLICATE_IGNORE_WINDOW_MS)) {
        return;
    }
    
    lastCommandString = cmdSignature;
    lastCommandTime = now;
    
    pushCommand(target, cmd);
    
    String msg = "Queued: " + cmd + " for " + target;
    logInfo("Command", msg.c_str());
}

/**
 * @brief Periodically fetches commands from the backend using the API Client.
 */
inline void fetchCommands() {
    unsigned long now = millis();
    // Non-blocking fetch
    if (now - lastFetchTime >= FETCH_INTERVAL_MS) {
        lastFetchTime = now;
        
        // Use existing API Client to fetch commands (HTTP GET)
        String payload = fetchRelayCommands(); 
        parseCommand(payload);
    }
}

/**
 * @brief Formats and dispatches a command over the LoRa network.
 */
inline void sendCommand(GatewayCommand* cmd) {
    // Compact multi-node format: CMD:NODE01:PUMP_ON
    String loraPacket = "CMD:" + cmd->target + ":" + cmd->command;
    
    sendPacket(loraPacket);
    
    cmd->lastRetryTime = millis();
    cmd->retryCount++;
    
    printCommand(cmd, "Sent via LoRa");
}

/**
 * @brief Manages the FIFO queue, timing out old commands and handling retries.
 */
inline void processQueue() {
    if (cmdQueueSize == 0) return;
    
    GatewayCommand* cmd = peekCommand();
    if (!cmd || !cmd->active) return;
    
    unsigned long now = millis();
    
    // Timeout Protection (Discard if stuck in queue for > 10 seconds)
    if (now - cmd->queuedTime > COMMAND_TIMEOUT_MS) {
        if (DEBUG_MODE) Serial.println("Warning: Command timed out. Discarding.");
        popCommand();
        return;
    }
    
    // Retry Logic (Blind transmission with 500ms spacing)
    if (cmd->retryCount == 0 || (now - cmd->lastRetryTime >= RETRY_INTERVAL_MS)) {
        
        sendCommand(cmd);
        
        // Once the maximum blind retries are reached, remove it from the queue
        if (cmd->retryCount >= MAX_RETRIES) {
            popCommand();
        }
    }
}

/**
 * @brief Master non-blocking update loop.
 */
inline void updateCommandManager() {
    fetchCommands();
    processQueue();
}

#endif // COMMAND_MANAGER_H
