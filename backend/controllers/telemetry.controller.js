import Telemetry from '../models/Telemetry.js';
import { getIO } from '../config/socket.js';
import logger from '../utils/logger.js';

// @desc    Receive telemetry from ESP32
// @route   POST /api/telemetry
// @access  Public
export const postTelemetry = async (req, res, next) => {
  try {
    const {
      deviceId, farmId,
      soilMoisture, ph, tds, temperature, humidity,
      flowMixed, flowWater, flowFertilizer, waterUsed, fertilizerUsed, mixedDelivered,
      relay1, relay2, relay3, relay4, relay5, relay6,
      systemState, battery, rssi, snr, firmwareVersion,
      timestamp
    } = req.body;

    const telemetryObj = {
      deviceId, farmId,
      soilMoisture, ph, tds, temperature, humidity,
      flowMixed, flowWater, flowFertilizer, waterUsed, fertilizerUsed, mixedDelivered,
      relay1, relay2, relay3, relay4, relay5, relay6,
      systemState, battery, rssi, snr, firmwareVersion,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    };

    const newTelemetry = await Telemetry.create(telemetryObj);

    // Broadcast instantly via Socket.io if running
    try {
      const io = getIO();
      if (io) {
        // Broadcast to general 'telemetry' and specific farm room
        io.emit('telemetry', newTelemetry);
        if (farmId) {
          io.to(farmId.toString()).emit('telemetry', newTelemetry);
        }
      }
    } catch (e) {
      // Socket.io might not be initialized during some tests, safe to ignore
    }
    
    logger.info(`Telemetry received from ${deviceId || 'Unknown'}`);

    res.status(201).json({ success: true, data: newTelemetry });
  } catch (error) {
    logger.error('Error saving telemetry:', error);
    next(error);
  }
};

// @desc    Get latest live telemetry
// @route   GET /api/telemetry/latest
// @access  Public
export const getLatest = async (req, res, next) => {
  try {
    const { deviceId, farmId } = req.query;
    let query = {};
    if (deviceId) query.deviceId = deviceId;
    if (farmId) query.farmId = farmId;
    
    const latestData = await Telemetry.findOne(query).sort({ timestamp: -1 }).lean();
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
    const { deviceId, farmId, from, to, limit = 100, page = 1 } = req.query;
    
    let query = {};
    if (deviceId) query.deviceId = deviceId;
    if (farmId) query.farmId = farmId;
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const historyData = await Telemetry.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();
      
    res.status(200).json({ success: true, count: historyData.length, page: pageNum, data: historyData });
  } catch (error) {
    next(error);
  }
};
