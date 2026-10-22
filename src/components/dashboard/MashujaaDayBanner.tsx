import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Bell,
  BellRing,
  Sparkles,
  Share2,
  CheckCircle2,
  Heart,
  Volume2,
  ShieldCheck,
  Languages,
  Copy,
  Check,
  Feather,
} from 'lucide-react';
import { notificationService } from '../../utils/notificationService';

interface MashujaaDayBannerProps {
  onNavigateToManifesto?: () => void;
  onNavigateToCommunity?: () => void;
}

export const MashujaaDayBanner: React.FC<MashujaaDayBannerProps> = ({
  onNavigateToManifesto,
  onNavigateToCommunity,
}) => {
  const [lang, setLang] = useState<'sw' | 'en'>('sw');
  const [notificationStatus, setNotificationStatus] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [badgeClaimed, setBadgeClaimed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('afyamind_mashujaa_badge_2026') === 'claimed';
    } catch {
      return false;
    }
  });

  const swQuote = `“Ushujaa wa kweli haupimwi kwa nguvu za silaha wala mapambano ya nje. Ushujaa halisi ni ule uwezo wa kutuliza dhoruba za ndani ya akili, kusimama imara dhidi ya unyanyapaa wa magonjwa ya akili, na kumshika mkono ndugu yako anayelelemewa na uzito wa maisha. Kwa kila mwanachama wa AfyaMind anayeamka kila alfajiri na kuchagua uponyaji, matumaini, na mshikamano kuelekea mwaka 2036—wewe ni Shujaa halisi wa Taifa letu. Heri ya Siku ya Mashujaa!”`;

  const enQuote = `“True heroism is never measured by weapons or outer warfare. Authentic heroism is the quiet courage to soothe internal tempestuous thoughts, to stand resolute against psychiatric stigma, and to lift up a brother or sister overwhelmed by life's heavy burdens. To every member of AfyaMind who rises each dawn choosing healing, mental clarity, and solidarity before 2036—you are a true Hero of our Nation. Happy Mashujaa Day!”`;

  const activeQuote = lang === 'sw' ? swQuote : enQuote;

  const handleSendNotification = async () => {
    setIsSending(true);
    const success = await notificationService.sendMashujaaDayNotification();
    setIsSending(false);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#047857', '#dc2626', '#f59e0b', '#ffffff'],
    });

    if (success) {
      setNotificationStatus('✓ Push notification & chime delivered to your phone!');
    } else {
      setNotificationStatus('✓ Notification sent! Ensure browser notifications are enabled in settings.');
    }

    setTimeout(() => setNotificationStatus(''), 5000);
  };

  const handleCopyQuote = () => {
    const textToCopy = `🇰🇪 Nukuu ya Siku ya Mashujaa 2026 kutoka kwa Nikolass Willy Mtunga (Mwanzilishi wa AfyaMind 2036):\n\n${activeQuote}\n\nJiunge na harakati za afya ya akili Kenya: ${window.location.origin}`;
    navigator.clipboard.writeText(textToCopy);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🇰🇪 Heri ya Siku ya Mashujaa 2026 kutoka AfyaMind 2036!\n\n` +
      `Falsafa ya Mwanzilishi Nikolass Willy Mtunga kwa Wanachama wote:\n\n` +
      `${activeQuote}\n\n` +
      `Soma ilani na ujiunge na mshikamano wa afya ya akili kuelekea 2036: ${window.location.origin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleClaimBadge = () => {
    setBadgeClaimed(true);
    try {
      localStorage.setItem('afyamind_mashujaa_badge_2026', 'claimed');
    } catch {}

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#047857', '#dc2626', '#f59e0b', '#000000', '#ffffff'],
    });
  };

  return (
    <div
      id="mashujaa"
      className="bg-gradient-to-br from-stone-950 via-emerald-950 to-stone-900 text-white rounded-3xl p-6 sm:p-9 shadow-xl relative overflow-hidden border-2 border-emerald-700/60 animate-fade-in"
    >
      {/* Decorative Kenyan Flag Gradient Ribbon Accent */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-black via-red-600 to-emerald-600" />
      <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top Header Badge & Date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/40 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-900/80 text-red-100 text-xs font-bold uppercase tracking-wider border border-red-700/50 shadow-xs">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              20th October • Mashujaa Day 2026
            </span>
            <span className="text-xs text-stone-300 bg-stone-800/80 px-2.5 py-1 rounded-full font-mono flex items-center gap-1 border border-stone-700/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Founder Philosophy Broadcast
            </span>
          </div>

          {/* Bilingual Switcher */}
          <div className="flex items-center gap-1 bg-stone-900/80 p-1 rounded-xl border border-stone-700/80 text-xs font-medium self-start sm:self-auto">
            <Languages className="w-3.5 h-3.5 text-stone-400 ml-1.5 mr-0.5" />
            <button
              onClick={() => setLang('sw')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                lang === 'sw'
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Kiswahili (Asili)
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                lang === 'en'
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Main Title & Proclamation */}
        <div className="space-y-2 max-w-4xl">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Ujumbe Maalum wa Siku ya Mashujaa kwa Wanachama wa AfyaMind</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white leading-snug">
            {lang === 'sw'
              ? 'Heri ya Siku ya Mashujaa: Ushujaa wa Akili na Ustahimilivu wa Jamii'
              : 'Happy Mashujaa Day: The Heroism of Mental Courage & Community Resilience'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            From founder <strong>Nikolass Willy Mtunga</strong> (Coast Region &amp; Taita Taveta) to every member, student, peer supporter, and healthcare ally standing for psychological sovereignty across all 47 counties.
          </p>
        </div>

        {/* Featured Philosophy Quote Card */}
        <div className="bg-emerald-950/60 rounded-2xl p-5 sm:p-7 border border-emerald-800/80 shadow-md relative overflow-hidden backdrop-blur-xs">
          <div className="absolute right-4 bottom-2 text-emerald-800/20 font-serif text-8xl select-none pointer-events-none">
            ”
          </div>
          <p className="font-serif italic text-base sm:text-xl text-emerald-50 leading-relaxed relative z-10">
            {activeQuote}
          </p>

          <div className="mt-4 pt-3 border-t border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-300">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                NM
              </div>
              <div>
                <span className="font-bold text-white block">Nikolass Willy Mtunga</span>
                <span className="text-[11px] text-emerald-300">
                  {lang === 'sw'
                    ? 'Mwanzilishi & Kiongozi wa Dira 2036 • Ukanda wa Pwani na Taita Taveta'
                    : 'Founder & Vision 2036 Leader • Coast Region & Taita Taveta Heritage'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyQuote}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
                title="Copy philosophy quote to clipboard"
              >
                {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-stone-300" />}
                <span>{hasCopied ? 'Imenakiliwa!' : 'Nakili Nukuu'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Pillars of Mental Heroism */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          <div className="bg-stone-900/70 p-4 rounded-xl border border-stone-800/80 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>1. Shujaa wa Nafsi</span>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              Kuvunja ukimya, kukanusha mawazo hasi ya maafa (CBT), na kutunza afya ya nafsi yako kila siku bila aibu.
            </p>
          </div>

          <div className="bg-stone-900/70 p-4 rounded-xl border border-stone-800/80 space-y-1">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
              <Heart className="w-4 h-4" />
              <span>2. Shujaa wa Jamii</span>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              Kumsikiliza jirani, rafiki, au mwanafunzi anayepitia msongo bila unyanyapaa wala hukumu mitaani kwetu.
            </p>
          </div>

          <div className="bg-stone-900/70 p-4 rounded-xl border border-stone-800/80 space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Award className="w-4 h-4" />
              <span>3. Shujaa wa Dira 2036</span>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              Kushirikiana kupunguza wagonjwa wa akili hospitalini na kujenga taifa lenye utu na amani ya kudumu.
            </p>
          </div>
        </div>

        {/* Action Controls: Send Notification, WhatsApp, Claim Badge */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          {/* Main Action: Send Notification */}
          <button
            onClick={handleSendNotification}
            disabled={isSending}
            className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-emerald-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <BellRing className="w-4 h-4 text-emerald-950 animate-bounce" />
            <span>{isSending ? 'Inatuma...' : 'Tuma Arifa ya Mashujaa kwa Simu (Send Push)'}</span>
          </button>

          {/* Share on WhatsApp */}
          <button
            onClick={handleShareWhatsApp}
            className="bg-emerald-800/80 hover:bg-emerald-700/80 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-emerald-600/50 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-emerald-300" />
            <span>Share Quote on WhatsApp</span>
          </button>

          {/* Sound Chime Only */}
          <button
            onClick={() => notificationService.playChime()}
            className="bg-stone-800/80 hover:bg-stone-700/80 text-stone-300 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border border-stone-700 transition-all cursor-pointer"
            title="Play 528Hz Solfeggio peace chime"
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span>Piga Kengele ya Amani (Chime)</span>
          </button>

          {/* Claim Mashujaa Badge */}
          <button
            onClick={handleClaimBadge}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              badgeClaimed
                ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>{badgeClaimed ? '✓ Beji ya Shujaa 2026 Imepokelewa!' : 'Pokea Beji ya Shujaa 2026'}</span>
          </button>
        </div>

        {notificationStatus && (
          <div className="bg-emerald-900/90 border border-emerald-500/60 text-emerald-200 text-xs px-4 py-2 rounded-xl font-medium animate-fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
};
