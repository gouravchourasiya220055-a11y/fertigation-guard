/**
 * @file sensors.h
 * @brief Professional Sensor Manager for the ESP32 Node.
 * Handles reading, filtering, and calibrating environmental sensors.
 */
#ifndef SENSORS_H
#define SENSORS_H

#include <Arduino.h>

void setupSensors();
void updateSensors();

float readPH();
float readEC();
float readTDS();
float readSoilMoisture();

#endif // SENSORS_H
