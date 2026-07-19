# Fertigation Guard v2.0 - Configuration Sync Manager

This document details the architecture and implementation of the **Configuration Sync Manager**, the central nervous system for state and parameter storage across the ESP32 Node and Gateway modules.

## 1. Architecture
The Configuration Manager acts as a globally accessible `struct` (`IrrigationSettings`) loaded securely into RAM. All other modules (like the `Irrigation Controller` and `Command Processor`) reference this struct rather than relying on hardcoded `const` variables.

This unified approach ensures that when a setting (like `targetPH`) is updated via a LoRa command from the cloud, the entire system immediately reacts to the new value, and it is safely written to persistent storage without requiring a reboot.

## 2. Preferences Storage (NVRAM)
The ESP32's legacy `EEPROM` library is deprecated and prone to sector wear. Instead, this module utilizes the modern `Preferences.h` library, which safely writes to the ESP32's Non-Volatile Storage (NVS) partition.
*   **Namespace**: All settings are safely sandboxed under the `fertigation` namespace.
*   **Key-Value Pair Storage**: Settings are stored as distinct keys (e.g., `targetPH`, `autoMode`), allowing individual parameters to be updated without risking corruption to the entire block.

## 3. Validation Layer
Before any data is written to the persistent NVS, it must pass a strict validation layer:
*   `pH` must be between `4.0` and `9.0`
*   `EC` must be between `0.2` and `5.0`
*   `Soil Thresholds` must be between `0` and `100`

If an invalid configuration is detected (e.g., due to a corrupted command packet or flash memory glitch), the manager rejects the save. If a corrupted state is detected during boot (`loadConfiguration()`), the system automatically wipes the invalid data and restores the safe Factory Defaults.

## 4. Factory Reset
The `restoreFactorySettings()` function hard-resets all variables to their known-safe, agricultural standard values (e.g., `pH: 6.5`, `Tomato` crop profile). This acts as a critical fail-safe for the hardware.

## 5. Version Control & Migration
The `IrrigationSettings` struct includes a `configVersion` parameter (currently `1`). 
As the firmware evolves over the next 10 years, new variables will inevitably be added to the struct. When the ESP32 boots a new firmware version, the Configuration Manager can check this version key. If it detects an older version, it can migrate the existing valid preferences while applying defaults to the newly added variables, entirely avoiding the "brick" scenarios common in IoT updates.

## 6. Cloud Synchronization
The API architecture is designed so that the Gateway can eventually poll a `/config` endpoint. The JSON payload from the cloud will map directly to the `IrrigationSettings` struct, allowing the backend to push full configuration profiles down to the nodes seamlessly.

## 7. Future AI Integration
With AI models dictating smart agriculture, the backend might determine that a specific crop requires a dynamic pH shift based on morning weather data. Because the configuration is entirely mutable and decoupled from the state machine logic, the AI can push `cropName`, `targetPH`, and `flushDuration` updates seamlessly over the air, instantly altering the field's behavior without requiring firmware flashing.
