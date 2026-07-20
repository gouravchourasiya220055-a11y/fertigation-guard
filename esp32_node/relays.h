/**
 * @file relays.h
 * @brief Professional Relay Manager for the ESP32 Node.
 * Handles safe switching, active LOW logic, timeouts, and emergency shutdowns.
 */
#ifndef RELAYS_H
#define RELAYS_H

#include <Arduino.h>

struct RelayState {
    bool isWaterPumpOn;
    bool isFertilizerPumpOn;
    bool isStirrerOn;
    bool isMainPumpOn;
    bool isBasePumpOn;
    bool isDrainValveOpen;
    bool emergencyMode;
};

void setupRelays();
void updateRelayManager();

void startWaterPump();
void stopWaterPump();

void startFertilizerPump();
void stopFertilizerPump();

void startMainPump();
void stopMainPump();

void startStirrer();
void stopStirrer();

void startBasePump();
void stopBasePump();

void openDrainValve();
void closeDrainValve();

void stopAllRelays();
void emergencyShutdown();
void resetRelayEmergency();

RelayState getRelayStatus();

#endif // RELAYS_H
