import { createContext, useContext, useState, ReactNode } from 'react';
import { Farm, mockFarms } from '@/data/mockFarms';

interface FarmContextType {
  farms: Farm[];
  activeFarm: Farm;
  activeFarmId: string;
  setActiveFarmId: (id: string) => void;
  addFarm: (farm: Farm) => void;
  deleteFarm: (id: string) => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export function FarmProvider({ children }: { children: ReactNode }) {
  const [farms, setFarms] = useState<Farm[]>(mockFarms);
  const [activeFarmId, setActiveFarmId] = useState<string>(mockFarms[0].id);

  const activeFarm = farms.find(f => f.id === activeFarmId) || farms[0];

  const addFarm = (farm: Farm) => {
    setFarms(prev => [...prev, farm]);
    setActiveFarmId(farm.id);
  };

  const deleteFarm = (id: string) => {
    setFarms(prev => prev.filter(f => f.id !== id));
    if (activeFarmId === id) {
      setActiveFarmId(farms[0]?.id || '');
    }
  };

  return (
    <FarmContext.Provider value={{ farms, activeFarm, activeFarmId, setActiveFarmId, addFarm, deleteFarm }}>
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
