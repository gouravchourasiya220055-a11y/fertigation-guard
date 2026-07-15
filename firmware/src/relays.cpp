#include "relays.h"
#include "config.h"

static const uint8_t RELAY_PINS[RELAY_COUNT] = {
  PIN_RELAY_WATER, PIN_RELAY_BASE, PIN_RELAY_FERT,
  PIN_RELAY_FLUSH, PIN_RELAY_STIRRER, PIN_RELAY_ALARM
};

static bool relayStates[RELAY_COUNT] = {};

void relaysInit() {
  for (int i = 0; i < RELAY_COUNT; i++) {
    pinMode(RELAY_PINS[i], OUTPUT);
    digitalWrite(RELAY_PINS[i], HIGH); // OFF (active low)
    relayStates[i] = false;
  }
}

void relaySet(RelayId id, bool on) {
  if (id >= RELAY_COUNT) return;
  relayStates[id] = on;
  digitalWrite(RELAY_PINS[id], on ? LOW : HIGH);
}

bool relayGet(RelayId id) {
  if (id >= RELAY_COUNT) return false;
  return relayStates[id];
}

void relaysAllOff() {
  for (int i = 0; i < RELAY_COUNT; i++) {
    relaySet((RelayId)i, false);
  }
}

RelayState relaysSnapshot() {
  return {
    relayStates[RELAY_WATER],
    relayStates[RELAY_BASE],
    relayStates[RELAY_FERT],
    relayStates[RELAY_FLUSH],
    relayStates[RELAY_STIRRER],
    relayStates[RELAY_ALARM]
  };
}
