import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Droplets, TrendingUp, Activity, BarChart } from 'lucide-react';
import { useSocket } from '@/context/SocketContext';
import { useFarm } from '@/context/FarmContext';

import api from '@/lib/api';

export default function FlowMonitoring() {
  const { activeFarm } = useFarm();
  const { liveSensorData, isConnected } = useSocket();
  const [flowStats, setFlowStats] = useState<any>(null);

  useEffect(() => {
    if (activeFarm?.deviceId) {
      api.get(`/flow?deviceId=${activeFarm.deviceId}`)
        .then(res => setFlowStats(res.data.data))
        .catch(console.error);
    }
  }, [activeFarm?.deviceId]);

  if (!activeFarm) return null;

  // Real-time overrides
  const flowMixed = liveSensorData?.flowMixed ?? flowStats?.currentFlowMixed ?? 0;
  const flowWater = liveSensorData?.flowWater ?? flowStats?.currentFlowWater ?? 0;
  const flowFert = liveSensorData?.flowFertilizer ?? flowStats?.currentFlowFertilizer ?? 0;

  const totalWater = liveSensorData?.waterUsed ?? flowStats?.waterUsed ?? 0;
  const totalFert = liveSensorData?.fertilizerUsed ?? flowStats?.fertilizerUsed ?? 0;

  const dailyWater = flowStats?.dailyTotal?.water ?? 0;
  const dailyFert = flowStats?.dailyTotal?.fertilizer ?? 0;
  
  const monthlyWater = flowStats?.monthlyTotal?.water ?? 0;
  const monthlyFert = flowStats?.monthlyTotal?.fertilizer ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Flow Monitoring
          </h1>
          <p className="text-muted-foreground">Real-time pipeline analytics</p>
        </div>
        <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border ${isConnected ? 'bg-primary/10 text-primary border-primary/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-primary animate-pulse' : 'bg-red-500'}`} />
          {isConnected ? 'LIVE SENSOR FEED' : 'OFFLINE'}
        </div>
      </div>

      {/* Live Flow Rates Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 transition-colors group-hover:bg-blue-500/10" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-muted-foreground">Water Supply Flow</span>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Droplets className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="mt-auto">
              <div className="text-4xl font-bold text-foreground flex items-end gap-2">
                {flowWater.toFixed(1)} <span className="text-lg text-muted-foreground mb-1">L/h</span>
              </div>
              {flowWater > 0 && <span className="text-xs text-blue-500 animate-pulse mt-1 inline-block">Active Flow Detected</span>}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-amber-500/5 transition-colors group-hover:bg-amber-500/10" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-muted-foreground">Fertilizer Injection</span>
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Droplets className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <div className="mt-auto">
              <div className="text-4xl font-bold text-foreground flex items-end gap-2">
                {flowFert.toFixed(1)} <span className="text-lg text-muted-foreground mb-1">L/h</span>
              </div>
              {flowFert > 0 && <span className="text-xs text-amber-500 animate-pulse mt-1 inline-block">Active Injection</span>}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/5 transition-colors group-hover:bg-emerald-500/10" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-muted-foreground">Mixed Solution Output</span>
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <div className="mt-auto">
              <div className="text-4xl font-bold text-foreground flex items-end gap-2">
                {flowMixed.toFixed(1)} <span className="text-lg text-muted-foreground mb-1">L/h</span>
              </div>
              {flowMixed > 0 && <span className="text-xs text-emerald-500 animate-pulse mt-1 inline-block">Active Irrigation</span>}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Usage Analytics Grid */}
      <h3 className="text-lg font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
        <BarChart className="w-5 h-5 text-primary" />
        Consumption Analytics
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Water Used</p>
          <p className="text-2xl font-bold text-foreground">{totalWater.toFixed(1)} L</p>
        </GlassCard>
        
        <GlassCard className="p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Fertilizer Used</p>
          <p className="text-2xl font-bold text-foreground">{totalFert.toFixed(1)} L</p>
        </GlassCard>

        <GlassCard className="p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Today's Water</p>
          <p className="text-2xl font-bold text-blue-500">{dailyWater.toFixed(1)} L</p>
        </GlassCard>

        <GlassCard className="p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Today's Fertilizer</p>
          <p className="text-2xl font-bold text-amber-500">{dailyFert.toFixed(1)} L</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <GlassCard className="p-5 flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-transparent">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Monthly Water Consumption</p>
            <p className="text-3xl font-bold text-foreground mt-1">{monthlyWater.toFixed(1)} L</p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-500 opacity-50" />
        </GlassCard>
        
        <GlassCard className="p-5 flex justify-between items-center bg-gradient-to-r from-amber-500/10 to-transparent">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Monthly Fertilizer Consumption</p>
            <p className="text-3xl font-bold text-foreground mt-1">{monthlyFert.toFixed(1)} L</p>
          </div>
          <TrendingUp className="w-8 h-8 text-amber-500 opacity-50" />
        </GlassCard>
      </div>

    </div>
  );
}
