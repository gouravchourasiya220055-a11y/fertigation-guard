# Fertigation Guard Backend

This is the complete, production-ready backend for the Fertigation Guard system.
Built using Node.js, Express, MongoDB, and Socket.IO.

## Features
- **JWT Authentication** (Admin & Farmer roles)
- **Real-time Updates** via Socket.IO for sensor data, alerts, and automation status
- **Farm Management** (CRUD operations for multiple farms per user)
- **Sensor Data Logging** (Time-series data for Temp, Humidity, Water Level, pH, EC, etc.)
- **Automation Configuration** (Auto/Manual/Schedule modes)
- **Alerts System** (Threshold-based triggers)
- **Reporting** (Daily, Weekly, Monthly data aggregation)
- **Weather Integration** (OpenWeather API)

## Installation

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your MongoDB URI, JWT Secret, and OpenWeather API Key.
   ```bash
   cp .env.example .env
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment
This backend is designed to be easily deployable on platforms like Render, Railway, or via Docker.
Ensure you set all the environment variables listed in `.env.example` in your hosting platform's settings.

## API Documentation
Please refer to `docs/API_Documentation.md` for detailed endpoint descriptions.
A Postman collection is also provided in `docs/Postman_Collection.json`.
