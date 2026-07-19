/**
 * @file flowsensor.h
 * @brief Flow sensor definitions, interrupts, and calculations.
 */

#ifndef FLOW_SENSORS_H
#define FLOW_SENSORS_H

#include <Arduino.h>

// ======================================================
// Flow Sensor Pins
// ======================================================

#define FLOW_SENSOR_WATER_PIN        33
#define FLOW_SENSOR_FERTILIZER_PIN   21

// ======================================================
// Calibration
// ======================================================

constexpr float WATER_FLOW_CALIBRATION_FACTOR = 7.5f;
constexpr float FERT_FLOW_CALIBRATION_FACTOR  = 7.5f;

// ======================================================
// Variables
// ======================================================

volatile uint32_t waterPulseCount = 0;
volatile uint32_t fertPulseCount = 0;

volatile uint32_t totalWaterPulses = 0;
volatile uint32_t totalFertPulses = 0;

unsigned long lastFlowCalcTime = 0;

float currentWaterFlowRate = 0.0f;
float currentFertFlowRate  = 0.0f;

// ======================================================
// Interrupt Service Routines
// ======================================================

void IRAM_ATTR waterPulseISR()
{
    waterPulseCount++;
    totalWaterPulses++;
}

void IRAM_ATTR fertPulseISR()
{
    fertPulseCount++;
    totalFertPulses++;
}

// ======================================================
// Setup
// ======================================================

inline void setupFlowSensors()
{
    pinMode(FLOW_SENSOR_WATER_PIN, INPUT_PULLUP);
    pinMode(FLOW_SENSOR_FERTILIZER_PIN, INPUT_PULLUP);

    attachInterrupt(FLOW_SENSOR_WATER_PIN, waterPulseISR, FALLING);
    attachInterrupt(FLOW_SENSOR_FERTILIZER_PIN, fertPulseISR, FALLING);

    lastFlowCalcTime = millis();
}

// ======================================================
// Update
// ======================================================

inline void updateFlowSensors()
{
    unsigned long currentTime = millis();

    if (currentTime - lastFlowCalcTime >= 1000)
    {
        noInterrupts();

        uint32_t waterPulses = waterPulseCount;
        uint32_t fertPulses  = fertPulseCount;

        waterPulseCount = 0;
        fertPulseCount = 0;

        interrupts();

        float seconds = (currentTime - lastFlowCalcTime) / 1000.0f;

        currentWaterFlowRate =
            (waterPulses / WATER_FLOW_CALIBRATION_FACTOR) / seconds;

        currentFertFlowRate =
            (fertPulses / FERT_FLOW_CALIBRATION_FACTOR) / seconds;

        lastFlowCalcTime = currentTime;
    }
}

// ======================================================
// Getters
// ======================================================

inline float getWaterFlowRate()
{
    return currentWaterFlowRate;
}

inline float getFertilizerFlowRate()
{
    return currentFertFlowRate;
}

inline float getTotalWater()
{
    return totalWaterPulses /
           (WATER_FLOW_CALIBRATION_FACTOR * 60.0f);
}

inline float getTotalFertilizer()
{
    return totalFertPulses /
           (FERT_FLOW_CALIBRATION_FACTOR * 60.0f);
}

// ======================================================
// Reset
// ======================================================

inline void resetFlowCounters()
{
    noInterrupts();

    waterPulseCount = 0;
    fertPulseCount = 0;

    totalWaterPulses = 0;
    totalFertPulses = 0;

    interrupts();

    currentWaterFlowRate = 0;
    currentFertFlowRate = 0;
}

#endif