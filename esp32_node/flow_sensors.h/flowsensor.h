#ifndef FLOW_SENSORS_H
#define FLOW_SENSORS_H

#include <Arduino.h>

// Pins
#define FLOW_SENSOR_WATER_PIN       33
#define FLOW_SENSOR_FERTILIZER_PIN  21

// Pulses
extern volatile uint32_t waterPulseCount;
extern volatile uint32_t fertPulseCount;

// Values
extern float waterFlowRate;
extern float fertFlowRate;

void setupFlowSensors();
void updateFlowSensors();

float getWaterFlow();
float getFertilizerFlow();

#endif