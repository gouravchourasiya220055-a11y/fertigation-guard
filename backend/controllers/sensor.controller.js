import SensorData from '../models/SensorData.js';
import Device from '../models/Device.js';
import RelayStatus from '../models/RelayStatus.js';
import SystemLog from '../models/SystemLog.js';
import { getIO } from '../config/socket.js';
import Farm from '../models/Farm.js';
import mongoose from 'mongoose';

// @desc    Get live sensor data (latest reading) for a farm
// @route   GET /api/sensors/live
// @access  Private
export const getLiveSensors = async (req, res, next) => {
  try {
    const farmId = req.query.farmId; 
    if (!farmId) return res.status(400).json({ success: false, message: 'farmId required' });

    // Assuming we want the latest data per device on the farm
    const devices = await Device.find({ farm: farmId });
    const liveData = [];

    for (let device of devices) {
      const latestData = await SensorData.findOne({ deviceId: device.deviceId }).sort({ createdAt: -1 });
      if (latestData) liveData.push(latestData);
    }

    res.status(200).json({ success: true, data: liveData });
  } catch (error) {
    next(error);
  }
};

// @desc    Get latest single sensor document
// @route   GET /api/sensors/latest
// @access  Private
export const getLatestSensors = async (req, res, next) => {
  try {
    const { deviceId } = req.query;
    const query = deviceId ? { deviceId } : {};
    const latest = await SensorData.findOne(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: latest });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sensor history for charts
// @route   GET /api/sensors/history
// @access  Private
export const getSensorHistory = async (req, res, next) => {
  try {
    const { farmId, timeframe } = req.query; // '24h', '7d', '1m'
    if (!farmId) return res.status(400).json({ success: false, message: 'farmId required' });

    let dateLimit = new Date();
    if (timeframe === '24h') dateLimit.setHours(dateLimit.getHours() - 24);
    else if (timeframe === '7d') dateLimit.setDate(dateLimit.getDate() - 7);
    else if (timeframe === '1m') dateLimit.setMonth(dateLimit.getMonth() - 1);
    else dateLimit.setHours(dateLimit.getHours() - 24); // default

    const history = await SensorData.find({
      farm: farmId,
      timestamp: { $gte: dateLimit }
    }).sort({ timestamp: 1 });

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

// @desc    Ingest raw JSON from ESP32
// @route   POST /api/sensors
// @access  Public
export const ingestESP32Data = async (req, res, next) => {
  try {
    const { deviceId, type, ph, ec, soilMoisture, msgId, rssi } = req.body;
    
    // Validate JSON and strictly process only DATA packets
    if (!deviceId) {
      return res.status(400).json({ success: false, message: 'deviceId is required in payload' });
    }

    if (type && type !== 'DATA') {
      // Gracefully ignore ACKs or CMDs if they inadvertently get routed here
      return res.status(200).json({ success: true, message: `Ignored non-DATA packet of type: ${type}` });
    }

    // Attempt to map to a default farm if not provided by ESP32 mapping logic
    const defaultFarm = await Farm.findOne(); 
    
    const sensorDoc = await SensorData.create({
      deviceId: deviceId, // Support multiple ESP32 devices automatically
      farm: defaultFarm ? defaultFarm._id : new mongoose.Types.ObjectId(),
      ph: ph || 0,
      ec: ec || 0,
      soilMoisture: soilMoisture || 0,
      rssi: rssi || 0,
      timestamp: new Date()
    });

    // Broadcast updates using Socket.IO
    const io = getIO();
    io.emit('sensor_update', sensorDoc);

    await SystemLog.create({
      type: 'system',
      source: 'esp32',
      message: `Device ${deviceId} posted sensor payload (MsgId: ${msgId || 'N/A'})`
    });

    res.status(200).json({ success: true, message: 'Data ingested', data: sensorDoc });
  } catch (error) {
    try {
      await SystemLog.create({
        type: 'error',
        source: 'esp32',
        message: `Failed to ingest ESP32 data: ${error.message}`
      });
    } catch (logError) {
      console.error("Failed to write to SystemLog:", logError);
    }
    console.error("Ingestion Error:", error);
    next(error);
  }
};
