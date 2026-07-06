"use client";
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useI18n } from '../../lib/I18nContext';
import BrandLogo from './BrandLogo';
import LanguageToggle from './LanguageToggle';
import { Search, Bell, Moon, Sun, LogOut, Settings, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopbarProps {
  onHomeClick: () => void;
  onSignOut: () => void;
  userInitials?: string;
  displayName?: string;
  isGuest?: boolean;
}

export default function Topbar({
  onHomeClick,
  onSignOut,
  userInitials = 'AF',
  displayName = 'Ahmed Fawzy',
  isGuest = false,
}: TopbarProps) {
  const { t, setLocale, locale } = useI18n();

  const handleToggleTheme = () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  };

  const handleSignOut = async () => {
    try {
      if (!isGuest) {
        await signOut(auth);
      }
      onSignOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="topbar" style={{ 
      background: 'rgba(10, 25, 47, 0.8)', 
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      padding: '0 32px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flex: 1 }}>
        <button 
          onClick={onHomeClick} 
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          aria-label="Return to Dashboard"
        >
          <BrandLogo size="sm" />
        </button>

        <div style={{ 
          position: 'relative', 
          maxWidth: '500px', 
          flex: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search 
            size={16} 
            style={{ position: 'absolute', left: '16px', color: 'var(--text-secondary)', opacity: 0.5 }} 
          />
          <input 
            type="text" 
            placeholder={locale === 'ar' ? "البحث في الأصول والبيانات..." : "Query assets, signals, or portfolio intelligence..."}
            style={{ 
              width: '100%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              padding: '12px 16px 12px 44px',
              fontSize: '14px',
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              letterSpacing: '0.2px'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.4)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(200, 169, 110, 0.05)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <LanguageToggle onLocaleChange={setLocale} />

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleTheme}
          style={{ 
            width: '36px', height: '36px', borderRadius: '10px', 
            background: 'transparent', border: 'none', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            transition: 'color 0.2s'
          }}
        >
          <Moon size={18} />
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ 
            width: '36px', height: '36px', borderRadius: '10px', 
            background: 'transparent', border: 'none', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            position: 'relative'
          }}
        >
          <Bell size={18} />
          <span style={{ 
            position: 'absolute', top: '8px', right: '8px', 
            width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)',
            boxShadow: '0 0 10px var(--gold)' 
          }} />
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignOut}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', 
            padding: '4px 4px 4px 16px', borderRadius: '12px', 
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            cursor: 'pointer', marginLeft: '12px'
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {displayName}
          </span>
          <div style={{ 
            width: '32px', height: '32px', borderRadius: '8px', 
            background: 'var(--luxury-gradient)', color: 'var(--navy)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px'
          }}>
            {userInitials}
          </div>
        </motion.button>
      </div>
    </header>
  );
}
