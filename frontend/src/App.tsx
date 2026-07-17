import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./layouts/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import LiveMonitoring from "./pages/dashboard/LiveMonitoring";
import Automation from "./pages/dashboard/Automation";
import PlantDatabase from "./pages/dashboard/PlantDatabase";
import Charts from "./pages/dashboard/Charts";
import Alerts from "./pages/dashboard/Alerts";
import Settings from "./pages/dashboard/Settings";
import Profile from "./pages/dashboard/Profile";
import Login from "./pages/Login";

// New Pages
import AddFarm from "./pages/dashboard/AddFarm";
import MyFarms from "./pages/dashboard/MyFarms";
import Weather from "./pages/dashboard/Weather";
import WaterQuality from "./pages/dashboard/WaterQuality";
import AIRecommendations from "./pages/dashboard/AIRecommendations";
import Reports from "./pages/dashboard/Reports";
import ManualControl from "./pages/dashboard/ManualControl";
import DeviceManagement from "./pages/dashboard/DeviceManagement";
import HelpSupport from "./pages/dashboard/HelpSupport";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { FarmProvider } from "./context/FarmContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SocketProvider } from "./context/SocketContext";
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      <Route 
        path="/login" 
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } 
      />

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="my-farms" element={<MyFarms />} />
        <Route path="add-farm" element={<AddFarm />} />
        <Route path="live-monitoring" element={<LiveMonitoring />} />
        <Route path="automation" element={<Automation />} />
        <Route path="plants" element={<PlantDatabase />} />
        <Route path="weather" element={<Weather />} />
        <Route path="water-quality" element={<WaterQuality />} />
        <Route path="charts" element={<Charts />} />
        <Route path="ai-recommendations" element={<AIRecommendations />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="reports" element={<Reports />} />
        <Route path="manual-control" element={<ManualControl />} />
        <Route path="devices" element={<DeviceManagement />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="help" element={<HelpSupport />} />
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FarmProvider>
          <SocketProvider>
            <BrowserRouter>
              <AppRoutes />
              <Toaster position="bottom-right" />
            </BrowserRouter>
          </SocketProvider>
        </FarmProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;