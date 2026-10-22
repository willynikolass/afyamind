/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { GuidedJournal } from './components/journal/GuidedJournal';
import { StressExercises } from './components/exercises/StressExercises';
import { MoodTracker } from './components/mood/MoodTracker';
import { CounsellorDirectory } from './components/counsellors/CounsellorDirectory';
import { PeerSupportCircles } from './components/peer/PeerSupportCircles';
import { EducationalContent } from './components/learn/EducationalContent';
import { OrganizationPackages } from './components/business/OrganizationPackages';
import { CrisisModal } from './components/CrisisModal';
import { QuickExitOverlay } from './components/QuickExitOverlay';
import { SafetyPlanModal } from './components/SafetyPlanModal';
import { PinVaultModal } from './components/PinVaultModal';
import { MpesaPaywall } from './components/payment/MpesaPaywall';
import { MpesaReceiptModal } from './components/payment/MpesaReceiptModal';
import { FounderVision2036 } from './components/founder/FounderVision2036';
import { Manifesto2036 } from './components/manifesto/Manifesto2036';
import { CommunityMemberHub } from './components/community/CommunityMemberHub';
import { FounderPayoutHub } from './components/payment/FounderPayoutHub';
import { PWAInstallBanner } from './components/pwa/PWAInstallBanner';
import { Footer } from './components/Footer';
import { MpesaPass, storage } from './utils/storage';
import { notificationService } from './utils/notificationService';
import { MoodEntry } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // M-Pesa Access Pass State
  const [activePass, setActivePass] = useState<MpesaPass | null>(() => storage.getAccessPass());
  const [isPaywallModalOpen, setIsPaywallModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Modals & Overlays
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [isSafetyPlanOpen, setIsSafetyPlanOpen] = useState(false);
  const [isQuickExitOpen, setIsQuickExitOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  // Private Vault Security State
  const [hasPinSet, setHasPinSet] = useState(() => !!storage.getVaultPin());
  const [isVaultLocked, setIsVaultLocked] = useState(() => !!storage.getVaultPin());

  // Cached summary state for dashboard
  const [recentMood, setRecentMood] = useState<MoodEntry | null>(() => {
    const moods = storage.getMoods();
    return moods.length ? moods[0] : null;
  });
  const [totalJournals, setTotalJournals] = useState<number>(() => storage.getJournals().length);

  // Keyboard shortcut listener for Quick Disguise (Esc key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Toggle Quick Exit disguise overlay
        setIsQuickExitOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Background Push Notification Scheduler check interval
  useEffect(() => {
    notificationService.checkDueReminders();
    const interval = setInterval(() => {
      notificationService.checkDueReminders();
    }, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const refreshSummaryStats = () => {
    const moods = storage.getMoods();
    setRecentMood(moods.length ? moods[0] : null);
    setTotalJournals(storage.getJournals().length);
    setHasPinSet(!!storage.getVaultPin());
    setActivePass(storage.getAccessPass());
  };

  const handleUnlockSuccess = (pass: MpesaPass) => {
    setActivePass(pass);
    setIsPaywallModalOpen(false);
  };

  const handleRelockApp = () => {
    storage.revokeAccessPass();
    setActivePass(null);
  };

  // Determine if active tab is restricted by the M-Pesa paywall
  // Overview, Exercises, and Educational Screener/Crisis remain viewable for ethical safety
  const isFeatureLocked =
    !activePass?.isUnlocked &&
    (activeTab === 'journal' ||
      activeTab === 'mood' ||
      activeTab === 'counsellors' ||
      activeTab === 'peer');

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Mobile/Desktop Install Ribbon & Store Modal */}
      <PWAInstallBanner
        isOpenModalExternal={isInstallModalOpen}
        onCloseModalExternal={() => setIsInstallModalOpen(false)}
      />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          refreshSummaryStats();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCrisis={() => setIsCrisisOpen(true)}
        onTriggerQuickExit={() => setIsQuickExitOpen(true)}
        onToggleVaultModal={() => setIsVaultModalOpen(true)}
        isVaultLocked={isVaultLocked}
        hasPinSet={hasPinSet}
        activePass={activePass}
        onOpenPaywall={() => setIsPaywallModalOpen(true)}
        onOpenReceipt={() => setIsReceiptModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenPayoutHub={() => setIsPayoutModalOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* If user navigates to a locked feature without M-PESA pass */}
        {isFeatureLocked ? (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Member Feature Protected
              </span>
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                Unlock This Feature via M-PESA
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                To access private guided journaling, live peer support circles, counsellor bookings, and comprehensive mood logs, please activate an AfyaMind pass linked to Safaricom number{' '}
                <strong className="text-stone-900 font-mono">+254746867552</strong>.
              </p>
            </div>

            <MpesaPaywall
              onUnlockSuccess={handleUnlockSuccess}
              onOpenCrisis={() => setIsCrisisOpen(true)}
              onOpenSafetyPlan={() => setIsSafetyPlanOpen(true)}
              activePass={activePass}
            />
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <OverviewDashboard
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  refreshSummaryStats();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenCrisis={() => setIsCrisisOpen(true)}
                onOpenSafetyPlan={() => setIsSafetyPlanOpen(true)}
                onOpenPaywall={() => setIsPaywallModalOpen(true)}
                onOpenInstallModal={() => setIsInstallModalOpen(true)}
                onOpenPayoutHub={() => {
                  setActiveTab('payout');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                activePass={activePass}
                recentMood={recentMood}
                totalJournals={totalJournals}
              />
            )}

            {activeTab === 'payout' && (
              <FounderPayoutHub
                isModal={false}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  refreshSummaryStats();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'manifesto' && (
              <Manifesto2036
                onOpenPaywall={() => setIsPaywallModalOpen(true)}
                onOpenCrisis={() => setIsCrisisOpen(true)}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  refreshSummaryStats();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'community' && (
              <CommunityMemberHub
                onNavigateToTab={(tab) => {
                  setActiveTab(tab);
                  refreshSummaryStats();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'vision2036' && (
              <FounderVision2036
                onOpenPaywall={() => setIsPaywallModalOpen(true)}
                onOpenCrisis={() => setIsCrisisOpen(true)}
                onOpenInstallModal={() => setIsInstallModalOpen(true)}
              />
            )}

            {activeTab === 'journal' && (
              <GuidedJournal
                isVaultLocked={isVaultLocked}
                onOpenVaultModal={() => setIsVaultModalOpen(true)}
              />
            )}

            {activeTab === 'exercises' && <StressExercises />}

            {activeTab === 'mood' && <MoodTracker />}

            {activeTab === 'counsellors' && <CounsellorDirectory />}

            {activeTab === 'peer' && <PeerSupportCircles />}

            {activeTab === 'learn' && (
              <EducationalContent
                onOpenCrisis={() => setIsCrisisOpen(true)}
                onOpenBreathing={() => {
                  setActiveTab('exercises');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'organizations' && <OrganizationPackages />}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenCrisis={() => setIsCrisisOpen(true)}
        onOpenSafetyPlan={() => setIsSafetyPlanOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onDataCleared={() => {
          refreshSummaryStats();
          setActiveTab('dashboard');
        }}
      />

      {/* Global Modals & Overlays */}
      <CrisisModal
        isOpen={isCrisisOpen}
        onClose={() => setIsCrisisOpen(false)}
        onOpenSafetyPlan={() => {
          setIsCrisisOpen(false);
          setIsSafetyPlanOpen(true);
        }}
        onOpenBreathing={() => {
          setIsCrisisOpen(false);
          setActiveTab('exercises');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <QuickExitOverlay
        isOpen={isQuickExitOpen}
        onExitDisguise={() => setIsQuickExitOpen(false)}
      />

      <SafetyPlanModal
        isOpen={isSafetyPlanOpen}
        onClose={() => setIsSafetyPlanOpen(false)}
      />

      <PinVaultModal
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        isLocked={isVaultLocked}
        hasPin={hasPinSet}
        onUnlocked={() => setIsVaultLocked(false)}
        onPinChanged={() => {
          setHasPinSet(!!storage.getVaultPin());
          setIsVaultLocked(!!storage.getVaultPin());
        }}
      />

      {/* M-PESA Paywall Modal */}
      {isPaywallModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="my-auto w-full max-w-4xl">
            <MpesaPaywall
              onUnlockSuccess={handleUnlockSuccess}
              onOpenCrisis={() => {
                setIsPaywallModalOpen(false);
                setIsCrisisOpen(true);
              }}
              onOpenSafetyPlan={() => {
                setIsPaywallModalOpen(false);
                setIsSafetyPlanOpen(true);
              }}
              activePass={activePass}
              isModalMode={true}
              onClose={() => setIsPaywallModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* M-PESA Receipt / Member Modal */}
      <MpesaReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        pass={activePass}
        onRelock={handleRelockApp}
      />

      {/* Founder Payout & Cash Withdrawal Hub Modal */}
      {isPayoutModalOpen && (
        <div
          onClick={() => setIsPayoutModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-sm overflow-y-auto animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="my-auto w-full max-w-4xl"
          >
            <FounderPayoutHub
              isModal={true}
              onClose={() => setIsPayoutModalOpen(false)}
              onNavigate={(tab) => {
                setIsPayoutModalOpen(false);
                setActiveTab(tab);
                refreshSummaryStats();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
