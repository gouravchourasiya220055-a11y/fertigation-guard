#pragma once

// ── WiFi ──────────────────────────────────────────────
#define WIFI_SSID       "YOUR_WIFI_SSID"
#define WIFI_PASSWORD   "YOUR_WIFI_PASSWORD"

// Backend server (same LAN as ESP32)
#define SERVER_HOST     "192.168.1.100"
#define SERVER_PORT     3001

// ── Simulation (no hardware required) ───────────────
#define SIMULATION_MODE false

// ── GPIO — Relays (active LOW) ───────────────────────
#define PIN_RELAY_WATER     25
#define PIN_RELAY_BASE      26
#define PIN_RELAY_FERT      27
#define PIN_RELAY_FLUSH     14
#define PIN_RELAY_STIRRER   12
#define PIN_RELAY_ALARM     13

// ── GPIO — Sensors ───────────────────────────────────
#define PIN_PH              34
#define PIN_TDS             35

// ── I2C LCD ──────────────────────────────────────────
#define LCD_ADDR            0x27
#define LCD_COLS            20
#define LCD_ROWS            4

// ── Timing (ms) ──────────────────────────────────────
#define TELEMETRY_INTERVAL  3000
#define SENSOR_SAMPLES      10
#define DEFAULT_DOSE_MS     10000
#define DEFAULT_FLUSH_SEC   20
#define FILL_TIMEOUT_MS     120000
#define STABILIZE_MS        5000

// ── Defaults ─────────────────────────────────────────
#define DEFAULT_PH          6.2f
#define DEFAULT_EC          2.3f
#define DEFAULT_PH_TOL      0.2f
#define DEFAULT_EC_TOL      0.15f
#define DEFAULT_CROP        "Tomato"
