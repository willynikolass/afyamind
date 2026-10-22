import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  MessageSquare,
  Globe,
  AlertTriangle,
  FileText,
  Wind,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { CRISIS_RESOURCES } from '../data/mockData';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSafetyPlan: () => void;
  onOpenBreathing: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({
  isOpen,
  onClose,
  onOpenSafetyPlan,
  onOpenBreathing,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  if (!isOpen) return null;

  const filteredResources =
    selectedRegion === 'all'
      ? CRISIS_RESOURCES
      : CRISIS_RESOURCES.filter(
          (r) => r.region.toLowerCase() === selectedRegion.toLowerCase() || r.country.toLowerCase() === selectedRegion.toLowerCase()
        );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-rose-200">
        {/* Header with High-Urgency Reassurance */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-red-700 text-white p-5 sm:p-6 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-900/60 text-rose-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              Immediate Crisis & Emergency Support
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">
              You are not alone. Help is available right now.
            </h2>
            <p className="text-rose-100 text-sm mt-1">
              If you or someone you know is in immediate danger or feeling unable to stay safe, please reach out directly. These services are free, confidential, and available 24/7.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-rose-200 hover:text-white p-1 rounded-lg hover:bg-rose-800 transition-colors cursor-pointer"
            aria-label="Close crisis dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Immediate Coping Bar */}
        <div className="bg-rose-50 border-b border-rose-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-rose-900">
          <span className="font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            No shame, no judgment. Speaking to a trained counselor is completely private.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenBreathing();
              }}
              className="flex items-center gap-1 text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer"
            >
              <Wind className="w-3.5 h-3.5" />
              Breathe First
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenSafetyPlan();
              }}
              className="flex items-center gap-1 text-indigo-800 bg-indigo-100 hover:bg-indigo-200 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              My Safety Plan
            </button>
          </div>
        </div>

        {/* Filter by Region */}
        <div className="px-5 pt-4 pb-2 flex items-center gap-2 overflow-x-auto border-b border-stone-100 no-scrollbar">
          <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">Region:</span>
          {['all', 'East Africa', 'North America', 'Europe', 'Southern Africa', 'International'].map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-rose-700 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {reg === 'all' ? 'All Regions' : reg}
            </button>
          ))}
        </div>

        {/* Hotlines List */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1 divide-y divide-stone-100">
          {filteredResources.map((res) => (
            <div key={res.id} className="pt-3.5 first:pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{res.flag}</span>
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      {res.country} ({res.region})
                    </span>
                    <span className="bg-stone-100 text-stone-600 text-[10px] px-2 py-0.5 rounded-full font-medium">
                      {res.hours}
                    </span>
                  </div>
                  <h3 className="font-bold text-stone-900 text-base">{res.serviceName}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-lg">{res.description}</p>
                  <p className="text-[11px] text-stone-400 font-medium">
                    Languages: {res.languages.join(', ')} • {res.cost}
                  </p>
                </div>

                {/* Call / Text Buttons */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <a
                    href={`tel:${res.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-xs hover:shadow transition-all text-center"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call: {res.phone}</span>
                  </a>

                  {res.sms && (
                    <a
                      href={`sms:${res.sms.replace(/[^0-9+]/g, '')}`}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-stone-800 hover:bg-stone-900 text-stone-100 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all text-center"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-stone-300" />
                      <span>{res.sms}</span>
                    </a>
                  )}

                  {res.website && (
                    <a
                      href={res.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:inline-flex items-center justify-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 transition-colors mt-0.5"
                    >
                      <Globe className="w-3 h-3" />
                      <span>Website</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Warning & Clinical Distinction */}
        <div className="bg-stone-100 border-t border-stone-200 px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          <p className="leading-relaxed text-center sm:text-left">
            <span className="font-semibold text-stone-800">Hospital Emergency:</span> If you are in imminent physical danger, please proceed to your nearest hospital emergency department or call your national emergency line (911, 999, 112).
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-semibold transition-colors cursor-pointer shrink-0"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
