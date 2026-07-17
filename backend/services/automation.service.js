import AutomationRule from '../models/AutomationRule.js';
import Device from '../models/Device.js';
import { getIO } from '../config/socket.js';
import logger from '../utils/logger.js';

export const runAutomationEngine = async (farmId, sensorData) => {
  try {
    const rule = await AutomationRule.findOne({ farm: farmId, isActive: true });
    if (!rule) return; // No active automation rules for this farm

    const { deviceId, soilMoisture, ph, ec } = sensorData;
    let commands = [];

    // Soil Moisture Logic
    if (soilMoisture !== undefined) {
      if (soilMoisture < rule.soilMoistureThresholds.min) {
        commands.push({ relay: 'pump', state: true });
      } else if (soilMoisture > rule.soilMoistureThresholds.max) {
        commands.push({ relay: 'pump', state: false });
        if (rule.flushAfterIrrigation) {
           // Queue a flush command (could be handled via setTimeout or just emit it)
           commands.push({ relay: 'flush', state: true });
           // In a real scenario, flush might be turned off after 5 mins via a job queue.
        }
      }
    }

    // EC Logic
    if (ec !== undefined) {
      if (ec < rule.ecThresholds.min) {
        commands.push({ relay: 'fertilizer', state: true });
      } else if (ec > rule.ecThresholds.max) {
        commands.push({ relay: 'fertilizer', state: false });
      }
    }

    // pH Logic (assuming Dose Base/Acid uses specific relays. Let's assume stirrer or flush for now or dedicated relays if they existed)
    // The requirement says: "If pH Low -> Dose Base", "If pH High -> Dose Acid".
    // Since relay object has: pump, fertilizer, stirrer, flush. 
    // We'll log it for now or assume they are mapped to stirrer/flush in a custom setup.
    if (ph !== undefined) {
      if (ph < rule.phThresholds.min) {
         logger.info(`[Automation] pH Low (${ph}) - Dose Base needed for farm ${farmId}`);
      } else if (ph > rule.phThresholds.max) {
         logger.info(`[Automation] pH High (${ph}) - Dose Acid needed for farm ${farmId}`);
      }
    }

    // Send Commands
    if (commands.length > 0) {
      const io = getIO();
      const device = await Device.findOne({ deviceId });

      for (const cmd of commands) {
        // Prevent sending duplicate commands if state is already correct
        if (device && device.relayState && device.relayState[cmd.relay] !== cmd.state) {
          logger.info(`[Automation] Triggering ${cmd.relay} to ${cmd.state} for device ${deviceId}`);
          io.to(deviceId).emit('command', {
            deviceId,
            relay: cmd.relay,
            state: cmd.state
          });
          
          // Update DB optimistically
          device.relayState[cmd.relay] = cmd.state;
        }
      }
      
      if (device) await device.save();
    }

  } catch (error) {
    logger.error(`Error in automation engine: ${error.message}`);
  }
};
