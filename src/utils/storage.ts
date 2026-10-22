import {
  BookingRecord,
  JournalEntry,
  MoodEntry,
  SafetyPlan,
  NotificationReminder,
  CommunityMember,
  CommunityUpdate,
  PayoutTransaction,
  ManifestoPledge,
} from '../types';
import {
  DEFAULT_SAFETY_PLAN,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_MOOD_ENTRIES,
  INITIAL_NOTIFICATION_REMINDERS,
  INITIAL_COMMUNITY_MEMBERS,
  INITIAL_COMMUNITY_UPDATES,
  INITIAL_PAYOUT_TRANSACTIONS,
} from '../data/mockData';

const KEYS = {
  MOODS: 'afyamind_moods_v1',
  JOURNALS: 'afyamind_journals_v1',
  SAFETY_PLAN: 'afyamind_safety_plan_v1',
  BOOKINGS: 'afyamind_bookings_v1',
  VAULT_PIN: 'afyamind_vault_pin_v1',
  VAULT_LOCKED: 'afyamind_vault_locked_v1',
  ANONYMOUS_NAME: 'afyamind_anon_handle_v1',
  ACCESS_PASS: 'afyamind_mpesa_pass_v1',
  REMINDERS: 'afyamind_reminders_v1',
  COMMUNITY_MEMBERS: 'afyamind_community_members_v1',
  COMMUNITY_UPDATES: 'afyamind_community_updates_v1',
  PAYOUT_TRANSACTIONS: 'afyamind_payout_tx_v1',
  MANIFESTO_PLEDGES: 'afyamind_manifesto_pledges_v1',
  FOUNDER_PAYOUT_PIN: 'afyamind_founder_payout_pin_v1',
};

export interface MpesaPass {
  isUnlocked: boolean;
  tier: 'day' | 'month' | 'lifetime';
  tierName: string;
  amountKES: number;
  recipientMpesaNumber: string;
  payerPhone: string;
  transactionCode: string;
  unlockedAt: string;
  expiresAt?: string;
}

export const storage = {
  // Moods
  getMoods(): MoodEntry[] {
    try {
      const data = localStorage.getItem(KEYS.MOODS);
      if (!data) {
        localStorage.setItem(KEYS.MOODS, JSON.stringify(INITIAL_MOOD_ENTRIES));
        return INITIAL_MOOD_ENTRIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MOOD_ENTRIES;
    }
  },

  saveMood(entry: MoodEntry): MoodEntry[] {
    const moods = this.getMoods();
    const updated = [entry, ...moods.filter((m) => m.id !== entry.id)];
    localStorage.setItem(KEYS.MOODS, JSON.stringify(updated));
    return updated;
  },

  deleteMood(id: string): MoodEntry[] {
    const moods = this.getMoods().filter((m) => m.id !== id);
    localStorage.setItem(KEYS.MOODS, JSON.stringify(moods));
    return moods;
  },

  // Journals
  getJournals(): JournalEntry[] {
    try {
      const data = localStorage.getItem(KEYS.JOURNALS);
      if (!data) {
        localStorage.setItem(KEYS.JOURNALS, JSON.stringify(INITIAL_JOURNAL_ENTRIES));
        return INITIAL_JOURNAL_ENTRIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_JOURNAL_ENTRIES;
    }
  },

  saveJournal(entry: JournalEntry): JournalEntry[] {
    const journals = this.getJournals();
    const existingIndex = journals.findIndex((j) => j.id === entry.id);
    let updated: JournalEntry[];
    if (existingIndex >= 0) {
      updated = [...journals];
      updated[existingIndex] = entry;
    } else {
      updated = [entry, ...journals];
    }
    localStorage.setItem(KEYS.JOURNALS, JSON.stringify(updated));
    return updated;
  },

  deleteJournal(id: string): JournalEntry[] {
    const journals = this.getJournals().filter((j) => j.id !== id);
    localStorage.setItem(KEYS.JOURNALS, JSON.stringify(journals));
    return journals;
  },

  toggleFavoriteJournal(id: string): JournalEntry[] {
    const journals = this.getJournals().map((j) =>
      j.id === id ? { ...j, isFavorite: !j.isFavorite } : j
    );
    localStorage.setItem(KEYS.JOURNALS, JSON.stringify(journals));
    return journals;
  },

  // Safety Plan
  getSafetyPlan(): SafetyPlan {
    try {
      const data = localStorage.getItem(KEYS.SAFETY_PLAN);
      if (!data) {
        localStorage.setItem(KEYS.SAFETY_PLAN, JSON.stringify(DEFAULT_SAFETY_PLAN));
        return DEFAULT_SAFETY_PLAN;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_SAFETY_PLAN;
    }
  },

  saveSafetyPlan(plan: SafetyPlan): SafetyPlan {
    localStorage.setItem(KEYS.SAFETY_PLAN, JSON.stringify(plan));
    return plan;
  },

  // Bookings
  getBookings(): BookingRecord[] {
    try {
      const data = localStorage.getItem(KEYS.BOOKINGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveBooking(booking: BookingRecord): BookingRecord[] {
    const current = this.getBookings();
    const updated = [booking, ...current];
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(updated));
    return updated;
  },

  cancelBooking(id: string): BookingRecord[] {
    const current = this.getBookings().map((b) =>
      b.id === id ? { ...b, status: 'cancelled' as const } : b
    );
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(current));
    return current;
  },

  // Vault Security PIN
  getVaultPin(): string | null {
    return localStorage.getItem(KEYS.VAULT_PIN);
  },

  setVaultPin(pin: string): void {
    // In a real app we would use Web Crypto API pbkdf2; for local vault mockup, we hash
    const simpleHash = btoa(`afyamind_${pin}_salt`);
    localStorage.setItem(KEYS.VAULT_PIN, simpleHash);
  },

  clearVaultPin(): void {
    localStorage.removeItem(KEYS.VAULT_PIN);
  },

  verifyVaultPin(pin: string): boolean {
    const stored = this.getVaultPin();
    if (!stored) return true;
    const testHash = btoa(`afyamind_${pin}_salt`);
    return stored === testHash;
  },

  // Anonymous Handle for Peer Support
  getAnonymousHandle(): string {
    let handle = localStorage.getItem(KEYS.ANONYMOUS_NAME);
    if (!handle) {
      const adjectives = ['Gentle', 'Quiet', 'Patient', 'Healing', 'Serene', 'Kind', 'Grounded', 'Courageous'];
      const nouns = ['Fern', 'River', 'Sparrow', 'Breeze', 'Anchor', 'Horizon', 'Willow', 'Pine'];
      handle = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;
      localStorage.setItem(KEYS.ANONYMOUS_NAME, handle);
    }
    return handle;
  },

  setAnonymousHandle(handle: string): void {
    localStorage.setItem(KEYS.ANONYMOUS_NAME, handle.trim());
  },

  // Full export
  exportDataJSON(): string {
    const exportObject = {
      appName: 'AfyaMind Mental Wellness',
      exportedAt: new Date().toISOString(),
      privacyNote: 'This file contains your private local mental wellness records. Store in a safe location.',
      moodEntries: this.getMoods(),
      journalEntries: this.getJournals(),
      safetyPlan: this.getSafetyPlan(),
      counsellingBookings: this.getBookings(),
    };
    return JSON.stringify(exportObject, null, 2);
  },

  // M-Pesa Access Pass
  getAccessPass(): MpesaPass | null {
    try {
      const data = localStorage.getItem(KEYS.ACCESS_PASS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveAccessPass(pass: MpesaPass): void {
    localStorage.setItem(KEYS.ACCESS_PASS, JSON.stringify(pass));
  },

  revokeAccessPass(): void {
    localStorage.removeItem(KEYS.ACCESS_PASS);
  },

  // Push Notification Reminders
  getReminders(): NotificationReminder[] {
    try {
      const data = localStorage.getItem(KEYS.REMINDERS);
      if (!data) {
        localStorage.setItem(KEYS.REMINDERS, JSON.stringify(INITIAL_NOTIFICATION_REMINDERS));
        return INITIAL_NOTIFICATION_REMINDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTIFICATION_REMINDERS;
    }
  },

  saveReminders(reminders: NotificationReminder[]): void {
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
  },

  toggleReminder(id: string): NotificationReminder[] {
    const reminders = this.getReminders().map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    this.saveReminders(reminders);
    return reminders;
  },

  addReminder(reminder: NotificationReminder): NotificationReminder[] {
    const reminders = [...this.getReminders(), reminder];
    this.saveReminders(reminders);
    return reminders;
  },

  deleteReminder(id: string): NotificationReminder[] {
    const reminders = this.getReminders().filter((r) => r.id !== id);
    this.saveReminders(reminders);
    return reminders;
  },

  // Community Members & Roster
  getCommunityMembers(): CommunityMember[] {
    try {
      const data = localStorage.getItem(KEYS.COMMUNITY_MEMBERS);
      if (!data) {
        localStorage.setItem(KEYS.COMMUNITY_MEMBERS, JSON.stringify(INITIAL_COMMUNITY_MEMBERS));
        return INITIAL_COMMUNITY_MEMBERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_COMMUNITY_MEMBERS;
    }
  },

  addCommunityMember(member: CommunityMember): CommunityMember[] {
    const members = [member, ...this.getCommunityMembers().filter((m) => m.id !== member.id)];
    localStorage.setItem(KEYS.COMMUNITY_MEMBERS, JSON.stringify(members));
    return members;
  },

  // Community Updates & Changelog
  getCommunityUpdates(): CommunityUpdate[] {
    try {
      const data = localStorage.getItem(KEYS.COMMUNITY_UPDATES);
      if (!data) {
        localStorage.setItem(KEYS.COMMUNITY_UPDATES, JSON.stringify(INITIAL_COMMUNITY_UPDATES));
        return INITIAL_COMMUNITY_UPDATES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_COMMUNITY_UPDATES;
    }
  },

  addCommunityUpdate(update: CommunityUpdate): CommunityUpdate[] {
    const updates = [update, ...this.getCommunityUpdates().filter((u) => u.id !== update.id)];
    localStorage.setItem(KEYS.COMMUNITY_UPDATES, JSON.stringify(updates));
    return updates;
  },

  // Payout & Revenue Transactions
  getPayoutTransactions(): PayoutTransaction[] {
    try {
      const data = localStorage.getItem(KEYS.PAYOUT_TRANSACTIONS);
      if (!data) {
        localStorage.setItem(KEYS.PAYOUT_TRANSACTIONS, JSON.stringify(INITIAL_PAYOUT_TRANSACTIONS));
        return INITIAL_PAYOUT_TRANSACTIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PAYOUT_TRANSACTIONS;
    }
  },

  recordPayoutTransaction(tx: PayoutTransaction): PayoutTransaction[] {
    const txs = [tx, ...this.getPayoutTransactions().filter((t) => t.id !== tx.id)];
    localStorage.setItem(KEYS.PAYOUT_TRANSACTIONS, JSON.stringify(txs));
    return txs;
  },

  // Manifesto Pledges
  getManifestoPledges(): ManifestoPledge[] {
    try {
      const data = localStorage.getItem(KEYS.MANIFESTO_PLEDGES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  signManifestoPledge(pledge: ManifestoPledge): ManifestoPledge[] {
    const pledges = [pledge, ...this.getManifestoPledges().filter((p) => p.id !== pledge.id)];
    localStorage.setItem(KEYS.MANIFESTO_PLEDGES, JSON.stringify(pledges));
    return pledges;
  },

  // Founder Payout PIN (Master: "2036")
  getFounderPayoutPin(): string {
    return localStorage.getItem(KEYS.FOUNDER_PAYOUT_PIN) || '2036';
  },

  setFounderPayoutPin(pin: string): void {
    localStorage.setItem(KEYS.FOUNDER_PAYOUT_PIN, pin);
  },

  // Erase all data
  clearAllUserData(): void {
    localStorage.removeItem(KEYS.MOODS);
    localStorage.removeItem(KEYS.JOURNALS);
    localStorage.removeItem(KEYS.SAFETY_PLAN);
    localStorage.removeItem(KEYS.BOOKINGS);
    localStorage.removeItem(KEYS.VAULT_PIN);
    localStorage.removeItem(KEYS.ANONYMOUS_NAME);
    localStorage.removeItem(KEYS.ACCESS_PASS);
    localStorage.removeItem(KEYS.REMINDERS);
    localStorage.removeItem(KEYS.COMMUNITY_MEMBERS);
    localStorage.removeItem(KEYS.COMMUNITY_UPDATES);
    localStorage.removeItem(KEYS.PAYOUT_TRANSACTIONS);
    localStorage.removeItem(KEYS.MANIFESTO_PLEDGES);
  },
};
