import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  CheckCircle,
  Users,
  Briefcase,
  Heart,
  Sparkles,
  Lock,
  ArrowRight,
  TrendingDown,
  DollarSign,
  GraduationCap,
  Award,
} from 'lucide-react';

export const OrganizationPackages: React.FC = () => {
  const [teamSize, setTeamSize] = useState(50);
  const [inquirySent, setInquirySent] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Interactive estimate calculation
  const pricePerEmployeeMonthly = 6;
  const estimatedCost = teamSize * pricePerEmployeeMonthly;
  const estimatedBurnoutReduction = '34%';

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !contactEmail) return;
    setInquirySent(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-teal-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-700/40">
            <Building2 className="w-3.5 h-3.5" />
            Institutional & Employer Wellness
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
            Nurture Resilient, Supported Teams Without Exploitative Data Tracking
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Provide your employees, students, or community members with private, confidential access to qualified counsellors, peer circles, and clinically grounded stress regulation tools.
          </p>
        </div>
      </div>

      {/* Ethical Charter Guarantee */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-700" />
          <h2 className="text-xl font-serif font-bold text-emerald-950">
            The AfyaMind Ethical Business & Privacy Charter
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-emerald-900 pt-2">
          <div className="bg-white/80 p-4 rounded-xl border border-emerald-100 space-y-1">
            <span className="font-bold text-emerald-900 block text-sm">
              Zero Exploitative Advertising
            </span>
            <p className="text-stone-600 leading-relaxed">
              We never run predatory ads targeting emotional distress, anxiety, or vulnerable states.
            </p>
          </div>
          <div className="bg-white/80 p-4 rounded-xl border border-emerald-100 space-y-1">
            <span className="font-bold text-emerald-900 block text-sm">
              Strict Non-Sale of User Data
            </span>
            <p className="text-stone-600 leading-relaxed">
              Individual journals, mood logs, and therapy notes never leave the user's private sandbox and are never sold to data brokers.
            </p>
          </div>
          <div className="bg-white/80 p-4 rounded-xl border border-emerald-100 space-y-1">
            <span className="font-bold text-emerald-900 block text-sm">
              Cross-Subsidized Care Model
            </span>
            <p className="text-stone-600 leading-relaxed">
              Revenue from employer and institutional subscriptions directly funds our Sliding Scale Grant for low-income and crisis seekers.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Revenue / Service Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1: Free Community */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                Individuals & Crisis
              </span>
              <h3 className="font-serif font-bold text-stone-900 text-xl mt-2">
                Afya Community
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Always 100% free for anyone seeking immediate relief.
              </p>
            </div>

            <div className="text-2xl font-bold font-serif text-stone-900">
              $0 <span className="text-xs font-normal text-stone-400">/ forever</span>
            </div>

            <ul className="space-y-2 text-xs text-stone-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24/7 Global Crisis Hotlines & SOS Access</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Stanley-Brown Interactive Safety Plan</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Guided Breathing Orb & 5-4-3-2-1 Grounding</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Private local mood tracking & journaling</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sliding-scale therapy subsidies</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 block text-center py-2 rounded-xl">
              Currently Active
            </span>
          </div>
        </div>

        {/* Tier 2: AfyaMind Plus */}
        <div className="bg-white rounded-2xl border-2 border-emerald-600 p-6 flex flex-col justify-between shadow-md relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full">
            Supporter Edition
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Individual Supporter
              </span>
              <h3 className="font-serif font-bold text-stone-900 text-xl mt-2">
                AfyaMind Plus
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Enhanced soundscapes, biometric exports & subsidizes care for 2 others.
              </p>
            </div>

            <div className="text-2xl font-bold font-serif text-stone-900">
              $9.99 <span className="text-xs font-normal text-stone-400">/ month</span>
            </div>

            <ul className="space-y-2 text-xs text-stone-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Everything in Community Free</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Advanced procedural soundscapes & binaural beats</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Encrypted PDF exports for therapy sessions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Priority booking for qualified clinical slots</span>
              </li>
              <li className="flex items-center gap-2 font-semibold text-emerald-800">
                <Heart className="w-4 h-4 text-emerald-700 shrink-0 fill-current" />
                <span>Funds 2 community therapy subsidy vouchers</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => alert('AfyaMind Plus membership activated for this browser sandbox!')}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Support the Mission ($9.99)
            </button>
          </div>
        </div>

        {/* Tier 3: Organization / B2B */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                Workplaces & Universities
              </span>
              <h3 className="font-serif font-bold text-stone-900 text-xl mt-2">
                AfyaWork & Campus
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Comprehensive Employee Assistance & Team Burnout Prevention.
              </p>
            </div>

            <div className="text-2xl font-bold font-serif text-stone-900">
              $6 <span className="text-xs font-normal text-stone-400">/ member / month</span>
            </div>

            <ul className="space-y-2 text-xs text-stone-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Prepaid 1-on-1 licensed counselling credits</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Dedicated private peer circles for your organization</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Quarterly Burnout Prevention workshops by psychologists</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Anonymized aggregate organizational well-being index</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Dedicated clinical account manager</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <a
              href="#inquiry"
              className="block text-center w-full bg-stone-900 hover:bg-stone-800 text-white py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Request Partnership
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Employer Pricing & Burnout ROI Calculator */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
            Interactive Cost Model
          </span>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mt-2">
            Estimate Your Organization's Wellness Investment
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            See how confidential mental health support pays for itself by mitigating absenteeism and attrition.
          </p>
        </div>

        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700">Team / Student Body Size:</span>
              <span className="font-mono text-base font-bold text-emerald-800">{teamSize} Members</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>10 Members</span>
              <span>250 Members</span>
              <span>500 Members</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white p-4 rounded-xl border border-stone-200 text-center">
              <span className="text-[11px] text-stone-500 block mb-1">Monthly Investment</span>
              <div className="text-xl font-serif font-bold text-stone-900">${estimatedCost.toLocaleString()}</div>
              <span className="text-[10px] text-stone-400">$6 per user / mo</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 text-center">
              <span className="text-[11px] text-stone-500 block mb-1">Prepaid Therapy Credits</span>
              <div className="text-xl font-serif font-bold text-emerald-800">
                {Math.round(teamSize * 0.4)} Sessions
              </div>
              <span className="text-[10px] text-stone-400">Licensed clinicians</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 text-center">
              <span className="text-[11px] text-stone-500 block mb-1">Est. Productivity Recovery</span>
              <div className="text-xl font-serif font-bold text-indigo-700">
                ${(estimatedCost * 3.2).toLocaleString()} / yr
              </div>
              <span className="text-[10px] text-stone-400">Based on WHO mental health metrics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Form */}
      <div id="inquiry" className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-stone-900 text-xl">
          Inquire About Institutional & Employer Packages
        </h3>
        <p className="text-xs text-stone-500">
          Our partnerships team will reach out with customized pricing and a confidential demo portal.
        </p>

        {inquirySent ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-base">Inquiry Received</h4>
            <p className="text-xs text-stone-600 max-w-sm mx-auto">
              Thank you, {orgName}. An institutional care coordinator will contact {contactEmail} within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendInquiry} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Organization or University Name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="p-2.5 border border-stone-300 rounded-xl text-xs outline-none focus:border-emerald-600"
              />
              <input
                type="email"
                required
                placeholder="Work Email Address"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="p-2.5 border border-stone-300 rounded-xl text-xs outline-none focus:border-emerald-600"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Tell us about your team's needs (e.g. engineering burnout, student crisis prevention, hybrid workforce)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 border border-stone-300 rounded-xl text-xs outline-none focus:border-emerald-600 resize-none"
            />
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-xs"
            >
              Submit Partnership Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
