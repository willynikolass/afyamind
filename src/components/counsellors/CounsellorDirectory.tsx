import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle,
  Video,
  Phone,
  MessageSquare,
  Star,
  MapPin,
  Clock,
  Shield,
  HelpCircle,
  Check,
  X,
  User,
  Heart,
  CalendarCheck,
  ChevronRight,
} from 'lucide-react';
import { BookingRecord, Counsellor } from '../../types';
import { MOCK_COUNSELLORS } from '../../data/mockData';
import { storage } from '../../utils/storage';

export const CounsellorDirectory: React.FC = () => {
  const [counsellors] = useState<Counsellor[]>(MOCK_COUNSELLORS);
  const [bookings, setBookings] = useState<BookingRecord[]>(() => storage.getBookings());
  const [activeTab, setActiveTab] = useState<'directory' | 'my-bookings'>('directory');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedModality, setSelectedModality] = useState<string>('all');
  const [onlySlidingScale, setOnlySlidingScale] = useState(false);

  // Booking Modal State
  const [bookingCounsellor, setBookingCounsellor] = useState<Counsellor | null>(null);
  const [selectedModalityType, setSelectedModalityType] = useState<'video' | 'voice' | 'chat'>('video');
  const [selectedDate, setSelectedDate] = useState('2026-10-22');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientNote, setClientNote] = useState('');
  const [applySlidingScale, setApplySlidingScale] = useState(false);
  const [bookingCompleted, setBookingCompleted] = useState<BookingRecord | null>(null);

  const filteredCounsellors = counsellors.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.languages.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSpecialty =
      selectedSpecialty === 'all' ||
      c.specialties.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));

    const matchesModality =
      selectedModality === 'all' || c.modalities.includes(selectedModality as 'video' | 'voice' | 'chat');

    const matchesSliding = !onlySlidingScale || c.slidingScaleAvailable;

    return matchesSearch && matchesSpecialty && matchesModality && matchesSliding;
  });

  const handleOpenBooking = (counsellor: Counsellor) => {
    setBookingCounsellor(counsellor);
    setSelectedModalityType(counsellor.modalities[0] || 'video');
    setSelectedSlot(counsellor.timeSlots[0] || '10:00 AM');
    setApplySlidingScale(false);
    setBookingCompleted(null);
  };

  const handleConfirmBooking = () => {
    if (!bookingCounsellor || !clientName.trim() || !clientEmail.trim() || !selectedSlot) return;

    const baseRate = bookingCounsellor.hourlyRateUSD;
    const finalRate = applySlidingScale ? Math.round(baseRate * 0.35) : baseRate; // 65% sliding grant

    const newBooking: BookingRecord = {
      id: `bk_${Date.now()}`,
      counsellorId: bookingCounsellor.id,
      counsellorName: bookingCounsellor.name,
      counsellorAvatar: bookingCounsellor.avatar,
      sessionDate: selectedDate,
      sessionTime: selectedSlot,
      modality: selectedModalityType,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientNotes: clientNote.trim(),
      feePaid: finalRate,
      isSlidingScale: applySlidingScale,
      createdAt: new Date().toISOString(),
      meetingLink: `https://meet.afyamind.org/room/${bookingCounsellor.id}-${Date.now().toString(36)}`,
      status: 'confirmed',
    };

    const updated = storage.saveBooking(newBooking);
    setBookings(updated);
    setBookingCompleted(newBooking);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#059669', '#10B981', '#F59E0B'],
      });
    } catch {
      // Ignore
    }
  };

  const handleCancelBooking = (id: string) => {
    const updated = storage.cancelBooking(id);
    setBookings(updated);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Calendar className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-serif font-bold text-stone-900">
              Qualified & Verified Counsellors
            </h1>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Connect with licensed clinical psychologists and psychotherapists. Transparent fees with community-subsidized sliding scale options.
          </p>
        </div>

        <div className="flex items-center bg-stone-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Browse Directory
          </button>
          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'my-bookings'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>My Consultations ({bookings.filter((b) => b.status === 'confirmed').length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'directory' ? (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-wrap gap-3 items-center justify-between">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Search by name, specialty, language, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Specialty */}
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-stone-700 outline-none"
              >
                <option value="all">All Specialties</option>
                <option value="Anxiety">Anxiety & Panic</option>
                <option value="Burnout">Burnout & Overwhelm</option>
                <option value="Grief">Grief & Loss</option>
                <option value="Trauma">Trauma Recovery</option>
                <option value="Relationship">Relationships</option>
              </select>

              {/* Modality */}
              <select
                value={selectedModality}
                onChange={(e) => setSelectedModality(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-stone-700 outline-none"
              >
                <option value="all">All Formats</option>
                <option value="video">Video Call</option>
                <option value="voice">Secure Voice</option>
                <option value="chat">Live Text Consultation</option>
              </select>

              {/* Sliding Scale Toggle */}
              <button
                onClick={() => setOnlySlidingScale(!onlySlidingScale)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  onlySlidingScale
                    ? 'bg-emerald-700 text-white font-semibold'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Sliding Scale Assistance</span>
              </button>
            </div>
          </div>

          {/* Counsellor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCounsellors.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Header: Avatar, Name, Credentials */}
                  <div className="flex items-start gap-4">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-stone-100 shrink-0"
                    />
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-serif font-bold text-stone-900 text-base">{c.name}</h3>
                        {c.verified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-emerald-800">{c.title}</p>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{c.credentials}</p>
                      <div className="flex items-center gap-2 text-xs text-stone-500 pt-0.5">
                        <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {c.rating}
                        </span>
                        <span>•</span>
                        <span>{c.reviewCount} reviews</span>
                        <span>•</span>
                        <span>{c.experienceYears} yrs experience</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">{c.bio}</p>

                  {/* Specialties & Languages */}
                  <div className="space-y-2 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {c.specialties.map((s) => (
                        <span key={s} className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md text-[11px] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {c.location}
                      </span>
                      <span>Languages: {c.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Pricing & Book CTA */}
                <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold font-serif text-stone-900">${c.hourlyRateUSD}</span>
                      <span className="text-xs text-stone-400">/ 50-min session</span>
                    </div>
                    {c.slidingScaleAvailable && (
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        ✓ Sliding Scale Subsidy Available
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenBooking(c)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Book Session</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* My Bookings View */
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-400 space-y-3">
              <CalendarCheck className="w-10 h-10 mx-auto text-stone-300" />
              <h3 className="font-serif font-bold text-stone-800 text-lg">No Consultations Scheduled</h3>
              <p className="text-xs max-w-sm mx-auto">
                Take the step when you feel ready. Qualified clinicians are here to support your journey.
              </p>
              <button
                onClick={() => setActiveTab('directory')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Find a Counsellor
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={b.counsellorAvatar}
                      alt={b.counsellorName}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-stone-900 text-sm">{b.counsellorName}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          {b.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">
                        Date: <strong>{b.sessionDate}</strong> at <strong>{b.sessionTime}</strong> (50 mins)
                      </p>
                      <p className="text-[11px] text-stone-400">
                        Format: {b.modality.toUpperCase()} • Fee: ${b.feePaid}{' '}
                        {b.isSlidingScale ? '(Sliding Scale Grant Applied)' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {b.status === 'confirmed' ? (
                      <>
                        <a
                          href={b.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Virtual Room</span>
                        </a>
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="text-stone-400 hover:text-rose-600 text-xs px-2.5 py-2 rounded-lg cursor-pointer transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-stone-400 italic">Session Cancelled</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {bookingCounsellor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-stone-200">
            {/* Header */}
            <div className="bg-stone-900 text-white p-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={bookingCounsellor.avatar}
                  alt={bookingCounsellor.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-serif font-bold text-lg">{bookingCounsellor.name}</h3>
                  <p className="text-xs text-stone-300">{bookingCounsellor.title}</p>
                </div>
              </div>
              <button
                onClick={() => setBookingCounsellor(null)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-stone-800 flex-1">
              {bookingCompleted ? (
                /* Success View */
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-900">
                    Consultation Confirmed!
                  </h3>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    A confidential calendar confirmation and secure video link have been created for your session on{' '}
                    <strong>{bookingCompleted.sessionDate}</strong> at{' '}
                    <strong>{bookingCompleted.sessionTime}</strong>.
                  </p>

                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-left space-y-2 text-xs">
                    <div><strong>Clinician:</strong> {bookingCompleted.counsellorName}</div>
                    <div><strong>Modality:</strong> {bookingCompleted.modality.toUpperCase()}</div>
                    <div><strong>Meeting Link:</strong> <span className="text-emerald-700 underline">{bookingCompleted.meetingLink}</span></div>
                    <div><strong>Amount Billed:</strong> ${bookingCompleted.feePaid}</div>
                  </div>

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setBookingCounsellor(null);
                        setActiveTab('my-bookings');
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
                    >
                      View in My Consultations
                    </button>
                  </div>
                </div>
              ) : (
                /* Booking Form */
                <>
                  {/* Step 1: Modality */}
                  <div>
                    <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider text-[11px]">
                      1. Consultation Modality
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {bookingCounsellor.modalities.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setSelectedModalityType(m)}
                          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                            selectedModalityType === m
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                              : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          {m === 'video' && <Video className="w-4 h-4" />}
                          {m === 'voice' && <Phone className="w-4 h-4" />}
                          {m === 'chat' && <MessageSquare className="w-4 h-4" />}
                          <span className="capitalize">{m} Session</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Date & Slot */}
                  <div>
                    <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider text-[11px]">
                      2. Select Date & Available Time Slot
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="p-2 border border-stone-300 rounded-lg outline-none text-xs bg-white"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {bookingCounsellor.timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                            selectedSlot === slot
                              ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Contact & Intake */}
                  <div className="space-y-2">
                    <label className="block font-bold text-stone-700 uppercase tracking-wider text-[11px]">
                      3. Confidential Client Details
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Your Full Name or Pseudonym"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="p-2 border border-stone-300 rounded-lg outline-none text-xs"
                      />
                      <input
                        type="email"
                        placeholder="Your Email for Calendar Link"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="p-2 border border-stone-300 rounded-lg outline-none text-xs"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Brief note for the counsellor: What would you like to explore or focus on in this session?"
                      value={clientNote}
                      onChange={(e) => setClientNote(e.target.value)}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none text-xs resize-none"
                    />
                  </div>

                  {/* Step 4: Sliding Scale Assistance Grant */}
                  {bookingCounsellor.slidingScaleAvailable && (
                    <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-emerald-700 fill-current" />
                          AfyaMind Community Sliding Scale Grant
                        </span>
                        <input
                          type="checkbox"
                          id="slidingToggle"
                          checked={applySlidingScale}
                          onChange={(e) => setApplySlidingScale(e.target.checked)}
                          className="w-4 h-4 accent-emerald-700 cursor-pointer"
                        />
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        If you are facing financial hardship, you can apply our community subsidy to reduce this 50-minute session from ${bookingCounsellor.hourlyRateUSD} to{' '}
                        <strong>${Math.round(bookingCounsellor.hourlyRateUSD * 0.35)}</strong>. Subsidized by our institutional packages.
                      </p>
                    </div>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-stone-500">Session Total:</span>
                      <div className="text-lg font-bold font-serif text-stone-900">
                        ${applySlidingScale ? Math.round(bookingCounsellor.hourlyRateUSD * 0.35) : bookingCounsellor.hourlyRateUSD}
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-stone-400">
                      50 min • 100% Confidential
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Actions */}
            {!bookingCompleted && (
              <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setBookingCounsellor(null)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={!clientName.trim() || !clientEmail.trim() || !selectedSlot}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  Confirm & Reserve Slot
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
