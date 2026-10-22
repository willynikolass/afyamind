import React from 'react';
import { X, CheckCircle, Receipt, Smartphone, ShieldCheck, Lock, Download } from 'lucide-react';
import { MpesaPass } from '../../utils/storage';

interface MpesaReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  pass: MpesaPass | null;
  onRelock: () => void;
}

export const MpesaReceiptModal: React.FC<MpesaReceiptModalProps> = ({
  isOpen,
  onClose,
  pass,
  onRelock,
}) => {
  if (!isOpen || !pass) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200">
        <div className="bg-emerald-900 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg">M-PESA Access Receipt</h3>
              <p className="text-xs text-emerald-200">AfyaMind Verified Member</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-stone-800">
          <div className="flex items-center gap-2 text-emerald-800 font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>AfyaPass is Active & Valid</span>
          </div>

          <div className="divide-y divide-stone-100 bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
            <div className="flex justify-between pt-1">
              <span className="text-stone-500">Membership Tier:</span>
              <strong className="text-stone-900">{pass.tierName}</strong>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-stone-500">Amount Paid:</span>
              <strong className="text-stone-900">KES {pass.amountKES}</strong>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-stone-500">Recipient M-Pesa:</span>
              <strong className="font-mono text-emerald-800">{pass.recipientMpesaNumber}</strong>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-stone-500">Payer Phone:</span>
              <strong className="font-mono text-stone-700">{pass.payerPhone}</strong>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-stone-500">M-PESA Transaction Code:</span>
              <strong className="font-mono text-stone-900">{pass.transactionCode}</strong>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-stone-500">Unlocked At:</span>
              <span className="text-stone-700">{pass.unlockedAt}</span>
            </div>
            {pass.expiresAt && (
              <div className="flex justify-between pt-2">
                <span className="text-stone-500">Valid Until:</span>
                <span className="text-emerald-800 font-semibold">{pass.expiresAt}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Encrypted local license linked to {pass.recipientMpesaNumber}.</span>
          </div>
        </div>

        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('Lock access to AfyaMind and require M-Pesa pass again?')) {
                onRelock();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-700 hover:text-rose-900 font-semibold cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Re-lock App</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
