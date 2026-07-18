import { motion } from 'framer-motion';
import { useFarm } from '@/context/FarmContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { CloudSun, Droplets, Wind, Sun, CloudRain, Sunrise, Sunset, Umbrella } from 'lucide-react';

export default function Weather() {
  const { activeFarm } = useFarm();
  const { weather } = activeFarm;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1B4332]">Farm Weather</h1>
          <p className="text-[#5E6E64] text-sm font-semibold">Microclimate analysis for {activeFarm.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Main Temp Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="p-6 relative overflow-hidden h-full flex flex-col justify-between bg-white border border-[#DDE7D9] border-t-4 border-t-[#2E7D32] rounded-2xl shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-[#2E7D32]">
              <CloudSun className="w-24 h-24" />
            </div>
            <div>
              <p className="text-[#5E6E64] font-bold">Temperature</p>
              <h2 className="text-5xl font-black text-[#1B4332] mt-2">{weather.temp}°C</h2>
            </div>
            <p className="text-sm text-[#5E6E64] mt-4 flex items-center gap-1 font-semibold">
              <Sun className="w-4 h-4 text-[#F59E0B]" />
              Partly Cloudy
            </p>
          </div>
        </motion.div>

        {/* Humidity Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="p-6 relative overflow-hidden h-full flex flex-col justify-between bg-[#EAF7EA] border border-[#DDE7D9] rounded-2xl shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-[#2E7D32]">
              <Droplets className="w-24 h-24" />
            </div>
            <div>
              <p className="text-[#5E6E64] font-bold">Humidity</p>
              <h2 className="text-4xl font-black text-[#1B4332] mt-2">{weather.humidity}%</h2>
            </div>
            <div className="w-full bg-white/60 h-2 rounded-full mt-4">
              <div className="bg-[#2E7D32] h-2 rounded-full" style={{ width: `${weather.humidity}%` }} />
            </div>
          </div>
        </motion.div>

        {/* Rain Chance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="p-6 relative overflow-hidden h-full flex flex-col justify-between bg-[#FFF9F2] border border-[#DDE7D9] rounded-2xl shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-[#F59E0B]">
              <CloudRain className="w-24 h-24" />
            </div>
            <div>
              <p className="text-[#5E6E64] font-bold">Precipitation Chance</p>
              <h2 className="text-4xl font-black text-[#1B4332] mt-2">{weather.rainChance}%</h2>
            </div>
            <p className="text-sm text-[#5E6E64] mt-4 flex items-center gap-1 font-semibold">
              <Umbrella className="w-4 h-4 text-blue-500" />
              {weather.rainChance > 50 ? 'Rain Expected' : 'No Rain Expected'}
            </p>
          </div>
        </motion.div>

        {/* Wind Speed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="p-6 relative overflow-hidden h-full flex flex-col justify-between bg-white border border-[#DDE7D9] border-t-4 border-t-[#2E7D32] rounded-2xl shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-[#2E7D32]">
              <Wind className="w-24 h-24" />
            </div>
            <div>
              <p className="text-[#5E6E64] font-bold">Wind Speed</p>
              <h2 className="text-4xl font-black text-[#1B4332] mt-2">{weather.windSpeed} km/h</h2>
            </div>
            <p className="text-sm text-[#5E6E64] mt-4 font-semibold">Direction: NE</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-[#DDE7D9] rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-4 bg-[#FFF9F2] rounded-2xl">
            <Sunrise className="w-8 h-8 text-[#F59E0B]" />
          </div>
          <div>
            <p className="text-[#5E6E64] font-bold">Sunrise</p>
            <p className="text-xl font-black text-[#1B4332]">06:15 AM</p>
          </div>
        </div>

        <div className="p-6 bg-white border border-[#DDE7D9] rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-4 bg-[#FFF5F5] rounded-2xl">
            <Sunset className="w-8 h-8 text-[#DC2626]" />
          </div>
          <div>
            <p className="text-[#5E6E64] font-bold">Sunset</p>
            <p className="text-xl font-black text-[#1B4332]">18:45 PM</p>
          </div>
        </div>

        <div className="p-6 bg-white border border-[#DDE7D9] rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-4 bg-[#EAF7EA] rounded-2xl">
            <Sun className="w-8 h-8 text-[#2E7D32]" />
          </div>
          <div>
            <p className="text-[#5E6E64] font-bold">UV Index</p>
            <p className="text-xl font-black text-[#1B4332]">{weather.uvIndex} (Moderate)</p>
          </div>
        </div>
      </div>

      <GlassCard className="p-6 mt-6 border-[#DDE7D9]">
        <h3 className="text-lg font-bold text-[#1B4332] mb-6">7-Day Forecast</h3>
        <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={day} className="flex flex-col items-center p-4 bg-[#EEF6EC] rounded-xl min-w-[100px] border border-[#DDE7D9]">
              <span className="font-bold text-[#1B4332] mb-2">{day}</span>
              {i % 3 === 0 ? <CloudRain className="w-8 h-8 text-blue-500 mb-2" /> : <Sun className="w-8 h-8 text-[#F59E0B] mb-2" />}
              <span className="font-extrabold text-[#1B4332] text-lg">{22 + (i % 5)}°C</span>
              <span className="text-xs text-[#5E6E64] font-bold mt-1">{i % 3 === 0 ? 'Rain' : 'Sunny'}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
