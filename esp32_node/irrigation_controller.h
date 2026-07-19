/**
 * @file irrigation_controller.h
 * @brief Professional Irrigation Controller handling automated logic and states.
 */
#ifndef IRRIGATION_CONTROLLER_H
#define IRRIGATION_CONTROLLER_H

#include <Arduino.h>
#include "config.h"
#include "sensors.h"
#include "flow_sensors.h/flowsensor.h"
#include "relays.h"

// ------------------------------------------------
// Controller States & Modes
// ------------------------------------------------
enum ControllerState {
    IDLE,
    PREPARE,
    IRRIGATING,
    FERTIGATING,
    FLUSHING,
    COMPLETE,
    EMERGENCY
};

enum ControllerMode {
    MODE_MANUAL,
    MODE_AUTOMATIC,
    MODE_EMERGENCY,
    MODE_MAINTENANCE
};

#include "config_manager.h"

// ------------------------------------------------
// Global State Variables
// ------------------------------------------------
__attribute__((weak)) ControllerState currentState = IDLE;
__attribute__((weak)) ControllerMode currentMode   = MODE_MANUAL;
__attribute__((weak)) unsigned long stateStartTime = 0;

// ------------------------------------------------
// Helper Functions
// ------------------------------------------------
inline ControllerState getControllerState() {
    return currentState;
}

inline void changeState(ControllerState newState) {
    currentState = newState;
    stateStartTime = millis();
    if (DEBUG_MODE) {
        Serial.print("Controller State changed to: ");
        Serial.println(newState);
    }
}

inline void setMode(ControllerMode mode) {
    currentMode = mode;
    if (DEBUG_MODE) {
        Serial.print("Controller Mode changed to: ");
        Serial.println(mode);
    }
}

// ------------------------------------------------
// Public Control Functions
// ------------------------------------------------
inline void setupIrrigationController() {
    Serial.println("Initializing Irrigation Controller...");
    setupSensors();
    setupFlowSensors();
    setupRelays();
    
    changeState(IDLE);
    setMode(MODE_MANUAL);
}

inline void emergencyStop() {
    setMode(MODE_EMERGENCY);
    changeState(EMERGENCY);
    emergencyShutdown(); // Locks Relay Manager & Triggers Alarm
    Serial.println("EMERGENCY STOP ACTIVATED!");
}

inline void startAutomaticCycle() {
    if (currentMode == MODE_EMERGENCY) return; 
    setMode(MODE_AUTOMATIC);
    changeState(PREPARE);
}

inline void stopAutomaticCycle() {
    if (currentMode == MODE_EMERGENCY) return;
    setMode(MODE_MANUAL);
    stopAllRelays();
    changeState(IDLE);
}

inline void startManualCycle() {
    if (currentMode == MODE_EMERGENCY) return;
    setMode(MODE_MANUAL);
}

inline void stopManualCycle() {
    if (currentMode == MODE_EMERGENCY) return;
    stopAllRelays();
    changeState(IDLE);
}

// ------------------------------------------------
// State Machine Logic (Automatic)
// ------------------------------------------------
inline void handleAutomaticLogic() {
    float currentMoisture = readSoilMoisture();
    float currentEC = readEC();
    float currentPH = readPH();
    
    switch (currentState) {
        case IDLE:
            if (currentMoisture >= 0 && currentMoisture < sysConfig.soilStart) {
                changeState(PREPARE);
            }
            break;
            
        case PREPARE:
            // Placeholder: Prepare for pH correction if needed
            if (currentPH > 0 && (currentPH < sysConfig.phMin || currentPH > sysConfig.phMax)) {
                // TODO: Trigger pH correction pumps (pH UP / pH DOWN)
            }
            
            // Move immediately to irrigating once prepared
            changeState(IRRIGATING);
            break;
            
        case IRRIGATING:
            setWaterPump(true);
            setHighPressurePump(true);
            
            // Sub-logic: Check if fertigation is needed while irrigating
            if (currentEC >= 0 && currentEC < sysConfig.ecMin) {
                changeState(FERTIGATING);
            } else if (currentMoisture >= sysConfig.soilStop) {
                // Reached target moisture, stop pumping and prepare to flush
                setWaterPump(false);
                setHighPressurePump(false);
                changeState(FLUSHING);
            }
            break;
            
        case FERTIGATING:
            setWaterPump(true);
            setHighPressurePump(true);
            
            // Activate fertilizer logic
            setFertilizerPump(true);
            setStirrer(true); // Stirrer runs while fertilizer pump is active
            
            // Stop fertigating if target EC reached or moisture reached
            if (currentEC >= sysConfig.ecMax) {
                setFertilizerPump(false);
                setStirrer(false);
                changeState(IRRIGATING); // Go back to normal irrigation
            } else if (currentMoisture >= sysConfig.soilStop) {
                // Fully saturated, stop everything and flush
                setFertilizerPump(false);
                setStirrer(false);
                setWaterPump(false);
                setHighPressurePump(false);
                changeState(FLUSHING);
            }
            break;
            
        case FLUSHING:
            setFlushValve(true);
            
            // Flush for a strictly non-blocking duration using millis()
            if (millis() - stateStartTime >= 10000) { // Default flush to 10s if missing from struct
                setFlushValve(false);
                changeState(COMPLETE);
            }
            break;
            
        case COMPLETE:
            // Cycle finished, reset hardware accumulators and return to IDLE
            resetFlowCounters();
            setMode(MODE_MANUAL); // Optionally drop back to manual or stay in auto
            changeState(IDLE);
            break;
            
        case EMERGENCY:
            // The system is hard-locked. Await manual intervention/reboot.
            break;
    }
}

/**
 * @brief Master non-blocking update loop for the entire control architecture.
 */
inline void updateIrrigationController() {
    // 1. Service interrupt flags and safety timeouts
    updateFlowSensors();
    updateRelayManager();
    
    // 2. Execute mode-specific state machine
    if (currentMode == MODE_AUTOMATIC) {
        handleAutomaticLogic();
    }
}

#endif // IRRIGATION_CONTROLLER_H
