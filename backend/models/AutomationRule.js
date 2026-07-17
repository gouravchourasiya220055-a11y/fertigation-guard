import mongoose from 'mongoose';

const AutomationRuleSchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
      unique: true, // One rule set per farm
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    soilMoistureThresholds: {
      min: { type: Number, default: 40 }, // < 40 -> Start Pump
      max: { type: Number, default: 80 }, // > 80 -> Stop Pump
    },
    ecThresholds: {
      min: { type: Number, default: 1.0 }, // < 1.0 -> Start Fertilizer
      max: { type: Number, default: 2.5 }, // > 2.5 -> Stop Fertilizer
    },
    phThresholds: {
      min: { type: Number, default: 5.5 }, // < 5.5 -> Dose Base
      max: { type: Number, default: 6.5 }, // > 6.5 -> Dose Acid
    },
    flushAfterIrrigation: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('AutomationRule', AutomationRuleSchema);
