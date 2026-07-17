import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Search, Filter, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const plantData = [
  { crop: 'Tomato', ph: '6.0 - 6.5', ec: '2.0 - 5.0', water: 'High', temp: '21 - 27°C', humidity: '60 - 80%', duration: '90-120 days' },
  { crop: 'Wheat', ph: '6.0 - 7.0', ec: '1.5 - 2.0', water: 'Medium', temp: '15 - 25°C', humidity: '50 - 70%', duration: '110-130 days' },
  { crop: 'Rice', ph: '5.5 - 6.5', ec: '1.0 - 1.5', water: 'Very High', temp: '25 - 35°C', humidity: '70 - 90%', duration: '120-150 days' },
  { crop: 'Cotton', ph: '5.8 - 8.0', ec: '2.0 - 3.0', water: 'Medium', temp: '25 - 35°C', humidity: '50 - 60%', duration: '150-180 days' },
  { crop: 'Sugarcane', ph: '6.0 - 7.5', ec: '1.5 - 2.5', water: 'High', temp: '20 - 35°C', humidity: '60 - 85%', duration: '12-18 months' },
  { crop: 'Chilli', ph: '6.0 - 6.8', ec: '1.8 - 2.2', water: 'Medium', temp: '20 - 30°C', humidity: '50 - 70%', duration: '120-150 days' },
  { crop: 'Onion', ph: '6.0 - 7.0', ec: '1.4 - 1.8', water: 'Medium', temp: '15 - 25°C', humidity: '60 - 70%', duration: '100-120 days' },
  { crop: 'Garlic', ph: '6.0 - 7.5', ec: '1.5 - 2.0', water: 'Medium', temp: '12 - 24°C', humidity: '60 - 70%', duration: '120-150 days' },
  { crop: 'Potato', ph: '5.0 - 6.0', ec: '1.5 - 2.5', water: 'High', temp: '15 - 20°C', humidity: '60 - 80%', duration: '90-120 days' },
];

export default function PlantDatabase() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = plantData.filter(plant => 
    plant.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            Plant Database
          </h2>
          <p className="text-muted-foreground mt-1">Optimal growth parameters for various crops.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>
          <button className="p-2 bg-card border border-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Filter className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <GlassCard className="flex-1 overflow-hidden flex flex-col border-white/20">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                <th className="p-4 font-semibold text-foreground border-b border-border">Crop</th>
                <th className="p-4 font-semibold text-foreground border-b border-border">Ideal pH</th>
                <th className="p-4 font-semibold text-foreground border-b border-border">Ideal EC (mS/cm)</th>
                <th className="p-4 font-semibold text-foreground border-b border-border">Water Need</th>
                <th className="p-4 font-semibold text-foreground border-b border-border">Temperature</th>
                <th className="p-4 font-semibold text-foreground border-b border-border">Humidity</th>
                <th className="p-4 font-semibold text-foreground border-b border-border">Growth Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredData.map((plant, index) => (
                <motion.tr 
                  key={plant.crop}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted transition-colors group"
                >
                  <td className="p-4 font-medium text-foreground flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {plant.crop}
                  </td>
                  <td className="p-4 text-muted-foreground">{plant.ph}</td>
                  <td className="p-4 text-muted-foreground">{plant.ec}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${plant.water === 'High' || plant.water === 'Very High' ? 'bg-blue-500/10 text-blue-500' : 
                        plant.water === 'Medium' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }
                    `}>
                      {plant.water}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{plant.temp}</td>
                  <td className="p-4 text-muted-foreground">{plant.humidity}</td>
                  <td className="p-4 text-muted-foreground">{plant.duration}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No crops found matching your search.
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
