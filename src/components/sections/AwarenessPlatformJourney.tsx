import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Shield,
  HeartHandshake,
  Stethoscope,
  Wifi,
  WifiOff,
  Volume2,
  Globe,
  CheckCircle2,
  ChevronRight,
  ArrowDown,
  ArrowRight,
  Users,
  Activity,
  AlertTriangle,
  FileText,
  Lock,
  Compass,
  Play,
  Send,
  HelpCircle,
  Clock,
  MapPin,
  Smile,
  Zap,
  PhoneCall,
  Sparkle,
  Search,
  Check,
  ChevronDown,
  ExternalLink,
  Info,
} from 'lucide-react';
import { PixelSwap } from '../ui/PixelSwap';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';
import { SupportedLanguage, UserRole } from '../../types';

interface AwarenessPlatformJourneyProps {
  onSelectRole: (role: UserRole) => void;
  onOpenVoiceAssistant: () => void;
  onOpenArchitecture: () => void;
  onOpenPrivacy: () => void;
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
}

export const AwarenessPlatformJourney: React.FC<AwarenessPlatformJourneyProps> = ({
  onSelectRole,
  onOpenVoiceAssistant,
  onOpenArchitecture,
  onOpenPrivacy,
  currentLang,
  onLanguageChange,
  isOffline,
  onToggleOffline,
}) => {
  // Navigation & interaction states
  const [activeTabFeature, setActiveTabFeature] = useState<'memory' | 'games' | 'reminders' | 'sos' | 'music'>('memory');
  const [playingLang, setPlayingLang] = useState<SupportedLanguage | null>(null);
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'family',
    phone: '',
    email: '',
    state: 'Assam',
    message: '',
  });

  // Dialect audio phrases for the 7 NE languages
  const dialectSamples: Record<SupportedLanguage, { label: string; state: string; text: string; sub: string }> = {
    as: {
      label: 'অসমীয়া (Assamese)',
      state: 'Assam • Brahmaputra Valley',
      text: 'নমস্কাৰ ধীৰেন দেউতা! আপোনাৰ পুৱাৰ চাহ আৰু স্মৃতি বাগিচালৈ স্বাগতম। আজি আমি বিহুৰ গান শুনিমে নে?',
      sub: 'Warm greeting reminding elder of morning tea and heritage songs.',
    },
    bn: {
      label: 'বাংলা (Bengali)',
      state: 'Barak Valley • Tripura',
      text: 'নমস্কার ধীরেনবাবু! আজকের সকালের ওষুধ ও সুন্দর স্মৃতি মনে করিয়ে দিচ্ছি। আপনি কেমন আছেন?',
      sub: 'Gentle morning orientation with medication reminder in clear Bengali.',
    },
    mni: {
      label: 'ꯃꯤꯇꯩꯂꯣꯟ (Meiteilon / Manipuri)',
      state: 'Manipur • Imphal Valley',
      text: 'ꯈꯨꯔꯨꯝꯖꯔꯤ! ꯉꯁꯤꯒꯤ ꯅꯨꯃꯤꯠ ꯑꯁꯤ ꯅꯨꯡꯉꯥꯏꯅꯥ ꯊꯣꯛꯄꯤꯌꯨ꯫ ꯂꯣꯛꯇꯥꯛ ꯄꯥꯠꯀꯤ ꯐꯨꯝꯗꯤꯁꯤꯡ ꯅꯤꯡꯁꯤꯡꯁꯤ꯫',
      sub: 'Cultural Loktak Lake reminiscence cue spoken in traditional Meiteilon.',
    },
    lus: {
      label: 'Mizo ṭawng',
      state: 'Mizoram • Aizawl & Hills',
      text: 'Chibai Dhiren! Vawiin chu ni ṭha tak a ni e. I chhungte nen thlalak kan en dawn em ni?',
      sub: 'Encouraging elder to look through family album photos in Mizo.',
    },
    kha: {
      label: 'Khasi',
      state: 'Meghalaya • Shillong & Khasi Hills',
      text: 'Khublei Dhiren! Sngewbha shim ia ki dawai jong phi ha ka por kaba biang bad shongsuk.',
      sub: 'Peaceful voice cadence for medication timing in Khasi.',
    },
    hi: {
      label: 'हिन्दी (Hindi)',
      state: 'NER Urban & Tribal Common Bridge',
      text: 'नमस्ते धीरेन जी! आज की सुबह बहुत सुहानी है। चलिए आज की मनपसंद पहेलियाँ हल करते हैं।',
      sub: 'Friendly daily cognitive check-in phrase in regional Hindi.',
    },
    en: {
      label: 'English (NER Dialect)',
      state: 'Pan-North East Regional English',
      text: 'Good morning Dhiren! Your daughter Priyanka sent a new family audio message from Guwahati.',
      sub: 'Clear, paced English voice prompt designed for elderly comprehension.',
    },
  };

  const handlePlayVoiceSample = (langKey: SupportedLanguage) => {
    sound.playClick();
    setPlayingLang(langKey);
    const sample = dialectSamples[langKey];
    voice.speak(sample.text, langKey, () => {
      setPlayingLang(null);
    });
  };

  const faqs = [
    {
      q: 'Why is MindCare NER specially engineered for North East India?',
      a: 'North East India has distinctive geographic and cultural realities: 70%+ hilly terrain where hospital travel takes 8+ hours, over 100+ native dialects, high rates of undiagnosed mild cognitive impairment (MCI), and frequent monsoon power or mobile network disruptions. MindCare NER provides offline-first cognitive exercises rooted in North East culture (Bihu, Cheraw, Loktak, Tea Gardens) in 7 local languages.',
    },
    {
      q: 'Does the elder need active internet to use the tablet?',
      a: 'No! MindCare NER operates 100% offline. All cognitive games, voice prompts, circadian music therapy, and medication alarms run locally on the edge. When an internet or mobile data connection becomes available, the tablet silently syncs encrypted logs to the Caregiver and Doctor portals without interrupting the senior.',
    },
    {
      q: 'How does it help families living in other cities (e.g., Bengaluru, Delhi)?',
      a: 'The Caregiver Dashboard allows family members anywhere in the world to check real-time medication adherence, daily mood and sundowning scores, cognitive trend graphs, and push one-click voice notes or photos directly to their parent’s tablet.',
    },
    {
      q: 'How can clinicians at GMCH or NEIGRIHMS use the data?',
      a: 'The Clinician Portal maps the patient’s gameplay reaction times and memory recall directly to MoCA (Montreal Cognitive Assessment) and MMSE scores. Doctors receive longitudinal cognitive stability curves, allowing them to adjust medical dosages and identify subtle decline 6-12 months earlier.',
    },
    {
      q: 'How does the platform ensure patient data privacy under Indian laws?',
      a: 'MindCare NER is fully compliant with the Digital Personal Data Protection (DPDP) Act 2023 of India and designed for Ayushman Bharat Digital Mission (ABDM) integration. Health data is encrypted end-to-end with AES-256, stored on-device first, and never monetized or shared with third parties.',
    },
    {
      q: 'What if the patient has severe hand tremors or low literacy?',
      a: 'MindCare NER includes an Accessibility Mode with Voice-First operation, tactile oversized button targets (minimum 64px), high-contrast senior color themes, audio explanations for every screen, and reduced vestibular motion.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const scrollToSection = (id: string) => {
    sound.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    setContactSubmitted(true);
  };

  return (
    <div className="w-full bg-[#f8faff] text-[#001849] space-y-16 pb-20 selection:bg-teal-200">
      {/* ========================================================================= */}
      {/* 1. AWARENESS BANNER & URGENT CONTEXT */}
      {/* ========================================================================= */}
      <section id="section-awareness" className="bg-gradient-to-r from-[#003838] via-[#004d4d] to-[#001849] text-white py-4 px-4 sm:px-6 shadow-md border-b-2 border-teal-500/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-wide uppercase text-teal-200">
              North East India Dementia Awareness Initiative • 2026
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-teal-100 font-medium">
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/20">
              📊 <strong>180,000+</strong> Elders with MCI in NER
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/20">
              ⚠️ <strong>84%</strong> Undiagnosed & Unmonitored
            </span>
            <button
              onClick={() => scrollToSection('section-hero')}
              className="text-amber-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Explore Solution <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. HERO / PROBLEM */}
      {/* ========================================================================= */}
      <section id="section-hero" className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-black tracking-wider uppercase shadow-xs">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Dementia & Memory Care for the 8 Sisters</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#001849] tracking-tight leading-[1.12]">
              Bridging North East India with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006767] to-[#0284c7]">
                Dignified Cognitive Care
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#3e4948] font-normal leading-relaxed">
              MindCare NER is the first culturally native, voice-first, offline-resilient dementia assistance platform tailored for elderly citizens across Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh, and Sikkim.
            </p>

            {/* Quick Action Navigation */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-cta-demo"
                onClick={() => {
                  sound.playClick();
                  onSelectRole('PATIENT');
                }}
                className="px-6 py-3.5 rounded-2xl bg-[#006767] hover:bg-[#005252] text-white font-extrabold text-base shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Launch Interactive Demo</span>
              </button>

              <button
                id="hero-cta-how"
                onClick={() => scrollToSection('section-how-it-works')}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#001849] font-bold text-base border-2 border-[#dae1ff] shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>How It Works</span>
                <ArrowDown className="w-4 h-4 text-[#455f88]" />
              </button>
            </div>

            {/* Micro Trust Proofs */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
              <div>
                <p className="text-2xl font-black text-[#006767]">7</p>
                <p className="text-xs font-semibold text-[#455f88]">NE Languages</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#0284c7]">100%</p>
                <p className="text-xs font-semibold text-[#455f88]">Offline Capable</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#16a34a]">MoCA / MMSE</p>
                <p className="text-xs font-semibold text-[#455f88]">Clinically Aligned</p>
              </div>
            </div>
          </div>

          {/* Right Visual: Interactive Reminiscence Blossom preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-[#dae1ff] space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[#006767] tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Live Memory Recall Preview
                </span>
                <span className="text-[11px] font-bold bg-teal-50 text-teal-800 px-2.5 py-1 rounded-full border border-teal-200">
                  Tap to Reveal 🌸
                </span>
              </div>

              <div className="rounded-2xl overflow-hidden border border-[#dae1ff]">
                <PixelSwap
                  firstContent={
                    <div className="w-full h-full min-h-[220px] bg-[#004d4d] p-6 flex flex-col justify-between text-white select-none cursor-pointer">
                      <div>
                        <span className="text-xs font-black text-teal-300 uppercase tracking-widest">
                          Heritage Recall #01
                        </span>
                        <h3 className="text-xl font-black mt-1">
                          "Which historic tea garden in Dibrugarh was planted in 1835?"
                        </h3>
                      </div>
                      <div className="flex items-center justify-between text-xs text-teal-200 font-bold pt-4 border-t border-teal-500/40">
                        <span>Hint: Assam Heritage Tea</span>
                        <span className="bg-teal-400 text-[#003838] px-3 py-1 rounded-lg font-black">
                          Click to Flip ➔
                        </span>
                      </div>
                    </div>
                  }
                  secondContent={
                    <div className="w-full h-full min-h-[220px] bg-gradient-to-br from-[#024e54] to-[#1e3a8a] p-6 flex flex-col justify-between text-white select-none cursor-pointer">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-amber-300 uppercase tracking-widest">
                            Memory Unlocked!
                          </span>
                          <span className="text-xs bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                            +10 Points
                          </span>
                        </div>
                        <h3 className="text-xl font-black mt-1">
                          চাবুৱা চাহ বাগিচা • Chabua Tea Estate
                        </h3>
                        <p className="text-xs text-teal-100 mt-1">
                          The birth of Assam orthodox tea! Dhiren worked with Dibrugarh tea garden estates in 1978.
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-teal-200 font-bold">↺ Tap to flip back</span>
                      </div>
                    </div>
                  }
                  pixelSize={42}
                  gap={0}
                  pattern="center"
                  trigger="click"
                  aspectRatio="auto"
                  className="w-full"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-medium text-slate-600">
                <span className="flex items-center gap-2 font-bold text-[#001849]">
                  <Globe className="w-4 h-4 text-teal-600" />
                  Culturally Anchored Stimulation
                </span>
                <span className="text-[#006767] font-bold">PixelSwap Animated</span>
              </div>
            </div>
          </div>
        </div>

        {/* The 4-Fold Regional Problem Grid */}
        <div className="mt-14 space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#001849] tracking-tight">
              The Unaddressed Crisis in North East India
            </h2>
            <p className="text-base text-[#455f88]">
              Standard Western and metro-focused health apps fail elderly citizens in the North Eastern states due to four acute structural hurdles:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-red-100 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xl">
                ⛰️
              </div>
              <h3 className="text-lg font-black text-[#001849]">Severe Geographic Isolation</h3>
              <p className="text-sm text-[#3e4948] leading-relaxed">
                Rural elders in Nagaland, Arunachal, and Assam face 6-12 hours of hill transit to reach neurology clinics in Guwahati or Shillong.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-amber-100 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xl">
                🗣️
              </div>
              <h3 className="text-lg font-black text-[#001849]">Linguistic & Cultural Disconnect</h3>
              <p className="text-sm text-[#3e4948] leading-relaxed">
                English-only tests confuse elderly patients. Memory recall is 400% higher when stimulated in Assamese, Bengali, Meitei, Mizo, or Khasi.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl">
                🔌
              </div>
              <h3 className="text-lg font-black text-[#001849]">Monsoon Power & Network Outages</h3>
              <p className="text-sm text-[#3e4948] leading-relaxed">
                Frequent cellular blackouts during annual floods crash cloud-dependent software, leaving vulnerable seniors without daily reminders.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-teal-100 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-black text-xl">
                💔
              </div>
              <h3 className="text-lg font-black text-[#001849]">Silent Caregiver Burnout</h3>
              <p className="text-sm text-[#3e4948] leading-relaxed">
                Working daughters and sons lack objective data on cognitive decline trajectories, medication adherence, and early sundowning symptoms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHY MINDCARE NER? */}
      {/* ========================================================================= */}
      <section id="section-why-mindcare" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#002744] via-[#003838] to-[#001849] rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-10 border border-teal-500/30">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-teal-400/20 text-teal-200 text-xs font-black uppercase tracking-wider border border-teal-400/30">
              Why MindCare NER?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Engineered Specially for the Hill & River Terrains
            </h2>
            <p className="text-base text-teal-100">
              A purpose-built ecosystem bridging the patient’s home verandas, the working family’s smartphone, and the neurologist’s clinic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white/10 rounded-2xl border border-white/15 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-400 text-[#002744] flex items-center justify-center font-black text-lg">
                1
              </div>
              <h3 className="text-lg font-extrabold text-white">Cultural Reminiscence</h3>
              <p className="text-sm text-teal-100 leading-relaxed">
                Deep regional anchors: Majuli mask art, Bihu rhythmic cues, Loktak Lake stories, Mizo Cheraw patterns, and Shillong pine melodies.
              </p>
            </div>

            <div className="p-6 bg-white/10 rounded-2xl border border-white/15 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-400 text-[#002744] flex items-center justify-center font-black text-lg">
                2
              </div>
              <h3 className="text-lg font-extrabold text-white">Dialect Voice AI</h3>
              <p className="text-sm text-teal-100 leading-relaxed">
                Natural dialect synthesis in 7 regional languages designed with slow, calming prosody tailored for senior hearing and comprehension.
              </p>
            </div>

            <div className="p-6 bg-white/10 rounded-2xl border border-white/15 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400 text-[#002744] flex items-center justify-center font-black text-lg">
                3
              </div>
              <h3 className="text-lg font-extrabold text-white">Edge-First Resilience</h3>
              <p className="text-sm text-teal-100 leading-relaxed">
                Never pauses during internet loss. Local SQLite and IndexedDB run everything on-device with automated conflict-free sync.
              </p>
            </div>

            <div className="p-6 bg-white/10 rounded-2xl border border-white/15 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#002744] flex items-center justify-center font-black text-lg">
                4
              </div>
              <h3 className="text-lg font-extrabold text-white">Tri-Partite Care Loop</h3>
              <p className="text-sm text-teal-100 leading-relaxed">
                Synchronizes the Patient, Family Caregiver, and GMCH/District Doctor with objective MoCA/MMSE clinical telemetry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW IT WORKS */}
      {/* ========================================================================= */}
      <section id="section-how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-wider border border-slate-200">
            Care Loop Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#001849] tracking-tight">
            How MindCare NER Operates Daily
          </h2>
          <p className="text-base text-[#455f88]">
            A seamless, dignified daily routine with zero clinical intimidation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="bg-white p-8 rounded-3xl border-2 border-[#dae1ff] shadow-sm space-y-4 relative">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 font-black text-2xl flex items-center justify-center border border-teal-200">
              01
            </div>
            <h3 className="text-xl font-black text-[#001849]">Daily Native Morning Check-In</h3>
            <p className="text-sm text-[#3e4948] leading-relaxed">
              The tablet wakes with a comforting audio greeting in the patient's native dialect, guiding them through 10 minutes of Memory Garden blossom recall, medication chimes, and routine orientation.
            </p>
            <div className="pt-2 text-xs font-bold text-teal-700 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-600" /> Non-intimidating playful interactions
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border-2 border-[#dae1ff] shadow-sm space-y-4 relative">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 font-black text-2xl flex items-center justify-center border border-blue-200">
              02
            </div>
            <h3 className="text-xl font-black text-[#001849]">Continuous Edge Telemetry</h3>
            <p className="text-sm text-[#3e4948] leading-relaxed">
              As the senior plays memory games and responds to prompts, the on-device AI silently logs reaction latency, recall stability, verbal hesitation, and sundowning risk without fatiguing the elder.
            </p>
            <div className="pt-2 text-xs font-bold text-blue-700 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-600" /> 100% on-device local computation
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border-2 border-[#dae1ff] shadow-sm space-y-4 relative">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-2xl flex items-center justify-center border border-emerald-200">
              03
            </div>
            <h3 className="text-xl font-black text-[#001849]">Caregiver & Clinician Sync</h3>
            <p className="text-sm text-[#3e4948] leading-relaxed">
              Encrypted delta updates populate the Caregiver mobile app and GMCH Clinical Portal, generating longitudinal stability curves and early warnings before acute disorientation events occur.
            </p>
            <div className="pt-2 text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-600" /> MoCA/MMSE clinical integration
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CORE FEATURES */}
      {/* ========================================================================= */}
      <section id="section-core-features" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
          <span className="px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-black uppercase tracking-wider border border-teal-200">
            Core Modules
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#001849] tracking-tight">
            Designed with Tactile Care & Cultural Reverence
          </h2>
          <p className="text-base text-[#455f88]">
            Explore the five primary modules built specifically for dementia patient comfort.
          </p>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'memory', label: '🌸 Memory Garden & Blossoms' },
            { id: 'games', label: '🧩 Cultural Cognitive Games' },
            { id: 'reminders', label: '⏰ Smart Audio Routines' },
            { id: 'sos', label: '🆘 Tactile Emergency SOS' },
            { id: 'music', label: '🎵 Heritage Music Therapy' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTabFeature(tab.id as any);
              }}
              className={`px-4 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                activeTabFeature === tab.id
                  ? 'bg-[#006767] text-white shadow-md'
                  : 'bg-white text-[#001849] border border-[#dae1ff] hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Tab Content Display */}
        <div className="bg-white rounded-3xl border-2 border-[#dae1ff] p-8 shadow-lg">
          {activeTabFeature === 'memory' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-black text-teal-700 uppercase tracking-wide">
                  Module 01 • Reminiscence Therapy
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#001849]">
                  Personal Memory Garden & Animated Blossom Recall
                </h3>
                <p className="text-base text-[#3e4948] leading-relaxed">
                  Utilizes smooth pixelated swap transitions to reveal vintage family photographs, historical North East landmarks, family wedding memories, and cherished childhood stories without cognitive strain.
                </p>
                <div className="space-y-2 text-sm text-[#455f88]">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    Interactive PixelSwap flower transitions
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    Family member audio tags in mother tongue
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    Personal story recording and playback for grandchildren
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6 bg-gradient-to-br from-[#003838] to-[#001849] p-6 rounded-2xl text-white shadow-md space-y-4">
                <div className="flex items-center justify-between text-xs text-teal-200">
                  <span className="font-bold">🌸 Live Interactive Widget</span>
                  <span>Click card to test</span>
                </div>
                <PixelSwap
                  firstContent={
                    <div className="p-6 bg-[#004d4d] min-h-[180px] rounded-xl flex flex-col justify-between cursor-pointer">
                      <h4 className="text-lg font-black">"Where did you celebrate Rongali Bihu in 1974?"</h4>
                      <span className="text-xs text-teal-200 font-bold">➔ Tap to view family photograph</span>
                    </div>
                  }
                  secondContent={
                    <div className="p-6 bg-[#024e54] min-h-[180px] rounded-xl flex flex-col justify-between cursor-pointer">
                      <h4 className="text-lg font-black">Latasil Field, Guwahati!</h4>
                      <p className="text-xs text-teal-100">With your elder brother Pranab listening to Bhupen Hazarika's live concert.</p>
                      <span className="text-[11px] text-teal-200 font-bold">↺ Tap to flip</span>
                    </div>
                  }
                  pixelSize={36}
                  duration={900}
                  trigger="click"
                  aspectRatio="auto"
                  className="w-full rounded-xl overflow-hidden"
                />
              </div>
            </div>
          )}

          {activeTabFeature === 'games' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-black text-blue-700 uppercase tracking-wide">
                  Module 02 • Neuro-Cognitive Games
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#001849]">
                  Culturally Grounded Cognitive Exercises
                </h3>
                <p className="text-base text-[#3e4948] leading-relaxed">
                  Games calibrated to MoCA domains: Assam tea leaf sorting, Bihu Dhol rhythmic tap matching, Khasi spice box recall, and Manipuri textile pattern sequence puzzles.
                </p>
                <div className="space-y-2 text-sm text-[#455f88]">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Zero frustration adaptive difficulty
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Gentle positive audio reinforcement in Assamese / Bengali / Mizo
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Executive function & attention span tracking
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-sm text-[#001849]">Available Native Exercises:</h4>
                <div className="grid grid-cols-2 gap-3 text-xs font-bold text-[#001849]">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                    <span>🍃</span> Tea Garden Sorting
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                    <span>🥁</span> Bihu Rhythms
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                    <span>🧺</span> Assam Kitchen Spices
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                    <span>🪘</span> Mizo Cheraw Patterns
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTabFeature === 'reminders' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-black text-amber-700 uppercase tracking-wide">
                  Module 03 • Routine & Adherence
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#001849]">
                  Family Voice Audio Medication & Water Alarms
                </h3>
                <p className="text-base text-[#3e4948] leading-relaxed">
                  Instead of harsh electronic beeps that cause anxiety, medication alarms play in the elder's daughter's or grandson's own recorded voice: <em>"Deuta, your morning blood pressure tablet is ready on the table with warm water."</em>
                </p>
                <div className="space-y-2 text-sm text-[#455f88]">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    High-contrast color-coded morning/noon/night pills
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    One-touch large tactile confirmation button
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6 p-6 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-800">Sample Active Alarm</span>
                  <span className="text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">08:30 AM</span>
                </div>
                <h4 className="text-lg font-black text-amber-950">Morning Blood Pressure & Memory Vitamin</h4>
                <p className="text-xs text-amber-800">
                  Recorded by Priyanka (Daughter): "দেউতা, পুৱাৰ হালধীয়া টেবলেটটো খাই লওক।"
                </p>
                <button
                  onClick={() => sound.playSuccess()}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  ✓ Confirm Taken (Audio Chime)
                </button>
              </div>
            </div>
          )}

          {activeTabFeature === 'sos' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-black text-rose-700 uppercase tracking-wide">
                  Module 04 • Safety & Wander Prevention
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#001849]">
                  One-Touch Emergency SOS & Geofence Beacon
                </h3>
                <p className="text-base text-[#3e4948] leading-relaxed">
                  If the patient feels disoriented or wanders outside their home perimeter, one press triggers offline SMS emergency alerts, GPS coordinates, and initiates a direct hands-free speakerphone call to the designated caregiver.
                </p>
              </div>

              <div className="lg:col-span-6 p-6 bg-rose-50 rounded-2xl border-2 border-rose-200 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-rose-600 text-white flex items-center justify-center text-3xl font-black shadow-lg animate-pulse">
                  SOS
                </div>
                <div>
                  <h4 className="text-lg font-black text-rose-950">Dedicated Senior Emergency Hub</h4>
                  <p className="text-xs text-rose-800 mt-1">
                    Auto-dials Priyanka Borah (+91 94350 12345) & sends GPS coordinates.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTabFeature === 'music' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-black text-purple-700 uppercase tracking-wide">
                  Module 05 • Circadian Music Therapy
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#001849]">
                  Heritage Music & Sundowning Relief
                </h3>
                <p className="text-base text-[#3e4948] leading-relaxed">
                  Calibrated soundscapes for late-afternoon sundowning agitation (4 PM - 7 PM), featuring Borgeet, Tokari geet, Rabha folk melodies, Shillong acoustic guitar, and Mizo church chorals.
                </p>
              </div>

              <div className="lg:col-span-6 p-6 bg-purple-50 rounded-2xl border border-purple-200 space-y-3">
                <span className="text-xs font-black uppercase text-purple-800">Relaxation Playlist</span>
                <div className="space-y-2 text-xs font-bold text-[#001849]">
                  <div className="p-3 bg-white rounded-xl border border-purple-100 flex items-center justify-between">
                    <span>🎵 Bhupen Hazarika Classics (Assam)</span>
                    <span className="text-purple-600 font-extrabold">Calm 528Hz</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-purple-100 flex items-center justify-between">
                    <span>🎵 Mizo Hills Acoustic Choral</span>
                    <span className="text-purple-600 font-extrabold">Sundown Mode</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. AI PERSONALIZATION */}
      {/* ========================================================================= */}
      <section id="section-ai-personalization" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#003838] to-[#001849] rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-teal-400/20 text-teal-200 text-xs font-black uppercase tracking-wider border border-teal-400/30">
              AI Engine & Adaptive Personalization
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              An AI That Adapts to the Elder, Never Vice-Versa
            </h2>
            <p className="text-base text-teal-100">
              Gentle mathematical modeling that constantly monitors circadian rhythms, response latencies, and emotional states.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white/10 rounded-2xl border border-white/15 space-y-3">
              <div className="text-2xl">🧠</div>
              <h3 className="text-lg font-bold text-white">Dynamic Difficulty Adaptation (DDA)</h3>
              <p className="text-xs text-teal-100 leading-relaxed">
                If the patient hesitates for more than 4 seconds, the game subtly enlarges hints and simplifies options to preserve dignity and prevent frustration.
              </p>
            </div>

            <div className="p-6 bg-white/10 rounded-2xl border border-white/15 space-y-3">
              <div className="text-2xl">🌅</div>
              <h3 className="text-lg font-bold text-white">Circadian Sundowning Anticipation</h3>
              <p className="text-xs text-teal-100 leading-relaxed">
                Detects early signs of evening restlessness between 4:00 PM and 7:00 PM, transitioning the UI into warm amber lighting and soothing familiar acoustic audio.
              </p>
            </div>

            <div className="p-6 bg-white/10 rounded-2xl border border-white/15 space-y-3">
              <div className="text-2xl">📈</div>
              <h3 className="text-lg font-bold text-white">Longitudinal Drift Telemetry</h3>
              <p className="text-xs text-teal-100 leading-relaxed">
                Calculates rolling 30-day memory retention curves, alerting the GMCH physician to subtle cognitive shifts months ahead of routine appointments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. REGIONAL & VOICE SUPPORT */}
      {/* ========================================================================= */}
      <section id="section-regional-voice" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-black uppercase tracking-wider border border-teal-200">
            Dialect-First Voice AI
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#001849] tracking-tight">
            Speaks 7 Native North East Languages
          </h2>
          <p className="text-base text-[#455f88]">
            Click any regional dialect below to hear live voice synthesis in the patient's native tongue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(Object.keys(dialectSamples) as SupportedLanguage[]).map((langKey) => {
            const item = dialectSamples[langKey];
            const isCurrentlyPlaying = playingLang === langKey;

            return (
              <div
                key={langKey}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between gap-4 ${
                  currentLang === langKey
                    ? 'bg-teal-50/70 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                    : 'bg-white border-[#dae1ff] hover:border-teal-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-[#001849]">{item.label}</span>
                    <span className="text-[11px] font-bold text-[#455f88] bg-slate-100 px-2 py-0.5 rounded-full">
                      {item.state}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#006767] italic bg-white p-3 rounded-xl border border-slate-100 leading-relaxed">
                    "{item.text}"
                  </p>
                  <p className="text-[11px] text-[#455f88]">{item.sub}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handlePlayVoiceSample(langKey)}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isCurrentlyPlaying
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-[#006767] text-white hover:bg-[#005252]'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isCurrentlyPlaying ? 'Speaking Now...' : 'Play Native Audio'}</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onLanguageChange(langKey);
                    }}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border cursor-pointer ${
                      currentLang === langKey
                        ? 'bg-teal-800 text-white border-teal-800'
                        : 'bg-white text-[#001849] border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {currentLang === langKey ? '✓ Active' : 'Set App'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. OFFLINE CAPABILITY */}
      {/* ========================================================================= */}
      <section id="section-offline-capability" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#dae1ff] shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase">
              <WifiOff className="w-3.5 h-3.5" /> Zero-Bandwidth Hill Resilience
            </div>

            <h2 className="text-3xl font-black text-[#001849] tracking-tight">
              100% Operational Without Internet Connection
            </h2>

            <p className="text-base text-[#3e4948] leading-relaxed">
              When heavy monsoons cause hill landslides and cellular blackout across Upper Assam or Mizoram, MindCare NER continues functioning without missing a beat. All AI algorithms, memory audio, and alarms execute directly on the local hardware.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-black text-emerald-700 block">Local Edge Storage</span>
                <span className="text-xs text-[#455f88]">All logs cached in indexed on-device SQLite</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-black text-teal-700 block">Conflict-Free Auto Sync</span>
                <span className="text-xs text-[#455f88]">Encrypted delta payloads sync upon 2G/4G reconnect</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-[#001849] p-6 rounded-2xl text-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Live Offline Simulator</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${isOffline ? 'bg-amber-400 text-slate-900' : 'bg-emerald-500 text-white'}`}>
                {isOffline ? 'Offline Mode Active' : 'Online Connected'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Test how the application behaves when disconnected from the cloud.
            </p>

            <button
              onClick={() => {
                sound.playClick();
                onToggleOffline();
              }}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isOffline
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-900'
              }`}
            >
              {isOffline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span>{isOffline ? 'Reconnect Live Network (Sync Now)' : 'Simulate Hill Outage (Go Offline)'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. CAREGIVER DASHBOARD PREVIEW */}
      {/* ========================================================================= */}
      <section id="section-caregiver-preview" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#001849] rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-8 border border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-400/30">
                Caregiver Telemetry
              </span>
              <h2 className="text-3xl font-black mt-2 text-white tracking-tight">
                Peace of Mind for Working Daughters & Sons
              </h2>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onSelectRole('CAREGIVER');
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer w-fit"
            >
              <span>Open Caregiver Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white/10 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs text-slate-400 font-bold uppercase">Medication Adherence</span>
              <p className="text-2xl font-black text-emerald-400">100% Taken</p>
              <span className="text-[11px] text-slate-300">All morning & noon doses verified</span>
            </div>

            <div className="p-5 bg-white/10 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs text-slate-400 font-bold uppercase">Today's Mood Status</span>
              <p className="text-2xl font-black text-amber-300">Calm & Cheerful</p>
              <span className="text-[11px] text-slate-300">Responded to Bihu memories</span>
            </div>

            <div className="p-5 bg-white/10 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs text-slate-400 font-bold uppercase">Sundowning Risk</span>
              <p className="text-2xl font-black text-teal-400">Low (12%)</p>
              <span className="text-[11px] text-slate-300">Acoustic music scheduled for 5:30 PM</span>
            </div>

            <div className="p-5 bg-white/10 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs text-slate-400 font-bold uppercase">Device Battery & Sync</span>
              <p className="text-2xl font-black text-white">82% • Synced</p>
              <span className="text-[11px] text-slate-300">Last heartbeat 4 mins ago</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. CLINICIAN / ANALYTICS */}
      {/* ========================================================================= */}
      <section id="section-clinician-analytics" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#dae1ff] shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase">
              <Stethoscope className="w-3.5 h-3.5" /> GMCH & NEIGRIHMS Clinical Integration
            </div>

            <h2 className="text-3xl font-black text-[#001849] tracking-tight">
              Clinically Grounded MoCA & MMSE Analytics
            </h2>

            <p className="text-base text-[#3e4948] leading-relaxed">
              Neurologists and geriatricians access longitudinal progression reports. Game metrics map directly to five clinical domains: Executive Function, Visual-Spatial Memory, Auditory Recall, Processing Speed, and Language Fluency.
            </p>

            <button
              onClick={() => {
                sound.playClick();
                onSelectRole('HEALTHCARE_WORKER');
              }}
              className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Explore Clinician Doctor Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#001849] uppercase">30-Day Cognitive Stability Curve</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Stable (88/100)</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-bold text-[#455f88]">
                <span>Executive Function (Sorting)</span>
                <span className="text-emerald-600">92%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '92%' }}></div>
              </div>

              <div className="flex justify-between font-bold text-[#455f88] pt-2">
                <span>Visual Memory (Blossoms)</span>
                <span className="text-teal-600">86%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full rounded-full" style={{ width: '86%' }}></div>
              </div>

              <div className="flex justify-between font-bold text-[#455f88] pt-2">
                <span>Auditory Pacing (Voice)</span>
                <span className="text-blue-600">84%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. SECURITY & TRUST */}
      {/* ========================================================================= */}
      <section id="section-security-trust" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#003838] to-[#001849] rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-teal-400/20 text-teal-200 text-xs font-black uppercase tracking-wider border border-teal-400/30">
              Data Sovereignty & Privacy
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              DPDP Act 2023 & ABDM Health Security
            </h2>
            <p className="text-base text-teal-100">
              Elderly health data is sacrosanct. MindCare NER is built with zero monetization, on-device encryption, and full patient consent controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white/10 rounded-2xl border border-white/15 space-y-3">
              <div className="text-2xl">🔒</div>
              <h3 className="text-lg font-bold text-white">India DPDP Act 2023 Compliant</h3>
              <p className="text-xs text-teal-100 leading-relaxed">
                Adheres strictly to the Digital Personal Data Protection Act of India. Explicit caregiver consent is recorded and auditable at any time.
              </p>
            </div>

            <div className="p-6 bg-white/10 rounded-2xl border border-white/15 space-y-3">
              <div className="text-2xl">🏥</div>
              <h3 className="text-lg font-bold text-white">ABDM Health Locker Ready</h3>
              <p className="text-xs text-teal-100 leading-relaxed">
                Compatible with Ayushman Bharat Digital Mission (ABDM) standards for linking EHR records to the patient's ABHA health ID.
              </p>
            </div>

            <div className="p-6 bg-white/10 rounded-2xl border border-white/15 space-y-3">
              <div className="text-2xl">🛡️</div>
              <h3 className="text-lg font-bold text-white">AES-256 On-Device Vault</h3>
              <p className="text-xs text-teal-100 leading-relaxed">
                Health logs and voice recordings are encrypted locally before transmission. No personal identifiable audio is ever stored in plaintext.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. USE CASES & REGIONAL PERSONAS */}
      {/* ========================================================================= */}
      <section id="section-use-cases" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-wider border border-slate-200">
            Real North East Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#001849] tracking-tight">
            Empowering Families Across the 8 States
          </h2>
          <p className="text-base text-[#455f88]">
            See how MindCare NER transforms daily lives in real-world scenarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border-2 border-[#dae1ff] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-black flex items-center justify-center text-sm">
              DB
            </div>
            <h3 className="text-base font-black text-[#001849]">Dhiren Borah (72)</h3>
            <span className="text-[11px] font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded block w-fit">
              Guwahati, Assam • MCI
            </span>
            <p className="text-xs text-[#3e4948] leading-relaxed">
              Retired school principal using the tablet on his morning veranda to review Assamese Bihu photos and keep his medication routine on track.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-[#dae1ff] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-black flex items-center justify-center text-sm">
              LR
            </div>
            <h3 className="text-base font-black text-[#001849]">Lianpuii Ralte (68)</h3>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded block w-fit">
              Champhai, Mizoram • Early Dementia
            </span>
            <p className="text-xs text-[#3e4948] leading-relaxed">
              Lives in rural hill village with intermittent cellular coverage. Operates completely in Mizo ṭawng with offline battery power.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-[#dae1ff] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 font-black flex items-center justify-center text-sm">
              PB
            </div>
            <h3 className="text-base font-black text-[#001849]">Priyanka Borah (38)</h3>
            <span className="text-[11px] font-bold bg-purple-50 text-purple-800 px-2 py-0.5 rounded block w-fit">
              Bengaluru • Remote Caregiver
            </span>
            <p className="text-xs text-[#3e4948] leading-relaxed">
              Working software engineer monitoring her father's daily vitals, mood, and sending warm morning audio notes from 2,500 km away.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-[#dae1ff] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm">
              AS
            </div>
            <h3 className="text-base font-black text-[#001849]">Dr. Ananya Sharma</h3>
            <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded block w-fit">
              Neurologist, GMCH Guwahati
            </span>
            <p className="text-xs text-[#3e4948] leading-relaxed">
              Manages 45+ elderly patients across upper Assam with automated clinical drift reports, optimizing tele-consultation appointments.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================================= */}
      <section id="section-faq" className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-black uppercase tracking-wider border border-teal-200">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#001849] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-[#455f88]">
            Everything you need to know about MindCare NER deployment and care.
          </p>
        </div>

        {/* FAQ Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#455f88] absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search questions (e.g. offline, languages, doctors, privacy)..."
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border-2 border-[#dae1ff] text-sm text-[#001849] focus:outline-none focus:ring-2 focus:ring-[#006767]"
          />
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border-2 border-[#dae1ff] overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => {
                    sound.playClick();
                    setOpenFaqIndex(isOpen ? null : index);
                  }}
                  className="w-full p-5 text-left font-black text-[#001849] flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-teal-700 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-[#3e4948] leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 14. INTERACTIVE DEMO TEST DRIVE */}
      {/* ========================================================================= */}
      <section id="section-demo" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#006767] to-[#001849] rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider border border-white/30">
              Interactive Test Drive
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Experience the Full Ecosystem in Action
            </h2>
            <p className="text-base text-teal-100">
              Switch immediately into any role to test the actual functional workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => {
                sound.playClick();
                onSelectRole('PATIENT');
              }}
              className="p-6 bg-white rounded-2xl text-[#001849] text-left hover:shadow-xl transition-all border-2 border-teal-200 cursor-pointer space-y-2 group"
            >
              <span className="text-2xl block">👴</span>
              <h3 className="font-extrabold text-base text-[#006767] group-hover:underline">
                Patient Mode ➔
              </h3>
              <p className="text-xs text-[#455f88]">
                Large buttons, games, voice assistant & memory garden.
              </p>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onSelectRole('CAREGIVER');
              }}
              className="p-6 bg-white rounded-2xl text-[#001849] text-left hover:shadow-xl transition-all border-2 border-blue-200 cursor-pointer space-y-2 group"
            >
              <span className="text-2xl block">👩</span>
              <h3 className="font-extrabold text-base text-blue-700 group-hover:underline">
                Caregiver Hub ➔
              </h3>
              <p className="text-xs text-[#455f88]">
                Live adherence tracking, mood meter & family voice dispatch.
              </p>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onSelectRole('HEALTHCARE_WORKER');
              }}
              className="p-6 bg-white rounded-2xl text-[#001849] text-left hover:shadow-xl transition-all border-2 border-emerald-200 cursor-pointer space-y-2 group"
            >
              <span className="text-2xl block">🩺</span>
              <h3 className="font-extrabold text-base text-emerald-700 group-hover:underline">
                Clinician EHR ➔
              </h3>
              <p className="text-xs text-[#455f88]">
                MoCA progression charts, cognitive stability curves & reports.
              </p>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onSelectRole('ADMIN');
              }}
              className="p-6 bg-white rounded-2xl text-[#001849] text-left hover:shadow-xl transition-all border-2 border-amber-200 cursor-pointer space-y-2 group"
            >
              <span className="text-2xl block">🛡️</span>
              <h3 className="font-extrabold text-base text-amber-800 group-hover:underline">
                Admin & Architecture ➔
              </h3>
              <p className="text-xs text-[#455f88]">
                Inspect offline DB sync engine, encryption & ABDM logs.
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 15. CONTACT & GET STARTED */}
      {/* ========================================================================= */}
      <section id="section-contact" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#dae1ff] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 space-y-6">
            <span className="px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-black uppercase tracking-wider border border-teal-200">
              Get Started • North East Deployment
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-[#001849] tracking-tight">
              Bring MindCare NER to Your Family or Hospital
            </h2>

            <p className="text-base text-[#3e4948] leading-relaxed">
              We partner with families, geriatric clinics, GMCH, NEIGRIHMS, and district healthcare ASHA workers across all 8 North Eastern states.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
                  📞
                </div>
                <div>
                  <span className="text-xs text-[#455f88] block">24/7 Dementia Support Helpline</span>
                  <span className="text-base font-black text-[#001849]">+91 1800-MIND-NER (Toll Free)</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                  📍
                </div>
                <div>
                  <span className="text-xs text-[#455f88] block">Regional Coordinating Center</span>
                  <span className="text-sm font-black text-[#001849]">Guwahati, Assam • Pan-NER Delivery</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            {contactSubmitted ? (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-2xl font-black">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-emerald-950">Thank You! Inquiry Received</h3>
                <p className="text-sm text-emerald-800 leading-relaxed">
                  Our North East clinical support team will contact you within 24 hours to arrange an onboarding consultation and device demonstration.
                </p>
                <button
                  onClick={() => setContactSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#001849] mb-1">Your Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Priyanka Borah"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#dae1ff] text-sm text-[#001849] focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#001849] mb-1">I am a...</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#dae1ff] text-sm text-[#001849] focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white"
                    >
                      <option value="family">Family Caregiver / Daughter / Son</option>
                      <option value="doctor">Doctor / Neurologist / Clinic</option>
                      <option value="hospital">Hospital Administrator (GMCH/District)</option>
                      <option value="ngo">ASHA / Community Health Worker</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#001849] mb-1">Phone Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 94350 xxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#dae1ff] text-sm text-[#001849] focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#001849] mb-1">State in North East</label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#dae1ff] text-sm text-[#001849] focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white"
                    >
                      <option value="Assam">Assam</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                      <option value="Sikkim">Sikkim</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#001849] mb-1">Notes / Patient Stage</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about the patient's language preferences or clinical stage (MCI, early dementia)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#dae1ff] text-sm text-[#001849] focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#006767] hover:bg-[#005252] text-white font-extrabold text-sm shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Free Onboarding Consultation</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
