import { useState } from 'react';
import { useFarm } from '@/context/FarmContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Sliders, Power, Droplets, Fan } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ManualControl() {
  const { activeFarm } = useFarm();
  
  // Local state for UI toggles since demo data is static
  const [pumpOn, setPumpOn] = useState(activeFarm.metrics.pumpStatus === 'ON');
  const [valveOpen, setValveOpen] = useState(activeFarm.metrics.valveStatus === 'Open');
  const [mixerOn, setMixerOn] = useState(false);
  const [flushValve, setFlushValve] = useState(false);
  const [emergencyStop, setEmergencyStop] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1B4332] flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#2E7D32]" />
            Manual Override Control
          </h1>
          <p className="text-[#5E6E64] text-sm font-semibold">Direct hardware control for {activeFarm.name}</p>
        </div>
        <div className="px-4 py-2 bg-[#FFF5F5] text-[#DC2626] rounded-xl text-sm font-bold flex items-center gap-2 border border-red-200/50">
          <AlertTriangle className="w-4 h-4" />
          MANUAL MODE ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main Pump Control */}
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-6">
          <div className="p-4 bg-[#EAF7EA] rounded-full">
            <Power className={`w-12 h-12 ${pumpOn ? 'text-[#2E7D32]' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1B4332]">Main Irrigation Pump</h3>
            <p className="text-[#5E6E64] mt-1 text-sm font-medium">Controls primary water flow</p>
          </div>
          <Button 
            size="lg" 
            variant={pumpOn ? 'primary' : 'outline'}
            className={`w-full ${pumpOn ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-transparent shadow-[0_1px_3px_rgba(0,0,0,0.15)]' : ''}`}
            onClick={() => setPumpOn(!pumpOn)}
          >
            {pumpOn ? 'Turn OFF (बंद करें)' : 'Turn ON (चालू करें)'}
          </Button>
        </GlassCard>

        {/* Zone Valve Control */}
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-6">
          <div className="p-4 bg-[#F0F7FF] rounded-full">
            <Droplets className={`w-12 h-12 ${valveOpen ? 'text-[#2563EB]' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1B4332]">Zone 1 Solenoid Valve</h3>
            <p className="text-[#5E6E64] mt-1 text-sm font-medium">Flow: {valveOpen ? '250 L/h' : '0 L/h'}</p>
          </div>
          <Button 
            size="lg" 
            variant={valveOpen ? 'primary' : 'outline'}
            className={`w-full ${valveOpen ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-transparent shadow-[0_1px_3px_rgba(0,0,0,0.15)]' : ''}`}
            onClick={() => setValveOpen(!valveOpen)}
          >
            {valveOpen ? 'Close Valve (बंद करें)' : 'Open Valve (खोलें)'}
          </Button>
        </GlassCard>

        {/* Fertilizer Mixer */}
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-6">
          <div className="p-4 bg-[#FFF9F2] rounded-full">
            <Fan className={`w-12 h-12 ${mixerOn ? 'text-[#F59E0B] animate-spin' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1B4332]">Fertilizer Mixer Motor</h3>
            <p className="text-[#5E6E64] mt-1 text-sm font-medium">Agitation tank status</p>
          </div>
          <Button 
            size="lg" 
            variant={mixerOn ? 'primary' : 'outline'}
            className={`w-full ${mixerOn ? 'bg-[#EA580C] hover:bg-[#C2410C] text-white border-transparent shadow-[0_1px_3px_rgba(0,0,0,0.15)]' : ''}`}
            onClick={() => setMixerOn(!mixerOn)}
          >
            {mixerOn ? 'Stop Mixer (बंद करें)' : 'Start Mixer (चालू करें)'}
          </Button>
        </GlassCard>

        {/* Flush Valve */}
        <GlassCard className={`p-6 flex flex-col items-center justify-center text-center space-y-6 ${emergencyStop ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="p-4 bg-[#F0F7FF] rounded-full">
            <Droplets className={`w-12 h-12 ${flushValve ? 'text-[#2563EB]' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1B4332]">Flush Valve</h3>
            <p className="text-[#5E6E64] mt-1 text-sm font-medium">System flushing status</p>
          </div>
          <Button 
            size="lg" 
            variant={flushValve ? 'primary' : 'outline'}
            className={`w-full ${flushValve ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-transparent shadow-[0_1px_3px_rgba(0,0,0,0.15)]' : ''}`}
            onClick={() => setFlushValve(!flushValve)}
          >
            {flushValve ? 'Close Flush (बंद करें)' : 'Open Flush (साफ करें)'}
          </Button>
        </GlassCard>

        {/* Emergency Stop */}
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-6 lg:col-span-2 border border-red-200 bg-[#FFF5F5] rounded-2xl shadow-sm">
          <div className="p-4 bg-[#FFF5F5] border border-red-200/50 rounded-full">
            <Power className={`w-12 h-12 ${emergencyStop ? 'text-[#DC2626] animate-pulse' : 'text-red-400'}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#DC2626]">Emergency Stop</h3>
            <p className="text-[#5E6E64] mt-1 text-sm font-medium">Immediately halt all pumps and close all valves</p>
          </div>
          <Button 
            size="lg" 
            variant="destructive"
            className={`w-full text-lg py-6 border-transparent shadow-[0_4px_12px_rgba(220,38,38,0.2)] ${emergencyStop ? 'animate-pulse bg-[#DC2626]' : 'bg-[#DC2626] hover:bg-[#B91C1C]'}`}
            onClick={() => {
              setEmergencyStop(!emergencyStop);
              if (!emergencyStop) {
                setPumpOn(false);
                setValveOpen(false);
                setMixerOn(false);
                setFlushValve(false);
              }
            }}
          >
            {emergencyStop ? '❌ SYSTEM HALTED (रोक दिया गया है - रीसेट करें)' : '⚠️ ACTIVATE EMERGENCY STOP (आपातकालीन रोक)'}
          </Button>
        </div>
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
