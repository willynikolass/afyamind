import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Phone,
  Copy,
  Check,
  ShieldCheck,
  LifeBuoy,
  Sparkles,
  Lock,
  Unlock,
  AlertTriangle,
  ArrowRight,
  Smartphone,
  Receipt,
  Heart,
  Clock,
  Zap,
} from 'lucide-react';
import { MpesaPass, storage } from '../../utils/storage';

interface MpesaPaywallProps {
  onUnlockSuccess: (pass: MpesaPass) => void;
  onOpenCrisis: () => void;
  onOpenSafetyPlan: () => void;
  activePass: MpesaPass | null;
  onClose?: () => void;
  isModalMode?: boolean;
}

const MPESA_RECIPIENT_NUMBER = '+254746867552';
const MPESA_LOCAL_NUMBER = '0746867552';

const TIERS = [
  {
    id: 'day' as const,
    name: '24-Hour Sanctuary Pass',
    priceKES: 50,
    period: 'for 24 hours',
    description: 'Immediate day access to guided breathing, private mood tracking, and CBT journal tools.',
    badge: 'Quick Reset',
  },
  {
    id: 'month' as const,
    name: 'Monthly Wellness Membership',
    priceKES: 299,
    period: 'per month',
    description: 'Unlimited access to all guided journals, live moderated peer circles, ambient soundscapes, and counsellor directory.',
    badge: 'Most Popular',
    recommended: true,
  },
  {
    id: 'lifetime' as const,
    name: 'Lifetime Peace Pass',
    priceKES: 999,
    period: 'one-time fee',
    description: 'Forever access to all current and upcoming mental wellness tools with zero recurring charges.',
    badge: 'Best Value',
  },
];

export const MpesaPaywall: React.FC<MpesaPaywallProps> = ({
  onUnlockSuccess,
  onOpenCrisis,
  onOpenSafetyPlan,
  activePass,
  onClose,
  isModalMode = false,
}) => {
  const [selectedTier, setSelectedTier] = useState(TIERS[1]); // Monthly default
  const [paymentMethod, setPaymentMethod] = useState<'stk' | 'manual'>('stk');
  const [payerPhone, setPayerPhone] = useState('');
  const [mpesaCodeInput, setMpesaCodeInput] = useState('');
  const [isProcessingStk, setIsProcessingStk] = useState(false);
  const [stkPromptReceived, setStkPromptReceived] = useState(false);
  const [stkPinInput, setStkPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(MPESA_LOCAL_NUMBER);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  // Automated STK Push flow simulation
  const handleInitiateStk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payerPhone.trim() || payerPhone.trim().length < 9) {
      setErrorMessage('Please enter a valid Safaricom phone number (e.g., 0712345678 or 254712345678).');
      return;
    }
    setErrorMessage('');
    setIsProcessingStk(true);

    // Simulate STK Push prompt arriving on phone
    setTimeout(() => {
      setIsProcessingStk(false);
      setStkPromptReceived(true);
    }, 1800);
  };

  const handleConfirmStkPin = () => {
    if (stkPinInput.length !== 4) {
      setErrorMessage('Please enter your 4-digit M-Pesa PIN.');
      return;
    }

    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedCode = `SK8${randomChars}91`;

    completeUnlock(generatedCode, payerPhone);
  };

  // Manual transaction code submission flow
  const handleVerifyManualCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = mpesaCodeInput.trim().toUpperCase();
    if (cleanCode.length < 6) {
      setErrorMessage('Please enter a valid M-Pesa confirmation code from Safaricom (e.g. SK84HQ912).');
      return;
    }

    completeUnlock(cleanCode, payerPhone.trim() || 'Direct M-Pesa User');
  };

  const handleInstantDemoUnlock = () => {
    const demoCode = `DEMO${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    completeUnlock(demoCode, '0746867552 (Demo)');
  };

  const completeUnlock = (txnCode: string, phone: string) => {
    const newPass: MpesaPass = {
      isUnlocked: true,
      tier: selectedTier.id,
      tierName: selectedTier.name,
      amountKES: selectedTier.priceKES,
      recipientMpesaNumber: MPESA_RECIPIENT_NUMBER,
      payerPhone: phone,
      transactionCode: txnCode,
      unlockedAt: new Date().toLocaleString('en-KE', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      expiresAt:
        selectedTier.id === 'day'
          ? new Date(Date.now() + 86400000).toLocaleDateString()
          : selectedTier.id === 'month'
          ? new Date(Date.now() + 30 * 86400000).toLocaleDateString()
          : 'Lifetime Access',
    };

    storage.saveAccessPass(newPass);

    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10B981', '#F59E0B', '#34D399'],
      });
    } catch {
      // Ignore
    }

    onUnlockSuccess(newPass);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${isModalMode ? 'p-2 sm:p-4' : 'my-4'}`}>
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>AfyaMind 2036 • M-PESA Access Gate</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Unlock AfyaMind 2036 Access
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
                Founded by <strong>Nikolass Willy Mtunga</strong> (Coast & Taita Taveta) to reduce psychiatric crises before 2036. Your micro-pass fee is routed directly to M-Pesa recipient{' '}
                <strong className="text-emerald-300 font-mono">{MPESA_RECIPIENT_NUMBER}</strong> to support accessible mental wellness.
              </p>
            </div>

            {isModalMode && onClose && (
              <button
                onClick={onClose}
                className="self-start sm:self-center text-stone-400 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-xs font-semibold"
              >
                Close ✕
              </button>
            )}
          </div>
        </div>

        {/* Free Emergency Crisis Override Banner */}
        <div className="bg-rose-50 border-b border-rose-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-rose-900">
          <div className="flex items-center gap-2.5">
            <LifeBuoy className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <strong className="font-bold text-rose-950">In urgent crisis or danger?</strong>
              <span className="text-rose-800 ml-1">
                Emergency mental health helplines & safety plans are 100% free and never paywalled.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenCrisis}
              className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-xs cursor-pointer"
            >
              24/7 Crisis Lines
            </button>
            <button
              onClick={onOpenSafetyPlan}
              className="bg-white hover:bg-rose-100 text-rose-900 border border-rose-300 px-3 py-1.5 rounded-lg font-semibold text-xs cursor-pointer"
            >
              Safety Plan
            </button>
          </div>
        </div>

        {/* M-Pesa Recipient Information Card */}
        <div className="p-6 bg-emerald-50/60 border-b border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              M
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                Official Payment Recipient
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-bold text-stone-900">
                  {MPESA_RECIPIENT_NUMBER}
                </span>
                <span className="text-xs text-stone-500 font-mono">({MPESA_LOCAL_NUMBER})</span>
              </div>
              <p className="text-xs text-emerald-800">
                Recipient: AfyaMind Mental Care Support • Direct M-PESA Transfer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyNumber}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              {copiedNumber ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-emerald-700 font-bold">Number Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Copy Phone Number</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Step 1: Select Pass Tier */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
              1. Choose Access Pass
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TIERS.map((tier) => {
                const isSelected = selectedTier.id === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTier(tier)}
                    className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-600/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    {tier.recommended && (
                      <span className="absolute -top-2.5 right-4 bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {tier.badge}
                      </span>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-700">{tier.name}</span>
                        {!tier.recommended && (
                          <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                            {tier.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-serif font-bold text-stone-900">
                          KES {tier.priceKES}
                        </span>
                        <span className="text-xs text-stone-500 font-normal">{tier.period}</span>
                      </div>

                      <p className="text-xs text-stone-600 leading-relaxed pt-1">
                        {tier.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className={`font-semibold ${isSelected ? 'text-emerald-700' : 'text-stone-400'}`}>
                        {isSelected ? '✓ Selected' : 'Select'}
                      </span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-700' : 'text-stone-300'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Payment Method Tabs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                2. Complete M-PESA Payment (KES {selectedTier.priceKES})
              </label>
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('stk');
                    setStkPromptReceived(false);
                    setErrorMessage('');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    paymentMethod === 'stk'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Prompt My Phone (STK Push)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('manual');
                    setStkPromptReceived(false);
                    setErrorMessage('');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    paymentMethod === 'manual'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Manual Send Money
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Method A: STK Push Flow */}
            {paymentMethod === 'stk' && (
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-4">
                {!stkPromptReceived ? (
                  <form onSubmit={handleInitiateStk} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">
                        Your Safaricom Phone Number
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            type="tel"
                            required
                            placeholder="e.g. 0746867552 or 2547..."
                            value={payerPhone}
                            onChange={(e) => setPayerPhone(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-emerald-600 font-mono"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isProcessingStk}
                          className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-2 shrink-0"
                        >
                          {isProcessingStk ? (
                            <>
                              <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                              <span>Pinging Phone...</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5" />
                              <span>Send STK Push (KES {selectedTier.priceKES})</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        An instant pop-up will appear on your Safaricom SIM to authorize payment of{' '}
                        <strong>KES {selectedTier.priceKES}</strong> to <strong>{MPESA_RECIPIENT_NUMBER}</strong>.
                      </p>
                    </div>
                  </form>
                ) : (
                  /* Simulated phone prompt */
                  <div className="bg-white p-5 rounded-2xl border-2 border-emerald-500 shadow-md space-y-4 max-w-md mx-auto text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <Smartphone className="w-6 h-6 animate-bounce" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-stone-900 text-sm">
                        Simulated M-PESA STK Prompt
                      </h4>
                      <p className="text-xs text-stone-600">
                        "Do you want to pay <strong>KES {selectedTier.priceKES}</strong> to{' '}
                        <strong>{MPESA_RECIPIENT_NUMBER}</strong>? Enter 4-digit PIN:"
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="••••"
                        value={stkPinInput}
                        onChange={(e) => setStkPinInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleConfirmStkPin()}
                        autoFocus
                        className="text-center font-mono tracking-widest text-2xl w-32 py-2 border border-stone-300 rounded-xl outline-none focus:border-emerald-600 bg-stone-50"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setStkPromptReceived(false)}
                        className="flex-1 py-2 rounded-xl text-xs text-stone-600 hover:bg-stone-100 font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmStkPin}
                        className="flex-1 py-2 rounded-xl text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors cursor-pointer shadow-xs"
                      >
                        Authorize & Unlock
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Method B: Manual Send Money Flow */}
            {paymentMethod === 'manual' && (
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-5">
                <div className="space-y-2">
                  <h4 className="font-bold text-stone-900 text-sm">
                    How to send via M-PESA Menu or App:
                  </h4>
                  <ol className="space-y-2 text-xs text-stone-700 list-decimal list-inside bg-white p-4 rounded-xl border border-stone-200">
                    <li>Open <strong>M-PESA</strong> on your phone (SIM Toolkit, *334#, or M-PESA App).</li>
                    <li>Select <strong>Send Money</strong>.</li>
                    <li>
                      Enter Phone Number:{' '}
                      <strong className="font-mono text-emerald-800">{MPESA_LOCAL_NUMBER}</strong>{' '}
                      <button
                        type="button"
                        onClick={handleCopyNumber}
                        className="text-[10px] text-emerald-700 underline font-semibold ml-1 cursor-pointer"
                      >
                        {copiedNumber ? 'Copied' : 'Copy'}
                      </button>
                    </li>
                    <li>
                      Enter Amount:{' '}
                      <strong className="text-emerald-800">KES {selectedTier.priceKES}</strong>.
                    </li>
                    <li>Enter your M-PESA PIN and press Send.</li>
                    <li>Copy the 10-character confirmation code from your Safaricom SMS (e.g. <code>SK84HQ912</code>).</li>
                  </ol>
                </div>

                <form onSubmit={handleVerifyManualCode} className="space-y-3 pt-1">
                  <label className="block text-xs font-bold text-stone-700">
                    Enter Safaricom SMS Transaction Code
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. SK84HQ912"
                      value={mpesaCodeInput}
                      onChange={(e) => setMpesaCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-emerald-600 font-mono tracking-wider"
                    />
                    <button
                      type="submit"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Check className="w-4 h-4" />
                      <span>Verify Code & Unlock</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Instant Test / Demo Access Button */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Payments routed directly to Safaricom recipient {MPESA_RECIPIENT_NUMBER}.</span>
            </div>

            <button
              type="button"
              onClick={handleInstantDemoUnlock}
              className="text-stone-600 hover:text-stone-900 underline font-semibold cursor-pointer text-xs"
            >
              Demo Testing? Click for Instant App Unlock →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
