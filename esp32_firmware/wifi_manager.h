#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <WiFi.h>
#include "config.h"

void setupWiFi() {

  WiFi.mode(WIFI_STA);
  WiFi.disconnect(true);
  delay(1000);

  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int retry = 0;

  while (WiFi.status() != WL_CONNECTED && retry < 30) {
    delay(500);
    Serial.print(".");
    retry++;
  }

  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {

    Serial.println("=================================");
    Serial.println("WiFi Connected Successfully");
    Serial.print("IP Address : ");
    Serial.println(WiFi.localIP());
    Serial.print("RSSI : ");
    Serial.println(WiFi.RSSI());
    Serial.println("=================================");

  } else {

    Serial.println("=================================");
    Serial.println("WiFi Connection Failed");
    Serial.print("Status Code : ");
    Serial.println(WiFi.status());
    Serial.println("=================================");

  }
}

void checkWiFiConnection() {

  if (WiFi.status() != WL_CONNECTED) {

    Serial.println("Reconnecting WiFi...");

    WiFi.disconnect();
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  }

}

#endif