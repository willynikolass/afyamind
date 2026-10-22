import React, { useState } from 'react';
import {
  X,
  FileCheck,
  Plus,
  Trash2,
  Printer,
  Shield,
  PhoneCall,
  Save,
  CheckCircle,
} from 'lucide-react';
import { SafetyPlan } from '../types';
import { storage } from '../utils/storage';

interface SafetyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyPlanModal: React.FC<SafetyPlanModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [plan, setPlan] = useState<SafetyPlan>(() => storage.getSafetyPlan());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Input states for adding new items
  const [newWarning, setNewWarning] = useState('');
  const [newCoping, setNewCoping] = useState('');
  const [newDistraction, setNewDistraction] = useState('');
  const [newSafeStep, setNewSafeStep] = useState('');

  // Support person inputs
  const [newSupportName, setNewSupportName] = useState('');
  const [newSupportContact, setNewSupportContact] = useState('');
  const [newSupportRel, setNewSupportRel] = useState('');

  // Professional inputs
  const [newProfName, setNewProfName] = useState('');
  const [newProfPhone, setNewProfPhone] = useState('');
  const [newProfService, setNewProfService] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const updated = {
      ...plan,
      lastUpdated: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };
    storage.saveSafetyPlan(updated);
    setPlan(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const removeItem = (category: 'warningSigns' | 'internalCoping' | 'distractionPlaces' | 'safeEnvironment', index: number) => {
    setPlan({
      ...plan,
      [category]: plan[category].filter((_, i) => i !== index),
    });
  };

  const addWarning = () => {
    if (!newWarning.trim()) return;
    setPlan({ ...plan, warningSigns: [...plan.warningSigns, newWarning.trim()] });
    setNewWarning('');
  };

  const addCoping = () => {
    if (!newCoping.trim()) return;
    setPlan({ ...plan, internalCoping: [...plan.internalCoping, newCoping.trim()] });
    setNewCoping('');
  };

  const addDistraction = () => {
    if (!newDistraction.trim()) return;
    setPlan({ ...plan, distractionPlaces: [...plan.distractionPlaces, newDistraction.trim()] });
    setNewDistraction('');
  };

  const addSafeStep = () => {
    if (!newSafeStep.trim()) return;
    setPlan({ ...plan, safeEnvironment: [...plan.safeEnvironment, newSafeStep.trim()] });
    setNewSafeStep('');
  };

  const addSupportPerson = () => {
    if (!newSupportName.trim() || !newSupportContact.trim()) return;
    setPlan({
      ...plan,
      supportPeople: [
        ...plan.supportPeople,
        {
          name: newSupportName.trim(),
          contact: newSupportContact.trim(),
          relationship: newSupportRel.trim() || 'Supporter',
        },
      ],
    });
    setNewSupportName('');
    setNewSupportContact('');
    setNewSupportRel('');
  };

  const removeSupportPerson = (index: number) => {
    setPlan({
      ...plan,
      supportPeople: plan.supportPeople.filter((_, i) => i !== index),
    });
  };

  const addProfessional = () => {
    if (!newProfName.trim() || !newProfPhone.trim()) return;
    setPlan({
      ...plan,
      professionalContacts: [
        ...plan.professionalContacts,
        {
          name: newProfName.trim(),
          phone: newProfPhone.trim(),
          service: newProfService.trim() || 'Clinical Contact',
        },
      ],
    });
    setNewProfName('');
    setNewProfPhone('');
    setNewProfService('');
  };

  const removeProfessional = (index: number) => {
    setPlan({
      ...plan,
      professionalContacts: plan.professionalContacts.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-200 my-auto">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-300" />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                Stanley-Brown Evidence-Based Model
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">
              My Personal Safety & Crisis Coping Plan
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm">
              Keep this plan easily accessible. When emotional pain rises to an overwhelming level, working through these exact steps creates a grounded pathway back to safety.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-2.5 flex items-center justify-between text-xs text-stone-600">
          <span>Last updated: {plan.lastUpdated}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 font-medium transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition-colors cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-stone-800">
          {/* Step 1 */}
          <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                Step 1: Warning Signs a Crisis May Be Developing
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              Thoughts, specific images, physical sensations, or behavioral shifts that signal you are starting to spiral.
            </p>
            <ul className="space-y-1.5">
              {plan.warningSigns.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between gap-2 bg-white px-3 py-1.5 rounded-lg border border-stone-200 text-xs">
                  <span>• {item}</span>
                  <button
                    onClick={() => removeItem('warningSigns', idx)}
                    className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a warning sign..."
                value={newWarning}
                onChange={(e) => setNewWarning(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addWarning()}
                className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-600"
              />
              <button
                onClick={addWarning}
                className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/80 space-y-3">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                2
              </span>
              Step 2: Internal Coping Strategies (Self-Regulation Without Others)
            </h3>
            <p className="text-xs text-stone-500">
              Activities you can do on your own to distract, soothe your nervous system, and step back from high urgency.
            </p>
            <ul className="space-y-1.5">
              {plan.internalCoping.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between gap-2 bg-white px-3 py-1.5 rounded-lg border border-stone-200 text-xs">
                  <span>• {item}</span>
                  <button
                    onClick={() => removeItem('internalCoping', idx)}
                    className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add an internal coping activity..."
                value={newCoping}
                onChange={(e) => setNewCoping(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCoping()}
                className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-600"
              />
              <button
                onClick={addCoping}
                className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/80 space-y-3">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                3
              </span>
              Step 3: Safe People & Social Settings for Healthy Distraction
            </h3>
            <p className="text-xs text-stone-500">
              Places or casual spaces you can go where there are other humans, without needing to discuss your distress directly.
            </p>
            <ul className="space-y-1.5">
              {plan.distractionPlaces.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between gap-2 bg-white px-3 py-1.5 rounded-lg border border-stone-200 text-xs">
                  <span>• {item}</span>
                  <button
                    onClick={() => removeItem('distractionPlaces', idx)}
                    className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a safe environment or setting..."
                value={newDistraction}
                onChange={(e) => setNewDistraction(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addDistraction()}
                className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-600"
              />
              <button
                onClick={addDistraction}
                className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/80 space-y-3">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                4
              </span>
              Step 4: Trusted Friends & Loved Ones I Can Ask for Help
            </h3>
            <p className="text-xs text-stone-500">
              People in your personal circle who know you and can be trusted to offer safe, non-judgmental presence.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {plan.supportPeople.map((p, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-lg border border-stone-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-stone-900">{p.name}</div>
                    <div className="text-stone-500">{p.relationship} • {p.contact}</div>
                  </div>
                  <button
                    onClick={() => removeSupportPerson(idx)}
                    className="text-stone-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Name"
                value={newSupportName}
                onChange={(e) => setNewSupportName(e.target.value)}
                className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-emerald-600"
              />
              <input
                type="text"
                placeholder="Phone / Contact"
                value={newSupportContact}
                onChange={(e) => setNewSupportContact(e.target.value)}
                className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-emerald-600"
              />
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Relationship"
                  value={newSupportRel}
                  onChange={(e) => setNewSupportRel(e.target.value)}
                  className="flex-1 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-emerald-600"
                />
                <button
                  onClick={addSupportPerson}
                  className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/80 space-y-3">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                5
              </span>
              Step 5: Professionals & Agencies to Contact in a Crisis
            </h3>
            <p className="text-xs text-stone-500">
              Your therapist, clinic, doctor, or local 24/7 crisis hotlines.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {plan.professionalContacts.map((prof, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-lg border border-stone-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-stone-900">{prof.name}</div>
                    <div className="text-stone-500">{prof.service}</div>
                    <a href={`tel:${prof.phone}`} className="text-emerald-700 font-semibold hover:underline flex items-center gap-1 mt-0.5">
                      <PhoneCall className="w-3 h-3" />
                      {prof.phone}
                    </a>
                  </div>
                  <button
                    onClick={() => removeProfessional(idx)}
                    className="text-stone-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Clinician / Service Name"
                value={newProfName}
                onChange={(e) => setNewProfName(e.target.value)}
                className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-emerald-600"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={newProfPhone}
                onChange={(e) => setNewProfPhone(e.target.value)}
                className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-emerald-600"
              />
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Role / Service"
                  value={newProfService}
                  onChange={(e) => setNewProfService(e.target.value)}
                  className="flex-1 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-emerald-600"
                />
                <button
                  onClick={addProfessional}
                  className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/80 space-y-3">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                6
              </span>
              Step 6: Making the Environment Safe
            </h3>
            <p className="text-xs text-stone-500">
              Concrete steps to remove or limit access to items or substances that could be used to cause self-harm.
            </p>
            <ul className="space-y-1.5">
              {plan.safeEnvironment.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between gap-2 bg-white px-3 py-1.5 rounded-lg border border-stone-200 text-xs">
                  <span>• {item}</span>
                  <button
                    onClick={() => removeItem('safeEnvironment', idx)}
                    className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add environment safety step..."
                value={newSafeStep}
                onChange={(e) => setNewSafeStep(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSafeStep()}
                className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-600"
              />
              <button
                onClick={addSafeStep}
                className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-100 border-t border-stone-200 p-4 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Stored locally on your device only. Never sent to advertising networks.
          </span>
          <button
            onClick={() => {
              handleSave();
              onClose();
            }}
            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
          >
            Done & Keep in Pocket
          </button>
        </div>
      </div>
    </div>
  );
};
