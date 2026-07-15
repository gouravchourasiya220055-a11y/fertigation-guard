import { useState, useEffect } from 'react';
import { NavLink, Routes, Route, BrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CropSettings from './pages/CropSettings';
import ManualControl from './pages/ManualControl';
import History from './pages/History';
import Notifications from './pages/Notifications';
import { fetchStatus, connectWebSocket } from './api';

const NAV_ITEMS = [
  { to: '/', end: true, icon: '🏠', label: 'Home', labelHi: 'होम' },
  { to: '/crops', icon: '🌱', label: 'Crop', labelHi: 'फसल' },
  { to: '/manual', icon: '⚙️', label: 'Control', labelHi: 'नियंत्रण' },
  { to: '/history', icon: '📊', label: 'Record', labelHi: 'रिकॉर्ड' },
  { to: '/notifications', icon: '🔔', label: 'Alerts', labelHi: 'सूचना' },
];

function AppRoutes() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchStatus().then(setStatus);
    connectWebSocket((msg) => {
      if (msg.type === 'status') setStatus(msg.data);
    });
  }, []);

  return (
    <div className="app-shell">
      <header className="top-header">
        <div className="logo">
          <h1>🌾 Fertigation Guard</h1>
          <p>Smart pH · EC · Fertigation System</p>
        </div>
        <div className={`online-badge ${status?.online ? 'online' : ''}`}>
          <span className={`dot ${status?.online ? 'pulse' : ''}`} />
          {status?.online ? 'Online' : 'Offline'}
        </div>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard status={status} />} />
          <Route path="/crops" element={<CropSettings status={status} onUpdate={setStatus} />} />
          <Route path="/manual" element={<ManualControl status={status} />} />
          <Route path="/history" element={<History />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </main>

      <nav className="bottom-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            <span className="nav-label-hi">{item.labelHi}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
