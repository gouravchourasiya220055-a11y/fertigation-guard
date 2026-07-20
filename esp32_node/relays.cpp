#include "relays.h"
#include "config.h"
#include "pins.h"

#define RELAY_ON  LOW
#define RELAY_OFF HIGH

const unsigned long MAX_PUMP_RUNTIME_MS = 10 * 60 * 1000UL;

struct RelayInternalState {
    bool isWaterPumpOn;
    bool isFertilizerPumpOn;
    bool isStirrerOn;
    bool isMainPumpOn;
    bool isBasePumpOn;
    bool isDrainValveOpen;
    bool emergencyMode;
    
    unsigned long waterPumpStartTime;
    unsigned long fertPumpStartTime;
    unsigned long mainPumpStartTime;
    unsigned long basePumpStartTime;
};

RelayInternalState internalRelayStatus = {
    false, false, false, false, false, false, false,
    0, 0, 0, 0
};

void driveRelay(int pin, bool turnOn, bool &currentState) {
    if (currentState == turnOn) return; 
    digitalWrite(pin, turnOn ? RELAY_ON : RELAY_OFF);
    currentState = turnOn;
}

void setupRelays() {
    digitalWrite(PIN_RELAY_WATER_PUMP, RELAY_OFF);
    digitalWrite(PIN_RELAY_FERT_PUMP, RELAY_OFF);
    digitalWrite(PIN_RELAY_STIRRER, RELAY_OFF);
    digitalWrite(PIN_RELAY_MAIN_PUMP, RELAY_OFF);
    digitalWrite(PIN_RELAY_BASE_PUMP, RELAY_OFF);
    digitalWrite(PIN_RELAY_DRAIN_VALVE, RELAY_OFF);

    pinMode(PIN_RELAY_WATER_PUMP, OUTPUT);
    pinMode(PIN_RELAY_FERT_PUMP, OUTPUT);
    pinMode(PIN_RELAY_STIRRER, OUTPUT);
    pinMode(PIN_RELAY_MAIN_PUMP, OUTPUT);
    pinMode(PIN_RELAY_BASE_PUMP, OUTPUT);
    pinMode(PIN_RELAY_DRAIN_VALVE, OUTPUT);
}

void startWaterPump() {
    if (internalRelayStatus.emergencyMode) return;
    driveRelay(PIN_RELAY_WATER_PUMP, true, internalRelayStatus.isWaterPumpOn);
    internalRelayStatus.waterPumpStartTime = millis();
}

void stopWaterPump() {
    driveRelay(PIN_RELAY_WATER_PUMP, false, internalRelayStatus.isWaterPumpOn);
}

void startFertilizerPump() {
    if (internalRelayStatus.emergencyMode) return;
    driveRelay(PIN_RELAY_FERT_PUMP, true, internalRelayStatus.isFertilizerPumpOn);
    internalRelayStatus.fertPumpStartTime = millis();
}

void stopFertilizerPump() {
    driveRelay(PIN_RELAY_FERT_PUMP, false, internalRelayStatus.isFertilizerPumpOn);
}

void startMainPump() {
    if (internalRelayStatus.emergencyMode) return;
    driveRelay(PIN_RELAY_MAIN_PUMP, true, internalRelayStatus.isMainPumpOn);
    internalRelayStatus.mainPumpStartTime = millis();
}

void stopMainPump() {
    driveRelay(PIN_RELAY_MAIN_PUMP, false, internalRelayStatus.isMainPumpOn);
}

void startStirrer() {
    if (internalRelayStatus.emergencyMode) return;
    driveRelay(PIN_RELAY_STIRRER, true, internalRelayStatus.isStirrerOn);
}

void stopStirrer() {
    driveRelay(PIN_RELAY_STIRRER, false, internalRelayStatus.isStirrerOn);
}

void startBasePump() {
    if (internalRelayStatus.emergencyMode) return;
    driveRelay(PIN_RELAY_BASE_PUMP, true, internalRelayStatus.isBasePumpOn);
    internalRelayStatus.basePumpStartTime = millis();
}

void stopBasePump() {
    driveRelay(PIN_RELAY_BASE_PUMP, false, internalRelayStatus.isBasePumpOn);
}

void openDrainValve() {
    if (internalRelayStatus.emergencyMode) return;
    driveRelay(PIN_RELAY_DRAIN_VALVE, true, internalRelayStatus.isDrainValveOpen);
}

void closeDrainValve() {
    driveRelay(PIN_RELAY_DRAIN_VALVE, false, internalRelayStatus.isDrainValveOpen);
}

void stopAllRelays() {
    stopWaterPump();
    stopFertilizerPump();
    stopMainPump();
    stopStirrer();
    stopBasePump();
    closeDrainValve();
}

void emergencyShutdown() {
    internalRelayStatus.emergencyMode = true;
    stopAllRelays();
}

void resetRelayEmergency() {
    internalRelayStatus.emergencyMode = false;
    stopAllRelays();
}

void checkRelayProtections() {
    unsigned long now = millis();
    
    if (internalRelayStatus.isWaterPumpOn && (now - internalRelayStatus.waterPumpStartTime > MAX_PUMP_RUNTIME_MS)) {
        stopWaterPump();
    }
    
    if (internalRelayStatus.isFertilizerPumpOn && (now - internalRelayStatus.fertPumpStartTime > MAX_PUMP_RUNTIME_MS)) {
        stopFertilizerPump();
    }
    
    if (internalRelayStatus.isMainPumpOn && (now - internalRelayStatus.mainPumpStartTime > MAX_PUMP_RUNTIME_MS)) {
        stopMainPump();
    }
    
    if (internalRelayStatus.isBasePumpOn && (now - internalRelayStatus.basePumpStartTime > MAX_PUMP_RUNTIME_MS)) {
        stopBasePump();
    }
}

void updateRelayManager() {
    checkRelayProtections();
}

RelayState getRelayStatus() {
    RelayState state;
    state.isWaterPumpOn = internalRelayStatus.isWaterPumpOn;
    state.isFertilizerPumpOn = internalRelayStatus.isFertilizerPumpOn;
    state.isStirrerOn = internalRelayStatus.isStirrerOn;
    state.isMainPumpOn = internalRelayStatus.isMainPumpOn;
    state.isBasePumpOn = internalRelayStatus.isBasePumpOn;
    state.isDrainValveOpen = internalRelayStatus.isDrainValveOpen;
    state.emergencyMode = internalRelayStatus.emergencyMode;
    return state;
}
