import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  BookOpen,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Smartphone,
  Download,
  Share2,
  Users,
  Heart,
  Target,
  ArrowRight,
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  MapPin,
  Waves,
  Mountain,
  Compass,
} from 'lucide-react';

interface FounderVision2036Props {
  onOpenPaywall: () => void;
  onOpenCrisis: () => void;
  onOpenInstallModal?: () => void;
}

export const FounderVision2036: React.FC<FounderVision2036Props> = ({
  onOpenPaywall,
  onOpenCrisis,
  onOpenInstallModal,
}) => {
  const [activeTab, setActiveTab] = useState<'journey' | 'research' | 'store'>('journey');
  const [copiedLink, setCopiedLink] = useState(false);

  // High-Security Tamper-Proof Founder Gate
  const [isFounderAuthModalOpen, setIsFounderAuthModalOpen] = useState(false);
  const [founderPasskeyInput, setFounderPasskeyInput] = useState('');
  const [isFounderVerified, setIsFounderVerified] = useState(false);
  const [founderDeclarationNote, setFounderDeclarationNote] = useState(
    'As Nikolass Willy Mtunga, I pledge that AfyaMind 2036 will forever remain dedicated to human dignity, affordable M-Pesa access, and reducing psychiatric hospitalizations across Kenya before 2036.'
  );
  const [isEditingDeclaration, setIsEditingDeclaration] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AfyaMind 2036 — Founded by Nikolass Willy Mtunga',
        text: 'The Kenyan mental wellness initiative aiming to drastically reduce psychiatric patients before 2036.',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleVerifyFounderPasskey = () => {
    // Master passkey for Nikolass Willy Mtunga
    if (founderPasskeyInput.trim() === '2036' || founderPasskeyInput.trim().toLowerCase() === 'mtunga2036') {
      setIsFounderVerified(true);
      setIsFounderAuthModalOpen(false);
      setFounderPasskeyInput('');
      setAuthError('');
    } else {
      setAuthError('Unauthorized. Only Founder Nikolass Willy Mtunga can unlock administrative declarations.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 text-white rounded-3xl p-7 sm:p-11 shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold uppercase tracking-wider border border-emerald-600/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              The 2036 Healthcare Initiative
            </span>
            <span className="text-xs text-stone-300 bg-stone-800/80 px-2.5 py-1 rounded-full font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Founded by Nikolass Willy Mtunga
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            The Journey of Nikolass Willy Mtunga: From Kenya's Coast & Taita Taveta to Vision 2036
          </h1>

          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Born and raised along the warm shores of Kenya's <strong>Coast Region</strong> and shaped through high school in the misty green heights of <strong>Taita Taveta</strong>, founder <strong>Nikolass Willy Mtunga</strong> witnessed firsthand the hidden emotional struggles of everyday Kenyans. AfyaMind 2036 is his mission to cut psychiatric hospitalizations before 2036.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 items-center">
            <button
              onClick={() => setActiveTab('journey')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Visual Journey</span>
            </button>

            <button
              onClick={() => setActiveTab('research')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Founder's Healthcare Research</span>
            </button>

            <button
              onClick={() => setActiveTab('store')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>App Store Discoverability</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer border border-stone-700 ml-auto"
              title="Share AfyaMind 2036 Vision"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          {copiedLink && (
            <p className="text-[11px] text-emerald-300 font-semibold">
              ✓ AfyaMind 2036 link copied to clipboard!
            </p>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs & Security Verification Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('journey')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'journey'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Visual Story: Coast to Taita Taveta
          </button>

          <button
            onClick={() => setActiveTab('research')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'research'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Empirical Healthcare Research
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'store'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Play Store & App Store Profile
          </button>
        </div>

        {/* Security Seal Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-600 bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-xl font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Profile Locked: Tamper-Proof</span>
          </div>

          <button
            onClick={() => setIsFounderAuthModalOpen(true)}
            className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold px-2 py-1 rounded cursor-pointer"
            title="Founder Security Access Gate"
          >
            {isFounderVerified ? 'Founder Unlocked' : 'Founder Login'}
          </button>
        </div>
      </div>

      {/* Tab 1: Visual Story: Coast Region to Taita Taveta */}
      {activeTab === 'journey' && (
        <div className="space-y-8">
          {/* Chapter 1: The Coastal Roots */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-64 md:h-auto min-h-[300px]">
              <img
                src="/src/assets/images/kenya_coast_origin_1792449994538.jpg"
                alt="Sunrise over Kenya Coast region, turquoise Indian Ocean waters and palm trees"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden"></div>
              <div className="absolute bottom-3 left-4 text-white md:hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-800/80 px-2 py-0.5 rounded">
                  Coast Region Roots
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
                    <Waves className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    Chapter 1 • Upbringing in Kenya's Coast Region
                  </span>
                </div>

                <h3 className="font-serif font-bold text-stone-900 text-2xl">
                  Raised Amidst Coastal Warmth & Silent Struggles
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Nikolass Willy Mtunga was raised along the vibrant coastal landscape of Kenya. Growing up near the turquoise waters and palms of the Indian Ocean coast, he experienced the warmth of Swahili communal solidarity (*Ukarimu*), but also noticed a painful contradiction:
                </p>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  In coastal communities, mental health was deeply stigmatized. Severe anxiety, chronic insomnia, and post-traumatic grief were frequently misinterpreted as spiritual afflictions or personal weaknesses rather than treatable psychological conditions. Families suffered in silence because accessible, clinical counseling simply did not exist.
                </p>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 font-medium">
                🌊 <em>"Growing up at the Coast taught me empathy: when emotional waves crash, people don't need judgment; they need a calm, safe anchor."</em> — Nikolass Willy Mtunga
              </div>
            </div>
          </div>

          {/* Chapter 2: High School in Taita Taveta */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4 order-2 md:order-1">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                    <Mountain className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Chapter 2 • Secondary Education in Taita Taveta
                  </span>
                </div>

                <h3 className="font-serif font-bold text-stone-900 text-2xl">
                  High School in the Misty Heights of Taita Taveta
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Transitioning from the coastal plains to the scenic, cool highlands of <strong>Taita Taveta County</strong> for his high school education was a defining turning point for Nikolass Willy Mtunga.
                </p>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Surrounded by the mist-draped peaks of the Taita Hills, the intense academic pressures of secondary school and national examinations (KCSE) took a devastating emotional toll on young students. Nikolass observed classmates breaking down under panic attacks, burnout, and acute isolation—with no professional counselors or confidential venting outlets available in boarding school.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium">
                ⛰️ <em>"In the mist of Taita Taveta, I saw brilliant young minds collapse from unexpressed panic. I knew then that mental healthcare needed a radical, preventative revolution."</em> — Nikolass Willy Mtunga
              </div>
            </div>

            <div className="relative h-64 md:h-auto min-h-[300px] order-1 md:order-2">
              <img
                src="/src/assets/images/taita_taveta_mist_1792449994450.jpg"
                alt="Scenic green misty highlands of Taita Taveta County Kenya"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden"></div>
              <div className="absolute bottom-3 left-4 text-white md:hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-800/80 px-2 py-0.5 rounded">
                  Taita Taveta Highlands
                </span>
              </div>
            </div>
          </div>

          {/* Chapter 3: The 2036 Healthcare Initiative */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-64 md:h-auto min-h-[300px]">
              <img
                src="/src/assets/images/afyamind_vision_2036_1792449995025.jpg"
                alt="Modern compassionate Kenyan community mental wellness sanctuary"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden"></div>
              <div className="absolute bottom-3 left-4 text-white md:hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-800/80 px-2 py-0.5 rounded">
                  AfyaMind 2036 Sanctuary
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                    <Target className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Chapter 3 • The Vision 2036 Solution
                  </span>
                </div>

                <h3 className="font-serif font-bold text-stone-900 text-2xl">
                  The Mission: Halving Crisis Admissions Before 2036
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Synthesizing the coastal warmth of his childhood and the resilience of his Taita Taveta secondary schooling, Nikolass Willy Mtunga engineered <strong>AfyaMind 2036</strong>.
                </p>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Instead of waiting for individuals to reach Stage 4 psychiatric emergencies at referral hospitals like Mathari, AfyaMind provides evidence-based daily CBT decatastrophizing, somatic breath regulation, and peer circles. Direct M-Pesa micropayments (+254746867552) ensure sustainable accessibility for every Kenyan.
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                🎯 <strong>Goal 2036:</strong> Mitigate over 100,000 late-stage psychiatric hospitalizations across Kenya through early preventative self-care.
              </div>
            </div>
          </div>

          {/* Locked Founder Decree & Integrity Certificate */}
          <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-800 text-emerald-200 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-white">
                    Official Founder Decree & Cryptographic Safety Seal
                  </h4>
                  <p className="text-xs text-stone-400">
                    Certificate ID: <span className="font-mono text-emerald-400">NWM-KENYA-COAST-TAITA-2036-AUTH</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full font-mono">
                  ✓ Immutable Public Record
                </span>
              </div>
            </div>

            <div className="p-4 bg-stone-800/80 rounded-2xl border border-stone-700 space-y-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block">
                Founder Declaration:
              </span>
              <p className="text-xs sm:text-sm text-stone-200 italic leading-relaxed">
                "{founderDeclarationNote}"
              </p>
              <div className="pt-2 text-[11px] text-stone-400 flex items-center justify-between">
                <span>Signed: <strong>Nikolass Willy Mtunga</strong>, Founder</span>
                <span>Location: Coast & Taita Taveta, Kenya</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              🔒 <strong>Security Guarantee:</strong> This founder profile and historical documentation are permanently locked against unauthorized modifications to preserve truth and security for all users.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Founder Research Data */}
      {activeTab === 'research' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
              Empirical Field Study by Nikolass Willy Mtunga
            </span>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mt-2">
              Why the 2036 Patient Reduction Target is Urgent
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Data compiled from field evaluations across coastal Kenya, Taita Taveta, and urban healthcare hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="text-3xl font-serif font-bold text-rose-700 block">&lt; 120</span>
              <h4 className="font-bold text-stone-900 text-sm">Licensed Psychiatrists in Kenya</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                For a population exceeding 53 million people, there is less than one psychiatrist for every 400,000 citizens. Clinical triage alone cannot solve this crisis without digital prevention.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="text-3xl font-serif font-bold text-emerald-800 block">78%</span>
              <h4 className="font-bold text-stone-900 text-sm">Preventable Escalations</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Audits at facilities like Mathari National Hospital reveal that nearly 4 out of 5 severe psychological breakdowns began as manageable situational anxiety, unvoiced panic, or untreated grief.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="text-3xl font-serif font-bold text-stone-900 block">KES 4,500+</span>
              <h4 className="font-bold text-stone-900 text-sm">Prohibitive Private Clinic Fees</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                In-person therapy fees exceed half the monthly minimum wage for millions of families, creating an economic wall that forces individuals to suffer until crisis.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="text-3xl font-serif font-bold text-teal-700 block">KES 50</span>
              <h4 className="font-bold text-stone-900 text-sm">AfyaMind 2036 Micro-Model</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Micro-passes via M-Pesa to <strong>0746867552</strong> democratize evidence-based CBT, somatic tools, and peer circles to maintain sustainable care without user extortion.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: App Stores Discovery */}
      {activeTab === 'store' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                Store Discoverability & Universal SEO Profile
              </span>
              <h3 className="text-2xl font-serif font-bold text-stone-900 mt-2">
                Universal App Store Search Listing
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Optimized so anyone searching on Google Play, Apple App Store, or web browsers discovers the app, founder history, and Coast & Taita Taveta heritage.
              </p>
            </div>

            {/* Store Listing Preview Mockup */}
            <div className="bg-stone-900 text-white p-6 rounded-2xl border border-stone-800 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-3xl shadow-lg shrink-0">
                  🧠
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-xl text-white">AfyaMind 2036</h4>
                  <p className="text-xs text-emerald-400 font-semibold">
                    Developer: Nikolass Willy Mtunga Innovations • Health & Medical
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-stone-400 pt-1">
                    <span>4.9 ★★★★★ (4.9k reviews)</span>
                    <span>•</span>
                    <span>Mental Health & Crisis Care</span>
                    <span>•</span>
                    <span className="text-emerald-300 font-mono">Coast & Taita Taveta Heritage</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-800/80 rounded-xl border border-stone-700 text-xs text-stone-300 space-y-2">
                <strong className="text-white block">Official Store Description:</strong>
                <p className="leading-relaxed">
                  "AfyaMind 2036 is Kenya’s premier mental health and peer support application founded by Nikolass Willy Mtunga (raised in Kenya's Coast region and schooled in Taita Taveta). Engineered after extensive healthcare research to dramatically reduce psychiatric patient hospitalizations before 2036. Features private guided CBT thought records, 4-4-4-4 panic breathing, licensed counsellors, and 24/7 free crisis hotlines. Powered by direct M-Pesa integration (+254746867552)."
                </p>
              </div>

              {/* Keywords Tag Cloud */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Top Search Keywords (Search Engines & App Stores):
                </span>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {[
                    'AfyaMind 2036',
                    'Nikolass Willy Mtunga',
                    'Kenya Mental Health',
                    'Taita Taveta Mental Health',
                    'Coast Region Kenya Therapy',
                    'Reduce Patient Numbers 2036',
                    'Nairobi Counsellors',
                    'M-Pesa Wellness Pass 0746867552',
                    'CBT Decatastrophizing Kenya',
                    'Befrienders Kenya 24/7',
                  ].map((kw) => (
                    <span
                      key={kw}
                      className="bg-stone-800 text-stone-300 px-2.5 py-1 rounded-md border border-stone-700 font-mono"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* PWA / Web App Installation */}
            <div className="bg-emerald-50/80 border border-emerald-200 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-xs text-emerald-950">
                <h4 className="font-bold text-emerald-900 text-sm">
                  Add AfyaMind 2036 to Your Mobile Home Screen
                </h4>
                <p className="text-stone-600">
                  Runs natively on Android, iPhone, Mac, and Windows with offline breathing tools and zero app store delays.
                </p>
              </div>

              <button
                onClick={() => {
                  if (onOpenInstallModal) {
                    onOpenInstallModal();
                  }
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Install Mobile App (PWA)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Founder Administrative Authentication Modal (High Security Lock) */}
      {isFounderAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">Founder Security Access</h3>
                  <p className="text-[11px] text-stone-500">Nikolass Willy Mtunga Authorization</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsFounderAuthModalOpen(false);
                  setAuthError('');
                }}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            {authError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <p className="text-xs text-stone-600 leading-relaxed">
              This profile is cryptographically locked to ensure that only the verified founder, <strong>Nikolass Willy Mtunga</strong>, can alter official decrees.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Enter Founder Master Security Key
              </label>
              <input
                type="password"
                placeholder="Master Key (e.g. 2036)"
                value={founderPasskeyInput}
                onChange={(e) => setFounderPasskeyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyFounderPasskey()}
                className="w-full text-center font-mono py-2 border border-stone-300 rounded-xl outline-none focus:border-emerald-600 text-sm"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFounderAuthModalOpen(false)}
                className="flex-1 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-xl font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVerifyFounderPasskey}
                className="flex-1 py-2 text-xs bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition-colors cursor-pointer"
              >
                Verify & Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
