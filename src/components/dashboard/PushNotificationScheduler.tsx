import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Bell,
  BellRing,
  Clock,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  Smartphone,
  Calendar,
  Flame,
  ShieldCheck,
  TrendingUp,
  X,
  Play,
} from 'lucide-react';
import { NotificationReminder } from '../../types';
import { storage } from '../../utils/storage';
import { notificationService } from '../../utils/notificationService';

interface PushNotificationSchedulerProps {
  onNavigate?: (tab: string) => void;
}

export const PushNotificationScheduler: React.FC<PushNotificationSchedulerProps> = ({
  onNavigate,
}) => {
  const [reminders, setReminders] = useState<NotificationReminder[]>(() =>
    storage.getReminders()
  );
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    notificationService.getPermission()
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [testSentNotice, setTestSentNotice] = useState('');

  // Add reminder form state
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00');
  const [newCategory, setNewCategory] = useState<NotificationReminder['category']>('journal');
  const [newMessage, setNewMessage] = useState('');
  const [newSound, setNewSound] = useState(true);

  // Toggle reminder on/off
  const handleToggle = (id: string) => {
    const updated = storage.toggleReminder(id);
    setReminders(updated);
  };

  // Delete reminder
  const handleDelete = (id: string) => {
    const updated = storage.deleteReminder(id);
    setReminders(updated);
  };

  // Request browser permission
  const handleEnablePermission = async () => {
    const granted = await notificationService.requestPermission();
    setPermission(notificationService.getPermission());
    if (granted) {
      notificationService.sendPushNotification({
        title: 'AfyaMind 2036 Reminders Enabled',
        body: 'Daily check-in reminders and journaling alerts will now appear on your screen.',
        playSound: true,
      });
      setTestSentNotice('✓ Notifications granted & test alert dispatched!');
    } else {
      setTestSentNotice('Browser permission was not granted. Please check browser site settings.');
    }
    setTimeout(() => setTestSentNotice(''), 4000);
  };

  // Test sound and push notification
  const handleTestChimeAndNotification = async (reminder?: NotificationReminder) => {
    const title = reminder ? reminder.title : 'Daily CBT Journaling Check-In';
    const message = reminder
      ? reminder.message
      : 'Take 2 minutes to release today’s mental weight and record one small gratitude.';

    const success = await notificationService.sendPushNotification({
      title: `AfyaMind: ${title}`,
      body: message,
      playSound: reminder ? reminder.soundEnabled : true,
      url: reminder ? `/?tab=${reminder.category}` : '/?tab=journal',
    });

    setPermission(notificationService.getPermission());
    if (success) {
      setTestSentNotice('✓ Notification & gentle Tibetan chime sent to device!');
    } else {
      setTestSentNotice('Chime played. Click "Enable Push" to show banners when app is minimized.');
    }
    setTimeout(() => setTestSentNotice(''), 3500);
  };

  // Add custom reminder
  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRem: NotificationReminder = {
      id: `rem-${Date.now()}`,
      title: newTitle.trim(),
      time: newTime,
      category: newCategory,
      enabled: true,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      message:
        newMessage.trim() ||
        'Habari! Time for your daily AfyaMind 2036 wellness check-in.',
      soundEnabled: newSound,
    };

    const updated = storage.addReminder(newRem);
    setReminders(updated);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewMessage('');

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
    });
  };

  const activeCount = reminders.filter((r) => r.enabled).length;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                Daily Push Notification Scheduler
              </h3>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {activeCount} Active Reminders
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 leading-relaxed max-w-xl">
              Build an unbroken wellness routine. Set scheduled push reminders for morning mood pulses, midday somatic resets, and evening CBT journaling.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {permission !== 'granted' ? (
            <button
              onClick={handleEnablePermission}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Enable Device Push</span>
            </button>
          ) : (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Device Push Active</span>
            </span>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Reminder</span>
          </button>
        </div>
      </div>

      {testSentNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs px-4 py-2.5 rounded-xl font-medium animate-fade-in flex items-center justify-between">
          <span>{testSentNotice}</span>
          <span className="text-[11px] text-emerald-700">AfyaMind 2036 Notification Engine</span>
        </div>
      )}

      {/* Retention Booster Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 rounded-2xl p-4 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <div className="font-bold text-stone-900">
              Retention &amp; Habit Anchor: 84% Greater Consistency
            </div>
            <p className="text-stone-500 text-[11px]">
              Users with active morning &amp; evening reminders keep a 4.2x longer journaling streak and report reduced anxiety relapse.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleTestChimeAndNotification()}
          className="bg-white hover:bg-stone-100 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 text-xs shadow-2xs"
          title="Play gentle mindfulness chime and send test notification"
        >
          <Play className="w-3 h-3 text-emerald-700 fill-current" />
          <span>Test Chime &amp; Push</span>
        </button>
      </div>

      {/* Reminders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
              reminder.enabled
                ? 'bg-white border-stone-200 hover:border-emerald-300 shadow-xs'
                : 'bg-stone-50/70 border-stone-200/60 opacity-60'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      reminder.category === 'journal'
                        ? 'bg-emerald-100 text-emerald-800'
                        : reminder.category === 'mood'
                        ? 'bg-teal-100 text-teal-800'
                        : reminder.category === 'exercise'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {reminder.title}
                    </h4>
                    <span className="text-[10px] uppercase font-bold text-stone-400">
                      {reminder.category}
                    </span>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => handleToggle(reminder.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                    reminder.enabled ? 'bg-emerald-700' : 'bg-stone-300'
                  }`}
                  title={reminder.enabled ? 'Disable Reminder' : 'Enable Reminder'}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      reminder.enabled ? 'translate-x-5 shadow-xs' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit">
                <span>{reminder.time}</span>
                <span className="text-stone-300">•</span>
                <span className="text-[10px] font-sans text-stone-600 font-medium">
                  {reminder.days.join(', ')}
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed italic line-clamp-2">
                "{reminder.message}"
              </p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px]">
                  {reminder.soundEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Chime On</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                      <span>Silent</span>
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleTestChimeAndNotification(reminder)}
                  className="px-2 py-1 rounded hover:bg-stone-100 text-stone-600 font-medium text-[11px] cursor-pointer"
                  title="Test this specific reminder notification"
                >
                  Test Alert
                </button>
                <button
                  onClick={() => handleDelete(reminder.id)}
                  className="p-1 rounded hover:bg-rose-50 text-stone-300 hover:text-rose-600 cursor-pointer"
                  title="Remove reminder"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Reminder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-emerald-700" />
                <h3 className="font-serif font-bold text-stone-900 text-lg">
                  Add Daily Notification
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 font-bold text-lg"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddReminder} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Reminder Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Afternoon Gratitude Anchor"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Scheduled Time (24h) *
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-stone-300 outline-none focus:border-emerald-600 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Target Activity
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as typeof newCategory)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 outline-none focus:border-emerald-600 font-medium"
                  >
                    <option value="journal">Guided CBT Journal</option>
                    <option value="mood">Daily Mood Tracking</option>
                    <option value="exercise">Breathing &amp; Somatics</option>
                    <option value="manifesto">Vision 2036 Reset</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Custom Notification Prompt / Affirmation
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Unburden what is heavy. Write one small line in your journal today."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 outline-none focus:border-emerald-600 resize-none leading-relaxed"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={newSound}
                    onChange={(e) => setNewSound(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Play soothing Tibetan bell chime on notification dispatch</span>
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Reminder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
