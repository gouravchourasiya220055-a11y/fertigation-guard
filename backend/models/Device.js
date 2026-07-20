import mongoose from 'mongoose';

const DeviceSchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: 'ESP32 Field Controller',
    },
    type: {
      type: String,
      enum: ['Gateway', 'Field Controller'],
      default: 'Field Controller',
    },
    status: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    relayState: {
      pump: { type: Boolean, default: false },
      fertilizer: { type: Boolean, default: false },
      stirrer: { type: Boolean, default: false },
      flush: { type: Boolean, default: false },
    },
    wifiRssi: { type: Number },
    battery: { type: Number },
    firmwareVersion: { type: String }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Device', DeviceSchema);
