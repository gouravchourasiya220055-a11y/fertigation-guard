import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Sprout } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      console.log("Sending Login:", email, password);

      const res = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      console.log("Server Response:", res.data);

      if (!res.data?.token) {
        throw new Error("Token not received");
      }

      login(res.data.token, res.data.user);

      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <GlassCard className="w-full max-w-md p-8">

        <div className="text-center mb-6">
          <Sprout size={48} className="mx-auto text-green-600" />
          <h2 className="text-2xl font-bold mt-3">
            Fertigation Guard
          </h2>
        </div>

        <form onSubmit={handleLogin}>

          {error && (
            <div className="text-red-600 mb-4 text-center">
              {error}
            </div>
          )}

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={18} />}
          />

          <div className="mt-4" />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={18} />}
          />

          <Button
            type="submit"
            className="w-full mt-6"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </Button>

        </form>

      </GlassCard>
    </div>
  );
}