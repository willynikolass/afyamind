import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Share,
  PlusSquare,
  CheckCircle2,
  X,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  Globe,
  Layers,
  QrCode,
  Copy,
  Check,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import QRCode from 'qrcode';
import { usePWAInstall } from '../../utils/usePWAInstall';

interface PWAInstallBannerProps {
  onOpenStoreModal?: () => void;
  isOpenModalExternal?: boolean;
  onCloseModalExternal?: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  isOpenModalExternal,
  onCloseModalExternal,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [internalOpenModal, setInternalOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'link-vs-app' | 'google-play' | 'search'>('install');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  const isModalOpen = isOpenModalExternal !== undefined ? isOpenModalExternal : internalOpenModal;
  const setModalOpen = (open: boolean) => {
    if (onCloseModalExternal && !open) {
      onCloseModalExternal();
    }
    setInternalOpenModal(open);
  };

  useEffect(() => {
    // Generate QR code of current app origin for instant phone scanning
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://afyamind2036.co.ke';
    QRCode.toDataURL(currentUrl, {
      width: 260,
      margin: 1.5,
      color: {
        dark: '#064e3b',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🧠 AfyaMind 2036 — Kenya's Mental Health Initiative\n` +
      `Founded by Nikolass Willy Mtunga (Coast Region & Taita Taveta) to reduce psychiatric patient hospitalizations before 2036.\n\n` +
      `Download & install the app directly on your phone: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      {/* Top Banner Ribbon (Hidden if app is already running as installed standalone app) */}
      {!isInstalled && (
        <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-teal-950 text-white px-4 py-2 border-b border-emerald-800/80 text-xs shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <span className="p-1 rounded-lg bg-emerald-600 text-white shadow-xs">
                <Smartphone className="w-4 h-4" />
              </span>
              <div>
                <span className="font-bold text-emerald-200">
                  Install AfyaMind 2036 App on Your Phone
                </span>
                <span className="hidden md:inline text-stone-300 ml-1.5">
                  — Runs as a real standalone app with its own icon (no browser address bar).
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isInstallable ? 'Install Now (One-Tap)' : 'Download / Install App'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('google-play');
                  setModalOpen(true);
                }}
                className="text-stone-300 hover:text-white underline text-[11px] px-1.5 cursor-pointer font-medium"
              >
                Play Store & Search Help
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Installation, Discovery & Store Publishing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700/90 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-sm">
                  🧠
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-lg text-white">
                      AfyaMind 2036 Official App
                    </h3>
                    <span className="text-[10px] font-bold bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30">
                      PWA Native
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200/90 mt-0.5">
                    Founded by Nikolass Willy Mtunga • Mobile Application & Discovery
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-300 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="flex border-b border-stone-200 bg-stone-50 px-4 pt-2 gap-1 sm:gap-2 text-xs font-semibold overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('install')}
                className={`pb-2.5 px-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === 'install'
                    ? 'border-emerald-700 text-emerald-800 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                📲 1. Download to Phone
              </button>

              <button
                onClick={() => setActiveTab('link-vs-app')}
                className={`pb-2.5 px-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === 'link-vs-app'
                    ? 'border-emerald-700 text-emerald-800 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                🔗 Why Link vs App?
              </button>

              <button
                onClick={() => setActiveTab('google-play')}
                className={`pb-2.5 px-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === 'google-play'
                    ? 'border-emerald-700 text-emerald-800 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                📦 Google Play & APK
              </button>

              <button
                onClick={() => setActiveTab('search')}
                className={`pb-2.5 px-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === 'search'
                    ? 'border-emerald-700 text-emerald-800 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                🔍 Search Without Link
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-stone-700 flex-1">
              {/* Tab 1: Instant Phone Download & Installation */}
              {activeTab === 'install' && (
                <div className="space-y-4">
                  {/* One-Tap Prompt if browser supports BeforeInstallPrompt */}
                  {isInstallable && (
                    <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="space-y-1 text-center sm:text-left">
                        <span className="font-bold text-emerald-950 text-sm block">
                          Instant One-Tap Install Ready!
                        </span>
                        <p className="text-stone-600 text-xs">
                          Your device is fully compatible. Tap below to download the AfyaMind 2036 app icon directly onto your phone screen.
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          await install();
                          setModalOpen(false);
                        }}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Download className="w-4 h-4" />
                        <span>Install App Now</span>
                      </button>
                    </div>
                  )}

                  {/* QR Code and Quick Share */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <div className="text-center sm:text-left space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
                        Scan with Any Mobile Camera
                      </span>
                      <h4 className="font-serif font-bold text-base text-stone-900">
                        Scan to Install on Your Phone
                      </h4>
                      <p className="text-stone-600 text-xs leading-relaxed">
                        Open your iPhone or Android camera and point it at this QR code. It will instantly launch the AfyaMind 2036 app download flow!
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
                        <button
                          onClick={handleCopyLink}
                          className="bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                          <span>{copiedLink ? 'Link Copied!' : 'Copy Direct Link'}</span>
                        </button>

                        <button
                          onClick={handleShareWhatsApp}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Share on WhatsApp</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
                      {qrCodeDataUrl ? (
                        <img
                          src={qrCodeDataUrl}
                          alt="AfyaMind 2036 QR Code for Mobile App Download"
                          className="w-44 h-44 object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-44 h-44 bg-stone-100 animate-pulse rounded-lg flex items-center justify-center text-stone-400">
                          <QrCode className="w-10 h-10" />
                        </div>
                      )}
                      <span className="text-[10px] text-stone-500 font-medium mt-1">
                        Point phone camera to install
                      </span>
                    </div>
                  </div>

                  {/* Manual 10-Second Instructions for Android & iPhone */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-stone-900 text-sm">
                      How to add to your phone home screen in 2 taps:
                    </h4>

                    {/* Android */}
                    <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-1.5 shadow-2xs">
                      <div className="flex items-center gap-2 font-bold text-stone-900">
                        <span className="text-base">🤖</span>
                        <span>For Android (Google Chrome / Samsung Internet / Opera):</span>
                      </div>
                      <ol className="space-y-1 text-stone-600 list-decimal list-inside pl-1 text-[11px] leading-relaxed">
                        <li>Tap the <strong>three dots (⋮)</strong> at the top right of the browser.</li>
                        <li>Tap <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</li>
                        <li>Tap <strong>"Install"</strong>. AfyaMind 2036 icon appears on your phone screen!</li>
                      </ol>
                    </div>

                    {/* iPhone / Safari */}
                    <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-1.5 shadow-2xs">
                      <div className="flex items-center gap-2 font-bold text-stone-900">
                        <span className="text-base">🍏</span>
                        <span>For iPhone & iPad (Safari):</span>
                      </div>
                      <ol className="space-y-1 text-stone-600 list-decimal list-inside pl-1 text-[11px] leading-relaxed">
                        <li>Tap the <strong>Share button</strong> <Share className="w-3 h-3 inline text-blue-600" /> at the bottom of Safari.</li>
                        <li>Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3 h-3 inline text-stone-700" />.</li>
                        <li>Tap <strong>"Add"</strong> in the top-right corner. It installs right next to WhatsApp!</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Why it appeared like a link vs an app */}
              {activeTab === 'link-vs-app' && (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                    <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <span>Why did it open as a link instead of an app?</span>
                    </h4>
                    <p className="text-stone-700 leading-relaxed text-xs">
                      When someone sends you a website link or you click a shared URL, every phone opens it inside <strong>Chrome or Safari browser</strong> by default. This makes it look like a webpage with a search bar, back/forward buttons, and URL tabs.
                    </p>
                    <p className="text-stone-700 leading-relaxed text-xs">
                      However, <strong>AfyaMind 2036 is programmed as a certified Progressive Web App (PWA)</strong>. As soon as you tap <em>"Add to Home screen"</em> or <em>"Install"</em>:
                    </p>
                    <ul className="space-y-1.5 pt-1 text-xs text-stone-800">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>The browser address bar, navigation arrows, and tabs <strong>disappear completely</strong>.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>It receives the official <strong>green AfyaMind 2036 icon</strong> on your phone screen alongside native apps.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>It opens instantly with splash screen and <strong>works offline without internet</strong> thanks to cached service workers!</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2 text-stone-700">
                    <span className="font-bold text-stone-900 block text-xs">
                      Comparison: Link vs Installed App
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                        <span className="font-bold text-stone-600 block">🌐 Web Browser Link</span>
                        <p className="text-stone-500">Shows URL address bar, requires browser tab, easy to accidentally close.</p>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 space-y-1">
                        <span className="font-bold text-emerald-900 block">📱 Installed AfyaMind App</span>
                        <p className="text-emerald-800">Full-screen native view, dedicated app icon, offline access, fast launch.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Google Play Store & APK Submission */}
              {activeTab === 'google-play' && (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-stone-800">
                    <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                      <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Why doesn't it appear in the Play Store search bar right away?</span>
                    </div>
                    <p className="leading-relaxed">
                      To appear inside the official <strong>Google Play Store search bar</strong> when someone types <em>"AfyaMind 2036"</em>, Google requires you to upload an <code>.aab</code> (Android App Bundle) or <code>.apk</code> to a <strong>Google Play Console Developer Account</strong>.
                    </p>
                    <p className="leading-relaxed font-medium text-emerald-900">
                      Great news: AfyaMind 2036 already has 100% of the code, icons, manifest, and service worker needed for Google Play Store! You can generate the official Google Play file in 60 seconds for free:
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="font-bold text-stone-900 text-sm">
                      3 Steps to Publish AfyaMind 2036 on Google Play Store:
                    </h4>

                    {/* Step 1 */}
                    <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-stone-900">Step 1: Open PWABuilder (Google & Microsoft Tool)</strong>
                        <a
                          href="https://www.pwabuilder.com/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 underline font-bold flex items-center gap-1 text-[11px]"
                        >
                          <span>PWABuilder.com</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-stone-500 text-[11px]">
                        Visit PWABuilder.com and paste your app address ({typeof window !== 'undefined' ? window.location.origin : 'your URL'}). It tests your manifest and scores 100/100 PWA criteria!
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                      <strong className="text-stone-900 block">Step 2: Click "Package for Android / Google Play"</strong>
                      <p className="text-stone-500 text-[11px]">
                        Click "Generate Package". It generates the signed Android <code>.aab</code> bundle with Package ID <code>org.afyamind2036.app</code>, founder name <strong>Nikolass Willy Mtunga</strong>, and the official app icon.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                      <strong className="text-stone-900 block">Step 3: Upload to Google Play Console</strong>
                      <p className="text-stone-500 text-[11px]">
                        Sign in to <a href="https://play.google.com/console" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">play.google.com/console</a>, create an app called <strong>"AfyaMind 2036"</strong>, and upload the file. Once approved by Google, anyone can search and install it directly from the Play Store!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Search Engine Indexing (Google Search without link) */}
              {activeTab === 'search' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2 text-stone-800">
                    <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                      <Search className="w-4 h-4 text-blue-700 shrink-0" />
                      <span>How to make AfyaMind 2036 appear on Google Search</span>
                    </div>
                    <p className="leading-relaxed">
                      To appear on Google Search when someone types <em>"AfyaMind 2036 Nikolass Willy Mtunga"</em>, Google needs to index the domain.
                    </p>
                    <p className="leading-relaxed">
                      We have already embedded all <strong>SEO structured tags, Schema.org JSON-LD (SoftwareApplication & Person), sitemap.xml, and robots.txt</strong> into the app!
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="font-bold text-stone-900 text-sm">
                      Keywords Already Embedded into Your Code for Google:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'AfyaMind 2036',
                        'Nikolass Willy Mtunga',
                        'Coast Region Kenya Mental Health',
                        'Taita Taveta mental wellness',
                        'Reduce psychiatric patient admissions 2036',
                        'Kenya Peer Support App',
                        'M-Pesa Therapy Kenya +254746867552',
                        'CBT Journaling Nairobi Mombasa',
                      ].map((kw, i) => (
                        <span key={i} className="bg-stone-100 border border-stone-200 text-stone-700 px-2.5 py-1 rounded-md text-[11px]">
                          {kw}
                        </span>
                      ))}
                    </div>

                    <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5">
                      <span className="font-bold text-stone-900 block text-xs">
                        Pro-Tip: Submit to Google Search Console
                      </span>
                      <p className="text-stone-500 text-[11px] leading-relaxed">
                        To speed up Google search ranking, go to <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">Google Search Console</a>, enter your link, and click <strong>"Request Indexing"</strong>. Within days, searching "AfyaMind 2036" on Google will bring up your app!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2 text-stone-500 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>AfyaMind 2036 • Verified PWA Architecture</span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
              >
                Close & Return to App
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
