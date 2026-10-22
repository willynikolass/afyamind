import React from 'react';
import { X, Award, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../types';

interface MilestoneCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge?: Badge | null;
  levelUpTitle?: string;
  pointsEarned: number;
}

export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
  isOpen,
  onClose,
  badge,
  levelUpTitle,
  pointsEarned,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl border-2 border-emerald-400 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-200/40 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-200/40 rounded-full blur-xl pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-4xl shadow-lg mx-auto transform hover:scale-105 transition-transform select-none">
          {badge ? badge.icon : '🌱'}
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-amber-500 fill-current" />
            {levelUpTitle ? 'New Level Achieved!' : 'Milestone Badge Unlocked!'}
          </div>

          <h3 className="text-2xl font-serif font-bold text-stone-900">
            {levelUpTitle ? levelUpTitle : badge?.title}
          </h3>

          <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto">
            {badge ? badge.description : 'Your dedication to regular self-care and emotional awareness is blooming.'}
          </p>
        </div>

        {/* Points Reward Box */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 flex items-center justify-between text-xs font-semibold text-stone-700">
          <span className="flex items-center gap-1.5 text-stone-600">
            <Award className="w-4 h-4 text-amber-500" />
            Growth Points Awarded:
          </span>
          <span className="font-mono text-emerald-700 font-bold text-sm">
            +{pointsEarned} XP
          </span>
        </div>

        {/* Gentle encouragement note */}
        <p className="text-[11px] text-stone-400 italic">
          "Consistency is an act of gentle self-kindness, not a performance."
        </p>

        <button
          onClick={onClose}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Continue My Practice</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
