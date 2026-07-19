/**
 * @file config.h
 * @brief Configuration parameters for the ESP32 Gateway, including WiFi, API, and LoRa settings.
 */
#ifndef CONFIG_H
#define CONFIG_H
#include <Arduino.h>

// ----------------------------------------
// Board Configuration
// ----------------------------------------
#define DEVICE_ID "ESP32_GATEWAY_1" // Unique identifier for this gateway node

// ----------------------------------------
// LoRa Configuration
// ----------------------------------------
// ESP32 DevKit V1 with generic LoRa module
#define LORA_SS           5     // Slave Select pin for LoRa (Note: GPIO 5 is a strapping pin)
#define LORA_RST          14    // Reset pin for LoRa module
#define LORA_DIO0         26    // DIO0 interrupt pin for LoRa module
#define LORA_BAND         433E6 // Operating frequency (433E6, 868E6, or 915E6 depending on region)
#define LORA_MAX_RETRIES  3     // Maximum number of transmission retries before dropping packet

// ----------------------------------------
// WiFi Configuration (Gateway only)
// ----------------------------------------
#define WIFI_SSID         "realme 16 Pro 5G 0180" // SSID of the WiFi network
#define WIFI_PASSWORD     "12345678"              // Password for the WiFi network

// ----------------------------------------
// Backend Configuration (Gateway only)
// ----------------------------------------
#define API_BASE_URL "http://10.109.2.187:5000/api" // REST API Endpoint

// ----------------------------------------
// Timing Configuration
// ----------------------------------------
#define API_PULL_INTERVAL_MS 5000 // Interval in milliseconds to pull relay commands from the API
#define LORA_ACK_TIMEOUT_MS  1000 // Time in milliseconds to wait for an ACK before retrying

// ----------------------------------------
// Debug Configuration
// ----------------------------------------
#define DEBUG_MODE        1       // Set to 1 to enable Serial debug output, 0 to disable

// ----------------------------------------
// Compile-Time Validations for Reserved Pins
// ----------------------------------------
// ESP32 Pins 6 to 11 are reserved for the integrated SPI flash and cannot be used.
#if (LORA_SS >= 6 && LORA_SS <= 11) || (LORA_RST >= 6 && LORA_RST <= 11) || (LORA_DIO0 >= 6 && LORA_DIO0 <= 11)
  #error "LoRa pins cannot use GPIO 6-11 (reserved for SPI Flash)."
#endif

#endif // CONFIG_H
