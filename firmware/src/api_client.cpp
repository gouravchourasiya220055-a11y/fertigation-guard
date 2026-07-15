#include "api_client.h"
#include "config.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

static unsigned long lastTelemetry = 0;
static unsigned long lastCommandPoll = 0;

void apiInit() {
#if !SIMULATION_MODE
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting WiFi");
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  Serial.println();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("WiFi OK: ");
    Serial.println(WiFi.localIP());
  }
#else
  Serial.println("Simulation mode — API over WiFi skipped unless connected");
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  delay(3000);
#endif
}

static String serverUrl(const char* path) {
  return String("http://") + SERVER_HOST + ":" + SERVER_PORT + path;
}

void apiSendTelemetry(const SystemStatus& s) {
  if (millis() - lastTelemetry < TELEMETRY_INTERVAL) return;
  lastTelemetry = millis();

  if (WiFi.status() != WL_CONNECTED) return;

  JsonDocument doc;
  doc["deviceId"] = "esp32-fertigation-1";
  doc["ph"] = s.sensors.ph;
  doc["ec"] = s.sensors.ec;
  doc["phValid"] = s.sensors.phValid;
  doc["ecValid"] = s.sensors.ecValid;
  doc["mode"] = modeToString(s.mode);
  doc["phase"] = phaseToString(s.phase);
  doc["crop"] = s.crop.name;
  doc["targetPh"] = s.crop.targetPh;
  doc["targetEc"] = s.crop.targetEc;
  doc["waterPump"] = s.relays.waterPump;
  doc["basePump"] = s.relays.basePump;
  doc["fertPump"] = s.relays.fertPump;
  doc["flushValve"] = s.relays.flushValve;
  doc["stirrer"] = s.relays.stirrer;
  doc["tankLevelOk"] = s.tankLevelOk;

  String body;
  serializeJson(doc, body);

  HTTPClient http;
  http.begin(serverUrl("/api/telemetry"));
  http.addHeader("Content-Type", "application/json");
  int code = http.POST(body);
  if (code > 0) Serial.printf("Telemetry POST: %d\n", code);
  http.end();
}

void apiPollCommands(SystemStatus& status) {
  if (millis() - lastCommandPoll < 2000) return;
  lastCommandPoll = millis();

  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(serverUrl("/api/device/commands?deviceId=esp32-fertigation-1"));
  int code = http.GET();
  if (code != 200) {
    http.end();
    return;
  }

  String payload = http.getString();
  http.end();

  JsonDocument doc;
  if (deserializeJson(doc, payload)) return;

  if (doc["mode"].is<const char*>()) {
    const char* m = doc["mode"];
    controlSetMode(strcmp(m, "AUTO") == 0 ? MODE_AUTO : MODE_MANUAL);
  }

  if (doc["crop"].is<JsonObject>()) {
    CropSettings c = status.crop;
    strlcpy(c.name, doc["crop"]["name"] | c.name, sizeof(c.name));
    c.targetPh = doc["crop"]["targetPh"] | c.targetPh;
    c.targetEc = doc["crop"]["targetEc"] | c.targetEc;
    c.phTolerance = doc["crop"]["phTolerance"] | c.phTolerance;
    c.ecTolerance = doc["crop"]["ecTolerance"] | c.ecTolerance;
    c.flushSec = doc["crop"]["flushSec"] | c.flushSec;
    c.doseDelayMs = doc["crop"]["doseDelayMs"] | c.doseDelayMs;
    controlSetCrop(c);
  }

  if (status.mode == MODE_MANUAL && doc["relays"].is<JsonObject>()) {
    JsonObject r = doc["relays"];
    if (r["waterPump"].is<bool>()) controlManualRelay(RELAY_WATER, r["waterPump"]);
    if (r["basePump"].is<bool>()) controlManualRelay(RELAY_BASE, r["basePump"]);
    if (r["fertPump"].is<bool>()) controlManualRelay(RELAY_FERT, r["fertPump"]);
    if (r["flushValve"].is<bool>()) controlManualRelay(RELAY_FLUSH, r["flushValve"]);
    if (r["stirrer"].is<bool>()) controlManualRelay(RELAY_STIRRER, r["stirrer"]);
  }

  if (doc["startCycle"].is<bool>() && doc["startCycle"].as<bool>()) {
    controlSetMode(MODE_AUTO);
    status.phase = PHASE_IDLE;
  }
}
