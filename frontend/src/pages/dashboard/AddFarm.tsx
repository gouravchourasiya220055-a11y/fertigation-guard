import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Save, User, Settings2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useFarm } from '@/context/FarmContext';
import { useNavigate } from 'react-router-dom';
import { Farm } from '@/data/mockFarms';

export default function AddFarm() {
  const { addFarm } = useFarm();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    farmerName: '',
    village: '',
    district: '',
    state: '',
    country: '',
    cropType: '',
    area: '',
    waterSource: '',
    irrigationMethod: '',
    plantCount: '',
    expectedHarvest: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFarm: Farm = {
      id: `f-${Date.now()}`,
      name: formData.name || 'New Custom Farm',
      cropType: formData.cropType || 'Mixed',
      area: Number(formData.area) || 0,
      location: `${formData.village}, ${formData.district}`,
      status: 'Maintenance',
      image: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=600',
      metrics: {
        temperature: 25,
        moisture: 50,
        pH: 6.5,
        ec: 1.5,
        waterUsageToday: 0,
        fertilizerUsageToday: 0,
        pumpStatus: 'OFF',
        valveStatus: 'Closed',
        internetStatus: 'Offline',
        batteryLevel: 100
      },
      weather: {
        temp: 25,
        humidity: 50,
        rainChance: 0,
        windSpeed: 5,
        uvIndex: 5
      },
      aiRecommendations: {
        bestTime: 'Not configured',
        diseaseRisk: 'Unknown',
        waterSavingTips: 'Calibrate sensors to receive AI tips.',
        healthScore: 50
      },
      mapCoordinates: { lat: 0, lng: 0 }
    };
    addFarm(newFarm);
    navigate('/dashboard/my-farms');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Add New Farm</h1>
          <p className="text-slate-500 dark:text-slate-400">Register a new agricultural plot into the system</p>
        </div>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Information */}
          <GlassCard className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              General Information
            </h2>
            <Input name="name" value={formData.name} onChange={handleChange} placeholder="Farm Name (e.g. Tomato Valley)" required />
            <Input name="farmerName" value={formData.farmerName} onChange={handleChange} placeholder="Farmer Name" required />
            <Input name="cropType" value={formData.cropType} onChange={handleChange} placeholder="Crop Type (e.g. Tomato, Wheat)" required />
            <Input name="area" type="number" value={formData.area} onChange={handleChange} placeholder="Area (Acres)" required />
          </GlassCard>

          {/* Location Details */}
          <GlassCard className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              Location Details
            </h2>
            <Input name="village" value={formData.village} onChange={handleChange} placeholder="Village / Town" required />
            <Input name="district" value={formData.district} onChange={handleChange} placeholder="District" required />
            <Input name="state" value={formData.state} onChange={handleChange} placeholder="State" required />
            <Input name="country" value={formData.country} onChange={handleChange} placeholder="Country" required />
          </GlassCard>

          {/* Agricultural Details */}
          <GlassCard className="p-6 space-y-4 md:col-span-2">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <Settings2 className="w-5 h-5 text-primary" />
              Agricultural Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="waterSource" value={formData.waterSource} onChange={handleChange} placeholder="Water Source (e.g. Borewell, Canal)" />
              <div className="relative">
                <select 
                  name="irrigationMethod" 
                  value={formData.irrigationMethod} 
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                  required
                >
                  <option value="" disabled>Select Irrigation Method</option>
                  <option value="Drip">Drip Irrigation</option>
                  <option value="Sprinkler">Sprinkler System</option>
                  <option value="Flood">Flood Irrigation</option>
                  <option value="Center Pivot">Center Pivot</option>
                </select>
              </div>
              <Input name="plantCount" type="number" value={formData.plantCount} onChange={handleChange} placeholder="Estimated Plant Count" />
              <Input name="expectedHarvest" type="date" value={formData.expectedHarvest} onChange={handleChange} placeholder="Expected Harvest Date" />
            </div>
          </GlassCard>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/dashboard/my-farms')}>
            Cancel
          </Button>
          <Button type="submit" className="gap-2 px-8">
            <Save className="w-4 h-4" />
            Save Farm
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
