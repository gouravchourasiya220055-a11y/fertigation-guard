import mongoose from 'mongoose';

const SensorSchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
    esp32DeviceId: {
      type: String,
      required: true,
    },
    temperature: { type: Number },
    humidity: { type: Number },
    waterLevel: { type: Number }, // percentage
    ph: { type: Number },
    ec: { type: Number },
    tds: { type: Number },
    flowRate: { type: Number },
    pumpStatus: { type: Boolean, default: false },
    valveStatus: { type: Boolean, default: false },
    relayStatus: { type: Boolean, default: false },
    batteryVoltage: { type: Number },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Add index to speed up time-series queries
SensorSchema.index({ farm: 1, createdAt: -1 });
SensorSchema.index({ esp32DeviceId: 1, createdAt: -1 });

export default mongoose.model('Sensor', SensorSchema);
