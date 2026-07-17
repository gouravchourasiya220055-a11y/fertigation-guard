#ifndef API_CLIENT_H
#define API_CLIENT_H

#include <HTTPClient.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include "config.h"

void sendSensorData(const String& jsonData) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        String url = String(API_BASE_URL) + "/sensors";
        Serial.print("Sending POST request to: ");
        Serial.println(url);
        
        http.begin(url);
        http.addHeader("Content-Type", "application/json");
        
        int httpResponseCode = http.POST(jsonData);
        
        if (httpResponseCode > 0) {
            Serial.print("HTTP POST Response code: ");
            Serial.println(httpResponseCode);
            String response = http.getString();
            Serial.println("Response body: " + response);
        } else {
            Serial.print("Error code: ");
            Serial.println(httpResponseCode);
        }
        
        http.end();
    } else {
        Serial.println("WiFi disconnected, cannot send sensor data.");
    }
}

String fetchRelayCommands() {
    String payload = "";
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        String url = String(API_BASE_URL) + "/relays";
        
        http.begin(url);
        
        int httpResponseCode = http.GET();
        
        if (httpResponseCode > 0) {
            if (httpResponseCode == 200) {
                payload = http.getString();
            } else {
                Serial.print("HTTP GET Response code: ");
                Serial.println(httpResponseCode);
            }
        } else {
            Serial.print("Error GET code: ");
            Serial.println(httpResponseCode);
        }
        
        http.end();
    }
    return payload;
}

#endif // API_CLIENT_H
