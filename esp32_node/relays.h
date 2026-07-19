/**
 * @file relays.h
 * @brief Professional Relay Manager for the ESP32 Node.
 * Handles safe switching, active LOW logic, timeouts, and emergency shutdowns.
 */
#ifndef RELAYS_H
#define RELAYS_H

#include <Arduino.h>
#include "config.h"

// Active LOW logic macros for opto-isolated relay modules
#define RELAY_ON  LOW
#define RELAY_OFF HIGH

// Timeout constants (10 minutes max run time to prevent flooding)
const unsigned long MAX_PUMP_RUNTIME_MS = 10 * 60 * 1000UL;

// -----------------------------------------
// Relay Status
// -----------------------------------------
struct RelayState {
    bool isWaterPumpOn;
    bool isFertilizerPumpOn;
    bool isHighPressurePumpOn;
    bool isStirrerOn;
    bool isFlushValveOn;
    bool isAlarmOn;
    
    // Protection tracking
    unsigned long waterPumpStartTime;
    unsigned long fertPumpStartTime;
    unsigned long highPressStartTime;
    bool emergencyMode;
};

// Use weak attribute to avoid multiple definition errors
__attribute__((weak)) RelayState relayStatus = {false, false, false, false, false, false, 0, 0, 0, false};

// -----------------------------------------
// Relay Driver
// -----------------------------------------
/**
 * @brief Low-level driver to physically switch a relay and cache its state.
 * @note Prevents writing to GPIO if the state hasn't changed.
 */
inline void driveRelay(int pin, bool turnOn, bool &currentState) {
    if (currentState == turnOn) return; // Prevent duplicate GPIO writes
    
    digitalWrite(pin, turnOn ? RELAY_ON : RELAY_OFF);
    currentState = turnOn;
}

// -----------------------------------------
// Utility Functions
// -----------------------------------------

/**
 * @brief Helper functions to individually toggle relays.
 * Respects emergency lockdown state to prevent accidental activations.
 */

inline void setWaterPump(bool state) {
    if (relayStatus.emergencyMode && state) return;
    driveRelay(PIN_WATER_PUMP, state, relayStatus.isWaterPumpOn);
    if (state) relayStatus.waterPumpStartTime = millis();
}

inline void setFertilizerPump(bool state) {
    if (relayStatus.emergencyMode && state) return;
    driveRelay(PIN_FERTILIZER, state, relayStatus.isFertilizerPumpOn);
    if (state) relayStatus.fertPumpStartTime = millis();
}

inline void setHighPressurePump(bool state) {
    if (relayStatus.emergencyMode && state) return;
    driveRelay(PIN_HIGH_PRESS, state, relayStatus.isHighPressurePumpOn);
    if (state) relayStatus.highPressStartTime = millis();
}

inline void setStirrer(bool state) {
    if (relayStatus.emergencyMode && state) return;
    driveRelay(PIN_STIRRER, state, relayStatus.isStirrerOn);
}

inline void setFlushValve(bool state) {
    if (relayStatus.emergencyMode && state) return;
    driveRelay(PIN_FLUSH_VALVE, state, relayStatus.isFlushValveOn);
}

inline void setAlarm(bool state) {
    driveRelay(PIN_ALARM, state, relayStatus.isAlarmOn);
}

/**
 * @brief Turns off all standard operational relays (ignores Alarm).
 */
inline void stopAllRelays() {
    setWaterPump(false);
    setFertilizerPump(false);
    setHighPressurePump(false);
    setStirrer(false);
    setFlushValve(false);
}

/**
 * @brief Returns a copy of the current system relay state.
 */
inline RelayState getRelayStatus() {
    return relayStatus;
}

// -----------------------------------------
// Relay Protection
// -----------------------------------------
/**
 * @brief Evaluates hardware safety conditions (timeouts, dry run, overload).
 * Must be called repeatedly in the main loop via updateRelayManager().
 */
inline void checkRelayProtections() {
    unsigned long now = millis();
    
    // Timeout Protection: Force shut off pumps if they run too long
    if (relayStatus.isWaterPumpOn && (now - relayStatus.waterPumpStartTime > MAX_PUMP_RUNTIME_MS)) {
        setWaterPump(false);
        setAlarm(true);
    }
    
    if (relayStatus.isFertilizerPumpOn && (now - relayStatus.fertPumpStartTime > MAX_PUMP_RUNTIME_MS)) {
        setFertilizerPump(false);
        setAlarm(true);
    }
    
    if (relayStatus.isHighPressurePumpOn && (now - relayStatus.highPressStartTime > MAX_PUMP_RUNTIME_MS)) {
        setHighPressurePump(false);
        setAlarm(true);
    }

    // [Future Support] Dry-Run Protection Placeholder
    // Reads from Flow Sensors to ensure fluid is actually moving when a pump is on.
    // if (getWaterFlowRate() == 0 && relayStatus.isWaterPumpOn && (now - relayStatus.waterPumpStartTime > 5000)) { emergencyShutdown(); }

    // [Future Support] Overload Protection Placeholder 
    // Reads from ACS712 current sensors to detect locked rotors.
    // if (getCurrentDraw(PIN_WATER_PUMP) > 10.0 /*Amps*/) { emergencyShutdown(); }
}

// -----------------------------------------
// Emergency Control
// -----------------------------------------
/**
 * @brief Instantly kills all active operations, locks the system, and triggers the alarm.
 */
inline void emergencyShutdown() {
    relayStatus.emergencyMode = true; // Lock out future ON commands
    stopAllRelays();
    setAlarm(true);
}

// -----------------------------------------
// Relay Initialization
// -----------------------------------------
/**
 * @brief Configures GPIOs safely. Sets pins to OFF before switching to OUTPUT mode.
 */
inline void setupRelays() {
    // Write OFF state before setting to OUTPUT to prevent glitches during boot
    digitalWrite(PIN_WATER_PUMP, RELAY_OFF);
    digitalWrite(PIN_FERTILIZER, RELAY_OFF);
    digitalWrite(PIN_HIGH_PRESS, RELAY_OFF);
    digitalWrite(PIN_STIRRER, RELAY_OFF);
    digitalWrite(PIN_FLUSH_VALVE, RELAY_OFF);
    digitalWrite(PIN_ALARM, RELAY_OFF);

    pinMode(PIN_WATER_PUMP, OUTPUT);
    pinMode(PIN_FERTILIZER, OUTPUT);
    pinMode(PIN_HIGH_PRESS, OUTPUT);
    pinMode(PIN_STIRRER, OUTPUT);
    pinMode(PIN_FLUSH_VALVE, OUTPUT);
    pinMode(PIN_ALARM, OUTPUT);
}

/**
 * @brief Main logic tick for relays.
 */
inline void updateRelayManager() {
    checkRelayProtections();
}

#endif // RELAYS_H
