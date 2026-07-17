import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Sprout } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password reset link has been sent.");
    setIsForgotPasswordOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/20 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center shadow-xl shadow-primary/30 mb-6">
            <Sprout className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your Fertigation Guard account
          </p>
        </div>

        <GlassCard variant="panel" className="p-8 border-white/20">
          <form onSubmit={handleLogin} className="space-y-6" noValidate>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-5 h-5" />}
                autoFocus
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
                <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
                Remember me
              </label>
              <button 
                type="button"
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                onClick={() => setIsForgotPasswordOpen(true)}
              >
                Forgot Password?
              </button>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
              >
                Login
              </Button>
            </div>
          </form>
        </GlassCard>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isForgotPasswordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm"
            >
              <GlassCard className="p-6 border-white/20 shadow-2xl">
                <h3 className="text-xl font-bold text-foreground mb-2">Reset Password</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Enter your email to receive a reset link.
                </p>
                <form onSubmit={handleForgotPassword} className="space-y-4" noValidate>
                  <Input 
                    type="text" 
                    placeholder="Enter Email" 
                    icon={<Mail className="w-5 h-5" />} 
                    autoFocus
                  />
                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="flex-1" 
                      onClick={() => setIsForgotPasswordOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" className="flex-1">
                      Send Link
                    </Button>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
