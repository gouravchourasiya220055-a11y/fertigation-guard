#include "sensors.h"
#include "config.h" // For globals
#include "pins.h"   // For pin definitions

// Calibration Constants
const float PH_NEUTRAL_VOLTAGE = 1.50; // Voltage at pH 7.0
const float PH_ACID_VOLTAGE    = 2.00; // Voltage at pH 4.0
const float PH_SLOPE           = (7.0 - 4.0) / (PH_NEUTRAL_VOLTAGE - PH_ACID_VOLTAGE);

const float EC_K_FACTOR = 1.0; 
const float TDS_FACTOR = 0.5;

const int NUM_SAMPLES = 10;

float getAveragedADC(int pin) {
    long sum = 0;
    int validSamples = 0;
    for (int i = 0; i < NUM_SAMPLES; i++) {
        int val = analogRead(pin);
        if (val > 0 && val < 4095) {
            sum += val;
            validSamples++;
        }
        delay(2);
    }
    if (validSamples == 0) return -1;
    return (float)sum / validSamples;
}

float adcToVoltage(float adcVal) {
    if (adcVal < 0) return -1;
    return (adcVal / 4095.0) * 3.3;
}

void setupSensors() {
    analogReadResolution(12);
    analogSetAttenuation(ADC_11db);
    pinMode(PIN_PH_SENSOR, INPUT);
    pinMode(PIN_TDS_SENSOR, INPUT);
    pinMode(PIN_SOIL_MOISTURE, INPUT);
}

float readPH() {
    float adcVal = getAveragedADC(PIN_PH_SENSOR);
    float voltage = adcToVoltage(adcVal);
    if (voltage < 0) return -1;
    float ph = 7.0 - ((voltage - PH_NEUTRAL_VOLTAGE) * PH_SLOPE);
    if (ph < 0.0) ph = 0.0;
    if (ph > 14.0) ph = 14.0;
    return ph;
}

// Derive EC from TDS since we have a single TDS sensor now
float readEC() {
    float tds = readTDS();
    if (tds < 0) return -1;
    return (tds / TDS_FACTOR) / 1000.0;
}

float readTDS() {
    float adcVal = getAveragedADC(PIN_TDS_SENSOR);
    float voltage = adcToVoltage(adcVal);
    if (voltage < 0) return -1;
    // Map voltage to TDS directly, similar to typical analog TDS sensors
    // Usually 3.3V -> 1000 ppm or similar. Using a basic map for now.
    float tds = (voltage / 3.3) * 1000.0;
    return tds;
}

float readSoilMoisture() {
    float adcVal = getAveragedADC(PIN_SOIL_MOISTURE);
    if (adcVal < 0) return -1;
    const float DRY_VALUE = 4095.0;
    const float WET_VALUE = 1500.0;
    float moisture = ((DRY_VALUE - adcVal) / (DRY_VALUE - WET_VALUE)) * 100.0;
    if (moisture < 0) moisture = 0;
    if (moisture > 100) moisture = 100;
    return moisture;
}

void updateSensors() {
    readPH();
    readEC();
    readTDS();
    readSoilMoisture();
}
