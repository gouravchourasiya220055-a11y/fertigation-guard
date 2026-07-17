import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    avgTemperature: Number,
    avgHumidity: Number,
    avgPh: Number,
    avgEc: Number,
    totalWaterUsed: Number,
    totalFertilizerUsed: Number,
  },
  {
    timestamps: true,
  }
);

HistorySchema.index({ farm: 1, date: -1 });

export default mongoose.model('History', HistorySchema);
