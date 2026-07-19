# Fertigation Guard v2.0 - Configuration & Preferences Manager

This document outlines the architecture and implementation of the **Configuration & Preferences Manager**, which has been upgraded to a robust, JSON-compatible, scalable structure for both the ESP32 Node and Gateway modules.

## 1. Architecture
The updated Config Manager serves as the ultimate source of truth for parameter scaling across the entire `v2.0` architecture. Instead of hardcoding intervals or setpoints, a unified `SystemConfig` struct (`sysConfig`) is loaded into RAM. All other modules (like `Telemetry Manager` and `Irrigation Controller`) reference this exact struct memory block, ensuring updates take immediate effect without system reboots.

## 2. Storage Engine & Layout
The manager aggressively prevents memory fragmentation and sector decay by utilizing the **ESP32 Preferences (NVS)** library over standard EEPROM. 
*   **Namespace**: `fertigation` (Primary Storage), `fert_backup` (Snapshot Storage)
*   **Keys**: Each parameter (e.g., `phMin`, `telInt`) is stored as an individual key. If a power outage corrupts a single key block during a write, the rest of the configuration is preserved.

## 3. Configuration Flow & Versioning
When the system boots, `loadConfiguration()` is executed:
1.  **Check**: Validates if the `cfgVer` key exists.
2.  **Factory Reset**: If missing, it executes `factoryReset()`, loading a known-good agronomic baseline.
3.  **Migration**: If the firmware boots and finds `sysConfig.configVersion < 2`, it automatically steps the JSON/NVS keys to the new structure and increments the version key, guaranteeing that over-the-air (OTA) updates will never "brick" a device due to a configuration layout mismatch.

## 4. Runtime Updates
The `updateConfiguration()` hook, alongside the LoRa `Command Processor`, allows for active modification.
*   If `SET_PH_MIN 5.5` arrives via LoRa, `sysConfig.phMin` is updated in RAM and `saveConfiguration()` immediately commits it to NVS. The Irrigation Controller, running on a differential `millis()` timer, automatically starts targeting the new 5.5 threshold on its next tick.

## 5. Validation Rules
Agriculture hardware cannot risk applying bad values (e.g., dropping pH to 1.0). The Config Manager includes a strict validation layer:
*   `pH` constrained to `0–14`
*   `EC` constrained to `0–10`
*   `Soil Thresholds` constrained to `0-100%`
*   `Telemetry & LoRa Intervals` constrained to `500ms` - `60000ms`
If an invalid state is detected before writing to NVS, the manager throws an abort, protecting the flash sectors. If corrupted data is detected upon boot, it throws an error and restores the factory defaults.

## 6. JSON Export & Backup System
To support seamless backend integration, the manager implements `ArduinoJson` serialization:
*   `exportConfiguration()` pushes a highly compressed `char[]` JSON payload to the Gateway or API without utilizing dynamic `String` classes, ensuring zero heap fragmentation.
*   `backupConfiguration()` saves a mirror image of the entire config to the `fert_backup` namespace. If the primary namespace ever degrades, `restoreConfiguration()` can instantaneously pull the mirror block back into primary RAM.

## 7. Future Expansion (AI Readiness)
The struct natively supports `aiModeEnabled`, `automaticMode`, and `manualMode` booleans. As the backend AI algorithms evolve, they can actively toggle the node into `aiModeEnabled`, taking over the parameter tuning via the `Command Processor` without requiring any changes to the embedded configuration driver itself.
