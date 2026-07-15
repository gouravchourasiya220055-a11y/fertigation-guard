#include <Arduino.h>
#include "config.h"
#include "control.h"
#include "display.h"
#include "api_client.h"

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("\n=== Fertigation Guard ===");

  controlInit();
  displayInit();
  apiInit();

  Serial.println("System ready.");
}

void loop() {
  SystemStatus status = controlGetStatus();
  apiPollCommands(status);
  controlTick();
  status = controlGetStatus();

  apiSendTelemetry(status);
  displayUpdate(status);

  delay(200);
}
