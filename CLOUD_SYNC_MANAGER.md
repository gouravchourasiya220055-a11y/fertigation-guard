# Fertigation Guard v2.0 - Cloud Sync Manager

This document details the architecture and mechanisms of the **Cloud Synchronization Manager** for the ESP32 Gateway module.

## 1. Architecture
The Cloud Sync Manager serves as the sole arbiter of network traffic between the local LoRa field network and the Cloud/API backend. It intercepts telemetry packets arriving from Nodes and pushes them to the cloud.

Crucially, it is completely non-blocking and relies strictly on `millis()` intervals rather than `delay()`. This guarantees that the Gateway never drops an incoming LoRa packet even if the cloud API is responding slowly or timing out.

## 2. Offline Buffer & Network Recovery
Agriculture fields often experience unpredictable Wi-Fi or LTE uplink drops. To prevent data loss during an outage, the Sync Manager includes an **Offline Buffer**:
*   **Capacity**: Up to 100 telemetry packets.
*   **Static Allocation**: The queue is statically allocated in RAM (`offlineQueue[100]`) rather than using dynamic lists. This prevents the heap fragmentation that typically crashes embedded systems over long uptimes.
*   **Overflow**: If an outage lasts longer than 100 packets, the buffer operates as a circular queue, quietly discarding the oldest data point to make room for the newest.
*   **Network Recovery**: The module continuously monitors `WiFi.status()`. If it detects that the connection has dropped and subsequently recovered, it seamlessly switches back to "ONLINE" mode and begins draining the offline buffer.

## 3. Retry Logic
The internet is inherently unstable. If an upload fails (e.g., the API returns a 500 error or the connection times out):
1.  The payload is immediately appended to the Offline Buffer.
2.  The Sync Manager's non-blocking `processOfflineQueue()` routine takes over.
3.  It will attempt to re-upload the failed packet every **10 seconds**.
4.  If it fails **5 times** consecutively, the packet is permanently purged to prevent a bad payload from permanently halting the queue.

## 4. Heartbeat
To provide system health monitoring to the backend, the Gateway fires a heartbeat JSON payload every **60 seconds**.
*   **Included Data**: Gateway ID, Firmware Version, WiFi RSSI, Free Heap Memory, and System Uptime.
*   This allows the cloud dashboard to alert the user if the Gateway's signal strength is dropping or if it unexpectedly goes offline.

## 5. Time Sync (NTP)
Precise timestamping is critical for agronomic data analysis. On boot, and every 12 hours thereafter, the Sync Manager reaches out to `pool.ntp.org` to synchronize the ESP32's internal real-time clock (RTC). This ensures that any locally cached data retains highly accurate timestamps even if the internet goes down later.

## 6. Future AI Integration
The structure uses dedicated inline functions for endpoints (`downloadCommands()`, `downloadConfiguration()`, etc.). Because these API polling blocks are cleanly separated from the LoRa routing logic, integrating future AI endpoints (e.g., `/api/ai`, `/api/weather`, `/api/crop`) requires only adding a new polling function inside `updateCloudSync()`. The core queue and network recovery logic will automatically handle any timeouts or connection drops associated with those new endpoints.
