#ifndef LORA_NODE_H
#define LORA_NODE_H
#include <Arduino.h>
#include <SPI.h>
#include <LoRa.h>
#include "config.h"

// Communication stats
unsigned long totalPacketsSent = 0;
unsigned long totalPacketsFailed = 0;

void setupLoRa() {
    Serial.println("Initializing LoRa on Node #1...");
    LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);
    
    if (!LoRa.begin(LORA_BAND)) {
        Serial.println("Starting LoRa failed!");
        while (1); // Halt if LoRa fails
    }
    
    // Long Range Optimizations
    LoRa.enableCrc();              // Enable hardware CRC
    LoRa.setTxPower(20);           // Max TX Power
    LoRa.setSpreadingFactor(9);    // Balanced long range (SF9)
    LoRa.setSignalBandwidth(125E3);// Standard bandwidth
    
    Serial.println("LoRa Initialization OK! (CRC enabled, SF9, 20dBm)");
}

void sendLoRaPacketRaw(const String& data) {
    LoRa.beginPacket();
    LoRa.print(data);
    LoRa.endPacket();
}

String receiveLoRaPacket() {
    String packet = "";
    int packetSize = LoRa.parsePacket();
    if (packetSize) {
        while (LoRa.available()) {
            packet += (char)LoRa.read();
        }
    }
    return packet;
}

float getPacketLoss() {
    if (totalPacketsSent == 0) return 0.0;
    return ((float)totalPacketsFailed / (float)totalPacketsSent) * 100.0;
}

void printCommStatus() {
    Serial.println("=== Comm Status ===");
    Serial.print("Total Sent: "); Serial.println(totalPacketsSent);
    Serial.print("Failed:     "); Serial.println(totalPacketsFailed);
    Serial.print("Loss Rate:  "); Serial.print(getPacketLoss()); Serial.println("%");
    Serial.println("===================");
}

#endif // LORA_NODE_H
