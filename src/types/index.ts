export type MoodValence = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  valence: MoodValence; // 1: Overwhelmed, 2: Low, 3: Neutral, 4: Good, 5: Radiant
  emotions: string[];
  energy: number; // 1 - 10
  stress: number; // 1 - 10
  sleepHours: number;
  influences: string[]; // e.g., 'Work', 'Family', 'Sleep', 'Exercise', 'Health', 'Social'
  note?: string;
}

export interface CBTThoughtRecord {
  situation: string;
  automaticThought: string;
  distortion: string; // e.g., 'Catastrophizing', 'All-or-Nothing', 'Mind Reading'
  distressLevelBefore: number; // 1-10
  evidenceFor: string;
  evidenceAgainst: string;
  rationalResponse: string;
  distressLevelAfter: number; // 1-10
}

export interface JournalEntry {
  id: string;
  date: string;
  timestamp: number;
  title: string;
  promptCategory: 'gratitude' | 'cbt' | 'reflection' | 'anxiety' | 'freewrite' | 'self-compassion';
  promptTitle?: string;
  content: string;
  cbtRecord?: CBTThoughtRecord;
  tags: string[];
  valenceRating?: MoodValence;
  isFavorite?: boolean;
}

export interface JournalPrompt {
  id: string;
  category: 'gratitude' | 'cbt' | 'reflection' | 'anxiety' | 'freewrite' | 'self-compassion';
  title: string;
  description: string;
  questions: string[];
  isCBT?: boolean;
}

export interface Counsellor {
  id: string;
  name: string;
  title: string;
  credentials: string; // e.g. "Licensed Clinical Psychologist, PhD"
  avatar: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  hourlyRateUSD: number;
  slidingScaleAvailable: boolean;
  specialties: string[];
  languages: string[];
  modalities: ('video' | 'voice' | 'chat')[];
  approach: string[]; // e.g. "CBT", "ACT", "Trauma-Informed", "Mindfulness"
  location: string;
  verified: boolean;
  bio: string;
  education: string;
  availableDays: string[];
  timeSlots: string[];
}

export interface PeerCircle {
  id: string;
  title: string;
  topic: string;
  description: string;
  meetingTime: string;
  schedulePattern: string; // e.g. "Every Tuesday & Friday, 6:00 PM GMT"
  facilitatorName: string;
  facilitatorCredentials: string;
  activeMembersCount: number;
  maxCapacity: number;
  isLiveNow: boolean;
  tags: string[];
  groundRules: string[];
}

export interface PeerMessage {
  id: string;
  circleId: string;
  senderName: string;
  isAnonymous: boolean;
  isFacilitator?: boolean;
  text: string;
  timestamp: string;
  reactions: {
    heart: number;
    hug: number;
    breathe: number;
    insight: number;
  };
}

export interface EducationalArticle {
  id: string;
  title: string;
  category: 'Anxiety & Panic' | 'CBT & Cognitive' | 'DBT & Distress' | 'Sleep & Rest' | 'Work & Burnout' | 'Relationships';
  readTime: string;
  author: string;
  authorCredentials: string;
  summary: string;
  tags: string[];
  sections: {
    heading: string;
    content: string;
    tips?: string[];
  }[];
  clinicalReviewDate: string;
}

export interface CrisisContact {
  id: string;
  region: string;
  country: string;
  flag: string;
  serviceName: string;
  phone: string;
  sms?: string;
  hours: string;
  cost: string;
  description: string;
  languages: string[];
  website?: string;
}

export interface SafetyPlan {
  warningSigns: string[];
  internalCoping: string[];
  distractionPlaces: string[];
  supportPeople: { name: string; contact: string; relationship: string }[];
  professionalContacts: { name: string; phone: string; service: string }[];
  safeEnvironment: string[];
  lastUpdated: string;
}

export interface BookingRecord {
  id: string;
  counsellorId: string;
  counsellorName: string;
  counsellorAvatar: string;
  sessionDate: string;
  sessionTime: string;
  modality: 'video' | 'voice' | 'chat';
  clientName: string;
  clientEmail: string;
  clientNotes: string;
  feePaid: number;
  isSlidingScale: boolean;
  createdAt: string;
  meetingLink: string;
  status: 'confirmed' | 'completed' | 'cancelled';
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'breathing' | 'journal' | 'learning' | 'somatic' | 'community' | 'security';
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
}

export interface PointsActivity {
  id: string;
  action: string;
  points: number;
  category: 'journal' | 'exercise' | 'learning' | 'mood' | 'peer' | 'milestone';
  timestamp: number;
  date: string;
}

export interface GamificationStats {
  totalPoints: number;
  level: number;
  levelTitle: string;
  pointsToNextLevel: number;
  levelProgressPercent: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  activityHistory: PointsActivity[];
  badges: Badge[];
  activityCounts: {
    journalEntries: number;
    breathingSessions: number;
    groundingCompleted: number;
    pmrCompleted: number;
    articlesRead: number;
    screenersTaken: number;
    moodCheckins: number;
    peerReactions: number;
  };
}

export interface NotificationReminder {
  id: string;
  title: string;
  time: string; // HH:MM format
  category: 'journal' | 'mood' | 'exercise' | 'manifesto' | 'checkin';
  enabled: boolean;
  days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
  message: string;
  soundEnabled: boolean;
}

export interface CommunityMember {
  id: string;
  name: string;
  county: string;
  role: 'Member' | 'Peer Supporter' | 'Student' | 'Healthcare Ally' | 'Educator';
  avatarInitials: string;
  joinedDate: string;
  notificationSubscribed: boolean;
  pledgeText?: string;
  isVerified?: boolean;
}

export interface CommunityUpdate {
  id: string;
  version: string;
  title: string;
  summary: string;
  date: string;
  type: 'feature' | 'milestone' | 'event' | 'founder_letter';
  author: string;
  tags: string[];
}

export interface PayoutTransaction {
  id: string;
  date: string;
  timestamp: number;
  type: 'subscription_inflow' | 'agent_withdrawal' | 'atm_withdrawal' | 'bank_transfer' | 'manual_adjustment';
  amountKES: number;
  description: string;
  referenceNumber: string; // M-Pesa receipt or transaction ID
  status: 'completed' | 'pending';
  destination?: string; // e.g. "Agent Till 238192", "Equity Bank 0110...", "Cash in Hand"
}

export interface ManifestoPledge {
  id: string;
  fullName: string;
  county: string;
  signedAt: string;
  timestamp: number;
  commitmentNote?: string;
}
