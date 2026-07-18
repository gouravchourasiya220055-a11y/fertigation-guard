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
      emerald: { bg: 'bg-[#16A34A] dark:bg-[#15803D]', text: 'text-white' },
      blue: { bg: 'bg-[#2563EB] dark:bg-[#1D4ED8]', text: 'text-white' },
      cyan: { bg: 'bg-[#06B6D4] dark:bg-[#0E7490]', text: 'text-white' },
      amber: { bg: 'bg-[#EA580C] dark:bg-[#C2410C]', text: 'text-white' },
      rose: { bg: 'bg-[#DC2626] dark:bg-[#B91C1C]', text: 'text-white' },
      slate: { bg: 'bg-slate-500 dark:bg-slate-600 border border-slate-400', text: 'text-white' },
    };
    return map[color] || map.slate;
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1B4332]">Farm Overview</h2>
          <p className="text-[#5E6E64] mt-1 text-sm font-bold">Real-time status of {activeFarm.name}</p>
        </div>
        
        <div className="px-6 py-3 border border-[#DDE7D9] bg-[#EAF7EA] text-[#1B5E20] rounded-xl font-bold hidden md:flex items-center gap-2 shadow-sm">
          <Zap className="w-5 h-5 text-[#2E7D32]" />
          System {activeFarm.status}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const colors = getColorClasses(kpi.color);
          const bgClass = idx % 3 === 0 ? 'bg-white' : idx % 3 === 1 ? 'bg-[#EAF7EA]' : 'bg-[#FFF9F2]';
          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="h-full">
              <div className={`p-5 flex flex-col justify-between h-full hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(46,125,50,0.06)] border border-[#DDE7D9] border-t-4 border-t-[#2E7D32] rounded-2xl shadow-sm transition-all duration-300 ${bgClass}`}>
                <div className="flex items-center justify-between mb-4 w-full">
                  <span className="text-xs font-bold tracking-wide text-[#5E6E64] uppercase">{kpi.title}</span>
                  <div className={`p-2.5 rounded-full ${colors.bg} flex items-center justify-center shrink-0 shadow-sm`}>
                    <kpi.icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-[#1B4332] tracking-tight">{kpi.value}</h3>
                  <p className="text-[10px] font-bold text-[#5E6E64]/80">Live telemetric feed</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts & Action Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart */}
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-[#1B4332] mb-6">Nutrient Dynamics (pH & EC)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDE7D9" vertical={false} opacity={0.8} />
                <XAxis dataKey="time" stroke="#5E6E64" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#5E6E64" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #DDE7D9', 
                    borderRadius: '16px', 
                    color: '#1B4332',
                    boxShadow: '0 10px 15px -3px rgba(46, 125, 50, 0.05)'
                  }}
                  itemStyle={{ color: '#1B4332' }}
                />
                <Area type="monotone" dataKey="ph" stroke="#2E7D32" strokeWidth={3} fillOpacity={1} fill="url(#colorPh)" name="pH Level" />
                <Area type="monotone" dataKey="ec" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorEc)" name="EC (mS/cm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* AI Recommendations Mini */}
        <GlassCard className="p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-[#EAF7EA] text-[#2E7D32] rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#1B4332]">AI Insights</h3>
          </div>

          <div className="flex-1 space-y-4">
            <div className="p-4 rounded-xl bg-[#FFF5F5] border border-[#DDE7D9] flex items-start gap-3">
              <div className="w-1.5 h-full rounded bg-[#DC2626] self-stretch shrink-0" />
              <div>
                <h4 className="text-[#DC2626] font-bold text-sm mb-0.5">Disease Risk</h4>
                <p className="text-xs text-[#5E6E64] leading-relaxed font-semibold">{aiRecommendations.diseaseRisk}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#F0F7FF] border border-[#DDE7D9] flex items-start gap-3">
              <div className="w-1.5 h-full rounded bg-[#2563EB] self-stretch shrink-0" />
              <div>
                <h4 className="text-[#2563EB] font-bold text-sm mb-0.5">Water Saving Tip</h4>
                <p className="text-xs text-[#5E6E64] leading-relaxed font-semibold">{aiRecommendations.waterSavingTips}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#EAF7EA] border border-[#DDE7D9] flex items-start gap-3">
              <div className="w-1.5 h-full rounded bg-[#1B5E20] self-stretch shrink-0" />
              <div>
                <h4 className="text-[#1B5E20] font-bold text-sm mb-0.5 font-bold">Best Irrigation Time</h4>
                <p className="text-xs text-[#5E6E64] leading-relaxed font-semibold">{aiRecommendations.bestTime}</p>
              </div>
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
