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
        <h1 className="text-3xl font-extrabold text-[#1B4332] mb-4">How can we help you today?</h1>
        <div className="max-w-xl mx-auto relative">
          <input 
            type="text" 
            placeholder="Search for answers..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-[#DDE7D9] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/25 focus:border-[#2E7D32] shadow-sm text-[#1B4332] font-semibold"
          />
          <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5E6E64]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 text-center bg-white border border-[#DDE7D9] border-t-4 border-t-[#2E7D32] rounded-2xl shadow-sm hover:bg-[#EAF7EA]/30 cursor-pointer transition-all">
          <div className="w-12 h-12 bg-[#EAF7EA] text-[#2E7D32] rounded-2xl border border-emerald-200/50 flex items-center justify-center mx-auto mb-4">
            <Book className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#1B4332] mb-2">Documentation</h3>
          <p className="text-sm text-[#5E6E64] font-semibold">Read guides and tutorials</p>
        </div>

        <div className="p-6 text-center bg-[#EAF7EA] border border-[#DDE7D9] rounded-2xl shadow-sm hover:bg-[#EAF7EA]/50 cursor-pointer transition-all">
          <div className="w-12 h-12 bg-[#F0F7FF] text-[#2563EB] rounded-2xl border border-blue-200/50 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#1B4332] mb-2">Community Forum</h3>
          <p className="text-sm text-[#5E6E64] font-semibold">Connect with other farmers</p>
        </div>

        <div className="p-6 text-center bg-[#FFF9F2] border border-[#DDE7D9] rounded-2xl shadow-sm hover:bg-[#FFF9F2]/50 cursor-pointer transition-all">
          <div className="w-12 h-12 bg-[#EAF7EA] text-[#2E7D32] rounded-2xl border border-emerald-200/50 flex items-center justify-center mx-auto mb-4">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#1B4332] mb-2">Contact Agronomist</h3>
          <p className="text-sm text-[#5E6E64] font-semibold">Get expert advice</p>
        </div>
      </div>

      <GlassCard className="p-8 mt-8 border-[#DDE7D9]">
        <h2 className="text-xl font-bold text-[#1B4332] mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-[#DDE7D9] pb-4 last:border-0 last:pb-0">
              <h4 className="font-bold text-[#1B4332] mb-2">{faq.q}</h4>
              <p className="text-[#5E6E64] text-sm leading-relaxed font-medium">{faq.a}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
