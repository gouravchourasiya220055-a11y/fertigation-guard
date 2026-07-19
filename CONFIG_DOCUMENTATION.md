# Fertigation Guard v2.0 - Configuration Documentation

This document explains every configuration parameter used in the `esp32_node/config.h` and `esp32_gateway/config.h` files. The settings dictate the hardware pin mapping, communication settings, and timing logic for the ESP32 network.

## Board Configuration
*   **`DEVICE_ID`**: A unique string identifier assigned to each node or gateway. This can be used in the future to identify which device sent a packet or request.

## LoRa Configuration
These parameters configure the physical SPI connection and radio behavior of the LoRa modules (e.g., SX1278).
*   **`LORA_SS` (5)**: Slave Select (CS) pin. Defines which SPI device is active. *Note: GPIO 5 is a strapping pin and should be treated with care at boot time.*
*   **`LORA_RST` (14)**: Reset pin to hardware-reset the LoRa module during initialization.
*   **`LORA_DIO0` (26)**: Digital I/O 0 interrupt pin. The LoRa module pulses this pin when a transmission is done or a packet is received.
*   **`LORA_BAND` (433E6)**: The operating radio frequency. Options are typically `433E6` (433 MHz), `868E6` (868 MHz), or `915E6` (915 MHz) depending on local radio regulations.
*   **`LORA_MAX_RETRIES` (3)**: The maximum number of times a packet will be retransmitted if an acknowledgment is not received.

## Sensor Configuration (Node Only)
These define the analog input pins (ADC) used to read the environmental sensors.
*   **`PIN_PH_SENSOR` (34)**: Analog pin for the pH sensor. *Note: GPIO 34 is an input-only pin without internal pull-ups.*
*   **`PIN_EC_SENSOR` (35)**: Analog pin for the Electrical Conductivity (EC) sensor. *Note: GPIO 35 is an input-only pin without internal pull-ups.*
*   **`PIN_SOIL_SENSOR` (32)**: Analog pin for the soil moisture sensor.

## Relay Configuration (Node Only)
These define the digital output pins used to control the system's active hardware components.
*   **`PIN_WATER_PUMP` (13)**: Controls the main water supply pump.
*   **`PIN_FERTILIZER` (25)**: Controls the peristaltic pump for injecting liquid fertilizer.
*   **`PIN_HIGH_PRESS` (27)**: Controls the high-pressure pump (often used for fogging or deep watering).
*   **`PIN_STIRRER` (16)**: Controls the mechanical stirrer in the mixing tank.
*   **`PIN_FLUSH_VALVE` (17)**: Controls the solenoid valve to flush the system.
*   **`PIN_ALARM` (4)**: Controls a physical alarm (buzzer/light) or acts as a generic 6th relay.

## WiFi Configuration (Gateway Only)
*   **`WIFI_SSID`**: The name (SSID) of the 2.4GHz WiFi network the gateway connects to.
*   **`WIFI_PASSWORD`**: The WPA2 password for the specified WiFi network.

## Backend Configuration (Gateway Only)
*   **`API_BASE_URL`**: The base URL of the remote cloud backend. Used to construct full endpoints like `/telemetry` (POST) and `/relays` (GET).

## Timing Configuration
*   **`SENSOR_READ_INTERVAL_MS` (2000)**: The Node reads its sensors every 2000 milliseconds (2 seconds).
*   **`LORA_ACK_TIMEOUT_MS` (1000)**: The duration (in ms) to wait for a packet acknowledgment before triggering a retry.
*   **`API_PULL_INTERVAL_MS` (5000)**: The Gateway polls the backend for new relay commands every 5000 milliseconds (5 seconds).

## Debug Configuration
*   **`DEBUG_MODE` (1)**: If set to `1`, verbose debugging information is sent over the Serial monitor (115200 baud). Set to `0` for production to save processing time and power.

## Pin Compatibility & Validation
The `config.h` files now incorporate compile-time checks using `#if` preprocessor directives. These checks prevent the code from compiling if reserved pins are mistakenly assigned:
*   **SPI Flash Pins (6-11)**: ESP32 uses these pins internally to communicate with its flash memory. Using them for sensors or relays will crash the device.
*   **Input-Only Pins (34-39)**: ESP32 pins 34, 35, 36, and 39 lack internal pull circuitry and cannot output digital signals. The compile-time checks ensure they are never assigned to Relays.
