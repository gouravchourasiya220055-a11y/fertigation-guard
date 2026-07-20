import mongoose from 'mongoose';

const RelayStatusSchema = new mongoose.Schema(
  {
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: false, // Optional if we just want a global state for ESP32 mapping
    },
    deviceId: {
      type: String,
      required: false,
    },
    waterPump: { type: Boolean, default: false },
    peristalticPump: { type: Boolean, default: false },
    highPressurePump: { type: Boolean, default: false },
    stirrer: { type: Boolean, default: false },
    flushValve: { type: Boolean, default: false },
    relay6: { type: Boolean, default: false }, // Extra relay from ESP32 payload
  },
  { timestamps: true }
);

export default mongoose.model('RelayStatus', RelayStatusSchema);
