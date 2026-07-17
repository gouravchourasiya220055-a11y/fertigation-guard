#include <ArduinoJson.h>
#include <Arduino.h>
#include "config.h"
#include "sensors.h"
#include "relays.h"
#include "lora_node.h"

unsigned long lastSensorReadTime = 0;
uint32_t currentMsgId = 1;

// Outbound packet queue state (size 1 for simplicity)
bool isWaitingAck = false;
uint32_t pendingMsgId = 0;
String pendingPayload = "";
unsigned long lastSendTime = 0;
int retryCount = 0;

void setup() {
    Serial.begin(115200);
    while (!Serial); // Wait for serial port
    
    Serial.println("\n--- ESP32 Sensor Node (Node #1) Starting ---");
    
    setupSensors();
    setupRelays();
    setupLoRa();
}

void loop() {
    // 1. Process LoRa Retries (Non-blocking)
    if (isWaitingAck) {
        if (millis() - lastSendTime >= LORA_ACK_TIMEOUT_MS) {
            if (retryCount < LORA_MAX_RETRIES) {
                Serial.print("Timeout waiting for ACK. Retrying packet ");
                Serial.print(pendingMsgId);
                Serial.print(" (Attempt ");
                Serial.print(retryCount + 1);
                Serial.println(")...");
                
                sendLoRaPacketRaw(pendingPayload);
                lastSendTime = millis();
                retryCount++;
            } else {
                Serial.print("Packet ");
                Serial.print(pendingMsgId);
                Serial.println(" failed after max retries. Dropped.");
                
                totalPacketsFailed++;
                isWaitingAck = false; // Give up
                printCommStatus();
            }
        }
    }

    // 2. Receive incoming LoRa packets
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
            
            // Handle ACK packets from Gateway
            if (type == "ACK") {
                uint32_t ackId = doc["ackId"];
                if (isWaitingAck && ackId == pendingMsgId) {
                    Serial.print("ACK received for packet ");
                    Serial.println(ackId);
                    isWaitingAck = false; // Successfully delivered!
                }
            }
            
            // Handle CMD (Relay) packets from Gateway
            if (type == "CMD") {
                uint32_t msgId = doc["msgId"];
                
                // Immediately send an ACK back
                JsonDocument ackDoc;
                ackDoc["type"] = "ACK";
                ackDoc["ackId"] = msgId;
                String ackStr;
                serializeJson(ackDoc, ackStr);
                sendLoRaPacketRaw(ackStr);
                Serial.print("Sent ACK for CMD ");
                Serial.println(msgId);
                
                // Control relays instantly
                if (doc.containsKey("waterPump")) controlRelay(PIN_WATER_PUMP, doc["waterPump"]);
                if (doc.containsKey("peristalticPump")) controlRelay(PIN_FERTILIZER, doc["peristalticPump"]);
                if (doc.containsKey("highPressurePump")) controlRelay(PIN_HIGH_PRESS, doc["highPressurePump"]);
                if (doc.containsKey("stirrer")) controlRelay(PIN_STIRRER, doc["stirrer"]);
                if (doc.containsKey("flushValve")) controlRelay(PIN_FLUSH_VALVE, doc["flushValve"]);
                if (doc.containsKey("relay6") || doc.containsKey("alarm")) {
                    bool alarmState = doc.containsKey("relay6") ? doc["relay6"] : doc["alarm"];
                    controlRelay(PIN_ALARM, alarmState);
                }
                Serial.println("Relays updated.");
            }
        } else {
            Serial.print("Failed to parse JSON: ");
            Serial.println(error.c_str());
        }
    }
    
    // 3. Read and send sensor data every interval
    if (!isWaitingAck && (millis() - lastSensorReadTime >= SENSOR_READ_INTERVAL_MS)) {
        lastSensorReadTime = millis();
        
        float ph = readpH();
        float ec = readEC();
        float soil = readSoilMoisture();
        
        JsonDocument doc;
        doc["msgId"] = currentMsgId;
        doc["type"] = "DATA";
        doc["deviceId"] = DEVICE_ID;
        doc["ph"] = ph;
        doc["ec"] = ec;
        doc["soilMoisture"] = soil;
        
        String jsonPayload;
        serializeJson(doc, jsonPayload);
        
        Serial.print("Sending DATA packet: ");
        Serial.println(jsonPayload);
        
        sendLoRaPacketRaw(jsonPayload);
        
        // Setup state for reliable transmission
        pendingMsgId = currentMsgId;
        pendingPayload = jsonPayload;
        isWaitingAck = true;
        lastSendTime = millis();
        retryCount = 0;
        
        totalPacketsSent++;
        currentMsgId++;
    }
}
