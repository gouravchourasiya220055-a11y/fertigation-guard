import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Sprout, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const cropDatabase = [
  { id: 'tomato', name: 'Tomato', ph: '5.5 - 6.5', ec: '2.0 - 5.0', stage: 'Fruiting', img: '🍅' },
  { id: 'chilli', name: 'Chilli', ph: '5.5 - 6.8', ec: '1.8 - 2.2', stage: 'Vegetative', img: '🌶️' },
  { id: 'onion', name: 'Onion', ph: '6.0 - 7.0', ec: '1.4 - 1.8', stage: 'Bulbing', img: '🧅' },
  { id: 'garlic', name: 'Garlic', ph: '6.0 - 6.5', ec: '1.4 - 1.8', stage: 'Vegetative', img: '🧄' },
  { id: 'potato', name: 'Potato', ph: '5.0 - 6.0', ec: '2.0 - 2.5', stage: 'Tuber Initiation', img: '🥔' },
  { id: 'cotton', name: 'Cotton', ph: '5.8 - 8.0', ec: '1.5 - 2.5', stage: 'Flowering', img: '🌿' },
  { id: 'wheat', name: 'Wheat', ph: '6.0 - 7.0', ec: '1.5 - 2.0', stage: 'Tillering', img: '🌾' },
  { id: 'rice', name: 'Rice', ph: '5.5 - 6.5', ec: '1.5 - 2.0', stage: 'Vegetative', img: '🍚' },
  { id: 'soybean', name: 'Soybean', ph: '6.0 - 7.0', ec: '1.2 - 1.5', stage: 'Pod Development', img: '🌱' },
  { id: 'sugarcane', name: 'Sugarcane', ph: '6.0 - 6.5', ec: '1.5 - 2.0', stage: 'Grand Growth', img: '🎋' }
];

export default function PlantDatabase() {
  const [selectedCrop, setSelectedCrop] = useState(cropDatabase[0].id);

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Plant Database</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Select your crop to automatically update target pH and EC settings for the AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Crop Details */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6 border-emerald-500/30 sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-xl">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Active Crop Profile</h3>
            </div>

            {cropDatabase.filter(c => c.id === selectedCrop).map(crop => (
              <motion.div 
                key={crop.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center justify-center py-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <span className="text-6xl mb-4">{crop.img}</span>
                  <h4 className="text-2xl font-bold">{crop.name}</h4>
                  <span className="px-3 py-1 mt-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-medium">
                    {crop.stage} Stage
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 font-medium">Target pH</span>
                    <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">{crop.ph}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 font-medium">Target EC</span>
                    <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{crop.ec} mS/cm</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-3">
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-600/80 dark:text-blue-400/90">
                    The automation system is currently using these target values to regulate the acid/base and fertilizer dosing pumps.
                  </p>
                </div>
              </motion.div>
            ))}
          </GlassCard>
        </div>

        {/* Crop Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {cropDatabase.map((crop) => (
              <GlassCard 
                key={crop.id}
                onClick={() => setSelectedCrop(crop.id)}
                className={cn(
                  "p-4 cursor-pointer transition-all hover:scale-105 active:scale-95 group",
                  selectedCrop === crop.id 
                    ? "border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/20" 
                    : "hover:border-slate-400 dark:hover:border-slate-600"
                )}
              >
                <div className="flex flex-col items-center text-center gap-2 relative">
                  {selectedCrop === crop.id && (
                    <div className="absolute top-0 right-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                  )}
                  <span className="text-4xl transition-transform group-hover:-translate-y-1">{crop.img}</span>
                  <h4 className="font-semibold text-slate-900 dark:text-white mt-2">{crop.name}</h4>
                  <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>pH: {crop.ph}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
