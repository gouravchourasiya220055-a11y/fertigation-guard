import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Droplets, Activity, Thermometer, Wind, Zap } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const mockChartData = Array.from({ length: 10 }).map((_, i) => ({
  time: `10:${i}0`,
  ph: 6.0 + Math.random() * 0.8,
  ec: 1.5 + Math.random() * 0.5
}));

export default function Overview() {
  return (
    <div className="space-y-6">
      
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Farm Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time status of your fertigation system.</p>
        </div>
        
        <GlassCard className="px-6 py-3 border-emerald-500/30 bg-emerald-500/10 hidden md:block">
          <div className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5" />
            System Optimal
          </div>
        </GlassCard>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Water Level</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">82<span className="text-lg text-slate-500">%</span></h3>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">pH Level</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">6.4</h3>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl">
              <Thermometer className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Temperature</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">30<span className="text-lg text-slate-500">°C</span></h3>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Humidity</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">62<span className="text-lg text-slate-500">%</span></h3>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Charts & Action Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart */}
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Nutrient Dynamics (pH & EC)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.2} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="ph" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPh)" name="pH Level" />
                <Area type="monotone" dataKey="ec" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEc)" name="EC (mS/cm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* AI Recommendations Mini */}
        <GlassCard className="p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI Insights</h3>
          </div>

          <div className="flex-1 space-y-4">
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <h4 className="text-orange-600 dark:text-orange-400 font-medium text-sm mb-1">Increase Fertilizer</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">EC is slightly below target (1.8) for Tomato crops. Recommend 5ml dose.</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-1">Optimal Moisture</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Current watering schedule is perfect. No changes needed.</p>
            </div>
          </div>
          
          <button className="mt-4 w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            View All Recommendations
          </button>
        </GlassCard>

      </div>
    </div>
  );
}
