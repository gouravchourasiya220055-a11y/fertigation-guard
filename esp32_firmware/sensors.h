#ifndef SENSORS_H
#define SENSORS_H

#include "config.h"
#include <Arduino.h>

float current_ph = 0.0;
float current_ec = 0.0;
float current_soil = 0.0;

void initSensors() {
  // ADC setup for ESP32
  analogReadResolution(12); // Resolution 0-4095
  
  // You might want to define analog attenuation if you expect voltages > 1V:
  // analogSetPinAttenuation(PIN_PH_SENSOR, ADC_11db); // Allows up to ~3.3V
  // analogSetPinAttenuation(PIN_EC_SENSOR, ADC_11db);
  // analogSetPinAttenuation(PIN_SOIL_SENSOR, ADC_11db);
}

void readSensors() {
  // Read raw analog values from 0-4095
  int rawPh = analogRead(PIN_PH_SENSOR);
  int rawEc = analogRead(PIN_EC_SENSOR);
  int rawSoil = analogRead(PIN_SOIL_SENSOR);

  // Mock calibration mapping for demonstration purposes.
  // In a real scenario, you map voltage to specific units via calibration equations based on your specific sensor models.
  current_ph = (rawPh / 4095.0) * 14.0;
  current_ec = (rawEc / 4095.0) * 5.0; // Assuming 0 to 5 mS/cm
  
  // Soil moisture: often 0 (dry in air) to 4095 (water) inverted to percentage
  // E.g., if fully dry is 4095 and fully wet is 0:
  // current_soil = 100.0 - ((rawSoil / 4095.0) * 100.0);
  
  // For standard scaling 0-100%:
  current_soil = (rawSoil / 4095.0) * 100.0;

  Serial.println("--- Sensor Readings ---");
  Serial.printf("pH: %.2f | EC: %.2f | Soil Moisture: %.2f%%\n", current_ph, current_ec, current_soil);
}

#endif // SENSORS_H
