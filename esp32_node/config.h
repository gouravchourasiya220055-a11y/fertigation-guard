#ifndef CONFIG_H
#define CONFIG_H
#include <Arduino.h>

// --- Node Identification ---
#define DEVICE_ID "ESP32_NODE_1"

// --- Sensor GPIO Pins ---
#define PIN_PH_SENSOR     34
#define PIN_EC_SENSOR     35
#define PIN_SOIL_SENSOR   32

// --- Relay GPIO Pins ---
#define PIN_WATER_PUMP    13 // Water Pump
#define PIN_FERTILIZER    25 // Peristaltic Pump
#define PIN_HIGH_PRESS    27 // High Pressure Pump
#define PIN_STIRRER       16 // Stirrer
#define PIN_FLUSH_VALVE   17 // Flush Valve
#define PIN_ALARM         4  // Alarm / Relay 6

// --- LoRa Configuration ---
// Assuming standard generic SX1278 wiring for ESP32
#define LORA_SS           05
#define LORA_RST          14
#define LORA_DIO0         26
#define LORA_BAND         433E6 // Change to 868E6 or 915E6 based on your region

// --- Timing & Reliable Protocol Configuration ---
#define SENSOR_READ_INTERVAL_MS 2000
#define LORA_ACK_TIMEOUT_MS     1000 // Time to wait for ACK before retry
#define LORA_MAX_RETRIES        3    // Max retries before dropping packet

#endif // CONFIG_H
