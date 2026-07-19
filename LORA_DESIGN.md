# Fertigation Guard v2.0 - LoRa Communication Design

This document details the redesign of the LoRa communication layer for the Fertigation Guard v2.0 project.

## Packet Flow

The communication flow remains straightforward, prioritizing simplicity and node autonomy:
1.  **Sensing & Preparation**: The ESP32 Node gathers telemetry data from its sensors (pH, EC, moisture).
2.  **Transmission (`sendPacket`)**: The node switches the radio to standby mode (`idle`), prepares the FIFO buffer, transmits the string payload, and waits for the transmission to finish.
3.  **Automatic RX Return**: Immediately after transmission, the radio is explicitly commanded back into continuous receive mode (`LoRa.receive()`). This ensures the node is instantly ready to hear any incoming commands without delay.
4.  **Gateway Reception (`receivePacket`)**: The Gateway listens continuously. When a packet arrives, it safely parses the packet size. If valid, the packet is read completely from the LoRa FIFO buffer into a String. Empty packets are dropped to prevent memory and parsing issues.
5.  **Signal Quality**: The Gateway also pulls the RSSI (Received Signal Strength Indicator) and SNR (Signal-to-Noise Ratio) for each packet to track link health.

## Radio Configuration

The LoRa parameters have been tuned for **maximum reliability and range**, over sheer data throughput. The following settings are applied identically on both the Node and Gateway:
*   **Frequency**: 433 MHz (Provides better penetration through vegetation compared to 868/915 MHz).
*   **CRC (Cyclic Redundancy Check)**: Enabled. Prevents corrupt or truncated packets from being accepted by the hardware.
*   **TX Power**: 20 dBm (Maximum legal/hardware limit for typical SX127x modules) to ensure deep coverage across the agricultural field.
*   **Spreading Factor**: 9. A balanced SF that offers significantly higher sensitivity (range) than default SF7, while keeping airtime lower than SF12.
*   **Bandwidth**: 125 kHz. Standard bandwidth balancing data rate and receiver sensitivity.
*   **Coding Rate**: 4/5. Provides standard Forward Error Correction (FEC) allowing the receiver to recover bit errors over noisy links.
*   **SPI Frequency**: 4 MHz. Ensures stable communication between the ESP32 and the SPI-based LoRa module without exceeding hardware limits.

## Why ACK is Intentionally Disabled

In this iteration, application-level Acknowledgments (ACKs) and Retries have been explicitly disabled for the following reasons:
1.  **Airtime Optimization**: In a large field with dozens of nodes, requiring the gateway to transmit an ACK for every telemetry packet essentially doubles the radio traffic. LoRa is a half-duplex medium; while the gateway is sending an ACK, it is deaf to other nodes.
2.  **Collision Reduction (ALOHA)**: Without MAC layer synchronization, nodes transmit asynchronously. ACKs increase the probability of packet collisions in the air.
3.  **Data Freshness over Guarantee**: Telemetry data (e.g., pH reading is 6.5) is highly time-series dependent. If a packet is lost, it is better to simply wait for the next broadcast 2 seconds later rather than stalling the node to retry sending stale data. 
4.  **Code Simplicity**: Removing blocking wait-for-ACK loops ensures the `loop()` runs extremely fast, freeing CPU time for sensor processing and relay switching.

## Future Expansion Plan

To scale this network for multi-node support:
1.  **Add Node IDs to Payloads**: Transition from raw strings like `"HELLO"` to structured formats (JSON, or preferably a packed C-struct `typedef struct { uint8_t id; float ph; ... } Payload;`). 
2.  **Addressing Scheme**: The Gateway will use the Node ID within the payload to route telemetry to the correct backend database entry.
3.  **Time Division Multiple Access (TDMA)**: If collisions become an issue with 10+ nodes, the Gateway can broadcast a timing sync packet every minute. Nodes calculate a staggered transmission slot based on their Node ID `(Node ID * 500ms)` to ensure they never talk over each other.
4.  **Gateway Command Downlinks**: The gateway can broadcast relay commands (e.g., `Node 3, Turn on Pump`). Because nodes now immediately return to `LoRa.receive()` after transmitting, they are perfectly positioned to catch these downlink commands.
