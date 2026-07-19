import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
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
  
  // Track last telemetry time per farm for offline detection
  const lastTelemetryRef = useRef<Record<string, number>>({});

  // Fetch initial farms and live telemetry
  useEffect(() => {
    fetchFarmsAndLive();
  }, []);

  const fetchFarmsAndLive = async () => {
    setIsLoading(true);

    try {
      const [farmsRes, liveRes] = await Promise.all([
        api.get('/farms'),
        api.get('/telemetry/latest').catch(() => ({ data: { data: null } }))
      ]);
      
      const backendFarms = farmsRes.data.data;
      const latestData = liveRes.data?.data;

      if (backendFarms.length > 0) {
        const mappedFarms: Farm[] = backendFarms.map((f: any) => {
           const farmObj = mapBackendFarmToUI(f);
           if (latestData && (latestData.farm === f._id || latestData.deviceId === f.esp32DeviceId)) {
             applyTelemetry(farmObj, latestData);
             lastTelemetryRef.current[f._id] = Date.now();
           }
           return farmObj;
        });
        setFarms(mappedFarms);
        setActiveFarmId(mappedFarms[0].id);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyTelemetry = (farmObj: Farm, telemetry: any) => {
    farmObj.metrics.temperature = telemetry.temperature ?? farmObj.metrics.temperature;
    farmObj.metrics.moisture = telemetry.soilMoisture ?? farmObj.metrics.moisture;
    farmObj.metrics.pH = telemetry.ph ?? farmObj.metrics.pH;
    farmObj.metrics.ec = telemetry.tds ?? telemetry.ec ?? farmObj.metrics.ec;
    farmObj.metrics.waterLevel = telemetry.waterTank ?? farmObj.metrics.waterLevel;
    
    if (telemetry.relay) {
       farmObj.metrics.pumpStatus = telemetry.relay.pump ? 'ON' : 'OFF';
       farmObj.metrics.valveStatus = telemetry.relay.fertilizer ? 'Open' : 'Closed';
       farmObj.metrics.stirrerStatus = telemetry.relay.stirrer ? 'ON' : 'OFF';
       farmObj.metrics.flushStatus = telemetry.relay.flush ? 'Open' : 'Closed';
    }
  };

  // Socket.io telemetry listener
  useEffect(() => {
    socket.on('telemetry', (latestData: any) => {
      setFarms(prev => prev.map(f => {
        if (f.id === latestData.farm || f.deviceId === latestData.deviceId) {
          lastTelemetryRef.current[f.id] = Date.now();
          const updatedFarm = { ...f };
          updatedFarm.metrics = { ...f.metrics };
          updatedFarm.metrics.internetStatus = 'Online';
          applyTelemetry(updatedFarm, latestData);
          return updatedFarm;
        }
        return f;
      }));
    });

    return () => {
      socket.off('telemetry');
    };
  }, []);

  // Offline checker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setFarms(prev => prev.map(f => {
        const lastSeen = lastTelemetryRef.current[f.id];
        // If last seen is older than 10 seconds, mark as offline
        if (lastSeen && (now - lastSeen > 10000)) {
          if (f.metrics.internetStatus !== 'Offline') {
            return {
              ...f,
              metrics: {
                ...f.metrics,
                internetStatus: 'Offline'
              }
            };
          }
        }
        return f;
      }));
    }, 5000);

    return () => clearInterval(interval);
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

// Helper to map DB farm to UI farm
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
      temperature: 0,
      moisture: 0,
      pH: 0,
      ec: 0,
      waterUsageToday: 0,
      fertilizerUsageToday: 0,
      pumpStatus: 'OFF',
      valveStatus: 'Closed',
      stirrerStatus: 'OFF',
      flushStatus: 'Closed',
      internetStatus: 'Offline', // default to offline until telemetry arrives
      batteryLevel: 100,
      waterLevel: 0
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
      waterSavingTips: 'Ensure internet connectivity.',
      healthScore: 0
    },
    mapCoordinates: { lat: dbFarm.gpsLocation?.lat || 34.05, lng: dbFarm.gpsLocation?.lng || -118.24 },
    deviceId: dbFarm.esp32DeviceId
  };
}
