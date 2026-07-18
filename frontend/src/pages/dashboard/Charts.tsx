import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data generation
const generateData = (points: number) => {
  return Array.from({ length: points }).map((_, i) => ({
    time: `${Math.floor(i / 6)}:${(i % 6) * 10}0`,
    ph: 5.8 + Math.random() * 1.2,
    ec: 1.5 + Math.random() * 0.8,
    temp: 22 + Math.random() * 10,
    water: 60 + Math.random() * 40
  }));
};

const dailyData = generateData(24);
const weeklyData = generateData(7);
const monthlyData = generateData(30);

export default function Charts() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const dataMap = {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData
  };

  const currentData = dataMap[timeframe];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1B4332]">Analytics & Charts</h2>
          <p className="text-[#5E6E64] mt-1 text-sm font-bold">Visualize your farm's historical data trends.</p>
        </div>

        <div className="flex gap-4">
          <div className="p-1.5 flex items-center gap-1 bg-white border border-[#DDE7D9] rounded-xl shadow-sm">
            {(['daily', 'weekly', 'monthly'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-bold transition-all capitalize cursor-pointer",
                  timeframe === tf 
                    ? "bg-[#2E7D32] text-white shadow-sm" 
                    : "text-[#5E6E64] hover:bg-[#EAF7EA]/30 hover:text-[#1B4332]"
                )}
              >
                {tf}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#EAF7EA]/30 transition-all border border-[#DDE7D9] shadow-sm text-sm font-bold text-[#2E7D32] cursor-pointer">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* pH & EC Chart */}
        <GlassCard className="p-6 border-[#DDE7D9]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#1B4332]">Nutrient Profile (pH & EC)</h3>
            <Calendar className="w-5 h-5 text-[#5E6E64]" />
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDE7D9" vertical={false} opacity={0.8} />
                <XAxis dataKey="time" stroke="#5E6E64" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#5E6E64" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #DDE7D9', 
                    borderRadius: '16px', 
                    color: '#1B4332',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                  }} 
                />
                <Area type="monotone" dataKey="ph" stroke="#2E7D32" strokeWidth={3} fillOpacity={1} fill="url(#colorPh)" name="pH Level" />
                <Area type="monotone" dataKey="ec" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorEc)" name="EC (mS/cm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Temperature & Water Level Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6 border-[#DDE7D9]">
            <h3 className="text-lg font-bold text-[#1B4332] mb-6">Temperature (°C)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DDE7D9" vertical={false} opacity={0.8} />
                  <XAxis dataKey="time" stroke="#5E6E64" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#5E6E64" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #DDE7D9', 
                      borderRadius: '16px', 
                      color: '#1B4332',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }} 
                  />
                  <Area type="monotone" dataKey="temp" stroke="#DC2626" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" name="Temp °C" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-[#DDE7D9]">
            <h3 className="text-lg font-bold text-[#1B4332] mb-6">Water Tank Level (%)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DDE7D9" vertical={false} opacity={0.8} />
                  <XAxis dataKey="time" stroke="#5E6E64" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#5E6E64" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #DDE7D9', 
                      borderRadius: '16px', 
                      color: '#1B4332',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }} 
                  />
                  <Area type="monotone" dataKey="water" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorWater)" name="Water %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
