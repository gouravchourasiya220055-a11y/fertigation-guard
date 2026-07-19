/**
 * @file system_logger.h
 * @brief Professional System Logger using non-blocking circular buffers.
 */
#ifndef SYSTEM_LOGGER_H
#define SYSTEM_LOGGER_H

#include <Arduino.h>

#define MAX_LOG_ENTRIES 200

enum LogSeverity { LOG_INFO, LOG_WARNING, LOG_ERROR, LOG_CRITICAL };

struct LogEntry {
    unsigned long timestamp;
    char module[12];
    LogSeverity severity;
    char message[48];
};

// Static Circular Buffer Allocation (Avoids dynamic string fragmentation)
extern LogEntry logBuffer[MAX_LOG_ENTRIES];
extern int logHead;
extern int logCount;

inline void setupLogger() {
    logHead = 0;
    logCount = 0;
}

inline void addLog(const char* module, LogSeverity severity, const char* message) {
    logBuffer[logHead].timestamp = millis();
    snprintf(logBuffer[logHead].module, sizeof(logBuffer[logHead].module), "%s", module);
    logBuffer[logHead].severity = severity;
    snprintf(logBuffer[logHead].message, sizeof(logBuffer[logHead].message), "%s", message);
    
    logHead = (logHead + 1) % MAX_LOG_ENTRIES;
    if (logCount < MAX_LOG_ENTRIES) logCount++;
}

inline void logInfo(const char* module, const char* msg) { addLog(module, LOG_INFO, msg); }
inline void logWarning(const char* module, const char* msg) { addLog(module, LOG_WARNING, msg); }
inline void logError(const char* module, const char* msg) { addLog(module, LOG_ERROR, msg); }
inline void logCritical(const char* module, const char* msg) { addLog(module, LOG_CRITICAL, msg); }

inline void clearLogs() {
    logHead = 0;
    logCount = 0;
}

inline void exportLogs() {
    Serial.println("\n--- SYSTEM LOGS ---");
    int start = (logCount < MAX_LOG_ENTRIES) ? 0 : logHead;
    for (int i = 0; i < logCount; i++) {
        int idx = (start + i) % MAX_LOG_ENTRIES;
        Serial.print("["); Serial.print(logBuffer[idx].timestamp); Serial.print("] [");
        Serial.print(logBuffer[idx].module); Serial.print("] ");
        switch(logBuffer[idx].severity) {
            case LOG_INFO: Serial.print("INFO: "); break;
            case LOG_WARNING: Serial.print("WARN: "); break;
            case LOG_ERROR: Serial.print("ERR : "); break;
            case LOG_CRITICAL: Serial.print("CRIT: "); break;
        }
        Serial.println(logBuffer[idx].message);
    }
    Serial.println("--- END LOGS ---\n");
}

#endif // SYSTEM_LOGGER_H
