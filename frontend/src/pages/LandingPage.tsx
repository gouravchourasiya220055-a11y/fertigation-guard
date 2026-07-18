import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sprout, Activity, Droplets, ArrowRight, Cpu, Smartphone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAF4] via-[#EEF6EC] to-[#FFF9F2] text-[#1B4332] selection:bg-[#2E7D32]/20 transition-colors duration-300">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#DDE7D9] bg-white/85 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2E7D32] to-[#1B5E20] flex items-center justify-center shadow-md">
              <Sprout className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#1B4332]">Fertigation Guard</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-[#5E6E64]">
            <a href="#features" className="hover:text-[#2E7D32] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#2E7D32] transition-colors">How it Works</a>
            <a href="#technology" className="hover:text-[#2E7D32] transition-colors">Technology</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-[#2E7D32] hover:text-[#1B5E20] transition-colors hidden sm:block">Sign In</Link>
            <Link to="/dashboard">
              <Button className="bg-[#2E7D32] text-white hover:bg-[#1B5E20] shadow-sm rounded-xl px-6 font-bold cursor-pointer">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Nature-inspired Background glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#EAF7EA]/50 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFF9F2]/50 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EAF7EA] border border-[#DDE7D9] text-sm font-bold text-[#2E7D32] mb-8 shadow-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D32] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1B5E20]"></span>
            </span>
            IoT & ESP32 Powered Precision System
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-[#1B4332]"
          >
            AI-Based Smart <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] via-[#1B5E20] to-[#F59E0B]">
              Fertigation System
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-[#5E6E64] max-w-2xl mx-auto mb-10 leading-relaxed font-bold"
          >
            Automatically monitor and control irrigation, water quality, and fertilizer dosing using advanced sensors, LoRa, and Artificial Intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <Link to="/dashboard">
              <Button size="lg" className="rounded-xl px-8 gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white shadow-md hover:shadow-lg font-bold cursor-pointer transition-all hover:-translate-y-0.5">
                View Live Demo <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-xl px-8 border-[#DDE7D9] text-[#2E7D32] bg-white hover:bg-[#EAF7EA]/30 font-bold cursor-pointer transition-all hover:-translate-y-0.5">
              Read Documentation
            </Button>
          </motion.div>

          {/* Premium Smart Farm SVG Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="w-full max-w-2xl mx-auto mt-4 px-4"
          >
            <svg className="w-full h-auto drop-shadow-xl" viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Soft background sun glow */}
              <circle cx="300" cy="140" r="100" fill="url(#sunGlow)" opacity="0.15" />
              <circle cx="300" cy="140" r="60" fill="url(#sunGlow)" opacity="0.25" />
              
              {/* Cloud/Sensors IoT Connection Lines */}
              <path d="M100,100 Q300,20 500,100" stroke="url(#dashLine)" strokeWidth="2" strokeDasharray="6,6" opacity="0.7" />
              <path d="M180,90 Q300,35 420,90" stroke="url(#dashLine)" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5" />
              
              {/* Rolling Green Fields (Background and Foreground Hills) */}
              {/* Deep Green Hill #2E7D32 */}
              <path d="M-50,240 Q150,140 350,210 T650,180 L650,320 L-50,320 Z" fill="#2E7D32" opacity="0.85" />
              {/* Medium Green Hill #1B5E20 */}
              <path d="M-50,270 Q220,190 420,230 T650,240 L650,320 L-50,320 Z" fill="#1B5E20" opacity="0.9" />
              {/* Accent Soft Green Hill #EAF7EA */}
              <path d="M-50,290 Q120,220 300,250 T650,260 L650,320 L-50,320 Z" fill="#A4D7A4" />
              
              {/* Irrigation Pipes & Sprinkler */}
              <path d="M80,245 L520,245" stroke="#8D6E63" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="160" cy="245" r="4.5" fill="#A1887F" />
              <circle cx="300" cy="245" r="4.5" fill="#A1887F" />
              <circle cx="440" cy="245" r="4.5" fill="#A1887F" />
              
              {/* Sprinkler Water Drops */}
              {/* Left Sprinkler Arcs */}
              <path d="M160,240 C145,220 130,220 115,235" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2,3" opacity="0.8" />
              <path d="M160,240 C175,220 190,220 205,235" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2,3" opacity="0.8" />
              {/* Center Sprinkler Arcs */}
              <path d="M300,240 C280,210 255,210 235,230" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeDasharray="3,4" opacity="0.8" />
              <path d="M300,240 C320,210 345,210 365,230" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeDasharray="3,4" opacity="0.8" />
              {/* Right Sprinkler Arcs */}
              <path d="M440,240 C425,220 410,220 395,235" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2,3" opacity="0.8" />
              <path d="M440,240 C455,220 470,220 485,235" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2,3" opacity="0.8" />

              {/* Smart IoT Sensor Node (Pole with antenna & sensor) */}
              <g transform="translate(300, 115)">
                <line x1="0" y1="0" x2="0" y2="130" stroke="#8D6E63" strokeWidth="3.5" />
                <rect x="-14" y="-10" width="28" height="22" rx="5" fill="#FFFFFF" stroke="#2E7D32" strokeWidth="2" />
                {/* Small Sprout shape inside Node */}
                <path d="M-4,-2 C-4,2 0,5 4,5 C4,5 4,1 0,-2 Z" fill="#2E7D32" />
                {/* Antenna */}
                <line x1="0" y1="-10" x2="0" y2="-28" stroke="#2E7D32" strokeWidth="1.8" />
                <circle cx="0" cy="-28" r="3.5" fill="#2E7D32" />
                {/* Signal Waves */}
                <path d="M-7,-24 A9,9 0 0,1 7,-24" fill="none" stroke="#2E7D32" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
                <path d="M-12,-29 A15,15 0 0,1 12,-29" fill="none" stroke="#1B5E20" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
              </g>

              {/* Growing Plants/Sprouts along the hills */}
              <g transform="translate(90, 205)">
                <path d="M0,18 C0,6 6,0 12,-2 C12,-2 8,10 0,18" fill="#A4D7A4" />
                <path d="M0,18 C0,8 -6,4 -12,2 C-12,2 -8,12 0,18" fill="#2E7D32" />
                <line x1="0" y1="18" x2="0" y2="6" stroke="#1B5E20" strokeWidth="1.2" />
              </g>
              <g transform="translate(480, 215)">
                <path d="M0,15 C0,5 5,0 10,-2 C10,-2 7,8 0,15" fill="#A4D7A4" />
                <path d="M0,15 C0,6 -5,3 -10,1 C-10,1 -7,10 0,15" fill="#2E7D32" />
                <line x1="0" y1="15" x2="0" y2="5" stroke="#1B5E20" strokeWidth="1" />
              </g>
              
              <defs>
                <linearGradient id="sunGlow" x1="300" y1="40" x2="300" y2="240" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFF9F2" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="dashLine" x1="100" y1="60" x2="500" y2="60" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#EAF7EA" stopOpacity="0" />
                  <stop offset="50%" stopColor="#2E7D32" />
                  <stop offset="100%" stopColor="#EAF7EA" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative z-10 border-t border-[#DDE7D9] bg-[#EEF6EC]/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#1B4332]">Everything you need to grow</h2>
            <p className="text-[#5E6E64] max-w-2xl mx-auto font-bold">Hardware and software perfectly integrated to provide an unparalleled agricultural monitoring experience.</p>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Activity,
                title: "Real-time Monitoring",
                desc: "Track pH, EC, temperature, humidity, and flow rate with sub-second latency.",
                color: "text-[#2E7D32]",
                bg: "bg-[#EAF7EA] border border-emerald-200/50"
              },
              {
                icon: Sparkles,
                title: "AI Recommendations",
                desc: "Get instant AI insights on fertilizer dosing, flush alerts, and anomaly detection.",
                color: "text-[#F59E0B]",
                bg: "bg-[#FFF9F2] border border-amber-200/50"
              },
              {
                icon: Cpu,
                title: "Automated Control",
                desc: "Let the system automatically control water pumps, acid/base dosing, and flush valves.",
                color: "text-[#2563EB]",
                bg: "bg-[#F0F7FF] border border-blue-200/50"
              },
              {
                icon: Droplets,
                title: "Precision Dosing",
                desc: "Maintain exact target EC and pH levels tailored to your specific crop's growth stage.",
                color: "text-[#2E7D32]",
                bg: "bg-[#EAF7EA] border border-emerald-200/50"
              },
              {
                icon: Smartphone,
                title: "Anywhere Access",
                desc: "Monitor your farm from your phone, tablet, or desktop with a responsive dashboard.",
                color: "text-[#EA580C]",
                bg: "bg-[#FFF9F2] border border-orange-200/50"
              }
            ].map((feature, i) => (
              <motion.div key={i} variants={item} className="p-8 rounded-3xl bg-white border border-[#DDE7D9] hover:border-[#2E7D32] hover:shadow-lg hover:shadow-[#2E7D32]/5 transition-all duration-300 group cursor-default shadow-sm animate-fade-in">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1B4332]">{feature.title}</h3>
                <p className="text-[#5E6E64] leading-relaxed text-sm font-semibold">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#DDE7D9] text-center text-[#5E6E64] bg-white/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Sprout className="w-5 h-5 text-[#2E7D32]" />
            <span className="font-bold text-[#1B4332]">Fertigation Guard</span>
          </div>
          <p className="text-sm font-semibold">© 2026 Fertigation Guard. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
