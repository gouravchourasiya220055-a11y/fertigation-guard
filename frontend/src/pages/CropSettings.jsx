import { useState, useEffect } from 'react';
import { fetchCrops, selectCrop } from '../api';

export default function CropSettings({ status, onUpdate }) {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    fetchCrops().then(setCrops);
  }, []);

  async function handleSelect(crop) {
    setLoading(crop.id);
    const updated = await selectCrop(crop.id);
    onUpdate?.((prev) => ({ ...prev, ...updated, crop: updated.name }));
    setLoading(null);
  }

  return (
    <>
      <header className="page-header">
        <h2>Crop Settings</h2>
        <p>Select a crop to load target pH, EC, flush time, and dosing delay on the ESP32.</p>
      </header>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-title">Active Crop</div>
        <div className="metric-value" style={{ fontSize: '1.5rem' }}>{status?.crop || 'None'}</div>
      </div>

      <div className="crop-grid">
        {crops.map((c) => (
          <div
            key={c.id}
            className={`crop-card ${status?.crop === c.name ? 'selected' : ''}`}
            onClick={() => handleSelect(c)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSelect(c)}
          >
            <h4>{c.name} {loading === c.id ? '…' : ''}</h4>
            <span>pH {c.targetPh} ± {c.phTolerance}</span>
            <span>EC {c.targetEc} mS/cm</span>
            <span>Flush {c.flushSec}s · Dose {c.doseDelayMs / 1000}s</span>
          </div>
        ))}
      </div>
    </>
  );
}
