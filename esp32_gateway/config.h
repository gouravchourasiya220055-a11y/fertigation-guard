#ifndef CONFIG_H
#define CONFIG_H
#include <Arduino.h>

// WiFi Credentials
#define WIFI_SSID "realme 16 Pro 5G 0180"
#define WIFI_PASSWORD "12345678"

// API Configuration (Change to your backend IP/Domain)
#define API_BASE_URL "https://fertigation-backend-gourav.onrender.com/api"
// LoRa Configuration (ESP32 DevKit V1 with generic LoRa module)
#define LORA_SS 5
#define LORA_RST 14
#define LORA_DIO0 26
#define LORA_BAND 433E6 // Change to 868E6 or 915E6 depending on your region

// Timing & Reliable Protocol Configuration
#define API_PULL_INTERVAL_MS 5000
#define LORA_ACK_TIMEOUT_MS 1000 // Time to wait for ACK before retry
#define LORA_MAX_RETRIES 3       // Max retries before dropping packet

#endif // CONFIG_H
