# Fertigation Guard v2.0 - Production & System Integrity Manager

This document details the final layer of the v2.0 architecture: the **Production Manager** and **System Logger**. These modules finalize the firmware by adding extreme durability, memory monitoring, and deployment self-testing to both the Gateway and the Node.

## 1. Architecture
The Production layer acts as an omnipresent profiler wrapped around the standard Arduino `loop()`. 
By injecting `startLoopMonitor()` and `endLoopMonitor()` at the boundaries of the main thread, the Production Manager accurately calculates CPU starvation, maximum block times, and absolute heap watermarks. 

## 2. Logging System
Embedded IoT systems rarely have the luxury of persistent filesystems without burning out flash sectors. The **System Logger** solves this by implementing a **200-entry Circular Buffer** statically allocated in RAM.
*   **Zero Allocation**: `LogEntry` uses strict `char[48]` arrays. `String` is strictly prohibited.
*   **Severities**: Supports `INFO`, `WARNING`, `ERROR`, and `CRITICAL`.
*   **Rotation**: Once 200 logs are reached, the head wraps around and overwrites the oldest event, guaranteeing that memory consumption is capped at exactly `12.8 KB` indefinitely.

## 3. Performance Optimization
Throughout the v2.0 refactor, performance optimizations were strictly enforced:
*   **Memory**: Migrated all telemetry payload generations, log systems, and OTA chunking mechanisms away from dynamic heap manipulation. Everything is statically sized.
*   **CPU**: The `loopIterations` and `totalLoopTime` metrics actively measure the cost of the state machines. Standard loop times on the ESP32 should remain well under `2ms`. Any `maxLoopTime` exceeding `100ms` acts as an indicator that an ISR or HTTP call is blocking.

## 4. Security & System Integrity
The system employs multiple redundant layers of security:
1.  **Configuration Fencing**: `validateConfiguration()` aggressively rejects corrupted thresholds (e.g., pH 16) before they can be written to the `Preferences` flash sectors.
2.  **OTA Lockouts**: The OTA Manager verifies MD5 and SHA256 hashes against cloud manifests to prevent spoofed/injected firmware from executing.
3.  **Boot Self-Tests**: Before the main loop is allowed to assume control over physical pumps, `runProductionSelfTest()` evaluates the minimum viable RAM (25KB), validates the config, and checks module presence. If a critical hardware trace fails, the board enters a safe, degraded mode.

## 5. Field Deployment & Maintenance
Included alongside this module is the `deployment_checklist.md`, which standardizes the physical installation process. By enforcing strict LoRa RSSI minimums (-110 dBm), relay snubbers (flyback diodes), and 24-hour memory burn-in tests, physical deployment failures are mitigated.

## 6. Future Expansion
*   **Remote Log Tailing**: Expand the `/api/logs` endpoint on the backend to actively pull the Gateway's internal 200-entry circular buffer over the HTTP Cloud Sync Manager.
*   **Watchdog Task Isolation**: Transition the Arduino `loop()` into distinct FreeRTOS tasks pinned to `Core 0` (WiFi/HTTP) and `Core 1` (LoRa/Irrigation), utilizing hardware interrupts to truly separate network blocking from critical physical control.
