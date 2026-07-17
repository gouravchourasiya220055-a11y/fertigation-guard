import axios from 'axios';
import logger from '../utils/logger.js';

export const getWeatherData = async (location) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey || apiKey === 'dummy_key') {
      logger.warn('OpenWeather API key not configured, returning mock data.');
      return getMockWeather();
    }

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
    
    return {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      rain: response.data.rain ? response.data.rain['1h'] : 0,
      windSpeed: response.data.wind.speed,
      description: response.data.weather[0].description,
    };
  } catch (error) {
    logger.error('Error fetching weather data:', error.message);
    return getMockWeather();
  }
};

const getMockWeather = () => {
  return {
    temperature: 24,
    humidity: 60,
    rain: 0,
    windSpeed: 5,
    description: 'clear sky'
  };
};
