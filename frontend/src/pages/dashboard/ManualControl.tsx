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
  const pumpOn = liveRelayData?.waterPump ?? (activeFarm.metrics.pumpStatus === 'ON');
  const valveOpen = liveRelayData?.peristalticPump ?? (activeFarm.metrics.valveStatus === 'Open');
  const mixerOn = liveRelayData?.stirrer ?? (activeFarm.metrics.stirrerStatus === 'ON');
  const flushState = liveRelayData?.flushValve ?? (activeFarm.metrics.flushStatus === 'Open');

  const sendCommand = async (relay: string, state: boolean) => {
    if (!activeFarm.deviceId) {
      toast.error('No device linked to this farm');
      return;
    }
    
    setLoadingRelay(relay);
    try {
      await api.post('/relays/control', {
        relay,
        state
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
        api.post('/relays/control', { relay: 'waterPump', state: false }),
        api.post('/relays/control', { relay: 'peristalticPump', state: false }),
        api.post('/relays/control', { relay: 'stirrer', state: false }),
        api.post('/relays/control', { relay: 'flushValve', state: false }),
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
          <AlertTriangle className="w-4 h-4" />
          MANUAL MODE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main Pump Control */}
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-6">
          <div className="p-4 bg-muted rounded-full">
            <Power className={`w-12 h-12 ${pumpOn ? 'text-primary' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Main Irrigation Pump</h3>
            <p className="text-muted-foreground mt-1">Controls primary water flow</p>
          </div>
          <Button 
            size="lg" 
            variant={pumpOn ? 'primary' : 'outline'}
            className={`w-full ${pumpOn ? 'bg-primary hover:bg-primary/90 text-white' : ''}`}
            onClick={() => sendCommand('waterPump', !pumpOn)}
            disabled={loadingRelay === 'waterPump' || loadingRelay === 'emergency'}
          >
            {loadingRelay === 'waterPump' ? 'Processing...' : pumpOn ? 'Turn OFF' : 'Turn ON'}
          </Button>
        </GlassCard>

        {/* Zone Valve Control */}
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-6">
          <div className="p-4 bg-muted rounded-full">
            <Droplets className={`w-12 h-12 ${valveOpen ? 'text-blue-500' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Zone 1 Solenoid Valve</h3>
            <p className="text-muted-foreground mt-1">Flow: {valveOpen ? '250 L/h' : '0 L/h'}</p>
          </div>
          <Button 
            size="lg" 
            variant={valveOpen ? 'primary' : 'outline'}
            className={`w-full ${valveOpen ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500' : ''}`}
            onClick={() => sendCommand('peristalticPump', !valveOpen)}
            disabled={loadingRelay === 'peristalticPump' || loadingRelay === 'emergency'}
          >
            {loadingRelay === 'peristalticPump' ? 'Processing...' : valveOpen ? 'Close Valve' : 'Open Valve'}
          </Button>
        </GlassCard>

        {/* Fertilizer Mixer */}
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-6">
          <div className="p-4 bg-muted rounded-full">
            <Fan className={`w-12 h-12 ${mixerOn ? 'text-amber-500 animate-spin' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Fertilizer Mixer Motor</h3>
            <p className="text-muted-foreground mt-1">Agitation tank status</p>
          </div>
          <Button 
            size="lg" 
            variant={mixerOn ? 'primary' : 'outline'}
            className={`w-full ${mixerOn ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500' : ''}`}
            onClick={() => sendCommand('stirrer', !mixerOn)}
            disabled={loadingRelay === 'stirrer' || loadingRelay === 'emergency'}
          >
            {loadingRelay === 'stirrer' ? 'Processing...' : mixerOn ? 'Stop Mixing' : 'Start Mixing'}
          </Button>
        </GlassCard>

        {/* Flush Valve */}
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-6">
          <div className="p-4 bg-muted rounded-full">
            <Droplets className={`w-12 h-12 ${flushState ? 'text-indigo-500' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Flush Valve</h3>
            <p className="text-muted-foreground mt-1">System flushing status</p>
          </div>
          <Button 
            size="lg" 
            variant={flushState ? 'primary' : 'outline'}
            className={`w-full ${flushState ? 'bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-500' : ''}`}
            onClick={() => sendCommand('flushValve', !flushState)}
            disabled={loadingRelay === 'flushValve' || loadingRelay === 'emergency'}
          >
            {loadingRelay === 'flushValve' ? 'Processing...' : flushState ? 'Close Flush' : 'Open Flush'}
          </Button>
        </GlassCard>

        {/* Emergency Stop */}
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-6 lg:col-span-2 border-red-500/20 bg-red-500/5">
          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
            <Power className="w-12 h-12 text-red-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Emergency Stop</h3>
            <p className="text-muted-foreground mt-1">Immediately halt all pumps and close all valves</p>
          </div>
          <Button 
            size="lg" 
            variant="destructive"
            className="w-full text-lg py-6"
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
