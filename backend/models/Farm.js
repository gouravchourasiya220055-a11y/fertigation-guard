import mongoose from 'mongoose';

const FarmSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    name: {
      type: String,
      required: [true, 'Please add a farm name'],
      trim: true,
    },
    location: {
      type: String,
      required: false,
    },
    state: { type: String, required: false },
    district: { type: String, required: false },
    village: { type: String, required: false },
    gpsLocation: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false }
    },
    crop: {
      type: String,
      required: [true, 'Please specify the crop'],
    },
    variety: { type: String, required: false },
    soilType: { type: String, required: false },
    irrigationMethod: { type: String, required: false },
    area: {
      type: Number,
      required: true,
    },
    areaUnit: {
      type: String,
      enum: ['Acre', 'Hectare', 'Square Meter'],
      default: 'Acre'
    },
    plantSpacing: { type: Number, required: false },
    rowSpacing: { type: Number, required: false },
    plantingDate: { type: Date, required: false },
    plantCount: {
      type: Number,
      required: false,
    },
    dailyWaterReq: { type: Number, required: false },
    nReq: { type: Number, required: false },
    pReq: { type: Number, required: false },
    kReq: { type: Number, required: false },
    targetPh: {
      type: Number,
      required: true,
    },
    targetEc: {
      type: Number,
      required: true,
    },
    targetMoisture: {
      type: Number,
      required: true,
    },
    waterTankCapacity: {
      type: Number, // in liters
      required: true,
    },
    fertilizerTankCapacity: {
      type: Number, // in liters
      required: true,
    },
    esp32DeviceId: {
      type: String,
      required: [true, 'Please add ESP32 Device ID'],
      unique: true,
    },
    farmImage: {
      type: String,
      default: 'no-photo.jpg',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Farm', FarmSchema);
