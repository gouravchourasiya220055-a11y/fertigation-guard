# Fertigation Guard v2.0 - Field Deployment Checklist

Before installing the ESP32 Node and Gateway in a live agricultural environment, complete the following deployment checklist to ensure total system integrity. 

---

## 1. Hardware Checklist
- [ ] ESP32 boards (Node & Gateway) securely mounted in IP67-rated waterproof enclosures.
- [ ] Antennas properly connected before powering on the boards (to prevent LoRa transceiver burn-out).
- [ ] Heat sinks attached to voltage regulators if operating in direct sunlight > 40°C.
- [ ] Desiccant packets placed inside the enclosures to prevent condensation.

## 2. Power Checklist
- [ ] Solar panels (if applicable) oriented correctly and generating > 12V under load.
- [ ] Batteries fully charged.
- [ ] Gateway connected to a stable 5V / 2A clean power supply (to prevent brownouts during WiFi bursts).
- [ ] Verify `ESP.getFreeHeap()` stays stable under full load (checked via diagnostic report).

## 3. Relay Checklist
- [ ] Water Pump contactor wired to normally-open (NO).
- [ ] Fertilizer Pump / Dosing valves wired to normally-closed (NC) to fail-safe shut.
- [ ] High Pressure pump relays shielded with flyback diodes/snubbers to prevent inductive kickback from resetting the ESP32.
- [ ] Relay emergency shutdown tested (`STOP_ALL` command).

## 4. Sensor Calibration
- [ ] pH Sensor calibrated using 4.01 and 6.86 standard buffer solutions. Calibration offsets stored via Config Manager.
- [ ] EC Sensor calibrated using a 1413 µS/cm standard solution. TDS factor adjusted (typically 0.5 for agriculture).
- [ ] Soil moisture probes inserted at the correct root depth. 0% (Air) and 100% (Water) mapped in `sensors.h`.

## 5. Flow Calibration
- [ ] Flow sensor pulses-per-liter configured correctly based on the pipe diameter.
- [ ] Run 10 Liters of water manually and verify the telemetry reports ~10 Liters total. Adjust `flowCalibration` via Config Manager if necessary.

## 6. Connectivity Tests
- **LoRa Test**:
  - [ ] Node and Gateway positioned at extreme ends of the field.
  - [ ] `RSSI` must be > -110 dBm. `SNR` must be > -10.
  - [ ] Packet loss over 1 hour should be < 2%.
- **WiFi Test (Gateway)**:
  - [ ] Connect Gateway to router. Verify connection recovery after pulling router power for 5 minutes.
- **API Test**:
  - [ ] Verify telemetry packets are appearing in the cloud database every 10 seconds.
  - [ ] Send a `SET_PH 6.0` command from the dashboard. Verify the Node acknowledges and updates RAM.

## 7. OTA Test
- [ ] Compile a dummy update (v1.0.1) and push to the cloud bucket.
- [ ] Trigger an OTA update and verify the Node successfully flashes, reboots, and reconnects without manual intervention.

## 8. Safety & Emergency Test
- [ ] Induce a sensor failure (disconnect pH probe). Verify the Health Manager throws `ERR_SENSOR_FAIL` and halts dosing.
- [ ] Induce a LoRa failure (turn off Gateway). Verify the Node gracefully flushes the pipes and halts irrigation after missing 3 consecutive heartbeats.

## 9. Field Test Sign-off
- [ ] **Final Diagnostic Report** generated and saved.
- [ ] **Minimum Heap** confirmed stable > 25,000 bytes over a 24-hour burn-in.
- [ ] Enclosure sealed, cables zip-tied, solar panels cleaned.
