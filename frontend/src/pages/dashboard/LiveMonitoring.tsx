import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { MapPin, Navigation, Droplets, Zap, Eye } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { useSocket } from '@/context/SocketContext';
import { Activity, Wifi } from 'lucide-react';

export default function LiveMonitoring() {
  const { activeFarm } = useFarm();
  const { isConnected, liveSensorData, liveRelayData } = useSocket();
  const [logs, setLogs] = useState<{time: string, msg: string, type: 'info' | 'warn' | 'success'}[]>([
    { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), msg: 'Live monitoring started.', type: 'info' }
  ]);

  const [prevRelays, setPrevRelays] = useState<any>(null);

  useEffect(() => {
    if (liveSensorData) {
      setLogs(prev => [
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          msg: `Telemetry Update | pH: ${Number(liveSensorData.ph).toFixed(1)} | EC: ${Number(liveSensorData.ec).toFixed(1)} | Flow: ${Number(liveSensorData.flowMixed).toFixed(1)} L/h`,
          type: 'info' as const
        },
        ...prev
      ].slice(0, 100));
    }
  }, [liveSensorData?.timestamp]);

  useEffect(() => {
    setLogs(prev => [
      {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        msg: `Gateway Connection Status: ${isConnected ? 'ONLINE' : 'OFFLINE'}`,
        type: (isConnected ? 'success' : 'warn') as 'success' | 'warn'
      },
      ...prev
    ].slice(0, 100));
  }, [isConnected]);

  useEffect(() => {
    if (liveRelayData) {
      if (prevRelays) {
        Object.keys(liveRelayData).forEach(key => {
          if (liveRelayData[key] !== prevRelays[key]) {
            setLogs(prev => [
              {
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                msg: `Relay Triggered: ${key} is now ${liveRelayData[key] ? 'ON' : 'OFF'}`,
                type: (liveRelayData[key] ? 'success' : 'warn') as 'success' | 'warn'
              },
              ...prev
            ].slice(0, 100));
          }
        });
      }
      setPrevRelays(liveRelayData);
    }
  }, [liveRelayData]);

  if (!activeFarm) return null;

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Live Monitoring</h2>
          <p className="text-muted-foreground mt-1">Real-time map and sensor streams for {activeFarm.name}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${isConnected ? 'bg-green-500/10 text-green-500 animate-pulse' : 'bg-red-500/10 text-red-500'}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          {isConnected ? 'Live' : 'Offline'}
        </div>
      </div>

      {/* Sensor Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-muted-foreground">pH Level</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-foreground">{liveSensorData?.ph ? Number(liveSensorData.ph).toFixed(2) : '--'}</span>
        </GlassCard>
        
        <GlassCard className="p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-muted-foreground">EC (mS/cm)</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-foreground">{liveSensorData?.ec ? Number(liveSensorData.ec).toFixed(2) : '--'}</span>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-muted-foreground">Soil Moisture</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-bold text-foreground">{liveSensorData?.soilMoisture ? Number(liveSensorData.soilMoisture).toFixed(1) : '--'}%</span>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-muted-foreground">LoRa Signal (RSSI)</span>
            <Wifi className="w-4 h-4 text-primary" />
          </div>
          <span className="text-2xl font-bold text-foreground">{liveSensorData?.rssi ? `${liveSensorData.rssi} dBm` : '--'}</span>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Map Area */}
        <GlassCard className="p-0 lg:col-span-3 relative overflow-hidden flex flex-col min-h-[400px]">
          <div className="absolute top-4 left-4 z-10 p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl shadow-lg border border-border">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              {activeFarm.location}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{activeFarm.mapCoordinates.lat}, {activeFarm.mapCoordinates.lng}</p>
          </div>
          
          <div className="flex-1 w-full relative">
            <img 
              src={activeFarm.image} 
              alt="Farm Map" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/20" />

            {/* Map Markers */}
            <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
              <div className="p-2 bg-blue-500 text-white rounded-full shadow-xl relative z-10 group-hover:scale-110 transition-transform">
                <Droplets className="w-5 h-5" />
              </div>
              <div className="mt-2 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-foreground border border-border">
                Main Water Tank
              </div>
            </div>

            <div className="absolute top-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
              <div className="p-2 bg-emerald-500 text-white rounded-full shadow-xl relative z-10 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div className="mt-2 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-foreground border border-border">
                Pump Station 1
              </div>
            </div>

            <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
              <div className="p-2 bg-amber-500 text-white rounded-full shadow-xl relative z-10 group-hover:scale-110 transition-transform">
                <Eye className="w-5 h-5" />
              </div>
              <div className="mt-2 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-foreground border border-border">
                Sensor Node A
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 z-10 flex gap-2">
            <button className="p-2 bg-card rounded-lg shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <Navigation className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </GlassCard>

        {/* Live Event Stream */}
        <GlassCard className="p-6 flex flex-col h-[500px] lg:h-auto overflow-hidden">
          <h3 className="font-bold text-foreground mb-4">Event Stream</h3>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="text-slate-400 shrink-0 font-mono">{log.time}</span>
                <div className="w-2 h-2 mt-1.5 rounded-full shrink-0 flex-none" style={{ 
                  backgroundColor: log.type === 'warn' ? '#f59e0b' : log.type === 'success' ? '#10b981' : '#3b82f6' 
                }} />
                <span className="text-muted-foreground">{log.msg}</span>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
