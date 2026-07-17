import { Settings as SettingsIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-slate-200 dark:bg-slate-800 text-foreground rounded-xl">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      </div>

      <GlassCard className="p-8 border-white/20 space-y-6">
        <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
          System Configuration
        </h3>
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Timezone
            </label>
            <Input type="text" placeholder="UTC+00:00" defaultValue="UTC" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Data Update Interval (seconds)
            </label>
            <Input type="number" placeholder="5" defaultValue="5" />
          </div>
          <Button variant="primary">Save Changes</Button>
        </div>
      </GlassCard>
    </div>
  );
}
