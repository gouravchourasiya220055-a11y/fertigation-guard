#pragma once
#include <Arduino.h>

struct SensorReadings {
  float ph;
  float ec;       // mS/cm
  bool phValid;
  bool ecValid;
};

void sensorsInit();
SensorReadings sensorsRead();
void sensorsCalibratePh(float voltageAt7, float voltageAt4);
