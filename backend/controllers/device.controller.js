import SensorData from '../models/SensorData.js';
import Device from '../models/Device.js';
import Farm from '../models/Farm.js';
import { getIO } from '../config/socket.js';
import { runAutomationEngine } from '../services/automation.service.js';

// @desc    Receive sensor data from ESP32
// @route   POST /api/device/data
// @access  Public
export const receiveSensorData = async (req, res, next) => {
  try {
    const { deviceId, temperature, humidity, soilMoisture, ph, ec, waterTank, relay, timestamp } = req.body;

    const device = await Device.findOne({ deviceId }).populate('farm');
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    // Save Sensor Data
    const sensorData = await SensorData.create({
      deviceId,
      farm: device.farm._id,
      temperature,
      humidity,
      soilMoisture,
      ph,
      ec,
      waterTank,
      relay,
      timestamp: timestamp === 'auto' ? Date.now() : new Date(timestamp || Date.now())
    });

    // Update Device Status
    device.lastSeen = Date.now();
    device.status = 'online';
    if (relay) device.relayState = relay;
    await device.save();

    // Trigger Automation Engine
    await runAutomationEngine(device.farm._id, sensorData);

    // Emit via Socket.io to Dashboard
    const io = getIO();
    io.to(device.farm._id.toString()).emit('sensor_update', sensorData);
    io.to(device.farm._id.toString()).emit('device_status', { deviceId, status: 'online', lastSeen: device.lastSeen });
    if (relay) {
      io.to(device.farm._id.toString()).emit('relay_status', { deviceId, relay });
    }

    res.status(201).json({ success: true, data: sensorData });
  } catch (error) {
    next(error);
  }
};

// @desc    Receive heartbeat/status from ESP32
// @route   POST /api/device/status
// @access  Public
export const receiveStatus = async (req, res, next) => {
  try {
    const { deviceId, status } = req.body;
    const device = await Device.findOneAndUpdate(
      { deviceId }, 
      { status: status || 'online', lastSeen: Date.now() },
      { new: true }
    );
    
    if (device) {
      getIO().to(device.farm.toString()).emit('device_status', { deviceId, status: device.status, lastSeen: device.lastSeen });
    }
    
    res.status(200).json({ success: true, message: 'Status updated' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get latest sensor data for a farm
// @route   GET /api/device/latest
// @access  Private
export const getLatestData = async (req, res, next) => {
  try {
    const farmId = req.query.farmId; // Alternatively, get it from req.user
    if (!farmId) return res.status(400).json({ success: false, message: 'farmId required' });

    const latestData = await SensorData.findOne({ farm: farmId }).sort({ createdAt: -1 });
    const devices = await Device.find({ farm: farmId });

    res.status(200).json({ success: true, latestData, devices });
  } catch (error) {
    next(error);
  }
};

// @desc    Send manual command to ESP32 Gateway
// @route   POST /api/device/command
// @access  Private
export const sendCommand = async (req, res, next) => {
  try {
    const { deviceId, relay, state } = req.body;
    
    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    // Emit instantly via Socket.IO
    // The Gateway ESP32 should be listening for 'command' events
    getIO().to(deviceId).emit('command', { deviceId, relay, state });
    
    // Optimistically update device relay state in DB
    if (device.relayState) {
      device.relayState[relay] = state;
      await device.save();
    }

    res.status(200).json({ success: true, message: 'Command sent to gateway' });
  } catch (error) {
    next(error);
  }
};
