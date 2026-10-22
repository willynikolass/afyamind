import React from 'react';
import {
  Heart,
  Shield,
  LifeBuoy,
  EyeOff,
  BookOpen,
  Wind,
  Smile,
  Users,
  Calendar,
  Building2,
  Lock,
  Unlock,
  GraduationCap,
  Sparkles,
  Smartphone,
  Download,
  Feather,
  UserPlus,
  Wallet,
} from 'lucide-react';

import { MpesaPass } from '../utils/storage';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCrisis: () => void;
  onTriggerQuickExit: () => void;
  onToggleVaultModal: () => void;
  isVaultLocked: boolean;
  hasPinSet: boolean;
  activePass: MpesaPass | null;
  onOpenPaywall: () => void;
  onOpenReceipt: () => void;
  onOpenInstallModal: () => void;
  onOpenPayoutHub: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCrisis,
  onTriggerQuickExit,
  onToggleVaultModal,
  isVaultLocked,
  hasPinSet,
  activePass,
  onOpenPaywall,
  onOpenReceipt,
  onOpenInstallModal,
  onOpenPayoutHub,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Smile },
    { id: 'payout', label: 'M-Pesa Withdraw', icon: Wallet },
    { id: 'manifesto', label: 'Manifesto 2036', icon: Feather },
    { id: 'community', label: 'Community & Alerts', icon: UserPlus },
    { id: 'journal', label: 'Guided Journal', icon: BookOpen },
    { id: 'exercises', label: 'Stress Relief & Audio', icon: Wind },
    { id: 'mood', label: 'Mood Tracker', icon: Heart },
    { id: 'vision2036', label: 'Vision 2036 & Founder', icon: Sparkles },
    { id: 'counsellors', label: 'Find Counsellor', icon: Calendar },
    { id: 'peer', label: 'Peer Circles', icon: Users },
    { id: 'learn', label: 'Learn & Toolkit', icon: GraduationCap },
    { id: 'organizations', label: 'For Organizations', icon: Building2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Clinical Safety Notice & Privacy Banner */}
      <div className="bg-stone-900 text-stone-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-stone-300">AfyaMind Wellness Sanctuary</span>
          <span className="hidden sm:inline text-stone-400">|</span>
          <span className="hidden sm:inline text-stone-400">
            Self-care & peer support. Not for acute emergency care.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleVaultModal}
            className="flex items-center gap-1.5 text-stone-300 hover:text-white transition-colors cursor-pointer text-xs"
            title="Private Vault PIN Security"
          >
            {hasPinSet ? (
              isVaultLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-400 font-medium">Vault Locked</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Vault Unlocked</span>
                </>
              )
            ) : (
              <>
                <Shield className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-stone-300">Set PIN Lock</span>
              </>
            )}
          </button>

          <button
            onClick={onTriggerQuickExit}
            className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white px-2 py-0.5 rounded text-xs transition-colors cursor-pointer border border-stone-700"
            title="Immediately hide mental health screen and disguise as productivity notes"
          >
            <EyeOff className="w-3 h-3 text-stone-400" />
            <span>Quick Disguise (Esc)</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-900/10 transition-transform group-hover:scale-105">
              <span className="text-xl font-bold tracking-tighter">🧠</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
                  AfyaMind <span className="text-emerald-700">2036</span>
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Vision 2036
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block -mt-1 font-medium">
                Founded by Nikolass Willy Mtunga • Coast & Taita Taveta Heritage
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Install App, M-Pesa Access Pass & Emergency SOS */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer shadow-2xs hover:scale-102"
              title="Download & Install AfyaMind 2036 as a Phone App"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Get App</span>
            </button>

            {/* Founder Payout & M-Pesa Withdrawal Hub */}
            <button
              onClick={() => setActiveTab('payout')}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer shadow-2xs ${
                activeTab === 'payout'
                  ? 'bg-amber-600 text-white border border-amber-700 shadow-xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
              }`}
              title="Founder Payout & Cash Withdrawal Center (+254746867552)"
            >
              <Wallet className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Withdraw Funds</span>
            </button>
            {activePass ? (
              <button
                onClick={onOpenReceipt}
                className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer shadow-xs"
                title={`M-PESA Pass Active: ${activePass.tierName}. Paid to +254746867552`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>AfyaPass Active</span>
              </button>
            ) : (
              <button
                onClick={onOpenPaywall}
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer shadow-xs"
                title="Unlock AfyaMind full access via M-Pesa to +254746867552"
              >
                <span>M-PESA (KES 50+)</span>
              </button>
            )}

            <button
              onClick={onOpenCrisis}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-lg font-medium text-sm shadow-sm hover:shadow-md transition-all cursor-pointer animate-pulse-gentle"
              title="Immediate Crisis Resources & Safety Plan"
            >
              <LifeBuoy className="w-4 h-4" />
              <span className="font-semibold">SOS / Crisis Help</span>
            </button>
          </div>
        </div>

        {/* Mobile / Horizontal scrollable navigation */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-stone-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-emerald-700 text-white font-semibold'
                    : 'text-stone-600 bg-stone-100 hover:bg-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
