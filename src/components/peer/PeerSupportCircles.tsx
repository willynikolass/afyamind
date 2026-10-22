import React, { useState } from 'react';
import {
  Users,
  Shield,
  MessageSquare,
  Clock,
  Heart,
  Sparkles,
  AlertTriangle,
  Send,
  UserCheck,
  Eye,
  CheckCircle2,
  Wind,
  Smile,
  Flag,
} from 'lucide-react';
import { PeerCircle, PeerMessage } from '../../types';
import { INITIAL_PEER_MESSAGES, MOCK_PEER_CIRCLES } from '../../data/mockData';
import { storage } from '../../utils/storage';

export const PeerSupportCircles: React.FC = () => {
  const [circles] = useState<PeerCircle[]>(MOCK_PEER_CIRCLES);
  const [activeCircle, setActiveCircle] = useState<PeerCircle>(MOCK_PEER_CIRCLES[0]);
  const [messages, setMessages] = useState<PeerMessage[]>(INITIAL_PEER_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [userHandle] = useState<string>(() => storage.getAnonymousHandle());
  const [rulesAccepted, setRulesAccepted] = useState(true);
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: PeerMessage = {
      id: `m_${Date.now()}`,
      circleId: activeCircle.id,
      senderName: isAnonymous ? userHandle : 'You (Public)',
      isAnonymous,
      isFacilitator: false,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: { heart: 0, hug: 0, breathe: 0, insight: 0 },
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

  const handleAddReaction = (messageId: string, type: 'heart' | 'hug' | 'breathe' | 'insight') => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              reactions: {
                ...m.reactions,
                [type]: (m.reactions[type] || 0) + 1,
              },
            }
          : m
      )
    );
  };

  const handleReportMessage = () => {
    setReportSuccess(true);
    setTimeout(() => setReportSuccess(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-serif font-bold text-stone-900">
              Moderated Peer Support Circles
            </h1>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Safe, anonymous sharing spaces facilitated by trained peer specialists. Connect with others walking similar paths.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl shrink-0">
          <span className="text-stone-500">Your Circle Handle:</span>
          <span className="font-mono font-bold text-emerald-800">@{userHandle}</span>
        </div>
      </div>

      {/* Main Grid: Circle Selector on Left, Live Room on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Circles Directory */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
            Available Circles & Schedules
          </h3>

          <div className="space-y-3">
            {circles.map((c) => {
              const isSelected = activeCircle.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCircle(c)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-xs ring-1 ring-emerald-500/20'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                      {c.topic}
                    </span>
                    {c.isLiveNow ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Now
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400">Scheduled</span>
                    )}
                  </div>

                  <h4 className="font-serif font-bold text-stone-900 text-sm mt-1">{c.title}</h4>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      {c.schedulePattern}
                    </span>
                    <span className="font-medium text-emerald-800">
                      {c.activeMembersCount} in room
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Safety Pledge Notice */}
          <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1.5">
            <div className="font-bold text-stone-800 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-700" />
              Community Safety Charter
            </div>
            <p className="text-[11px] leading-relaxed">
              Circles are moderated to ensure zero harassment, no medical prescribing, and strict anonymity. Crisis triggers are escalated immediately to trained professionals.
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Live Circle Room */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Room Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-stone-900 text-base">{activeCircle.title}</h3>
                {activeCircle.isLiveNow && (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {activeCircle.activeMembersCount} Present
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">
                Facilitator: <strong className="text-stone-700">{activeCircle.facilitatorName}</strong> ({activeCircle.facilitatorCredentials})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRulesAccepted(!rulesAccepted)}
                className="text-[11px] text-stone-500 hover:text-stone-800 underline cursor-pointer"
              >
                Ground Rules
              </button>
            </div>
          </div>

          {/* Ground Rules Banner */}
          {rulesAccepted && (
            <div className="bg-emerald-50/70 border-b border-emerald-100 px-5 py-2 flex items-center justify-between text-xs text-emerald-900">
              <span className="line-clamp-1">
                🌿 <strong>Safe space etiquette:</strong> Speak from "I" perspective. Unsolicited advice is discouraged; compassionate presence is cherished.
              </span>
              <button
                onClick={() => setRulesAccepted(false)}
                className="text-emerald-700 font-bold ml-2 text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* Report message banner alert */}
          {reportSuccess && (
            <div className="bg-rose-50 border-b border-rose-200 px-5 py-2 text-xs text-rose-800 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Message flagged for clinical moderator review. Thank you for keeping our circle safe.</span>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col space-y-1.5 p-3.5 rounded-2xl max-w-xl ${
                  m.isFacilitator
                    ? 'bg-amber-50/80 border border-amber-200 ml-auto sm:ml-0'
                    : m.senderName.includes('You')
                    ? 'bg-emerald-50/80 border border-emerald-200 ml-auto'
                    : 'bg-stone-50 border border-stone-200'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-800">{m.senderName}</span>
                    {m.isFacilitator && (
                      <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-semibold">
                        Facilitator
                      </span>
                    )}
                    {m.isAnonymous && !m.isFacilitator && (
                      <span className="text-[10px] text-stone-400 font-mono">(Anonymous)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-stone-400 text-[10px]">
                    <span>{m.timestamp}</span>
                    <button
                      onClick={handleReportMessage}
                      className="hover:text-rose-600 transition-colors"
                      title="Flag to facilitator"
                    >
                      <Flag className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-xs text-stone-700 leading-relaxed">{m.text}</p>

                {/* Reactions Bar */}
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => handleAddReaction(m.id, 'heart')}
                    className="flex items-center gap-1 text-[11px] bg-white border border-stone-200 px-2 py-0.5 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <span>❤️</span>
                    <span className="font-semibold text-stone-600">{m.reactions.heart || 0}</span>
                  </button>
                  <button
                    onClick={() => handleAddReaction(m.id, 'hug')}
                    className="flex items-center gap-1 text-[11px] bg-white border border-stone-200 px-2 py-0.5 rounded-full hover:bg-amber-50 hover:text-amber-700 transition-colors cursor-pointer"
                  >
                    <span>🫂</span>
                    <span className="font-semibold text-stone-600">{m.reactions.hug || 0}</span>
                  </button>
                  <button
                    onClick={() => handleAddReaction(m.id, 'breathe')}
                    className="flex items-center gap-1 text-[11px] bg-white border border-stone-200 px-2 py-0.5 rounded-full hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <span>🌿</span>
                    <span className="font-semibold text-stone-600">{m.reactions.breathe || 0}</span>
                  </button>
                  <button
                    onClick={() => handleAddReaction(m.id, 'insight')}
                    className="flex items-center gap-1 text-[11px] bg-white border border-stone-200 px-2 py-0.5 rounded-full hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
                  >
                    <span>💡</span>
                    <span className="font-semibold text-stone-600">{m.reactions.insight || 0}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Input & Sender Controls */}
          <div className="p-4 border-t border-stone-200 bg-white space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="accent-emerald-700 w-3.5 h-3.5"
                  />
                  <span>Send as Anonymous (@{userHandle})</span>
                </label>
              </div>
              <span className="text-[11px] text-stone-400">Zero pressure to share • Silent presence is welcome</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Share a thought, check-in, or supportive word with the circle..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white p-2.5 rounded-xl cursor-pointer transition-all shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
