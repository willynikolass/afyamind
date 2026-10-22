import React from 'react';
import {
  Wind,
  BookOpen,
  Heart,
  Users,
  Calendar,
  Sparkles,
  Shield,
  LifeBuoy,
  ArrowRight,
  Sun,
  Moon,
  Clock,
  CheckCircle2,
  Lock,
  Smartphone,
  Download,
  QrCode,
  Feather,
  UserPlus,
  Wallet,
  BellRing,
} from 'lucide-react';
import { MoodEntry } from '../../types';
import { MpesaPass } from '../../utils/storage';
import { PushNotificationScheduler } from './PushNotificationScheduler';
import { MashujaaDayBanner } from './MashujaaDayBanner';

interface OverviewDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenCrisis: () => void;
  onOpenSafetyPlan: () => void;
  onOpenPaywall: () => void;
  onOpenInstallModal?: () => void;
  onOpenPayoutHub?: () => void;
  activePass: MpesaPass | null;
  recentMood: MoodEntry | null;
  totalJournals: number;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigate,
  onOpenCrisis,
  onOpenSafetyPlan,
  onOpenPaywall,
  onOpenInstallModal,
  onOpenPayoutHub,
  activePass,
  recentMood,
  totalJournals,
}) => {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 18
      ? 'Good afternoon'
      : 'Good evening';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Gentle Welcoming Hero */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 text-white rounded-3xl p-7 sm:p-10 shadow-lg relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 w-96 h-96 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none"></div>

        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-amber-300">
              {currentHour < 18 ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </span>
            <span className="text-xs font-semibold text-emerald-200 tracking-wider uppercase">
              {greeting} • AfyaMind 2036
            </span>
            <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full font-medium">
              Founded by Nikolass Willy Mtunga (Coast & Taita Taveta)
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
            AfyaMind 2036: A Groundbreaking Initiative to Reduce Mental Health Crises
          </h1>

          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Founded by <strong>Nikolass Willy Mtunga</strong> (raised in Kenya's Coast region and schooled in Taita Taveta) after extensive healthcare research to democratize emotional support and dramatically lower psychiatric patient admissions before 2036.
          </p>

          <div className="pt-3 flex flex-wrap gap-3">
            {onOpenInstallModal && (
              <button
                onClick={onOpenInstallModal}
                className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>📲 Download & Install Phone App</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('manifesto')}
              className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Feather className="w-4 h-4 text-emerald-900" />
              <span>Ilani ya 2036 Manifesto</span>
            </button>

            <button
              onClick={() => onNavigate('community')}
              className="bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-teal-900" />
              <span>Join Community Roster</span>
            </button>

            {onOpenPayoutHub && (
              <button
                onClick={onOpenPayoutHub}
                className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Wallet className="w-4 h-4 text-amber-900" />
                <span>Withdraw Funds (M-Pesa)</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('vision2036')}
              className="bg-white/15 hover:bg-white/25 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Founder Story & 2036 Mission</span>
            </button>

            <button
              onClick={() => onNavigate('exercises')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <Wind className="w-4 h-4" />
              <span>2-Min Paced Breathing</span>
            </button>

            <button
              onClick={() => onNavigate('journal')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Write in Guided Journal</span>
            </button>
          </div>
        </div>
      </div>

      {/* 20th October National Mashujaa Day Founder Philosophy & Push Notification Broadcast */}
      <MashujaaDayBanner
        onNavigateToManifesto={() => onNavigate('manifesto')}
        onNavigateToCommunity={() => onNavigate('community')}
      />

      {/* Real App Download & Home Screen Installation Banner Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 border border-emerald-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Smartphone className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-emerald-950 text-sm">
                Get AfyaMind 2036 as an Official Phone App
              </h3>
              <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                No App Store Fee
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
              Don't want to use a web browser link every time? Download and install AfyaMind 2036 directly onto your phone screen. Opens instantly full-screen like WhatsApp, works offline, and keeps your private data secure.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className="flex-1 md:flex-none bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Install to Phone</span>
            </button>
          )}
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className="flex-1 md:flex-none bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-semibold px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <QrCode className="w-4 h-4 text-emerald-700" />
              <span>Scan QR / Store Info</span>
            </button>
          )}
        </div>
      </div>

      {/* Safety & Immediate Crisis Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-rose-950 text-sm">In acute distress or facing crisis?</h4>
            <p className="text-xs text-rose-800">
              Free, confidential 24/7 human crisis lines are ready to talk or text right now.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={onOpenCrisis}
            className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
          >
            Emergency Lifelines
          </button>
          <button
            onClick={onOpenSafetyPlan}
            className="flex-1 sm:flex-none bg-white hover:bg-rose-100 text-rose-900 border border-rose-300 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center"
          >
            My Safety Plan
          </button>
        </div>
      </div>

      {/* M-PESA App Access Fee & Verification Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-xs">
            M
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-stone-900 text-sm">
                AfyaMind Access Pass (M-PESA)
              </h3>
              {activePass ? (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  ✓ Active ({activePass.tierName})
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Access Fee Required
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">
              Payments are linked directly to Safaricom M-Pesa number{' '}
              <strong className="text-emerald-800 font-mono">+254746867552</strong> (0746867552).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onOpenPaywall}
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{activePass ? 'Manage M-Pesa Pass' : 'Unlock via M-Pesa (from KES 50)'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Access Feature Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Guided Journal */}
        <div
          onClick={() => onNavigate('journal')}
          className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-lg">Guided Journal & CBT</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Decatastrophize anxious thoughts with structured CBT Thought Records or tune into small gratitude anchors.
            </p>
          </div>
          <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>{totalJournals} Private Entries</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 2. Mood & Nervous System Log */}
        <div
          onClick={() => onNavigate('mood')}
          className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-lg">Daily Mood Check-in</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Track emotional valence, energy levels, sleep hours, and biological stress correlations over time.
            </p>
          </div>
          <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-teal-700">
            <span>{recentMood ? `Last Log: ${recentMood.date}` : 'Log Today'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 3. Stress & Soundscapes */}
        <div
          onClick={() => onNavigate('exercises')}
          className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wind className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-lg">Stress & Somatics</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Box Breathing, 5-4-3-2-1 Sensory Grounding, PMR body release, and browser-synthesized ambient rain & waves.
            </p>
          </div>
          <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800">
            <span>Instant Relief</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Push Notification Scheduler for Daily Habit Retention */}
      <PushNotificationScheduler onNavigate={onNavigate} />

      {/* Three Pillar Initiative Cards: Manifesto, Community Roster, Founder Payout Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: 2036 Manifesto */}
        <div
          onClick={() => onNavigate('manifesto')}
          className="bg-gradient-to-br from-emerald-950 to-teal-950 text-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group border border-emerald-800/40"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Feather className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded">
                Official Declaration
              </span>
              <h3 className="font-serif font-bold text-white text-lg">
                Ilani ya AfyaMind 2036
              </h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              The 10 Inviolable Articles of mental healthcare sovereignty, patient reduction, and human dignity proclaimed by founder Nikolass Willy Mtunga.
            </p>
          </div>
          <div className="pt-4 mt-2 border-t border-emerald-800/60 flex items-center justify-between text-xs font-bold text-amber-300">
            <span>Read &amp; Co-Sign Charter</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Community Network & Live Alerts */}
        <div
          onClick={() => onNavigate('community')}
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs hover:border-teal-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                Grassroots Network
              </span>
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                Community Roster &amp; Impact
              </h3>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Showcase where Kenyans add themselves, track interactive Recharts growth trends &amp; active peer support participants over time, and receive live push notifications.
            </p>
          </div>
          <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-teal-700">
            <span>Explore 12,735+ Allies &amp; Charts</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Founder Payout & Cash Withdrawal Center */}
        <div
          onClick={() => onNavigate('payout')}
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                Revenue &amp; Payouts
              </span>
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                Cash Withdrawal Center
              </h3>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Subscription funds arrive directly in your Safaricom M-Pesa line (+254746867552). View instant Wakala Agent kiosk and ATM withdrawal steps.
            </p>
          </div>
          <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800">
            <span>Manage &amp; Withdraw Funds</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Two Column Feature Spotlights: Counsellors & Peer Circles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Counsellor Directory Teaser */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              Licensed Care
            </span>
            <h3 className="font-serif font-bold text-stone-900 text-xl">
              Connect With Qualified Counsellors
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Vetted psychologists and licensed psychotherapists. Transparent fees starting at $45/session, with community-subsidized sliding scale grants available for financial hardship.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('counsellors')}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Browse Counsellors & Sliding Scale</span>
            </button>
          </div>
        </div>

        {/* Peer Circles Teaser */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded">
              Peer Support
            </span>
            <h3 className="font-serif font-bold text-stone-900 text-xl">
              Moderated Peer Support Circles
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Safe, non-judgmental group discussions on Anxiety, Tech/Academic Burnout, and Grief. Facilitated by certified peer specialists with strict anonymity.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('peer')}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <Users className="w-4 h-4" />
              <span>Join Live Peer Support Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* Psychoeducation & Privacy Guarantee */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-stone-900 text-sm">
              Our Non-Exploitation Privacy Pledge
            </h4>
            <p className="text-xs text-stone-500 max-w-xl">
              We do not sell sensitive health information, track your thoughts for ad brokers, or show predatory commercials when you are feeling low.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('learn')}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline shrink-0 cursor-pointer"
        >
          Explore Psychoeducation Library →
        </button>
      </div>
    </div>
  );
};
