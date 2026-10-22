import React from 'react';
import { CloudSun, Search, CheckSquare, Clock, ArrowRight } from 'lucide-react';

interface QuickExitOverlayProps {
  isOpen: boolean;
  onExitDisguise: () => void;
}

export const QuickExitOverlay: React.FC<QuickExitOverlayProps> = ({
  isOpen,
  onExitDisguise,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#F4F6F8] text-slate-800 flex flex-col font-sans select-none overflow-y-auto">
      {/* Fake Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
            W
          </div>
          <span className="font-semibold text-slate-800 tracking-tight">Workspace Productivity & Research Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            <span>Last synced: Just now</span>
          </div>
          <button
            onClick={onExitDisguise}
            className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded font-medium transition-colors cursor-pointer flex items-center gap-1"
            title="Resume AfyaMind"
          >
            <span>Resume</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Fake Work Content */}
      <div className="max-w-4xl mx-auto w-full p-8 space-y-6">
        {/* Search Bar */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            readOnly
            value="Search project documentation, meeting summaries, or research spreadsheets..."
            className="w-full text-sm text-slate-500 bg-transparent outline-none cursor-default"
          />
        </div>

        {/* Weather & Calendar Widget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Local Weather</span>
              <CloudSun className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">22°C / 71°F</div>
            <p className="text-xs text-slate-500 mt-1">Partly cloudy • Humidity 58% • Wind 9 km/h</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Upcoming Deadlines
            </div>
            <div className="text-sm font-semibold text-slate-800">Sprint Retrospective</div>
            <p className="text-xs text-slate-500 mt-1">Tomorrow at 10:00 AM • Google Meet</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              System Health
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-semibold text-slate-800">All Cloud Services Operational</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Latency 18ms • Region: Global</p>
          </div>
        </div>

        {/* Fake Tasks */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-slate-800 text-sm">Sprint Task Checklist</h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">3 of 5 completed</span>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-3 text-slate-400 line-through">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>Review Q4 analytical metrics & architecture report</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 line-through">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>Submit draft agenda for quarterly review committee</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 line-through">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>Update database migration backup logs</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <div className="w-4 h-4 rounded border border-slate-300"></div>
              <span>Draft performance feedback summary</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <div className="w-4 h-4 rounded border border-slate-300"></div>
              <span>Prepare presentation slides for team review</span>
            </div>
          </div>
        </div>

        {/* Discreet Return Hint */}
        <div className="text-center pt-4">
          <p className="text-xs text-slate-400">
            Privacy disguise is active. Click <button onClick={onExitDisguise} className="text-blue-600 underline font-medium hover:text-blue-800 cursor-pointer">here</button> to safely return to your private session.
          </p>
        </div>
      </div>
    </div>
  );
};
