import { Bell } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function Alerts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[#FFF5F5] border border-red-200/50 text-[#DC2626] rounded-xl">
          <Bell className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#1B4332]">Alerts</h1>
      </div>

      <GlassCard className="p-8 text-center border-[#DDE7D9]">
        <div className="mx-auto w-16 h-16 bg-[#EEF6EC] rounded-full flex items-center justify-center mb-4 border border-[#DDE7D9]">
          <Bell className="w-8 h-8 text-[#5E6E64]" />
        </div>
        <h3 className="text-lg font-bold text-[#1B4332] mb-2">No Active Alerts</h3>
        <p className="text-[#5E6E64] text-sm font-semibold">
          Your system is operating normally. Any issues or warnings will appear here.
        </p>
      </GlassCard>
    </div>
  );
}
