/**
 * @file command_processor.h
 * @brief Professional Node Command Processor.
 * Listens for LoRa commands from the Gateway, validates them, and executes them cleanly.
 */
#ifndef COMMAND_PROCESSOR_H
#define COMMAND_PROCESSOR_H

#include <Arduino.h>
#include "config.h"
#include "lora_node.h"
#include "irrigation_controller.h"
#include "relays.h"
#include "config_manager.h"
#include "ota_manager.h"

// ------------------------------------------------
// State Tracking
// ------------------------------------------------
__attribute__((weak)) String lastExecutedCommand = "";
__attribute__((weak)) unsigned long lastCommandTime = 0;
#define DUPLICATE_WINDOW_MS 2000

// ------------------------------------------------
// Core Functions
// ------------------------------------------------

/**
 * @brief Initialize the Command Processor.
 */
inline void setupCommandProcessor() {
    if (DEBUG_MODE) Serial.println("Initializing Node Command Processor...");
    lastExecutedCommand.reserve(64);
}

/**
 * @brief Helper to securely print command execution logs.
 */
inline void printCommand(const String& rawPacket, const String& nodeID, const String& cmd, const String& param, const String& result) {
    if (DEBUG_MODE) {
        Serial.println("\n===== COMMAND RECEIVED =====");
        Serial.print("Raw Packet       : "); Serial.println(rawPacket);
        Serial.print("Node ID          : "); Serial.println(nodeID);
        Serial.print("Command          : "); Serial.println(cmd);
        if (param.length() > 0) {
            Serial.print("Parameter        : "); Serial.println(param);
        }
        Serial.print("Execution Result : "); Serial.println(result);
        
        // Output hardware state
        ControllerState cState = getControllerState();
        Serial.print("Controller State : "); Serial.println(cState);
        
        RelayState rState = getRelayStatus();
        Serial.print("Relay State      : ");
        Serial.print("W:"); Serial.print(rState.isWaterPumpOn);
        Serial.print(" F:"); Serial.print(rState.isFertilizerPumpOn);
        Serial.print(" H:"); Serial.print(rState.isHighPressurePumpOn);
        Serial.print(" S:"); Serial.print(rState.isStirrerOn);
        Serial.print(" V:"); Serial.print(rState.isFlushValveOn);
        Serial.print(" A:"); Serial.println(rState.isAlarmOn);
        Serial.println("============================\n");
    }
}

/**
 * @brief Map parsed commands to actual firmware functions securely.
 */
inline void executeCommand(const String& rawPacket, const String& nodeID, const String& cmd, const String& param) {
    String result = "Executed";
    
    if (cmd == "START_AUTO") startAutomaticCycle();
    else if (cmd == "STOP_AUTO") stopAutomaticCycle();
    else if (cmd == "START_MANUAL") startManualCycle();
    else if (cmd == "STOP_MANUAL") stopManualCycle();
    else if (cmd == "PUMP_ON") setWaterPump(true);
    else if (cmd == "PUMP_OFF") setWaterPump(false);
    else if (cmd == "FERT_ON") setFertilizerPump(true);
    else if (cmd == "FERT_OFF") setFertilizerPump(false);
    else if (cmd == "HIGH_PRESSURE_ON") setHighPressurePump(true);
    else if (cmd == "HIGH_PRESSURE_OFF") setHighPressurePump(false);
    else if (cmd == "STIRRER_ON") setStirrer(true);
    else if (cmd == "STIRRER_OFF") setStirrer(false);
    else if (cmd == "FLUSH_ON") setFlushValve(true);
    else if (cmd == "FLUSH_OFF") setFlushValve(false);
    else if (cmd == "ALARM_ON") setAlarm(true);
    else if (cmd == "ALARM_OFF") setAlarm(false);
    else if (cmd == "EMERGENCY_STOP") emergencyStop();
    else if (cmd == "RESET") {
        // Reset emergency mode and restore IDLE safely
        extern RelayState relayStatus; 
        relayStatus.emergencyMode = false;
        setAlarm(false);
        stopAllRelays();
        extern ControllerState currentState;
        currentState = IDLE;
        result = "Emergency Reset";
    }
    // Parameters
    else if (cmd == "SET_PH") {
        float val = param.toFloat();
        if (val > 0.0) {
            sysConfig.phMin = val;
            saveConfiguration();
            result = "Target pH updated";
        } else {
            result = "Invalid pH Parameter";
        }
    }
    else if (cmd == "SET_EC") {
        float val = param.toFloat();
        if (val > 0.0) {
            sysConfig.ecMin = val;
            saveConfiguration();
            result = "Target EC updated";
        } else {
            result = "Invalid EC Parameter";
        }
    }
    else if (cmd == "SET_SOIL_THRESHOLD") {
        float val = param.toFloat();
        if (val > 0.0) {
            sysConfig.soilStart = val;
            saveConfiguration();
            result = "Soil Threshold updated";
        } else {
            result = "Invalid Soil Parameter";
        }
    }
    // Future AI hooks gracefully pass through or reject
    else {
        result = "UNKNOWN COMMAND";
    }
    
    printCommand(rawPacket, nodeID, cmd, param, result);
}

/**
 * @brief Safely parses the compact payload (CMD:NODE01:CMD_NAME:PARAM)
 */
inline void parseCommand(const String& payload) {
    if (payload.length() == 0 || !payload.startsWith("CMD:")) return;
    
    // Duplicate Protection
    unsigned long now = millis();
    if (payload == lastExecutedCommand && (now - lastCommandTime < DUPLICATE_WINDOW_MS)) {
        return; // Ignore duplicate safely
    }
    
    // String splitting cleanly without dynamic arrays
    int firstColon = payload.indexOf(':');
    int secondColon = payload.indexOf(':', firstColon + 1);
    
    if (secondColon == -1) return; // Invalid format
    
    String nodeID = payload.substring(firstColon + 1, secondColon);
    
    // Validate target (Ignore other nodes securely)
    if (nodeID != String(DEVICE_ID)) return; 
    
    int thirdColon = payload.indexOf(':', secondColon + 1);
    
    String command;
    String param = "";
    
    if (thirdColon != -1) {
        command = payload.substring(secondColon + 1, thirdColon);
        param = payload.substring(thirdColon + 1);
    } else {
        command = payload.substring(secondColon + 1);
    }
    
    // Cache for duplicate protection
    lastExecutedCommand = payload;
    lastCommandTime = now;
    
    // Execute mapped command
    executeCommand(payload, nodeID, command, param);
}

/**
 * @brief Checks for incoming LoRa packets from the Gateway.
 */
inline void receiveCommand() {
    String packet = receiveLoRaPacket(); // From lora_node.h
    if (packet.length() > 0) {
        parseCommand(packet);
    }
}

/**
 * @brief Main non-blocking tick for the processor.
 */
inline void updateCommandProcessor() {
    receiveCommand();
}

#endif // COMMAND_PROCESSOR_H
