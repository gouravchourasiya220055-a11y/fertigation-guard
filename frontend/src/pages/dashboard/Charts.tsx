import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { useFarm } from '@/context/FarmContext';

// Mock data generation
export default function Charts() {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '1m' | '1y'>('24h');
  const [chartData, setChartData] = useState<any[]>([]);
  const { activeFarmId } = useFarm();

  useEffect(() => {
    if (activeFarmId) {
      fetchChartData();
    }
  }, [timeframe, activeFarmId]);

  const fetchChartData = async () => {
    try {
      const res = await api.get(`/sensors/history?farmId=${activeFarmId}&timeframe=${timeframe}`);
      
      // Transform data for recharts
      const transformedData = res.data.data.map((d: any) => {
        const date = new Date(d.createdAt);
        return {
          time: timeframe === '24h' ? `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}` : date.toLocaleDateString(),
          ph: d.ph || 0,
          ec: d.ec || 0,
          temp: d.temperature || 0,
          water: d.waterLevel || 0
        };
      });
      setChartData(transformedData);
    } catch (error) {
      console.error('Error fetching chart data', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Analytics & Charts</h2>
          <p className="text-muted-foreground mt-1">Visualize your farm's historical data trends.</p>
        </div>

        <div className="flex gap-4">
          <GlassCard className="p-1.5 flex items-center gap-1 border-border">
            {(['24h', '7d', '1m', '1y'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
                  timeframe === tf 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {tf}
              </button>
            ))}
          </GlassCard>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card hover:bg-muted transition-colors border border-border backdrop-blur-md shadow-sm text-sm font-medium text-foreground">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* pH & EC Chart */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Nutrient Profile (pH & EC)</h3>
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="ph" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPh)" name="pH Level" />
                <Area type="monotone" dataKey="ec" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEc)" name="EC (mS/cm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Temperature & Water Level Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Temperature (°C)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.2} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }} />
                  <Area type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" name="Temp °C" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Water Tank Level (%)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.2} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }} />
                  <Area type="monotone" dataKey="water" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorWater)" name="Water %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
