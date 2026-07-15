#include "sensors.h"
#include "config.h"

// pH calibration: linear map from voltage to pH (adjust after buffer calibration)
static float phSlope = -5.70f;
static float phOffset = 21.34f;

// TDS: EC (mS/cm) = (rawVoltage * 1000) / kValue; kValue ~500 for many modules
static const float TDS_K_VALUE = 500.0f;
static const float EC_SCALE = 0.5f; // TDS ppm to mS/cm approximation

#if SIMULATION_MODE
static float simPh = 5.5f;
static float simEc = 1.2f;
#endif

static float readAnalogAvg(uint8_t pin) {
  long sum = 0;
  for (int i = 0; i < SENSOR_SAMPLES; i++) {
    sum += analogRead(pin);
    delay(10);
  }
  return (sum / (float)SENSOR_SAMPLES) * (3.3f / 4095.0f);
}

void sensorsInit() {
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);
  pinMode(PIN_PH, INPUT);
  pinMode(PIN_TDS, INPUT);
}

SensorReadings sensorsRead() {
  SensorReadings r = {};

#if SIMULATION_MODE
  simPh += 0.05f;
  if (simPh > 6.5f) simPh = 5.3f;
  simEc += 0.08f;
  if (simEc > 2.5f) simEc = 1.1f;
  r.ph = simPh;
  r.ec = simEc;
  r.phValid = true;
  r.ecValid = true;
  return r;
#endif

  float phV = readAnalogAvg(PIN_PH);
  float tdsV = readAnalogAvg(PIN_TDS);

  r.ph = phSlope * phV + phOffset;
  r.ph = constrain(r.ph, 0.0f, 14.0f);
  r.phValid = (phV > 0.05f && phV < 3.2f);

  // TDS module: ppm = (133.42 * V^3 - 255.86 * V^2 + 857.39 * V) * 0.5
  float ppm = (133.42f * tdsV * tdsV * tdsV
             - 255.86f * tdsV * tdsV
             + 857.39f * tdsV) * EC_SCALE;
  r.ec = ppm / TDS_K_VALUE; // approximate mS/cm
  r.ec = constrain(r.ec, 0.0f, 10.0f);
  r.ecValid = (tdsV > 0.05f);

  return r;
}

void sensorsCalibratePh(float voltageAt7, float voltageAt4) {
  phSlope = (4.0f - 7.0f) / (voltageAt4 - voltageAt7);
  phOffset = 7.0f - phSlope * voltageAt7;
}
