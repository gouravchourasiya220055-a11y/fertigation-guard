#include <ArduinoJson.h>
#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "config.h"
#include "wifi_manager.h"
#include "lora_gateway.h"
#include "api_client.h"

unsigned long lastApiPullTime = 0;
String lastRelayState = "";
uint32_t currentMsgId = 1;

// Outbound packet queue state (for Gateway -> Node CMDs)
bool isWaitingAck = false;
uint32_t pendingMsgId = 0;
String pendingPayload = "";
unsigned long lastSendTime = 0;
int retryCount = 0;

void setup() {
    Serial.begin(115200);
    while (!Serial); // Wait for serial port
    
    Serial.println("\n--- ESP32 Gateway Controller Starting ---");
    
    setupWiFi();
    setupLoRa();
}

void loop() {
    // 1. Maintain WiFi connection (Non-blocking)
    checkWiFi();
    
    // 2. Process LoRa CMD Retries (Non-blocking)
    if (isWaitingAck) {
        if (millis() - lastSendTime >= LORA_ACK_TIMEOUT_MS) {
            if (retryCount < LORA_MAX_RETRIES) {
                Serial.print("Timeout waiting for ACK. Retrying CMD ");
                Serial.print(pendingMsgId);
                Serial.print(" (Attempt ");
                Serial.print(retryCount + 1);
                Serial.println(")...");
                
                sendLoRaPacketRaw(pendingPayload);
                lastSendTime = millis();
                retryCount++;
            } else {
                Serial.print("CMD Packet ");
                Serial.print(pendingMsgId);
                Serial.println(" failed after max retries. Dropped.");
                
                totalCmdPacketsFailed++;
                isWaitingAck = false; // Give up
                printCommStatus();
            }
        }
    }

    // 3. Receive incoming LoRa packets
    String incomingPacket = receiveLoRaPacket();
    if (incomingPacket.length() > 0) {
        int rssi = LoRa.packetRssi();
        Serial.print("Received packet (RSSI: ");
        Serial.print(rssi);
        Serial.print("): ");
        Serial.println(incomingPacket);
        
        JsonDocument doc;
        DeserializationError error = deserializeJson(doc, incomingPacket);
        
        if (!error) {
            String type = doc["type"] | "UNKNOWN";
            
            // Handle ACK packets from Node
            if (type == "ACK") {
                uint32_t ackId = doc["ackId"];
                if (isWaitingAck && ackId == pendingMsgId) {
                    Serial.print("ACK received for CMD ");
                    Serial.println(ackId);
                    isWaitingAck = false; // Successfully delivered!
                }
            }
            
            // Handle DATA (Sensor) packets from Node
            if (type == "DATA") {
                uint32_t msgId = doc["msgId"];
                
                // Immediately send an ACK back
                JsonDocument ackDoc;
                ackDoc["type"] = "ACK";
                ackDoc["ackId"] = msgId;
                String ackStr;
                serializeJson(ackDoc, ackStr);
                sendLoRaPacketRaw(ackStr);
                Serial.print("Sent ACK for DATA ");
                Serial.println(msgId);
                
                // Inject RSSI into the JSON before forwarding
                doc["rssi"] = rssi;
                String dataWithRssi;
                serializeJson(doc, dataWithRssi);
                
                // Forward sensor data to Node.js backend
                Serial.println("Forwarding DATA to backend...");
                sendSensorData(dataWithRssi);
            }
        } else {
            Serial.print("Failed to parse incoming JSON: ");
            Serial.println(error.c_str());
        }
    }
    
    // 4. Periodically pull relay commands from backend
    if (!isWaitingAck && (millis() - lastApiPullTime >= API_PULL_INTERVAL_MS)) {
        lastApiPullTime = millis();
        
        String currentRelayState = fetchRelayCommands();
        if (currentRelayState.length() > 0) {
            JsonDocument doc;
            DeserializationError error = deserializeJson(doc, currentRelayState);
            
            if (!error) {
                if (currentRelayState != lastRelayState) {
                    Serial.println("New relay command from backend.");
                    lastRelayState = currentRelayState;
                    
                    // Wrap the payload with protocol headers
                    doc["msgId"] = currentMsgId;
                    doc["type"] = "CMD";
                    
                    String cmdPayload;
                    serializeJson(doc, cmdPayload);
                    
                    Serial.print("Sending CMD packet: ");
                    Serial.println(cmdPayload);
                    
                    sendLoRaPacketRaw(cmdPayload);
                    
                    // Setup state for reliable transmission
                    pendingMsgId = currentMsgId;
                    pendingPayload = cmdPayload;
                    isWaitingAck = true;
                    lastSendTime = millis();
                    retryCount = 0;
                    
                    totalCmdPacketsSent++;
                    currentMsgId++;
                }
            } else {
                Serial.println("Invalid JSON received from backend for relays.");
            }
        }
    }
}
