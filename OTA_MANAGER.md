# Fertigation Guard v2.0 - OTA Firmware Update Manager

This document details the architecture and implementation of the **OTA (Over-The-Air) Firmware Update Manager**, designed to provide seamless, non-blocking firmware upgrades for both the ESP32 Gateway and the ESP32 Node in the Fertigation Guard v2.0 ecosystem.

## 1. Architecture
The OTA Manager is built on a finite state machine (FSM) that dictates the flow of firmware upgrades without stalling the `loop()`. This ensures that critical background tasks (like sensor polling or telemetry heartbeat generation) can gracefully pause when a flashing operation begins, and the hardware watchdog won't crash the system during a prolonged download.

**States:**
*   `OTA_IDLE`: Passively waiting for commands.
*   `OTA_CHECKING`: Verifying if a new build exists via the Backend API.
*   `OTA_AVAILABLE`: A validated manifest has been found.
*   `OTA_DOWNLOADING`: Actively pulling chunks (HTTP for Gateway, LoRa for Node).
*   `OTA_VERIFYING`: Ensuring MD5/SHA256 checksums match perfectly.
*   `OTA_INSTALLING`: Finalizing the flash partition.
*   `OTA_SUCCESS`: Rebooting into the new firmware.
*   `OTA_FAILED`: Handling aborts or corruption.
*   `OTA_ROLLBACK`: Restoring the previous partition.

## 2. Gateway vs. Node Execution
*   **ESP32 Gateway**: Uses the `HTTPClient` to pull `512-byte` binary chunks over WiFi directly from the cloud backend.
*   **ESP32 Node**: Listens to the `Command Processor` for LoRa-injected firmware chunks. Because the Node operates off-grid, the Gateway coordinates the binary slicing and transmits the chunks securely via LoRa, while the Node orchestrates the write sequence into flash memory.

## 3. Firmware Validation & Security
Agricultural hardware cannot risk a corrupted state. The OTA Manager enforces strict checks:
1.  **Size Validation**: Rejects any file larger than the available `app` partition.
2.  **Checksums**: The `verifyFirmware()` phase ensures that the downloaded binary perfectly matches the `firmwareHash` (MD5/SHA256) provided by the server. If a single byte is dropped over LoRa, the update is instantly aborted.

## 4. Fail-Safe & Rollback System
If a power loss occurs during `OTA_INSTALLING`, or if the new firmware crashes repeatedly on boot, the ESP32 natively supports partition rolling. The command `ROLLBACK` triggers `Update.rollBack()`, effortlessly pivoting the bootloader back to the previous stable firmware image. The configuration states in NVS (Preferences) remain completely unaffected by partition rolls.

## 5. Memory Usage constraints
The `OTAInfo` struct (`otaData`) has been highly optimized. All fields, including `currentVersion`, `compileDate`, and `firmwareHash`, use statically allocated `char[]` arrays rather than dynamic `String` objects, guaranteeing zero heap fragmentation over months of uptime. 

## 6. Telemetry Integration
The manager continuously exposes OTA progress. The `Telemetry Manager` appends `"otaVer"`, `"otaStatus"`, and `"otaProg"` to the outgoing JSON payload. This ensures the cloud dashboard receives real-time progress bars and status updates (e.g., `OTA_DOWNLOADING: 45%`) without requiring a secondary communication channel.
