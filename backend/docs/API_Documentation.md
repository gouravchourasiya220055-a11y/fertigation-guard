# API Documentation

Base URL: `/api`

## Authentication (`/api/auth`)
- `POST /register`: Register a new user. Body: `{ name, email, password, role }`
- `POST /login`: Login user. Body: `{ email, password }`
- `GET /me`: Get current user (Requires Bearer Token)
- `GET /logout`: Logout user

## Farm Management (`/api/farm`) - *Protected*
- `GET /`: Get all farms for current user
- `POST /`: Create a new farm. Body requires Farm schema fields.
- `GET /:id`: Get single farm by ID
- `PUT /:id`: Update farm by ID
- `DELETE /:id`: Delete farm by ID

## Sensor Data (`/api/sensor`) 
- `POST /`: (Public) Endpoint for ESP32 to push sensor data. Body: `{ esp32DeviceId, temperature, humidity, waterLevel, ... }`
- `GET /dashboard/:farmId`: (Protected) Get latest dashboard data for a farm.
- `GET /charts/:farmId?timeframe=24h`: (Protected) Get historical data for charts.

## Automation (`/api/automation`) - *Protected*
- `GET /:farmId`: Get automation config for a farm
- `PUT /:farmId`: Update automation config (modes, schedules)
- `POST /action`: Trigger manual action. Body: `{ farmId, action }`

## Alerts (`/api/alert`) - *Protected*
- `GET /:farmId`: Get all alerts for a farm
- `PUT /:id/read`: Mark alert as read
- `DELETE /:id`: Delete alert

## Reports (`/api/report`) - *Protected*
- `GET /:farmId?type=daily`: Get aggregated report data (daily, weekly, monthly)

## Weather (`/api/weather`) - *Protected*
- `GET /?location=CityName`: Get weather for a specific location
