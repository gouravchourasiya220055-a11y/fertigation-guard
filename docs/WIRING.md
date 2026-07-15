# Fertigation Guard — Wiring Guide

## Power

```
12V SMPS
   |
   +--- Water Pump (via Relay 1)
   |
   +--- Base Pump (via Relay 2)
   |
   +--- Fertilizer Pump (via Relay 3)
   |
   +--- Flush Solenoid 12V NC (via Relay 4)
   |
   +--- LM2596 Buck Converter
           |
         5V Output
           |
   +-------+-------+-------+
   |       |       |       |
 ESP32  Relay   LCD    Sensors
 Module Module  I2C
```

## ESP32 GPIO Map

| GPIO | Function        | Notes                    |
| ---- | --------------- | ------------------------ |
| 25   | Relay 1         | Water Pump               |
| 26   | Relay 2         | Base Pump                |
| 27   | Relay 3         | Fertilizer Pump          |
| 14   | Relay 4         | Flush Solenoid Valve     |
| 12   | Relay 5         | Stirrer Motor (optional) |
| 13   | Relay 6         | Spare / Alarm            |
| 34   | pH Sensor AO    | Input only               |
| 35   | TDS Sensor AO   | Input only               |
| 21   | I2C SDA         | 20x4 LCD                 |
| 22   | I2C SCL         | 20x4 LCD                 |

## Sensor Connections

### pH Sensor Module

```
VCC → 5V
GND → GND
AO  → GPIO34
```

### TDS Meter V1.0

```
VCC → 5V
GND → GND
AO  → GPIO35
```

### 20x4 I2C LCD

```
VCC → 5V
GND → GND
SDA → GPIO21
SCL → GPIO22
```

## Relay Module

Use a **4+2 channel relay module** with **active-LOW** inputs (common on ESP32 boards). Each relay output switches the 12V load for pumps and solenoid.

**Important:** Never drive pumps directly from ESP32 pins — always use relays with appropriate flyback protection.

## Tank Layout

```
Tank-1 (Water) ──► Water Pump ──► Tank-4 (Mixing)
                                      │
                    pH + TDS sensors  │
                                      │
         Tank-2 (Base) ──► Base Pump ─┤
         Tank-3 (Fert) ──► Fert Pump ─┘
                                      │
                                      ▼
                              Drip Irrigation
                                      │
                              Flush Valve (Relay 4)
```

## Safety Notes

1. Use a **normally-closed (NC)** solenoid for flush so power loss does not leave the line open under pressure.
2. Calibrate pH sensor with buffer solutions (pH 4.0 and 7.0) before deployment.
3. Calibrate TDS with a known EC reference solution.
4. Add float switches on base/fertilizer tanks for low-level alerts (GPIO inputs — extend in firmware).
5. Only a **base tank** is wired — the system can **raise pH only**. For bidirectional pH control, add a separate acid dosing tank and relay.
