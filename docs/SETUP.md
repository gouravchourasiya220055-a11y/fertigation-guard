# Setup Guide

## Prerequisites

- Node.js 18+
- PlatformIO (for ESP32 firmware)
- ESP32 DevKit and hardware per [WIRING.md](WIRING.md)

## 1. Backend

```bash
cd backend
npm install
npm start
```

Runs on **http://localhost:3001**

## 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

## 3. ESP32 Configuration

Edit `firmware/include/config.h`:

```cpp
#define WIFI_SSID       "YourNetwork"
#define WIFI_PASSWORD   "YourPassword"
#define SERVER_HOST     "192.168.1.100"  // PC running backend
#define SERVER_PORT     3001
```

Find your PC IP:

- Windows: `ipconfig`
- Linux/Mac: `ifconfig` or `ip addr`

Upload firmware:

```bash
cd firmware
pio run -t upload
pio device monitor
```

## 4. Test Without Hardware

1. Start backend and frontend
2. Enable simulation in firmware: `#define SIMULATION_MODE true`
3. Or POST sample telemetry:

```bash
curl -X POST http://localhost:3001/api/telemetry \
  -H "Content-Type: application/json" \
  -d "{\"deviceId\":\"test\",\"ph\":6.1,\"ec\":2.2,\"mode\":\"AUTO\",\"phase\":\"IDLE\",\"crop\":\"Tomato\",\"waterPump\":false,\"basePump\":false,\"fertPump\":false,\"flushValve\":false}"
```

## 5. First Run Checklist

- [ ] Calibrate pH sensor with buffer solutions
- [ ] Verify relay wiring (active LOW)
- [ ] Confirm 12V pumps on relay outputs, not GPIO
- [ ] Set crop from web dashboard
- [ ] Run one manual cycle before leaving on AUTO
- [ ] Verify flush valve closes after timed flush

## Network Notes

ESP32 and the backend server must be on the **same WiFi network**. If the dashboard shows "Device Offline", check:

1. `SERVER_HOST` matches backend machine IP
2. Windows firewall allows port 3001
3. Serial monitor shows successful WiFi connection
