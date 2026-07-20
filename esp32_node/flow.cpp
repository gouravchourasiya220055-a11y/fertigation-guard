#include "flow.h"
#include "pins.h"

// Calibration factors (Pulses per Liter)
constexpr float WATER_FLOW_CALIBRATION_FACTOR = 7.5f;
constexpr float FERT_FLOW_CALIBRATION_FACTOR  = 7.5f;
constexpr float MIXED_FLOW_CALIBRATION_FACTOR = 7.5f;

// Pulse counters
volatile uint32_t waterPulseCount = 0;
volatile uint32_t fertPulseCount = 0;
volatile uint32_t mixedPulseCount = 0;

volatile uint32_t totalWaterPulses = 0;
volatile uint32_t totalFertPulses = 0;
volatile uint32_t totalMixedPulses = 0;

unsigned long lastFlowCalcTime = 0;

float currentWaterFlowRate = 0.0f;
float currentFertFlowRate  = 0.0f;
float currentMixedFlowRate = 0.0f;

// Interrupt Service Routines
void IRAM_ATTR waterPulseISR() {
    waterPulseCount++;
    totalWaterPulses++;
}

void IRAM_ATTR fertPulseISR() {
    fertPulseCount++;
    totalFertPulses++;
}

void IRAM_ATTR mixedPulseISR() {
    mixedPulseCount++;
    totalMixedPulses++;
}

void setupFlowSensors() {
    pinMode(PIN_FLOW_WATER, INPUT_PULLUP);
    pinMode(PIN_FLOW_FERTILIZER, INPUT_PULLUP);
    pinMode(PIN_FLOW_MIXED, INPUT_PULLUP);

    attachInterrupt(digitalPinToInterrupt(PIN_FLOW_WATER), waterPulseISR, FALLING);
    attachInterrupt(digitalPinToInterrupt(PIN_FLOW_FERTILIZER), fertPulseISR, FALLING);
    attachInterrupt(digitalPinToInterrupt(PIN_FLOW_MIXED), mixedPulseISR, FALLING);

    lastFlowCalcTime = millis();
}

void updateFlowSensors() {
    unsigned long currentTime = millis();

    if (currentTime - lastFlowCalcTime >= 1000) {
        noInterrupts();
        uint32_t waterPulses = waterPulseCount;
        uint32_t fertPulses  = fertPulseCount;
        uint32_t mixedPulses = mixedPulseCount;

        waterPulseCount = 0;
        fertPulseCount = 0;
        mixedPulseCount = 0;
        interrupts();

        float seconds = (currentTime - lastFlowCalcTime) / 1000.0f;

        currentWaterFlowRate = (waterPulses / WATER_FLOW_CALIBRATION_FACTOR) / seconds;
        currentFertFlowRate = (fertPulses / FERT_FLOW_CALIBRATION_FACTOR) / seconds;
        currentMixedFlowRate = (mixedPulses / MIXED_FLOW_CALIBRATION_FACTOR) / seconds;

        lastFlowCalcTime = currentTime;
    }
}

float getWaterFlowRate() { return currentWaterFlowRate; }
float getFertilizerFlowRate() { return currentFertFlowRate; }
float getMixedFlowRate() { return currentMixedFlowRate; }

float getTotalWater() {
    return totalWaterPulses / (WATER_FLOW_CALIBRATION_FACTOR * 60.0f);
}

float getTotalFertilizer() {
    return totalFertPulses / (FERT_FLOW_CALIBRATION_FACTOR * 60.0f);
}

float getTotalMixed() {
    return totalMixedPulses / (MIXED_FLOW_CALIBRATION_FACTOR * 60.0f);
}

void resetFlowCounters() {
    noInterrupts();
    waterPulseCount = 0;
    fertPulseCount = 0;
    mixedPulseCount = 0;
    
    totalWaterPulses = 0;
    totalFertPulses = 0;
    totalMixedPulses = 0;
    interrupts();

    currentWaterFlowRate = 0;
    currentFertFlowRate = 0;
    currentMixedFlowRate = 0;
}
