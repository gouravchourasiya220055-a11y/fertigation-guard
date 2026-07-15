#include "control.h"
#include "config.h"
#include <string.h>

static SystemStatus status = {};
static unsigned long lastDoseEndMs = 0;
static bool doseActive = false;
static RelayId doseRelay = RELAY_BASE;

static void loadDefaultCrop() {
  strncpy(status.crop.name, DEFAULT_CROP, sizeof(status.crop.name) - 1);
  status.crop.targetPh = DEFAULT_PH;
  status.crop.targetEc = DEFAULT_EC;
  status.crop.phTolerance = DEFAULT_PH_TOL;
  status.crop.ecTolerance = DEFAULT_EC_TOL;
  status.crop.flushSec = DEFAULT_FLUSH_SEC;
  status.crop.doseDelayMs = DEFAULT_DOSE_MS;
}

const char* phaseToString(SystemPhase p) {
  switch (p) {
    case PHASE_FILLING: return "FILL";
    case PHASE_DOSING_PH: return "pH";
    case PHASE_DOSING_EC: return "EC";
    case PHASE_IRRIGATING: return "IRR";
    case PHASE_FLUSHING: return "FLUSH";
    case PHASE_ERROR: return "ERR";
    default: return "IDLE";
  }
}

const char* modeToString(SystemMode m) {
  return m == MODE_AUTO ? "AUTO" : "MAN";
}

void controlInit() {
  loadDefaultCrop();
  status.mode = MODE_AUTO;
  status.phase = PHASE_IDLE;
  status.tankLevelOk = true;
  relaysInit();
  sensorsInit();
}

void controlSetCrop(const CropSettings& crop) {
  status.crop = crop;
}

void controlSetMode(SystemMode mode) {
  status.mode = mode;
  if (mode == MODE_MANUAL) {
    status.phase = PHASE_IDLE;
    doseActive = false;
  }
}

void controlManualRelay(RelayId id, bool on) {
  if (status.mode != MODE_MANUAL) return;
  relaySet(id, on);
}

SystemStatus controlGetStatus() {
  status.sensors = sensorsRead();
  status.relays = relaysSnapshot();
  return status;
}

static bool phInRange(float ph) {
  float t = status.crop.targetPh;
  float tol = status.crop.phTolerance;
  return ph >= (t - tol) && ph <= (t + tol);
}

static bool ecInRange(float ec) {
  float t = status.crop.targetEc;
  float tol = status.crop.ecTolerance;
  return ec >= (t - tol) && ec <= (t + tol);
}

static void startPhase(SystemPhase phase) {
  status.phase = phase;
  status.phaseStartMs = millis();
}

static void runDose(RelayId relay, SystemPhase phase) {
  if (!doseActive) {
    if (millis() - lastDoseEndMs < (unsigned long)status.crop.doseDelayMs) return;
    doseActive = true;
    doseRelay = relay;
    relaySet(relay, true);
    startPhase(phase);
    status.phaseStartMs = millis();
    return;
  }

  if (millis() - status.phaseStartMs >= status.crop.doseDelayMs) {
    relaySet(doseRelay, false);
    doseActive = false;
    lastDoseEndMs = millis();
    delay(STABILIZE_MS);
    status.sensors = sensorsRead();
  }
}

static void runAutoSequence() {
  status.sensors = sensorsRead();

  switch (status.phase) {
    case PHASE_IDLE:
      relaysAllOff();
      startPhase(PHASE_FILLING);
      relaySet(RELAY_WATER, true);
      relaySet(RELAY_STIRRER, true);
      break;

    case PHASE_FILLING:
      relaySet(RELAY_WATER, true);
      if (millis() - status.phaseStartMs > FILL_TIMEOUT_MS) {
        relaySet(RELAY_WATER, false);
        relaySet(RELAY_STIRRER, false);
        startPhase(PHASE_DOSING_PH);
      }
      // In production: use float switch to detect tank full and exit early
      if (millis() - status.phaseStartMs > 15000) {
        relaySet(RELAY_WATER, false);
        startPhase(PHASE_DOSING_PH);
      }
      break;

    case PHASE_DOSING_PH:
      if (phInRange(status.sensors.ph)) {
        doseActive = false;
        relaySet(RELAY_BASE, false);
        startPhase(PHASE_DOSING_EC);
        break;
      }
      if (status.sensors.ph < status.crop.targetPh - status.crop.phTolerance) {
        runDose(RELAY_BASE, PHASE_DOSING_PH);
      } else {
        // pH too high — only base tank available; proceed to EC
        startPhase(PHASE_DOSING_EC);
      }
      break;

    case PHASE_DOSING_EC:
      if (ecInRange(status.sensors.ec)) {
        doseActive = false;
        relaySet(RELAY_FERT, false);
        startPhase(PHASE_IRRIGATING);
        status.phaseStartMs = millis();
        break;
      }
      if (status.sensors.ec < status.crop.targetEc - status.crop.ecTolerance) {
        runDose(RELAY_FERT, PHASE_DOSING_EC);
      } else {
        startPhase(PHASE_IRRIGATING);
        status.phaseStartMs = millis();
      }
      break;

    case PHASE_IRRIGATING:
      relaySet(RELAY_WATER, true);
      relaySet(RELAY_FERT, false);
      relaySet(RELAY_BASE, false);
      // Irrigate for 60s (replace with flow sensor / user duration from API)
      if (millis() - status.phaseStartMs > 60000) {
        relaySet(RELAY_WATER, false);
        startPhase(PHASE_FLUSHING);
        relaySet(RELAY_FLUSH, true);
        status.phaseStartMs = millis();
      }
      break;

    case PHASE_FLUSHING:
      relaysAllOff();
      relaySet(RELAY_FLUSH, true);
      relaySet(RELAY_WATER, true); // fresh water flush
      if (millis() - status.phaseStartMs > (unsigned long)status.crop.flushSec * 1000UL) {
        relaySet(RELAY_FLUSH, false);
        relaySet(RELAY_WATER, false);
        startPhase(PHASE_IDLE);
      }
      break;

    case PHASE_ERROR:
      relaysAllOff();
      relaySet(RELAY_ALARM, true);
      break;
  }
}

void controlTick() {
  status.sensors = sensorsRead();

  if (status.mode == MODE_AUTO) {
    if (!status.sensors.phValid || !status.sensors.ecValid) {
      // Allow simulation; in field, escalate to error after retries
#if !SIMULATION_MODE
      if (status.phase != PHASE_ERROR) startPhase(PHASE_ERROR);
#endif
    }
    runAutoSequence();
  }
  status.relays = relaysSnapshot();
}
