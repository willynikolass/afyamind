import React from 'react';
import { Shield, LifeBuoy, Download, Trash2, Heart, Lock, Smartphone } from 'lucide-react';
import { storage } from '../utils/storage';

interface FooterProps {
  onOpenCrisis: () => void;
  onOpenSafetyPlan: () => void;
  onDataCleared: () => void;
  onOpenInstallModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCrisis,
  onOpenSafetyPlan,
  onDataCleared,
  onOpenInstallModal,
}) => {
  const handleExportData = () => {
    const dataStr = storage.exportDataJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `afyamind-my-private-records-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (
      window.confirm(
        'Are you sure you want to erase all your local journal entries, mood logs, and bookings from this browser? This cannot be undone.'
      )
    ) {
      storage.clearAllUserData();
      onDataCleared();
    }
  };

  return (
    <footer className="mt-16 bg-white border-t border-stone-200 text-stone-600 text-xs py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Clinical Disclaimer & Crisis Notice Box */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>Important Clinical Distinction & Emergency Notice</span>
          </div>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            <strong>AfyaMind</strong> provides general emotional wellness tools, guided journaling, peer circles, and access to independent licensed practitioners. It is not an emergency psychiatric triage service. If you are experiencing suicidal thoughts, self-harm impulses, severe panic, or acute psychological crisis, please contact your national emergency line (911, 999, 112) or access our free, confidential 24/7 crisis lines immediately via the SOS button.
          </p>
        </div>

        {/* Links and Ethical Charter */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧠</span>
              <span className="font-serif font-bold text-stone-900 text-lg">
                AfyaMind <span className="text-emerald-700">2036</span>
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Founded by <strong>Nikolass Willy Mtunga</strong> (raised in Coast Region, schooled in Taita Taveta) to democratize accessible emotional care and drastically reduce psychiatric patient numbers in Kenya before 2036.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Emergency Support</h4>
            <ul className="space-y-1 text-xs">
              <li>
                <button
                  onClick={onOpenCrisis}
                  className="text-rose-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <LifeBuoy className="w-3.5 h-3.5" />
                  <span>24/7 Crisis Helplines</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSafetyPlan}
                  className="text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  My Personal Safety Plan
                </button>
              </li>
              <li className="text-[11px] text-stone-400">
                US/Canada: Dial 988 • UK: 116 123 • Kenya: +254 722 178 177
              </li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Ethical Pledge</h4>
            <ul className="space-y-1 text-[11px] text-stone-500">
              <li>✓ No ads exploiting emotional distress</li>
              <li>✓ No sale of health data to third-party brokers</li>
              <li>✓ 100% Client-side sandbox storage</li>
              <li>✓ Subsidized sliding-scale mental health care</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">App & Data Controls</h4>
            <div className="space-y-2">
              {onOpenInstallModal && (
                <button
                  onClick={onOpenInstallModal}
                  className="w-full text-left flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Install Phone App / Play Store</span>
                </button>
              )}

              <button
                onClick={handleExportData}
                className="w-full text-left flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-stone-500" />
                <span>Export My Private Data (.JSON)</span>
              </button>

              <button
                onClick={handleClearData}
                className="w-full text-left flex items-center gap-2 text-rose-700 hover:text-rose-900 px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Local Browser History</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="border-t border-stone-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-400">
          <div>
            © {new Date().getFullYear()} AfyaMind 2036. Founded by Nikolass Willy Mtunga. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Vision 2036 Healthcare Mission</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
