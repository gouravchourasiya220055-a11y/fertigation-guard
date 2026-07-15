import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Activity, Thermometer, Droplets, Wind, Waves, Battery, Wifi, Radio } from 'lucide-react';

const mockLiveData = {
  ph: 6.4,
  ec: 1.8,
  temperature: 30,
  humidity: 62,
  waterLevel: 82,
  flowRate: 15,
  pumpStatus: true,
  fertilizerPump: false,
  wifiStatus: 'Connected',
  loraStatus: 'Connected',
  battery: 89
};

const SensorCard = ({ title, value, unit, icon: Icon, color, bg, delay }: any) => (
  <GlassCard 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="p-6 relative overflow-hidden group"
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 ${bg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${bg} ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
          {value}<span className="text-lg text-slate-500 ml-1">{unit}</span>
        </h3>
      </div>
    </div>
  </GlassCard>
);

export default function LiveMonitoring() {
  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Live Monitoring</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time data straight from your ESP32 sensors.</p>
      </div>

      {/* Main Sensors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SensorCard title="pH Level" value={mockLiveData.ph} unit="" icon={Activity} color="text-emerald-500" bg="bg-emerald-500/20" delay={0.1} />
        <SensorCard title="EC (Nutrients)" value={mockLiveData.ec} unit="mS/cm" icon={Activity} color="text-blue-500" bg="bg-blue-500/20" delay={0.2} />
        <SensorCard title="Temperature" value={mockLiveData.temperature} unit="°C" icon={Thermometer} color="text-orange-500" bg="bg-orange-500/20" delay={0.3} />
        <SensorCard title="Humidity" value={mockLiveData.humidity} unit="%" icon={Wind} color="text-purple-500" bg="bg-purple-500/20" delay={0.4} />
      </div>

      {/* Water & Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <SensorCard title="Water Tank Level" value={mockLiveData.waterLevel} unit="%" icon={Droplets} color="text-cyan-500" bg="bg-cyan-500/20" delay={0.5} />
        <SensorCard title="Flow Rate" value={mockLiveData.flowRate} unit="L/min" icon={Waves} color="text-sky-500" bg="bg-sky-500/20" delay={0.6} />
      </div>

      {/* System Status */}
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Hardware & Connectivity</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 flex items-center gap-4" delay={0.7}>
          <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-500">
            <Wifi className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">WiFi Status</p>
            <p className="font-semibold text-emerald-500">{mockLiveData.wifiStatus}</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-4" delay={0.8}>
          <div className="p-3 rounded-full bg-blue-500/20 text-blue-500">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">LoRa Status</p>
            <p className="font-semibold text-blue-500">{mockLiveData.loraStatus}</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-4" delay={0.9}>
          <div className="p-3 rounded-full bg-amber-500/20 text-amber-500">
            <Battery className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Battery</p>
            <p className="font-semibold text-slate-900 dark:text-white">{mockLiveData.battery}%</p>
          </div>
        </GlassCard>
      </div>

    </div>
  );
}
