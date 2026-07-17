import cropDatabase from './cropDatabase.js';

const convertAreaToAcres = (area, unit) => {
  if (unit === 'Hectare') return area * 2.47105;
  if (unit === 'Square Meter') return area * 0.000247105;
  return area; // default Acre
};

const convertAreaToSqMeters = (area, unit) => {
  if (unit === 'Acre') return area * 4046.86;
  if (unit === 'Hectare') return area * 10000;
  return area; // default Square Meter
};

const calculateTotalPlants = (areaInSqM, plantSpacingM, rowSpacingM) => {
  if (!plantSpacingM || !rowSpacingM || plantSpacingM <= 0 || rowSpacingM <= 0) return 0;
  const areaPerPlant = plantSpacingM * rowSpacingM;
  return Math.floor(areaInSqM / areaPerPlant);
};

const calculateFarmRequirements = (cropName, area, areaUnit, plantSpacing, rowSpacing) => {
  const cropKey = Object.keys(cropDatabase).find(k => cropDatabase[k].name === cropName) || 'Tomato';
  const crop = cropDatabase[cropKey];

  const areaInSqM = convertAreaToSqMeters(area, areaUnit);
  const areaInAcres = convertAreaToAcres(area, areaUnit);
  
  const totalPlants = calculateTotalPlants(areaInSqM, plantSpacing, rowSpacing);
  
  const dailyWaterLiters = totalPlants * crop.dailyWaterReqLitersPerPlant;

  const nReq = Math.round(crop.fertilizerRecommendation.n * areaInAcres);
  const pReq = Math.round(crop.fertilizerRecommendation.p * areaInAcres);
  const kReq = Math.round(crop.fertilizerRecommendation.k * areaInAcres);

  return {
    plantCount: totalPlants,
    dailyWaterReq: Math.round(dailyWaterLiters),
    nReq,
    pReq,
    kReq,
    targetPh: (crop.idealPh.min + crop.idealPh.max) / 2,
    targetEc: (crop.idealEc.min + crop.idealEc.max) / 2,
    targetMoisture: 60 // generic fallback
  };
};

export { calculateFarmRequirements };
