import { useState, useEffect } from 'react';
import { fetchEvents, connectWebSocket } from '../api';

const SEVERITY_CLASS = {
  info: 'on',
  warning: 'warn',
  error: 'error',
};

export default function Notifications() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents(80).then(setEvents);
    connectWebSocket((msg) => {
      if (msg.type === 'alerts') {
        setEvents((prev) => [
          ...msg.data.map((a, i) => ({
            id: `live-${Date.now()}-${i}`,
            ts: Date.now(),
            type: a.type,
            message: a.message,
            severity: a.severity,
          })),
          ...prev,
        ].slice(0, 80));
      }
    });
  }, []);

  const alertTypes = [
    { type: 'ph_low', label: 'pH Low' },
    { type: 'ph_high', label: 'pH High' },
    { type: 'ec_low', label: 'EC Low' },
    { type: 'ec_high', label: 'EC High' },
    { type: 'sensor_failure', label: 'Sensor Failure' },
    { type: 'flush_completed', label: 'Flush Completed' },
    { type: 'tank_low', label: 'Low Tank Level' },
  ];

  return (
    <>
      <header className="page-header">
        <h2>Notifications</h2>
        <p>Alerts for out-of-range pH/EC, sensor faults, flush completion, and tank levels.</p>
      </header>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-title">Alert Types</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {alertTypes.map((a) => (
            <span key={a.type} className="status-pill off">{a.label}</span>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Recent Alerts</div>
        <ul className="event-list">
          {events.length === 0 && (
            <li className="event-item" style={{ color: 'var(--muted)' }}>No notifications yet</li>
          )}
          {events.map((e) => (
            <li key={e.id} className="event-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div>
                  <time>{new Date(e.ts).toLocaleString()}</time>
                  {e.message}
                </div>
                <span className={`status-pill ${SEVERITY_CLASS[e.severity] || 'off'}`}>
                  {e.type?.replace(/_/g, ' ')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
