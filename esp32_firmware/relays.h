#ifndef RELAYS_H
#define RELAYS_H

#include "config.h"
#include <Arduino.h>

// Internal state of relays
bool state_relay1 = false;
bool state_relay2 = false;
bool state_relay3 = false;
bool state_relay4 = false;
bool state_relay5 = false;
bool state_relay6 = false;

void initRelays() {
  pinMode(PIN_RELAY_1, OUTPUT);
  pinMode(PIN_RELAY_2, OUTPUT);
  pinMode(PIN_RELAY_3, OUTPUT);
  pinMode(PIN_RELAY_4, OUTPUT);
  pinMode(PIN_RELAY_5, OUTPUT);
  pinMode(PIN_RELAY_6, OUTPUT);

  // Set all to LOW initially (Assuming Active HIGH. Change to HIGH if your relay module is Active LOW)
  digitalWrite(PIN_RELAY_1, LOW);
  digitalWrite(PIN_RELAY_2, LOW);
  digitalWrite(PIN_RELAY_3, LOW);
  digitalWrite(PIN_RELAY_4, LOW);
  digitalWrite(PIN_RELAY_5, LOW);
  digitalWrite(PIN_RELAY_6, LOW);
}

void updateRelay(int relayPin, bool state) {
  // Toggle standard Relay (Active HIGH assumed)
  digitalWrite(relayPin, state ? HIGH : LOW);
}

void applyRelayStates() {
  updateRelay(PIN_RELAY_1, state_relay1);
  updateRelay(PIN_RELAY_2, state_relay2);
  updateRelay(PIN_RELAY_3, state_relay3);
  updateRelay(PIN_RELAY_4, state_relay4);
  updateRelay(PIN_RELAY_5, state_relay5);
  updateRelay(PIN_RELAY_6, state_relay6);
}

#endif // RELAYS_H
