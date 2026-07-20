import RelayStatus from '../models/RelayStatus.js';
import SystemLog from '../models/SystemLog.js';
import { getIO } from '../config/socket.js';
import { commandQueue } from './command.controller.js';

export const getRelays = async (req, res, next) => {
  try {
    const { deviceId } = req.query;
    let query = {};
    if (deviceId) query.deviceId = deviceId;
    
    let status = await RelayStatus.findOne(query).sort({ createdAt: -1 });
    if (!status) {
      status = await RelayStatus.create(query);
    }
    res.status(200).json({ success: true, data: status });
  } catch (error) {
    next(error);
  }
};

export const controlRelay = async (req, res, next) => {
  try {
    const { relay, state, deviceId } = req.body;
    
    let fieldName = '';
    let hardwareCommand = '';

    // Map to db field and hardware command
    if (relay === 1 || relay === 'waterPump' || relay === 'relay1') { fieldName = 'waterPump'; hardwareCommand = state ? 'WATER_PUMP_ON' : 'WATER_PUMP_OFF'; }
    else if (relay === 2 || relay === 'peristalticPump' || relay === 'relay2') { fieldName = 'peristalticPump'; hardwareCommand = state ? 'FERT_PUMP_ON' : 'FERT_PUMP_OFF'; }
    else if (relay === 3 || relay === 'highPressurePump' || relay === 'relay3') { fieldName = 'highPressurePump'; hardwareCommand = state ? 'MAIN_PUMP_ON' : 'MAIN_PUMP_OFF'; }
    else if (relay === 4 || relay === 'stirrer' || relay === 'relay4') { fieldName = 'stirrer'; hardwareCommand = state ? 'STIRRER_ON' : 'STIRRER_OFF'; }
    else if (relay === 5 || relay === 'flushValve' || relay === 'relay5') { fieldName = 'flushValve'; hardwareCommand = state ? 'BASE_PUMP_ON' : 'BASE_PUMP_OFF'; }
    else if (relay === 6 || relay === 'relay6') { fieldName = 'relay6'; hardwareCommand = state ? 'DRAIN_ON' : 'DRAIN_OFF'; }
    else {
      return res.status(400).json({ success: false, message: 'Invalid relay identifier' });
    }

    let query = {};
    if (deviceId) query.deviceId = deviceId;

    let status = await RelayStatus.findOne(query).sort({ createdAt: -1 });
    if (!status) {
      status = await RelayStatus.create(query);
    }

    status[fieldName] = state;
    await status.save();

    await SystemLog.create({
      type: 'info',
      source: 'backend',
      message: `Relay ${fieldName} was turned ${state ? 'ON' : 'OFF'} for device ${deviceId || 'default'}`
    });

    // Enqueue command for ESP32 Gateway to fetch via LoRa
    commandQueue.push({
      target: deviceId || 'NODE01', // Default to NODE01 if not provided
      command: hardwareCommand,
      timestamp: Date.now()
    });

    const io = getIO();
    io.emit('relay_update', status);

    res.status(200).json({ success: true, data: status });
  } catch (error) {
    next(error);
  }
};

export const updateRelayById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const updatedStatus = await RelayStatus.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedStatus) {
      return res.status(404).json({ success: false, message: 'Relay status not found' });
    }

    const io = getIO();
    io.emit('relay_update', updatedStatus);

    res.status(200).json({ success: true, data: updatedStatus });
  } catch (error) {
    next(error);
  }
};
