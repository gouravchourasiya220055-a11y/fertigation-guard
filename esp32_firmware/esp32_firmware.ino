#include "config.h"
#include "wifi_manager.h"
#include "relays.h"
#include "sensors.h"
#include "api_client.h"

// Non-blocking timer tracking variable
unsigned long lastPollTime = 0;

void setup() {
  // Initialize Serial for logging
  Serial.begin(115200);
  delay(1000); // Give serial monitor time to connect
  
  Serial.println("\n=============================================");
  Serial.println("  Starting Smart Fertigation Guard ESP32");
  Serial.println("=============================================\n");

  // Initialize Hardware
  initRelays();
  initSensors();
  
  // Connect to Network
  setupWiFi();
}

void loop() {
  unsigned long currentMillis = millis();

  // Non-blocking 2-second interval timer
  if (currentMillis - lastPollTime >= POLLING_INTERVAL_MS) {
    lastPollTime = currentMillis;

    // 1. Ensure connectivity (auto-reconnect if dropped)
    checkWiFiConnection();

    // 2. Read physical sensors (pH, EC, Soil Moisture)
    readSensors();

    // 3. Post sensor and current relay data back to node.js backend
    postSensorData();

    // 4. Fetch the latest target relay commands from node.js backend
    fetchRelayCommands();
    
    Serial.println("---------------------------------------------");
  }

  // Other non-blocking tasks could go here
}
