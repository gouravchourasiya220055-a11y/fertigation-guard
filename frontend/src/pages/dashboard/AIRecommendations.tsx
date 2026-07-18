import { motion } from 'framer-motion';
import { useFarm } from '@/context/FarmContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Sparkles, Clock, AlertTriangle, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AIRecommendations() {
  const { activeFarm } = useFarm();
  const { aiRecommendations } = activeFarm;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1B4332] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#2E7D32]" />
            AI Recommendations
          </h1>
          <p className="text-[#5E6E64] text-sm font-bold">Machine learning insights for {activeFarm.name}</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Re-Analyze
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Health Score */}
        <div className="lg:col-span-1">
          <GlassCard className="p-8 h-full flex flex-col items-center justify-center text-center">
            <div className="relative">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-[#EEF6EC]" />
                <motion.circle 
                  cx="80" 
                  cy="80" 
                  r="70" 
                  stroke="currentColor" 
                  strokeWidth="10" 
                  fill="transparent" 
                  strokeDasharray="440"
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset: 440 - (440 * aiRecommendations.healthScore) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`${aiRecommendations.healthScore > 80 ? 'text-[#2E7D32]' : aiRecommendations.healthScore > 60 ? 'text-[#F59E0B]' : 'text-[#DC2626]'}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-[#1B4332]">{aiRecommendations.healthScore}</span>
                <span className="text-xs text-[#5E6E64] font-bold">/100</span>
              </div>
            </div>
            <h3 className="text-xl font-black text-[#1B4332] mt-6">AI Health Score</h3>
            <p className="text-[#5E6E64] mt-2 text-sm font-semibold">
              Calculated using historical data, current sensors, and weather forecasts.
            </p>
          </GlassCard>
        </div>

        {/* Actionable Insights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border-l-4 border-l-[#2E7D32] border-y border-r border-[#DDE7D9] bg-[#EAF7EA] hover:shadow-md transition-all duration-300">
            <div className="flex gap-4">
              <div className="p-3 bg-[#2E7D32]/10 rounded-xl h-fit">
                <Clock className="w-6 h-6 text-[#2E7D32]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#1B4332] mb-1">Best Irrigation Time</h3>
                <p className="text-sm text-[#1B5E20] font-bold">{aiRecommendations.bestTime}</p>
                <p className="text-sm text-[#5E6E64] mt-2 leading-relaxed">
                  Based on soil moisture depletion rate and tomorrow's heat index, scheduling irrigation at this time will save approximately 15% water due to reduced evaporation.
                </p>
                <Button variant="secondary" size="sm" className="mt-4">Apply Schedule</Button>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border-l-4 border-l-[#DC2626] border-y border-r border-[#DDE7D9] bg-[#FFF5F5] hover:shadow-md transition-all duration-300">
            <div className="flex gap-4">
              <div className="p-3 bg-[#DC2626]/10 rounded-xl h-fit">
                <AlertTriangle className="w-6 h-6 text-[#DC2626]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#1B4332] mb-1">Disease Prediction</h3>
                <p className="text-sm text-[#DC2626] font-bold">{aiRecommendations.diseaseRisk}</p>
                <p className="text-sm text-[#5E6E64] mt-2 leading-relaxed">
                  The AI model analyzes temperature and humidity patterns to predict fungal or bacterial outbreaks. Current conditions show {aiRecommendations.diseaseRisk.toLowerCase()} risk.
                </p>
                <Button variant="secondary" size="sm" className="mt-4">View Risk Map</Button>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border-l-4 border-l-[#2563EB] border-y border-r border-[#DDE7D9] bg-[#F0F7FF] hover:shadow-md transition-all duration-300">
            <div className="flex gap-4">
              <div className="p-3 bg-[#2563EB]/10 rounded-xl h-fit">
                <Droplets className="w-6 h-6 text-[#2563EB]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#1B4332] mb-1">Water Saving Tips</h3>
                <p className="text-sm text-[#2563EB] font-bold">{aiRecommendations.waterSavingTips}</p>
                <p className="text-sm text-[#5E6E64] mt-2 leading-relaxed">
                  Our neural network compares your farm's performance against optimal growth models for {activeFarm.cropType}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
