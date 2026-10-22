import React, { useState, useEffect, useRef } from 'react';
import {
  Wind,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Volume1,
  Sparkles,
  Eye,
  Hand,
  Ear,
  Flower2,
  Check,
  CheckCircle2,
  Sliders,
  CloudRain,
  Waves,
  Trees,
  Radio,
  Bell,
  HeartHandshake,
} from 'lucide-react';
import { soundSynth } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';

interface BreathPattern {
  name: string;
  badge: string;
  description: string;
  inhale: number; // seconds
  hold1: number;
  exhale: number;
  hold2: number;
  bestFor: string;
}

const BREATH_PATTERNS: BreathPattern[] = [
  {
    name: 'Box Breathing (4-4-4-4)',
    badge: 'Acute Panic & Racing Mind',
    description: 'Used by first responders and Navy SEALs to down-regulate the nervous system and steady heart rate variability.',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    bestFor: 'High stress, racing heart, panic spikes',
  },
  {
    name: '4-7-8 Relaxing Breath',
    badge: 'Sleep & Deep Calming',
    description: 'Dr. Andrew Weil’s classic natural tranquilizer for the nervous system. Prolonged exhalation activates parasympathetic dominance.',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    bestFor: 'Insomnia, winding down, irritability',
  },
  {
    name: 'Coherent Breathing (5-5)',
    badge: 'Autonomic Balance',
    description: 'Smooth 6-breaths-per-minute pacing that optimizes heart rate variability and mental clarity.',
    inhale: 5,
    hold1: 0,
    exhale: 5,
    hold2: 0,
    bestFor: 'Midday focus, meeting prep, steadying focus',
  },
  {
    name: 'Physiological Sigh (2-1-6)',
    badge: 'Fastest Neuro Reset',
    description: 'Two quick inhales through the nose followed by a long, slow sigh through mouth. Re-inflates collapsed alveoli in lungs.',
    inhale: 3,
    hold1: 1,
    exhale: 6,
    hold2: 0,
    bestFor: 'Instant relief when crying or breathless',
  },
];

export const StressExercises: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'grounding' | 'pmr' | 'soundscapes'>('breathing');

  // Breathing state
  const [selectedPattern, setSelectedPattern] = useState<BreathPattern>(BREATH_PATTERNS[0]);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [phaseTimer, setPhaseTimer] = useState(0);
  const [totalCycles, setTotalCycles] = useState(0);
  const [soundCuesEnabled, setSoundCuesEnabled] = useState(true);

  // 5-4-3-2-1 Grounding State
  const [groundingStep, setGroundingStep] = useState(1);
  const [groundingAnswers, setGroundingAnswers] = useState<{ [key: number]: string[] }>({
    5: ['', '', '', '', ''],
    4: ['', '', '', ''],
    3: ['', '', ''],
    2: ['', ''],
    1: [''],
  });
  const [groundingComplete, setGroundingComplete] = useState(false);

  // Progressive Muscle Relaxation (PMR) State
  const [pmrStep, setPmrStep] = useState(0);
  const [pmrIsActive, setPmrIsActive] = useState(false);
  const [pmrPhase, setPmrPhase] = useState<'tense' | 'release'>('tense');
  const [pmrTimer, setPmrTimer] = useState(7);

  // Ambient Soundscape state
  const [activeSounds, setActiveSounds] = useState<{ [key: string]: boolean }>({
    rain: false,
    ocean: false,
    forest_wind: false,
    pink_noise: false,
  });
  const [soundVolumes, setSoundVolumes] = useState<{ [key: string]: number }>({
    rain: 0.6,
    ocean: 0.5,
    forest_wind: 0.5,
    pink_noise: 0.4,
  });

  // Breathing Loop Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isBreathingActive) {
      interval = setInterval(() => {
        setPhaseTimer((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            // Transition to next phase
            if (phase === 'Inhale') {
              if (selectedPattern.hold1 > 0) {
                setPhase('Hold');
                if (soundCuesEnabled) soundSynth.playBreathCue('hold');
                return selectedPattern.hold1;
              } else {
                setPhase('Exhale');
                if (soundCuesEnabled) soundSynth.playBreathCue('exhale');
                return selectedPattern.exhale;
              }
            } else if (phase === 'Hold') {
              setPhase('Exhale');
              if (soundCuesEnabled) soundSynth.playBreathCue('exhale');
              return selectedPattern.exhale;
            } else if (phase === 'Exhale') {
              if (selectedPattern.hold2 > 0) {
                setPhase('Rest');
                if (soundCuesEnabled) soundSynth.playBreathCue('hold');
                return selectedPattern.hold2;
              } else {
                setPhase('Inhale');
                setTotalCycles((c) => c + 1);
                if (soundCuesEnabled) soundSynth.playBreathCue('inhale');
                return selectedPattern.inhale;
              }
            } else {
              // Rest finished
              setPhase('Inhale');
              setTotalCycles((c) => c + 1);
              if (soundCuesEnabled) soundSynth.playBreathCue('inhale');
              return selectedPattern.inhale;
            }
          }
          return next;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathingActive, phase, selectedPattern, soundCuesEnabled]);

  const handleStartBreathing = () => {
    setPhase('Inhale');
    setPhaseTimer(selectedPattern.inhale);
    setIsBreathingActive(true);
    if (soundCuesEnabled) {
      soundSynth.playChime(432, 2.5);
      setTimeout(() => soundSynth.playBreathCue('inhale'), 1000);
    }
  };

  const handleStopBreathing = () => {
    setIsBreathingActive(false);
    setPhase('Inhale');
    setPhaseTimer(selectedPattern.inhale);
  };

  // PMR steps list
  const PMR_STEPS = [
    {
      name: 'Hands and Forearms',
      instruction: 'Make tight fists with both hands. Pull your fists toward your wrists and tense your forearms.',
      releaseText: 'Release and uncurl your fingers completely. Notice the warm rush of blood and tingling sensation.',
    },
    {
      name: 'Shoulders & Neck',
      instruction: 'Raise your shoulders up toward your ears, as high and tight as they can go. Hold the tension tightly.',
      releaseText: 'Drop your shoulders down completely like a heavy coat falling onto a chair. Let gravity take them.',
    },
    {
      name: 'Facial Muscles & Jaw',
      instruction: 'Scrunch your face, furrow your brow, close your eyes tight, and clench your jaw gently.',
      releaseText: 'Smooth out your forehead, loosen your jaw, let your teeth part slightly, and relax your tongue.',
    },
    {
      name: 'Chest and Abdomen',
      instruction: 'Take a deep breath and tighten your stomach muscles hard, pulling your navel toward your spine.',
      releaseText: 'Exhale with a long sigh. Let your belly become soft, warm, and loose like a sleeping cat.',
    },
    {
      name: 'Legs, Calves & Feet',
      instruction: 'Point your toes back toward your knees and tense your calves, thighs, and glutes.',
      releaseText: 'Release all tension down through your feet into the earth. Feel your lower body become completely supported.',
    },
  ];

  // PMR timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (pmrIsActive) {
      timer = setInterval(() => {
        setPmrTimer((prev) => {
          if (prev <= 1) {
            if (pmrPhase === 'tense') {
              setPmrPhase('release');
              if (soundCuesEnabled) soundSynth.playChime(528, 2);
              return 10; // 10s release period
            } else {
              // Next muscle group
              if (pmrStep < PMR_STEPS.length - 1) {
                setPmrStep((s) => s + 1);
                setPmrPhase('tense');
                if (soundCuesEnabled) soundSynth.playChime(432, 1.5);
                return 7; // 7s tense period
              } else {
                setPmrIsActive(false);
                try {
                  confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
                } catch {
                  // Ignore
                }
                return 0;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [pmrIsActive, pmrPhase, pmrStep, soundCuesEnabled]);

  // Soundscape toggler
  const toggleSoundscape = (type: 'rain' | 'ocean' | 'forest_wind' | 'pink_noise') => {
    const isNowActive = !activeSounds[type];
    setActiveSounds((prev) => ({ ...prev, [type]: isNowActive }));

    if (isNowActive) {
      soundSynth.startSoundscape(type, soundVolumes[type]);
    } else {
      soundSynth.stopSoundscape(type);
    }
  };

  const handleVolumeChange = (type: 'rain' | 'ocean' | 'forest_wind' | 'pink_noise', vol: number) => {
    setSoundVolumes((prev) => ({ ...prev, [type]: vol }));
    if (activeSounds[type]) {
      soundSynth.startSoundscape(type, vol);
    }
  };

  const stopAllSoundscapes = () => {
    soundSynth.stopAll();
    setActiveSounds({
      rain: false,
      ocean: false,
      forest_wind: false,
      pink_noise: false,
    });
  };

  // Determine breathing visual ring scale
  const getOrbScale = () => {
    if (!isBreathingActive) return 'scale-90';
    if (phase === 'Inhale') return 'scale-125 transition-transform duration-[4000ms] ease-out';
    if (phase === 'Hold') return 'scale-125';
    if (phase === 'Exhale') return 'scale-75 transition-transform duration-[4000ms] ease-in';
    return 'scale-75';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Exercise Hub Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('breathing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'breathing'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>Paced Breathing Orb</span>
          </button>

          <button
            onClick={() => setActiveTab('grounding')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'grounding'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>5-4-3-2-1 Sensory Grounding</span>
          </button>

          <button
            onClick={() => setActiveTab('pmr')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'pmr'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Progressive Muscle Relaxation</span>
          </button>

          <button
            onClick={() => setActiveTab('soundscapes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'soundscapes'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Waves className="w-4 h-4" />
            <span>Ambient Soundscapes</span>
          </button>
        </div>

        {/* Global Chime Quick Test */}
        <button
          onClick={() => soundSynth.playChime(432, 3)}
          className="text-stone-500 hover:text-stone-800 text-xs px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
          title="Play 432Hz Tibetan Singing Bowl Chime"
        >
          <Bell className="w-3.5 h-3.5 text-amber-500" />
          <span>Mindful Bell</span>
        </button>
      </div>

      {/* 1. Breathing Tab */}
      {activeTab === 'breathing' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pattern Picker Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
              Select Breathing Protocol
            </h3>
            {BREATH_PATTERNS.map((p) => {
              const isSelected = selectedPattern.name === p.name;
              return (
                <button
                  key={p.name}
                  onClick={() => {
                    handleStopBreathing();
                    setSelectedPattern(p);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {p.badge}
                    </span>
                  </div>
                  <h4 className="font-semibold text-stone-900 text-sm">{p.name}</h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">{p.description}</p>
                  <div className="mt-2 text-[11px] font-medium text-stone-400">
                    Cycle: Inhale {p.inhale}s
                    {p.hold1 > 0 ? ` • Hold ${p.hold1}s` : ''} • Exhale {p.exhale}s
                    {p.hold2 > 0 ? ` • Rest ${p.hold2}s` : ''}
                  </div>
                </button>
              );
            })}

            {/* Audio Toggle */}
            <div className="bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between text-xs text-stone-700">
              <span className="flex items-center gap-2 font-medium">
                {soundCuesEnabled ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
                Audio Transition Cues
              </span>
              <button
                onClick={() => setSoundCuesEnabled(!soundCuesEnabled)}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                  soundCuesEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {soundCuesEnabled ? 'Enabled' : 'Muted'}
              </button>
            </div>
          </div>

          {/* Visual Orb Workspace */}
          <div className="lg:col-span-2 bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-3xl p-8 flex flex-col items-center justify-between min-h-[480px] shadow-lg relative overflow-hidden">
            {/* Subtle background ambient rings */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <div className="w-96 h-96 rounded-full border border-teal-300"></div>
              <div className="w-[500px] h-[500px] rounded-full border border-teal-200"></div>
            </div>

            {/* Top Info */}
            <div className="text-center z-10 space-y-1">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                {selectedPattern.name}
              </span>
              <p className="text-xs text-stone-400 max-w-sm">
                Follow the expanding and contracting circle. Soften your jaw and shoulders.
              </p>
            </div>

            {/* Dynamic Center Breathing Orb */}
            <div className="relative my-8 flex items-center justify-center z-10">
              {/* Outer Glow Ring */}
              <div
                className={`w-64 h-64 rounded-full border-2 border-emerald-400/30 flex items-center justify-center transition-all duration-1000 ${
                  isBreathingActive ? 'animate-pulse' : ''
                }`}
              >
                {/* Main Expanding Orb */}
                <div
                  className={`w-48 h-48 rounded-full bg-gradient-to-tr from-teal-600 via-emerald-500 to-teal-400 flex flex-col items-center justify-center shadow-2xl shadow-emerald-500/20 text-white text-center select-none transform transition-all duration-700 ${getOrbScale()}`}
                >
                  <span className="text-2xl font-serif font-bold tracking-wide">
                    {isBreathingActive ? phase : 'Ready'}
                  </span>
                  {isBreathingActive && (
                    <span className="text-4xl font-mono font-extrabold mt-1">
                      {phaseTimer}s
                    </span>
                  )}
                  <span className="text-[10px] tracking-wider uppercase text-emerald-100 mt-1">
                    {isBreathingActive ? `Cycle ${totalCycles + 1}` : 'Tap Start'}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="z-10 flex flex-col sm:flex-row items-center gap-4 w-full justify-between pt-4 border-t border-stone-800">
              <div className="text-xs text-stone-400">
                Completed cycles:{' '}
                <span className="font-bold text-emerald-400 text-sm">{totalCycles}</span>
              </div>

              <div className="flex items-center gap-3">
                {!isBreathingActive ? (
                  <button
                    onClick={handleStartBreathing}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Begin Session</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStopBreathing}
                    className="flex items-center gap-2 bg-stone-700 hover:bg-stone-600 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause Exercise</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    handleStopBreathing();
                    setTotalCycles(0);
                  }}
                  className="p-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
                  title="Reset cycles"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 5-4-3-2-1 Sensory Grounding Tab */}
      {activeTab === 'grounding' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
              Somatic Nervous System Anchor
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mt-2">
              The 5-4-3-2-1 Sensory Grounding Technique
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 leading-relaxed">
              When panic, dissociation, or traumatic flashbacks pull you into high alarm, your senses can tether you back into physical reality. Work through each sensory layer slowly.
            </p>
          </div>

          {/* Stepper Progress */}
          <div className="grid grid-cols-5 gap-2">
            {[
              { num: 5, icon: Eye, label: '5 See' },
              { num: 4, icon: Hand, label: '4 Touch' },
              { num: 3, icon: Ear, label: '3 Hear' },
              { num: 2, icon: Flower2, label: '2 Smell' },
              { num: 1, icon: Sparkles, label: '1 Taste/Bless' },
            ].map((s) => {
              const Icon = s.icon;
              const isCurrent = groundingStep === s.num;
              const isDone = s.num > groundingStep || groundingComplete;
              return (
                <button
                  key={s.num}
                  onClick={() => setGroundingStep(s.num)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                      : isDone
                      ? 'border-emerald-200 bg-stone-50 text-stone-700'
                      : 'border-stone-200 text-stone-400'
                  }`}
                >
                  <Icon className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
                  <div className="text-xs font-bold">{s.label}</div>
                </button>
              );
            })}
          </div>

          {/* Active Step Content */}
          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">
                {groundingStep}
              </span>
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                {groundingStep === 5 && 'Notice FIVE things you can see with your eyes right now'}
                {groundingStep === 4 && 'Notice FOUR things you can physically touch or feel'}
                {groundingStep === 3 && 'Notice THREE distinct sounds you can hear in your space'}
                {groundingStep === 2 && 'Notice TWO things you can smell (or two scents you love)'}
                {groundingStep === 1 && 'Notice ONE thing you can taste (or one thing you are grateful for)'}
              </h3>
            </div>

            <p className="text-xs text-stone-500">
              {groundingStep === 5 && 'Look for unusual details: a shadow on the wall, the grain of wood on a table, the reflection on glass.'}
              {groundingStep === 4 && 'Feel the fabric of your trousers, the coolness of your watch strap, the soles of your shoes on the floor.'}
              {groundingStep === 3 && 'Listen beyond the closest noise: a bird outside, distant car hum, the soft whir of a fan or computer.'}
              {groundingStep === 2 && 'Your sleeve, fresh air from a window, hand lotion, or mentally recall the aroma of peppermint or coffee.'}
              {groundingStep === 1 && 'A sip of cold water, toothpaste, or one profound anchor of gratitude that exists right here.'}
            </p>

            {/* Dynamic Inputs */}
            <div className="space-y-2 pt-2">
              {Array.from({ length: groundingStep }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-400 w-5">#{idx + 1}</span>
                  <input
                    type="text"
                    placeholder={`e.g. ${
                      groundingStep === 5
                        ? ['The pattern of tiles', 'Green leaf on windowsill', 'Light reflection', 'Blue pen', 'My shoes'][idx]
                        : groundingStep === 4
                        ? ['Soft cotton of my shirt', 'Smooth wooden desk', 'Cool water bottle', 'Firm chair under my back'][idx]
                        : groundingStep === 3
                        ? ['Distant traffic', 'Birdsong', 'Quiet hum of laptop fan'][idx]
                        : groundingStep === 2
                        ? ['Herbal tea steam', 'Fresh rain through window'][idx]
                        : 'Clean glass of water'
                    }`}
                    value={groundingAnswers[groundingStep]?.[idx] || ''}
                    onChange={(e) => {
                      const updated = [...(groundingAnswers[groundingStep] || [])];
                      updated[idx] = e.target.value;
                      setGroundingAnswers({ ...groundingAnswers, [groundingStep]: updated });
                    }}
                    className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-emerald-600"
                  />
                </div>
              ))}
            </div>

            {/* Next / Previous Step Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-stone-200">
              <button
                disabled={groundingStep === 5}
                onClick={() => setGroundingStep((s) => Math.min(5, s + 1))}
                className="text-xs font-semibold text-stone-600 hover:text-stone-900 disabled:opacity-40 cursor-pointer"
              >
                ← Back
              </button>

              {groundingStep > 1 ? (
                <button
                  onClick={() => {
                    soundSynth.playChime(528, 1.5);
                    setGroundingStep((s) => s - 1);
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next Sense</span>
                  <span>→</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setGroundingComplete(true);
                    soundSynth.playChime(432, 3);
                    try {
                      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                    } catch {
                      // Ignore
                    }
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Exercise</span>
                </button>
              )}
            </div>
          </div>

          {groundingComplete && (
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-emerald-900 text-xs sm:text-sm flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">You are anchored right here.</span> Your feet are on the floor, you have oxygen in your lungs, and the moment of danger has passed. Take one slow, peaceful breath.
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Progressive Muscle Relaxation (PMR) Tab */}
      {activeTab === 'pmr' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
              Somatic Release Protocol
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mt-2">
              Progressive Muscle Relaxation (PMR)
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 leading-relaxed">
              Anxiety creates subconscious muscular tension that triggers further autonomic alarm. By intentionally contracting and releasing muscle groups, we signal the brain that it is safe to rest.
            </p>
          </div>

          {/* Stepper overview */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {PMR_STEPS.map((s, idx) => (
              <div
                key={s.name}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border ${
                  pmrStep === idx
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : idx < pmrStep
                    ? 'bg-stone-100 text-stone-700 border-stone-200'
                    : 'text-stone-400 border-stone-200'
                }`}
              >
                {idx + 1}. {s.name}
              </div>
            ))}
          </div>

          {/* Interactive PMR Workspace */}
          <div className="bg-stone-900 text-white p-8 rounded-3xl text-center space-y-6 relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest">
                Target Zone ({pmrStep + 1} of {PMR_STEPS.length})
              </span>
              <h3 className="text-2xl font-serif font-bold text-white">
                {PMR_STEPS[pmrStep].name}
              </h3>
            </div>

            {/* Tension vs Release Visual indicator */}
            <div className="flex items-center justify-center">
              <div
                className={`w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-700 ${
                  pmrPhase === 'tense'
                    ? 'bg-rose-950/80 border-2 border-rose-500 text-rose-200 scale-105'
                    : 'bg-emerald-950/80 border-2 border-emerald-400 text-emerald-200 scale-95'
                }`}
              >
                <span className="text-lg font-bold uppercase tracking-wider">
                  {pmrPhase === 'tense' ? 'Tense & Hold' : 'Fully Let Go'}
                </span>
                <span className="text-3xl font-mono font-extrabold mt-1">
                  {pmrTimer}s
                </span>
              </div>
            </div>

            <div className="max-w-lg mx-auto bg-stone-800/80 p-4 rounded-xl border border-stone-700 text-xs sm:text-sm text-stone-200 leading-relaxed">
              {pmrPhase === 'tense'
                ? PMR_STEPS[pmrStep].instruction
                : PMR_STEPS[pmrStep].releaseText}
            </div>

            {/* PMR Controls */}
            <div className="pt-2 flex items-center justify-center gap-3">
              {!pmrIsActive ? (
                <button
                  onClick={() => {
                    setPmrIsActive(true);
                    setPmrPhase('tense');
                    setPmrTimer(7);
                    soundSynth.playChime(432, 2);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-full font-bold text-sm cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Guided PMR</span>
                </button>
              ) : (
                <button
                  onClick={() => setPmrIsActive(false)}
                  className="bg-stone-700 hover:bg-stone-600 text-white px-6 py-2.5 rounded-full font-bold text-sm cursor-pointer flex items-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={() => {
                  setPmrIsActive(false);
                  setPmrStep(0);
                  setPmrPhase('tense');
                  setPmrTimer(7);
                }}
                className="p-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
                title="Reset to beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Ambient Soundscapes Tab */}
      {activeTab === 'soundscapes' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                Procedural Web Audio Engine
              </span>
              <h2 className="text-2xl font-serif font-bold text-stone-900 mt-2">
                Restorative Ambient Soundscapes
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                Synthesized in real-time in your browser. No external audio files or buffering delay.
              </p>
            </div>

            <button
              onClick={stopAllSoundscapes}
              className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <VolumeX className="w-4 h-4 text-stone-500" />
              <span>Stop All Audio</span>
            </button>
          </div>

          {/* Sound cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Rain */}
            <div className={`p-5 rounded-2xl border transition-all ${activeSounds.rain ? 'bg-emerald-50/70 border-emerald-400 shadow-xs' : 'bg-stone-50/70 border-stone-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <CloudRain className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Gentle Rain & Forest Droplets</h4>
                    <p className="text-xs text-stone-500">Soft acoustic frequency masking for deep focus</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSoundscape('rain')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    activeSounds.rain
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {activeSounds.rain ? 'Playing' : 'Play'}
                </button>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Volume1 className="w-4 h-4 text-stone-400" />
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={soundVolumes.rain}
                  onChange={(e) => handleVolumeChange('rain', parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-600 cursor-pointer"
                />
                <span className="text-[11px] text-stone-400 w-8 text-right font-mono">
                  {Math.round(soundVolumes.rain * 100)}%
                </span>
              </div>
            </div>

            {/* 2. Ocean */}
            <div className={`p-5 rounded-2xl border transition-all ${activeSounds.ocean ? 'bg-emerald-50/70 border-emerald-400 shadow-xs' : 'bg-stone-50/70 border-stone-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                    <Waves className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Rhythmic Ocean Swells</h4>
                    <p className="text-xs text-stone-500">8-second tidal cycle synchronizing with slow breathing</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSoundscape('ocean')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    activeSounds.ocean
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {activeSounds.ocean ? 'Playing' : 'Play'}
                </button>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Volume1 className="w-4 h-4 text-stone-400" />
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={soundVolumes.ocean}
                  onChange={(e) => handleVolumeChange('ocean', parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-600 cursor-pointer"
                />
                <span className="text-[11px] text-stone-400 w-8 text-right font-mono">
                  {Math.round(soundVolumes.ocean * 100)}%
                </span>
              </div>
            </div>

            {/* 3. Forest Wind */}
            <div className={`p-5 rounded-2xl border transition-all ${activeSounds.forest_wind ? 'bg-emerald-50/70 border-emerald-400 shadow-xs' : 'bg-stone-50/70 border-stone-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Trees className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Canopy Wind & Pines</h4>
                    <p className="text-xs text-stone-500">Warm breeze shifting through highland tree branches</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSoundscape('forest_wind')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    activeSounds.forest_wind
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {activeSounds.forest_wind ? 'Playing' : 'Play'}
                </button>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Volume1 className="w-4 h-4 text-stone-400" />
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={soundVolumes.forest_wind}
                  onChange={(e) => handleVolumeChange('forest_wind', parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-600 cursor-pointer"
                />
                <span className="text-[11px] text-stone-400 w-8 text-right font-mono">
                  {Math.round(soundVolumes.forest_wind * 100)}%
                </span>
              </div>
            </div>

            {/* 4. Pink Noise */}
            <div className={`p-5 rounded-2xl border transition-all ${activeSounds.pink_noise ? 'bg-emerald-50/70 border-emerald-400 shadow-xs' : 'bg-stone-50/70 border-stone-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Deep Pink Noise</h4>
                    <p className="text-xs text-stone-500">1/f octave power distribution clinically shown to promote slow-wave sleep</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSoundscape('pink_noise')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    activeSounds.pink_noise
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {activeSounds.pink_noise ? 'Playing' : 'Play'}
                </button>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Volume1 className="w-4 h-4 text-stone-400" />
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={soundVolumes.pink_noise}
                  onChange={(e) => handleVolumeChange('pink_noise', parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-600 cursor-pointer"
                />
                <span className="text-[11px] text-stone-400 w-8 text-right font-mono">
                  {Math.round(soundVolumes.pink_noise * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
