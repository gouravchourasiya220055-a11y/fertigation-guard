import mongoose from 'mongoose';

const AutomationSchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
      unique: true, // One automation config per farm
    },
    mode: {
      type: String,
      enum: ['Manual', 'Auto', 'Schedule'],
      default: 'Manual',
    },
    autoFertigation: {
      type: Boolean,
      default: false,
    },
    autoIrrigation: {
      type: Boolean,
      default: false,
    },
    autoFlush: {
      type: Boolean,
      default: false,
    },
    schedule: [
      {
        action: {
          type: String,
          enum: ['Start Pump', 'Stop Pump', 'Flush', 'Dose Fertilizer', 'Dose Acid', 'Dose Base'],
        },
        time: String, // HH:mm format
        days: [String], // ['Monday', 'Wednesday']
        duration: Number, // in minutes
        isActive: { type: Boolean, default: true }
      }
    ]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Automation', AutomationSchema);
