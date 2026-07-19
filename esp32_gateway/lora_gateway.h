/**
 * @file lora_gateway.h
 * @brief LoRa communication handling for the ESP32 Gateway.
 */
#ifndef LORA_GATEWAY_H
#define LORA_GATEWAY_H

#include <Arduino.h>
#include <SPI.h>
#include <LoRa.h>
#include "config.h"

/**
 * @brief Initializes the LoRa module with maximum reliability settings.
 */
inline void setupLoRa()
{
    Serial.println("Initializing LoRa...");

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
}

/**
 * @brief Legacy function to receive a LoRa packet. Wraps receivePacket to prevent code duplication.
 * @return The received packet string.
 */
inline String receiveLoRaPacket()
{
    return receivePacket();
}

#endif