// backend/controllers/command.controller.js
export let commandQueue = []; 

/**
 * @desc Map Relay ID + Status to exact ESP32 C++ Header Command String
 */
const mapRelayToEspCommand = (relayNum, status) => {
  const r = Number(relayNum);
  switch (r) {
    case 1:
      return status ? "PUMP_ON" : "PUMP_OFF";
    case 2:
      return status ? "FERT_ON" : "FERT_OFF";
    case 3:
      return status ? "HIGH_PRESSURE_ON" : "HIGH_PRESSURE_OFF";
    case 4:
      return status ? "STIRRER_ON" : "STIRRER_OFF";
    case 5:
      return status ? "FLUSH_ON" : "FLUSH_OFF";
    case 6:
      return status ? "BASE_ON" : "BASE_OFF";
    default:
      return status ? "PUMP_ON" : "PUMP_OFF";
  }
};

/**
 * @desc Queue Command for ESP32 Polling / Socket Emit
 */
export const queueCommand = async (req, res) => {
  try {
    const deviceId = req.body.deviceId || "ESP32_FERTIGATION_01";
    const relay = req.body.relay || req.body.relayNum || req.body.relayId || 1;
    const status = req.body.status !== undefined ? Boolean(req.body.status) : true;

    // Convert Relay 1-6 to string commands like "PUMP_ON", "FERT_ON" etc.
    const espCommand = req.body.commandName || mapRelayToEspCommand(relay, status);

    // Formatted exact string required by ESP32 command_processor.h
    const rawLoRaCommand = `CMD:${deviceId}:${espCommand}`;

    const commandPayload = {
      id: Date.now().toString(),
      deviceId,
      relay: Number(relay),
      status,
      command: espCommand,          // e.g., "PUMP_ON"
      rawPacket: rawLoRaCommand,     // e.g., "CMD:ESP32_FERTIGATION_01:PUMP_ON"
      timestamp: new Date().toISOString(),
    };

    // Add to HTTP Polling Queue
    commandQueue.push(commandPayload);

    // Emit via Socket.io
    const io = req.app.get("io");
    if (io) {
      io.emit("relay_control", commandPayload);
      io.emit("command", commandPayload);
      io.emit("lora_cmd", rawLoRaCommand);
    }

    console.log("Queued Command for ESP32 Processor:", commandPayload);

    return res.status(200).json({
      success: true,
      message: `Command queued: ${espCommand}`,
      command: commandPayload,
    });
  } catch (error) {
    console.error("Error in queueCommand:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc ESP32 fetches pending commands
 */
export const fetchNextCommand = async (req, res) => {
  try {
    if (commandQueue.length === 0) {
      return res.status(200).json({
        success: true,
        hasCommand: false,
        command: null,
      });
    }

    const nextCommand = commandQueue.shift();

    return res.status(200).json({
      success: true,
      hasCommand: true,
      command: nextCommand,
      // ESP32 Direct Raw String Format
      rawPacket: nextCommand.rawPacket,
    });
  } catch (error) {
    console.error("Error fetching next command:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};