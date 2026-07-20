#ifndef SENSORS_H
#define SENSORS_H

#include <Arduino.h>
#include "config.h"

// ======================================================
// FLOW SENSOR VARIABLES
// ======================================================

volatile unsigned long mixturePulseCount = 0;
volatile unsigned long waterPulseCount = 0;
volatile unsigned long fertilizerPulseCount = 0;

// ======================================================
// FLOW SENSOR INTERRUPTS
// ======================================================

void IRAM_ATTR mixtureFlowISR()
{
    mixturePulseCount++;
}

void IRAM_ATTR waterFlowISR()
{
    waterPulseCount++;
}

void IRAM_ATTR fertilizerFlowISR()
{
    fertilizerPulseCount++;
}

// ======================================================
// SENSOR SETUP
// ======================================================

void setupSensors()
{
    analogReadResolution(12);
    analogSetAttenuation(ADC_11db);

    pinMode(PIN_PH_SENSOR, INPUT);
    pinMode(PIN_EC_SENSOR, INPUT);
    pinMode(PIN_SOIL_SENSOR, INPUT);

    // Flow Sensors
    pinMode(PIN_FLOW_MIXTURE, INPUT_PULLUP);
    pinMode(PIN_FLOW_WATER, INPUT_PULLUP);
    pinMode(PIN_FLOW_FERTILIZER, INPUT_PULLUP);

    attachInterrupt(digitalPinToInterrupt(PIN_FLOW_MIXTURE), mixtureFlowISR, FALLING);
    attachInterrupt(digitalPinToInterrupt(PIN_FLOW_WATER), waterFlowISR, FALLING);
    attachInterrupt(digitalPinToInterrupt(PIN_FLOW_FERTILIZER), fertilizerFlowISR, FALLING);
}

// ======================================================
// ANALOG SENSORS
// ======================================================

float readpH()
{
    int raw = analogRead(PIN_PH_SENSOR);

    return (raw / 4095.0) * 14.0;
}

float readEC()
{
    int raw = analogRead(PIN_EC_SENSOR);

    return (raw / 4095.0) * 5.0;
}

float readSoilMoisture()
{
    int raw = analogRead(PIN_SOIL_SENSOR);

    float moisture = (1.0 - (raw / 4095.0)) * 100.0;

    moisture = constrain(moisture, 0, 100);

    return moisture;
}

// ======================================================
// FLOW SENSOR FUNCTIONS
// ======================================================

// Litres / Minute

float readMixtureFlow()
{
    noInterrupts();
    unsigned long pulses = mixturePulseCount;
    mixturePulseCount = 0;
    interrupts();

    return pulses / 7.5;
}

float readWaterFlow()
{
    noInterrupts();
    unsigned long pulses = waterPulseCount;
    waterPulseCount = 0;
    interrupts();

    return pulses / 7.5;
}

float readFertilizerFlow()
{
    noInterrupts();
    unsigned long pulses = fertilizerPulseCount;
    fertilizerPulseCount = 0;
    interrupts();

    return pulses / 7.5;
}

#endif