"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { LogOut, User as UserIcon } from "lucide-react";

export default function UserNav() {
  const { user, loading, logout } = useAuth();

  if (loading) return null;

  return (
    <div className="flex items-center gap-6">
      {!user ? (
        <Link 
          href="/login" 
          className="text-[11px] font-bold text-white/70 hover:text-[var(--accent-primary)] transition-colors uppercase tracking-[0.2em] cursor-pointer"
        >
          Login
        </Link>
      ) : (
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] font-bold text-white tracking-widest leading-none">
              {user.displayName || user.email?.split("@")[0] || "Team Member"}
            </span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-gold/60 font-bold">
              Access Granted
            </span>
          </div>
          
          <div className="h-8 w-8 rounded-full border border-gold/30 flex items-center justify-center bg-white/5">
             <UserIcon className="w-4 h-4 text-gold" />
          </div>

          <button 
            onClick={logout}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:border-red-400/30 transition-all group"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
