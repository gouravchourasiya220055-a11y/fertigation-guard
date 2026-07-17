import { motion } from 'framer-motion';
import { useFarm } from '@/context/FarmContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { CloudSun, Droplets, Wind, Sun, CloudRain, Sunrise, Sunset, Umbrella } from 'lucide-react';

export default function Weather() {
  const { activeFarm } = useFarm();

  if (!activeFarm) return null;

  const { weather } = activeFarm;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Farm Weather</h1>
          <p className="text-muted-foreground">Microclimate analysis for {activeFarm.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Main Temp Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6 relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CloudSun className="w-24 h-24" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Temperature</p>
              <h2 className="text-5xl font-bold text-foreground mt-2">{weather.temp}°C</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-4 flex items-center gap-1">
              <Sun className="w-4 h-4 text-orange-500" />
              Partly Cloudy
            </p>
          </GlassCard>
        </motion.div>

        {/* Humidity Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-6 relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Droplets className="w-24 h-24" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Humidity</p>
              <h2 className="text-4xl font-bold text-foreground mt-2">{weather.humidity}%</h2>
            </div>
            <div className="w-full bg-muted h-2 rounded-full mt-4">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${weather.humidity}%` }} />
            </div>
          </GlassCard>
        </motion.div>

        {/* Rain Chance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="p-6 relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CloudRain className="w-24 h-24" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Precipitation Chance</p>
              <h2 className="text-4xl font-bold text-foreground mt-2">{weather.rainChance}%</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-4 flex items-center gap-1">
              <Umbrella className="w-4 h-4 text-blue-400" />
              {weather.rainChance > 50 ? 'Rain Expected' : 'No Rain Expected'}
            </p>
          </GlassCard>
        </motion.div>

        {/* Wind Speed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GlassCard className="p-6 relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Wind className="w-24 h-24" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Wind Speed</p>
              <h2 className="text-4xl font-bold text-foreground mt-2">{weather.windSpeed} km/h</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-4">Direction: NE</p>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 flex items-center gap-4">
          <div className="p-4 bg-orange-500/10 rounded-2xl">
            <Sunrise className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <p className="text-muted-foreground font-medium">Sunrise</p>
            <p className="text-xl font-bold text-foreground">06:15 AM</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 rounded-2xl">
            <Sunset className="w-8 h-8 text-purple-500" />
          </div>
          <div>
            <p className="text-muted-foreground font-medium">Sunset</p>
            <p className="text-xl font-bold text-foreground">18:45 PM</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-4">
          <div className="p-4 bg-amber-500/10 rounded-2xl">
            <Sun className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <p className="text-muted-foreground font-medium">UV Index</p>
            <p className="text-xl font-bold text-foreground">{weather.uvIndex} (Moderate)</p>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6 mt-6">
        <h3 className="text-lg font-bold text-foreground mb-6">7-Day Forecast</h3>
        <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={day} className="flex flex-col items-center p-4 bg-card rounded-xl min-w-[100px] border border-border">
              <span className="font-semibold text-foreground mb-2">{day}</span>
              {i % 3 === 0 ? <CloudRain className="w-8 h-8 text-blue-500 mb-2" /> : <Sun className="w-8 h-8 text-orange-500 mb-2" />}
              <span className="font-bold text-foreground text-lg">{22 + (i % 5)}°C</span>
              <span className="text-xs text-muted-foreground mt-1">{i % 3 === 0 ? 'Rain' : 'Sunny'}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
