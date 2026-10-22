import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Sparkles,
  Search,
  Tag,
  Star,
  Trash2,
  Calendar,
  Lock,
  Unlock,
  CheckCircle2,
  ArrowRight,
  Download,
  Share2,
  HelpCircle,
  Brain,
  Sliders,
  ChevronDown,
  Printer,
  FileSpreadsheet,
} from 'lucide-react';
import { CBTThoughtRecord, JournalEntry, JournalPrompt, MoodValence } from '../../types';
import { INITIAL_JOURNAL_PROMPTS } from '../../data/mockData';
import { storage } from '../../utils/storage';
import { JournalExportModal } from './JournalExportModal';

interface GuidedJournalProps {
  isVaultLocked: boolean;
  onOpenVaultModal: () => void;
}

const DISTORTION_OPTIONS = [
  { name: 'Catastrophizing', desc: 'Predicting the worst-case scenario will inevitably happen.' },
  { name: 'Mind Reading', desc: 'Assuming you know people think negatively of you without proof.' },
  { name: 'All-or-Nothing Thinking', desc: 'Seeing things in black-or-white absolutes; if not perfect, it is ruined.' },
  { name: 'Emotional Reasoning', desc: 'Believing that because you feel terrified or guilty, it must be the objective truth.' },
  { name: 'Mental Filtering', desc: 'Obsessing over one flaw while discarding 10 positive occurrences.' },
  { name: 'Overgeneralization', desc: 'Viewing a single negative event as a never-ending pattern of defeat.' },
  { name: 'Personalization', desc: 'Blaming yourself entirely for events out of your control.' },
];

export const GuidedJournal: React.FC<GuidedJournalProps> = ({
  isVaultLocked,
  onOpenVaultModal,
}) => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => storage.getJournals());
  const [selectedPrompt, setSelectedPrompt] = useState<JournalPrompt>(INITIAL_JOURNAL_PROMPTS[0]);
  const [activeTab, setActiveTab] = useState<'write' | 'history'>('write');

  // Standard Writing Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>(['Reflection']);
  const [newTagInput, setNewTagInput] = useState('');
  const [valenceRating, setValenceRating] = useState<MoodValence>(3);

  // CBT Mode Structured State
  const [cbtSituation, setCbtSituation] = useState('');
  const [cbtAutoThought, setCbtAutoThought] = useState('');
  const [cbtDistortion, setCbtDistortion] = useState('Catastrophizing');
  const [cbtDistressBefore, setCbtDistressBefore] = useState(7);
  const [cbtEvidenceFor, setCbtEvidenceFor] = useState('');
  const [cbtEvidenceAgainst, setCbtEvidenceAgainst] = useState('');
  const [cbtRationalResponse, setCbtRationalResponse] = useState('');
  const [cbtDistressAfter, setCbtDistressAfter] = useState(3);

  // History filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Handle saving entry
  const handleSaveEntry = () => {
    if (!title.trim() && !content.trim() && !cbtSituation.trim()) return;

    let cbtRecordData: CBTThoughtRecord | undefined = undefined;
    let finalContent = content;

    if (selectedPrompt.isCBT) {
      cbtRecordData = {
        situation: cbtSituation,
        automaticThought: cbtAutoThought,
        distortion: cbtDistortion,
        distressLevelBefore: cbtDistressBefore,
        evidenceFor: cbtEvidenceFor,
        evidenceAgainst: cbtEvidenceAgainst,
        rationalResponse: cbtRationalResponse,
        distressLevelAfter: cbtDistressAfter,
      };

      if (!finalContent.trim()) {
        finalContent = `Cognitive Restructuring Summary:\n\nTrigger: ${cbtSituation}\nAutomatic Thought: "${cbtAutoThought}"\nDistortion Identified: ${cbtDistortion}\n\nEvidence Against: ${cbtEvidenceAgainst}\n\nBalanced Perspective: ${cbtRationalResponse}\nDistress reduced from ${cbtDistressBefore}/10 to ${cbtDistressAfter}/10.`;
      }
    }

    const newEntry: JournalEntry = {
      id: `j_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      title: title.trim() || selectedPrompt.title,
      promptCategory: selectedPrompt.category,
      promptTitle: selectedPrompt.title,
      content: finalContent,
      cbtRecord: cbtRecordData,
      tags: tags.length ? tags : ['Mindfulness'],
      valenceRating,
      isFavorite: false,
    };

    const updated = storage.saveJournal(newEntry);
    setEntries(updated);

    // Fire gentle celebration confetti
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#059669', '#10B981', '#6EE7B7', '#FBBF24'],
      });
    } catch {
      // Ignore
    }

    // Reset fields
    setTitle('');
    setContent('');
    setCbtSituation('');
    setCbtAutoThought('');
    setCbtEvidenceFor('');
    setCbtEvidenceAgainst('');
    setCbtRationalResponse('');
    setActiveTab('history');
  };

  const handleAddTag = () => {
    if (!newTagInput.trim() || tags.includes(newTagInput.trim())) return;
    setTags([...tags, newTagInput.trim()]);
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleDeleteEntry = (id: string) => {
    const updated = storage.deleteJournal(id);
    setEntries(updated);
    if (viewingEntry?.id === id) setViewingEntry(null);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = storage.toggleFavoriteJournal(id);
    setEntries(updated);
  };

  const exportEntryAsText = (entry: JournalEntry) => {
    const textData = `AfyaMind Journal Entry
Date: ${entry.date}
Title: ${entry.title}
Prompt: ${entry.promptTitle || entry.promptCategory}
Tags: ${entry.tags.join(', ')}

--- Content ---
${entry.content}

${
  entry.cbtRecord
    ? `\n--- CBT Thought Record ---
Situation: ${entry.cbtRecord.situation}
Automatic Thought: ${entry.cbtRecord.automaticThought}
Distortion: ${entry.cbtRecord.distortion}
Distress Before: ${entry.cbtRecord.distressLevelBefore}/10
Evidence Against: ${entry.cbtRecord.evidenceAgainst}
Rational Response: ${entry.cbtRecord.rationalResponse}
Distress After: ${entry.cbtRecord.distressLevelAfter}/10`
    : ''
}
`;
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `afyamind-journal-${entry.date}-${entry.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // If vault is locked
  if (isVaultLocked) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-sm border border-stone-200 text-center space-y-4">
        <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-900">
          Your Journal is Locked in Private Vault
        </h2>
        <p className="text-stone-600 text-sm max-w-md mx-auto">
          Your private thoughts and reflections are shielded by your 4-digit PIN. Enter your PIN to view or write journal entries.
        </p>
        <button
          onClick={onOpenVaultModal}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
        >
          <Unlock className="w-4 h-4" />
          <span>Unlock with PIN</span>
        </button>
      </div>
    );
  }

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      filterCategory === 'all' || entry.promptCategory === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner / Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-serif font-bold text-stone-900">
              Guided Journaling Sanctuary
            </h1>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Evidence-based CBT thought records, gratitude anchors, and freeform emotional decompression.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('write')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'write'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              New Entry
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Past Reflections</span>
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-bold">
                {entries.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            title="Export entries to secure PDF or CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Export (PDF / CSV)</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Write Tab */}
      {activeTab === 'write' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Prompt Selector */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
              Select Guided Practice
            </h3>
            <div className="space-y-2">
              {INITIAL_JOURNAL_PROMPTS.map((prompt) => {
                const isSelected = selectedPrompt.id === prompt.id;
                return (
                  <button
                    key={prompt.id}
                    onClick={() => {
                      setSelectedPrompt(prompt);
                      if (prompt.isCBT) {
                        setTags(['CBT', 'Reframing']);
                      } else if (prompt.category === 'gratitude') {
                        setTags(['Gratitude', 'Joy']);
                      } else {
                        setTags(['Reflection']);
                      }
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-400 shadow-xs'
                        : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                        {prompt.category}
                      </span>
                      {prompt.isCBT && (
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          CBT Tool
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-stone-900 text-sm mt-1.5">
                      {prompt.title}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {prompt.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Privacy Guarantee Note */}
            <div className="p-3.5 bg-stone-100/80 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
              <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                Zero-Tracking Local Storage
              </div>
              <p className="text-[11px] leading-relaxed">
                Your entries remain in this browser only. We never sell, index, or use your intimate thoughts for ad targeting.
              </p>
            </div>
          </div>

          {/* Right 2 Columns: The Workspace */}
          <div className="lg:col-span-2 space-y-5">
            {/* Active Prompt Header */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Active Practice: {selectedPrompt.category.toUpperCase()}
                </span>
                {selectedPrompt.isCBT && (
                  <span className="flex items-center gap-1 text-xs text-indigo-700 font-semibold bg-indigo-50 px-2.5 py-1 rounded-md">
                    <Brain className="w-3.5 h-3.5" />
                    Structured Decatastrophizing
                  </span>
                )}
              </div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                {selectedPrompt.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {selectedPrompt.description}
              </p>

              {/* Guiding Questions */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/60 space-y-1.5">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Guiding Reflections:
                </span>
                <ul className="space-y-1 text-xs text-stone-700">
                  {selectedPrompt.questions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CBT Structured Thought Record Mode */}
            {selectedPrompt.isCBT ? (
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-100 pb-2">
                  <Sliders className="w-4 h-4 text-emerald-700" />
                  Step-by-Step Cognitive Restructuring Form
                </h3>

                {/* 1. Situation */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    1. The Triggering Situation (Objective Facts Only)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Manager didn't reply to my Friday proposal; felt sick to my stomach"
                    value={cbtSituation}
                    onChange={(e) => setCbtSituation(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 outline-none focus:border-emerald-600"
                  />
                </div>

                {/* 2. Automatic Negative Thought */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    2. Automatic Negative Thought (The story your anxious brain told you)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 'They think I am incompetent and I am going to be let go'"
                    value={cbtAutoThought}
                    onChange={(e) => setCbtAutoThought(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 outline-none focus:border-emerald-600"
                  />
                </div>

                {/* 3. Distress Before Slider */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-stone-700">Initial Distress Level:</span>
                    <span className="font-bold text-rose-700">{cbtDistressBefore} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={cbtDistressBefore}
                    onChange={(e) => setCbtDistressBefore(Number(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                    <span>1 (Mild unease)</span>
                    <span>5 (Moderate)</span>
                    <span>10 (Overwhelming Panic)</span>
                  </div>
                </div>

                {/* 4. Cognitive Distortion Selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    3. Identify the Cognitive Distortion (Labeling detaches you from the thought)
                  </label>
                  <select
                    value={cbtDistortion}
                    onChange={(e) => setCbtDistortion(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 outline-none focus:border-emerald-600 bg-white"
                  >
                    {DISTORTION_OPTIONS.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name} — {d.desc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Evidence Against */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    4. Evidence Contradicting or Opposing This Automatic Thought
                  </label>
                  <textarea
                    rows={2}
                    placeholder="What hard facts prove this catastrophic belief isn't 100% true? (e.g., received positive reviews last month; it's Friday night and they are offline)"
                    value={cbtEvidenceAgainst}
                    onChange={(e) => setCbtEvidenceAgainst(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 outline-none focus:border-emerald-600 resize-none"
                  />
                </div>

                {/* 6. Rational Compassionate Reframe */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    5. Grounded, Realistic Reframe (What would you tell someone you love?)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g., 'A delayed message on the weekend simply means people are off work. It does not reflect my self-worth or competence.'"
                    value={cbtRationalResponse}
                    onChange={(e) => setCbtRationalResponse(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 outline-none focus:border-emerald-600 resize-none"
                  />
                </div>

                {/* 7. Distress After Slider */}
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-emerald-900">Distress Level After Reframing:</span>
                    <span className="font-bold text-emerald-700">{cbtDistressAfter} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={cbtDistressAfter}
                    onChange={(e) => setCbtDistressAfter(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  {cbtDistressBefore > cbtDistressAfter && (
                    <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                      🌿 Great job! Distress reduced by {cbtDistressBefore - cbtDistressAfter} points.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Standard Journaling Form */
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Give your reflection a title (or leave blank for default)..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full font-serif text-lg font-bold text-stone-900 placeholder:text-stone-400 outline-none border-b border-stone-200 pb-2 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <textarea
                    rows={8}
                    placeholder="Pour out your mind without editing or judging. What feels heavy? What felt good? What needs to be released today?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full text-stone-800 text-sm leading-relaxed p-3 rounded-xl border border-stone-200 outline-none focus:border-emerald-600 resize-y"
                  />
                  <div className="flex justify-between items-center text-xs text-stone-400 mt-1">
                    <span>{content.trim() ? content.trim().split(/\s+/).length : 0} words</span>
                    <span>Private & unshared</span>
                  </div>
                </div>
              </div>
            )}

            {/* Mood Valence & Tags for this entry */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-stone-600 block mb-1">
                  How are you feeling as you write?
                </span>
                <div className="flex items-center gap-1.5">
                  {(
                    [
                      { val: 1, label: 'Overwhelmed', emoji: '🌧️' },
                      { val: 2, label: 'Heavy', emoji: '☁️' },
                      { val: 3, label: 'Neutral', emoji: '⛅' },
                      { val: 4, label: 'Calm', emoji: '🌿' },
                      { val: 5, label: 'Radiant', emoji: '☀️' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.val}
                      type="button"
                      onClick={() => setValenceRating(m.val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-all ${
                        valenceRating === m.val
                          ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      <span>{m.emoji}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex-1 min-w-[200px]">
                <span className="text-xs font-semibold text-stone-600 block mb-1">Tags</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="bg-stone-100 text-stone-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-rose-600 text-stone-400 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="+ Add tag"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                      className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-0.5 outline-none w-20 focus:w-28 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveEntry}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save to Private Journal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Search entries or #tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
              {['all', 'cbt', 'gratitude', 'anxiety', 'reflection', 'self-compassion', 'freewrite'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                      filterCategory === cat
                        ? 'bg-emerald-700 text-white font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Entries Grid */}
          {filteredEntries.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-400 space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-stone-300" />
              <p className="text-sm">No journal entries found matching your query.</p>
              <button
                onClick={() => setActiveTab('write')}
                className="text-xs text-emerald-700 font-semibold underline cursor-pointer"
              >
                Write your first reflection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                          {entry.promptCategory}
                        </span>
                        <span className="text-xs text-stone-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {entry.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleFavorite(entry.id)}
                          className={`p-1 rounded hover:bg-stone-100 cursor-pointer ${
                            entry.isFavorite ? 'text-amber-500' : 'text-stone-300'
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1 rounded hover:bg-rose-50 text-stone-300 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-serif font-bold text-stone-900 text-base line-clamp-1">
                      {entry.title}
                    </h3>

                    {entry.cbtRecord && (
                      <div className="bg-indigo-50/70 p-2.5 rounded-lg text-xs text-indigo-900 space-y-1">
                        <span className="font-semibold block text-[11px] text-indigo-700">
                          Distortion: {entry.cbtRecord.distortion}
                        </span>
                        <p className="line-clamp-2 italic">
                          "{entry.cbtRecord.rationalResponse}"
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {entry.content}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((t) => (
                        <span key={t} className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => exportEntryAsText(entry)}
                        className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                        title="Download as text file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setViewingEntry(entry)}
                        className="text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full View Entry Modal */}
      {viewingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200">
            <div className="p-5 border-b border-stone-200 flex items-start justify-between bg-stone-50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {viewingEntry.promptCategory}
                  </span>
                  <span className="text-xs text-stone-500">{viewingEntry.date}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  {viewingEntry.title}
                </h3>
              </div>
              <button
                onClick={() => setViewingEntry(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-sm text-stone-800 flex-1 leading-relaxed whitespace-pre-line">
              {viewingEntry.content}

              {viewingEntry.cbtRecord && (
                <div className="mt-4 p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2 text-xs text-indigo-950">
                  <h4 className="font-bold text-indigo-900 text-sm">CBT Breakdown</h4>
                  <p><strong>Trigger:</strong> {viewingEntry.cbtRecord.situation}</p>
                  <p><strong>Automatic Thought:</strong> "{viewingEntry.cbtRecord.automaticThought}"</p>
                  <p><strong>Distortion Identified:</strong> {viewingEntry.cbtRecord.distortion}</p>
                  <p><strong>Evidence Against:</strong> {viewingEntry.cbtRecord.evidenceAgainst}</p>
                  <p><strong>Rational Balanced Response:</strong> {viewingEntry.cbtRecord.rationalResponse}</p>
                  <p>
                    <strong>Distress Shift:</strong> {viewingEntry.cbtRecord.distressLevelBefore}/10 →{' '}
                    {viewingEntry.cbtRecord.distressLevelAfter}/10
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-xs">
              <button
                onClick={() => exportEntryAsText(viewingEntry)}
                className="flex items-center gap-1.5 text-stone-700 hover:text-stone-900 cursor-pointer font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export as Text File</span>
              </button>
              <button
                onClick={() => setViewingEntry(null)}
                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export to Secure PDF or CSV Modal */}
      {isExportModalOpen && (
        <JournalExportModal
          entries={entries}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}
    </div>
  );
};
