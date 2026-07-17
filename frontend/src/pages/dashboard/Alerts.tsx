import { Bell, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { socket } from '@/lib/socket';
import { useFarm } from '@/context/FarmContext';

export default function Alerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const { activeFarmId } = useFarm();

  useEffect(() => {
    if (activeFarmId) {
      fetchAlerts();
    }
  }, [activeFarmId]);

  const fetchAlerts = async () => {
    try {
      const res = await api.get(`/alert/${activeFarmId}`);
      setAlerts(res.data.data);
    } catch (error) {
      console.error('Error fetching alerts', error);
    }
  };

  useEffect(() => {
    socket.on('alertUpdate', (newAlert) => {
      if (newAlert.farm === activeFarmId) {
        setAlerts(prev => [newAlert, ...prev]);
      }
    });
    return () => {
      socket.off('alertUpdate');
    };
  }, [activeFarmId]);

  const markRead = async (id: string) => {
    try {
      await api.put(`/alert/${id}/read`);
      setAlerts(prev => prev.map(a => a._id === id ? { ...a, isRead: true } : a));
    } catch (error) {
      console.error('Error marking alert as read', error);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-500/10 dark:bg-red-500/20 text-red-500 rounded-xl">
          <Bell className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
      </div>

      {alerts.length === 0 ? (
        <GlassCard className="p-8 text-center border-white/20">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Active Alerts</h3>
          <p className="text-muted-foreground">
            Your system is operating normally. Any issues or warnings will appear here.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <GlassCard key={alert._id} className={`p-4 flex items-start gap-4 ${alert.isRead ? 'opacity-60' : ''}`}>
              <div className={`p-2 rounded-lg ${alert.severity === 'critical' ? 'bg-red-500/10 text-red-500' : alert.severity === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                {alert.severity === 'critical' ? <AlertTriangle className="w-5 h-5" /> : alert.severity === 'warning' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-foreground">{alert.type}</h4>
                  <span className="text-xs text-muted-foreground">{new Date(alert.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
              </div>
              {!alert.isRead && (
                <button onClick={() => markRead(alert._id)} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors" title="Mark as read">
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
