import mongoose from 'mongoose';

const TelemetrySchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: false },
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: false },
    soilMoisture: { type: Number },
    ph: { type: Number },
    tds: { type: Number },
    temperature: { type: Number },
    humidity: { type: Number },
    
    // V2.1 Flow Sensors & Metrics
    flowMixed: { type: Number },
    flowWater: { type: Number },
    flowFertilizer: { type: Number },
    waterUsed: { type: Number },
    fertilizerUsed: { type: Number },
    mixedDelivered: { type: Number },
    
    // Relay States
    relay1: { type: Boolean, default: false },
    relay2: { type: Boolean, default: false },
    relay3: { type: Boolean, default: false },
    relay4: { type: Boolean, default: false },
    relay5: { type: Boolean, default: false },
    relay6: { type: Boolean, default: false },
    
    // Gateway & Node Status
    systemState: { type: String },
    battery: { type: Number },
    rssi: { type: Number },
    snr: { type: Number },
    firmwareVersion: { type: String },
    
    timestamp: { 
      type: Date, 
      default: Date.now 
    }
  },
  {
    timestamps: true,
  }
);

TelemetrySchema.index({ timestamp: -1 });
TelemetrySchema.index({ deviceId: 1 });
TelemetrySchema.index({ farmId: 1 });
TelemetrySchema.index({ farmId: 1, timestamp: -1 }); // Optimized for historical charts

export default mongoose.model('Telemetry', TelemetrySchema);
