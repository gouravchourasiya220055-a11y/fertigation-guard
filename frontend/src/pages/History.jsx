import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchTelemetryHistory, fetchFlushHistory, fetchEvents } from '../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const chartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#7a9a82' } } },
  scales: {
    x: { ticks: { color: '#7a9a82', maxTicksLimit: 8 }, grid: { color: '#2a3d32' } },
    y: { ticks: { color: '#7a9a82' }, grid: { color: '#2a3d32' } },
  },
};

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function History() {
  const [telemetry, setTelemetry] = useState([]);
  const [flushes, setFlushes] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchTelemetryHistory(24).then(setTelemetry);
    fetchFlushHistory().then(setFlushes);
    fetchEvents(100).then(setEvents);
    const iv = setInterval(() => {
      fetchTelemetryHistory(24).then(setTelemetry);
    }, 10000);
    return () => clearInterval(iv);
  }, []);

  const labels = telemetry.map((t) => formatTime(t.ts));

  const phChart = {
    labels,
    datasets: [{
      label: 'pH',
      data: telemetry.map((t) => t.ph),
      borderColor: '#4ade80',
      backgroundColor: 'rgba(74, 222, 128, 0.1)',
      fill: true,
      tension: 0.3,
    }],
  };

  const ecChart = {
    labels,
    datasets: [{
      label: 'EC (mS/cm)',
      data: telemetry.map((t) => t.ec),
      borderColor: '#22d3ee',
      backgroundColor: 'rgba(34, 211, 238, 0.1)',
      fill: true,
      tension: 0.3,
    }],
  };

  const pumpRuns = events.filter((e) =>
    ['flush_completed'].includes(e.type) ||
    e.message?.toLowerCase().includes('pump')
  );

  return (
    <>
      <header className="page-header">
        <h2>History</h2>
        <p>pH and EC trends, pump activity, and flush records (last 24 hours).</p>
      </header>

      <div className="grid grid-2" style={{ marginBottom: '1rem' }}>
        <div className="card">
          <div className="card-title">pH Graph</div>
          <div className="chart-wrap">
            {telemetry.length ? <Line data={phChart} options={chartOpts} /> : <p style={{ color: 'var(--muted)' }}>No data yet</p>}
          </div>
        </div>
        <div className="card">
          <div className="card-title">EC Graph</div>
          <div className="chart-wrap">
            {telemetry.length ? <Line data={ecChart} options={chartOpts} /> : <p style={{ color: 'var(--muted)' }}>No data yet</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-title">Flush History</div>
          <ul className="event-list">
            {flushes.length === 0 && <li className="event-item" style={{ color: 'var(--muted)' }}>No flush events</li>}
            {flushes.map((f) => (
              <li key={f.id} className="event-item">
                <time>{new Date(f.ts).toLocaleString()}</time>
                {f.crop} — {f.duration_sec}s flush
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="card-title">Activity Log</div>
          <ul className="event-list">
            {pumpRuns.slice(0, 20).map((e) => (
              <li key={e.id} className="event-item">
                <time>{new Date(e.ts).toLocaleString()}</time>
                {e.message}
              </li>
            ))}
            {pumpRuns.length === 0 && events.slice(0, 15).map((e) => (
              <li key={e.id} className="event-item">
                <time>{new Date(e.ts).toLocaleString()}</time>
                {e.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
