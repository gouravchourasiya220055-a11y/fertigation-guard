import { motion } from 'framer-motion';
import { useFarm } from '@/context/FarmContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Droplets, FlaskConical, Activity, Database, Leaf, Thermometer, Waves, BarChart3 } from 'lucide-react';

export default function WaterQuality() {
  const { activeFarm } = useFarm();
  const { metrics } = activeFarm;

  const getPhColor = (ph: number) => {
    if (ph >= 6.0 && ph <= 7.0) return 'text-[#2E7D32] bg-[#EAF7EA] border border-emerald-200/50';
    if (ph < 6.0) return 'text-[#F59E0B] bg-[#FFF9F2] border border-amber-200/50';
    return 'text-[#DC2626] bg-[#FFF5F5] border border-red-200/50';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1B4332]">Water & Soil Quality</h1>
          <p className="text-[#5E6E64] text-sm font-semibold">Nutrient and irrigation metrics for {activeFarm.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white border border-[#DDE7D9] border-t-4 border-t-[#2E7D32] rounded-2xl shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-2xl ${getPhColor(metrics.pH)}`}>
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[#5E6E64] font-bold">Soil pH Level</p>
              <h3 className="text-2xl font-black text-[#1B4332]">{metrics.pH}</h3>
            </div>
          </div>
          <div className="w-full bg-[#EEF6EC] h-2 rounded-full overflow-hidden flex">
            <div className="bg-[#DC2626] h-full" style={{ width: '40%' }} />
            <div className="bg-[#2E7D32] h-full" style={{ width: '30%' }} />
            <div className="bg-[#2563EB] h-full" style={{ width: '30%' }} />
          </div>
          <div className="flex justify-between text-xs text-[#5E6E64] mt-2 font-bold">
            <span>Acidic</span>
            <span>Optimal</span>
            <span>Alkaline</span>
          </div>
        </div>

        <div className="p-6 bg-[#EAF7EA] border border-[#DDE7D9] rounded-2xl shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#FFF9F2] text-[#F59E0B] rounded-2xl border border-amber-200/50">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[#5E6E64] font-bold">Electrical Conductivity (EC)</p>
              <h3 className="text-2xl font-black text-[#1B4332]">{metrics.ec} mS/cm</h3>
            </div>
          </div>
          <div className="w-full bg-white/60 h-2 rounded-full">
            <div className="bg-[#F59E0B] h-full rounded-full" style={{ width: `${(metrics.ec / 4) * 100}%` }} />
          </div>
        </div>

        <div className="p-6 bg-[#FFF9F2] border border-[#DDE7D9] rounded-2xl shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#F0F7FF] text-[#2563EB] rounded-2xl border border-blue-200/50">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[#5E6E64] font-bold">Today's Water Usage</p>
              <h3 className="text-2xl font-black text-[#1B4332]">{metrics.waterUsageToday} L</h3>
            </div>
          </div>
          <p className="text-sm text-[#2E7D32] font-bold flex items-center gap-1">
            <Activity className="w-4 h-4" />
            Normal usage for this crop
          </p>
        </div>

        <div className="p-6 bg-white border border-[#DDE7D9] border-t-4 border-t-[#2E7D32] rounded-2xl shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#EAF7EA] text-[#2E7D32] rounded-2xl border border-emerald-200/50">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[#5E6E64] font-bold">TDS Level</p>
              <h3 className="text-2xl font-black text-[#1B4332]">450 ppm</h3>
            </div>
          </div>
          <p className="text-sm text-[#2E7D32] font-bold">Optimal range for this crop</p>
        </div>

        <div className="p-6 bg-[#EAF7EA] border border-[#DDE7D9] rounded-2xl shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#F0F7FF] text-[#2563EB] rounded-2xl border border-blue-200/50">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[#5E6E64] font-bold">Turbidity</p>
              <h3 className="text-2xl font-black text-[#1B4332]">2.1 NTU</h3>
            </div>
          </div>
          <p className="text-sm text-[#2E7D32] font-bold">Clear water</p>
        </div>

        <div className="p-6 bg-[#FFF9F2] border border-[#DDE7D9] rounded-2xl shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#FFF5F5] text-[#DC2626] rounded-2xl border border-red-200/50">
              <Thermometer className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[#5E6E64] font-bold">Water Temperature</p>
              <h3 className="text-2xl font-black text-[#1B4332]">22°C</h3>
            </div>
          </div>
          <p className="text-sm text-[#2E7D32] font-bold">Perfect for roots</p>
        </div>

        <div className="p-6 bg-white border border-[#DDE7D9] border-t-4 border-t-[#2E7D32] rounded-2xl shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#EAF7EA] text-[#2E7D32] rounded-2xl border border-emerald-200/50">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[#5E6E64] font-bold">Fertilizer Dosed</p>
              <h3 className="text-2xl font-black text-[#1B4332]">{metrics.fertilizerUsageToday} L</h3>
            </div>
          </div>
          <p className="text-sm text-[#2E7D32] font-bold flex items-center gap-1">
            <Activity className="w-4 h-4" />
            NPK Ratio Optimal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6 border-[#DDE7D9]">
          <h3 className="text-lg font-bold text-[#1B4332] mb-6 flex items-center gap-2">
            <Database className="w-5 h-5 text-[#2563EB]" />
            Main Water Tank Level
          </h3>
          <div className="flex items-end justify-center gap-8 h-64">
            <div className="w-32 h-full bg-[#EEF6EC] rounded-t-xl border-x border-t border-[#DDE7D9] relative overflow-hidden flex items-end">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: '75%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="w-full bg-[#2563EB]/80 backdrop-blur-sm relative"
              >
                {/* Water waves effect */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-white/20 animate-pulse rounded-t-full" />
              </motion.div>
            </div>
            <div className="pb-8">
              <p className="text-sm text-[#5E6E64] font-bold">Current Level</p>
              <p className="text-4xl font-black text-[#1B4332] mt-1">75%</p>
              <p className="text-sm text-[#5E6E64] font-semibold mt-2">7,500 L / 10,000 L</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6 border-[#DDE7D9]">
          <h3 className="text-lg font-bold text-[#1B4332] mb-6 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-[#2E7D32]" />
            Fertilizer Tanks
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-[#1B4332]">Tank A (Nitrogen)</span>
                <span className="text-sm font-black text-[#2E7D32]">45%</span>
              </div>
              <div className="w-full bg-[#EEF6EC] h-4 rounded-full overflow-hidden">
                <div className="bg-[#2E7D32] h-full" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-[#1B4332]">Tank B (Phosphorus)</span>
                <span className="text-sm font-black text-[#2E7D32]">80%</span>
              </div>
              <div className="w-full bg-[#EEF6EC] h-4 rounded-full overflow-hidden">
                <div className="bg-[#2E7D32] h-full" style={{ width: '80%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-[#1B4332]">Tank C (Potassium)</span>
                <span className="text-sm font-black text-[#DC2626]">20%</span>
              </div>
              <div className="w-full bg-[#EEF6EC] h-4 rounded-full overflow-hidden">
                <div className="bg-[#DC2626] h-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Charts Section Placeholder */}
      <GlassCard className="p-6 border-[#DDE7D9]">
        <h3 className="text-lg font-bold text-[#1B4332] mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#2E7D32]" />
          Water Quality Trends
        </h3>
        <div className="h-64 w-full flex items-center justify-center bg-[#EEF6EC]/30 rounded-xl border border-[#DDE7D9]">
          <p className="text-[#5E6E64] font-bold">Interactive charts will be rendered here.</p>
        </div>
      </GlassCard>
    </div>
  );
}
