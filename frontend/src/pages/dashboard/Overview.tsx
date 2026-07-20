import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Droplets, Activity, Zap, Leaf, MapPin, TrendingUp, Thermometer, CloudRain, Router } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';
import { useFarm } from '@/context/FarmContext';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useSocket } from '@/context/SocketContext';

export default function Overview() {
  const { activeFarm, isLoading } = useFarm();
  const [chartData, setChartData] = useState<any[]>([]);
  const { liveSensorData, isConnected, liveRelayData } = useSocket();

  useEffect(() => {
    if (activeFarm?.id) {
      api.get(`/sensors/history?farmId=${activeFarm.id}&limit=10`)
        .then(res => {
          const data = res.data.data.map((d: any) => ({
            time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ph: d.ph || 0,
            ec: d.ec || 0
          })).reverse();
          setChartData(data);
        })
        .catch(console.error);
    }
  }, [activeFarm?.id]);
  
  if (isLoading || !activeFarm) {
    return <div className="p-8 text-center text-muted-foreground">Loading Dashboard...</div>;
  }

  const { metrics, aiRecommendations, weather } = activeFarm;
  const metricsAny = metrics as any;

  const liveTemp = liveSensorData?.temperature ?? metricsAny.temperature ?? 28;
  const liveHum = liveSensorData?.humidity ?? metricsAny.humidity ?? 60;
  const liveSoil = liveSensorData?.soilMoisture ?? metricsAny.moisture ?? 40;
  const livePH = liveSensorData?.ph ?? metricsAny.pH ?? 6.5;
  const liveTDS = liveSensorData?.tds ?? metricsAny.ec ?? 1.2;
  const liveBattery = liveSensorData?.battery ?? 80;
  const liveRSSI = liveSensorData?.rssi ?? -70;
  const liveSNR = liveSensorData?.snr ?? 8;
  const systemState = liveSensorData?.systemState ?? 'STANDBY';
  
  const tankLevelPercentage = liveSensorData?.waterTank ?? metricsAny.waterLevel ?? 75; 
  const circleData = [{ name: 'Tank', value: tankLevelPercentage, fill: '#3b82f6' }];

  const lastUpdate = liveSensorData?.timestamp ? new Date(liveSensorData.timestamp).toLocaleTimeString() : 'Waiting...';
  const pumpStatus = liveRelayData?.waterPump ? 'Running' : 'Stopped';
  const valveStatus = liveRelayData?.peristalticPump ? 'Open' : 'Closed';

  const kpis = [
    { title: 'Temperature', value: `${Number(liveTemp).toFixed(1)}°C`, icon: Thermometer, color: 'amber' },
    { title: 'Humidity', value: `${Number(liveHum).toFixed(1)}%`, icon: CloudRain, color: 'cyan' },
    { title: 'Soil Moisture', value: `${Number(liveSoil).toFixed(1)}%`, icon: Droplets, color: 'blue' },
    { title: 'pH Level', value: Number(livePH).toFixed(2), icon: Activity, color: 'emerald' },
    { title: 'TDS (EC)', value: Number(liveTDS).toFixed(2), icon: Activity, color: 'emerald' },
    { title: 'Battery', value: `${liveBattery}%`, icon: Zap, color: 'emerald' },
    { title: 'WiFi RSSI', value: `${liveRSSI} dBm`, icon: Activity, color: 'blue' },
    { title: 'LoRa SNR', value: `${liveSNR} dB`, icon: Activity, color: 'cyan' },
    { title: 'Pump Status', value: pumpStatus, icon: Zap, color: liveRelayData?.waterPump ? 'emerald' : 'slate' },
    { title: 'Valve Status', value: valveStatus, icon: Droplets, color: liveRelayData?.peristalticPump ? 'blue' : 'slate' },
    { title: 'System Mode', value: (activeFarm as any).automationEnabled ? 'Auto' : 'Manual', icon: Activity, color: 'blue' },
    { title: 'Irrigation State', value: systemState, icon: Leaf, color: 'emerald' },
  ];

  const getColorClasses = (color: string) => {
    const map: Record<string, { bg: string, text: string }> = {
      emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-500' },
      blue: { bg: 'bg-blue-500/20', text: 'text-blue-500' },
      cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-500' },
      amber: { bg: 'bg-amber-500/20', text: 'text-amber-500' },
      rose: { bg: 'bg-rose-500/20', text: 'text-rose-500' },
      slate: { bg: 'bg-slate-500/20', text: 'text-muted-foreground' },
    };
    return map[color] || map.slate;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{activeFarm.name}</h2>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary">
              {activeFarm.cropType}
            </span>
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" /> {activeFarm.location} • Last Update: {lastUpdate}
          </p>
        </div>
        
        <div className="flex gap-4">
          <GlassCard className="px-6 py-3 border-emerald-500/30 bg-emerald-500/10">
            <div className="flex flex-col items-end">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Node: {systemState}
              </div>
              <span className={`text-xs mt-1 font-semibold ${isConnected ? 'text-green-500 animate-pulse' : 'text-red-500'}`}>
                {isConnected ? '● Connected' : '● Offline'}
              </span>
            </div>
          </GlassCard>
          
          <GlassCard className="px-6 py-3 border-blue-500/30 bg-blue-500/10">
            <div className="flex flex-col items-end">
              <div className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2">
                <Router className="w-5 h-5" />
                Gateway Status
              </div>
              <span className={`text-xs mt-1 font-semibold text-green-500 animate-pulse`}>
                ● Online
              </span>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const colors = getColorClasses(kpi.color);
          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <GlassCard className={`p-4 flex flex-col items-center justify-center text-center h-full transition-all duration-300 ${colors.text.includes('slate') ? 'opacity-80' : 'hover:scale-105 border-' + kpi.color + '-500/30 bg-' + kpi.color + '-500/5'}`}>
                <div className={`p-2 rounded-xl mb-3 ${colors.bg}`}>
                  <kpi.icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <p className="text-xs text-muted-foreground font-medium mb-1">{kpi.title}</p>
                <h3 className="text-lg font-bold text-foreground">{kpi.value}</h3>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Gauges and Weather */}
        <div className="space-y-6">
          {/* Circular Water Tank Level */}
          <GlassCard className="p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="text-sm font-semibold text-foreground w-full text-left mb-4">Tank Level</h3>
            <div className="h-[180px] w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={15} data={circleData} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <Droplets className="w-6 h-6 text-blue-500 mb-1" />
                <span className="text-3xl font-bold text-foreground">{tankLevelPercentage}%</span>
              </div>
            </div>
          </GlassCard>

          {/* Weather Card */}
          <GlassCard className="p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Microclimate Weather</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Thermometer className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Temperature</p>
                  <p className="text-lg font-bold text-foreground">{weather?.temp || 28}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CloudRain className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Rain Chance</p>
                  <p className="text-lg font-bold text-foreground">{weather?.rainChance || 10}%</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Middle Column: Main Charts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Nutrient Dynamics */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Nutrient Dynamics (pH & EC)</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

          {/* AI Insights & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-tr from-primary to-accent rounded-lg">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-md font-semibold text-foreground">AI Actionable Insights</h3>
              </div>
              <div className="flex-1 space-y-3">
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <h4 className="text-orange-600 dark:text-orange-400 font-medium text-xs mb-1 uppercase tracking-wider">Disease Risk</h4>
                  <p className="text-sm text-foreground">{aiRecommendations?.diseaseRisk || 'Low Risk'}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <h4 className="text-emerald-600 dark:text-emerald-400 font-medium text-xs mb-1 uppercase tracking-wider">Water Saving Tip</h4>
                  <p className="text-sm text-foreground">{aiRecommendations?.waterSavingTips || 'Optimal conditions.'}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <h4 className="text-blue-600 dark:text-blue-400 font-medium text-xs mb-1 uppercase tracking-wider">Best Irrigation Time</h4>
                  <p className="text-sm text-foreground">{aiRecommendations?.bestTime || '05:30 AM'}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-muted rounded-lg">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-md font-semibold text-foreground">Crop Timeline</h3>
              </div>
              
              <div className="relative flex-1">
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-muted"></div>
                <div className="space-y-6 relative">
                  <div className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary border-4 border-white dark:border-slate-900 z-10 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Vegetative Stage</p>
                      <p className="text-xs text-primary font-medium">Current Phase</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start opacity-50">
                    <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700 border-4 border-white dark:border-slate-900 z-10 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Flowering</p>
                      <p className="text-xs text-muted-foreground">Est. 12 days away</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start opacity-50">
                    <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700 border-4 border-white dark:border-slate-900 z-10 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Harvest</p>
                      <p className="text-xs text-muted-foreground">Est. 42 days away</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
}
