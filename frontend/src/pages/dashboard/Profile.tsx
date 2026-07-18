import { User } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useNavigate } from 'react-router-dom';
export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <User className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
      </div>

      <GlassCard className="p-8 border-white/20">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0">
            <div className="h-32 w-32 rounded-2xl bg-gradient-to-tr from-emerald-400 to-cyan-400 p-1 shadow-lg shadow-emerald-500/20 overflow-hidden">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Farmer" 
                alt="Profile Avatar" 
                className="w-full h-full bg-muted rounded-[12px]" 
              />
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">Change Avatar</Button>
          </div>
          
          <div className="flex-1 space-y-6 w-full max-w-md">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Full Name
                </label>
                <Input type="text" defaultValue="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email Address
                </label>
                <Input type="email" defaultValue="admin@fertigationguard.com" disabled />
              </div>
            </div>
            
            <div className="pt-4 border-t border-border flex gap-4">
              <Button variant="primary">Save Profile</Button>
              <Button variant="destructive" onClick={() => navigate('/')}>Sign Out</Button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
