import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sprout, Activity, Droplets, ArrowRight, ShieldCheck, Cpu, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sprout className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">Fertigation Guard</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#technology" className="hover:text-white transition-colors">Technology</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-white transition-colors hidden sm:block">Sign In</Link>
            <Link to="/dashboard">
              <Button className="bg-white text-slate-950 hover:bg-slate-200 shadow-xl shadow-white/10 rounded-full px-6">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-emerald-400 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            ESP32 Powered Real-time System
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]"
          >
            AI-Based Smart <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
              Fertigation System
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Automatically monitor and control irrigation, water quality, and fertilizer dosing using advanced sensors, LoRa, and Artificial Intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/dashboard">
              <Button size="lg" className="rounded-full px-8 gap-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25">
                View Live Demo <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-full px-8 border-white/20 hover:bg-white/5">
              Read Documentation
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative z-10 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to grow</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Hardware and software perfectly integrated to provide an unparalleled agricultural monitoring experience.</p>
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
                color: "text-blue-400",
                bg: "bg-blue-400/10"
              },
              {
                icon: Cpu,
                title: "AI Recommendations",
                desc: "Get instant AI insights on fertilizer dosing, flush alerts, and anomaly detection.",
                color: "text-emerald-400",
                bg: "bg-emerald-400/10"
              },
              {
                icon: ShieldCheck,
                title: "Automated Control",
                desc: "Let the system automatically control water pumps, acid/base dosing, and flush valves.",
                color: "text-purple-400",
                bg: "bg-purple-400/10"
              },
              {
                icon: Droplets,
                title: "Precision Dosing",
                desc: "Maintain exact target EC and pH levels tailored to your specific crop's growth stage.",
                color: "text-cyan-400",
                bg: "bg-cyan-400/10"
              },
              {
                icon: Smartphone,
                title: "Anywhere Access",
                desc: "Monitor your farm from your phone, tablet, or desktop with a responsive dashboard.",
                color: "text-orange-400",
                bg: "bg-orange-400/10"
              }
            ].map((feature, i) => (
              <motion.div key={i} variants={item} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-muted-foreground">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Sprout className="w-5 h-5 text-emerald-500" />
            <span className="font-semibold text-slate-300">Fertigation Guard</span>
          </div>
          <p>© 2026 Fertigation Guard. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
