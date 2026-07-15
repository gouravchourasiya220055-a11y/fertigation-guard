function phColor(ph, target, tol) {
  if (!ph) return 'var(--muted)';
  if (ph < target - tol || ph > target + tol) return 'var(--amber)';
  return 'var(--green)';
}

function ecColor(ec, target, tol) {
  if (!ec) return 'var(--muted)';
  if (ec < target - tol || ec > target + tol) return 'var(--amber)';
  return 'var(--cyan)';
}

function PumpStatus({ label, active }) {
  return (
    <div className="toggle-row">
      <span>{label}</span>
      <span className={`status-pill ${active ? 'on' : 'off'}`}>
        <span className="dot" />
        {active ? 'ON' : 'OFF'}
      </span>
    </div>
  );
}

export default function Dashboard({ status }) {
  const s = status || {};
  const phOk = s.ph >= s.targetPh - s.phTolerance && s.ph <= s.targetPh + s.phTolerance;

  return (
    <>
      <header className="page-header">
        <h2>Dashboard</h2>
        <p>Live monitoring — {s.crop || 'No crop selected'} · Mode: {s.mode || '—'} · Phase: {s.phase || '—'}</p>
      </header>

      <div className="grid grid-4" style={{ marginBottom: '1rem' }}>
        <div className="card">
          <div className="card-title">Live pH</div>
          <div className="metric-value" style={{ color: phColor(s.ph, s.targetPh, s.phTolerance) }}>
            {(s.ph ?? 0).toFixed(2)}
          </div>
          <div className="metric-target">Target {s.targetPh ?? '—'} ± {s.phTolerance ?? 0.2}</div>
        </div>
        <div className="card">
          <div className="card-title">Live EC</div>
          <div className="metric-value" style={{ color: ecColor(s.ec, s.targetEc, s.ecTolerance) }}>
            {(s.ec ?? 0).toFixed(2)}<small>mS/cm</small>
          </div>
          <div className="metric-target">Target {s.targetEc ?? '—'} ± {s.ecTolerance ?? 0.15}</div>
        </div>
        <div className="card">
          <div className="card-title">System Mode</div>
          <div className="metric-value" style={{ fontSize: '1.5rem' }}>{s.mode || 'AUTO'}</div>
          <div className="metric-target">Phase: {s.phase || 'IDLE'}</div>
        </div>
        <div className="card">
          <div className="card-title">System Health</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span className={`status-pill ${s.online ? 'on' : 'warn'}`}>
              <span className="dot" /> {s.online ? 'Connected' : 'Offline'}
            </span>
            <span className={`status-pill ${s.phValid !== false ? 'on' : 'error'}`}>pH Sensor OK</span>
            <span className={`status-pill ${s.ecValid !== false ? 'on' : 'error'}`}>EC Sensor OK</span>
            <span className={`status-pill ${s.tankLevelOk !== false ? 'on' : 'warn'}`}>Tank Level OK</span>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-title">Pump & Valve Status</div>
          <PumpStatus label="Water Pump" active={s.waterPump} />
          <PumpStatus label="Base Pump" active={s.basePump} />
          <PumpStatus label="Fertilizer Pump" active={s.fertPump} />
          <PumpStatus label="Flush Valve" active={s.flushValve} />
          <PumpStatus label="Stirrer" active={s.stirrer} />
        </div>
        <div className="card">
          <div className="card-title">Current Crop</div>
          <div className="metric-value" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{s.crop || '—'}</div>
          <div className="grid grid-2" style={{ gap: '0.75rem' }}>
            <div>
              <div className="card-title">Target pH</div>
              <div className="metric-value" style={{ fontSize: '1.25rem' }}>{s.targetPh ?? '—'}</div>
            </div>
            <div>
              <div className="card-title">Target EC</div>
              <div className="metric-value" style={{ fontSize: '1.25rem' }}>{s.targetEc ?? '—'}</div>
            </div>
            <div>
              <div className="card-title">Flush Time</div>
              <div className="metric-value" style={{ fontSize: '1.25rem' }}>{s.flushSec ?? 20}<small>sec</small></div>
            </div>
            <div>
              <div className="card-title">pH Status</div>
              <span className={`status-pill ${phOk ? 'on' : 'warn'}`}>{phOk ? 'In Range' : 'Adjusting'}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
