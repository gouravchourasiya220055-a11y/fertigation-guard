import { useFarm } from '@/context/FarmContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Router, Wifi, Battery, Radio, Power } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DeviceManagement() {
  const { activeFarm } = useFarm();
  
  const devices = [
    { name: 'Main ESP32 Controller', type: 'Gateway', status: activeFarm.metrics.internetStatus, battery: 100, signal: 'Excellent', icon: Router, firmware: 'v2.4.1' },
    { name: 'LoRa Node 1 (Soil)', type: 'Sensor Node', status: 'Online', battery: activeFarm.metrics.batteryLevel, signal: 'Good', icon: Radio, firmware: 'v1.1.0' },
    { name: 'LoRa Node 2 (Weather)', type: 'Sensor Node', status: 'Online', battery: 85, signal: 'Fair', icon: Radio, firmware: 'v1.1.0' },
    { name: 'Solenoid Valve Controller', type: 'Actuator', status: 'Online', battery: 92, signal: 'Excellent', icon: Power, firmware: 'v1.0.5' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1B4332] flex items-center gap-2">
            <Router className="w-6 h-6 text-[#2E7D32]" />
            Device Management
          </h1>
          <p className="text-[#5E6E64] text-sm font-semibold">Hardware fleet status for {activeFarm.name}</p>
        </div>
        <Button className="gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold cursor-pointer">
          <Wifi className="w-4 h-4" />
          Scan for Devices
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {devices.map((device, idx) => (
          <GlassCard key={idx} className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-[#DDE7D9]">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl border ${device.status === 'Online' ? 'bg-[#EAF7EA] text-[#2E7D32] border-emerald-200/50' : 'bg-[#FFF5F5] text-[#DC2626] border-red-200/50'}`}>
                <device.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#1B4332] text-lg">{device.name}</h3>
                <p className="text-sm text-[#5E6E64] font-medium">{device.type}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 w-full md:w-auto mt-4 md:mt-0 bg-[#EEF6EC] p-4 md:p-0 md:bg-transparent rounded-xl">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${device.status === 'Online' ? 'bg-[#2E7D32]' : 'bg-[#DC2626]'}`} />
                <span className="text-sm font-bold text-[#1B4332]">{device.status}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Battery className={`w-4 h-4 ${device.battery > 20 ? 'text-[#2E7D32]' : 'text-[#DC2626]'}`} />
                <span className="text-sm font-bold text-[#1B4332]">{device.battery}%</span>
              </div>

              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-bold text-[#1B4332]">{device.signal}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-white rounded text-[#5E6E64] font-bold font-mono border border-[#DDE7D9]">FW: {device.firmware}</span>
              </div>

              <div className="flex items-center gap-2 ml-auto md:ml-0">
                <Button variant="outline" size="sm" className="font-bold cursor-pointer" onClick={() => alert('Device restart command sent.')}>
                  Restart
                </Button>
                <Button variant="primary" size="sm" className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold cursor-pointer" onClick={() => alert('Firmware is up to date.')}>
                  Update
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
