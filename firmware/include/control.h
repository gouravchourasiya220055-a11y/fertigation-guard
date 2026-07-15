#pragma once
#include <Arduino.h>
#include "sensors.h"
#include "relays.h"

enum SystemMode { MODE_AUTO, MODE_MANUAL };
enum SystemPhase {
  PHASE_IDLE,
  PHASE_FILLING,
  PHASE_DOSING_PH,
  PHASE_DOSING_EC,
  PHASE_IRRIGATING,
  PHASE_FLUSHING,
  PHASE_ERROR
};

struct CropSettings {
  char name[24];
  float targetPh;
  float targetEc;
  float phTolerance;
  float ecTolerance;
  uint16_t flushSec;
  uint16_t doseDelayMs;
};

struct SystemStatus {
  SystemMode mode;
  SystemPhase phase;
  CropSettings crop;
  SensorReadings sensors;
  RelayState relays;
  bool tankLevelOk;
  unsigned long phaseStartMs;
};

void controlInit();
void controlSetCrop(const CropSettings& crop);
void controlSetMode(SystemMode mode);
void controlManualRelay(RelayId id, bool on);
void controlTick();
SystemStatus controlGetStatus();
const char* phaseToString(SystemPhase p);
const char* modeToString(SystemMode m);
