import Telemetry from '../models/Telemetry.js';
import { getIO } from '../config/socket.js';

// @desc    Receive telemetry from ESP32
// @route   POST /api/telemetry
// @access  Public
export const postTelemetry = async (req, res, next) => {
  try {
    const {
      soilMoisture,
      ph,
      tds,
      temperature,
      humidity,
      relay1,
      relay2,
      relay3,
      relay4,
      relay5,
      relay6,
      timestamp
    } = req.body;

    const telemetryObj = {
      soilMoisture,
      ph,
      tds,
      temperature,
      humidity,
      relay1,
      relay2,
      relay3,
      relay4,
      relay5,
      relay6,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    };

    const newTelemetry = await Telemetry.create(telemetryObj);

    // Broadcast instantly via Socket.io if running
    try {
      const io = getIO();
      if (io) {
        io.emit('telemetry', newTelemetry);
      }
    } catch (e) {
      // Socket.io might not be initialized during some tests, safe to ignore
    }

    res.status(201).json({ success: true, data: newTelemetry });
  } catch (error) {
    next(error);
  }
};

// @desc    Get latest live telemetry
// @route   GET /api/telemetry/latest
// @access  Public
export const getLatest = async (req, res, next) => {
  try {
    const latestData = await Telemetry.findOne().sort({ timestamp: -1 });
    res.status(200).json({ success: true, data: latestData });
  } catch (error) {
    next(error);
  }
};

// @desc    Get telemetry history
// @route   GET /api/telemetry/history
// @access  Public
export const getHistory = async (req, res, next) => {
  try {
    const historyData = await Telemetry.find().sort({ timestamp: -1 }).limit(100);
    res.status(200).json({ success: true, data: historyData });
  } catch (error) {
    next(error);
  }
};
