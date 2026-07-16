import { motion } from 'framer-motion';
import { useFarm } from '@/context/FarmContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Edit2, Trash2, ExternalLink, Thermometer, Droplets, FlaskConical, Activity, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyFarms() {
  const { farms, deleteFarm, setActiveFarmId } = useFarm();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Maintenance': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Idle': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Farms</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your agricultural properties</p>
        </div>
        <Button onClick={() => navigate('/dashboard/add-farm')} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Farm
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map((farm, index) => (
          <motion.div
            key={farm.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="overflow-hidden flex flex-col h-full group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
              {/* Image Header */}
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={farm.image} 
                  alt={farm.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{farm.name}</h3>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-white">
                        {farm.cropType}
                      </span>
                      <span className="text-xs px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-white">
                        {farm.area} Acres
                      </span>
                    </div>
                    <p className="text-xs text-white/80 mt-2 font-medium">Last Irrigation: Today, 06:00 AM</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border backdrop-blur-md ${getStatusColor(farm.status)}`}>
                    {farm.status}
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="p-5 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500/10 rounded-lg">
                      <Thermometer className="w-4 h-4 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Temperature</p>
                      <p className="font-semibold text-slate-800 dark:text-white">{farm.metrics.temperature}°C</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Droplets className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Moisture</p>
                      <p className="font-semibold text-slate-800 dark:text-white">{farm.metrics.moisture}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <FlaskConical className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Soil pH</p>
                      <p className="font-semibold text-slate-800 dark:text-white">{farm.metrics.pH}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <Activity className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Soil EC</p>
                      <p className="font-semibold text-slate-800 dark:text-white">{farm.metrics.ec}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-slate-100 dark:border-white/10 flex gap-2">
                <Button 
                  className="flex-1 gap-2" 
                  onClick={() => {
                    setActiveFarmId(farm.id);
                    navigate('/dashboard');
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Dashboard
                </Button>
                <Button variant="outline" size="icon" onClick={() => alert('Edit mode not implemented in demo.')}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="text-red-500 hover:bg-red-500/10" onClick={() => {
                  if (confirm(`Are you sure you want to delete ${farm.name}?`)) {
                    deleteFarm(farm.id);
                  }
                }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
