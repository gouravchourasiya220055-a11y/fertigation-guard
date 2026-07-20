import { Server } from 'socket.io';
import logger from '../utils/logger.js';

let io;

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*', // Allow all origins for now. In production, specify the frontend domain.
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Devices and clients can join a specific room (e.g., Farm ID or Device ID)
    socket.on('join_room', (room) => {
      socket.join(room);
      logger.info(`Socket ${socket.id} joined room ${room}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export default initializeSocket;
