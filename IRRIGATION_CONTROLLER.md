# Fertigation Guard v2.0 - Irrigation Controller

This document outlines the design, state machine, and automation logic of the central Irrigation Controller for the ESP32 Node.

## State Machine
The core of the Irrigation Controller is a non-blocking Finite State Machine (FSM) that dictates exactly what physical actions the node is performing. The states are defined in the `ControllerState` enum:

1.  **`IDLE`**: The system is monitoring sensors but actively doing nothing. Relays are off.
2.  **`PREPARE`**: Triggered when irrigation is needed. Used as a placeholder to pre-mix chemicals or correct pH before pumping begins.
3.  **`IRRIGATING`**: Main water pump and high-pressure pump are active. Supplying pure water to the field.
4.  **`FERTIGATING`**: Same as `IRRIGATING`, but the fertilizer pump and stirrer are activated to inject nutrients into the water stream.
5.  **`FLUSHING`**: Irrigation is done. The flush valve is opened to clear the lines of any residual fertilizer to prevent clogging and algae growth.
6.  **`COMPLETE`**: Cycle is fully finalized. Flow counters are reset, and the system prepares to return to `IDLE`.
7.  **`EMERGENCY`**: A hard-locked state triggered by hardware failure or manual intervention. Requires manual reset.

## Automatic Logic
In `MODE_AUTOMATIC`, the state machine navigates autonomously:
*   **Trigger**: If the soil moisture drops below `SOIL_MOISTURE_START_THRESHOLD` (e.g., 40%), the system shifts from `IDLE` to `PREPARE` and then `IRRIGATING`.
*   **Fertigation Trigger**: While `IRRIGATING`, if the Electrical Conductivity (EC) of the water drops below the target (`TARGET_EC_MIN`), the system shifts to `FERTIGATING` to inject nutrients.
*   **Fertigation Stop**: Once the EC reaches the target, it drops back to `IRRIGATING`.
*   **Stop**: Once the soil moisture reaches `SOIL_MOISTURE_STOP_THRESHOLD` (e.g., 80%), the pumps shut down, and the system shifts to `FLUSHING` for a fixed duration (e.g., 10 seconds), before finishing the cycle.

## Sensor Usage
The controller polls the Sensor Manager (`sensors.h` and `flow_sensors.h`) continuously. It relies heavily on:
*   **Soil Moisture**: The primary environmental trigger for the state machine.
*   **EC (Electrical Conductivity)**: The primary trigger for toggling the fertilizer pump on and off to maintain a specific nutrient concentration.
*   **pH**: Currently monitored in the `PREPARE` phase. Future logic will use this to inject pH Up/Down solutions.

## Relay Usage
The controller interacts strictly with the Relay Manager (`relays.h`), abstracting away raw GPIO writes.
*   `setWaterPump()` & `setHighPressurePump()`: Toggled during `IRRIGATING` and `FERTIGATING`.
*   `setFertilizerPump()` & `setStirrer()`: Toggled only during `FERTIGATING`.
*   `setFlushValve()`: Toggled only during `FLUSHING`.

## Safety
Safety is enforced structurally:
*   **Non-Blocking**: The controller contains exactly zero `delay()` calls. All timers (like the 10-second flush) use differential `millis()` logic. This ensures sensors are constantly monitored and LoRa commands can be processed instantly.
*   **Emergency Mode**: Calling `emergencyStop()` immediately triggers the Relay Manager's `emergencyShutdown()` which cuts power to all actuators and locks out all software `ON` commands until manually reset.
*   **Delegated Protection**: The controller relies on the `updateRelayManager()` to automatically shut off pumps if they exceed the absolute maximum runtime (e.g., 10 minutes), preventing floods if a sensor fails.

## Future AI Integration
The current threshold-based logic is deterministic but rigid. In future iterations, this controller is designed to support AI integration:
1.  **Dynamic Thresholds**: The Gateway (acting as an Edge AI device) can send LoRa commands to dynamically adjust `SOIL_MOISTURE_START_THRESHOLD` based on weather forecasts (e.g., lower the threshold if rain is predicted tomorrow).
2.  **Predictive Yielding**: Machine Learning models on the backend can analyze the relationship between `getWaterFlowRate()`, `getTotalFertilizer()`, and daily yield, adjusting the `TARGET_EC_MIN` curve over the 3-month growth cycle of the crop.
3.  **Anomaly Detection**: If the controller requests `setWaterPump(true)` but the AI notices that `getWaterFlowRate()` remains at `0`, the system can infer a burst pipe or clogged filter and trigger an `EMERGENCY` state autonomously.
