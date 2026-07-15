import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Power, Settings2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RelayControlProps {
  name: string;
  pin: string;
  initialState?: boolean;
}

const RelayControl = ({ name, pin, initialState = false }: RelayControlProps) => {
  const [isOn, setIsOn] = useState(initialState);
  
  return (
    <GlassCard className="p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={cn("p-3 rounded-full transition-colors", isOn ? "bg-emerald-500/20 text-emerald-500" : "bg-slate-500/20 text-slate-500")}>
          <Power className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white">{name}</h4>
          <p className="text-sm text-slate-500">Pin: {pin}</p>
        </div>
      </div>
      
      <button 
        onClick={() => setIsOn(!isOn)}
        className={cn(
          "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
          isOn ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
        )}
      >
        <span className={cn(
          "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          isOn ? "translate-x-6" : "translate-x-0"
        )} />
      </button>
    </GlassCard>
  );
};

export default function Automation() {
  const [isAutoMode, setIsAutoMode] = useState(true);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Automation Control</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage relays, pumps, and system modes.</p>
        </div>

        <GlassCard className="p-2 flex items-center gap-2 border-slate-200 dark:border-slate-800 self-start md:self-auto">
          <button 
            onClick={() => setIsAutoMode(true)}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-semibold transition-all",
              isAutoMode ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            Auto Mode
          </button>
          <button 
            onClick={() => setIsAutoMode(false)}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-semibold transition-all",
              !isAutoMode ? "bg-amber-500 text-white shadow-md shadow-amber-500/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            Manual Mode
          </button>
        </GlassCard>
      </div>

      {!isAutoMode && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3"
        >
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-600 dark:text-amber-400">Manual Override Active</h4>
            <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mt-1">
              AI recommendations and scheduled dosing are paused. You have full manual control over all relays. Please monitor sensors carefully to avoid plant damage.
            </p>
          </div>
        </motion.div>
      )}

      {isAutoMode && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-emerald-600 dark:text-emerald-400">AI Control Active</h4>
            <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mt-1">
              The system is automatically managing relays based on target pH and EC settings for the selected crop.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Overlay to disable manual controls if in Auto mode */}
        {isAutoMode && (
          <div className="absolute inset-0 z-10 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
             <div className="px-4 py-2 rounded-full bg-slate-900/80 text-white font-medium text-sm flex items-center gap-2">
               <Settings2 className="w-4 h-4" /> Controls Disabled (Auto Mode)
             </div>
          </div>
        )}

        <RelayControl name="Main Water Pump" pin="Relay 1" initialState={true} />
        <RelayControl name="Fertilizer A Dosing Pump" pin="Relay 2" initialState={false} />
        <RelayControl name="Fertilizer B Dosing Pump" pin="Relay 3" initialState={false} />
        <RelayControl name="pH Down (Acid) Pump" pin="Relay 4" initialState={false} />
        <RelayControl name="pH Up (Base) Pump" pin="Relay 5" initialState={false} />
        <RelayControl name="Pipeline Flush Valve" pin="Relay 6" initialState={false} />
      </div>

      <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
         <GlassCard className="p-6 border-red-500/30 bg-red-500/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-bold text-red-600 dark:text-red-400">Emergency Stop</h4>
                <p className="text-sm text-slate-500">Immediately disconnects power to all relays and pumps.</p>
              </div>
              <button className="px-8 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/30 transition-colors">
                STOP ALL OPERATIONS
              </button>
            </div>
         </GlassCard>
      </div>

    </div>
  );
}
