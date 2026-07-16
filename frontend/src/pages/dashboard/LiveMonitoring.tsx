import { GlassCard } from '@/components/ui/GlassCard';
import { MapPin, Navigation, Droplets, Zap, Eye } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export default function LiveMonitoring() {
  const { activeFarm } = useFarm();

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Live Monitoring</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time map and sensor streams for {activeFarm.name}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium animate-pulse">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          Live
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Map Area */}
        <GlassCard className="p-0 lg:col-span-3 relative overflow-hidden flex flex-col min-h-[400px]">
          <div className="absolute top-4 left-4 z-10 p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 dark:border-white/10">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              {activeFarm.location}
            </h3>
            <p className="text-xs text-slate-500 mt-1">{activeFarm.mapCoordinates.lat}, {activeFarm.mapCoordinates.lng}</p>
          </div>
          
          <div className="flex-1 w-full relative">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" 
              alt="Farm Map" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/20" />

            {/* Map Markers */}
            <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
              <div className="p-2 bg-blue-500 text-white rounded-full shadow-xl relative z-10 group-hover:scale-110 transition-transform">
                <Droplets className="w-5 h-5" />
              </div>
              <div className="mt-2 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700">
                Main Water Tank
              </div>
            </div>

            <div className="absolute top-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
              <div className="p-2 bg-emerald-500 text-white rounded-full shadow-xl relative z-10 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div className="mt-2 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700">
                Pump Station 1
              </div>
            </div>

            <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
              <div className="p-2 bg-amber-500 text-white rounded-full shadow-xl relative z-10 group-hover:scale-110 transition-transform">
                <Eye className="w-5 h-5" />
              </div>
              <div className="mt-2 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700">
                Sensor Node A
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 z-10 flex gap-2">
            <button className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <Navigation className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </GlassCard>

        {/* Live Event Stream */}
        <GlassCard className="p-6 flex flex-col h-[500px] lg:h-auto overflow-hidden">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Event Stream</h3>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {[
              { time: '14:23', msg: 'Pump Station 1 started.', type: 'info' },
              { time: '14:20', msg: 'Soil moisture dropped below 40%.', type: 'warn' },
              { time: '14:15', msg: 'AI triggered watering schedule.', type: 'success' },
              { time: '13:05', msg: 'Fertilizer mix complete.', type: 'success' },
              { time: '12:30', msg: 'EC level reading: 1.8 mS/cm', type: 'info' },
              { time: '11:00', msg: 'System check normal.', type: 'success' },
              { time: '09:15', msg: 'Valve 2 opened.', type: 'info' },
              { time: '08:00', msg: 'Daily report generated.', type: 'info' },
            ].map((log, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="text-slate-400 shrink-0 font-mono">{log.time}</span>
                <div className="w-2 h-2 mt-1.5 rounded-full shrink-0 flex-none" style={{ 
                  backgroundColor: log.type === 'warn' ? '#f59e0b' : log.type === 'success' ? '#10b981' : '#3b82f6' 
                }} />
                <span className="text-slate-600 dark:text-slate-300">{log.msg}</span>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
