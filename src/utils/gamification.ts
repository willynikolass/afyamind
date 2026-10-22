import { Badge, GamificationStats, PointsActivity } from '../types';
import { soundSynth } from './audioSynth';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'afyamind_gamification_v1';

export const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Seedling of Serenity', minPoints: 0, maxPoints: 150, perk: 'Basic Soundscapes & Breathing' },
  { level: 2, title: 'Sprouting Awareness', minPoints: 150, maxPoints: 350, perk: 'Unlocked Pink Noise & Guided CBT Templates' },
  { level: 3, title: 'Grounded Willow', minPoints: 350, maxPoints: 650, perk: 'Unlocked Tibetan Singing Bowl & Peer Circle Reactions' },
  { level: 4, title: 'Resilient Canopy', minPoints: 650, maxPoints: 1100, perk: 'Sliding Scale Priority & Deep Somatics' },
  { level: 5, title: 'Master of Stillness', minPoints: 1100, maxPoints: 999999, perk: 'Guardian Badge & Community Care Mentor' },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'streak-7',
    title: '7-Day Anchor',
    description: 'Complete 7 consecutive days of emotional check-ins or reflections.',
    icon: '🔥',
    category: 'streak',
    progress: 6, // Starter default close to completion
    maxProgress: 7,
    xpReward: 100,
  },
  {
    id: 'breath-master',
    title: 'Breath Master',
    description: 'Complete 5 paced breathing sessions with the visualizer orb.',
    icon: '🌬️',
    category: 'breathing',
    progress: 2,
    maxProgress: 5,
    xpReward: 60,
  },
  {
    id: 'cbt-reframer',
    title: 'Cognitive Reframer',
    description: 'Deconstruct and reframe an automatic negative thought using the CBT Thought Record.',
    icon: '🧠',
    category: 'journal',
    progress: 1,
    maxProgress: 1,
    unlockedAt: '2026-10-18',
    xpReward: 50,
  },
  {
    id: 'somatic-anchor',
    title: 'Somatic Grounder',
    description: 'Complete all 5 stages of the 5-4-3-2-1 sensory grounding exercise.',
    icon: '🌿',
    category: 'somatic',
    progress: 0,
    maxProgress: 1,
    xpReward: 40,
  },
  {
    id: 'pmr-explorer',
    title: 'Tension Dissolver',
    description: 'Release deep somatic tension by completing a Progressive Muscle Relaxation cycle.',
    icon: '✨',
    category: 'somatic',
    progress: 0,
    maxProgress: 1,
    xpReward: 45,
  },
  {
    id: 'mindful-reader',
    title: 'Mindful Scholar',
    description: 'Read 3 evidence-based psychoeducation articles from our clinical library.',
    icon: '📖',
    category: 'learning',
    progress: 1,
    maxProgress: 3,
    xpReward: 50,
  },
  {
    id: 'screener-step',
    title: 'Self-Awareness Seeker',
    description: 'Take the PHQ-4 emotional well-being check-in for personal insight.',
    icon: '🧭',
    category: 'learning',
    progress: 0,
    maxProgress: 1,
    xpReward: 30,
  },
  {
    id: 'circle-supporter',
    title: 'Community Ally',
    description: 'Share 3 supportive empathetic reactions with peers in live circles.',
    icon: '🫂',
    category: 'community',
    progress: 1,
    maxProgress: 3,
    xpReward: 35,
  },
  {
    id: 'safety-guardian',
    title: 'Sanctuary Guardian',
    description: 'Personalize your Stanley-Brown safety plan or enable Private Vault PIN security.',
    icon: '🛡️',
    category: 'security',
    progress: 1,
    maxProgress: 1,
    unlockedAt: '2026-10-17',
    xpReward: 40,
  },
];

export const INITIAL_STATS: GamificationStats = {
  totalPoints: 215,
  level: 2,
  levelTitle: 'Sprouting Awareness',
  pointsToNextLevel: 135,
  levelProgressPercent: 32,
  currentStreak: 6,
  longestStreak: 6,
  lastActiveDate: '2026-10-19',
  activityHistory: [
    {
      id: 'pa-1',
      action: 'Daily Mood Check-in',
      points: 20,
      category: 'mood',
      timestamp: Date.now() - 3600000,
      date: '2026-10-19',
    },
    {
      id: 'pa-2',
      action: 'CBT Thought Record Completed',
      points: 40,
      category: 'journal',
      timestamp: Date.now() - 86400000,
      date: '2026-10-18',
    },
    {
      id: 'pa-3',
      action: 'Unlocked "Cognitive Reframer" Badge',
      points: 50,
      category: 'milestone',
      timestamp: Date.now() - 86400000,
      date: '2026-10-18',
    },
    {
      id: 'pa-4',
      action: 'Unlocked "Sanctuary Guardian" Badge',
      points: 40,
      category: 'milestone',
      timestamp: Date.now() - 2 * 86400000,
      date: '2026-10-17',
    },
  ],
  badges: INITIAL_BADGES,
  activityCounts: {
    journalEntries: 2,
    breathingSessions: 2,
    groundingCompleted: 0,
    pmrCompleted: 0,
    articlesRead: 1,
    screenersTaken: 0,
    moodCheckins: 6,
    peerReactions: 1,
  },
};

export interface RewardResult {
  pointsAdded: number;
  newBadges: Badge[];
  didLevelUp: boolean;
  newLevelTitle?: string;
}

class GamificationManager {
  private listeners: ((stats: GamificationStats) => void)[] = [];

  getStats(): GamificationStats {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATS));
        return INITIAL_STATS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_STATS;
    }
  }

  saveStats(stats: GamificationStats) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    this.notify(stats);
  }

  subscribe(listener: (stats: GamificationStats) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(stats: GamificationStats) {
    this.listeners.forEach((l) => l(stats));
  }

  calculateLevel(points: number): {
    level: number;
    levelTitle: string;
    pointsToNextLevel: number;
    levelProgressPercent: number;
  } {
    let currentTier = LEVEL_THRESHOLDS[0];
    for (const t of LEVEL_THRESHOLDS) {
      if (points >= t.minPoints) {
        currentTier = t;
      }
    }

    const range = currentTier.maxPoints - currentTier.minPoints;
    const pointsInLevel = Math.max(0, points - currentTier.minPoints);
    const percent = Math.min(100, Math.round((pointsInLevel / range) * 100));
    const toNext = Math.max(0, currentTier.maxPoints - points);

    return {
      level: currentTier.level,
      levelTitle: currentTier.title,
      pointsToNextLevel: toNext,
      levelProgressPercent: percent,
    };
  }

  updateStreak(stats: GamificationStats): { currentStreak: number; longestStreak: number; streakUpdated: boolean } {
    const today = new Date().toISOString().split('T')[0];
    if (stats.lastActiveDate === today) {
      return {
        currentStreak: stats.currentStreak,
        longestStreak: stats.longestStreak,
        streakUpdated: false,
      };
    }

    const last = new Date(stats.lastActiveDate);
    const now = new Date(today);
    const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 3600 * 24));

    let newCurrent = stats.currentStreak;
    if (diffDays === 1) {
      newCurrent += 1;
    } else if (diffDays > 1) {
      // Gentle restart at 1
      newCurrent = 1;
    }

    const newLongest = Math.max(stats.longestStreak, newCurrent);
    return {
      currentStreak: newCurrent,
      longestStreak: newLongest,
      streakUpdated: true,
    };
  }

  /**
   * Main reward dispatcher: Awards points, increments activity, checks streak, and unlocks badges.
   */
  awardActivity(
    actionName: string,
    points: number,
    category: PointsActivity['category'],
    activityKey?: keyof GamificationStats['activityCounts']
  ): RewardResult {
    const current = this.getStats();
    const today = new Date().toISOString().split('T')[0];
    const prevLevel = current.level;

    // 1. Update streak
    const streakResult = this.updateStreak(current);

    // 2. Increment activity count if provided
    const counts = { ...current.activityCounts };
    if (activityKey && counts[activityKey] !== undefined) {
      counts[activityKey] += 1;
    }

    // 3. Check badge progression & unlock new badges
    let newlyUnlockedBadges: Badge[] = [];
    let badgeBonusPoints = 0;

    const updatedBadges = current.badges.map((b) => {
      if (b.unlockedAt) return b; // Already unlocked

      let newProgress = b.progress;
      if (b.id === 'streak-7') {
        newProgress = streakResult.currentStreak;
      } else if (b.id === 'breath-master' && activityKey === 'breathingSessions') {
        newProgress = counts.breathingSessions;
      } else if (b.id === 'cbt-reframer' && actionName.includes('CBT')) {
        newProgress = 1;
      } else if (b.id === 'somatic-anchor' && actionName.includes('Grounding')) {
        newProgress = 1;
      } else if (b.id === 'pmr-explorer' && actionName.includes('PMR')) {
        newProgress = 1;
      } else if (b.id === 'mindful-reader' && activityKey === 'articlesRead') {
        newProgress = counts.articlesRead;
      } else if (b.id === 'screener-step' && activityKey === 'screenersTaken') {
        newProgress = 1;
      } else if (b.id === 'circle-supporter' && activityKey === 'peerReactions') {
        newProgress = counts.peerReactions;
      } else if (b.id === 'safety-guardian' && actionName.includes('Safety')) {
        newProgress = 1;
      }

      const unlocked = newProgress >= b.maxProgress;
      if (unlocked && !b.unlockedAt) {
        newlyUnlockedBadges.push({
          ...b,
          progress: b.maxProgress,
          unlockedAt: today,
        });
        badgeBonusPoints += b.xpReward;
        return {
          ...b,
          progress: b.maxProgress,
          unlockedAt: today,
        };
      }

      return {
        ...b,
        progress: Math.min(b.maxProgress, newProgress),
      };
    });

    const totalNewPoints = points + badgeBonusPoints;
    const finalPoints = current.totalPoints + totalNewPoints;
    const levelInfo = this.calculateLevel(finalPoints);
    const didLevelUp = levelInfo.level > prevLevel;

    // 4. Record in activity history
    const newActivity: PointsActivity = {
      id: `pa_${Date.now()}`,
      action: actionName,
      points,
      category,
      timestamp: Date.now(),
      date: today,
    };

    const newHistory = [newActivity];
    if (newlyUnlockedBadges.length > 0) {
      newlyUnlockedBadges.forEach((b) => {
        newHistory.push({
          id: `pa_badge_${b.id}_${Date.now()}`,
          action: `Unlocked "${b.title}" Milestone!`,
          points: b.xpReward,
          category: 'milestone',
          timestamp: Date.now(),
          date: today,
        });
      });
    }

    const updatedStats: GamificationStats = {
      totalPoints: finalPoints,
      level: levelInfo.level,
      levelTitle: levelInfo.levelTitle,
      pointsToNextLevel: levelInfo.pointsToNextLevel,
      levelProgressPercent: levelInfo.levelProgressPercent,
      currentStreak: streakResult.currentStreak,
      longestStreak: streakResult.longestStreak,
      lastActiveDate: today,
      activityHistory: [...newHistory, ...current.activityHistory].slice(0, 40),
      badges: updatedBadges,
      activityCounts: counts,
    };

    this.saveStats(updatedStats);

    // Audio & Visual celebratory feedback
    try {
      if (didLevelUp || newlyUnlockedBadges.length > 0) {
        soundSynth.playChime(528, 2.5);
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#059669', '#10B981', '#F59E0B', '#6366F1'],
        });
      } else {
        soundSynth.playChime(432, 1.2);
      }
    } catch {
      // Ignore
    }

    return {
      pointsAdded: totalNewPoints,
      newBadges: newlyUnlockedBadges,
      didLevelUp,
      newLevelTitle: didLevelUp ? levelInfo.levelTitle : undefined,
    };
  }
}

export const gamification = new GamificationManager();
