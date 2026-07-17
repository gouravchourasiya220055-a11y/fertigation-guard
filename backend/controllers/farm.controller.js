import Farm from '../models/Farm.js';
import { calculateFarmRequirements } from '../utils/calculations.js';

// @desc    Get all farms for user
// @route   GET /api/farm
// @access  Private
export const getFarms = async (req, res, next) => {
  try {
    const farms = await Farm.find({ user: req.user.id });
    res.status(200).json({ success: true, data: farms });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single farm
// @route   GET /api/farm/:id
// @access  Private
export const getFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm || farm.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }
    res.status(200).json({ success: true, data: farm });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new farm
// @route   POST /api/farm
// @access  Private
export const createFarm = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    
    // Automatically calculate requirements if crop and area are provided
    if (req.body.crop && req.body.area) {
      const requirements = calculateFarmRequirements(
        req.body.crop, 
        req.body.area, 
        req.body.areaUnit || 'Acre', 
        req.body.plantSpacing || 0.5, 
        req.body.rowSpacing || 1.0
      );
      
      // Merge calculations into req.body
      req.body = { ...req.body, ...requirements };
    }

    const farm = await Farm.create(req.body);
    res.status(201).json({ success: true, data: farm });
  } catch (error) {
    next(error);
  }
};

// @desc    Update farm
// @route   PUT /api/farm/:id
// @access  Private
export const updateFarm = async (req, res, next) => {
  try {
    let farm = await Farm.findById(req.params.id);
    if (!farm || farm.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }
    
    // Recalculate if critical fields changed
    if (req.body.crop || req.body.area || req.body.plantSpacing || req.body.rowSpacing) {
      const crop = req.body.crop || farm.crop;
      const area = req.body.area || farm.area;
      const areaUnit = req.body.areaUnit || farm.areaUnit || 'Acre';
      const pSpacing = req.body.plantSpacing || farm.plantSpacing || 0.5;
      const rSpacing = req.body.rowSpacing || farm.rowSpacing || 1.0;
      
      const requirements = calculateFarmRequirements(crop, area, areaUnit, pSpacing, rSpacing);
      req.body = { ...req.body, ...requirements };
    }

    farm = await Farm.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: farm });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete farm
// @route   DELETE /api/farm/:id
// @access  Private
export const deleteFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm || farm.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }
    await farm.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
