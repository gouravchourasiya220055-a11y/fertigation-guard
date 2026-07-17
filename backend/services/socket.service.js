let io;

export const setIo = (socketIoInstance) => {
  io = socketIoInstance;
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized');
  }
  return io;
};

// Helper functions to emit specific events
export const emitDashboardUpdate = (data) => {
  if (io) io.emit('dashboardUpdate', data);
};

export const emitSensorUpdate = (data) => {
  if (io) io.emit('sensorUpdate', data);
};

export const emitAutomationUpdate = (data) => {
  if (io) io.emit('automationUpdate', data);
};

export const emitAlertUpdate = (data) => {
  if (io) io.emit('alertUpdate', data);
};
