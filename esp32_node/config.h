/**
 * @file config.h
 * @brief Configuration parameters for the ESP32 Node, including global settings.
 */
#ifndef CONFIG_H
#define CONFIG_H
#include <Arduino.h>
#include "pins.h" // Include new hardware pin mappings

// ----------------------------------------
// Board Configuration
// ----------------------------------------
#define DEVICE_ID "ESP32_NODE_1" // Unique identifier for this node

// ----------------------------------------
// LoRa Configuration
// ----------------------------------------
#define LORA_BAND         433E6 // Operating frequency (433E6, 868E6, or 915E6)
#define LORA_MAX_RETRIES  3     // Maximum number of transmission retries

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

#if (PIN_RELAY_WATER_PUMP >= 6 && PIN_RELAY_WATER_PUMP <= 11) || \
    (PIN_RELAY_FERT_PUMP >= 6 && PIN_RELAY_FERT_PUMP <= 11) || \
    (PIN_RELAY_STIRRER >= 6 && PIN_RELAY_STIRRER <= 11) || \
    (PIN_RELAY_MAIN_PUMP >= 6 && PIN_RELAY_MAIN_PUMP <= 11) || \
    (PIN_RELAY_BASE_PUMP >= 6 && PIN_RELAY_BASE_PUMP <= 11) || \
    (PIN_RELAY_DRAIN_VALVE >= 6 && PIN_RELAY_DRAIN_VALVE <= 11)
  #error "Relay pins cannot use GPIO 6-11 (reserved for SPI Flash)."
#endif

// Pins 34, 35, 36, 39 are input only. They cannot be used for relays.
#if (PIN_RELAY_WATER_PUMP == 34 || PIN_RELAY_WATER_PUMP == 35 || PIN_RELAY_WATER_PUMP == 36 || PIN_RELAY_WATER_PUMP == 39) || \
    (PIN_RELAY_FERT_PUMP == 34 || PIN_RELAY_FERT_PUMP == 35 || PIN_RELAY_FERT_PUMP == 36 || PIN_RELAY_FERT_PUMP == 39) || \
    (PIN_RELAY_STIRRER == 34 || PIN_RELAY_STIRRER == 35 || PIN_RELAY_STIRRER == 36 || PIN_RELAY_STIRRER == 39) || \
    (PIN_RELAY_MAIN_PUMP == 34 || PIN_RELAY_MAIN_PUMP == 35 || PIN_RELAY_MAIN_PUMP == 36 || PIN_RELAY_MAIN_PUMP == 39) || \
    (PIN_RELAY_BASE_PUMP == 34 || PIN_RELAY_BASE_PUMP == 35 || PIN_RELAY_BASE_PUMP == 36 || PIN_RELAY_BASE_PUMP == 39) || \
    (PIN_RELAY_DRAIN_VALVE == 34 || PIN_RELAY_DRAIN_VALVE == 35 || PIN_RELAY_DRAIN_VALVE == 36 || PIN_RELAY_DRAIN_VALVE == 39)
  #error "Output relays cannot use GPIO 34, 35, 36, 39 (Input only pins)."
#endif

#endif // CONFIG_H
