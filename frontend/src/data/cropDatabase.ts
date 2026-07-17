export const cropDatabase = {
  Tomato: {
    id: "tomato",
    name: "Tomato",
    idealPh: { min: 6.0, max: 6.8 },
    idealEc: { min: 2.0, max: 2.5 },
    dailyWaterReqLitersPerPlant: 2.5,
    fertilizerRecommendation: { n: 120, p: 60, k: 120 }, // kg/acre
    growthStages: [
      { name: "Seedling", durationDays: 20 },
      { name: "Vegetative", durationDays: 30 },
      { name: "Flowering", durationDays: 20 },
      { name: "Fruiting", durationDays: 30 }
    ],
    irrigationIntervalDays: 2
  },
  Chilli: {
    id: "chilli",
    name: "Chilli",
    idealPh: { min: 5.5, max: 6.8 },
    idealEc: { min: 1.8, max: 2.2 },
    dailyWaterReqLitersPerPlant: 1.5,
    fertilizerRecommendation: { n: 100, p: 50, k: 50 },
    growthStages: [
      { name: "Seedling", durationDays: 30 },
      { name: "Vegetative", durationDays: 45 },
      { name: "Flowering", durationDays: 20 },
      { name: "Harvesting", durationDays: 60 }
    ],
    irrigationIntervalDays: 3
  },
  Onion: {
    id: "onion",
    name: "Onion",
    idealPh: { min: 6.0, max: 7.0 },
    idealEc: { min: 1.2, max: 1.8 },
    dailyWaterReqLitersPerPlant: 0.5,
    fertilizerRecommendation: { n: 50, p: 25, k: 50 },
    growthStages: [
      { name: "Seedling", durationDays: 45 },
      { name: "Vegetative", durationDays: 30 },
      { name: "Bulb Formation", durationDays: 40 },
      { name: "Maturation", durationDays: 20 }
    ],
    irrigationIntervalDays: 4
  },
  Garlic: {
    id: "garlic",
    name: "Garlic",
    idealPh: { min: 6.0, max: 7.5 },
    idealEc: { min: 1.5, max: 2.0 },
    dailyWaterReqLitersPerPlant: 0.6,
    fertilizerRecommendation: { n: 60, p: 40, k: 40 },
    growthStages: [
      { name: "Sprouting", durationDays: 20 },
      { name: "Vegetative", durationDays: 50 },
      { name: "Bulbing", durationDays: 40 },
      { name: "Maturation", durationDays: 20 }
    ],
    irrigationIntervalDays: 5
  },
  Potato: {
    id: "potato",
    name: "Potato",
    idealPh: { min: 5.0, max: 6.5 },
    idealEc: { min: 1.5, max: 2.5 },
    dailyWaterReqLitersPerPlant: 1.0,
    fertilizerRecommendation: { n: 120, p: 80, k: 120 },
    growthStages: [
      { name: "Sprouting", durationDays: 30 },
      { name: "Vegetative", durationDays: 30 },
      { name: "Tuber Initiation", durationDays: 20 },
      { name: "Tuber Bulking", durationDays: 40 }
    ],
    irrigationIntervalDays: 3
  },
  Cotton: {
    id: "cotton",
    name: "Cotton",
    idealPh: { min: 5.8, max: 8.0 },
    idealEc: { min: 2.0, max: 3.5 },
    dailyWaterReqLitersPerPlant: 4.0,
    fertilizerRecommendation: { n: 80, p: 40, k: 40 },
    growthStages: [
      { name: "Seedling", durationDays: 20 },
      { name: "Vegetative", durationDays: 40 },
      { name: "Flowering", durationDays: 30 },
      { name: "Boll Development", durationDays: 50 }
    ],
    irrigationIntervalDays: 7
  },
  Wheat: {
    id: "wheat",
    name: "Wheat",
    idealPh: { min: 6.0, max: 7.0 },
    idealEc: { min: 1.5, max: 2.5 },
    dailyWaterReqLitersPerPlant: 0.1, // High plant density
    fertilizerRecommendation: { n: 100, p: 50, k: 40 },
    growthStages: [
      { name: "Tillering", durationDays: 40 },
      { name: "Jointing", durationDays: 30 },
      { name: "Booting", durationDays: 20 },
      { name: "Grain Filling", durationDays: 30 }
    ],
    irrigationIntervalDays: 14
  },
  Rice: {
    id: "rice",
    name: "Rice",
    idealPh: { min: 5.5, max: 6.5 },
    idealEc: { min: 1.0, max: 1.5 },
    dailyWaterReqLitersPerPlant: 1.5,
    fertilizerRecommendation: { n: 120, p: 60, k: 60 },
    growthStages: [
      { name: "Seedling", durationDays: 25 },
      { name: "Tillering", durationDays: 40 },
      { name: "Panicle Initiation", durationDays: 30 },
      { name: "Ripening", durationDays: 30 }
    ],
    irrigationIntervalDays: 1 // Flood irrigation often continuous
  },
  Maize: {
    id: "maize",
    name: "Maize",
    idealPh: { min: 5.8, max: 7.0 },
    idealEc: { min: 1.5, max: 2.5 },
    dailyWaterReqLitersPerPlant: 3.0,
    fertilizerRecommendation: { n: 150, p: 60, k: 60 },
    growthStages: [
      { name: "Seedling", durationDays: 20 },
      { name: "Vegetative", durationDays: 40 },
      { name: "Silking", durationDays: 20 },
      { name: "Grain Filling", durationDays: 30 }
    ],
    irrigationIntervalDays: 5
  },
  Sugarcane: {
    id: "sugarcane",
    name: "Sugarcane",
    idealPh: { min: 6.0, max: 7.5 },
    idealEc: { min: 2.0, max: 3.0 },
    dailyWaterReqLitersPerPlant: 5.0,
    fertilizerRecommendation: { n: 200, p: 80, k: 120 },
    growthStages: [
      { name: "Establishment", durationDays: 60 },
      { name: "Tillering", durationDays: 90 },
      { name: "Grand Growth", durationDays: 120 },
      { name: "Ripening", durationDays: 90 }
    ],
    irrigationIntervalDays: 7
  },
  Banana: {
    id: "banana",
    name: "Banana",
    idealPh: { min: 5.5, max: 7.0 },
    idealEc: { min: 1.5, max: 2.0 },
    dailyWaterReqLitersPerPlant: 20.0,
    fertilizerRecommendation: { n: 250, p: 100, k: 300 },
    growthStages: [
      { name: "Vegetative", durationDays: 150 },
      { name: "Shooting", durationDays: 30 },
      { name: "Fruit Development", durationDays: 90 },
      { name: "Harvest", durationDays: 30 }
    ],
    irrigationIntervalDays: 2
  },
  Grapes: {
    id: "grapes",
    name: "Grapes",
    idealPh: { min: 6.0, max: 7.5 },
    idealEc: { min: 1.5, max: 2.5 },
    dailyWaterReqLitersPerPlant: 15.0,
    fertilizerRecommendation: { n: 80, p: 40, k: 120 },
    growthStages: [
      { name: "Bud Break", durationDays: 30 },
      { name: "Flowering", durationDays: 20 },
      { name: "Berry Set", durationDays: 40 },
      { name: "Veraison to Harvest", durationDays: 50 }
    ],
    irrigationIntervalDays: 5
  },
  Pomegranate: {
    id: "pomegranate",
    name: "Pomegranate",
    idealPh: { min: 6.5, max: 7.5 },
    idealEc: { min: 1.5, max: 2.5 },
    dailyWaterReqLitersPerPlant: 10.0,
    fertilizerRecommendation: { n: 120, p: 60, k: 100 },
    growthStages: [
      { name: "Resting", durationDays: 60 },
      { name: "Flowering", durationDays: 30 },
      { name: "Fruit Development", durationDays: 90 },
      { name: "Harvesting", durationDays: 30 }
    ],
    irrigationIntervalDays: 4
  },
  Mango: {
    id: "mango",
    name: "Mango",
    idealPh: { min: 5.5, max: 7.0 },
    idealEc: { min: 1.0, max: 2.0 },
    dailyWaterReqLitersPerPlant: 30.0,
    fertilizerRecommendation: { n: 150, p: 80, k: 120 },
    growthStages: [
      { name: "Vegetative Flush", durationDays: 60 },
      { name: "Flowering", durationDays: 30 },
      { name: "Fruit Development", durationDays: 90 },
      { name: "Maturation", durationDays: 30 }
    ],
    irrigationIntervalDays: 7
  },
  Papaya: {
    id: "papaya",
    name: "Papaya",
    idealPh: { min: 6.0, max: 6.5 },
    idealEc: { min: 1.5, max: 2.2 },
    dailyWaterReqLitersPerPlant: 12.0,
    fertilizerRecommendation: { n: 150, p: 100, k: 150 },
    growthStages: [
      { name: "Seedling", durationDays: 45 },
      { name: "Vegetative", durationDays: 60 },
      { name: "Flowering", durationDays: 30 },
      { name: "Fruiting", durationDays: 90 }
    ],
    irrigationIntervalDays: 3
  }
};
