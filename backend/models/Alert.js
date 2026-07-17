import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'High Temperature',
        'Low Water',
        'High EC',
        'Low EC',
        'High pH',
        'Low pH',
        'Device Offline',
        'Pump Failure',
        'Valve Failure',
        'Other'
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'warning',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Alert', AlertSchema);
