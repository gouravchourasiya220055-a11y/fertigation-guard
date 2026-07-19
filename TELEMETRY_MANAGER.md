# Fertigation Guard v2.0 - Telemetry Manager

This document details the design and implementation of the Telemetry Manager module for the ESP32 Node. The Telemetry Manager acts as the core aggregator of all system states, formatting them into compact JSON packets for transmission via LoRa.

## 1. Architecture
The Telemetry Manager acts as a top-level integration layer. It does not control any hardware directly. Instead, it queries the other specialized modules:
*   **Sensor Manager (`sensors.h`)**: For analog values (pH, EC, TDS, Soil Moisture).
*   **Flow Manager (`flowsensor.h`)**: For flow rates and total fluid volumes.
*   **Irrigation Controller (`irrigation_controller.h`)**: For current operation modes/states.
*   **LoRa Driver (`lora_node.h`)**: To dispatch the aggregated packet over the air.

Because it relies on these modules, the Telemetry Manager requires absolutely zero `delay()` calls and runs seamlessly in the non-blocking architecture.

## 2. Core Functions
*   **`setupTelemetry()`**: Pre-allocates memory for the JSON string to prevent heap fragmentation.
*   **`buildTelemetryPacket()`**: Queries all hardware managers and manually constructs a compact JSON string. Safely handles missing/broken sensors by formatting `-1` values to `null`.
*   **`printTelemetry()`**: If `DEBUG_MODE` is enabled in `config.h`, dumps the formatted JSON to the Serial monitor alongside system health stats (packet size, free heap memory).
*   **`sendTelemetry()`**: Hands the JSON payload to the LoRa driver.
*   **`updateTelemetry()`**: The master non-blocking timer. Dictates exactly when packets are built and sent based on `TELEMETRY_INTERVAL_MS` (default 2 seconds).

## 3. Packet Structure
The module generates a flat, compact JSON string designed to maximize data density while remaining natively parseable by web backends (Node.js, Python, etc.).

**Example Payload:**
```json
{
  "id": "ESP32_NODE_1",
  "ph": 6.45,
  "ec": 1.74,
  "tds": 870.00,
  "soil": 54.00,
  "waterFlow": 2.34,
  "fertFlow": 0.31,
  "waterTotal": 15.70,
  "fertTotal": 2.10,
  "state": "FERTIGATING",
  "battery": 12.00,
  "uptime": 123456,
  "packet": 25
}
```

## 4. Memory Optimization
Generating dynamic JSON on microcontrollers often leads to heap fragmentation and eventual crashes due to continuous `String` reallocation. This module mitigates this through two strategies:
1.  **Manual Concatenation over ArduinoJson**: While ArduinoJson is powerful, manually concatenating the string is significantly lighter on RAM and CPU cycles for simple, flat structures.
2.  **Memory Pre-allocation**: During `setupTelemetry()`, `currentTelemetryPacket.reserve(256)` is called. This reserves a contiguous block of RAM permanently for the String. When the string is overwritten every 2 seconds, it reuses this exact memory block, entirely eliminating fragmentation.

## 5. Future Expansion
1.  **Battery Monitoring**: Currently, battery voltage is hardcoded to `12.0`. Once a voltage divider circuit is added to the hardware, a `readBatteryVoltage()` function can be added to `sensors.h` and called within `buildTelemetryPacket()`.
2.  **Binary Packing (Protobuf/Structs)**: If the LoRa airtime becomes congested as more nodes are added to the field, the JSON string can be swapped out for a packed C-Struct or Protocol Buffers. This would reduce the ~200 byte JSON payload down to roughly ~32 bytes of raw hex.
