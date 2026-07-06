"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/portal");
    } catch (err: unknown) {
      setError("Invalid credentials. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-navy-900 bg-navy-gradient p-6 font-sans relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gold/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-2xl p-10 shadow-3xl border-2 border-gold/50 relative">
          {/* Logo Section */}
          <div className="text-center mb-10 flex flex-col items-center">
            <div className="mb-4 relative w-20 h-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Sierra Blu"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-2xl font-luxury text-background tracking-tighter leading-none block mb-1">
                Sierra Blu
              </span>
              <p className="text-[10px] uppercase tracking-[0.6em] text-background/60 font-bold">
                Beyond Brokerage
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-background/60 mb-2 font-bold">
                Corporate Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background/5 border border-background/10 rounded-xl px-5 py-4 text-background outline-none focus:border-gold transition-all text-sm font-medium"
                placeholder="name@sierra-blu.com"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-background/60 mb-2 font-bold">
                Secured Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background/5 border border-background/10 rounded-xl px-5 py-4 text-background outline-none focus:border-gold transition-all text-sm font-medium"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 font-bold tracking-tight bg-red-50 p-3 rounded-lg border border-red-100 italic">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-background py-5 rounded-xl font-bold uppercase tracking-[0.3em] text-[11px] shadow-lg shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-background/5 text-center">
            <p className="text-[9px] uppercase tracking-[0.25em] text-background/40 font-bold italic">
              Secure access for Sierra Blu team
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
