# Fertigation Guard v2.0 - Relay Manager Architecture

This document outlines the redesign and safety features of the ESP32 Node's Relay Manager (`relays.h`).

## 1. Relay Architecture
The Relay Manager is designed as a non-blocking, state-aware driver for 6 critical actuators:
1.  Water Pump
2.  Fertilizer Pump
3.  High Pressure Pump
4.  Stirrer
5.  Flush Valve
6.  Alarm

**State Tracking**: 
To prevent excessive GPIO writes and to allow other systems to quickly query the current physical state of the hardware, all operations are cached in a globally accessible `RelayState` structure.

**Non-Blocking Design**:
The architecture strictly avoids the `delay()` function. All timing and timeout logic relies on differential comparisons against the ESP32's `millis()` timer. This guarantees the main loop continues to run at maximum speed, allowing instant responses to LoRa commands and sensor interrupts.

## 2. Active LOW Explanation
Industrial relay boards used with ESP32 microcontrollers typically employ **Active LOW** logic via opto-isolators. 
*   Writing `LOW` (0V) completes the LED circuit inside the opto-isolator, switching the physical relay **ON**.
*   Writing `HIGH` (3.3V) breaks the circuit, switching the physical relay **OFF**.

The Relay Manager abstracts this confusing logic. When calling `setWaterPump(true)`, the system internally handles flipping the logic to `LOW`, making the top-level application logic much easier to read and maintain. Furthermore, during boot initialization (`setupRelays`), the GPIO pins are explicitly driven `HIGH` *before* being set as `OUTPUT` to prevent the pumps from briefly turning on when the ESP32 resets.

## 3. Protection System
The Relay Manager introduces a continuous monitoring loop (`checkRelayProtections()`) that evaluates safety conditions:
*   **Timeout Protection**: A hardcoded absolute maximum runtime limit (`MAX_PUMP_RUNTIME_MS` - currently 10 minutes) protects against infinite loops or lost LoRa "off" commands. If a pump runs past this limit, it is autonomously shut down, and the alarm is triggered.
*   **Dry-Run Protection (Future)**: Placeholders exist to shut down the pump if it is running but the Flow Sensor reports zero movement (indicating a clogged pipe or empty tank).
*   **Overload Protection (Future)**: Placeholders exist to integrate ACS712 current sensors. If the motor draws excessive current (e.g., > 10 Amps due to a locked rotor), the system will halt to prevent electrical fires.

## 4. Emergency Shutdown
The `emergencyShutdown()` function instantly turns off all operational relays, turns on the Alarm, and sets the `emergencyMode` flag. When `emergencyMode` is active, the helper functions (`setWaterPump()`, etc.) will refuse to execute `ON` commands. This software lockout prevents external API commands from overriding a localized hardware emergency.

## 5. Future Expansion
To expand the relay system:
1.  **Add the GPIO**: Add the new pin in `config.h`.
2.  **Add State Tracking**: Add a boolean (and a start-time tracker if it's a pump) to the `RelayState` struct.
3.  **Add the Helper**: Clone `setWaterPump()` and rename it.
4.  **Add Protection**: If the device requires timeout protection, add a check inside `checkRelayProtections()`.
