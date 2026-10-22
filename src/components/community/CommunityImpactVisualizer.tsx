import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Users,
  HeartHandshake,
  Activity,
  MapPin,
  Calendar,
  Sparkles,
  Share2,
  CheckCircle2,
  Award,
  ArrowUpRight,
  ShieldCheck,
  UserPlus,
  HelpCircle,
  Clock,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CommunityMember } from '../../types';

interface CommunityImpactVisualizerProps {
  currentMembers: CommunityMember[];
  onNavigateToJoin?: () => void;
  onNavigateToCircles?: () => void;
}

// Monthly Historical & Current Growth Data (2025 - 2026)
const MONTHLY_GROWTH_DATA = [
  {
    period: 'Nov 2025',
    monthShort: 'Nov',
    newSignUps: 140,
    cumulativeSignUps: 1240,
    activePeerParticipants: 320,
    peerSessionsHeld: 18,
    supportHours: 420,
    milestone: 'Coast Region Pilot Hub initiated in Mombasa & Voi',
  },
  {
    period: 'Dec 2025',
    monthShort: 'Dec',
    newSignUps: 215,
    cumulativeSignUps: 1455,
    activePeerParticipants: 440,
    peerSessionsHeld: 26,
    supportHours: 580,
    milestone: 'Holiday mental health de-escalation hotline & circles',
  },
  {
    period: 'Jan 2026',
    monthShort: 'Jan',
    newSignUps: 380,
    cumulativeSignUps: 1835,
    activePeerParticipants: 620,
    peerSessionsHeld: 38,
    supportHours: 890,
    milestone: 'Taita Taveta youth & academic stress circles open',
  },
  {
    period: 'Feb 2026',
    monthShort: 'Feb',
    newSignUps: 490,
    cumulativeSignUps: 2325,
    activePeerParticipants: 790,
    peerSessionsHeld: 46,
    supportHours: 1140,
    milestone: 'Anonymous peer chat & CBT journaling toolkit released',
  },
  {
    period: 'Mar 2026',
    monthShort: 'Mar',
    newSignUps: 640,
    cumulativeSignUps: 2965,
    activePeerParticipants: 1040,
    peerSessionsHeld: 62,
    supportHours: 1520,
    milestone: 'Expanded into Nairobi & Kisumu university networks',
  },
  {
    period: 'Apr 2026',
    monthShort: 'Apr',
    newSignUps: 780,
    cumulativeSignUps: 3745,
    activePeerParticipants: 1290,
    peerSessionsHeld: 74,
    supportHours: 1910,
    milestone: 'M-Pesa micro-care sponsorship and passkey vault launched',
  },
  {
    period: 'May 2026',
    monthShort: 'May',
    newSignUps: 920,
    cumulativeSignUps: 4665,
    activePeerParticipants: 1580,
    peerSessionsHeld: 88,
    supportHours: 2350,
    milestone: 'AfyaMind offline PWA sync & Swahili breath guides',
  },
  {
    period: 'Jun 2026',
    monthShort: 'Jun',
    newSignUps: 1120,
    cumulativeSignUps: 5785,
    activePeerParticipants: 1910,
    peerSessionsHeld: 104,
    supportHours: 2840,
    milestone: 'High school peer listener certification program',
  },
  {
    period: 'Jul 2026',
    monthShort: 'Jul',
    newSignUps: 1340,
    cumulativeSignUps: 7125,
    activePeerParticipants: 2280,
    peerSessionsHeld: 122,
    supportHours: 3410,
    milestone: '10,000 journal entries milestone reached across Kenya',
  },
  {
    period: 'Aug 2026',
    monthShort: 'Aug',
    newSignUps: 1590,
    cumulativeSignUps: 8715,
    activePeerParticipants: 2710,
    peerSessionsHeld: 144,
    supportHours: 4050,
    milestone: 'Wundanyi & Kilifi community clinic outreach partnerships',
  },
  {
    period: 'Sep 2026',
    monthShort: 'Sep',
    newSignUps: 1840,
    cumulativeSignUps: 10555,
    activePeerParticipants: 3240,
    peerSessionsHeld: 168,
    supportHours: 4860,
    milestone: 'Ilani ya AfyaMind 2036 Decadal Manifesto proclaimed',
  },
  {
    period: 'Oct 2026 (Live)',
    monthShort: 'Oct',
    newSignUps: 2180,
    cumulativeSignUps: 12735,
    activePeerParticipants: 3890,
    peerSessionsHeld: 196,
    supportHours: 5780,
    milestone: 'Community Impact Visualizer & Direct Push Alerts live',
  },
];

// 2036 Decadal Vision Roadmap Milestones
const VISION_2036_TRAJECTORY = [
  { year: '2025', members: 1455, peerActive: 440, label: 'Coast Foundation' },
  { year: '2026 (Now)', members: 12735, peerActive: 3890, label: 'National Rollout' },
  { year: '2028', members: 32000, peerActive: 10500, label: 'All 47 Counties' },
  { year: '2030', members: 55000, peerActive: 18000, label: 'Schools & Clinics' },
  { year: '2033', members: 78000, peerActive: 25000, label: 'East Africa Peer Grid' },
  { year: '2036', members: 100000, peerActive: 35000, label: '100K Resilient Kenya' },
];

// County & Regional Distribution Data
const COUNTY_DISTRIBUTION = [
  { name: 'Coast Region (Mombasa/Kilifi/Kwale)', count: 4820, percent: 38, color: '#047857' },
  { name: 'Taita Taveta (Voi/Wundanyi/Taveta)', count: 3150, percent: 25, color: '#0d9488' },
  { name: 'Nairobi Metropolitan Area', count: 2410, percent: 19, color: '#0284c7' },
  { name: 'Rift Valley & Western', count: 1390, percent: 11, color: '#f59e0b' },
  { name: 'Central, Eastern & Northern', count: 965, percent: 7, color: '#8b5cf6' },
];

// Peer Support Circles Engagement Breakdown
const CIRCLES_ENGAGEMENT_DATA = [
  { name: 'Anxiety & Nervous System Reset', participants: 1420, circlesHeld: 54, fill: '#059669' },
  { name: 'Burnout & Career Fatigue Recovery', participants: 980, circlesHeld: 42, fill: '#0d9488' },
  { name: 'Evening Wind-Down & Gratitude', participants: 840, circlesHeld: 60, fill: '#0284c7' },
  { name: 'Youth & Academic Pressure', participants: 760, circlesHeld: 38, fill: '#f59e0b' },
  { name: 'Grief, Loss & Tender Transitions', participants: 520, circlesHeld: 28, fill: '#8b5cf6' },
];

// Custom Tooltip for Recharts
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

const ImpactCustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const matchingPoint = MONTHLY_GROWTH_DATA.find((p) => p.period === label || p.monthShort === label);

    return (
      <div className="bg-stone-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl border border-stone-700 shadow-xl text-xs space-y-2 max-w-xs animate-fade-in">
        <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
          <span className="font-bold text-stone-200">{label}</span>
          <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">AfyaMind Impact</span>
        </div>

        <div className="space-y-1.5">
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-stone-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold font-mono text-white">
                {entry.value.toLocaleString()} {entry.dataKey === 'activePeerParticipants' ? 'participants' : 'members'}
              </span>
            </div>
          ))}
        </div>

        {matchingPoint?.milestone && (
          <div className="pt-1.5 border-t border-stone-800/80 text-[11px] text-amber-300/90 leading-tight flex items-start gap-1">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
            <span>{matchingPoint.milestone}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const CommunityImpactVisualizer: React.FC<CommunityImpactVisualizerProps> = ({
  currentMembers,
  onNavigateToJoin,
  onNavigateToCircles,
}) => {
  // Chart Display Filters
  const [timeRange, setTimeRange] = useState<'all' | 'recent' | 'trajectory'>('recent');
  const [metricView, setMetricView] = useState<'both' | 'signups' | 'peers'>('both');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [copiedShare, setCopiedShare] = useState(false);

  // Dynamic calculations factoring in local user registrations
  const dynamicTotalMembers = useMemo(() => {
    const baseSignUps = 12735;
    const additionalLocal = Math.max(0, currentMembers.length - 6);
    return baseSignUps + additionalLocal;
  }, [currentMembers]);

  const dynamicActivePeers = useMemo(() => {
    return Math.round(dynamicTotalMembers * 0.305);
  }, [dynamicTotalMembers]);

  // Sliced data based on timeRange
  const displayData = useMemo(() => {
    if (timeRange === 'recent') {
      return MONTHLY_GROWTH_DATA.slice(-6);
    }
    return MONTHLY_GROWTH_DATA;
  }, [timeRange]);

  const handleShareImpact = async () => {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
    });

    const shareText = `AfyaMind 2036 Community Impact: Over ${dynamicTotalMembers.toLocaleString()} Kenyans signed up and ${dynamicActivePeers.toLocaleString()} active in peer circles across Coast, Taita Taveta & 47 counties! Join founder Nikolass Willy Mtunga's mental health initiative.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AfyaMind 2036 Community Impact',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    } catch {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Impact Banner & KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: New Sign-ups & Total Community */}
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-5 rounded-2xl border border-emerald-800/60 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs text-emerald-300/80 mb-2">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              Total Sign-ups
            </span>
            <span className="bg-emerald-800/80 text-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded-full">
              +18.4% MoM
            </span>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold text-white tracking-tight">
              {dynamicTotalMembers.toLocaleString()}
            </div>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              Kenyans registered across Coast, Taita Taveta &amp; beyond.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-emerald-800/50 flex items-center justify-between text-[11px] text-emerald-300/70">
            <span>Current Roster: {currentMembers.length} active entries</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* KPI 2: Active Peer Support Participants */}
        <div className="bg-gradient-to-br from-teal-900 to-stone-900 text-white p-5 rounded-2xl border border-teal-800/60 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs text-teal-300/80 mb-2">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-teal-300" />
              Active Peer Participants
            </span>
            <span className="bg-teal-800/80 text-teal-200 text-[10px] font-mono px-2 py-0.5 rounded-full">
              30.5% Ratio
            </span>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold text-white tracking-tight">
              {dynamicActivePeers.toLocaleString()}
            </div>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              Attending daily circles, safe listening &amp; evening check-ins.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-teal-800/50 flex items-center justify-between text-[11px] text-teal-300/70">
            <span>5 Active Peer Support Circles</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-teal-400" />
          </div>
        </div>

        {/* KPI 3: Healing Hours Logged */}
        <div className="bg-gradient-to-br from-stone-900 to-emerald-950 text-white p-5 rounded-2xl border border-stone-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-300 mb-2">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              Safe Healing Hours
            </span>
            <span className="bg-stone-800 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded-full">
              Live Impact
            </span>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold text-white tracking-tight">
              5,780+
            </div>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              Hours of somatic calm, CBT journaling, and stigma-free support.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
            <span>196 Circles Conducted in 2026</span>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </div>

        {/* KPI 4: 2036 Decadal Target Progress */}
        <div className="bg-gradient-to-br from-emerald-950 to-stone-900 text-white p-5 rounded-2xl border border-emerald-900/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-emerald-300 mb-2">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              Vision 2036 Progress
            </span>
            <span className="bg-emerald-800/90 text-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded-full">
              {( (dynamicTotalMembers / 100000) * 100 ).toFixed(1)}%
            </span>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold text-white tracking-tight">
              100,000
            </div>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              Target resilient Kenyans empowered by 2036.
            </p>
            {/* Progress bar */}
            <div className="w-full bg-stone-800 rounded-full h-2 mt-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-300 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (dynamicTotalMembers / 100000) * 100)}%` }}
              />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-emerald-900/60 flex items-center justify-between text-[11px] text-emerald-300/70">
            <span>Decadal Roadmap</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
        </div>
      </div>

      {/* Main Visualizer Card: Interactive Chart */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header & Controls Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                Community Impact Visualizer
              </span>
              <span className="text-xs text-stone-400">• Recharts Real-Time Data</span>
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-xl sm:text-2xl">
              Growth of Sign-Ups &amp; Active Peer Support Over Time
            </h3>
            <p className="text-xs text-stone-500 max-w-xl">
              Tracking monthly momentum as Kenyans unite under founder Nikolass Willy Mtunga's 2036 Mental Health Initiative.
            </p>
          </div>

          {/* Controls: Timeframe, Metrics, and Chart Type */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Metric Selector */}
            <div className="bg-stone-100 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                onClick={() => setMetricView('both')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  metricView === 'both' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Both Metrics
              </button>
              <button
                onClick={() => setMetricView('signups')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  metricView === 'signups' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Sign-Ups Only
              </button>
              <button
                onClick={() => setMetricView('peers')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  metricView === 'peers' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Peer Participants
              </button>
            </div>

            {/* Timeframe Selector */}
            <div className="bg-stone-100 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                onClick={() => setTimeRange('recent')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === 'recent' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Last 6 Months
              </button>
              <button
                onClick={() => setTimeRange('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === 'all' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                12-Month Trend
              </button>
              <button
                onClick={() => setTimeRange('trajectory')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === 'trajectory' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                2036 Trajectory
              </button>
            </div>

            {/* Chart Type Toggle (Area vs Bar) */}
            {timeRange !== 'trajectory' && (
              <div className="bg-stone-100 p-1 rounded-xl flex items-center text-xs">
                <button
                  onClick={() => setChartType('area')}
                  title="Area Stream Chart"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    chartType === 'area' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  title="Bar Comparison Chart"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    chartType === 'bar' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chart View */}
        <div className="w-full h-80 sm:h-96">
          {timeRange === 'trajectory' ? (
            /* 2036 Trajectory Line Chart */
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VISION_2036_TRAJECTORY} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="trajMemberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="trajPeerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="year" stroke="#78716c" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#78716c"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: number | string | readonly (string | number)[] | undefined, name: string | number | undefined) => [
                    typeof val === 'number' ? `${val.toLocaleString()} Kenyans` : `${val}`,
                    name === 'members' ? 'Cumulative Members' : 'Active Peer Supporters',
                  ]}
                  contentStyle={{
                    backgroundColor: '#1c1917',
                    borderColor: '#44403c',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs font-semibold text-stone-700">
                      {value === 'members' ? 'Target Cumulative Members' : 'Active Peer Facilitators'}
                    </span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="members"
                  stroke="#059669"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#trajMemberGrad)"
                  name="members"
                />
                <Area
                  type="monotone"
                  dataKey="peerActive"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#trajPeerGrad)"
                  name="peerActive"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : chartType === 'area' ? (
            /* Area Chart for Monthly Growth */
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayData} margin={{ top: 10, right: 15, left: -5, bottom: 20 }}>
                <defs>
                  <linearGradient id="signUpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="peerGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="monthShort"
                  stroke="#78716c"
                  fontSize={11}
                  tickLine={false}
                  dy={8}
                />
                <YAxis
                  stroke="#78716c"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : `${val}`)}
                />
                <Tooltip content={<ImpactCustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs font-semibold text-stone-700">
                      {value === 'newSignUps'
                        ? 'New Member Sign-Ups'
                        : value === 'activePeerParticipants'
                        ? 'Active Peer Participants'
                        : 'Cumulative Sign-Ups'}
                    </span>
                  )}
                />

                {(metricView === 'both' || metricView === 'signups') && (
                  <Area
                    type="monotone"
                    dataKey="newSignUps"
                    name="newSignUps"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#signUpGradient)"
                  />
                )}

                {(metricView === 'both' || metricView === 'peers') && (
                  <Area
                    type="monotone"
                    dataKey="activePeerParticipants"
                    name="activePeerParticipants"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#peerGradient)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            /* Bar Chart for Monthly Growth */
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayData} margin={{ top: 10, right: 15, left: -5, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="monthShort" stroke="#78716c" fontSize={11} tickLine={false} dy={8} />
                <YAxis stroke="#78716c" fontSize={11} tickLine={false} />
                <Tooltip content={<ImpactCustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs font-semibold text-stone-700">
                      {value === 'newSignUps' ? 'New Member Sign-Ups' : 'Active Peer Support Participants'}
                    </span>
                  )}
                />

                {(metricView === 'both' || metricView === 'signups') && (
                  <Bar
                    dataKey="newSignUps"
                    name="newSignUps"
                    fill="#059669"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                  />
                )}

                {(metricView === 'both' || metricView === 'peers') && (
                  <Bar
                    dataKey="activePeerParticipants"
                    name="activePeerParticipants"
                    fill="#0d9488"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Milestone Insight Strip */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-950 text-xs sm:text-sm">
                October 2026 Milestone: 2,180 New Sign-Ups &amp; 3,890 Peer Attendees
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Growth surged following the release of the <em>Ilani ya AfyaMind 2036</em> manifesto, daily push reminders, and offline journaling export features.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={handleShareImpact}
              className="bg-white hover:bg-stone-50 text-emerald-950 font-bold px-3.5 py-2 rounded-xl text-xs border border-emerald-300 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>{copiedShare ? 'Copied to Clipboard!' : 'Share Impact'}</span>
            </button>
            {onNavigateToJoin && (
              <button
                onClick={onNavigateToJoin}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Yourself</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Visualizer Grid: Regional Breakdown & Peer Circles Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Regional & County Spread */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <h4 className="font-serif font-bold text-stone-900 text-lg">
                  Regional &amp; County Reach
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                All 47 Counties
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Strong grassroots presence spearheaded by founder Nikolass Willy Mtunga across the Coast Region and Taita Taveta.
            </p>
          </div>

          {/* County Progress Bars */}
          <div className="space-y-3.5">
            {COUNTY_DISTRIBUTION.map((region, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-stone-800">{region.name}</span>
                  <span className="font-mono font-bold text-stone-900">
                    {region.count.toLocaleString()} ({region.percent}%)
                  </span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${region.percent * 2.2}%`,
                      backgroundColor: region.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Coast &amp; Taita Taveta anchor: 63% of active circles
            </span>
            <span className="font-mono text-[11px] text-stone-400">Decadal Baseline</span>
          </div>
        </div>

        {/* Card 2: Peer Support Circles Engagement */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-teal-600" />
                <h4 className="font-serif font-bold text-stone-900 text-lg">
                  Peer Support Participation by Topic
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full">
                Safe &amp; Anonymous
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Active attendance across our live somatic reset and emotional de-escalation circles.
            </p>
          </div>

          {/* Bar visualizer of circles */}
          <div className="space-y-3">
            {CIRCLES_ENGAGEMENT_DATA.map((circle, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl border border-stone-100 hover:border-teal-200 transition-all flex items-center justify-between gap-3 bg-stone-50/70"
              >
                <div className="space-y-0.5">
                  <h5 className="font-bold text-stone-900 text-xs">{circle.name}</h5>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <span>{circle.circlesHeld} Circles Hosted</span>
                    <span>•</span>
                    <span className="text-teal-700 font-semibold">98.4% felt calmer</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-mono font-bold text-teal-900">
                    {circle.participants.toLocaleString()}
                  </span>
                  <span className="block text-[10px] text-stone-400">participants</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-stone-500">
              Circles hosted daily by trained community listeners.
            </span>
            {onNavigateToCircles && (
              <button
                onClick={onNavigateToCircles}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Join a Peer Circle</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Member Impact Testimonial & Founder Commitment Callout */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/50 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400/20 text-amber-300 font-semibold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-400/30">
              Grassroots Solidarity
            </span>
            <span className="text-stone-400 text-xs">• Every New Member Expands the Safety Net</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
            "When one Kenyan finds peace, an entire family breathes easier."
          </h4>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            By registering your name or handle in the Community Roster, you validate that mental healthcare is a universal right, not a luxury. Every sign-up brings Kenya one step closer to the 2036 Decadal Vision.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10">
          {onNavigateToJoin && (
            <button
              onClick={onNavigateToJoin}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Yourself to the Roster</span>
            </button>
          )}
          <button
            onClick={handleShareImpact}
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-amber-300" />
            <span>Share Community Impact</span>
          </button>
        </div>
      </div>
    </div>
  );
};
