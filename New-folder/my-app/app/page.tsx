"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import dynamic from 'next/dynamic';
import LoginScreen from '../components/Auth/LoginScreen';
import Topbar from '../components/UI/Topbar';
import Sidebar from '../components/UI/Sidebar';

// Dynamically import major screens and components to avoid SSR/build issues with browser-only APIs
const DashboardScreen = dynamic(() => import('../components/Dashboard/DashboardScreen'), { ssr: false });
const ListingsHub = dynamic(() => import('../components/Listings/ListingsHub'), { ssr: false });
const CRMKanban = dynamic(() => import('../components/CRM/CRMKanban'), { ssr: false });
const LeadsFlow = dynamic(() => import('../components/CRM/LeadsFlow'), { ssr: false });
const ClientsScreen = dynamic(() => import('../components/CRM/ClientsScreen'), { ssr: false });
const ReportsScreen = dynamic(() => import('../components/Dashboard/ReportsScreen'), { ssr: false });
const TeamScreen = dynamic(() => import('../components/Dashboard/TeamScreen'), { ssr: false });
const ActionProtocols = dynamic(() => import('../components/Operations/ActionProtocols'), { ssr: false });
const SiteExperiences = dynamic(() => import('../components/Operations/SiteExperiences'), { ssr: false });
const CommissionLedger = dynamic(() => import('../components/Operations/CommissionLedger'), { ssr: false });
const MediaHub = dynamic(() => import('../components/Admin/MediaHub'), { ssr: false });
const DedupeReviewQueue = dynamic(() => import('../components/Admin/DedupeReviewQueue'), { ssr: false });
const EasyListing = dynamic(() => import('../components/Operations/EasyListing'), { ssr: false });
const IntegrationHub = dynamic(() => import('../components/Operations/IntegrationHub'), { ssr: false });
const MarketIntelligence = dynamic(() => import('../components/Operations/MarketIntelligence'), { ssr: false });
const PortfolioAssets = dynamic(() => import('../components/Admin/PortfolioAssets'), { ssr: false });

type Screen = 'dashboard' | 'listings' | 'crm' | 'leads' | 'reports' | 'team' | 'clients' | 'protocols' | 'media' | 'experiences' | 'ledger' | 'sync' | 'processing' | 'nexus' | 'intelligence';

export default function SierraBluApp() {
  const { user, isGuest, loading, signOut } = useAuth();
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState('Welcome');
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening');
    setDateString(new Date().toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));

    // Expose navigation to window for nested components
    if (typeof window !== 'undefined') {
      (window as any).setActiveScreen = setActiveScreen;

      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        document.documentElement.style.setProperty('--mouse-x', x.toFixed(3));
        document.documentElement.style.setProperty('--mouse-y', y.toFixed(3));
        document.documentElement.style.setProperty('--mouse-x-px', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y-px', `${e.clientY}px`);
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader-logo">SB</div>
        <div className="loader-text">Initializing Sierra Blu workspace…</div>
      </div>
    );
  }

  if (!user && !isGuest) {
    return <LoginScreen />;
  }

  if (!mounted) return null;

  const displayName = user?.displayName || user?.email?.split('@')[0] || (isGuest ? 'Guest Advisor' : 'A. Fawzy');
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  const firstName = displayName.split(' ')[0];

  const handleSignOut = () => {
    void signOut();
    setActiveScreen('dashboard');
  };

  return (
    <div className="screen active">
      <Topbar
        onHomeClick={() => setActiveScreen('dashboard')}
        onSignOut={handleSignOut}
        userInitials={initials}
        displayName={displayName}
        isGuest={isGuest}
      />

      <div className="app-layout">
        <Sidebar 
          activeScreen={activeScreen} 
          onNavigate={setActiveScreen} 
          displayName={displayName}
          userInitials={initials}
        />

        <div className="main-content">
          {activeScreen === 'dashboard' && (
            <DashboardScreen 
              greeting={greeting}
              firstName={firstName}
              dateString={dateString}
              onNavigate={setActiveScreen}
            />
          )}


          {activeScreen === 'listings' && <PortfolioAssets />}
          {activeScreen === 'crm' && <CRMKanban />}
          {activeScreen === 'leads' && <LeadsFlow />}
          {activeScreen === 'clients' && <ClientsScreen />}
          {activeScreen === 'reports' && <ReportsScreen />}
          {activeScreen === 'team' && <TeamScreen onNavigate={setActiveScreen} />}
          {activeScreen === 'protocols' && <ActionProtocols />}
          {activeScreen === 'media' && <MediaHub />}
          {activeScreen === 'experiences' && <SiteExperiences />}
          {activeScreen === 'ledger' && <CommissionLedger />}
          {activeScreen === 'sync' && <DedupeReviewQueue />}
          {activeScreen === 'processing' && <EasyListing />}
          {activeScreen === 'nexus' && <IntegrationHub />}
          {activeScreen === 'intelligence' && <MarketIntelligence />}
        </div>
      </div>
    </div>
  );
}
