import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  TrendingUp,
  Moon,
  Zap,
  Activity,
  Smile,
  Frown,
  Meh,
  Sun,
  CloudRain,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';
import { MoodEntry, MoodValence } from '../../types';
import { storage } from '../../utils/storage';

const MOOD_LEVELS = [
  { val: 1 as MoodValence, label: 'Overwhelmed', emoji: '🌧️', color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { val: 2 as MoodValence, label: 'Down / Low', emoji: '☁️', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { val: 3 as MoodValence, label: 'Neutral / Steady', emoji: '⛅', color: 'text-stone-700 bg-stone-100 border-stone-300' },
  { val: 4 as MoodValence, label: 'Good / Grounded', emoji: '🌿', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { val: 5 as MoodValence, label: 'Radiant / Peaceful', emoji: '☀️', color: 'text-teal-700 bg-teal-50 border-teal-200' },
];

const EMOTION_TAGS = [
  'Grounded',
  'Anxious',
  'Grateful',
  'Exhausted',
  'Hopeful',
  'Overwhelmed',
  'Joyful',
  'Lonely',
  'Restless',
  'Tender',
  'Frustrated',
  'Quiet',
  'Confident',
  'Numb',
];

const INFLUENCE_FACTORS = [
  'Sleep',
  'Work',
  'Exercise',
  'Family',
  'Social Life',
  'Nutrition',
  'Weather',
  'Health',
  'Finances',
];

export const MoodTracker: React.FC = () => {
  const [moods, setMoods] = useState<MoodEntry[]>(() => storage.getMoods());
  const [activeView, setActiveView] = useState<'checkin' | 'insights'>('checkin');

  // Form State
  const [selectedValence, setSelectedValence] = useState<MoodValence>(4);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(['Grounded']);
  const [energy, setEnergy] = useState(7);
  const [stress, setStress] = useState(4);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [selectedInfluences, setSelectedInfluences] = useState<string[]>(['Sleep', 'Exercise']);
  const [note, setNote] = useState('');
  const [customEmotionInput, setCustomEmotionInput] = useState('');

  const toggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion));
    } else {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  const addCustomEmotion = () => {
    if (!customEmotionInput.trim() || selectedEmotions.includes(customEmotionInput.trim())) return;
    setSelectedEmotions([...selectedEmotions, customEmotionInput.trim()]);
    setCustomEmotionInput('');
  };

  const toggleInfluence = (factor: string) => {
    if (selectedInfluences.includes(factor)) {
      setSelectedInfluences(selectedInfluences.filter((f) => f !== factor));
    } else {
      setSelectedInfluences([...selectedInfluences, factor]);
    }
  };

  const handleSaveCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: MoodEntry = {
      id: `m_${Date.now()}`,
      date: today,
      timestamp: Date.now(),
      valence: selectedValence,
      emotions: selectedEmotions.length ? selectedEmotions : ['Present'],
      energy,
      stress,
      sleepHours,
      influences: selectedInfluences,
      note: note.trim() || undefined,
    };

    const updated = storage.saveMood(newEntry);
    setMoods(updated);

    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.65 },
        colors: ['#059669', '#10B981', '#34D399'],
      });
    } catch {
      // Ignore
    }

    setNote('');
    setActiveView('insights');
  };

  const handleDelete = (id: string) => {
    const updated = storage.deleteMood(id);
    setMoods(updated);
  };

  // Calculations for insights
  const sortedMoods = [...moods].sort((a, b) => a.timestamp - b.timestamp);
  const recent7 = sortedMoods.slice(-7);
  const avgValence = moods.length
    ? (moods.reduce((sum, m) => sum + m.valence, 0) / moods.length).toFixed(1)
    : '0';
  const avgSleep = moods.length
    ? (moods.reduce((sum, m) => sum + m.sleepHours, 0) / moods.length).toFixed(1)
    : '0';
  const avgStress = moods.length
    ? (moods.reduce((sum, m) => sum + m.stress, 0) / moods.length).toFixed(1)
    : '0';

  // Correlation calculation (when sleep >= 7h vs < 7h)
  const highSleepEntries = moods.filter((m) => m.sleepHours >= 7);
  const lowSleepEntries = moods.filter((m) => m.sleepHours < 7);
  const highSleepAvgMood = highSleepEntries.length
    ? (highSleepEntries.reduce((acc, m) => acc + m.valence, 0) / highSleepEntries.length).toFixed(1)
    : null;
  const lowSleepAvgMood = lowSleepEntries.length
    ? (lowSleepEntries.reduce((acc, m) => acc + m.valence, 0) / lowSleepEntries.length).toFixed(1)
    : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Heart className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-serif font-bold text-stone-900">
              Private Mood & Nervous System Log
            </h1>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Identify patterns between sleep, daily stress, and emotional resilience in complete privacy.
          </p>
        </div>

        <div className="flex items-center bg-stone-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveView('checkin')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'checkin'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Today's Check-in
          </button>
          <button
            onClick={() => setActiveView('insights')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeView === 'insights'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Trends & History ({moods.length})</span>
          </button>
        </div>
      </div>

      {/* 1. Daily Check-in Form */}
      {activeView === 'checkin' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-7">
          {/* Section 1: Mood Valence */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
              1. Overall Emotional Valence
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {MOOD_LEVELS.map((m) => {
                const isSelected = selectedValence === m.val;
                return (
                  <button
                    key={m.val}
                    type="button"
                    onClick={() => setSelectedValence(m.val)}
                    className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{m.emoji}</span>
                    <span className="text-xs font-bold text-stone-800 block">{m.label}</span>
                    <span className="text-[10px] text-stone-400 mt-0.5 block">Level {m.val}/5</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Emotion tags */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
              2. Specific Emotions Present Right Now
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOTION_TAGS.map((emotion) => {
                const isSelected = selectedEmotions.includes(emotion);
                return (
                  <button
                    key={emotion}
                    type="button"
                    onClick={() => toggleEmotion(emotion)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {emotion}
                  </button>
                );
              })}
            </div>

            {/* Custom emotion tag input */}
            <div className="flex items-center gap-2 max-w-xs">
              <input
                type="text"
                placeholder="+ Add custom emotion"
                value={customEmotionInput}
                onChange={(e) => setCustomEmotionInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomEmotion()}
                className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-emerald-600 flex-1"
              />
              <button
                type="button"
                onClick={addCustomEmotion}
                className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Section 3: Sliders (Energy & Stress & Sleep) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-stone-50 p-5 rounded-2xl border border-stone-200">
            {/* Energy */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Energy Level:
                </span>
                <span className="font-mono font-bold text-stone-900">{energy} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Exhausted</span>
                <span>Vibrant</span>
              </div>
            </div>

            {/* Stress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-500" />
                  Perceived Stress:
                </span>
                <span className="font-mono font-bold text-stone-900">{stress} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stress}
                onChange={(e) => setStress(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Peaceful</span>
                <span>Overload</span>
              </div>
            </div>

            {/* Sleep */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  Sleep Duration:
                </span>
                <span className="font-mono font-bold text-stone-900">{sleepHours} hrs</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>3 hours</span>
                <span>12 hours</span>
              </div>
            </div>
          </div>

          {/* Section 4: Contextual Factors */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
              3. Influences on Today's Well-Being
            </label>
            <div className="flex flex-wrap gap-2">
              {INFLUENCE_FACTORS.map((factor) => {
                const isSelected = selectedInfluences.includes(factor);
                return (
                  <button
                    key={factor}
                    type="button"
                    onClick={() => toggleInfluence(factor)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {factor}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Optional Micro-Note */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
              4. Brief Daily Note (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Any notable events, sensations, or thoughts today?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-stone-200 outline-none focus:border-emerald-600 resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSaveCheckIn}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-7 py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Log Daily Check-in</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Insights & History View */}
      {activeView === 'insights' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-400 block mb-1">Average Valence</span>
              <div className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                <span>{avgValence} / 5</span>
                <span className="text-base font-normal">🌿</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">Based on {moods.length} total entries</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-400 block mb-1">Average Sleep</span>
              <div className="text-2xl font-bold text-indigo-700 flex items-center gap-1.5">
                <Moon className="w-5 h-5 text-indigo-500" />
                <span>{avgSleep} hrs</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">Target: 7-9 restful hours</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-400 block mb-1">Stress Benchmark</span>
              <div className="text-2xl font-bold text-stone-900 flex items-center gap-1.5">
                <Activity className="w-5 h-5 text-rose-500" />
                <span>{avgStress} / 10</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">Mild-to-moderate range</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-400 block mb-1">Check-in Consistency</span>
              <div className="text-2xl font-bold text-emerald-700 flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <span>{moods.length} Days</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">Non-punitive awareness</p>
            </div>
          </div>

          {/* Interactive 7-Day Trendline Visualizer */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-lg">
                  7-Day Emotional Resilience Trend
                </h3>
                <p className="text-xs text-stone-500">
                  Mood rating (1 to 5) across your most recent daily check-ins.
                </p>
              </div>
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md">
                Safe & Local
              </span>
            </div>

            {/* Custom Responsive SVG Chart */}
            <div className="h-48 w-full relative pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 160">
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                {[1, 2, 3, 4, 5].map((lvl) => {
                  const y = 140 - ((lvl - 1) / 4) * 110;
                  return (
                    <g key={lvl}>
                      <line x1="40" y1={y} x2="680" y2={y} stroke="#F3F4F6" strokeDasharray="4 4" />
                      <text x="15" y={y + 4} fill="#9CA3AF" fontSize="10" fontFamily="sans-serif">
                        {lvl === 5 ? '5 ☀️' : lvl === 3 ? '3 ⛅' : lvl === 1 ? '1 🌧️' : `${lvl}`}
                      </text>
                    </g>
                  );
                })}

                {/* Plot line & area */}
                {recent7.length > 1 && (() => {
                  const stepX = (680 - 60) / Math.max(1, recent7.length - 1);
                  const points = recent7.map((m, idx) => {
                    const x = 60 + idx * stepX;
                    const y = 140 - ((m.valence - 1) / 4) * 110;
                    return { x, y, m };
                  });

                  const pathD = points.reduce((acc, p, idx) => {
                    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                  }, '');

                  const areaD = `${pathD} L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z`;

                  return (
                    <>
                      <path d={areaD} fill="url(#moodGradient)" />
                      <path d={pathD} fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
                      {points.map((p, idx) => (
                        <g key={idx}>
                          <circle cx={p.x} cy={p.y} r="5" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />
                          <text
                            x={p.x}
                            y={156}
                            textAnchor="middle"
                            fill="#6B7280"
                            fontSize="10"
                            fontWeight="500"
                          >
                            {p.m.date.slice(5)}
                          </text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>

          {/* Biological Correlation Card */}
          {highSleepAvgMood && lowSleepAvgMood && (
            <div className="bg-emerald-50/80 border border-emerald-200 p-5 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
              <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-emerald-900 text-sm">
                  Personal Correlation Discovery
                </span>
                <p className="leading-relaxed">
                  On nights when you log <strong>7+ hours of sleep</strong>, your average mood rating is{' '}
                  <strong className="text-emerald-800">{highSleepAvgMood} / 5</strong>, compared to{' '}
                  <strong className="text-amber-800">{lowSleepAvgMood} / 5</strong> when sleep drops below 7 hours.
                  Prioritizing sleep directly buffers your emotional bandwidth.
                </p>
              </div>
            </div>
          )}

          {/* Check-in History List */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-lg">Check-in History Log</h3>
            <div className="divide-y divide-stone-100">
              {moods.map((m) => {
                const config = MOOD_LEVELS.find((l) => l.val === m.valence);
                return (
                  <div key={m.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{config?.emoji}</span>
                        <span className="font-bold text-stone-900 text-sm">{config?.label}</span>
                        <span className="text-xs text-stone-400">({m.date})</span>
                      </div>
                      <div className="flex flex-wrap gap-1 text-xs">
                        {m.emotions.map((e) => (
                          <span key={e} className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                            {e}
                          </span>
                        ))}
                      </div>
                      {m.note && (
                        <p className="text-xs text-stone-600 italic">"{m.note}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-stone-500 shrink-0">
                      <div className="text-right">
                        <div>Energy: {m.energy}/10 • Stress: {m.stress}/10</div>
                        <div>Sleep: {m.sleepHours} hrs</div>
                      </div>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-stone-300 hover:text-rose-600 p-1 cursor-pointer"
                        title="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
