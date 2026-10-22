// AfyaMind 2036 Push Notification & Audio Chime Service
import { NotificationReminder } from '../types';
import { storage } from './storage';

export const notificationService = {
  // Check permission status
  getPermission(): NotificationPermission {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  },

  // Request browser push notification permission
  async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  },

  // Synthesize a calming, gentle Tibetan chime using Web Audio API
  playChime(): void {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Fundamental harmonic frequencies for gentle mindfulness bell
      const freqs = [528, 792, 1056]; // Solfeggio 528Hz love/peace frequency
      const now = ctx.currentTime;

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const initialVol = 0.15 / (idx + 1);
        gain.gain.setValueAtTime(initialVol, now);
        // Long smooth exponential decay
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 2.5);
      });
    } catch (e) {
      console.warn('Audio chime notice:', e);
    }
  },

  // Send immediate native push notification
  async sendPushNotification(options: {
    title: string;
    body: string;
    url?: string;
    playSound?: boolean;
  }): Promise<boolean> {
    if (options.playSound !== false) {
      this.playChime();
    }

    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    if (Notification.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return false;
    }

    const title = options.title;
    const notificationOptions = {
      body: options.body,
      icon: '/pwa-192x192.png',
      badge: '/icon.svg',
      tag: 'afyamind-alert-' + Date.now(),
      data: {
        url: options.url || '/',
        timestamp: Date.now(),
      },
    };

    // Try service worker registration first
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration && registration.showNotification) {
          await registration.showNotification(title, notificationOptions);
          return true;
        }
      } catch (err) {
        console.warn('SW showNotification fallback:', err);
      }
    }

    // Direct Notification fallback
    try {
      const notif = new Notification(title, notificationOptions);
      notif.onclick = () => {
        window.focus();
        if (options.url) {
          window.location.hash = options.url;
        }
      };
      return true;
    } catch (err) {
      console.warn('Direct notification fallback error:', err);
      return false;
    }
  },

  // Dedicated Mashujaa Day Founder Philosophy Broadcast Notification
  async sendMashujaaDayNotification(): Promise<boolean> {
    return this.sendPushNotification({
      title: '🇰🇪 Heri ya Siku ya Mashujaa! — AfyaMind 2036',
      body: '"Ushujaa wa kweli huanzia ndani ya akili." — Founder Nikolass Willy Mtunga honors all members and everyday mental resilience heroes today!',
      url: '/?tab=dashboard#mashujaa',
      playSound: true,
    });
  },

  // Last dispatched minute tracker to prevent multi-firing within the same minute
  lastFiredMinute: '',

  // Poll active reminders to see if current HH:MM matches
  checkDueReminders(onTrigger?: (reminder: NotificationReminder) => void): void {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentHHMM = `${hours}:${minutes}`;

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
    const currentDay = daysOfWeek[now.getDay()];

    const minuteKey = `${currentDay}-${currentHHMM}`;
    if (this.lastFiredMinute === minuteKey) {
      return; // Already checked and fired in this minute
    }

    const reminders = storage.getReminders();
    for (const rem of reminders) {
      if (rem.enabled && rem.time === currentHHMM && rem.days.includes(currentDay)) {
        this.lastFiredMinute = minuteKey;
        this.sendPushNotification({
          title: `AfyaMind 2036: ${rem.title}`,
          body: rem.message,
          playSound: rem.soundEnabled,
          url: `/?tab=${rem.category === 'journal' ? 'journal' : rem.category === 'mood' ? 'mood' : rem.category === 'exercise' ? 'exercises' : 'manifesto'}`,
        });

        if (onTrigger) {
          onTrigger(rem);
        }
        break;
      }
    }
  },
};
