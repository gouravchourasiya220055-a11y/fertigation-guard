#ifndef RELAYS_H
#define RELAYS_H

#include <Arduino.h>
#include "config.h"

void setupRelays() {
    // Initialize pins as OUTPUT
    pinMode(PIN_WATER_PUMP, OUTPUT);
    pinMode(PIN_FERTILIZER, OUTPUT);
    pinMode(PIN_HIGH_PRESS, OUTPUT);
    pinMode(PIN_STIRRER, OUTPUT);
    pinMode(PIN_FLUSH_VALVE, OUTPUT);
    pinMode(PIN_ALARM, OUTPUT);
    
    // Default to OFF. Change LOW to HIGH if your relays are active-low.
    digitalWrite(PIN_WATER_PUMP, LOW);
    digitalWrite(PIN_FERTILIZER, LOW);
    digitalWrite(PIN_HIGH_PRESS, LOW);
    digitalWrite(PIN_STIRRER, LOW);
    digitalWrite(PIN_FLUSH_VALVE, LOW);
    digitalWrite(PIN_ALARM, LOW);
}

void controlRelay(int pin, bool state) {
    // For active-high relays, true = HIGH, false = LOW
    // For active-low relays, you would flip this logic: state ? LOW : HIGH
    digitalWrite(pin, state ? HIGH : LOW);
}

#endif // RELAYS_H
