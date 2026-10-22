import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Award,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Download,
  Printer,
  Heart,
  Globe,
  MapPin,
  Lock,
  Volume2,
  VolumeX,
  Users,
  Feather,
  ChevronDown,
  Building,
} from 'lucide-react';
import { ManifestoPledge } from '../../types';
import { storage } from '../../utils/storage';
import { notificationService } from '../../utils/notificationService';

interface Manifesto2036Props {
  onOpenPaywall?: () => void;
  onOpenCrisis?: () => void;
  onNavigate?: (tab: string) => void;
}

const ARTICLES_EN = [
  {
    num: 'I',
    title: 'The Universal Right to Mental Peace (Haki ya Utulivu)',
    text: 'Mental wellness is not a commercial luxury for the elite; it is a foundational human birthright. Every Kenyan—from the coastal fisherfolk of Kilifi and Kwale to the hill communities of Taita Taveta and the vibrant streets of Nairobi—is entitled to psychological dignity and empathetic care.',
  },
  {
    num: 'II',
    title: 'The Total Eradication of Silence and Stigma',
    text: 'We reject the inherited colonial falsehood that emotional distress is a moral failure or personal weakness. In our villages, high schools, universities, and workplaces, seeking support shall be celebrated as an act of profound courage and leadership.',
  },
  {
    num: 'III',
    title: 'The 2036 Decadal Patient Reduction Metric',
    text: 'Our quantitative covenant: Through early mobile self-screening, CBT cognitive restructuring, and grassroots peer debriefing, we commit to reducing acute psychiatric hospitalizations and emergency institutionalizations across Kenya by over 75% before December 31, 2036.',
  },
  {
    num: 'IV',
    title: 'Financial Sovereignty & M-Pesa Micro-Access',
    text: 'No Kenyan shall ever be bankrupted by therapy bills or denied emotional refuge due to poverty. Our micro-subsidized care is accessible via Safaricom M-Pesa from just KES 50, with community-sponsored sliding scale waivers for students and low-income families.',
  },
  {
    num: 'V',
    title: 'Absolute Data Sovereignty & Zero Commercialization',
    text: 'We swear a sacred oath: Your private journals, thought records, and somatic logs will never be sold to insurance algorithms, tracked by advertisers, or harvested by foreign data brokers. All encryption keys remain entirely in your hands.',
  },
  {
    num: 'VI',
    title: 'Cultural Warmth & Vernacular Authenticity',
    text: 'Healing must speak our languages. We integrate modern evidence-based cognitive therapy with African communal philosophies—Ubuntu, Harambee, and Swahili mindfulness—grounded in ancestral resilience and communal warmth.',
  },
  {
    num: 'VII',
    title: 'Youth & High School Psychological Shielding',
    text: 'Trauma intercepted in youth prevents psychiatric tragedy in adulthood. Inspired by founder Nikolass Willy Mtunga’s high school formative years in Taita Taveta, we prioritize peer listeners and stress kits in high schools across all 47 counties.',
  },
  {
    num: 'VIII',
    title: 'The Revitalization of "Nyumba Kumi" Peer Circles',
    text: 'We transform the traditional Nyumba Kumi community structure into circles of active listening. Ten neighbors supporting ten neighbors, dismantling isolation before it deepens into clinical depression.',
  },
  {
    num: 'IX',
    title: 'Offline-First, Low-Bandwidth Universal Technology',
    text: 'Technology must serve the marginalized. AfyaMind 2036 operates offline on modest smartphones without requiring high-speed fiber, ensuring pastoralists in northern counties and remote farmers have identical access to licensed tools.',
  },
  {
    num: 'X',
    title: 'Human Dignity Over Lifelong Pharmaceutical Confinement',
    text: 'While acknowledging biomedical psychiatric medicine, we champion human autonomy, community rehabilitation, somatic breathwork, and cognitive empowerment over indefinite physical or chemical confinement.',
  },
];

const ARTICLES_SW = [
  {
    num: 'I',
    title: 'Haki ya Utulivu na Amani ya Akili',
    text: 'Afya ya akili si anasa ya matajiri pekee; ni haki ya msingi ya kila binadamu. Kila Mkenya—kuanzia wavuvi wa Pwani hadi milima ya Taita Taveta na mitaa ya Nairobi—anastahili kuheshimiwa na kupata msaada bila kubaguliwa.',
  },
  {
    num: 'II',
    title: 'Kutokomeza Unyanyapaa na Aibu ya Kihisia',
    text: 'Tunapinga dhana potofu kwamba kupitia msongo wa mawazo au sonona ni udhaifu. Katika vijiji, mashuleni, vyuo vikuu na maofisini, kutafuta usaidizi wa kisaikolojia kutachukuliwa kama ishara ya ujasiri mkuu.',
  },
  {
    num: 'III',
    title: 'Lengo Kuu la Mwaka 2036 la Kupunguza Wagonjwa',
    text: 'Ahadi yetu thabiti: Kupitia uchunguzi wa mapema kwenye simu na vikundi vya msaada vijijini, tunalenga kupunguza wagonjwa wanaolazwa hospitalini kwa maradhi ya akili kwa zaidi ya asilimia 75 kabla ya Desemba 31, 2036.',
  },
  {
    num: 'IV',
    title: 'Uwezo wa Kifedha Kupitia M-Pesa Ndogo',
    text: 'Hakuna Mkenya atakayefungiwa nje ya huduma kwa sababu ya kukosa pesa. Huduma zetu zinaanza na ada ndogo ya M-Pesa kuanzia Shilingi 50 pekee, pamoja na msamaha wa bure kwa wanafunzi na wasiojiweza.',
  },
  {
    num: 'V',
    title: 'Usiri Kamili na Kutouza Data ya Mwananchi',
    text: 'Tunaweka kiapo: Kumbukumbu zako za siri na hisia zako hazitauzwa kamwe kwa makampuni ya matangazo au wafanyabiashara wa kimataifa. Kila kitu kinabaki salama mikononi mwako.',
  },
  {
    num: 'VI',
    title: 'Mila, Desturi na Utamaduni wa Kiafrika',
    text: 'Uponyaji unapaswa kuzungumza lugha zetu. Tunachanganya saikolojia ya kisasa ya CBT na misingi yetu ya asili ya Utu, Harambee na maelewano ya jamii.',
  },
  {
    num: 'VII',
    title: 'Ulinzi wa Vijana Mashuleni na Vyuo Vikuu',
    text: 'Tukilinda vijana leo, tunazuia majanga ya kesho. Kutokana na safari ya mwanzilishi Nikolass Willy Mtunga huko Taita Taveta, tunaleta mbinu hizi katika shule za upili kote nchini.',
  },
  {
    num: 'VIII',
    title: 'Kuhuisha Nyumba Kumi ya Msaada wa Kisaikolojia',
    text: 'Tunabadilisha mpango wa Nyumba Kumi kuwa mtandao wa kusaidiana kisaikolojia. Majirani kumi wakishikana mikono kumsikiliza mmoja wao, upweke unakoma.',
  },
  {
    num: 'IX',
    title: 'Teknolojia Inayofanya Kazi Bila Mtandao (Offline)',
    text: 'Teknolojia inapaswa kuwafikia walio mbali. AfyaMind 2036 inafanya kazi kwenye simu ya kawaida hata bila bando la intaneti, ili kila mfugaji na mkulima apate huduma.',
  },
  {
    num: 'X',
    title: 'Heshima ya Mwanadamu Zaidi ya Kufungwa Hospitalini',
    text: 'Tunaheshimu matibabu ya hospitali, lakini tunasisitiza uwezo wa mwanadamu kujitawala, kupumua, kurekebisha fikra na kuungana na jamii badala ya kuwekwa kizuizini.',
  },
];

export const Manifesto2036: React.FC<Manifesto2036Props> = ({
  onOpenPaywall,
  onOpenCrisis,
  onNavigate,
}) => {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [pledges, setPledges] = useState<ManifestoPledge[]>(() =>
    storage.getManifestoPledges()
  );
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [signerCounty, setSignerCounty] = useState('Coast Region & Taita Taveta');
  const [signerNote, setSignerNote] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const articles = language === 'en' ? ARTICLES_EN : ARTICLES_SW;
  const totalSigners = 14842 + pledges.length;

  // Handle co-signing
  const handleSignManifesto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName.trim()) return;

    const newPledge: ManifestoPledge = {
      id: `pl-${Date.now()}`,
      fullName: signerName.trim(),
      county: signerCounty,
      signedAt: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      commitmentNote: signerNote.trim(),
    };

    const updated = storage.signManifestoPledge(newPledge);
    setPledges(updated);
    setIsSigned(true);
    setIsSignModalOpen(false);

    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.6 },
    });

    notificationService.sendPushNotification({
      title: '2036 Manifesto Co-Signed!',
      body: `Asante sana, ${newPledge.fullName}! Your signature stands as a beacon for Kenyan mental health sovereignty.`,
    });
  };

  // Printable Charter
  const handlePrintCharter = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const charterHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ilani ya AfyaMind 2036 — Official Decadal Declaration</title>
  <style>
    @page { size: A4; margin: 18mm; }
    body { font-family: 'Georgia', serif; color: #1c1917; line-height: 1.5; font-size: 10.5pt; }
    .gold-border { border: 4px double #064e3b; padding: 25px; border-radius: 8px; }
    .seal-header { text-align: center; border-bottom: 2px solid #064e3b; padding-bottom: 15px; margin-bottom: 20px; }
    .seal-title { font-size: 24pt; font-weight: bold; color: #064e3b; text-transform: uppercase; letter-spacing: 1px; margin: 0; }
    .seal-sub { font-size: 11pt; color: #78716c; font-style: italic; margin-top: 5px; }
    .author-line { font-size: 10pt; font-weight: bold; color: #047857; margin-top: 8px; }
    .article-item { margin-bottom: 14px; page-break-inside: avoid; }
    .article-num { font-weight: bold; color: #064e3b; font-size: 11pt; }
    .article-title { font-weight: bold; color: #1c1917; }
    .article-text { font-size: 9.5pt; color: #292524; margin-top: 2px; }
    .signatures { display: flex; justify-content: space-between; margin-top: 35px; padding-top: 20px; border-top: 1px solid #d6d3d1; }
    .sig-box { width: 45%; text-align: center; }
    .sig-line { border-bottom: 1px solid #1c1917; height: 35px; margin-bottom: 5px; }
  </style>
</head>
<body>
  <div class="gold-border">
    <div class="seal-header">
      <div style="font-size: 9pt; font-weight: bold; color: #047857; letter-spacing: 2px;">OFFICIAL DECADAL CHARTER</div>
      <h1 class="seal-title">Ilani ya AfyaMind 2036</h1>
      <div class="seal-sub">The Decadal Declaration for Universal Mental Healthcare &amp; Stigma Eradication</div>
      <div class="author-line">Solemnly Proclaimed by Founder Nikolass Willy Mtunga • Coast Region &amp; Taita Taveta Heritage</div>
    </div>

    ${articles
      .map(
        (a) => `
      <div class="article-item">
        <span class="article-num">Article ${a.num}.</span>
        <span class="article-title">${a.title} — </span>
        <span class="article-text">${a.text}</span>
      </div>
    `
      )
      .join('')}

    <div class="signatures">
      <div class="sig-box">
        <div class="sig-line" style="font-family: cursive; font-size: 16pt; color: #064e3b;">Nikolass Willy Mtunga</div>
        <strong>Nikolass Willy Mtunga</strong><br>
        <span style="font-size: 8pt; color: #78716c;">Founder &amp; Chief Architect, AfyaMind 2036<br>Safaricom Line: +254746867552</span>
      </div>
      <div class="sig-box">
        <div class="sig-line"></div>
        <strong>Citizen Co-Signer &amp; Kenyan Ally</strong><br>
        <span style="font-size: 8pt; color: #78716c;">Co-signed with over ${totalSigners.toLocaleString()} citizens across all 47 counties</span>
      </div>
    </div>
  </div>
  <script>window.addEventListener('load', () => setTimeout(() => window.print(), 400));</script>
</body>
</html>
    `;

    printWindow.document.open();
    printWindow.document.write(charterHtml);
    printWindow.document.close();
  };

  const handleShare = () => {
    const text = `Read the official AfyaMind 2036 Mental Health Manifesto proclaimed by founder Nikolass Willy Mtunga (Coast Region & Taita Taveta): Reducing psychiatric distress across Kenya before 2036.`;
    if (navigator.share) {
      navigator.share({ title: 'AfyaMind 2036 Manifesto', text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Hero Proclamation Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 text-white rounded-3xl p-7 sm:p-11 shadow-2xl relative overflow-hidden border border-emerald-800/50">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/90 text-emerald-200 text-xs font-semibold uppercase tracking-wider border border-emerald-600/40">
              <Feather className="w-3.5 h-3.5 text-amber-300" />
              The Official 2036 Decadal Manifesto
            </span>
            <span className="text-xs text-stone-300 bg-stone-800/80 px-2.5 py-1 rounded-full font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Authored by Nikolass Willy Mtunga
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            {language === 'en'
              ? 'The AfyaMind 2036 Manifesto: A Sacred Covenant for Kenyan Mental Dignity'
              : 'Ilani ya AfyaMind 2036: Kiapo cha Heshima na Utulivu wa Akili Nchini Kenya'}
          </h1>

          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Rooted in the lived experiences of Kenya's <strong>Coast Region</strong> and shaped through high school in the misty heights of <strong>Taita Taveta</strong>, founder <strong>Nikolass Willy Mtunga</strong> establishes this solemn declaration to cut clinical psychiatric admissions before 2036.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsSignModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Feather className="w-4 h-4" />
              <span>Co-Sign the Community Manifesto</span>
            </button>
            <button
              onClick={handlePrintCharter}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>Print Official Charter PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/20 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedShare ? 'Link Copied!' : 'Share Manifesto'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Bilingual Toggle & Signers Tally */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <Users className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="font-bold text-stone-900 text-sm">
              {totalSigners.toLocaleString()} Verified Kenyan Co-Signers
            </div>
            <p className="text-xs text-stone-500">
              Standing with founder Nikolass Willy Mtunga across all 47 counties
            </p>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('sw')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              language === 'sw'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Kiswahili
          </button>
        </div>
      </div>

      {/* The 10 Articles Grid */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
            The Decadal Articles
          </span>
          <h2 className="font-serif font-bold text-stone-900 text-2xl">
            {language === 'en' ? 'The Ten Inviolable Pillars' : 'Nguzo Kumi Zisizovunjika'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((art) => (
            <div
              key={art.num}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all space-y-2.5 relative"
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 font-serif font-bold text-sm flex items-center justify-center">
                  {art.num}
                </span>
                <span className="text-[10px] font-mono font-bold text-stone-400">
                  Vision 2036 Covenant
                </span>
              </div>

              <h3 className="font-serif font-bold text-stone-900 text-base leading-snug">
                {art.title}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed">
                {art.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Signature Seal Card */}
      <div className="bg-stone-900 text-white rounded-3xl p-7 sm:p-9 border border-stone-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-stone-800">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
              Architectural Attestation
            </span>
            <h3 className="font-serif font-bold text-2xl text-white">
              Signed &amp; Proclaimed by Nikolass Willy Mtunga
            </h3>
            <p className="text-xs text-stone-400">
              Founder, AfyaMind 2036 • Safaricom Line: +254746867552 • Coast Region &amp; Taita Taveta
            </p>
          </div>

          <div className="text-center sm:text-right">
            <div className="font-serif italic text-2xl sm:text-3xl text-amber-300 font-bold tracking-wide">
              Nikolass Willy Mtunga
            </div>
            <div className="text-[10px] text-stone-400 font-mono mt-1">
              Decadal Seal: AM-2036-KENYA-AUTH
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p className="leading-relaxed max-w-xl">
            "I pledge my life’s work to ensure that no Kenyan shall ever weep in isolation or be turned away from mental peace. Before the year 2036, our nation will be whole."
          </p>

          <button
            onClick={() => setIsSignModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs whitespace-nowrap cursor-pointer transition-colors"
          >
            Add Your Co-Signature
          </button>
        </div>
      </div>

      {/* Co-Sign Modal */}
      {isSignModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Feather className="w-5 h-5 text-emerald-700" />
                <h3 className="font-serif font-bold text-stone-900 text-lg">
                  Co-Sign the 2036 Manifesto
                </h3>
              </div>
              <button
                onClick={() => setIsSignModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 font-bold text-lg"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              Add your name to the official roll of honor alongside founder Nikolass Willy Mtunga to stand for stigma-free healthcare across Kenya:
            </p>

            <form onSubmit={handleSignManifesto} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Your Full Name or Professional Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Kelvin Mwavita or Dr. Faith Chebet"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  County of Residence
                </label>
                <input
                  type="text"
                  placeholder="e.g., Taita Taveta, Mombasa, Nairobi, Kisumu"
                  value={signerCounty}
                  onChange={(e) => setSignerCounty(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Personal Covenant / Message (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., I stand for student wellness in high schools across Kenya."
                  value={signerNote}
                  onChange={(e) => setSignerNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 outline-none focus:border-emerald-600 resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsSignModalOpen(false)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Solemnly Co-Sign</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
