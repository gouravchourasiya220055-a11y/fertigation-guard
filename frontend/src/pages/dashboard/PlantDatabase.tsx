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
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1B4332] flex items-center gap-2">
            <Leaf className="w-8 h-8 text-[#2E7D32]" />
            Plant Database
          </h2>
          <p className="text-[#5E6E64] mt-1 text-sm font-bold">Optimal growth parameters for various crops.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5E6E64]" />
            <input 
              type="text" 
              placeholder="Search crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#DDE7D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/25 focus:border-[#2E7D32] text-[#1B4332] font-semibold"
            />
          </div>
          <button className="p-2 bg-white border border-[#DDE7D9] rounded-xl hover:bg-[#EAF7EA]/30 transition-colors cursor-pointer">
            <Filter className="w-5 h-5 text-[#2E7D32]" />
          </button>
        </div>
      </div>

      <GlassCard className="flex-1 overflow-hidden flex flex-col border-[#DDE7D9]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EEF6EC]/85 backdrop-blur-md sticky top-0 z-10">
                <th className="p-4 font-bold text-[#1B4332] border-b border-[#DDE7D9]">Crop</th>
                <th className="p-4 font-bold text-[#1B4332] border-b border-[#DDE7D9]">Ideal pH</th>
                <th className="p-4 font-bold text-[#1B4332] border-b border-[#DDE7D9]">Ideal EC (mS/cm)</th>
                <th className="p-4 font-bold text-[#1B4332] border-b border-[#DDE7D9]">Water Need</th>
                <th className="p-4 font-bold text-[#1B4332] border-b border-[#DDE7D9]">Temperature</th>
                <th className="p-4 font-bold text-[#1B4332] border-b border-[#DDE7D9]">Humidity</th>
                <th className="p-4 font-bold text-[#1B4332] border-b border-[#DDE7D9]">Growth Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE7D9]">
              {filteredData.map((plant, index) => (
                <motion.tr 
                  key={plant.crop}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-[#EAF7EA]/35 transition-colors group"
                >
                  <td className="p-4 font-bold text-[#1B4332] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#2E7D32] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {plant.crop}
                  </td>
                  <td className="p-4 text-[#5E6E64] font-semibold">{plant.ph}</td>
                  <td className="p-4 text-[#5E6E64] font-semibold">{plant.ec}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border
                      ${plant.water === 'High' || plant.water === 'Very High' ? 'bg-[#F0F7FF] text-[#2563EB] border-blue-200/50' : 
                        plant.water === 'Medium' ? 'bg-[#EAF7EA] text-[#2E7D32] border-emerald-200/50' : 'bg-[#FFF9F2] text-[#F59E0B] border-amber-200/50'
                      }
                    `}>
                      {plant.water}
                    </span>
                  </td>
                  <td className="p-4 text-[#5E6E64] font-semibold">{plant.temp}</td>
                  <td className="p-4 text-[#5E6E64] font-semibold">{plant.humidity}</td>
                  <td className="p-4 text-[#5E6E64] font-semibold">{plant.duration}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="p-8 text-center text-[#5E6E64] font-bold">
              No crops found matching your search.
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
