import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Users,
  UserPlus,
  Bell,
  BellRing,
  Sparkles,
  ShieldCheck,
  MapPin,
  Search,
  CheckCircle2,
  Calendar,
  Send,
  Heart,
  Share2,
  Bookmark,
  Volume2,
  Smartphone,
  ExternalLink,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { CommunityMember, CommunityUpdate } from '../../types';
import { storage } from '../../utils/storage';
import { notificationService } from '../../utils/notificationService';
import { CommunityImpactVisualizer } from './CommunityImpactVisualizer';

const KENYA_COUNTIES = [
  'Mombasa',
  'Taita Taveta',
  'Kwale',
  'Kilifi',
  'Lamu',
  'Tana River',
  'Nairobi',
  'Kiambu',
  'Nakuru',
  'Kisumu',
  'Uasin Gishu',
  'Machakos',
  'Kajiado',
  'Nyeri',
  'Meru',
  'Embu',
  'Garissa',
  'Kakamega',
  'Kericho',
  'Bungoma',
  'All 47 Counties',
];

interface CommunityMemberHubProps {
  onNavigateToTab?: (tab: string) => void;
}

export const CommunityMemberHub: React.FC<CommunityMemberHubProps> = ({
  onNavigateToTab,
}) => {
  const [members, setMembers] = useState<CommunityMember[]>(() => storage.getCommunityMembers());
  const [updates, setUpdates] = useState<CommunityUpdate[]>(() => storage.getCommunityUpdates());
  const [activeSubTab, setActiveSubTab] = useState<'members' | 'impact' | 'join' | 'updates'>('members');

  // Member Registration Form State
  const [fullName, setFullName] = useState('');
  const [county, setCounty] = useState('Coast Region & Taita Taveta');
  const [role, setRole] = useState<CommunityMember['role']>('Member');
  const [pledgeText, setPledgeText] = useState('');
  const [subscribeNotifications, setSubscribeNotifications] = useState(true);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCounty, setFilterCounty] = useState('All');

  // Push notification state
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(() =>
    notificationService.getPermission()
  );
  const [testSentMessage, setTestSentMessage] = useState('');

  // Handle joining community
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const initials = fullName
      .trim()
      .split(/\s+/)
      .map((w) => w[0].toUpperCase())
      .slice(0, 2)
      .join('');

    const newMember: CommunityMember = {
      id: `mem-${Date.now()}`,
      name: fullName.trim(),
      county,
      role,
      avatarInitials: initials || 'AF',
      joinedDate: new Date().toISOString().split('T')[0],
      notificationSubscribed: subscribeNotifications,
      pledgeText:
        pledgeText.trim() ||
        'I pledge to stand for mental health dignity, practice daily self-compassion, and support fellow Kenyans before 2036.',
      isVerified: true,
    };

    const updated = storage.addCommunityMember(newMember);
    setMembers(updated);
    setRegisteredSuccess(true);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (subscribeNotifications) {
      notificationService.sendPushNotification({
        title: 'Karibu AfyaMind 2036 Community!',
        body: `Welcome, ${newMember.name}! You are now registered with ${newMember.county} chapter. Push reminders active.`,
      });
    }

    setTimeout(() => {
      setActiveSubTab('members');
      setRegisteredSuccess(false);
      setFullName('');
      setPledgeText('');
    }, 2200);
  };

  // Test push notification
  const handleTestPush = async () => {
    const success = await notificationService.sendPushNotification({
      title: 'AfyaMind 2036 Live Update',
      body: 'Habari! Push notifications and community broadcasts are active and functioning on your device.',
      playSound: true,
    });

    setNotifPermission(notificationService.getPermission());
    if (success) {
      setTestSentMessage('✓ Test notification delivered to your device screen!');
    } else {
      setTestSentMessage('Note: Please click "Allow" when browser asks for notification permission.');
    }
    setTimeout(() => setTestSentMessage(''), 4000);
  };

  // Filtered members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.pledgeText && m.pledgeText.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCounty = filterCounty === 'All' || m.county.includes(filterCounty);

    return matchesSearch && matchesCounty;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 text-white rounded-3xl p-7 sm:p-10 shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold uppercase tracking-wider border border-emerald-600/40">
              <Users className="w-3.5 h-3.5 text-amber-300" />
              Community Network &amp; Broadcasts
            </span>
            <span className="text-xs text-stone-300 bg-stone-800/80 px-2.5 py-1 rounded-full font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Founded by Nikolass Willy Mtunga
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            AfyaMind Community Circle &amp; Live Updates
          </h1>

          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Where everyday Kenyans from the <strong>Coast Region</strong>, <strong>Taita Taveta</strong>, Nairobi, and across all 47 counties add themselves, stand together for mental wellness, and receive real-time push notifications and updates directly on their phones.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveSubTab('join')}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Yourself to the Community Roster</span>
            </button>
            <button
              onClick={() => setActiveSubTab('impact')}
              className="bg-emerald-800/90 hover:bg-emerald-700/90 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-emerald-600/50 transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-amber-300" />
              <span>Community Impact Charts</span>
            </button>
            <button
              onClick={handleTestPush}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <BellRing className="w-4 h-4 text-amber-300" />
              <span>Test Push Notification Now</span>
            </button>
          </div>
          {testSentMessage && (
            <p className="text-xs text-emerald-300 font-semibold animate-pulse">{testSentMessage}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-3 overflow-x-auto">
        {[
          { id: 'members', label: `Community Roster (${members.length})`, icon: Users },
          { id: 'impact', label: 'Community Impact & Growth', icon: TrendingUp },
          { id: 'join', label: 'Add Yourself / Join Network', icon: UserPlus },
          { id: 'updates', label: `App Updates & Alerts (${updates.length})`, icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer border-b-2 -mb-[2px] px-3 whitespace-nowrap transition-colors ${
                activeSubTab === tab.id
                  ? 'border-emerald-700 text-emerald-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Member Showcase Roster */}
      {activeSubTab === 'members' && (
        <div className="space-y-6">
          {/* Impact Quick Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-teal-950 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-emerald-800/50 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <TrendingUp className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">
                  12,735+ Kenyans Registered Across 47 Counties
                </h4>
                <p className="text-[11px] text-stone-300">
                  Explore interactive Recharts growth trends, new monthly sign-ups, and peer support participants.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveSubTab('impact')}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <span>View Impact Visualizer</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Search member, county, or pledge..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">County:</span>
              <select
                value={filterCounty}
                onChange={(e) => setFilterCounty(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-600 font-medium text-stone-700"
              >
                <option value="All">All Regions</option>
                <option value="Coast">Coast Region</option>
                <option value="Taita Taveta">Taita Taveta</option>
                <option value="Mombasa">Mombasa</option>
                <option value="Nairobi">Nairobi</option>
                <option value="Kisumu">Kisumu</option>
                <option value="Nakuru">Nakuru</option>
              </select>

              <button
                onClick={() => setActiveSubTab('join')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Join Roster</span>
              </button>
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                        {member.avatarInitials}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-stone-900 text-sm">{member.name}</h4>
                          {member.isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{member.county}</span>
                    <span className="text-stone-300">•</span>
                    <span>Joined {member.joinedDate}</span>
                  </div>

                  {member.pledgeText && (
                    <p className="text-xs text-stone-600 italic bg-stone-50 p-3 rounded-xl border border-stone-100 leading-relaxed">
                      "{member.pledgeText}"
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <Bell className="w-3 h-3" />
                    Notifications Active
                  </span>
                  <span className="text-stone-400 font-mono text-[10px]">Vision 2036 Ally</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Community Impact Visualizer */}
      {activeSubTab === 'impact' && (
        <CommunityImpactVisualizer
          currentMembers={members}
          onNavigateToJoin={() => setActiveSubTab('join')}
          onNavigateToCircles={() => onNavigateToTab?.('peer')}
        />
      )}

      {/* Tab 2: Join Community Form */}
      {activeSubTab === 'join' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 max-w-xl mx-auto shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-2xl">
              Add Yourself to the AfyaMind 2036 Network
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed max-w-md mx-auto">
              Stand with founder Nikolass Willy Mtunga and thousands of Kenyans across Coast, Taita Taveta, and beyond. Registering ensures you receive vital wellness updates and peer notifications.
            </p>
          </div>

          {registeredSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2 animate-scale-up">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-950 text-base">You are officially registered!</h4>
              <p className="text-xs text-emerald-800">
                Karibu sana! Your pledge has been etched into the 2036 Community Roster. Returning to the member list...
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Full Name or Community Handle *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Kelvin Mwavita or Sister Amina"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    County / Region *
                  </label>
                  <select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 outline-none focus:border-emerald-600 font-medium text-stone-800"
                  >
                    {KENYA_COUNTIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Your Role in the Community
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as typeof role)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 outline-none focus:border-emerald-600 font-medium text-stone-800"
                  >
                    <option value="Member">Community Member</option>
                    <option value="Student">High School / University Student</option>
                    <option value="Peer Supporter">Peer Supporter / Listener</option>
                    <option value="Healthcare Ally">Healthcare Ally / Clinician</option>
                    <option value="Educator">Teacher / Youth Mentor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Your Personal Wellness Pledge or Note
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g., Standing for mental health dignity in my village; practicing CBT reframing daily..."
                  value={pledgeText}
                  onChange={(e) => setPledgeText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 outline-none focus:border-emerald-600 leading-relaxed resize-none"
                />
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={subscribeNotifications}
                    onChange={(e) => setSubscribeNotifications(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-stone-900 block">
                      Receive Push Notifications &amp; App Updates
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Get daily gentle journaling reminders, live peer circle alerts, and founder dispatches.
                    </span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Add Me to AfyaMind 2036 Network</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab 3: App Updates & Notification Broadcasts */}
      {activeSubTab === 'updates' && (
        <div className="space-y-6">
          {/* Notification Permission Banner */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                <BellRing className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">
                  Push Notification Status: {notifPermission === 'granted' ? 'Active ✓' : 'Permission Required'}
                </h4>
                <p className="text-xs text-stone-500">
                  Allow browser push notifications to receive real-time updates even when the app is closed.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleTestPush}
                className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span>Test Notification</span>
              </button>
            </div>
          </div>

          {/* Timeline of Updates */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-xl px-1">
              Official 2036 Release Changelog &amp; Broadcasts
            </h3>

            <div className="space-y-3">
              {updates.map((update) => (
                <div
                  key={update.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2 hover:border-emerald-200 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {update.version}
                      </span>
                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {update.date}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-stone-400">
                      Dispatched by {update.author}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-stone-900 text-base">
                    {update.title}
                  </h4>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {update.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {update.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
