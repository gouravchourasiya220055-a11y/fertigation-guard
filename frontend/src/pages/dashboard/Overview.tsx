import { GlassCard } from '@/components/ui/GlassCard';
import { Droplets, Activity, Zap, Battery, Router, Leaf } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useFarm } from '@/context/FarmContext';
import { motion } from 'framer-motion';

const mockChartData = Array.from({ length: 10 }).map((_, i) => ({
  time: `10:${i}0`,
  ph: 6.0 + Math.random() * 0.8,
  ec: 1.5 + Math.random() * 0.5
}));

export default function Overview() {
  const { farms, activeFarm } = useFarm();
  const { metrics, aiRecommendations } = activeFarm;

  const kpis = [
    { title: 'Total Farms', value: farms.length, icon: Leaf, color: 'emerald' },
    { title: 'Active Irrigation', value: activeFarm.metrics.pumpStatus === 'ON' ? 'Running' : 'Off', icon: Droplets, color: 'blue' },
    { title: "Today's Water", value: `${metrics.waterUsageToday} L`, icon: Droplets, color: 'cyan' },
    { title: "Today's Fertilizer", value: `${metrics.fertilizerUsageToday} L`, icon: Zap, color: 'amber' },
    { title: 'Average pH', value: metrics.pH, icon: Activity, color: 'emerald' },
    { title: 'Average EC', value: metrics.ec, icon: Activity, color: 'amber' },
    { title: 'Water Tank', value: '75%', icon: Droplets, color: 'blue' },
    { title: 'Battery', value: `${metrics.batteryLevel}%`, icon: Battery, color: metrics.batteryLevel > 20 ? 'emerald' : 'rose' },
    { title: 'Pump Status', value: metrics.pumpStatus, icon: Zap, color: metrics.pumpStatus === 'ON' ? 'emerald' : 'slate' },
    { title: 'Valve Status', value: metrics.valveStatus, icon: Zap, color: metrics.valveStatus === 'Open' ? 'blue' : 'slate' },
    { title: 'Internet', value: metrics.internetStatus, icon: Router, color: metrics.internetStatus === 'Online' ? 'emerald' : 'rose' },
    { title: 'ESP32 Status', value: 'Online', icon: Router, color: 'emerald' },
  ];

  const getColorClasses = (color: string) => {
    const map: Record<string, { bg: string, text: string }> = {
      emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-500' },
      blue: { bg: 'bg-blue-500/20', text: 'text-blue-500' },
      cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-500' },
      amber: { bg: 'bg-amber-500/20', text: 'text-amber-500' },
      rose: { bg: 'bg-rose-500/20', text: 'text-rose-500' },
      slate: { bg: 'bg-slate-500/20', text: 'text-slate-500' },
    };
    return map[color] || map.slate;
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Farm Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time status of {activeFarm.name}</p>
        </div>
        
        <GlassCard className="px-6 py-3 border-emerald-500/30 bg-emerald-500/10 hidden md:block">
          <div className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5" />
            System {activeFarm.status}
          </div>
        </GlassCard>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const colors = getColorClasses(kpi.color);
          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <GlassCard className="p-4 flex flex-col items-center justify-center text-center h-full hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors">
                <div className={`p-2 rounded-xl mb-3 ${colors.bg}`}>
                  <kpi.icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">{kpi.title}</p>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{kpi.value}</h3>
              </GlassCard>
            </motion.div>
          );
        })}
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
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
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
                <Area type="monotone" dataKey="ec" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorEc)" name="EC (mS/cm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* AI Recommendations Mini */}
        <GlassCard className="p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-gradient-to-tr from-primary to-accent rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI Insights</h3>
          </div>

          <div className="flex-1 space-y-4">
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <h4 className="text-orange-600 dark:text-orange-400 font-medium text-sm mb-1">Disease Risk</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">{aiRecommendations.diseaseRisk}</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-1">Water Saving Tip</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">{aiRecommendations.waterSavingTips}</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <h4 className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-1">Best Irrigation Time</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">{aiRecommendations.bestTime}</p>
            </div>
          </div>
          
        </GlassCard>

      </div>
    </div>
  );
}
