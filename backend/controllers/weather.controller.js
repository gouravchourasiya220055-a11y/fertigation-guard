import { getWeatherData } from '../services/weather.service.js';

// @desc    Get weather for a location
// @route   GET /api/weather
// @access  Private
export const getWeather = async (req, res, next) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ success: false, message: 'Please provide a location query parameter' });
    }

    const weather = await getWeatherData(location);
    res.status(200).json({ success: true, data: weather });
  } catch (error) {
    next(error);
  }
};
