#pragma once
#include <Arduino.h>

enum RelayId {
  RELAY_WATER = 0,
  RELAY_BASE,
  RELAY_FERT,
  RELAY_FLUSH,
  RELAY_STIRRER,
  RELAY_ALARM,
  RELAY_COUNT
};

struct RelayState {
  bool waterPump;
  bool basePump;
  bool fertPump;
  bool flushValve;
  bool stirrer;
  bool alarm;
};

void relaysInit();
void relaySet(RelayId id, bool on);
bool relayGet(RelayId id);
void relaysAllOff();
RelayState relaysSnapshot();
