import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Settings2, Calculator } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useFarm } from '@/context/FarmContext';
import { useNavigate } from 'react-router-dom';
import { calculateRequirements } from '@/lib/calculations';
import { cropDatabase } from '@/data/cropDatabase';

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
    cropType: 'Tomato',
    variety: '',
    soilType: 'Loamy',
    area: '1',
    areaUnit: 'Acre',
    waterSource: '',
    irrigationMethod: 'Drip',
    plantSpacing: '0.5',
    rowSpacing: '1.0',
    plantingDate: new Date().toISOString().split('T')[0]
  });

  const calculations = useMemo(() => {
    return calculateRequirements(
      formData.cropType, 
      Number(formData.area), 
      formData.areaUnit, 
      Number(formData.plantSpacing), 
      Number(formData.rowSpacing)
    );
  }, [formData.cropType, formData.area, formData.areaUnit, formData.plantSpacing, formData.rowSpacing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate backend object
    const newFarm: any = {
      ...formData,
      id: `f-${Date.now()}`,
      name: formData.name || 'New Custom Farm',
      cropType: formData.cropType || 'Mixed',
      area: Number(formData.area) || 0,
      location: `${formData.village}, ${formData.district}, ${formData.state}`,
      status: 'Maintenance',
      image: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=600',
      metrics: {
        temperature: 25,
        moisture: 50,
        pH: calculations ? parseFloat(calculations.phRange.split('-')[0]) : 6.5,
        ec: calculations ? parseFloat(calculations.ecRange.split('-')[0]) : 1.5,
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
        healthScore: 100
      },
      mapCoordinates: { lat: 0, lng: 0 },
      ...calculations
    };
    addFarm(newFarm);
    navigate('/dashboard/my-farms');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Smart Farm Setup</h1>
          <p className="text-muted-foreground">Configure your precision agriculture parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2">
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* General Information */}
            <GlassCard className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                General & Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="Farm Name" required />
                <Input name="farmerName" value={formData.farmerName} onChange={handleChange} placeholder="Farmer Name" required />
                <Input name="village" value={formData.village} onChange={handleChange} placeholder="Village / Town" required />
                <Input name="district" value={formData.district} onChange={handleChange} placeholder="District" required />
                <Input name="state" value={formData.state} onChange={handleChange} placeholder="State" required />
                <Input name="country" value={formData.country} onChange={handleChange} placeholder="Country" required />
              </div>
            </GlassCard>

            {/* Agricultural Details */}
            <GlassCard className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
                <Settings2 className="w-5 h-5 text-primary" />
                Agronomic Parameters
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <select 
                    name="cropType" 
                    value={formData.cropType} 
                    onChange={handleChange}
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                    required
                  >
                    {Object.keys(cropDatabase).map(key => (
                      <option key={key} value={(cropDatabase as any)[key].id}>{(cropDatabase as any)[key].name}</option>
                    ))}
                  </select>
                </div>
                <Input name="variety" value={formData.variety} onChange={handleChange} placeholder="Crop Variety" />
                
                <div className="flex gap-2">
                  <Input name="area" type="number" step="0.1" value={formData.area} onChange={handleChange} placeholder="Area" required className="flex-1" />
                  <select 
                    name="areaUnit" 
                    value={formData.areaUnit} 
                    onChange={handleChange}
                    className="w-1/3 bg-card border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                  >
                    <option value="Acre">Acre</option>
                    <option value="Hectare">Hectare</option>
                    <option value="Square Meter">Sq Meter</option>
                  </select>
                </div>
                
                <select 
                  name="soilType" 
                  value={formData.soilType} 
                  onChange={handleChange}
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                >
                  <option value="Clay">Clay</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Silt">Silt</option>
                </select>

                <Input name="plantSpacing" type="number" step="0.1" value={formData.plantSpacing} onChange={handleChange} placeholder="Plant Spacing (m)" required />
                <Input name="rowSpacing" type="number" step="0.1" value={formData.rowSpacing} onChange={handleChange} placeholder="Row Spacing (m)" required />
                
                <select 
                  name="irrigationMethod" 
                  value={formData.irrigationMethod} 
                  onChange={handleChange}
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                >
                  <option value="Drip">Drip Irrigation</option>
                  <option value="Sprinkler">Sprinkler System</option>
                  <option value="Flood">Flood Irrigation</option>
                </select>
                
                <Input name="plantingDate" type="date" value={formData.plantingDate} onChange={handleChange} required />
              </div>
            </GlassCard>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={() => navigate('/dashboard/my-farms')}>
                Cancel
              </Button>
              <Button type="submit" className="gap-2 px-8">
                <Save className="w-4 h-4" />
                Save & Initialize AI
              </Button>
            </div>
          </motion.form>
        </div>

        {/* Real-time Calculation Panel */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6 sticky top-6">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
              <Calculator className="w-5 h-5 text-emerald-500" />
              Dynamic Calculations
            </h2>
            
            {calculations ? (
              <div className="space-y-6">
                <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                  <p className="text-sm text-primary font-semibold mb-1">Total Estimated Plants</p>
                  <p className="text-3xl font-bold text-foreground">{calculations.totalPlants.toLocaleString()}</p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Water Requirements</h3>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-muted-foreground">Daily</span>
                    <span className="font-bold text-blue-500">{calculations.dailyWater.toLocaleString()} L</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-muted-foreground">Weekly</span>
                    <span className="font-bold text-blue-500">{calculations.weeklyWater.toLocaleString()} L</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-muted-foreground">Monthly</span>
                    <span className="font-bold text-blue-500">{calculations.monthlyWater.toLocaleString()} L</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Fertilizer (Total Cycle)</h3>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-muted-foreground">Nitrogen (N)</span>
                    <span className="font-bold text-amber-500">{calculations.nReq} kg</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-muted-foreground">Phosphorus (P)</span>
                    <span className="font-bold text-amber-500">{calculations.pReq} kg</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-muted-foreground">Potassium (K)</span>
                    <span className="font-bold text-amber-500">{calculations.kReq} kg</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">System Setup</h3>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-muted-foreground">Target pH</span>
                    <span className="font-bold text-emerald-500">{calculations.phRange}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-muted-foreground">Target EC</span>
                    <span className="font-bold text-emerald-500">{calculations.ecRange} mS/cm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Est. Pump Runtime</span>
                    <span className="font-bold text-foreground">{calculations.pumpRuntimeHours} hrs/day</span>
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-muted-foreground">Invalid parameters.</p>
            )}
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
