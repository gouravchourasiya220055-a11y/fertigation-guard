# Fertigation Guard

**AI-Based Smart pH, EC Monitoring and Automatic Fertigation & Flush System for Drip Irrigation**

Closed-loop fertigation system that automatically controls pH, EC (TDS), fertilizer dosing, flushing, and irrigation — with full monitoring and control through a web dashboard.

## Architecture

```
┌─────────────┐     HTTP/WebSocket     ┌──────────────┐     WebSocket     ┌─────────────┐
│   ESP32     │ ◄────────────────────► │   Backend    │ ◄───────────────► │  Dashboard  │
│  Firmware   │                        │  (Node.js)   │                   │   (React)   │
└─────────────┘                        └──────────────┘                   └─────────────┘
      │                                        │
  Sensors + Relays                        SQLite DB
  pH, TDS, Pumps, Flush                   History & Alerts
```

## Quick Start

### 1. Backend

```bash
cd backend
npm install
npm start
```

Server runs at `http://localhost:3001` (JSON file storage in `backend/data/`)

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Dashboard at `http://localhost:5173`

### 3. ESP32 Firmware

1. Install [PlatformIO](https://platformio.org/) (VS Code extension or CLI)
2. Edit `firmware/include/config.h` — set WiFi SSID, password, and server URL
3. Open `firmware/` in PlatformIO and upload to ESP32

```bash
cd firmware
pio run -t upload
pio device monitor
```

### Simulation Mode

Set `SIMULATION_MODE true` in `config.h` to run without physical sensors/relays. The backend also accepts manual telemetry for UI testing.

## Hardware

| Relay | Device              | GPIO |
| ----- | ------------------- | ---- |
| 1     | Water Pump          | 25   |
| 2     | Base Pump           | 26   |
| 3     | Fertilizer Pump     | 27   |
| 4     | Flush Solenoid      | 14   |
| 5     | Stirrer (optional)  | 12   |
| 6     | Spare / Alarm       | 13   |

| Sensor   | Pin  |
| -------- | ---- |
| pH (AO)  | 34   |
| TDS (AO) | 35   |
| LCD SDA  | 21   |
| LCD SCL  | 22   |

See [docs/WIRING.md](docs/WIRING.md) for the full circuit diagram.

## Features

- **Automatic pH & EC control** with configurable tolerance and dosing delay
- **Crop presets** — Tomato, Chilli, Capsicum, Cucumber, and more
- **Automatic pipeline flush** after irrigation
- **Live web dashboard** — pump status, graphs, manual override
- **History & notifications** — alerts for out-of-range values and sensor faults
- **Auto / Manual mode** toggle from web or LCD

## Project Structure

```
├── firmware/       ESP32 PlatformIO project
├── backend/        Node.js API + WebSocket + SQLite
├── frontend/       React + Vite dashboard
└── docs/           Wiring and setup guides
```

## License

MIT — for educational and agricultural innovation projects.
