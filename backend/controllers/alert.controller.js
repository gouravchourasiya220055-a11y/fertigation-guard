import Alert from '../models/Alert.js';

// @desc    Get alerts for a farm
// @route   GET /api/alert/:farmId
// @access  Private
export const getAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find({ farm: req.params.farmId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark alert as read
// @route   PUT /api/alert/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, { isRead: true, resolvedAt: new Date() }, { new: true });
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.status(200).json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an alert
// @route   DELETE /api/alert/:id
// @access  Private
export const deleteAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
