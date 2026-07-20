#ifndef API_CLIENT_H
#define API_CLIENT_H

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "config.h"

inline void sendSensorData(const String &jsonData)
{
    if (WiFi.status() != WL_CONNECTED) return;

    HTTPClient http;

    String url = String(API_BASE_URL) + "/api/telemetry";

    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    int code = http.POST(jsonData);

    Serial.print("POST Code: ");
    Serial.println(code);

    if (code > 0)
    {
        Serial.println(http.getString());
    }

    http.end();
}

inline String fetchRelayCommands()
{
    String payload = "";

    if (WiFi.status() != WL_CONNECTED)
        return payload;

    HTTPClient http;

    String url = String(API_BASE_URL) + "/api/commands";

    http.begin(url);

    int code = http.GET();

    if (code == 200)
    {
        payload = http.getString();
    }

    http.end();

    return payload;
}

#endif