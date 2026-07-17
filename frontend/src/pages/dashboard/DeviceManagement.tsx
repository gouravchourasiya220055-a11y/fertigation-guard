import { useState, useEffect } from 'react';
import { useFarm } from '@/context/FarmContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Router, Wifi, Power } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { socket } from '@/lib/socket';
import toast from 'react-hot-toast';

export default function DeviceManagement() {
  const { activeFarm } = useFarm();
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeFarm) return;

    const fetchDevices = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/device/latest?farmId=${activeFarm.id}`);
        setDevices(res.data.devices || []);
      } catch (error) {
        toast.error('Failed to fetch devices');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();

    const handleDeviceStatus = (data: any) => {
      if (data.deviceId) {
        setDevices(prev => prev.map(d => 
          d.deviceId === data.deviceId 
            ? { ...d, status: data.status, lastSeen: data.lastSeen } 
            : d
        ));
      }
    };

    socket.on('device_status', handleDeviceStatus);

    return () => {
      socket.off('device_status', handleDeviceStatus);
    };
  }, [activeFarm]);

  if (!activeFarm) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Router className="w-6 h-6 text-primary" />
            Device Management
          </h1>
          <p className="text-muted-foreground">Hardware fleet status for {activeFarm.name}</p>
        </div>
        <Button className="gap-2" onClick={() => toast('Scanning for devices...')}>
          <Wifi className="w-4 h-4" />
          Scan for Devices
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center text-muted-foreground py-8">Loading devices...</div>
        ) : devices.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No devices found.</div>
        ) : (
          devices.map((device, idx) => (
            <GlassCard key={idx} className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${device.status === 'online' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {device.type === 'Gateway' ? <Router className="w-6 h-6" /> : <Power className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{device.name || device.deviceId}</h3>
                  <p className="text-sm text-muted-foreground">{device.type}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 w-full md:w-auto mt-4 md:mt-0 bg-card p-4 md:p-0 md:bg-transparent rounded-xl">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-rose-500'}`} />
                  <span className="text-sm font-medium text-foreground capitalize">{device.status}</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-xs">Last seen: {new Date(device.lastSeen).toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2 ml-auto md:ml-0">
                  <Button variant="outline" size="sm" onClick={() => toast('Restart command sent')}>
                    Restart
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
