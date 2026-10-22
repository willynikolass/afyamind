import React, { useState } from 'react';
import { X, Lock, Unlock, KeyRound, ShieldAlert, Check } from 'lucide-react';
import { storage } from '../utils/storage';

interface PinVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLocked: boolean;
  hasPin: boolean;
  onUnlocked: () => void;
  onPinChanged: () => void;
}

export const PinVaultModal: React.FC<PinVaultModalProps> = ({
  isOpen,
  onClose,
  isLocked,
  hasPin,
  onUnlocked,
  onPinChanged,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [mode, setMode] = useState<'unlock' | 'set' | 'remove'>(
    hasPin && isLocked ? 'unlock' : 'set'
  );

  if (!isOpen) return null;

  const handleUnlock = () => {
    if (storage.verifyVaultPin(pinInput)) {
      setErrorMsg('');
      setPinInput('');
      onUnlocked();
      onClose();
    } else {
      setErrorMsg('Incorrect PIN. Please try again.');
      setPinInput('');
    }
  };

  const handleSetPin = () => {
    if (newPin.length < 4) {
      setErrorMsg('PIN must be at least 4 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setErrorMsg('PINs do not match.');
      return;
    }
    storage.setVaultPin(newPin);
    setNewPin('');
    setConfirmPin('');
    setErrorMsg('');
    onPinChanged();
    onClose();
  };

  const handleRemovePin = () => {
    if (storage.verifyVaultPin(pinInput)) {
      storage.clearVaultPin();
      setErrorMsg('');
      setPinInput('');
      onPinChanged();
      onClose();
    } else {
      setErrorMsg('Incorrect current PIN.');
      setPinInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Private Vault Security</h3>
              <p className="text-xs text-stone-500">Client-Side Journal Privacy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs p-2.5 rounded-lg flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Mode: Unlock */}
        {mode === 'unlock' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-600">
              Your journal and private reflections are protected. Enter your 4-digit PIN to unlock.
            </p>
            <div>
              <input
                type="password"
                maxLength={8}
                placeholder="Enter 4-digit PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                autoFocus
                className="w-full text-center tracking-widest text-xl font-mono py-2.5 border border-stone-300 rounded-xl focus:border-emerald-600 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUnlock}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Vault</span>
              </button>
            </div>
          </div>
        )}

        {/* Mode: Set new PIN */}
        {mode === 'set' && (
          <div className="space-y-3.5">
            <p className="text-xs text-stone-600">
              Set a personal PIN to restrict access to your Guided Journal entries on this browser.
            </p>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">New PIN</label>
              <input
                type="password"
                maxLength={8}
                placeholder="4 digits"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-mono py-2 border border-stone-300 rounded-xl focus:border-emerald-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Confirm PIN</label>
              <input
                type="password"
                maxLength={8}
                placeholder="Re-enter 4 digits"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSetPin()}
                className="w-full text-center tracking-widest text-lg font-mono py-2 border border-stone-300 rounded-xl focus:border-emerald-600 outline-none"
              />
            </div>
            <button
              onClick={handleSetPin}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save & Lock Vault</span>
            </button>
            {hasPin && (
              <button
                onClick={() => setMode('remove')}
                className="w-full text-center text-xs text-stone-500 hover:text-stone-800 cursor-pointer pt-1"
              >
                Remove Existing PIN
              </button>
            )}
          </div>
        )}

        {/* Mode: Remove PIN */}
        {mode === 'remove' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-600">
              Enter your current PIN to deactivate passcode protection.
            </p>
            <input
              type="password"
              maxLength={8}
              placeholder="Current PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full text-center tracking-widest text-lg font-mono py-2 border border-stone-300 rounded-xl focus:border-emerald-600 outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setMode('set')}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-2 rounded-xl text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRemovePin}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Remove PIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
