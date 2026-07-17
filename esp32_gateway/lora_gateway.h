#ifndef LORA_GATEWAY_H
#define LORA_GATEWAY_H
#include <Arduino.h>
#include <SPI.h>
#include <LoRa.h>
#include "config.h"

// Communication stats
unsigned long totalCmdPacketsSent = 0;
unsigned long totalCmdPacketsFailed = 0;

void setupLoRa() {
    Serial.println("Initializing LoRa on Gateway...");
    LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);
    
    if (!LoRa.begin(LORA_BAND)) {
        Serial.println("Starting LoRa failed!");
        return;
    }
    
    // Long Range Optimizations (must exactly match Node #1)
    LoRa.enableCrc();
    LoRa.setTxPower(20);
    LoRa.setSpreadingFactor(9);
    LoRa.setSignalBandwidth(125E3);
    
    Serial.println("LoRa Initialization OK! (CRC enabled, SF9, 20dBm)");
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

void sendLoRaPacketRaw(const String& data) {
    LoRa.beginPacket();
    LoRa.print(data);
    LoRa.endPacket();
}

float getPacketLoss() {
    if (totalCmdPacketsSent == 0) return 0.0;
    return ((float)totalCmdPacketsFailed / (float)totalCmdPacketsSent) * 100.0;
}

void printCommStatus() {
    Serial.println("=== Gateway Comm Status ===");
    Serial.print("Total CMD Sent: "); Serial.println(totalCmdPacketsSent);
    Serial.print("Failed CMDs:    "); Serial.println(totalCmdPacketsFailed);
    Serial.print("Loss Rate:      "); Serial.print(getPacketLoss()); Serial.println("%");
    Serial.println("===========================");
}

#endif // LORA_GATEWAY_H
