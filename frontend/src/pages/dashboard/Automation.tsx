import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Settings2, Save, Droplets, Thermometer, ShieldCheck } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function Automation() {
  const { activeFarm } = useFarm();
  const [loading, setLoading] = useState(false);
  const [ruleId, setRuleId] = useState<string | null>(null);
  
  const [isActive, setIsActive] = useState(true);
  const [soilMin, setSoilMin] = useState(40);
  const [soilMax, setSoilMax] = useState(80);
  const [ecMin, setEcMin] = useState(1.0);
  const [ecMax, setEcMax] = useState(2.5);
  const [phMin, setPhMin] = useState(5.5);
  const [phMax, setPhMax] = useState(6.5);
  const [flushAfterIrrigation, setFlushAfterIrrigation] = useState(true);

  useEffect(() => {
    if (activeFarm?.id) {
      api.get(`/automation/${activeFarm.id}`)
        .then(res => {
          if (res.data.data) {
            const rules = res.data.data;
            setRuleId(rules._id);
            setIsActive(rules.isActive);
            setSoilMin(rules.soilMoistureThresholds?.min || 40);
            setSoilMax(rules.soilMoistureThresholds?.max || 80);
            setEcMin(rules.ecThresholds?.min || 1.0);
            setEcMax(rules.ecThresholds?.max || 2.5);
            setPhMin(rules.phThresholds?.min || 5.5);
            setPhMax(rules.phThresholds?.max || 6.5);
            setFlushAfterIrrigation(rules.flushAfterIrrigation ?? true);
          }
        })
        .catch(console.error);
    }
  }, [activeFarm?.id]);

  const saveSettings = async () => {
    if (!activeFarm?.id) return;
    setLoading(true);
    try {
      const payload = {
        isActive,
        soilMoistureThresholds: { min: Number(soilMin), max: Number(soilMax) },
        ecThresholds: { min: Number(ecMin), max: Number(ecMax) },
        phThresholds: { min: Number(phMin), max: Number(phMax) },
        flushAfterIrrigation
      };
      
      if (ruleId) {
        await api.put(`/automation/${activeFarm.id}`, payload);
      } else {
        await api.post(`/automation/${activeFarm.id}`, payload);
      }
      toast.success('Automation rules updated!');
    } catch (error) {
      toast.error('Failed to save rules');
    } finally {
      setLoading(false);
    }
  };

  if (!activeFarm) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings2 className="w-8 h-8 text-primary" />
            Automation Rules
          </h2>
          <p className="text-muted-foreground mt-1">Configure logic for {activeFarm.name}</p>
        </div>
        <Button onClick={saveSettings} disabled={loading} className="gap-2 bg-primary">
          <Save className="w-5 h-5" />
          {loading ? 'Saving...' : 'Save Rules'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Rules List */}
        <div className="lg:col-span-2 space-y-4">
          
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-emerald-500" />
                Global Automation Switch
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <p className="text-sm text-muted-foreground">Toggle all automatic pumping and dosing on or off. Manual control will still work.</p>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2 mb-4">
              <Droplets className="w-5 h-5 text-blue-500" />
              Soil Moisture Thresholds (%)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Min (Start Pump)</label>
                <Input type="number" value={soilMin} onChange={(e) => setSoilMin(e.target.value as any)} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Max (Stop Pump)</label>
                <Input type="number" value={soilMax} onChange={(e) => setSoilMax(e.target.value as any)} />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2 mb-4">
              <Thermometer className="w-5 h-5 text-amber-500" />
              EC Thresholds (mS/cm)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Min (Start Dosing)</label>
                <Input type="number" step="0.1" value={ecMin} onChange={(e) => setEcMin(e.target.value as any)} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Max (Stop Dosing)</label>
                <Input type="number" step="0.1" value={ecMax} onChange={(e) => setEcMax(e.target.value as any)} />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2 mb-4">
              <Thermometer className="w-5 h-5 text-emerald-500" />
              pH Thresholds
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Min (Dose Base)</label>
                <Input type="number" step="0.1" value={phMin} onChange={(e) => setPhMin(e.target.value as any)} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Max (Dose Acid)</label>
                <Input type="number" step="0.1" value={phMax} onChange={(e) => setPhMax(e.target.value as any)} />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Global Settings */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Additional Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Flush After Irrigation</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={flushAfterIrrigation} onChange={(e) => setFlushAfterIrrigation(e.target.checked)} />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Automatically open the flush valve for 30s after the main pump stops.</p>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
