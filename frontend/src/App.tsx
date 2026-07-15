import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Lazy loading pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const Overview = lazy(() => import('./pages/dashboard/Overview'));
const LiveMonitoring = lazy(() => import('./pages/dashboard/LiveMonitoring'));
const Automation = lazy(() => import('./pages/dashboard/Automation'));
const PlantDatabase = lazy(() => import('./pages/dashboard/PlantDatabase'));
const Charts = lazy(() => import('./pages/dashboard/Charts'));

function App() {
  return (
    <Router>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="live" element={<LiveMonitoring />} />
            <Route path="automation" element={<Automation />} />
            <Route path="plants" element={<PlantDatabase />} />
            <Route path="charts" element={<Charts />} />
            {/* 
            <Route path="ai" element={<AIRecommendations />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="reports" element={<Reports />} />
            */}
          </Route>

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
