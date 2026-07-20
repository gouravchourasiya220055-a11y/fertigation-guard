#ifndef FERTIGATION_H
#define FERTIGATION_H

#include <Arduino.h>

enum ControllerState {
    IDLE,
    FILLING_WATER,
    ADDING_FERTILIZER,
    MIXING,
    CORRECTING_PH_TDS,
    IRRIGATING,
    DRAINING,
    COMPLETE,
    EMERGENCY
};

enum ControllerMode {
    MODE_MANUAL,
    MODE_AUTOMATIC,
    MODE_EMERGENCY,
    MODE_MAINTENANCE
};

void setupIrrigationController();
void updateIrrigationController();

void startAutomaticCycle();
void stopAutomaticCycle();
void startManualCycle();
void stopManualCycle();
void emergencyStop();
void resetController();

ControllerState getControllerState();
void setMode(ControllerMode mode);

#endif // FERTIGATION_H
