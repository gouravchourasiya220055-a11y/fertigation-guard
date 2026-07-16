import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Map,
  Activity, 
  Cpu, 
  Sprout, 
  CloudSun,
  Droplet,
  LineChart, 
  Sparkles,
  Bell, 
  FileText,
  Sliders,
  Router,
  Settings2,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  User,
  ChevronDown
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAuth } from '@/context/AuthContext';
import { useFarm } from '@/context/FarmContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Map, label: 'My Farms', path: '/dashboard/my-farms' },
  { icon: Activity, label: 'Live Monitoring', path: '/dashboard/live-monitoring' },
  { icon: Cpu, label: 'Automation', path: '/dashboard/automation' },
  { icon: Sprout, label: 'Plant Database', path: '/dashboard/plants' },
  { icon: CloudSun, label: 'Weather', path: '/dashboard/weather' },
  { icon: Droplet, label: 'Water Quality', path: '/dashboard/water-quality' },
  { icon: LineChart, label: 'Charts & Analytics', path: '/dashboard/charts' },
  { icon: Sparkles, label: 'AI Recommendations', path: '/dashboard/ai-recommendations' },
  { icon: Bell, label: 'Alerts', path: '/dashboard/alerts' },
  { icon: FileText, label: 'Reports', path: '/dashboard/reports' },
  { icon: Sliders, label: 'Manual Control', path: '/dashboard/manual-control' },
  { icon: Router, label: 'Device Management', path: '/dashboard/devices' },
  { icon: Settings2, label: 'Settings', path: '/dashboard/settings' },
  { icon: HelpCircle, label: 'Help & Support', path: '/dashboard/help' },
];

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFarmSelectorOpen, setIsFarmSelectorOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const farmSelectorRef = useRef<HTMLDivElement>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { farms, activeFarm, setActiveFarmId } = useFarm();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    setIsProfileOpen(false);
    setIsFarmSelectorOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (farmSelectorRef.current && !farmSelectorRef.current.contains(event.target as Node)) {
        setIsFarmSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-50 dark:bg-transparent">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-slate-900/50 z-20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="w-72 h-screen p-4 flex flex-col z-30 fixed md:relative shrink-0"
          >
            <GlassCard variant="panel" className="flex-1 flex flex-col overflow-hidden border-white/20">
              <div className="p-6 flex flex-col gap-1 items-center justify-center border-b border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 mb-2">
                  <Sprout className="text-white w-8 h-8" />
                </div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white text-center">
                  Fertigation Guard
                </h1>
              </div>

              <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto py-4 custom-scrollbar">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                        ${isActive 
                          ? 'bg-primary/20 text-primary font-semibold shadow-inner' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'}
                      `}
                    >
                      <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
                      {item.label}
                      {isActive && (
                        <motion.div 
                          layoutId="activeIndicator"
                          className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                        />
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="p-4 mt-auto border-t border-slate-200/50 dark:border-white/10">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-500/20 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </GlassCard>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        
        {/* Top Navbar */}
        <header className="h-20 px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm md:hidden"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                Fertigation Guard
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">AI Powered Smart Irrigation & Fertigation Platform</p>
            </div>
            
            {/* Farm Selector */}
            <div className="relative ml-4" ref={farmSelectorRef}>
              <div 
                onClick={() => setIsFarmSelectorOpen(!isFarmSelectorOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 backdrop-blur-md cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Select Farm</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">{activeFarm.name}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isFarmSelectorOpen ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {isFarmSelectorOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto custom-scrollbar"
                  >
                    {farms.map((farm) => (
                      <div 
                        key={farm.id}
                        onClick={() => {
                          setActiveFarmId(farm.id);
                          setIsFarmSelectorOpen(false);
                        }}
                        className={`p-3 border-b border-slate-100 dark:border-white/5 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${activeFarm.id === farm.id ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                      >
                        <div className="font-semibold text-sm text-slate-800 dark:text-white">{farm.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{farm.cropType}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{farm.area} Acres</span>
                        </div>
                      </div>
                    ))}
                    <div 
                      onClick={() => {
                        navigate('/dashboard/add-farm');
                        setIsFarmSelectorOpen(false);
                      }}
                      className="p-3 bg-slate-50 dark:bg-slate-900/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 text-center transition-colors"
                    >
                      <span className="text-sm font-medium text-primary flex items-center justify-center gap-2">
                        + Add Custom Farm
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm group"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? 'dark' : 'light'}
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Moon className="w-5 h-5 text-slate-300 group-hover:text-white" /> : <Sun className="w-5 h-5 text-orange-400" />}
                </motion.div>
              </AnimatePresence>
            </button>

            <button className="relative p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full" />
            </button>

            <div className="relative" ref={profileRef}>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-400 to-accent p-0.5 shadow-md shadow-emerald-500/20 cursor-pointer overflow-hidden transition-transform hover:scale-105"
              >
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Farmer" alt="Profile" className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-[10px]" />
              </div>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden z-50"
                  >
                    <div className="py-1">
                      <button 
                        onClick={() => navigate('/dashboard/profile')}
                        className="flex w-full items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                      >
                        <User className="mr-3 h-4 w-4 text-slate-400" />
                        Profile
                      </button>
                      <button 
                        onClick={() => navigate('/dashboard/settings')}
                        className="flex w-full items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                      >
                        <Settings2 className="mr-3 h-4 w-4 text-slate-400" />
                        Settings
                      </button>
                      <div className="my-1 border-t border-slate-200 dark:border-white/10" />
                      <button 
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="mr-3 h-4 w-4 text-red-500" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-0 relative z-10 custom-scrollbar">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
