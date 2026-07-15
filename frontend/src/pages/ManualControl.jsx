import { useState } from 'react';
import { sendCommand } from '../api';

function Toggle({ label, value, onChange, disabled }) {
  return (
    <div className="toggle-row">
      <span>{label}</span>
      <button
        type="button"
        className={`switch ${value ? 'on' : ''}`}
        onClick={() => onChange(!value)}
        disabled={disabled}
        aria-label={`Toggle ${label}`}
      />
    </div>
  );
}

export default function ManualControl({ status }) {
  const isManual = status?.mode === 'MANUAL';
  const [relays, setRelays] = useState({
    waterPump: false,
    basePump: false,
    fertPump: false,
    flushValve: false,
    stirrer: false,
  });

  async function setMode(mode) {
    await sendCommand({ mode, deviceId: 'esp32-fertigation-1' });
  }

  async function toggleRelay(key) {
    if (!isManual) return;
    const next = { ...relays, [key]: !relays[key] };
    setRelays(next);
    await sendCommand({
      mode: 'MANUAL',
      deviceId: 'esp32-fertigation-1',
      relays: next,
    });
  }

  async function startCycle() {
    await sendCommand({ mode: 'AUTO', startCycle: true, deviceId: 'esp32-fertigation-1' });
  }

  // Sync from live status when in manual
  const live = isManual ? {
    waterPump: status?.waterPump ?? relays.waterPump,
    basePump: status?.basePump ?? relays.basePump,
    fertPump: status?.fertPump ?? relays.fertPump,
    flushValve: status?.flushValve ?? relays.flushValve,
    stirrer: status?.stirrer ?? relays.stirrer,
  } : relays;

  return (
    <>
      <header className="page-header">
        <h2>Manual Control</h2>
        <p>Override pumps and valves. Switch to Manual mode before toggling relays.</p>
      </header>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-title">Mode</div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <button type="button" className={`btn ${!isManual ? 'primary' : ''}`} onClick={() => setMode('AUTO')}>
              Auto Mode
            </button>
            <button type="button" className={`btn ${isManual ? 'primary' : ''}`} onClick={() => setMode('MANUAL')}>
              Manual Mode
            </button>
            <button type="button" className="btn" onClick={startCycle}>
              Start Auto Cycle
            </button>
          </div>
          <span className={`status-pill ${isManual ? 'warn' : 'on'}`}>
            Current: {status?.mode || 'AUTO'}
          </span>
        </div>

        <div className="card">
          <div className="card-title">Relays {!isManual && '(enable Manual mode)'}</div>
          <Toggle label="Water Pump" value={live.waterPump} onChange={() => toggleRelay('waterPump')} disabled={!isManual} />
          <Toggle label="Base Pump" value={live.basePump} onChange={() => toggleRelay('basePump')} disabled={!isManual} />
          <Toggle label="Fertilizer Pump" value={live.fertPump} onChange={() => toggleRelay('fertPump')} disabled={!isManual} />
          <Toggle label="Flush Valve" value={live.flushValve} onChange={() => toggleRelay('flushValve')} disabled={!isManual} />
          <Toggle label="Stirrer" value={live.stirrer} onChange={() => toggleRelay('stirrer')} disabled={!isManual} />
        </div>
      </div>
    </>
  );
}
