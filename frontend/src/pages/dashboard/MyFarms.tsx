import { motion } from 'framer-motion';
import { useFarm } from '@/context/FarmContext';
import { Button } from '@/components/ui/Button';
import { Edit2, Trash2, ExternalLink, Thermometer, Droplets, FlaskConical, Activity, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyFarms() {
  const { farms, deleteFarm, setActiveFarmId } = useFarm();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-[#EAF7EA] text-[#1B5E20] border-[#DDE7D9]';
      case 'Maintenance': return 'bg-[#FFF9F2] text-[#F59E0B] border-[#DDE7D9]';
      case 'Idle': return 'bg-slate-100 text-[#5E6E64] border-[#DDE7D9]';
      default: return 'bg-slate-100 text-[#5E6E64] border-[#DDE7D9]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1B4332]">My Farms</h1>
          <p className="text-[#5E6E64] text-sm font-semibold">Manage your agricultural properties</p>
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
            <div className="overflow-hidden flex flex-col h-full group hover:shadow-xl hover:shadow-[#2E7D32]/5 transition-all duration-300 border border-[#DDE7D9] rounded-2xl bg-white shadow-sm">
              {/* Image Header */}
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={farm.image} 
                  alt={farm.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{farm.name}</h3>
                    <div className="flex gap-2">
                      <span className="text-xs px-2.5 py-0.5 bg-white/10 backdrop-blur-md rounded-full text-white font-medium">
                        {farm.cropType}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 bg-white/10 backdrop-blur-md rounded-full text-white font-medium">
                        {farm.area} Acres
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-200 mt-2 font-medium">Last Irrigation: Today, 06:00 AM</p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${getStatusColor(farm.status)}`}>
                    {farm.status}
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="p-5 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#FFF5F5] border border-red-200/50 rounded-lg">
                      <Thermometer className="w-4 h-4 text-[#DC2626]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#5E6E64] font-bold">Temperature</p>
                      <p className="font-extrabold text-[#1B4332]">{farm.metrics.temperature}°C</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#F0F7FF] border border-blue-200/50 rounded-lg">
                      <Droplets className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#5E6E64] font-bold">Moisture</p>
                      <p className="font-extrabold text-[#1B4332]">{farm.metrics.moisture}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#EAF7EA] border border-emerald-200/50 rounded-lg">
                      <FlaskConical className="w-4 h-4 text-[#2E7D32]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#5E6E64] font-bold">Soil pH</p>
                      <p className="font-extrabold text-[#1B4332]">{farm.metrics.pH}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#FFF9F2] border border-amber-200/50 rounded-lg">
                      <Activity className="w-4 h-4 text-[#F59E0B]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#5E6E64] font-bold">Soil EC</p>
                      <p className="font-extrabold text-[#1B4332]">{farm.metrics.ec}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-[#DDE7D9] flex gap-2">
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
                  <Edit2 className="w-4 h-4 text-[#2E7D32]" />
                </Button>
                <Button variant="outline" size="icon" className="text-red-500 hover:bg-red-500/10 border-red-200/60" onClick={() => {
                  if (confirm(`Are you sure you want to delete ${farm.name}?`)) {
                    deleteFarm(farm.id);
                  }
                }}>
                  <Trash2 className="w-4 h-4 text-[#DC2626]" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
