import mongoose from 'mongoose';

const SensorDataSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      index: true,
    },
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
      index: true,
    },
    temperature: { type: Number },
    humidity: { type: Number },
    soilMoisture: { type: Number },
    ph: { type: Number },
    ec: { type: Number },
    tds: { type: Number },
    waterTank: { type: Number },
    rssi: { type: Number },
    relay: {
      pump: { type: Boolean, default: false },
      fertilizer: { type: Boolean, default: false },
      stirrer: { type: Boolean, default: false },
      flush: { type: Boolean, default: false },
    },
    timestamp: { 
      type: Date, 
      default: Date.now 
    }
  },
  {
    timestamps: true,
  }
);

SensorDataSchema.index({ farm: 1, timestamp: -1 }); // Optimized for historical charts

export default mongoose.model('SensorData', SensorDataSchema);
