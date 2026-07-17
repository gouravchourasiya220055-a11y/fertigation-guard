import SensorData from '../models/SensorData.js';

// @desc    Get daily report
// @route   GET /api/reports/daily
// @access  Private
export const getDailyReport = async (req, res, next) => {
  try {
    const farmId = req.query.farmId;
    if (!farmId) return res.status(400).json({ success: false, message: 'farmId required' });

    const dateLimit = new Date();
    dateLimit.setHours(dateLimit.getHours() - 24);

    const data = await SensorData.find({
      farm: farmId,
      timestamp: { $gte: dateLimit }
    }).sort({ timestamp: 1 });

    // In a real app, calculate averages, min, max, etc.
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly report
// @route   GET /api/reports/monthly
// @access  Private
export const getMonthlyReport = async (req, res, next) => {
  try {
    const farmId = req.query.farmId;
    if (!farmId) return res.status(400).json({ success: false, message: 'farmId required' });

    const dateLimit = new Date();
    dateLimit.setMonth(dateLimit.getMonth() - 1);

    const data = await SensorData.find({
      farm: farmId,
      timestamp: { $gte: dateLimit }
    }).sort({ timestamp: 1 });

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
