import { Bell } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function Alerts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-500/10 dark:bg-red-500/20 text-red-500 rounded-xl">
          <Bell className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Alerts</h1>
      </div>

      <GlassCard className="p-8 text-center border-white/20">
        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Bell className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">No Active Alerts</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Your system is operating normally. Any issues or warnings will appear here.
        </p>
      </GlassCard>
    </div>
  );
}
