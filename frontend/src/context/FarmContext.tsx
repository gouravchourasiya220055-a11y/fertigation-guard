import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '../lib/api';
import { socket } from '../lib/socket';


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

interface FarmContextType {
  farms: Farm[];
  activeFarm: Farm | null;
  activeFarmId: string;
  setActiveFarmId: (id: string) => void;
  addFarm: (farm: any) => void;
  deleteFarm: (id: string) => void;
  isLoading: boolean;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export function FarmProvider({ children }: { children: ReactNode }) {

  const [farms, setFarms] = useState<Farm[]>([]);
  const [activeFarmId, setActiveFarmId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch initial farms
  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    setIsLoading(true);

    try {
      const res = await api.get('/farms');
      const backendFarms = res.data.data;

      if (backendFarms.length > 0) {
        const mappedFarms: Farm[] = backendFarms.map((f: any) => mapBackendFarmToUI(f));
        setFarms(mappedFarms);
        setActiveFarmId(mappedFarms[0].id);
      }
    } catch (error) {
      console.error('Error fetching farms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeFarmId) {
      fetchFarmData(activeFarmId);

      const interval = setInterval(() => {
        fetchFarmData(activeFarmId);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [activeFarmId]);

  const fetchFarmData = async (farmId: string) => {
    try {
      // Fetch latest dashboard data from explicit new endpoints
      const [sensorRes, relayRes] = await Promise.all([
        api.get('/sensors/latest'),
        api.get('/relays')
      ]);
      const latestSensorData = sensorRes.data.data;
      const relayData = relayRes.data.data;
      
      const farmObj = farms.find(f => f.id === farmId);
      if(!farmObj) return;

      // Fetch Weather
      const weatherRes = await api.get(`/weather?location=${farmObj.location}`);
      const weatherData = weatherRes.data.data;

      setFarms(prev => prev.map(f => {
        if (f.id === farmId) {
          return {
            ...f,
            metrics: {
              ...f.metrics,
              temperature: latestSensorData?.temperature || f.metrics.temperature,
              moisture: latestSensorData?.soilMoisture || f.metrics.moisture,
              pH: latestSensorData?.ph || f.metrics.pH,
              ec: latestSensorData?.ec || f.metrics.ec,
              waterLevel: latestSensorData?.waterTank || f.metrics.waterLevel,
              pumpStatus: relayData?.waterPump ? 'ON' : 'OFF',
              valveStatus: relayData?.peristalticPump ? 'Open' : 'Closed', // Re-mapping peristaltic to zone valve for UI display
              stirrerStatus: relayData?.stirrer ? 'ON' : 'OFF',
              flushStatus: relayData?.flushValve ? 'Open' : 'Closed',
              batteryLevel: f.metrics.batteryLevel,
            },
            weather: {
              ...f.weather,
              temp: weatherData.temperature,
              humidity: weatherData.humidity,
              windSpeed: weatherData.windSpeed,
            }
          };
        }
        return f;
      }));
    } catch (error) {
      console.error('Error fetching farm metrics:', error);
    }
  };

  // Socket.io listeners
  useEffect(() => {
    socket.on('sensor_update', (latestData: any) => {
      const farmId = latestData.farm;
      setFarms(prev => prev.map(f => {
        if (f.id === farmId && latestData) {
          return {
            ...f,
            metrics: {
              ...f.metrics,
              temperature: latestData.temperature,
              moisture: latestData.soilMoisture,
              pH: latestData.ph,
              ec: latestData.ec,
              waterLevel: latestData.waterTank,
              pumpStatus: latestData.relay?.pump ? 'ON' : 'OFF',
              valveStatus: latestData.relay?.fertilizer ? 'Open' : 'Closed',
              stirrerStatus: latestData.relay?.stirrer ? 'ON' : 'OFF',
              flushStatus: latestData.relay?.flush ? 'Open' : 'Closed',
              batteryLevel: f.metrics.batteryLevel,
            }
          };
        }
        return f;
      }));
    });

    return () => {
      socket.off('sensor_update');
    };
  }, []);

  const activeFarm = farms.find(f => f.id === activeFarmId) || null;

  const addFarm = async (farmData: any) => {
    try {
      const res = await api.post('/farms', farmData);
      const newFarm = mapBackendFarmToUI(res.data.data);
      setFarms(prev => [...prev, newFarm]);
      setActiveFarmId(newFarm.id);
    } catch (error) {
      console.error("Error creating farm", error);
    }
  };

  const deleteFarm = async (id: string) => {
    try {
      await api.delete(`/farms/${id}`);
      setFarms(prev => prev.filter(f => f.id !== id));
      if (activeFarmId === id) {
        setActiveFarmId(farms.find(f => f.id !== id)?.id || '');
      }
    } catch (error) {
      console.error("Error deleting farm", error);
    }
  };

  return (
    <FarmContext.Provider value={{ farms, activeFarm, activeFarmId, setActiveFarmId, addFarm, deleteFarm, isLoading }}>
      {children}
    </FarmContext.Provider>
  );
}

export function useFarm() {
  const context = useContext(FarmContext);
  if (context === undefined) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
}

// Helper to map DB farm to UI farm with default mocked values for things we don't have yet
function mapBackendFarmToUI(dbFarm: any): Farm {
  return {
    id: dbFarm._id,
    name: dbFarm.name,
    cropType: dbFarm.crop,
    area: dbFarm.area,
    areaUnit: dbFarm.areaUnit || 'Acre',
    totalPlants: dbFarm.plantCount || 0,
    dailyWater: dbFarm.dailyWaterReq || 0,
    nReq: dbFarm.nReq || 0,
    pReq: dbFarm.pReq || 0,
    kReq: dbFarm.kReq || 0,
    pumpRuntimeHours: 0,
    location: dbFarm.location || '',
    status: 'Active',
    image: dbFarm.farmImage || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=600',
    metrics: {
      temperature: 24,
      moisture: 60,
      pH: dbFarm.targetPh || 6.0,
      ec: dbFarm.targetEc || 1.5,
      waterUsageToday: 0,
      fertilizerUsageToday: 0,
      pumpStatus: 'OFF',
      valveStatus: 'Closed',
      stirrerStatus: 'OFF',
      flushStatus: 'Closed',
      internetStatus: 'Online',
      batteryLevel: 100,
      waterLevel: 75
    },
    weather: {
      temp: 25,
      humidity: 50,
      rainChance: 0,
      windSpeed: 5,
      uvIndex: 5
    },
    aiRecommendations: {
      bestTime: '06:00 AM',
      diseaseRisk: 'Low',
      waterSavingTips: 'Maintain current schedule.',
      healthScore: 90
    },
    mapCoordinates: { lat: dbFarm.gpsLocation?.lat || 34.05, lng: dbFarm.gpsLocation?.lng || -118.24 }
  };
}
