# Fertigation Guard v2.0 - Project Structure

This document provides a comprehensive overview of the Fertigation Guard v2.0 ESP32 project architecture, detailing the folder structure, file responsibilities, communication flow, and recommendations for future module expansion.

## Folder Structure

The project is divided into two main components:
- `esp32_node`: Represents the field node responsible for reading sensors and controlling relays.
- `esp32_gateway`: Represents the central hub responsible for receiving data from nodes via LoRa and forwarding it to the backend API via WiFi.

```text
AGRO INOVATERS/
├── esp32_node/                  # Field node codebase
│   ├── config.h                 # Hardware pins and configuration parameters
│   ├── esp32_node.ino           # Main application entry point
│   ├── flow_sensors.h/          # Directory containing flow sensor logic
│   │   └── flowsensor.h         # Flow sensor variable and function declarations
│   ├── lora_node.h              # LoRa communication handling for the node
│   ├── relays.h                 # Relay control logic (pumps, valves, etc.)
│   └── sensors.h                # Sensor reading functions (pH, EC, Soil Moisture)
└── esp32_gateway/               # Central gateway codebase
    ├── api_client.h             # HTTP communication with the backend API
    ├── config.h                 # WiFi, API, and LoRa configuration parameters
    ├── esp32_gateway.ino        # Main application entry point
    ├── lora_gateway.h           # LoRa communication handling for the gateway
    └── wifi_manager.h           # WiFi connectivity and reconnection logic
```

## File Responsibilities

### ESP32 Node
*   **`esp32_node.ino`**: Initializes the hardware and runs the main loop, periodically sending telemetry data.
*   **`config.h`**: Centralizes all configuration macros, including GPIO pin assignments, LoRa frequencies, and timing intervals.
*   **`lora_node.h`**: Manages the LoRa radio initialization and packet transmission/reception.
*   **`sensors.h`**: Provides functions to read analog values from pH, EC, and soil moisture sensors and map them to meaningful units.
*   **`relays.h`**: Handles the initialization and state control of various output relays (water pump, fertilizer pump, stirrer, etc.).
*   **`flow_sensors.h/flowsensor.h`**: Declares variables and functions for tracking flow rates and pulse counts from water and fertilizer flow sensors.

### ESP32 Gateway
*   **`esp32_gateway.ino`**: Initializes WiFi and LoRa, listens for incoming LoRa packets, and manages the main gateway lifecycle.
*   **`config.h`**: Stores WiFi credentials, API endpoints, and LoRa settings.
*   **`api_client.h`**: Contains functions to send POST requests (sensor data) and GET requests (relay commands) to the backend cloud API.
*   **`lora_gateway.h`**: Configures the LoRa module to receive telemetry packets from field nodes.
*   **`wifi_manager.h`**: Provides functions to establish and maintain a stable WiFi connection.

## Communication Flow

The system employs a two-tier communication architecture:

1.  **Node to Gateway (LoRa)**:
    *   The **ESP32 Node** gathers data from its connected sensors (pH, EC, soil moisture, flow).
    *   It packages this data and transmits it wirelessly using the LoRa protocol (e.g., at 433 MHz).
    *   LoRa allows for long-range, low-power communication suitable for agricultural fields.
2.  **Gateway to Cloud (WiFi/HTTP)**:
    *   The **ESP32 Gateway** listens for incoming LoRa packets from one or more nodes.
    *   Upon receiving a packet, the gateway formats the data into JSON.
    *   It then sends an HTTP POST request containing the JSON payload to the centralized backend API via its WiFi connection.
    *   The gateway can also fetch relay commands from the API via HTTP GET requests and potentially relay these commands back to the nodes via LoRa.

## Future Module Expansion

To maintain a clean modular architecture as the project scales, follow these guidelines for future expansion:

*   **Implement `.cpp` Files**: Currently, the project is largely header-only (`.h` files with `inline` functions). For a fully professional architecture, separate declarations into `.h` files and implementations into `.cpp` files. This will speed up compilation and completely prevent multiple definition issues.
*   **Add New Sensor Modules**: Create dedicated headers (e.g., `weather_station.h`) for new sensor types. Keep their logic isolated and only expose necessary functions (e.g., `setupWeatherStation()`, `readWindSpeed()`).
*   **Two-Way LoRa Communication**: Implement acknowledgment (ACK) mechanisms and command forwarding from the gateway to the node. Add structured payload formats (e.g., using `struct` or Protobuf) rather than raw strings for more robust parsing.
*   **State Machine**: Introduce a non-blocking state machine in the `.ino` files (using `millis()`) to handle concurrent tasks like reading sensors, listening for LoRa packets, and checking WiFi without using `delay()`.
