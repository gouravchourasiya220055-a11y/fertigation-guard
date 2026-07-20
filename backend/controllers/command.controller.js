import SystemLog from '../models/SystemLog.js';

// In-memory queue for commands (Can be moved to Redis or MongoDB later)
export const commandQueue = [];

export const queueCommand = async (req, res, next) => {
  try {
    const { target, command } = req.body;
    
    if (!target || !command) {
      return res.status(400).json({ success: false, message: 'Missing target or command' });
    }

    commandQueue.push({ target, command, timestamp: Date.now() });

    await SystemLog.create({
      type: 'info',
      source: 'backend',
      message: `Command queued for ${target}: ${command}`
    });

    res.status(200).json({ success: true, message: 'Command queued successfully' });
  } catch (error) {
    next(error);
  }
};

export const fetchNextCommand = async (req, res, next) => {
  try {
    // If the queue is empty, return 204 No Content
    if (commandQueue.length === 0) {
      return res.status(204).send();
    }

    // Pop the oldest command
    const nextCommand = commandQueue.shift();

    // The ESP32 expects exactly this JSON structure
    res.status(200).json({
      target: nextCommand.target,
      command: nextCommand.command
    });
  } catch (error) {
    next(error);
  }
};
