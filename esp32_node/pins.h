#ifndef PINS_H
#define PINS_H

// ----------------------------------------
// LoRa Configuration
// ----------------------------------------
#define LORA_SS           5     // Slave Select pin for LoRa
#define LORA_RST          16    // Reset pin for LoRa module (Moved from 14 to avoid conflict)
#define LORA_DIO0         17    // DIO0 interrupt pin for LoRa (Moved from 26 to avoid conflict)

// ----------------------------------------
// Sensor Configuration (Analog)
// ----------------------------------------
#define PIN_SOIL_MOISTURE 34    // Soil Moisture
#define PIN_PH_SENSOR     35    // pH Sensor
#define PIN_TDS_SENSOR    32    // TDS Sensor

// ----------------------------------------
// Flow Sensor Configuration (Digital Interrupts)
// ----------------------------------------
#define PIN_FLOW_MIXED      33  // Flow Sensor 1 (Mixed Water + Fertilizer)
#define PIN_FLOW_WATER      18  // Flow Sensor 2 (Water Supply Line)
#define PIN_FLOW_FERTILIZER 19  // Flow Sensor 3 (Fertilizer Line)

// ----------------------------------------
// Relay Configuration
// ----------------------------------------
#define PIN_RELAY_WATER_PUMP    13  // Relay1 -> Water Pump
#define PIN_RELAY_FERT_PUMP     12  // Relay2 -> Fertilizer Pump
#define PIN_RELAY_STIRRER       14  // Relay3 -> Stirrer Motor
#define PIN_RELAY_MAIN_PUMP     27  // Relay4 -> Main Irrigation Pump
#define PIN_RELAY_BASE_PUMP     26  // Relay5 -> Base Pump (pH Correction)
#define PIN_RELAY_DRAIN_VALVE   25  // Relay6 -> Drain Solenoid Valve

#endif // PINS_H
