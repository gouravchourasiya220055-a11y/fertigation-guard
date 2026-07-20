import Telemetry from '../models/Telemetry.js';

// @desc    Get flow stats
// @route   GET /api/flow
// @access  Public
export const getFlowStats = async (req, res, next) => {
  try {
    const { deviceId, farmId } = req.query;
    let query = {};
    if (deviceId) query.deviceId = deviceId;
    if (farmId) query.farmId = farmId;

    const latest = await Telemetry.findOne(query).sort({ timestamp: -1 }).lean();
    
    if (!latest) {
      return res.status(200).json({ success: true, data: null });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1);

    const todayStartData = await Telemetry.findOne({ ...query, timestamp: { $gte: startOfDay } }).sort({ timestamp: 1 }).lean();
    const monthStartData = await Telemetry.findOne({ ...query, timestamp: { $gte: startOfMonth } }).sort({ timestamp: 1 }).lean();

    const dailyWater = latest.waterUsed - (todayStartData?.waterUsed || 0);
    const monthlyWater = latest.waterUsed - (monthStartData?.waterUsed || 0);
    
    const dailyFertilizer = latest.fertilizerUsed - (todayStartData?.fertilizerUsed || 0);
    const monthlyFertilizer = latest.fertilizerUsed - (monthStartData?.fertilizerUsed || 0);

    const dailyMixed = latest.mixedDelivered - (todayStartData?.mixedDelivered || 0);
    const monthlyMixed = latest.mixedDelivered - (monthStartData?.mixedDelivered || 0);

    res.status(200).json({
      success: true,
      data: {
        currentFlowMixed: latest.flowMixed || 0,
        currentFlowWater: latest.flowWater || 0,
        currentFlowFertilizer: latest.flowFertilizer || 0,
        
        waterUsed: latest.waterUsed || 0,
        fertilizerUsed: latest.fertilizerUsed || 0,
        mixedDelivered: latest.mixedDelivered || 0,
        
        dailyTotal: {
            water: dailyWater >= 0 ? dailyWater : latest.waterUsed,
            fertilizer: dailyFertilizer >= 0 ? dailyFertilizer : latest.fertilizerUsed,
            mixed: dailyMixed >= 0 ? dailyMixed : latest.mixedDelivered
        },
        monthlyTotal: {
            water: monthlyWater >= 0 ? monthlyWater : latest.waterUsed,
            fertilizer: monthlyFertilizer >= 0 ? monthlyFertilizer : latest.fertilizerUsed,
            mixed: monthlyMixed >= 0 ? monthlyMixed : latest.mixedDelivered
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
