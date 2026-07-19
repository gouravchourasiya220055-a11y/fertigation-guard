# Fertigation Guard v2.0 - Sensor Manager Architecture

This document details the redesign and structure of the ESP32 Node's Sensor Manager.

## Sensor Architecture
The Sensor Manager is split across two core files:
1.  **`sensors.h`**: Handles all analog data acquisition (pH, EC, TDS, Soil Moisture).
2.  **`flowsensor.h`**: Manages hardware interrupts and flow calculations for water and liquid fertilizer.

### Analog Acquisition (`sensors.h`)
To prevent erratic readings common in agricultural environments (electrical noise from pumps), all analog sensors now pass through a Moving Average Filter (`getAveragedADC`). 
*   **Filtering**: The ADC is read 10 times in quick succession.
*   **Validation**: The system automatically rejects dead voltages (0) and pegged values (4095) which indicate a disconnected wire or a short circuit.
*   **Non-Blocking**: The filter employs a very short 2ms delay per sample, allowing the entire 10-sample read to complete in ~20ms, preventing the main loop from stalling.

### Flow Calculation (`flowsensor.h`)
Flow sensors (like the YF-S201) generate rapid square-wave pulses as fluid spins an internal turbine.
*   **Interrupt Driven**: The ESP32 utilizes hardware interrupts (`IRAM_ATTR`) on falling edges to increment volatile pulse counters. This ensures no pulses are missed, regardless of what the main loop is doing.
*   **Time-Sliced Updating**: `updateFlowSensors()` is called continuously in the loop but only performs heavy floating-point math once per second.
*   **Atomic Reads**: When calculating flow, interrupts are briefly detached to prevent data corruption (race conditions) while reading multi-byte volatile variables.

## Calibration
Calibration constants are exposed at the top of the files, making it easy to tune the system during field deployment without digging through logic:
*   **`PH_NEUTRAL_VOLTAGE` & `PH_ACID_VOLTAGE`**: Two-point calibration for the pH probe.
*   **`EC_K_FACTOR`**: The cell constant multiplier for the EC probe.
*   **`TDS_FACTOR`**: Used to convert EC to Total Dissolved Solids (default `0.5` for NaCl).
*   **`WATER_FLOW_CALIBRATION_FACTOR`**: The pulse-to-liter ratio (default `7.5` for YF-S201).

## Future Expansion
To expand the sensor suite in the future:
1.  **I2C Sensors**: For sensors like the BME280 (Temperature/Humidity), create a new section in `sensors.h`, initialize the `Wire` library in `setupSensors()`, and add a dedicated `readTemperature()` function.
2.  **More Analog Sensors**: You can easily add more analog sensors (like light sensors) by replicating the `getAveragedADC()` pattern. Ensure you use ADC1 pins (Pins 32-39) if Wi-Fi is ever enabled on the node, as ADC2 is disabled when Wi-Fi is active.
3.  **EEPROM Calibration**: Currently, calibration constants are hardcoded. A future improvement would be saving these constants to EEPROM/Preferences so the system can be calibrated via an API or serial command without recompiling the firmware.
