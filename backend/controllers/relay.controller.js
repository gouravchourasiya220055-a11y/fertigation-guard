import RelayStatus from '../models/RelayStatus.js';
import SystemLog from '../models/SystemLog.js';
import { getIO } from '../config/socket.js';

export const getRelays = async (req, res, next) => {
  try {
    let status = await RelayStatus.findOne().sort({ createdAt: -1 });
    if (!status) {
      status = await RelayStatus.create({});
    }
    res.status(200).json({ success: true, data: status });
  } catch (error) {
    next(error);
  }
};

export const controlRelay = async (req, res, next) => {
  try {
    const { relay, state } = req.body;
    
    // Convert generic relay 1, 2... or string names to actual model fields
    let fieldName = '';
    if (relay === 1 || relay === 'waterPump') fieldName = 'waterPump';
    else if (relay === 2 || relay === 'peristalticPump') fieldName = 'peristalticPump';
    else if (relay === 3 || relay === 'highPressurePump') fieldName = 'highPressurePump';
    else if (relay === 4 || relay === 'stirrer') fieldName = 'stirrer';
    else if (relay === 5 || relay === 'flushValve') fieldName = 'flushValve';
    else if (relay === 6 || relay === 'relay6') fieldName = 'relay6';
    else {
      return res.status(400).json({ success: false, message: 'Invalid relay identifier' });
    }

    let status = await RelayStatus.findOne().sort({ createdAt: -1 });
    if (!status) {
      status = await RelayStatus.create({});
    }

    status[fieldName] = state;
    await status.save();

    await SystemLog.create({
      type: 'info',
      source: 'backend',
      message: `Relay ${fieldName} was turned ${state ? 'ON' : 'OFF'}`
    });

    const io = getIO();
    io.emit('relay_update', status);

    res.status(200).json({ success: true, data: status });
  } catch (error) {
    next(error);
  }
};
