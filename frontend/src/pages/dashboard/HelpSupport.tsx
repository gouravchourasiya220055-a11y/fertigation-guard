import { GlassCard } from '@/components/ui/GlassCard';
import { HelpCircle, Phone, Book, MessageCircle } from 'lucide-react';

export default function HelpSupport() {
  const faqs = [
    { q: "How do I calibrate my soil sensors?", a: "Navigate to Device Management, click 'Configure' on the specific sensor, and follow the 3-step calibration wizard. Make sure the soil is at field capacity before starting." },
    { q: "What does the AI Health Score mean?", a: "The AI Health score (0-100) is a comprehensive metric combining current plant stress levels, historical yield data, and predicted weather impacts. A score above 85 is optimal." },
    { q: "How do I switch between automatic and manual control?", a: "Go to the Automation tab to set rules. If you need immediate direct control, go to the Manual Control page which will temporarily override your automation rules." },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">How can we help you today?</h1>
        <div className="max-w-xl mx-auto relative">
          <input 
            type="text" 
            placeholder="Search for answers..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
          <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 text-center hover:bg-white/60 dark:hover:bg-slate-800/60 cursor-pointer transition-colors">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Book className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-foreground mb-2">Documentation</h3>
          <p className="text-sm text-muted-foreground">Read guides and tutorials</p>
        </GlassCard>

        <GlassCard className="p-6 text-center hover:bg-white/60 dark:hover:bg-slate-800/60 cursor-pointer transition-colors">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-foreground mb-2">Community Forum</h3>
          <p className="text-sm text-muted-foreground">Connect with other farmers</p>
        </GlassCard>

        <GlassCard className="p-6 text-center hover:bg-white/60 dark:hover:bg-slate-800/60 cursor-pointer transition-colors">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-foreground mb-2">Contact Agronomist</h3>
          <p className="text-sm text-muted-foreground">Get expert advice</p>
        </GlassCard>
      </div>

      <GlassCard className="p-8 mt-8">
        <h2 className="text-xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-border pb-4 last:border-0 last:pb-0">
              <h4 className="font-semibold text-foreground mb-2">{faq.q}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
