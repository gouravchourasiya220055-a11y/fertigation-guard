import mongoose from 'mongoose';

const TelemetrySchema = new mongoose.Schema(
  {
    soilMoisture: { type: Number },
    ph: { type: Number },
    tds: { type: Number },
    temperature: { type: Number },
    humidity: { type: Number },
    relay1: { type: Boolean, default: false },
    relay2: { type: Boolean, default: false },
    relay3: { type: Boolean, default: false },
    relay4: { type: Boolean, default: false },
    relay5: { type: Boolean, default: false },
    relay6: { type: Boolean, default: false },
    timestamp: { 
      type: Date, 
      default: Date.now 
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Telemetry', TelemetrySchema);
