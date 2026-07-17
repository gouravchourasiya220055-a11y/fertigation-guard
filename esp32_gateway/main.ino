#include <ArduinoJson.h>
#include "config.h"
#include "wifi_manager.h"
#include "lora_gateway.h"
#include "api_client.h"

unsigned long lastApiPullTime = 0;
String lastRelayState = "";

void setup() {
    Serial.begin(115200);
    while (!Serial); // Wait for serial port to connect
    
    Serial.println("\n--- ESP32 Gateway Controller Starting ---");
    
    setupWiFi();
    setupLoRa();
}

void loop() {
    // 1. Maintain WiFi connection (Non-blocking)
    checkWiFi();
    
    // 2. Check for incoming LoRa packets from ESP32 #1
    String incomingPacket = receiveLoRaPacket();
    if (incomingPacket.length() > 0) {
        Serial.println("Parsing incoming LoRa packet...");
        
        // Use JsonDocument for ArduinoJson v7+ (also compatible with v6 as StaticJsonDocument)
        // If using ArduinoJson v6, you might want to use StaticJsonDocument<512> doc;
        JsonDocument doc; 
        DeserializationError error = deserializeJson(doc, incomingPacket);
        
        if (error) {
            Serial.print("deserializeJson() failed: ");
            Serial.println(error.c_str());
        } else {
            Serial.println("Valid JSON received. Forwarding to Node.js backend...");
            // Send sensor data to POST /api/sensors
            sendSensorData(incomingPacket);
        }
    }
    
    // 3. Periodically pull relay commands from backend
    if (millis() - lastApiPullTime >= API_PULL_INTERVAL_MS) {
        lastApiPullTime = millis();
        
        String currentRelayState = fetchRelayCommands();
        if (currentRelayState.length() > 0) {
            // Check if it's a valid JSON before forwarding (optional but good practice)
            JsonDocument doc;
            DeserializationError error = deserializeJson(doc, currentRelayState);
            
            if (!error) {
                // Compare with last state to avoid spamming ESP32 #1 over LoRa
                if (currentRelayState != lastRelayState) {
                    Serial.println("New relay command received from backend.");
                    lastRelayState = currentRelayState;
                    
                    // Forward relay commands to ESP32 #1 through LoRa
                    sendLoRaPacket(currentRelayState);
                }
            } else {
                Serial.println("Invalid JSON received from backend for relays.");
            }
        }
    }
}
