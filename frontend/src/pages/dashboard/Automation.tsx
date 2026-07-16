import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Settings2, Clock, Droplets, Thermometer, Plus, ShieldCheck } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export default function Automation() {
  const { activeFarm } = useFarm();
  const [rules, setRules] = useState([
    { id: 1, name: 'Morning Irrigation', condition: 'Time = 06:00', action: 'Pump ON for 30m', active: true },
    { id: 2, name: 'High Temp Protection', condition: 'Temp > 35°C', action: 'Sprinklers ON', active: true },
    { id: 3, name: 'Dry Soil Alert', condition: 'Moisture < 30%', action: 'Send Alert & Valve Open', active: false },
    { id: 4, name: 'Low pH Correction', condition: 'pH < 5.5', action: 'Dose Tank B', active: true },
  ]);

  const toggleRule = (id: number) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Settings2 className="w-8 h-8 text-primary" />
            Automation Rules
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Configure logic for {activeFarm.name} ({activeFarm.cropType})</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary/25">
          <Plus className="w-5 h-5" />
          Create Rule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Rules List */}
        <div className="lg:col-span-2 space-y-4">
          {rules.map((rule) => (
            <GlassCard key={rule.id} className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 ${rule.active ? 'border-primary/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'opacity-75'}`}>
              <div className="flex items-start sm:items-center gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${rule.active ? 'bg-primary/20 text-primary' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                  {rule.name.includes('Time') || rule.name.includes('Morning') ? <Clock className="w-6 h-6" /> : 
                   rule.name.includes('Temp') ? <Thermometer className="w-6 h-6" /> : 
                   <Droplets className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{rule.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300 font-mono">IF {rule.condition}</span>
                    <span className="text-slate-400">→</span>
                    <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md font-mono">THEN {rule.action}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center self-end sm:self-auto shrink-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={rule.active} onChange={() => toggleRule(rule.id)} />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Global Settings */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Safety Limits
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Max Water / Day</span>
                  <span className="font-medium text-slate-900 dark:text-white">10,000 L</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Min Soil Moisture</span>
                  <span className="font-medium text-slate-900 dark:text-white">25%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Max Pump Runtime</span>
                  <span className="font-medium text-slate-900 dark:text-white">120 mins</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full">
                  <div className="bg-rose-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Edit Limits
            </button>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
