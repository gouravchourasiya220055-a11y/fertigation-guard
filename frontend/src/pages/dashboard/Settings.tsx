import { Settings as SettingsIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[#EEF6EC] border border-[#DDE7D9] text-[#2E7D32] rounded-xl">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#1B4332]">Settings</h1>
      </div>

      <GlassCard className="p-8 border-[#DDE7D9] space-y-6">
        <h3 className="text-lg font-bold text-[#1B4332] border-b border-[#DDE7D9] pb-2">
          System Configuration
        </h3>
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#1B4332] mb-1">
              Timezone
            </label>
            <Input type="text" placeholder="UTC+00:00" defaultValue="UTC" className="bg-white border-[#DDE7D9] text-[#1B4332]" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1B4332] mb-1">
              Data Update Interval (seconds)
            </label>
            <Input type="number" placeholder="5" defaultValue="5" className="bg-white border-[#DDE7D9] text-[#1B4332]" />
          </div>
          <Button variant="primary" className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold cursor-pointer">Save Changes</Button>
        </div>
      </GlassCard>
    </div>
  );
}
