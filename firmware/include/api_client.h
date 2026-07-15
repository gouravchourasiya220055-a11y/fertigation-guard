#pragma once
#include <Arduino.h>
#include "control.h"

void apiInit();
void apiPollCommands(SystemStatus& status);
void apiSendTelemetry(const SystemStatus& status);
