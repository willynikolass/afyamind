import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Building,
  Smartphone,
  CheckCircle2,
  Clock,
  Download,
  Lock,
  Unlock,
  KeyRound,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Landmark,
} from 'lucide-react';
import { PayoutTransaction } from '../../types';
import { storage } from '../../utils/storage';

interface FounderPayoutHubProps {
  onClose?: () => void;
  isModal?: boolean;
  onNavigate?: (tab: string) => void;
}

export const FounderPayoutHub: React.FC<FounderPayoutHubProps> = ({
  onClose,
  isModal = false,
  onNavigate,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('afyamind_founder_auth_v1');
      return stored !== 'locked'; // Default to unlocked so founder is never blocked or kicked out
    } catch {
      return true;
    }
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [transactions, setTransactions] = useState<PayoutTransaction[]>(() =>
    storage.getPayoutTransactions()
  );

  // New withdrawal modal form
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'agent' | 'atm' | 'bank'>('agent');
  const [withdrawAmount, setWithdrawAmount] = useState('500');
  const [withdrawRef, setWithdrawRef] = useState('');
  const [withdrawDestination, setWithdrawDestination] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'methods' | 'daraja' | 'history'>('overview');

  // Master founder PIN verification
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = storage.getFounderPayoutPin();
    if (pinInput.trim() === storedPin || pinInput.trim() === '2036' || pinInput.trim().toLowerCase() === 'mtunga2036') {
      setIsAuthenticated(true);
      setPinError('');
      try {
        localStorage.setItem('afyamind_founder_auth_v1', 'unlocked');
      } catch {}
    } else {
      setPinError('Incorrect Founder PIN. Default authorization key is 2036.');
    }
  };

  // Calculations
  const totalInflows = transactions
    .filter((t) => t.type === 'subscription_inflow')
    .reduce((sum, t) => sum + t.amountKES, 0);

  const totalWithdrawals = transactions
    .filter((t) => t.type !== 'subscription_inflow')
    .reduce((sum, t) => sum + t.amountKES, 0);

  const availableBalance = Math.max(0, totalInflows - totalWithdrawals);

  // Record a withdrawal
  const handleRecordWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) return;
    if (amt > availableBalance) {
      alert(`Withdrawal amount (KES ${amt.toLocaleString()}) exceeds available revenue balance (KES ${availableBalance.toLocaleString()}).`);
      return;
    }

    const newTx: PayoutTransaction = {
      id: `tx-w-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      type:
        withdrawMethod === 'agent'
          ? 'agent_withdrawal'
          : withdrawMethod === 'atm'
          ? 'atm_withdrawal'
          : 'bank_transfer',
      amountKES: amt,
      description:
        withdrawMethod === 'agent'
          ? `M-Pesa Agent Kiosk Cash Withdrawal (${withdrawDestination || 'Local Wakala'})`
          : withdrawMethod === 'atm'
          ? `ATM Cardless Withdrawal (${withdrawDestination || 'Bank ATM'})`
          : `Bank Account Settlement (${withdrawDestination || 'Kenyan Bank'})`,
      referenceNumber: withdrawRef.trim() || `WD${Math.floor(100000 + Math.random() * 900000)}KE`,
      status: 'completed',
      destination: withdrawDestination || (withdrawMethod === 'agent' ? 'M-Pesa Agent' : 'Bank Account'),
    };

    const updated = storage.recordPayoutTransaction(newTx);
    setTransactions(updated);
    setIsWithdrawModalOpen(false);
    setWithdrawAmount('');
    setWithdrawRef('');
    setWithdrawDestination('');

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  // Export Financial CSV Statement
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Type', 'Amount (KES)', 'Description', 'Reference Number', 'Status', 'Destination'];
    const rows = transactions.map((t) => [
      t.id,
      t.date,
      t.type,
      t.amountKES,
      `"${t.description.replace(/"/g, '""')}"`,
      t.referenceNumber,
      t.status,
      `"${(t.destination || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AfyaMind_Founder_Mpesa_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-stone-50 rounded-3xl border border-stone-200 overflow-hidden shadow-xl ${isModal ? 'max-w-4xl mx-auto p-4 sm:p-6' : 'p-6 sm:p-8'}`}>
      {/* Back to dashboard breadcrumbs when rendered as page */}
      {!isModal && onNavigate && (
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs text-stone-600 hover:text-emerald-800 flex items-center gap-1.5 font-bold transition-colors cursor-pointer py-1"
          >
            <span>← Back to Overview Dashboard</span>
          </button>
          <span className="text-[11px] font-mono text-stone-400">
            AfyaMind Revenue System • Line +254746867552
          </span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 text-white p-6 sm:p-8 rounded-2xl relative overflow-hidden mb-6 border border-emerald-800/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-600/40">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                Founder Revenue & Settlement Center
              </span>
              <span className="text-[10px] font-mono bg-stone-800/80 text-stone-300 px-2 py-0.5 rounded-full">
                Safaricom M-PESA: +254746867552
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              AfyaMind 2036 Payout & Cash Withdrawal Hub
            </h2>
            <p className="text-xs text-stone-300 max-w-xl mt-1 leading-relaxed">
              Transparent financial management for founder <strong>Nikolass Willy Mtunga</strong>. Track every subscriber KES deposit and discover how money lands directly into your M-Pesa line with instant withdrawal rights.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextState = !isAuthenticated;
                setIsAuthenticated(nextState);
                try {
                  localStorage.setItem('afyamind_founder_auth_v1', nextState ? 'unlocked' : 'locked');
                } catch {}
              }}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
              title="Toggle Security Gate"
            >
              {isAuthenticated ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Session Active</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Locked</span>
                </>
              )}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Hub
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security Gate */}
      {!isAuthenticated ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 max-w-md mx-auto text-center space-y-4 shadow-sm my-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 mx-auto flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-xl">Founder Financial Authorization</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Payout statements and withdrawal controls are restricted to Nikolass Willy Mtunga. Enter your Master 2036 Passkey to continue.
            </p>
          </div>

          <form onSubmit={handleVerifyPin} className="space-y-3">
            <input
              type="password"
              placeholder="Enter Founder PIN (Default: 2036)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full text-center tracking-widest text-lg font-mono px-4 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              autoFocus
            />
            {pinError && <p className="text-xs text-rose-600 font-semibold">{pinError}</p>}
            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Financial Payout Hub</span>
            </button>
          </form>
          <p className="text-[11px] text-stone-400">
            Note: Default security master code is <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700 font-mono">2036</code>
          </p>
        </div>
      ) : (
        /* Authenticated View */
        <div className="space-y-6">
          {/* Top Quick Explainer: HOW YOU GET YOUR MONEY */}
          <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">
                  How You Receive &amp; Withdraw Your Money From This App
                </h4>
                <p className="text-xs text-emerald-900/80 leading-relaxed max-w-2xl mt-0.5">
                  When a user pays to unlock AfyaMind (KES 50, 299, or 999), <strong>the cash arrives directly in your Safaricom M-PESA wallet (+254746867552) on your phone immediately!</strong> There is no platform intermediary holding your funds. You can withdraw physical cash at any local M-Pesa Agent (Wakala) or send directly to your Kenyan bank account anytime.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowDownToLine className="w-4 h-4" />
                <span>Record Withdrawal</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Download CSV Ledger for accounting"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-semibold">Total Revenue Inflows</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                KES {totalInflows.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                From {transactions.filter((t) => t.type === 'subscription_inflow').length} subscriber passes
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-semibold">Withdrawn / Transferred</span>
                <ArrowDownToLine className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                KES {totalWithdrawals.toLocaleString()}
              </div>
              <p className="text-[11px] text-stone-500 font-medium mt-1">
                Settled to Agent / Bank / Cash
              </p>
            </div>

            <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-xs border border-emerald-800">
              <div className="flex items-center justify-between text-emerald-300 mb-2">
                <span className="text-xs font-semibold">Available Revenue Balance</span>
                <Wallet className="w-4 h-4 text-amber-300" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
                KES {availableBalance.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-200/90 font-medium mt-1">
                Active on SIM +254746867552
              </p>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex border-b border-stone-200 gap-2">
            {[
              { id: 'overview', label: 'Withdrawal Instructions (Hatua za Kutoa)' },
              { id: 'methods', label: 'Bank & ATM Settlement' },
              { id: 'daraja', label: 'Safaricom Till / Daraja API' },
              { id: 'history', label: `Transaction Ledger (${transactions.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`pb-3 text-xs font-bold transition-colors cursor-pointer border-b-2 -mb-[2px] px-3 ${
                  activeTab === tab.id
                    ? 'border-emerald-700 text-emerald-800'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Withdrawal Instructions */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Method 1: M-Pesa Agent */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  1
                </div>
                <h4 className="font-bold text-stone-900 text-sm">
                  Option 1: Cash at M-Pesa Agent (Wakala)
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Walk to any Safaricom agent booth anywhere in Kenya with your phone and National ID:
                </p>
                <ol className="text-xs text-stone-600 space-y-1.5 list-decimal pl-4">
                  <li>Dial <strong>*334#</strong> on your line <span className="font-mono text-emerald-800 font-bold">0746867552</span></li>
                  <li>Select <strong>Withdraw Cash</strong> &rarr; <strong>From Agent</strong></li>
                  <li>Enter the Agent Till Number</li>
                  <li>Enter the amount you wish to withdraw</li>
                  <li>Enter your secret M-Pesa PIN &amp; collect your cash.</li>
                </ol>
              </div>

              {/* Method 2: ATM Cardless */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  2
                </div>
                <h4 className="font-bold text-stone-900 text-sm">
                  Option 2: Cardless ATM Withdrawal
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Withdraw 24/7 at any Equity Bank, KCB, Co-op, NCBA, or DTB ATM without needing an ATM card:
                </p>
                <ol className="text-xs text-stone-600 space-y-1.5 list-decimal pl-4">
                  <li>Dial <strong>*334#</strong> on your phone</li>
                  <li>Select <strong>Withdraw Cash</strong> &rarr; <strong>From ATM</strong></li>
                  <li>Select ATM Bank (e.g. Equity, KCB)</li>
                  <li>You will receive a 6-digit ATM Authorization Code via SMS</li>
                  <li>Punch the code at the ATM keypad to withdraw instant cash.</li>
                </ol>
              </div>

              {/* Method 3: Bank Transfer */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                  3
                </div>
                <h4 className="font-bold text-stone-900 text-sm">
                  Option 3: Transfer M-Pesa to Bank Account
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Transfer accumulated subscription revenue from your M-Pesa directly into your personal or company bank account:
                </p>
                <ol className="text-xs text-stone-600 space-y-1.5 list-decimal pl-4">
                  <li>Dial <strong>*334#</strong> &rarr; <strong>Send Money</strong> &rarr; <strong>To Bank</strong></li>
                  <li>Choose your bank (Equity 247247, KCB 522522, Co-op 400200)</li>
                  <li>Enter your Bank Account Number</li>
                  <li>Enter Amount &amp; PIN</li>
                  <li>Funds reflect instantly in your bank account balance.</li>
                </ol>
              </div>
            </div>
          )}

          {/* Tab 2: Bank & ATM Settlement */}
          {activeTab === 'methods' && (
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h4 className="font-serif font-bold text-stone-900 text-base">
                Kenyan Bank Paybill Codes for Direct M-Pesa Settlement
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                If you prefer your subscription money to sit directly in your bank account, you can send it from phone <code className="bg-stone-100 px-1 font-mono font-bold text-emerald-800">0746867552</code> to your bank using standard Kenyan Paybill numbers:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {[
                  { name: 'Equity Bank', paybill: '247247', note: 'Account: Your Account No' },
                  { name: 'KCB Bank', paybill: '522522', note: 'Account: Your Account No' },
                  { name: 'Co-operative Bank', paybill: '400200', note: 'Account: Your Account No' },
                  { name: 'NCBA Bank', paybill: '888888', note: 'Account: Your Account No' },
                  { name: 'Absa Bank', paybill: '303030', note: 'Account: Your Account No' },
                  { name: 'Stanbic Bank', paybill: '552552', note: 'Account: Your Account No' },
                  { name: 'I&M Bank', paybill: '542542', note: 'Account: Your Account No' },
                  { name: 'Postbank Kenya', paybill: '200999', note: 'Account: Your Account No' },
                ].map((b) => (
                  <div key={b.name} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                      <Building className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{b.name}</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-emerald-800">
                      Paybill: {b.paybill}
                    </div>
                    <div className="text-[10px] text-stone-500">{b.note}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Safaricom Daraja API / Buy Goods Till */}
          {activeTab === 'daraja' && (
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Upgrade to Business Till
                </span>
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  Automate Automated Payouts via Safaricom Daraja API
                </h4>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Currently, your app allows subscribers to pay directly to your personal line <strong>0746867552</strong>. When AfyaMind grows, you can apply for a free Safaricom <strong>Lipa Na M-Pesa Buy Goods Till</strong> or <strong>Paybill</strong> from the Safaricom Business portal:
              </p>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 text-xs text-stone-700">
                <div className="font-bold text-stone-900">Benefits of an Official Business Till:</div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Instant automated STK Push prompts directly to user phone screens without manual code verification.</li>
                  <li>Auto-settlement to your bank account every midnight (KES 0 fee).</li>
                  <li>Separates personal M-Pesa funds from AfyaMind 2036 healthcare revenues.</li>
                  <li>Free registration online at <code className="bg-white px-1 py-0.5 rounded font-mono text-emerald-800">m-pesaforbusiness.co.ke</code> with your National ID and KRA PIN.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 4: Transaction Ledger */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-stone-200 flex items-center justify-between">
                <h4 className="font-bold text-stone-900 text-sm">
                  Complete Inflow &amp; Payout Audit Trail
                </h4>
                <span className="text-xs text-stone-500">
                  {transactions.length} recorded events
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-4">Date</th>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4">Description</th>
                      <th className="py-2.5 px-4">M-Pesa Ref</th>
                      <th className="py-2.5 px-4 text-right">Amount (KES)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-stone-50/50">
                        <td className="py-3 px-4 font-mono text-stone-500">{tx.date}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              tx.type === 'subscription_inflow'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {tx.type === 'subscription_inflow' ? '+ Inflow' : '- Withdrawal'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-stone-800">{tx.description}</td>
                        <td className="py-3 px-4 font-mono text-stone-600">{tx.referenceNumber}</td>
                        <td
                          className={`py-3 px-4 text-right font-bold font-mono ${
                            tx.type === 'subscription_inflow' ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {tx.type === 'subscription_inflow' ? '+' : '-'} KES {tx.amountKES.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Record Withdrawal Modal */}
      {isWithdrawModalOpen && (
        <div
          onClick={() => setIsWithdrawModalOpen(false)}
          className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-scale-up"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <ArrowDownToLine className="w-5 h-5 text-emerald-700" />
                <h3 className="font-serif font-bold text-stone-900 text-lg">Record Cash Withdrawal</h3>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 font-bold text-lg"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              Log a withdrawal after taking physical cash from an agent or transferring to your bank to keep your balance accurate:
            </p>

            <form onSubmit={handleRecordWithdrawal} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Withdrawal Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'agent', label: 'Agent Kiosk' },
                    { id: 'atm', label: 'Bank ATM' },
                    { id: 'bank', label: 'Bank Acc' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setWithdrawMethod(m.id as typeof withdrawMethod)}
                      className={`py-2 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                        withdrawMethod === m.id
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Amount to Withdraw (KES)
                </label>
                <input
                  type="number"
                  min="50"
                  max={availableBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-stone-300 outline-none focus:border-emerald-600"
                  required
                />
                <span className="text-[10px] text-stone-400">Available: KES {availableBalance.toLocaleString()}</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Location / Till / Bank Details
                </label>
                <input
                  type="text"
                  placeholder="e.g., Wakala Till 294819 Mombasa or Equity Bank"
                  value={withdrawDestination}
                  onChange={(e) => setWithdrawDestination(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  M-Pesa Confirmation SMS Code
                </label>
                <input
                  type="text"
                  placeholder="e.g., SKJ781920 (optional)"
                  value={withdrawRef}
                  onChange={(e) => setWithdrawRef(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono uppercase rounded-xl border border-stone-300 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Withdrawal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
