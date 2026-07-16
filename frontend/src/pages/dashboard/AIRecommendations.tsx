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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Recommendations
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Machine learning insights for {activeFarm.name}</p>
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
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-200 dark:text-slate-700" />
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
                  className={`${aiRecommendations.healthScore > 80 ? 'text-primary' : aiRecommendations.healthScore > 60 ? 'text-amber-500' : 'text-rose-500'}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-slate-800 dark:text-white">{aiRecommendations.healthScore}</span>
                <span className="text-xs text-slate-500 font-medium">/100</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-6">AI Health Score</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              Calculated using historical data, current sensors, and weather forecasts.
            </p>
          </GlassCard>
        </div>

        {/* Actionable Insights */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <div className="flex gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl h-fit">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Best Irrigation Time</h3>
                <p className="text-slate-600 dark:text-slate-300">{aiRecommendations.bestTime}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Based on soil moisture depletion rate and tomorrow's heat index, scheduling irrigation at this time will save approximately 15% water due to reduced evaporation.
                </p>
                <Button variant="outline" size="sm" className="mt-4">Apply Schedule</Button>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex gap-4">
              <div className="p-3 bg-rose-500/10 rounded-xl h-fit">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Disease Prediction</h3>
                <p className="text-slate-600 dark:text-slate-300">{aiRecommendations.diseaseRisk}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  The AI model analyzes temperature and humidity patterns to predict fungal or bacterial outbreaks. Current conditions show {aiRecommendations.diseaseRisk.toLowerCase()} risk.
                </p>
                <Button variant="outline" size="sm" className="mt-4">View Risk Map</Button>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl h-fit">
                <Droplets className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Water Saving Tips</h3>
                <p className="text-slate-600 dark:text-slate-300">{aiRecommendations.waterSavingTips}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Our neural network compares your farm's performance against optimal growth models for {activeFarm.cropType}.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
