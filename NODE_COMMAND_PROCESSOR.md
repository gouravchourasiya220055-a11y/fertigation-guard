# Fertigation Guard v2.0 - Node Command Processor

This document outlines the architecture and implementation of the **Node Command Processor** for the ESP32 Node module. This processor acts as the central ingestion pipeline for all inbound actuation and parameter tuning commands dispatched by the Gateway over the LoRa network.

## 1. Architecture
The Command Processor is fully decoupled from hardware logic. It acts as an interpretation layer that:
1.  Continuously polls the local LoRa buffer via `receiveLoRaPacket()`.
2.  Parses compact string payloads securely.
3.  Maps string commands to native C++ function calls within the `Irrigation Controller` and `Relay Manager`.

The architecture operates strictly using `millis()` differential timers, ensuring zero blocking behavior that could otherwise interrupt precise flow sensor readings or safety timeouts.

## 2. Packet Parsing
The module receives a compact, colon-delimited string over LoRa.
**Format**: `CMD:<TARGET_NODE_ID>:<COMMAND_NAME>[:OPTIONAL_PARAMETER]`
**Examples**:
*   `CMD:ESP32_NODE_1:START_AUTO`
*   `CMD:ESP32_NODE_1:SET_EC:2.10`

The parser utilizes lightweight `indexOf()` string scanning. It verifies the prefix, extracts the target Node ID, confirms the ID matches `DEVICE_ID`, and finally extracts the command payload and optional parameter.

## 3. Execution Flow
Once validated, the payload string is routed through an execution map (`executeCommand()`). This map ties text commands directly to hardware interfaces:
*   **Mode Control**: `START_AUTO` -> `startAutomaticCycle()`
*   **Direct Actuation**: `PUMP_ON` -> `setWaterPump(true)`
*   **Parameter Tuning**: `SET_PH:6.0` -> Validates float, assigns to `TARGET_PH_MIN`

## 4. Security & Validation
In an automated agriculture environment, false actuations caused by corrupted RF packets or rogue transmitters can destroy crops. The Command Processor mitigates this via several layers:
1.  **Format Verification**: Completely ignores empty, malformed, or missing-prefix packets.
2.  **Target Verification**: Silently drops packets destined for other nodes, enabling dense multi-node deployments on the same LoRa frequency.
3.  **Duplicate Protection**: Caches the last executed command string and its timestamp. If an identical command is received within a 2-second window (e.g., from a Gateway blind-retry loop), it is safely ignored to prevent double-execution.
4.  **Parameter Safety**: Parameter extraction requires successful `.toFloat()` conversion and strictly checks that values are `> 0.0` before writing them to the configuration variables.

## 5. Memory Optimization
*   **No Dynamic Arrays**: The string splitting avoids generating dynamic arrays of substrings. It operates in place using indexes to extract exactly what it needs.
*   **String Caching**: The signature string used for duplicate protection (`lastExecutedCommand`) is permanently allocated using `.reserve(64)` during boot. This prevents the heap fragmentation that plagues many string-heavy embedded designs.

## 6. Future AI Integration
The architecture is inherently future-proofed for advanced AI integration from the cloud backend. Because the parser dynamically splits the command and parameters, introducing a new hook (e.g., `SET_AI_MODE`, `SET_IRRIGATION_PLAN`, or `SET_WEATHER_MODE`) requires only adding a single `else if` block in `executeCommand()`. The parsing logic itself requires zero refactoring to support new multi-parameter AI directives.
