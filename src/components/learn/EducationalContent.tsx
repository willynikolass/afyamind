import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Shield,
  LifeBuoy,
  X,
  Sparkles,
} from 'lucide-react';
import { EducationalArticle } from '../../types';
import { MOCK_EDUCATIONAL_ARTICLES } from '../../data/mockData';

interface EducationalContentProps {
  onOpenCrisis: () => void;
  onOpenBreathing: () => void;
}

export const EducationalContent: React.FC<EducationalContentProps> = ({
  onOpenCrisis,
  onOpenBreathing,
}) => {
  const [articles] = useState<EducationalArticle[]>(MOCK_EDUCATIONAL_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<EducationalArticle | null>(null);
  const [activeTab, setActiveTab] = useState<'articles' | 'screener'>('articles');

  // Screener state (PHQ-4 brief educational 4-question scale)
  const [screenerAnswers, setScreenerAnswers] = useState<number[]>([0, 0, 0, 0]);
  const [screenerSubmitted, setScreenerSubmitted] = useState(false);

  const SCREENER_QUESTIONS = [
    'Feeling nervous, anxious, or on edge over the last 2 weeks',
    'Not being able to stop or control worrying over the last 2 weeks',
    'Little interest or pleasure in doing things over the last 2 weeks',
    'Feeling down, depressed, or hopeless over the last 2 weeks',
  ];

  const totalScore = screenerAnswers.reduce((a, b) => a + b, 0);

  const getScoreInterpretation = () => {
    if (totalScore <= 2) {
      return {
        level: 'Minimal / Normal Range',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        advice: 'Your responses indicate mild or baseline fluctuations. Continue proactive self-care, daily gratitude, and regular sleep rhythms.',
      };
    }
    if (totalScore <= 5) {
      return {
        level: 'Mild Distress',
        color: 'text-amber-800 bg-amber-50 border-amber-200',
        advice: 'You may be experiencing noticeable tension. Guided journaling and paced breathing exercises are great non-clinical tools to help restore balance.',
      };
    }
    if (totalScore <= 8) {
      return {
        level: 'Moderate Distress',
        color: 'text-orange-800 bg-orange-50 border-orange-200',
        advice: 'Your stress load is elevated. We strongly encourage scheduling a session with one of our licensed counsellors or joining a peer circle.',
      };
    }
    return {
      level: 'Severe Distress',
      color: 'text-rose-800 bg-rose-50 border-rose-200',
      advice: 'You are carrying a heavy burden. Please know that support is ready. Reach out to a qualified counselor or tap our 24/7 Crisis Lifeline.',
    };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-serif font-bold text-stone-900">
              Psychoeducation & Mental Wellness Toolkit
            </h1>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Evidence-based CBT, DBT, and somatic regulation guides reviewed by licensed clinical professionals.
          </p>
        </div>

        <div className="flex items-center bg-stone-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'articles'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Clinical Library
          </button>
          <button
            onClick={() => setActiveTab('screener')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'screener'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Well-Being Check-in (PHQ-4)</span>
          </button>
        </div>
      </div>

      {/* Articles View */}
      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {articles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                    {art.category}
                  </span>
                  <span className="text-xs text-stone-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {art.readTime}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-stone-900 text-lg line-clamp-2">
                  {art.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {art.summary}
                </p>

                <div className="pt-2 text-[11px] text-stone-400 flex items-center gap-1">
                  <span>Author: {art.author} ({art.authorCredentials})</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-stone-400">
                  Reviewed: {art.clinicalReviewDate}
                </span>
                <button
                  onClick={() => setSelectedArticle(art)}
                  className="text-emerald-700 hover:text-emerald-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Screener View */}
      {activeTab === 'screener' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Clinical Disclaimer */}
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex items-start gap-3 text-xs text-stone-600">
            <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900">Educational & Non-Diagnostic Notice:</strong> This 4-item questionnaire (PHQ-4) is an evidence-based screening tool intended for personal self-awareness and psychoeducation. It does not provide or replace clinical psychiatric diagnosis or medical treatment.
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Brief Emotional & Anxiety Well-Being Screener
            </h2>
            <p className="text-xs text-stone-500">
              Over the last 2 weeks, how often have you been bothered by the following problems?
            </p>

            <div className="space-y-5">
              {SCREENER_QUESTIONS.map((q, idx) => (
                <div key={idx} className="space-y-2 pb-4 border-b border-stone-100">
                  <div className="text-xs font-bold text-stone-800">
                    {idx + 1}. {q}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { val: 0, label: 'Not at all' },
                      { val: 1, label: 'Several days' },
                      { val: 2, label: 'More than half the days' },
                      { val: 3, label: 'Nearly every day' },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => {
                          const updated = [...screenerAnswers];
                          updated[idx] = opt.val;
                          setScreenerAnswers(updated);
                        }}
                        className={`p-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                          screenerAnswers[idx] === opt.val
                            ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setScreenerSubmitted(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-xs"
              >
                Evaluate Results & Guidance
              </button>
            </div>
          </div>

          {/* Results Box */}
          {screenerSubmitted && (() => {
            const result = getScoreInterpretation();
            return (
              <div className={`p-5 rounded-2xl border ${result.color} space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm uppercase tracking-wider">
                    Score: {totalScore} / 12 • {result.level}
                  </span>
                  <span className="text-xs font-semibold">Self-Screening Result</span>
                </div>
                <p className="text-xs leading-relaxed">{result.advice}</p>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={onOpenBreathing}
                    className="bg-white/80 hover:bg-white text-stone-900 border border-stone-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Open Paced Breathing
                  </button>
                  {totalScore >= 6 && (
                    <button
                      onClick={onOpenCrisis}
                      className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <LifeBuoy className="w-3.5 h-3.5" />
                      <span>Crisis Helplines (24/7)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-200 bg-stone-50 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {selectedArticle.category}
                </span>
                <h2 className="text-xl font-serif font-bold text-stone-900 mt-2">
                  {selectedArticle.title}
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  By {selectedArticle.author} ({selectedArticle.authorCredentials}) • {selectedArticle.readTime}
                </p>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-stone-800 flex-1 leading-relaxed">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 italic text-stone-600 text-xs">
                "{selectedArticle.summary}"
              </div>

              {selectedArticle.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="font-serif font-bold text-stone-900 text-base">
                    {sec.heading}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {sec.content}
                  </p>

                  {sec.tips && sec.tips.length > 0 && (
                    <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/70 space-y-1.5 mt-2">
                      <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                        Key Clinical Takeaways:
                      </span>
                      <ul className="space-y-1 text-xs text-emerald-950">
                        {sec.tips.map((tip, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-xs">
              <span className="text-stone-400">
                Clinically reviewed {selectedArticle.clinicalReviewDate}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold cursor-pointer"
              >
                Finished Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
