/**
 * @file config.h
 * @brief Configuration parameters for the ESP32 Node, including pins and LoRa settings.
 */
#ifndef CONFIG_H
#define CONFIG_H
#include <Arduino.h>

// ----------------------------------------
// Board Configuration
// ----------------------------------------
#define DEVICE_ID "ESP32_NODE_1" // Unique identifier for this node

// ----------------------------------------
// LoRa Configuration
// ----------------------------------------
// Assuming standard generic SX1278 wiring for ESP32
#define LORA_SS           5     // Slave Select pin for LoRa (Note: GPIO 5 is a strapping pin)
#define LORA_RST          14    // Reset pin for LoRa module
#define LORA_DIO0         26    // DIO0 interrupt pin for LoRa module
#define LORA_BAND         433E6 // Operating frequency (433E6, 868E6, or 915E6)
#define LORA_MAX_RETRIES  3     // Maximum number of transmission retries

// ----------------------------------------
// Sensor Configuration
// ----------------------------------------
#define PIN_PH_SENSOR     34    // Analog input pin for pH sensor (Input-only pin)
#define PIN_EC_SENSOR     35    // Analog input pin for EC sensor (Input-only pin)
#define PIN_SOIL_SENSOR   32    // Analog input pin for Soil Moisture sensor

// ----------------------------------------
// Relay Configuration
// ----------------------------------------
#define PIN_WATER_PUMP    13    // Digital output pin for Water Pump
#define PIN_FERTILIZER    25    // Digital output pin for Peristaltic Pump
#define PIN_HIGH_PRESS    27    // Digital output pin for High Pressure Pump
#define PIN_STIRRER       16    // Digital output pin for Stirrer
#define PIN_FLUSH_VALVE   17    // Digital output pin for Flush Valve
#define PIN_ALARM         4     // Digital output pin for Alarm / Relay 6

// ----------------------------------------
// Timing Configuration
// ----------------------------------------
#define SENSOR_READ_INTERVAL_MS 2000 // Interval in milliseconds to read sensors
#define LORA_ACK_TIMEOUT_MS     1000 // Time in milliseconds to wait for an ACK before retrying

// ----------------------------------------
// Debug Configuration
// ----------------------------------------
#define DEBUG_MODE        1     // Set to 1 to enable Serial debug output, 0 to disable

// ----------------------------------------
// Compile-Time Validations for ESP32 Pins
// ----------------------------------------
// ESP32 Pins 6 to 11 are reserved for the integrated SPI flash.
#if (LORA_SS >= 6 && LORA_SS <= 11) || (LORA_RST >= 6 && LORA_RST <= 11) || (LORA_DIO0 >= 6 && LORA_DIO0 <= 11)
  #error "LoRa pins cannot use GPIO 6-11 (reserved for SPI Flash)."
#endif

#if (PIN_WATER_PUMP >= 6 && PIN_WATER_PUMP <= 11) || (PIN_FERTILIZER >= 6 && PIN_FERTILIZER <= 11) || (PIN_HIGH_PRESS >= 6 && PIN_HIGH_PRESS <= 11) || (PIN_STIRRER >= 6 && PIN_STIRRER <= 11) || (PIN_FLUSH_VALVE >= 6 && PIN_FLUSH_VALVE <= 11) || (PIN_ALARM >= 6 && PIN_ALARM <= 11)
  #error "Relay pins cannot use GPIO 6-11 (reserved for SPI Flash)."
#endif

// Pins 34, 35, 36, 39 are input only. They cannot be used for relays.
#if (PIN_WATER_PUMP == 34 || PIN_WATER_PUMP == 35 || PIN_WATER_PUMP == 36 || PIN_WATER_PUMP == 39) || \
    (PIN_FERTILIZER == 34 || PIN_FERTILIZER == 35 || PIN_FERTILIZER == 36 || PIN_FERTILIZER == 39) || \
    (PIN_HIGH_PRESS == 34 || PIN_HIGH_PRESS == 35 || PIN_HIGH_PRESS == 36 || PIN_HIGH_PRESS == 39) || \
    (PIN_STIRRER == 34 || PIN_STIRRER == 35 || PIN_STIRRER == 36 || PIN_STIRRER == 39) || \
    (PIN_FLUSH_VALVE == 34 || PIN_FLUSH_VALVE == 35 || PIN_FLUSH_VALVE == 36 || PIN_FLUSH_VALVE == 39) || \
    (PIN_ALARM == 34 || PIN_ALARM == 35 || PIN_ALARM == 36 || PIN_ALARM == 39)
  #error "Output relays cannot use GPIO 34, 35, 36, 39 (Input only pins)."
#endif

#endif // CONFIG_H
