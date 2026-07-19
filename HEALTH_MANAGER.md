# Fertigation Guard v2.0 - System Health & Diagnostics Manager

This document outlines the architecture and implementation of the **System Health & Diagnostics Manager**, a comprehensive watchdog and self-healing system integrated into both the ESP32 Node and ESP32 Gateway.

## 1. Architecture
The Health Manager operates as an independent, non-blocking supervisor that runs at the end of the `loop()` cycle. It accesses weak global variables from other modules (like `lastTelemetrySentMs`, `WiFi.status()`, and `ESP.getFreeHeap()`) to deduce the system's operational health without requiring intrusive callbacks or modifications to existing logic.

## 2. Boot Process & Self Test
During system initialization (`setup()`), the Health Manager triggers `performSelfTest()`:
*   **RAM Test**: Validates that sufficient free heap exists (minimum 20KB for stable operation).
*   **Sensor Availability**: (Node Only) Pings the ADC bus to confirm sensors are returning valid voltages (e.g., pH != -1).
*   **Peripheral Status**: Validates WiFi connection on the Gateway.
This ensures the hardware is in a known-good state before the main `loop()` takes control.

## 3. Health Monitoring & Watchdog
The core tick `updateHealthManager()` assesses vital signs every cycle:
*   **Memory Tracker**: Constantly monitors `ESP.getFreeHeap()` and logs the `minimumHeap` (low water mark) ever observed. This is critical for catching slow memory leaks over months of uptime.
*   **Module Watchdogs**: Cross-references timestamps. For example, if `millis() - lastTelemetry > 300000` (5 minutes) and telemetry hasn't been sent, the manager flags a `WARNING`.
*   **Relay Overrides**: Detects if the Relay Manager has tripped into `emergencyMode` due to a hardware fault, escalating the health status to `CRITICAL`.

## 4. Auto Recovery Mechanisms
Instead of simply crashing or hard-resetting, the Health Manager attempts graceful self-healing:
*   **WiFi Disconnects**: If the Gateway loses its connection, the Health Manager restricts `WiFi.reconnect()` calls to non-blocking intervals (e.g., every 30 seconds) until the network recovers.
*   **Telemetry Stalls**: If the node detects that telemetry generation has stalled, it resets the internal packet counters, unblocking the telemetry loop.
*   **Memory Pressure**: If the heap dips below `15,000` bytes, a `WARNING` flag `ERR_LOW_MEMORY` is thrown to alert the cloud before a hard fault occurs.

## 5. Error Codes & State Tracking
All diagnostic states are neatly packed into a `SystemHealth` struct, which is exposed globally via `getSystemHealth()`.

**System States**:
*   `SYSTEM_OK` (Green)
*   `WARNING` (Yellow - Non-fatal issue, attempting recovery)
*   `ERROR` (Red - Module failed, core logic still running)
*   `CRITICAL` (Black - Hardware fault, system locked)

**Error Codes**:
*   `ERR_NONE`, `ERR_SENSOR_FAIL`, `ERR_LORA_TIMEOUT`, `ERR_WIFI_LOST`, `ERR_API_FAIL`, `ERR_LOW_MEMORY`, `ERR_FLOW_FAIL`, `ERR_RELAY_TIMEOUT`, `ERR_CONTROLLER_FAIL`, `ERR_UNKNOWN`

## 6. Memory Optimization
The module adheres strictly to embedded C++ constraints. It uses no `malloc()`, no `new`, and avoids `String` concatenation inside the heartbeat payload where possible, preferring static variables to guarantee zero heap fragmentation.
