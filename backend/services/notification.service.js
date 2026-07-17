import Alert from '../models/Alert.js';
import { emitAlertUpdate } from './socket.service.js';
import logger from '../utils/logger.js';

export const createAlert = async (farmId, type, message, severity = 'warning') => {
  try {
    const alert = await Alert.create({
      farm: farmId,
      type,
      message,
      severity
    });

    // Broadcast the new alert via socket
    emitAlertUpdate(alert);
    
    logger.info(`Alert Created: [${severity}] ${type} - ${message}`);

    return alert;
  } catch (error) {
    logger.error('Error creating alert:', error.message);
  }
};
