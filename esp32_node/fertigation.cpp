#include "fertigation.h"
#include "config.h"
#include "sensors.h"
#include "flow.h"
#include "relays.h"
#include "config_manager.h"

ControllerState currentState = IDLE;
ControllerMode currentMode   = MODE_MANUAL;
unsigned long stateStartTime = 0;

const float TARGET_WATER_LITERS = 10.0;
const float TARGET_FERT_LITERS = 2.0;
const float TARGET_IRRIGATE_LITERS = 10.0;
const unsigned long MIXING_TIME_MS = 10000;
const unsigned long DRAINING_TIME_MS = 10000;

void changeState(ControllerState newState) {
    currentState = newState;
    stateStartTime = millis();
    if (DEBUG_MODE) {
        Serial.print("Controller State changed to: ");
        Serial.println(newState);
    }
}

void setMode(ControllerMode mode) {
    currentMode = mode;
    if (DEBUG_MODE) {
        Serial.print("Controller Mode changed to: ");
        Serial.println(mode);
    }
}

ControllerState getControllerState() {
    return currentState;
}

void setupIrrigationController() {
    Serial.println("Initializing Fertigation Controller v2.1...");
    setupSensors();
    setupFlowSensors();
    setupRelays();
    
    changeState(IDLE);
    setMode(MODE_MANUAL);
}

void emergencyStop() {
    setMode(MODE_EMERGENCY);
    changeState(EMERGENCY);
    emergencyShutdown(); 
    Serial.println("EMERGENCY STOP ACTIVATED!");
}

void startAutomaticCycle() {
    if (currentMode == MODE_EMERGENCY) return; 
    setMode(MODE_AUTOMATIC);
    resetFlowCounters();
    changeState(FILLING_WATER);
}

void stopAutomaticCycle() {
    if (currentMode == MODE_EMERGENCY) return;
    setMode(MODE_MANUAL);
    stopAllRelays();
    changeState(IDLE);
}

void startManualCycle() {
    if (currentMode == MODE_EMERGENCY) return;
    setMode(MODE_MANUAL);
}

void stopManualCycle() {
    if (currentMode == MODE_EMERGENCY) return;
    stopAllRelays();
    changeState(IDLE);
}

void resetController() {
    resetRelayEmergency();
    changeState(IDLE);
}

void handleAutomaticLogic() {
    float ph = readPH();
    float tds = readTDS();
    
    switch (currentState) {
        case IDLE:
            break;
            
        case FILLING_WATER:
            startWaterPump();
            if (getTotalWater() >= TARGET_WATER_LITERS) {
                stopWaterPump();
                changeState(ADDING_FERTILIZER);
            }
            break;
            
        case ADDING_FERTILIZER:
            startFertilizerPump();
            if (getTotalFertilizer() >= TARGET_FERT_LITERS) {
                stopFertilizerPump();
                changeState(MIXING);
            }
            break;
            
        case MIXING:
            startStirrer();
            if (millis() - stateStartTime >= MIXING_TIME_MS) {
                stopStirrer();
                changeState(CORRECTING_PH_TDS);
            }
            break;
            
        case CORRECTING_PH_TDS:
            {
                static unsigned long correctionPulseStart = 0;
                static bool isPulsing = false;
                const unsigned long PULSE_DURATION_MS = 5000;
                const unsigned long WAIT_DURATION_MS = 10000;

                bool phOk = (ph >= sysConfig.phMin && ph <= sysConfig.phMax);
                bool tdsOk = (tds >= sysConfig.ecMin && tds <= sysConfig.ecMax);
                
                if (phOk && tdsOk) {
                    stopBasePump();
                    stopFertilizerPump();
                    stopWaterPump();
                    stopStirrer();
                    changeState(IRRIGATING);
                } else {
                    unsigned long now = millis();
                    if (!isPulsing && (now - stateStartTime > WAIT_DURATION_MS)) {
                        // Start a 5-second pulse
                        isPulsing = true;
                        correctionPulseStart = now;
                        startStirrer();
                        
                        if (ph < sysConfig.phMin || ph > sysConfig.phMax) startBasePump();
                        if (tds < sysConfig.ecMin) startFertilizerPump();
                        if (tds > sysConfig.ecMax) startWaterPump();
                        
                        if (DEBUG_MODE) Serial.println("Correction Pulse Started.");
                    } 
                    else if (isPulsing && (now - correctionPulseStart >= PULSE_DURATION_MS)) {
                        // Stop pulse, wait for sensors to stabilize
                        isPulsing = false;
                        stateStartTime = now; // Reset wait timer
                        stopBasePump();
                        stopFertilizerPump();
                        stopWaterPump();
                        stopStirrer(); // Optional: Stop stirrer or keep mixing. Let's stop to let it settle, or keep it on.
                        // Actually, keep stirrer on for better mixing
                        startStirrer();
                        
                        if (DEBUG_MODE) Serial.println("Correction Pulse Ended. Waiting for stabilization.");
                    }
                }
            }
            break;
            
        case IRRIGATING:
            stopStirrer();
            stopBasePump();
            stopFertilizerPump();
            stopWaterPump();
            
            startMainPump();
            if (getTotalMixed() >= TARGET_IRRIGATE_LITERS) {
                stopMainPump();
                changeState(DRAINING);
            }
            break;
            
        case DRAINING:
            openDrainValve();
            if (millis() - stateStartTime >= DRAINING_TIME_MS) {
                closeDrainValve();
                changeState(COMPLETE);
            }
            break;
            
        case COMPLETE:
            resetFlowCounters();
            setMode(MODE_MANUAL);
            changeState(IDLE);
            break;
            
        case EMERGENCY:
            break;
    }
}

void updateIrrigationController() {
    updateFlowSensors();
    updateRelayManager();
    
    if (currentMode == MODE_AUTOMATIC) {
        handleAutomaticLogic();
    }
}
