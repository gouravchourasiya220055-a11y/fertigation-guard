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
import { useTheme } from '@/context/ThemeContext';

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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFarmSelectorOpen, setIsFarmSelectorOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const farmSelectorRef = useRef<HTMLDivElement>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { farms, activeFarm, setActiveFarmId } = useFarm();

  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

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
    <div className="min-h-screen flex overflow-hidden bg-background">
      
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
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
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
                  className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
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
              className="p-2 rounded-xl bg-card hover:bg-muted transition-colors border border-border shadow-sm md:hidden"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                Fertigation Guard
              </h1>
              <p className="text-xs font-medium text-muted-foreground">AI Powered Smart Irrigation & Fertigation Platform</p>
            </div>
            
            {/* Farm Selector */}
            <div className="relative ml-4" ref={farmSelectorRef}>
              <div 
                onClick={() => setIsFarmSelectorOpen(!isFarmSelectorOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card border border-border cursor-pointer hover:bg-muted transition-colors shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-medium">Select Farm</span>
                  <span className="text-sm font-bold text-foreground">{activeFarm?.name || 'Loading...'}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isFarmSelectorOpen ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {isFarmSelectorOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-card border border-border shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto custom-scrollbar"
                  >
                    {farms.map((farm) => (
                      <div 
                        key={farm.id}
                        onClick={() => {
                          setActiveFarmId(farm.id);
                          setIsFarmSelectorOpen(false);
                        }}
                        className={`p-3 border-b border-border cursor-pointer transition-colors hover:bg-muted ${activeFarm?.id === farm.id ? 'bg-primary/10' : ''}`}
                      >
                        <div className="font-semibold text-sm text-foreground">{farm.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{farm.cropType}</span>
                          <span className="text-xs text-muted-foreground">{farm.area} Acres</span>
                        </div>
                      </div>
                    ))}
                    <div 
                      onClick={() => {
                        navigate('/dashboard/add-farm');
                        setIsFarmSelectorOpen(false);
                      }}
                      className="p-3 bg-muted cursor-pointer hover:bg-muted/80 text-center transition-colors"
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
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-3 rounded-xl bg-card hover:bg-muted transition-all border border-border shadow-sm group"
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

            <button className="relative p-3 rounded-xl bg-card hover:bg-muted transition-all border border-border shadow-sm">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-background rounded-full" />
            </button>

            <div className="relative" ref={profileRef}>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="h-12 w-12 rounded-xl bg-gradient-to-tr from-primary to-accent p-0.5 shadow-md shadow-primary/20 cursor-pointer overflow-hidden transition-transform hover:scale-105"
              >
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Farmer" alt="Profile" className="w-full h-full bg-card rounded-[10px]" />
              </div>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-card border border-border shadow-xl overflow-hidden z-50"
                  >
                    <div className="py-1">
                      <button 
                        onClick={() => navigate('/dashboard/profile')}
                        className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <User className="mr-3 h-4 w-4 text-muted-foreground" />
                        Profile
                      </button>
                      <button 
                        onClick={() => navigate('/dashboard/settings')}
                        className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <Settings2 className="mr-3 h-4 w-4 text-muted-foreground" />
                        Settings
                      </button>
                      <div className="my-1 border-t border-border" />
                      <button 
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="mr-3 h-4 w-4 text-destructive" />
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
