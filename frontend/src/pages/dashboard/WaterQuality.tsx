import { motion } from 'framer-motion';
import { useFarm } from '@/context/FarmContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Droplets, FlaskConical, Activity, Database, Leaf, Thermometer, Waves, BarChart3 } from 'lucide-react';

export default function WaterQuality() {
  const { activeFarm } = useFarm();
  const { metrics } = activeFarm;

  const getPhColor = (ph: number) => {
    if (ph >= 6.0 && ph <= 7.0) return 'text-emerald-500 bg-emerald-500/10';
    if (ph < 6.0) return 'text-amber-500 bg-amber-500/10';
    return 'text-rose-500 bg-rose-500/10';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Water & Soil Quality</h1>
          <p className="text-slate-500 dark:text-slate-400">Nutrient and irrigation metrics for {activeFarm.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-2xl ${getPhColor(metrics.pH)}`}>
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Soil pH Level</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.pH}</h3>
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden flex">
            <div className="bg-rose-500 h-full" style={{ width: '40%' }} />
            <div className="bg-emerald-500 h-full" style={{ width: '30%' }} />
            <div className="bg-blue-500 h-full" style={{ width: '30%' }} />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
            <span>Acidic</span>
            <span>Optimal</span>
            <span>Alkaline</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Electrical Conductivity (EC)</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.ec} mS/cm</h3>
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(metrics.ec / 4) * 100}%` }} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Today's Water Usage</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.waterUsageToday} L</h3>
            </div>
          </div>
          <p className="text-sm text-emerald-500 font-medium flex items-center gap-1">
            <Activity className="w-4 h-4" />
            Normal usage for this crop
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">TDS Level</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">450 ppm</h3>
            </div>
          </div>
          <p className="text-sm text-emerald-500 font-medium">Optimal range for this crop</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-2xl">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Turbidity</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">2.1 NTU</h3>
            </div>
          </div>
          <p className="text-sm text-emerald-500 font-medium">Clear water</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl">
              <Thermometer className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Water Temperature</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">22°C</h3>
            </div>
          </div>
          <p className="text-sm text-emerald-500 font-medium">Perfect for roots</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Fertilizer Dosed</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.fertilizerUsageToday} L</h3>
            </div>
          </div>
          <p className="text-sm text-emerald-500 font-medium flex items-center gap-1">
            <Activity className="w-4 h-4" />
            NPK Ratio Optimal
          </p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-500" />
            Main Water Tank Level
          </h3>
          <div className="flex items-end justify-center gap-8 h-64">
            <div className="w-32 h-full bg-slate-100 dark:bg-slate-800 rounded-t-xl border-x border-t border-slate-300 dark:border-slate-600 relative overflow-hidden flex items-end">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: '75%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="w-full bg-blue-500/80 backdrop-blur-sm relative"
              >
                {/* Water waves effect */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-white/20 animate-pulse rounded-t-full" />
              </motion.div>
            </div>
            <div className="pb-8">
              <p className="text-sm text-slate-500 dark:text-slate-400">Current Level</p>
              <p className="text-4xl font-bold text-slate-800 dark:text-white mt-1">75%</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">7,500 L / 10,000 L</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-500" />
            Fertilizer Tanks
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tank A (Nitrogen)</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">45%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-4 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tank B (Phosphorus)</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">80%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-4 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: '80%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tank C (Potassium)</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">20%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-4 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Charts Section Placeholder */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Water Quality Trends
        </h3>
        <div className="h-64 w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/10">
          <p className="text-slate-500">Interactive charts will be rendered here.</p>
        </div>
      </GlassCard>
    </div>
  );
}
