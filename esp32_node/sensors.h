#ifndef SENSORS_H
#define SENSORS_H

#include <Arduino.h>
#include "config.h"

void setupSensors() {
    pinMode(PIN_PH_SENSOR, INPUT);
    pinMode(PIN_EC_SENSOR, INPUT);
    pinMode(PIN_SOIL_SENSOR, INPUT);
}

// In production, these should be calibrated with known values.
// Here we map standard 12-bit ADC (0-4095) to typical sensor ranges.

float readpH() {
    int raw = analogRead(PIN_PH_SENSOR);
    // Dummy linear map: 0-4095 to 0.0-14.0 pH
    return (raw / 4095.0) * 14.0;
}

float readEC() {
    int raw = analogRead(PIN_EC_SENSOR);
    // Dummy map: up to 5 mS/cm
    return (raw / 4095.0) * 5.0;
}

float readSoilMoisture() {
    int raw = analogRead(PIN_SOIL_SENSOR);
    // Inverse relationship: 4095 = 0% moisture (dry), 0 = 100% moisture (water)
    float moisture = (1.0 - (raw / 4095.0)) * 100.0;
    
    // Constrain to 0-100%
    if (moisture < 0) moisture = 0;
    if (moisture > 100) moisture = 100;
    
    return moisture;
}

#endif // SENSORS_H
