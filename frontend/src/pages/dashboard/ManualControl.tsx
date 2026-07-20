import { useState } from 'react';
import { useFarm } from '@/context/FarmContext';
import { useSocket } from '@/context/SocketContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Sliders, Power, Droplets, Fan } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ManualControl() {
  const { activeFarm } = useFarm();
  const { liveRelayData } = useSocket();
  const [loadingRelay, setLoadingRelay] = useState<string | null>(null);

  if (!activeFarm) return null;
  
  // Bind to liveRelayData if available, fallback to metrics
  const r1On = liveRelayData?.waterPump ?? (activeFarm.metrics.pumpStatus === 'ON');
  const r2On = liveRelayData?.peristalticPump ?? (activeFarm.metrics.valveStatus === 'Open');
  const r3On = liveRelayData?.stirrer ?? (activeFarm.metrics.stirrerStatus === 'ON');
  const r4On = liveRelayData?.highPressurePump ?? false;
  const r5On = liveRelayData?.flushValve ?? (activeFarm.metrics.flushStatus === 'Open');
  const r6On = liveRelayData?.relay6 ?? false;

  const sendCommand = async (relay: string, state: boolean) => {
    if (!activeFarm.deviceId) {
      toast.error('No device linked to this farm');
      return;
    }
    
    setLoadingRelay(relay);
    try {
      await api.post('/relays/control', {
        relay,
        state,
        deviceId: activeFarm.deviceId
      });
      toast.success(`${relay} turned ${state ? 'ON' : 'OFF'}`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to trigger ${relay}`);
    } finally {
      setLoadingRelay(null);
    }
  };

  const handleEmergencyStop = async () => {
    if (!activeFarm.deviceId) {
      toast.error('No device linked to this farm');
      return;
    }
    
    const confirmStop = window.confirm('Are you sure you want to halt all systems?');
    if (!confirmStop) return;

    setLoadingRelay('emergency');
    try {
      await Promise.all([
        api.post('/relays/control', { relay: 'waterPump', state: false, deviceId: activeFarm.deviceId }),
        api.post('/relays/control', { relay: 'peristalticPump', state: false, deviceId: activeFarm.deviceId }),
        api.post('/relays/control', { relay: 'stirrer', state: false, deviceId: activeFarm.deviceId }),
        api.post('/relays/control', { relay: 'highPressurePump', state: false, deviceId: activeFarm.deviceId }),
        api.post('/relays/control', { relay: 'flushValve', state: false, deviceId: activeFarm.deviceId }),
        api.post('/relays/control', { relay: 'relay6', state: false, deviceId: activeFarm.deviceId }),
      ]);
      toast.success('System halted');
    } catch (error) {
      toast.error('Failed to halt system completely');
    } finally {
      setLoadingRelay(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sliders className="w-6 h-6 text-primary" />
            Manual Override Control
          </h1>
          <p className="text-muted-foreground">Direct hardware control for {activeFarm.name}</p>
        </div>
        <div className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-500/20">
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          MANUAL MODE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Relay 1: Water Pump */}
        <GlassCard className={`p-6 flex flex-col items-center justify-center text-center space-y-6 transition-all duration-300 ${r1On ? 'shadow-[0_0_20px_rgba(59,130,246,0.3)] border-blue-500/50 bg-blue-500/5' : ''}`}>
          <div className={`p-4 rounded-full transition-colors ${r1On ? 'bg-blue-500/20' : 'bg-muted'}`}>
            <Power className={`w-12 h-12 transition-colors ${r1On ? 'text-blue-500' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Water Pump</h3>
            <p className="text-muted-foreground mt-1">Relay 1 Status</p>
          </div>
          <Button size="lg" variant={r1On ? 'primary' : 'outline'} className={`w-full ${r1On ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500' : ''}`}
            onClick={() => sendCommand('waterPump', !r1On)} disabled={loadingRelay === 'waterPump' || loadingRelay === 'emergency'}>
            {loadingRelay === 'waterPump' ? 'Processing...' : r1On ? 'Turn OFF' : 'Turn ON'}
          </Button>
        </GlassCard>

        {/* Relay 2: Fertilizer Pump */}
        <GlassCard className={`p-6 flex flex-col items-center justify-center text-center space-y-6 transition-all duration-300 ${r2On ? 'shadow-[0_0_20px_rgba(245,158,11,0.3)] border-amber-500/50 bg-amber-500/5' : ''}`}>
          <div className={`p-4 rounded-full transition-colors ${r2On ? 'bg-amber-500/20' : 'bg-muted'}`}>
            <Droplets className={`w-12 h-12 transition-colors ${r2On ? 'text-amber-500' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Fertilizer Pump</h3>
            <p className="text-muted-foreground mt-1">Relay 2 Status</p>
          </div>
          <Button size="lg" variant={r2On ? 'primary' : 'outline'} className={`w-full ${r2On ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500' : ''}`}
            onClick={() => sendCommand('peristalticPump', !r2On)} disabled={loadingRelay === 'peristalticPump' || loadingRelay === 'emergency'}>
            {loadingRelay === 'peristalticPump' ? 'Processing...' : r2On ? 'Turn OFF' : 'Turn ON'}
          </Button>
        </GlassCard>

        {/* Relay 3: Stirrer */}
        <GlassCard className={`p-6 flex flex-col items-center justify-center text-center space-y-6 transition-all duration-300 ${r3On ? 'shadow-[0_0_20px_rgba(16,185,129,0.3)] border-emerald-500/50 bg-emerald-500/5' : ''}`}>
          <div className={`p-4 rounded-full transition-colors ${r3On ? 'bg-emerald-500/20' : 'bg-muted'}`}>
            <Fan className={`w-12 h-12 transition-colors ${r3On ? 'text-emerald-500 animate-spin' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Mixer / Stirrer</h3>
            <p className="text-muted-foreground mt-1">Relay 3 Status</p>
          </div>
          <Button size="lg" variant={r3On ? 'primary' : 'outline'} className={`w-full ${r3On ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500' : ''}`}
            onClick={() => sendCommand('stirrer', !r3On)} disabled={loadingRelay === 'stirrer' || loadingRelay === 'emergency'}>
            {loadingRelay === 'stirrer' ? 'Processing...' : r3On ? 'Turn OFF' : 'Turn ON'}
          </Button>
        </GlassCard>

        {/* Relay 4: Main Pump */}
        <GlassCard className={`p-6 flex flex-col items-center justify-center text-center space-y-6 transition-all duration-300 ${r4On ? 'shadow-[0_0_20px_rgba(139,92,246,0.3)] border-purple-500/50 bg-purple-500/5' : ''}`}>
          <div className={`p-4 rounded-full transition-colors ${r4On ? 'bg-purple-500/20' : 'bg-muted'}`}>
            <Power className={`w-12 h-12 transition-colors ${r4On ? 'text-purple-500' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Main Pump</h3>
            <p className="text-muted-foreground mt-1">Relay 4 Status</p>
          </div>
          <Button size="lg" variant={r4On ? 'primary' : 'outline'} className={`w-full ${r4On ? 'bg-purple-500 hover:bg-purple-600 text-white border-purple-500' : ''}`}
            onClick={() => sendCommand('highPressurePump', !r4On)} disabled={loadingRelay === 'highPressurePump' || loadingRelay === 'emergency'}>
            {loadingRelay === 'highPressurePump' ? 'Processing...' : r4On ? 'Turn OFF' : 'Turn ON'}
          </Button>
        </GlassCard>

        {/* Relay 5: Base Pump */}
        <GlassCard className={`p-6 flex flex-col items-center justify-center text-center space-y-6 transition-all duration-300 ${r5On ? 'shadow-[0_0_20px_rgba(236,72,153,0.3)] border-pink-500/50 bg-pink-500/5' : ''}`}>
          <div className={`p-4 rounded-full transition-colors ${r5On ? 'bg-pink-500/20' : 'bg-muted'}`}>
            <Droplets className={`w-12 h-12 transition-colors ${r5On ? 'text-pink-500' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Base Pump</h3>
            <p className="text-muted-foreground mt-1">Relay 5 Status</p>
          </div>
          <Button size="lg" variant={r5On ? 'primary' : 'outline'} className={`w-full ${r5On ? 'bg-pink-500 hover:bg-pink-600 text-white border-pink-500' : ''}`}
            onClick={() => sendCommand('flushValve', !r5On)} disabled={loadingRelay === 'flushValve' || loadingRelay === 'emergency'}>
            {loadingRelay === 'flushValve' ? 'Processing...' : r5On ? 'Turn OFF' : 'Turn ON'}
          </Button>
        </GlassCard>

        {/* Relay 6: Drain Valve */}
        <GlassCard className={`p-6 flex flex-col items-center justify-center text-center space-y-6 transition-all duration-300 ${r6On ? 'shadow-[0_0_20px_rgba(244,63,94,0.3)] border-rose-500/50 bg-rose-500/5' : ''}`}>
          <div className={`p-4 rounded-full transition-colors ${r6On ? 'bg-rose-500/20' : 'bg-muted'}`}>
            <Power className={`w-12 h-12 transition-colors ${r6On ? 'text-rose-500' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Drain Valve</h3>
            <p className="text-muted-foreground mt-1">Relay 6 Status</p>
          </div>
          <Button size="lg" variant={r6On ? 'primary' : 'outline'} className={`w-full ${r6On ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-500' : ''}`}
            onClick={() => sendCommand('relay6', !r6On)} disabled={loadingRelay === 'relay6' || loadingRelay === 'emergency'}>
            {loadingRelay === 'relay6' ? 'Processing...' : r6On ? 'Turn OFF' : 'Turn ON'}
          </Button>
        </GlassCard>

        {/* Emergency Stop */}
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-6 lg:col-span-3 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)] bg-red-500/10">
          <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-full">
            <Power className="w-12 h-12 text-red-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-500">Emergency Stop</h3>
            <p className="text-muted-foreground mt-1">Immediately halt all pumps and close all valves</p>
          </div>
          <Button 
            size="lg" 
            variant="destructive"
            className="w-full text-lg py-6 bg-red-600 hover:bg-red-700 font-bold"
            onClick={handleEmergencyStop}
            disabled={loadingRelay === 'emergency'}
          >
            {loadingRelay === 'emergency' ? 'HALTING SYSTEM...' : 'ACTIVATE EMERGENCY STOP'}
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}

function AlertTriangle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}
