export interface Farm {
  id: string;
  name: string;
  cropType: string;
  area: number; 
  areaUnit?: string;
  totalPlants?: number;
  dailyWater?: number;
  nReq?: number;
  pReq?: number;
  kReq?: number;
  pumpRuntimeHours?: number;
  location: string;
  status: 'Active' | 'Maintenance' | 'Idle';
  image: string;
  metrics: {
    temperature: number;
    moisture: number;
    pH: number;
    ec: number;
    waterUsageToday: number;
    fertilizerUsageToday: number;
    pumpStatus: 'ON' | 'OFF';
    valveStatus: 'Open' | 'Closed';
    stirrerStatus: 'ON' | 'OFF';
    flushStatus: 'Open' | 'Closed';
    internetStatus: 'Online' | 'Offline';
    batteryLevel: number;
    waterLevel?: number;
  };
  weather: {
    temp: number;
    humidity: number;
    rainChance: number;
    windSpeed: number;
    uvIndex: number;
  };
  aiRecommendations: {
    bestTime: string;
    diseaseRisk: string;
    waterSavingTips: string;
    healthScore: number;
  };
  mapCoordinates: {
    lat: number;
    lng: number;
  };
  deviceId?: string;
}

export const mockFarms: Farm[] = [
  {
    id: 'f1',
    name: 'Tomato Valley',
    cropType: 'Tomato',
    area: 12.5,
    location: 'Greenwood District, State',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=600',
    metrics: {
      temperature: 24.5,
      moisture: 65,
      pH: 6.2,
      ec: 1.8,
      waterUsageToday: 1250,
      fertilizerUsageToday: 4.5,
      pumpStatus: 'ON',
      valveStatus: 'Open',
      stirrerStatus: 'OFF',
      flushStatus: 'Closed',
      internetStatus: 'Online',
      batteryLevel: 98
    },
    weather: {
      temp: 26,
      humidity: 55,
      rainChance: 10,
      windSpeed: 12,
      uvIndex: 6
    },
    aiRecommendations: {
      bestTime: '05:30 AM',
      diseaseRisk: 'Low (Blight Check Clear)',
      waterSavingTips: 'Reduce evening irrigation by 10% due to expected high humidity.',
      healthScore: 94
    },
    mapCoordinates: { lat: 34.0522, lng: -118.2437 }
  },
  {
    id: 'f2',
    name: 'Golden Wheat Fields',
    cropType: 'Wheat',
    area: 45.0,
    location: 'North Plains, State',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600',
    metrics: {
      temperature: 22.0,
      moisture: 45,
      pH: 6.5,
      ec: 1.2,
      waterUsageToday: 3400,
      fertilizerUsageToday: 12.0,
      pumpStatus: 'OFF',
      valveStatus: 'Closed',
      stirrerStatus: 'OFF',
      flushStatus: 'Closed',
      internetStatus: 'Online',
      batteryLevel: 85
    },
    weather: {
      temp: 21,
      humidity: 40,
      rainChance: 5,
      windSpeed: 18,
      uvIndex: 8
    },
    aiRecommendations: {
      bestTime: '06:00 AM',
      diseaseRisk: 'Medium (Monitor for Rust)',
      waterSavingTips: 'Soil moisture is optimal. Delay next irrigation by 24 hours.',
      healthScore: 88
    },
    mapCoordinates: { lat: 34.0530, lng: -118.2450 }
  },
  {
    id: 'f3',
    name: 'River Rice Paddies',
    cropType: 'Rice',
    area: 20.0,
    location: 'East Delta, State',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1536622830843-157dc9f170bd?auto=format&fit=crop&q=80&w=600',
    metrics: {
      temperature: 28.5,
      moisture: 95,
      pH: 5.8,
      ec: 1.0,
      waterUsageToday: 5600,
      fertilizerUsageToday: 8.5,
      pumpStatus: 'ON',
      valveStatus: 'Open',
      stirrerStatus: 'OFF',
      flushStatus: 'Closed',
      internetStatus: 'Online',
      batteryLevel: 100
    },
    weather: {
      temp: 30,
      humidity: 85,
      rainChance: 60,
      windSpeed: 8,
      uvIndex: 5
    },
    aiRecommendations: {
      bestTime: 'Continuous',
      diseaseRisk: 'Low',
      waterSavingTips: 'Rain expected. Turn off main pump for 48 hours.',
      healthScore: 96
    },
    mapCoordinates: { lat: 34.0510, lng: -118.2420 }
  },
  {
    id: 'f4',
    name: 'White Cotton Acres',
    cropType: 'Cotton',
    area: 60.0,
    location: 'Southern Belt, State',
    status: 'Maintenance',
    image: 'https://images.unsplash.com/photo-1620617377508-251c686e00b8?auto=format&fit=crop&q=80&w=600',
    metrics: {
      temperature: 32.0,
      moisture: 35,
      pH: 6.8,
      ec: 2.1,
      waterUsageToday: 0,
      fertilizerUsageToday: 0,
      pumpStatus: 'OFF',
      valveStatus: 'Closed',
      stirrerStatus: 'OFF',
      flushStatus: 'Closed',
      internetStatus: 'Offline',
      batteryLevel: 20
    },
    weather: {
      temp: 34,
      humidity: 30,
      rainChance: 0,
      windSpeed: 15,
      uvIndex: 10
    },
    aiRecommendations: {
      bestTime: '04:00 AM',
      diseaseRisk: 'High (Pest Alert)',
      waterSavingTips: 'System maintenance required. Check main line for leaks.',
      healthScore: 65
    },
    mapCoordinates: { lat: 34.0550, lng: -118.2480 }
  },
  {
    id: 'f5',
    name: 'Sweet Sugarcane Estate',
    cropType: 'Sugarcane',
    area: 35.5,
    location: 'Coastal Plain, State',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&q=80&w=600',
    metrics: {
      temperature: 29.0,
      moisture: 75,
      pH: 6.0,
      ec: 1.5,
      waterUsageToday: 4200,
      fertilizerUsageToday: 15.0,
      pumpStatus: 'ON',
      valveStatus: 'Open',
      stirrerStatus: 'OFF',
      flushStatus: 'Closed',
      internetStatus: 'Online',
      batteryLevel: 92
    },
    weather: {
      temp: 31,
      humidity: 70,
      rainChance: 40,
      windSpeed: 10,
      uvIndex: 7
    },
    aiRecommendations: {
      bestTime: '05:00 AM',
      diseaseRisk: 'Low',
      waterSavingTips: 'Optimize fertigation mix; nitrogen levels are adequate.',
      healthScore: 91
    },
    mapCoordinates: { lat: 34.0500, lng: -118.2400 }
  },
  {
    id: 'f6',
    name: 'Red Chilli Patch',
    cropType: 'Chilli',
    area: 5.0,
    location: 'Hillside Farm, State',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1588015339659-335606b24df4?auto=format&fit=crop&q=80&w=600',
    metrics: {
      temperature: 26.5,
      moisture: 55,
      pH: 6.3,
      ec: 2.0,
      waterUsageToday: 800,
      fertilizerUsageToday: 2.5,
      pumpStatus: 'OFF',
      valveStatus: 'Closed',
      stirrerStatus: 'OFF',
      flushStatus: 'Closed',
      internetStatus: 'Online',
      batteryLevel: 88
    },
    weather: {
      temp: 27,
      humidity: 50,
      rainChance: 15,
      windSpeed: 14,
      uvIndex: 8
    },
    aiRecommendations: {
      bestTime: '06:30 AM',
      diseaseRisk: 'Medium',
      waterSavingTips: 'Maintain current schedule.',
      healthScore: 85
    },
    mapCoordinates: { lat: 34.0540, lng: -118.2460 }
  },
  {
    id: 'f7',
    name: 'Purple Onion Fields',
    cropType: 'Onion',
    area: 8.5,
    location: 'Valley Floor, State',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1615485966601-51203bba806e?auto=format&fit=crop&q=80&w=600',
    metrics: {
      temperature: 21.0,
      moisture: 60,
      pH: 6.6,
      ec: 1.6,
      waterUsageToday: 950,
      fertilizerUsageToday: 3.0,
      pumpStatus: 'ON',
      valveStatus: 'Open',
      stirrerStatus: 'OFF',
      flushStatus: 'Closed',
      internetStatus: 'Online',
      batteryLevel: 95
    },
    weather: {
      temp: 22,
      humidity: 45,
      rainChance: 5,
      windSpeed: 16,
      uvIndex: 6
    },
    aiRecommendations: {
      bestTime: '05:45 AM',
      diseaseRisk: 'Low',
      waterSavingTips: 'Drip irrigation running efficiently.',
      healthScore: 92
    },
    mapCoordinates: { lat: 34.0560, lng: -118.2410 }
  }
];
