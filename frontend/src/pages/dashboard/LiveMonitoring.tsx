import { GlassCard } from '@/components/ui/GlassCard';
import { MapPin, Navigation, Droplets, Zap, Eye } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export default function LiveMonitoring() {
  const { activeFarm } = useFarm();

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1B4332]">Live Monitoring</h2>
          <p className="text-[#5E6E64] mt-1 text-sm font-bold">Real-time map and sensor streams for {activeFarm.name}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-[#FFF5F5] text-[#DC2626] rounded-full text-sm font-bold animate-pulse border border-red-200/50">
          <div className="w-2 h-2 rounded-full bg-[#DC2626]" />
          Live
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Map Area */}
        <GlassCard className="p-0 lg:col-span-3 relative overflow-hidden flex flex-col min-h-[400px] border-[#DDE7D9]">
          <div className="absolute top-4 left-4 z-10 p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-[#DDE7D9]">
            <h3 className="font-bold text-[#1B4332] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#2E7D32]" />
              {activeFarm.location}
            </h3>
            <p className="text-xs text-[#5E6E64] mt-1 font-bold">{activeFarm.mapCoordinates.lat}, {activeFarm.mapCoordinates.lng}</p>
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
              <div className="p-2 bg-[#2563EB] text-white rounded-full shadow-xl relative z-10 group-hover:scale-110 transition-transform">
                <Droplets className="w-5 h-5" />
              </div>
              <div className="mt-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[#1B4332] border border-[#DDE7D9]">
                Main Water Tank
              </div>
            </div>

            <div className="absolute top-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
              <div className="p-2 bg-[#16A34A] text-white rounded-full shadow-xl relative z-10 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div className="mt-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[#1B4332] border border-[#DDE7D9]">
                Pump Station 1
              </div>
            </div>

            <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
              <div className="p-2 bg-[#F59E0B] text-white rounded-full shadow-xl relative z-10 group-hover:scale-110 transition-transform">
                <Eye className="w-5 h-5" />
              </div>
              <div className="mt-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[#1B4332] border border-[#DDE7D9]">
                Sensor Node A
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 z-10 flex gap-2">
            <button className="p-2 bg-white rounded-lg shadow-md border border-[#DDE7D9] hover:bg-[#EAF7EA]/30 transition-colors cursor-pointer">
              <Navigation className="w-5 h-5 text-[#2E7D32]" />
            </button>
          </div>
        </GlassCard>

        {/* Live Event Stream */}
        <GlassCard className="p-6 flex flex-col h-[500px] lg:h-auto overflow-hidden border-[#DDE7D9]">
          <h3 className="font-bold text-[#1B4332] mb-4">Event Stream</h3>
          
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
                <span className="text-[#5E6E64] shrink-0 font-mono font-bold">{log.time}</span>
                <div className="w-2 h-2 mt-1.5 rounded-full shrink-0 flex-none" style={{ 
                  backgroundColor: log.type === 'warn' ? '#F59E0B' : log.type === 'success' ? '#16A34A' : '#2563EB' 
                }} />
                <span className="text-[#1B4332] font-semibold">{log.msg}</span>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
