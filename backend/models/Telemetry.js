import mongoose from "mongoose";

const TelemetrySchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      default: "ESP32_FERTIGATION_01",
    },
    // --- Sensor Readings ---
    soilMoisture: {
      type: Number,
      default: 0,
    },
    ph: {
      type: Number,
      default: 7.0,
    },
    ec: {
      type: Number,
      default: 0,
    },
    tds: {
      type: Number,
      default: 0,
    },
    temperature: {
      type: Number,
      default: 0,
    },
    humidity: {
      type: Number,
      default: 0,
    },

    // --- Network & Diagnostics ---
    rssi: {
      type: Number,
      default: 0,
    },
    snr: {
      type: Number,
      default: 0,
    },
    battery: {
      type: Number,
      default: 100,
    },

    // --- Flow & Volume Data ---
    flowMixed: {
      type: Number,
      default: 0,
    },
    flowWater: {
      type: Number,
      default: 0,
    },
    flowFertilizer: {
      type: Number,
      default: 0,
    },
    waterUsed: {
      type: Number,
      default: 0,
    },
    fertilizerUsed: {
      type: Number,
      default: 0,
    },
    mixedDelivered: {
      type: Number,
      default: 0,
    },

    // --- Relays State (1 to 6) ---
    relay1: {
      type: Boolean,
      default: false,
    },
    relay2: {
      type: Boolean,
      default: false,
    },
    relay3: {
      type: Boolean,
      default: false,
    },
    relay4: {
      type: Boolean,
      default: false,
    },
    relay5: {
      type: Boolean,
      default: false,
    },
    relay6: {
      type: Boolean,
      default: false,
    },

    // --- Timestamp ---
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Telemetry = mongoose.model("Telemetry", TelemetrySchema);

export default Telemetry; 