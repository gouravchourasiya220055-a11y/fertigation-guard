const cropDatabase = require('../utils/cropDatabase');

const generateAIRecommendations = (farm, latestSensorData, weatherData) => {
  if (!farm || !farm.crop) return null;
  const cropKey = Object.keys(cropDatabase).find(k => cropDatabase[k].name === farm.crop) || 'Tomato';
  const crop = cropDatabase[cropKey];

  let healthScore = 100;
  let waterSavingTips = "Maintain current schedule.";
  let diseaseRisk = "Low";
  let bestTime = "06:00 AM";

  // Calculate Health Score
  if (latestSensorData) {
    const { ph, ec, waterLevel, temperature } = latestSensorData;
    if (ph < crop.idealPh.min || ph > crop.idealPh.max) healthScore -= 10;
    if (ec < crop.idealEc.min || ec > crop.idealEc.max) healthScore -= 10;
    if (temperature > 35) healthScore -= 15;
    if (waterLevel < 20) healthScore -= 20;

    // Disease Risk Logic
    if (temperature > 30 && weatherData && weatherData.humidity > 80) {
      diseaseRisk = "High (Fungal risk due to high temp and humidity)";
      healthScore -= 10;
    } else if (temperature > 25 && weatherData && weatherData.humidity > 60) {
      diseaseRisk = "Medium (Monitor for bacterial spots)";
    }

    // Water Saving Tips
    if (weatherData && weatherData.rainChance > 50) {
      waterSavingTips = "Rain expected. Delay irrigation by 24 hours.";
      bestTime = "Delay";
    } else if (temperature > 35) {
      waterSavingTips = "High evaporation expected. Irrigate late evening.";
      bestTime = "08:00 PM";
    } else {
      waterSavingTips = "Soil moisture is optimal. Morning irrigation recommended.";
      bestTime = "05:30 AM";
    }
  }

  // Cap health score
  if (healthScore < 0) healthScore = 0;

  return {
    healthScore,
    bestTime,
    diseaseRisk,
    waterSavingTips
  };
};

module.exports = { generateAIRecommendations };
