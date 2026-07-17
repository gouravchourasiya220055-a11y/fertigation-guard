import { cropDatabase } from '../data/cropDatabase';

export const convertAreaToAcres = (area: number, unit: string) => {
  if (unit === 'Hectare') return area * 2.47105;
  if (unit === 'Square Meter') return area * 0.000247105;
  return area; // default Acre
};

export const convertAreaToSqMeters = (area: number, unit: string) => {
  if (unit === 'Acre') return area * 4046.86;
  if (unit === 'Hectare') return area * 10000;
  return area; // default Square Meter
};

export const calculateTotalPlants = (areaInSqM: number, plantSpacingM: number, rowSpacingM: number) => {
  if (!plantSpacingM || !rowSpacingM || plantSpacingM <= 0 || rowSpacingM <= 0) return 0;
  const areaPerPlant = plantSpacingM * rowSpacingM;
  return Math.floor(areaInSqM / areaPerPlant);
};

export const calculateRequirements = (
  cropId: string, 
  area: number, 
  areaUnit: string, 
  plantSpacing: number, 
  rowSpacing: number
) => {
  const crop = (cropDatabase as any)[Object.keys(cropDatabase).find(k => (cropDatabase as any)[k].id === cropId) || 'Tomato'];
  if (!crop) return null;

  const areaInSqM = convertAreaToSqMeters(area, areaUnit);
  const areaInAcres = convertAreaToAcres(area, areaUnit);
  
  const totalPlants = calculateTotalPlants(areaInSqM, plantSpacing, rowSpacing);
  
  const dailyWaterLiters = totalPlants * crop.dailyWaterReqLitersPerPlant;
  const weeklyWaterLiters = dailyWaterLiters * 7;
  const monthlyWaterLiters = dailyWaterLiters * 30;

  const nReq = Math.round(crop.fertilizerRecommendation.n * areaInAcres);
  const pReq = Math.round(crop.fertilizerRecommendation.p * areaInAcres);
  const kReq = Math.round(crop.fertilizerRecommendation.k * areaInAcres);
  const totalFertilizer = nReq + pReq + kReq;
  const microNutrient = Math.round(totalFertilizer * 0.05); // Estimate 5%

  // Assuming 1000 L/hr pump capacity for runtime calc
  const pumpCapacityLph = 1000;
  const pumpRuntimeHours = dailyWaterLiters / pumpCapacityLph;
  const tankRefillFrequency = Math.ceil(dailyWaterLiters / 5000); // Assuming 5000L tank

  return {
    totalPlants,
    dailyWater: Math.round(dailyWaterLiters),
    weeklyWater: Math.round(weeklyWaterLiters),
    monthlyWater: Math.round(monthlyWaterLiters),
    nReq,
    pReq,
    kReq,
    totalFertilizer,
    microNutrient,
    pumpRuntimeHours: parseFloat(pumpRuntimeHours.toFixed(1)),
    tankRefillFrequency,
    phRange: `${crop.idealPh.min} - ${crop.idealPh.max}`,
    ecRange: `${crop.idealEc.min} - ${crop.idealEc.max}`,
    cropName: crop.name
  };
};
