/**
 * @file lora_node.h
 * @brief LoRa communication handling for the ESP32 Node.
 */
#ifndef LORA_NODE_H
#define LORA_NODE_H

#include <Arduino.h>
#include <SPI.h>
#include <LoRa.h>
#include "config.h"

// Communication stats
__attribute__((weak)) unsigned long totalPacketsSent = 0;
__attribute__((weak)) unsigned long totalPacketsFailed = 0;

/**
 * @brief Initializes the LoRa module with maximum reliability settings.
 */
inline void setupLoRa()
{
    Serial.println("Initializing LoRa on Node...");

    LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);

    if (!LoRa.begin(LORA_BAND))
    {
        Serial.println("LoRa Start Failed!");
        while (1);
    }

    LoRa.setSPIFrequency(4000000);
    LoRa.enableCrc();
    LoRa.setTxPower(20);
    LoRa.setSpreadingFactor(9);
    LoRa.setSignalBandwidth(125E3);
    LoRa.setCodingRate4(5);

    // Start receiver mode
    LoRa.receive();

    Serial.println("LoRa Ready");
}

/**
 * @brief Sends a packet over LoRa and returns to receive mode.
 * @param payload The string payload to send.
 * @return true if successful.
 */
inline bool sendPacket(String payload)
{
    LoRa.idle(); // Switch to standby before TX
    LoRa.beginPacket();
    LoRa.print(payload);
    LoRa.endPacket();
    LoRa.receive(); // Automatically return to receive mode
    return true;
}

/**
 * @brief Reads a LoRa packet safely, ignoring empty packets.
 * @return The payload string, or empty string if no valid packet.
 */
inline String receivePacket()
{
    int packetSize = LoRa.parsePacket();
    if (packetSize == 0) return "";
    
    String payload = "";
    while (LoRa.available())
    {
        payload += (char)LoRa.read();
    }
    return payload;
}

/**
 * @brief Gets the RSSI of the last received packet.
 * @return RSSI in dBm.
 */
inline int getRSSI()
{
    return LoRa.packetRssi();
}

/**
 * @brief Gets the SNR of the last received packet.
 * @return SNR in dB.
 */
inline float getSNR()
{
    return LoRa.packetSnr();
}

/**
 * @brief Legacy function to send a raw LoRa packet. Wraps sendPacket to prevent code duplication.
 * @param data The string data to send.
 */
inline void sendLoRaPacketRaw(const String &data)
{
    sendPacket(data);
    totalPacketsSent++;
}

/**
 * @brief Legacy function to receive a LoRa packet. Wraps receivePacket to prevent code duplication.
 * @return The received packet string.
 */
inline String receiveLoRaPacket()
{
    return receivePacket();
}

/**
 * @brief Calculates the packet loss percentage.
 * @return Packet loss percentage.
 */
inline float getPacketLoss()
{
    if (totalPacketsSent == 0)
        return 0;

    return ((float)totalPacketsFailed / totalPacketsSent) * 100.0;
}

/**
 * @brief Prints communication statistics to Serial.
 */
inline void printCommStatus()
{
    Serial.println("========== NODE ==========");
    Serial.print("Sent      : ");
    Serial.println(totalPacketsSent);

    Serial.print("Failed    : ");
    Serial.println(totalPacketsFailed);

    Serial.print("Loss Rate : ");
    Serial.print(getPacketLoss());
    Serial.println("%");

    Serial.println("==========================");
}

#endif