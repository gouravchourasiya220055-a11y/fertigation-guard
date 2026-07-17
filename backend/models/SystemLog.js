import mongoose from 'mongoose';

const SystemLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['info', 'warning', 'error', 'system'],
      default: 'info',
    },
    message: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      default: 'backend', // 'esp32', 'backend', 'frontend'
    },
  },
  { timestamps: true }
);

export default mongoose.model('SystemLog', SystemLogSchema);
