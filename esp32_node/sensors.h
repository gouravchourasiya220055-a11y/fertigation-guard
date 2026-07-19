/**
 * @file sensors.h
 * @brief Professional Sensor Manager for the ESP32 Node.
 * Handles reading, filtering, and calibrating environmental sensors.
 */
#ifndef SENSORS_H
#define SENSORS_H

#include <Arduino.h>
#include "config.h"

// ------------------------------------------------
// Calibration Constants
// ------------------------------------------------
// pH Sensor Calibration
const float PH_NEUTRAL_VOLTAGE = 1.50; // Voltage at pH 7.0
const float PH_ACID_VOLTAGE    = 2.00; // Voltage at pH 4.0
const float PH_SLOPE           = (7.0 - 4.0) / (PH_NEUTRAL_VOLTAGE - PH_ACID_VOLTAGE);

// EC Sensor Calibration
const float EC_K_FACTOR = 1.0; // Cell constant

// TDS Calculation
const float TDS_FACTOR = 0.5; // Commonly 0.5 for NaCl, 0.64 for standard hydroponics

// Filter settings
const int NUM_SAMPLES = 10;

// ------------------------------------------------
// Helper / Validation Functions
// ------------------------------------------------

/**
 * @brief Reads an analog pin with a moving average filter.
 * @param pin The analog GPIO pin to read.
 * @return The averaged analog value (0-4095). Returns -1 if invalid.
 */
inline float getAveragedADC(int pin) {
    long sum = 0;
    int validSamples = 0;
    
    for (int i = 0; i < NUM_SAMPLES; i++) {
        int val = analogRead(pin);
        // Ignore dead values (0) or completely pegged values (4095) which indicate bad wiring
        if (val > 0 && val < 4095) {
            sum += val;
            validSamples++;
        }
        delay(2); // Short delay to let ADC stabilize
    }
    
    if (validSamples == 0) return -1; // Indicate a read error
    
    return (float)sum / validSamples;
}

/**
 * @brief Converts an ESP32 ADC reading to voltage (assuming 3.3V reference and 11dB attenuation).
 */
inline float adcToVoltage(float adcVal) {
    if (adcVal < 0) return -1;
    return (adcVal / 4095.0) * 3.3;
}

// ------------------------------------------------
// Sensor Initialization
// ------------------------------------------------

/**
 * @brief Initializes the ADC hardware and configures sensor pins.
 */
inline void setupSensors() {
    // ESP32 ADC Configuration for full 0-3.3V range
    analogReadResolution(12);
    analogSetAttenuation(ADC_11db);

    pinMode(PIN_PH_SENSOR, INPUT);
    pinMode(PIN_EC_SENSOR, INPUT);
    pinMode(PIN_SOIL_SENSOR, INPUT);
}

// ------------------------------------------------
// Analog Sensor Reading
// ------------------------------------------------

/**
 * @brief Reads the pH sensor and applies calibration.
 * @return pH value (typically 0.0 to 14.0). Returns -1 on error.
 */
inline float readPH() {
    float adcVal = getAveragedADC(PIN_PH_SENSOR);
    float voltage = adcToVoltage(adcVal);
    
    if (voltage < 0) return -1; // Sensor disconnected or broken
    
    // Formula: pH = 7.0 - (Voltage - NeutralVoltage) * Slope
    float ph = 7.0 - ((voltage - PH_NEUTRAL_VOLTAGE) * PH_SLOPE);
    
    // Constrain to realistic boundaries
    if (ph < 0.0) ph = 0.0;
    if (ph > 14.0) ph = 14.0;
    
    return ph;
}

/**
 * @brief Reads the Electrical Conductivity (EC) sensor.
 * @return EC value in mS/cm. Returns -1 on error.
 */
inline float readEC() {
    float adcVal = getAveragedADC(PIN_EC_SENSOR);
    float voltage = adcToVoltage(adcVal);
    
    if (voltage < 0) return -1;

    // Basic map: Assuming max voltage (3.3V) = 5 mS/cm scaled by K factor.
    // Replace with specific manufacturer equation if available.
    float ec = (voltage / 3.3) * 5.0 * EC_K_FACTOR;
    
    return ec;
}

/**
 * @brief Calculates Total Dissolved Solids (TDS) based on the current EC reading.
 * @return TDS value in ppm. Returns -1 on error.
 */
inline float readTDS() {
    float ec = readEC();
    if (ec < 0) return -1;
    
    // Convert mS/cm to uS/cm, then apply TDS factor
    return (ec * 1000.0) * TDS_FACTOR;
}

/**
 * @brief Reads soil moisture level.
 * @return Moisture percentage (0% to 100%). Returns -1 on error.
 */
inline float readSoilMoisture() {
    float adcVal = getAveragedADC(PIN_SOIL_SENSOR);
    
    if (adcVal < 0) return -1;

    // Inverse relationship: 4095 = 0% moisture (dry air), ~1500 = 100% moisture (submerged in water)
    // Adjust the '1500' based on actual calibration of your specific capacitive sensor.
    const float DRY_VALUE = 4095.0;
    const float WET_VALUE = 1500.0;
    
    float moisture = ((DRY_VALUE - adcVal) / (DRY_VALUE - WET_VALUE)) * 100.0;
    
    // Constrain to 0-100%
    if (moisture < 0) moisture = 0;
    if (moisture > 100) moisture = 100;
    
    return moisture;
}

/**
 * @brief Performs lightweight sensor updates.
 */
inline void updateSensors() {
    readPH();
    readEC();
    readTDS();
    readSoilMoisture();
}

#endif // SENSORS_H
