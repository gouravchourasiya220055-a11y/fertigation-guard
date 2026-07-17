#ifndef CONFIG_H
#define CONFIG_H

/****************************************************
 * Smart Fertigation Guard
 * ESP32 Configuration File
 ****************************************************/

//=========================
// WiFi Configuration
//=========================
#define WIFI_SSID "realme 16 Pro 5G 0180"
#define WIFI_PASSWORD "12345678"   // <-- Apna Hotspot/WiFi Password likho

//=========================
// Backend API
//=========================
// Laptop ka IPv4 Address
#define API_BASE_URL "http://10.109.2.187:5000/api"

//=========================
// Sensor Pins
//=========================
#define PIN_PH_SENSOR      34
#define PIN_EC_SENSOR      35
#define PIN_SOIL_SENSOR    32

//=========================
// Relay Pins
//=========================
#define PIN_RELAY_1        13      // Water Pump
#define PIN_RELAY_2        25      // Fertilizer Pump
#define PIN_RELAY_3        27      // High Pressure Pump
#define PIN_RELAY_4        16      // Stirrer Motor
#define PIN_RELAY_5        17      // Flush Valve
#define PIN_RELAY_6        4       // Alarm / Spare

// Active LOW Relay
#define RELAY_ON   LOW
#define RELAY_OFF  HIGH

//=========================
// Timing
//=========================
#define POLLING_INTERVAL_MS 2000

#endif