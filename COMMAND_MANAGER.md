# Fertigation Guard v2.0 - Gateway Command Manager

This document outlines the architecture and integration of the Gateway Command Manager for the ESP32 Gateway module.

## 1. Architecture
The Gateway acts as the bridge between the high-level cloud API and the low-level LoRa network. The **Command Manager** is responsible for reliably polling the backend API, caching commands locally, and dispatching them to the correct ESP32 Node over the air.

*   **Modular Design**: The module sits entirely decoupled from the LoRa protocol driver and the Wi-Fi/API clients, acting only as the routing and queueing mechanism between them.
*   **Fully Non-Blocking**: The entire command fetch, queue evaluation, and transmission cycle utilizes `millis()` differential timers. `delay()` calls have been strictly eliminated to allow the Gateway to continuously service incoming node telemetry without interruption.

## 2. Queue System
Because the Gateway might receive a batch of commands from the backend faster than the LoRa module can safely transmit them, the system utilizes a **FIFO (First-In, First-Out) Circular Buffer**.
*   **Capacity**: The queue holds a maximum of 20 pending commands.
*   **Overflow Handling**: If the queue fills up due to a LoRa failure or excessive API commands, the oldest command is discarded (`popCommand()`) to make room for the newest. This prevents the system from permanently stalling.

## 3. Retry System
LoRa packets can be lost due to interference or collisions in the field. 
*   Because telemetry is frequent, telemetry packets are never retried. 
*   However, actuation commands (e.g., `PUMP_ON`) are critical. The Command Manager features a blind transmission retry logic. It will transmit a command up to **3 times** spaced by a **500ms** interval. After the 3rd attempt, the command is removed from the queue.

## 4. Timeout & Duplicate Protection
*   **Timeout**: If a command sits in the local queue for longer than 10 seconds (`COMMAND_TIMEOUT_MS`), it is considered stale and discarded to prevent executing an outdated actuation on a field node.
*   **Duplicate Protection**: Cloud infrastructures or impatient users often spam endpoints. The Command Manager stores a signature of the last received command. If the exact same command for the exact same node arrives within 2 seconds, it is silently ignored, preventing the queue from filling with redundant instructions.

## 5. Packet Flow
1.  **API Fetch**: The Gateway calls the `api_client` (via HTTP GET) every 3 seconds.
2.  **Parse JSON**: `ArduinoJson` extracts the `"target"` (e.g., `NODE01`) and `"command"` (e.g., `START_AUTO`).
3.  **Queue**: The command is pushed onto the FIFO buffer.
4.  **Process**: The main loop evaluates the queue. If it's time to send, it formats a compact string (`CMD:NODE01:START_AUTO`).
5.  **Dispatch**: The `lora_gateway` driver transmits the string.

## 6. Memory Optimization
*   **Static Allocation**: The 20-command FIFO queue is statically allocated as an array. No dynamic memory (`malloc` or `new`) is used, preventing heap fragmentation over months of uptime.
*   **String Caching**: Memory is strictly reserved for the string used in Duplicate Protection using `.reserve(64)`, avoiding the aggressive reallocation that typically causes ESP32s to crash when handling dynamic APIs.

## 7. Future AI Expansion
Currently, the Command Manager routes deterministic commands (e.g., turn on a specific pump). In the future, as AI models are integrated into the backend, the API can send abstract commands like `SET_SOIL_THRESHOLD:45`. Because the Gateway uses a dynamic payload structure (`CMD:NODE:COMMAND`), no architectural changes are required on the Gateway to forward these advanced AI parameters. It will cleanly route the new instructions directly to the target Node's FSM.
