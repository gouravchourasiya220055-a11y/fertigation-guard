#ifndef FLOW_H
#define FLOW_H

#include <Arduino.h>

void setupFlowSensors();
void updateFlowSensors();
void resetFlowCounters();

float getMixedFlowRate();
float getWaterFlowRate();
float getFertilizerFlowRate();

float getTotalMixed();
float getTotalWater();
float getTotalFertilizer();

#endif // FLOW_H
