import AutomationRule from '../models/AutomationRule.js';

// @desc    Get automation rules for a farm
// @route   GET /api/automation
// @access  Private
export const getAutomationRules = async (req, res, next) => {
  try {
    const farmId = req.query.farmId;
    if (!farmId) return res.status(400).json({ success: false, message: 'farmId required' });

    let rule = await AutomationRule.findOne({ farm: farmId });
    
    res.status(200).json({ success: true, data: rule });
  } catch (error) {
    next(error);
  }
};

// @desc    Create automation rule
// @route   POST /api/automation
// @access  Private
export const createAutomationRule = async (req, res, next) => {
  try {
    const { farmId, ...ruleData } = req.body;
    if (!farmId) return res.status(400).json({ success: false, message: 'farmId required' });

    const rule = await AutomationRule.create({ farm: farmId, ...ruleData });

    res.status(201).json({ success: true, data: rule });
  } catch (error) {
    next(error);
  }
};

// @desc    Update automation rule
// @route   PUT /api/automation/:id
// @access  Private
export const updateAutomationRule = async (req, res, next) => {
  try {
    const rule = await AutomationRule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!rule) {
      return res.status(404).json({ success: false, message: 'Automation rule not found' });
    }

    res.status(200).json({ success: true, data: rule });
  } catch (error) {
    next(error);
  }
};
