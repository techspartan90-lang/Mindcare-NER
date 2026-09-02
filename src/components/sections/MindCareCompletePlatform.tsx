import React, { useState, useMemo } from 'react';
import {
  Brain,
  Sparkles,
  HeartHandshake,
  Stethoscope,
  Shield,
  Clock,
  Volume2,
  Bell,
  WifiOff,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Flower2,
  Gamepad2,
  ChevronRight,
  ArrowRight,
  Play,
  RotateCcw,
  MapPin,
  Search,
  Send,
  Lock,
  Layers,
  Activity,
  UserCheck,
  Globe,
  Award,
  Zap,
  Info,
  Calendar,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { MindCare3DHub, PavilionZone } from '../canvas/MindCare3DHub';
import { MindCare3DScene } from '../3d/MindCare3DScene';
import { HowMindCareWorks3D } from './HowMindCareWorks3D';
import { ConnectedPlatformArchitecture3D } from './ConnectedPlatformArchitecture3D';
import { PerformanceMode } from '../3d/types';
import { PixelSwap } from '../ui/PixelSwap';
import { SupportedLanguage, UserRole } from '../../types';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface MindCareCompletePlatformProps {
  onSelectRole: (role: UserRole) => void;
  onOpenVoiceAssistant: () => void;
  onOpenArchitecture: () => void;
  onOpenPrivacy: () => void;
  onOpenAccessibility: () => void;
  onOpenDemonstrationMode: () => void;
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  is3DMode: boolean;
  onToggle3DMode: () => void;
}

export const MindCareCompletePlatform: React.FC<MindCareCompletePlatformProps> = ({
  onSelectRole,
  onOpenVoiceAssistant,
  onOpenArchitecture,
  onOpenPrivacy,
  onOpenAccessibility,
  onOpenDemonstrationMode,
  currentLang,
  onLanguageChange,
  isOffline,
  onToggleOffline,
  is3DMode,
  onToggle3DMode,
}) => {
  // Navigation & Interactive States
  const [activeTab, setActiveTab] = useState<string>('home');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [searchFaq, setSearchFaq] = useState('');
  const [faqCategory, setFaqCategory] = useState<string>('all');
  const [selectedVoiceLang, setSelectedVoiceLang] = useState<SupportedLanguage>(currentLang);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeMiniGame, setActiveMiniGame] = useState<string>('tea-sorting');
  const [miniGameScore, setMiniGameScore] = useState<number>(0);
  const [selectedState, setSelectedState] = useState<string>('assam');
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'7d' | '14d' | '30d'>('30d');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Caregiver',
    organization: '',
    state: 'Assam',
    message: '',
  });

  // Smooth scroll to section helper
  const scrollToSection = (sectionId: string) => {
    sound.playClick();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Dialect audio phrases for test player
  const REGIONAL_PHRASES: Record<
    SupportedLanguage,
    { label: string; state: string; sample: string; phonetic: string }
  > = {
    as: {
      label: 'Assamese (অসমীয়া)',
      state: 'Assam',
      sample: 'নমস্কাৰ ধীৰেণ দেউতা, আপোনাৰ পুৱাৰ চাহ আৰু স্মৃতি খেলৰ সময় হ’ল।',
      phonetic: 'Namaskar Dhiren Deuta, apunar puwar sah aru smriti khelot xomoy hol.',
    },
    bn: {
      label: 'Bengali (বাংলা)',
      state: 'Tripura & Barak Valley',
      sample: 'নমস্কার ধীরেনবাবু, আপনার সকালের ওষুধ ও স্মৃতি ব্যায়ামের সময় হয়েছে।',
      phonetic: 'Nomoshkar Dhirenbabu, apnar sokaler oshudh o smriti bayamer shomoy hoyeche.',
    },
    mni: {
      label: 'Meiteilon / Manipuri (ꯃꯩꯇꯩꯂꯣꯟ)',
      state: 'Manipur',
      sample: 'ꯈꯨꯔꯨꯝꯖꯔꯤ ꯙꯤꯔꯦꯟ ꯏꯄꯨꯡꯉꯣ, ꯑꯗꯣꯝꯒꯤ ꯑꯌꯨꯛꯀꯤ ꯍꯤꯗꯥꯛ ꯑꯃꯁꯨꯡ ꯋꯥꯈꯜ ꯃꯄꯥꯡꯒꯜ ꯀꯅꯕꯒꯤ ꯃꯇꯝ ꯑꯣꯏꯔꯦ꯫',
      phonetic: 'Khurumjari Dhiren Ipungngo, adomgi ayukki hidak amasung wakhal mapangal kanbagi matam oire.',
    },
    lus: {
      label: 'Mizo (Mizo ṭawng)',
      state: 'Mizoram',
      sample: 'Chibai Pu Dhiren, i tukṭhuan damdawi leh thluak sawizawina hun a ni e.',
      phonetic: 'Chibai Pu Dhiren, your morning medicine and memory game time has arrived.',
    },
    kha: {
      label: 'Khasi (Ka Ktien Khasi)',
      state: 'Meghalaya',
      sample: 'Khublei Bah Dhiren, ka por ban dih dawai mynstep bad ban lehkai jingkynmaw.',
      phonetic: 'Khublei Bah Dhiren, it is time for morning medication and memory exercise.',
    },
    hi: {
      label: 'Hindi (हिन्दी)',
      state: 'North East Regional',
      sample: 'नमस्ते धीरेन जी, आपकी सुबह की दवा और स्मरण खेल का समय हो गया है।',
      phonetic: 'Namaste Dhiren ji, aapki subah ki dawa aur smaran khel ka samay ho gaya hai.',
    },
    en: {
      label: 'English (Indian Cadence)',
      state: 'Universal',
      sample: 'Good morning, Dhiren. It is time for your warm tea and morning memory blossom.',
      phonetic: 'Good morning, Dhiren. It is time for your warm tea and morning memory blossom.',
    },
  };

  const handlePlayVoiceSample = (lang: SupportedLanguage) => {
    sound.playClick();
    setSelectedVoiceLang(lang);
    setIsPlayingAudio(true);
    const phrase = REGIONAL_PHRASES[lang]?.sample || 'Good morning.';
    voice.speak(phrase, lang, () => {
      setIsPlayingAudio(false);
    });
  };

  // Longitudinal clinical trend mock dataset for Recharts
  const clinicalChartData = useMemo(() => {
    if (analyticsTimeframe === '7d') {
      return [
        { day: 'Mon', memoryScore: 82, attentionSpan: 78, adherence: 100 },
        { day: 'Tue', memoryScore: 84, attentionSpan: 80, adherence: 100 },
        { day: 'Wed', memoryScore: 81, attentionSpan: 76, adherence: 100 },
        { day: 'Thu', memoryScore: 86, attentionSpan: 82, adherence: 100 },
        { day: 'Fri', memoryScore: 88, attentionSpan: 85, adherence: 100 },
        { day: 'Sat', memoryScore: 85, attentionSpan: 83, adherence: 100 },
        { day: 'Sun', memoryScore: 89, attentionSpan: 87, adherence: 100 },
      ];
    } else if (analyticsTimeframe === '14d') {
      return [
        { day: 'Day 1', memoryScore: 78, attentionSpan: 74, adherence: 90 },
        { day: 'Day 3', memoryScore: 80, attentionSpan: 76, adherence: 95 },
        { day: 'Day 5', memoryScore: 82, attentionSpan: 79, adherence: 100 },
        { day: 'Day 7', memoryScore: 85, attentionSpan: 81, adherence: 100 },
        { day: 'Day 9', memoryScore: 83, attentionSpan: 80, adherence: 95 },
        { day: 'Day 11', memoryScore: 87, attentionSpan: 84, adherence: 100 },
        { day: 'Day 14', memoryScore: 89, attentionSpan: 88, adherence: 100 },
      ];
    } else {
      return [
        { day: 'Wk 1', memoryScore: 74, attentionSpan: 70, adherence: 88 },
        { day: 'Wk 2', memoryScore: 79, attentionSpan: 75, adherence: 94 },
        { day: 'Wk 3', memoryScore: 83, attentionSpan: 80, adherence: 98 },
        { day: 'Wk 4', memoryScore: 88, attentionSpan: 86, adherence: 100 },
      ];
    }
  }, [analyticsTimeframe]);

  // North East States Cultural Profiles
  const NE_STATES: Record<
    string,
    {
      name: string;
      capital: string;
      languages: string;
      motif: string;
      soundscape: string;
      culturalFeature: string;
    }
  > = {
    assam: {
      name: 'Assam',
      capital: 'Dispur / Guwahati',
      languages: 'Assamese, Bodo, Bengali',
      motif: 'Muga & Eri Golden Silk, Gamosa, Rhino sanctuary, Majuli masks',
      soundscape: 'Brahmaputra gentle water flow, Bihu Tokari & flute echoes',
      culturalFeature: 'Tea leaf sorting cognitive game & Bihu dhol rhythm recall.',
    },
    meghalaya: {
      name: 'Meghalaya',
      capital: 'Shillong',
      languages: 'Khasi, Garo, Pnar, English',
      motif: 'Living Root Bridges, Pine hills, Bamboo water pipes',
      soundscape: 'Sohra monsoon drizzle, traditional Khasi Duitara strings',
      culturalFeature: 'Sacred grove botanical matching & Shillong choir melodies.',
    },
    manipur: {
      name: 'Manipur',
      capital: 'Imphal',
      languages: 'Meiteilon (Manipuri), Tangkhul',
      motif: 'Loktak floating Phumdis, Kangla Fort, Raas Leela motifs',
      soundscape: 'Pena single-stringed instrument, Keibul Lamjao bird songs',
      culturalFeature: 'Handloom textile symmetry & Manipuri floral recall.',
    },
    mizoram: {
      name: 'Mizoram',
      capital: 'Aizawl',
      languages: 'Mizo (Lushei), English',
      motif: 'Puan woven textiles, Bamboo groves, Blue Mountain hills',
      soundscape: 'Cheraw bamboo dance rhythm, acoustic gospel choral harmonies',
      culturalFeature: 'Cheraw rhythm timing game & hillside landmark recall.',
    },
    nagaland: {
      name: 'Nagaland',
      capital: 'Kohima',
      languages: 'Nagamese, Tenyidie, Ao, Lotha, English',
      motif: 'Hornbill motifs, Tribal woven shawls, Dzukou Valley blooms',
      soundscape: 'Traditional log drum beat, Dzukou stream tranquility',
      culturalFeature: 'Shawl pattern sequencing & Hornbill bird call identification.',
    },
    tripura: {
      name: 'Tripura',
      capital: 'Agartala',
      languages: 'Bengali, Kokborok, English',
      motif: 'Ujjayanta Palace, Cane & Bamboo handicraft, Neermahal waters',
      soundscape: 'Sarinda violin chords, serene lake ripples at Rudrasagar',
      culturalFeature: 'Bamboo craftsmanship step sequencing & royal heritage trivia.',
    },
    arunachal: {
      name: 'Arunachal Pradesh',
      capital: 'Itanagar',
      languages: 'Nyishi, Adi, Monpa, Hindi, English',
      motif: 'Tawang Monastery, Snow peaks, Orchid sanctuaries',
      soundscape: 'Monastery Tibetan horn chant, mountain pine breeze',
      culturalFeature: 'Orchid flower identification & Buddhist prayer wheel recall.',
    },
    sikkim: {
      name: 'Sikkim',
      capital: 'Gangtok',
      languages: 'Nepali, Bhutia, Lepcha, English',
      motif: 'Khangchendzonga panorama, Organic cardamom hills, Tsangu Lake',
      soundscape: 'Gentle prayer flag fluttering, Teesta river serenity',
      culturalFeature: 'Cardamom spice recognition & rhododendron memory matching.',
    },
  };

  // FAQ Knowledge Base
  const FAQ_ITEMS = [
    {
      q: 'What is MindCare NER and how does it support cognitive wellness?',
      a: 'MindCare NER is an AI-enabled personalized cognitive assistance and longitudinal monitoring platform designed specifically for seniors in North East India. It provides engaging cognitive activities, daily routine pacing, family audio check-ins, and longitudinal trends to support independent living and reduce caregiver stress.',
      cat: 'general',
    },
    {
      q: 'Is MindCare NER a medical diagnostic tool or cure for dementia?',
      a: 'No. MindCare NER is explicitly NOT a medical diagnostic tool, nor is it a cure or clinical treatment. It is an assistive engagement and routine-monitoring companion that helps seniors stay cognitively active and allows caregivers and clinicians to observe non-invasive daily trends.',
      cat: 'clinical',
    },
    {
      q: 'How does the platform work in remote hilly areas with zero internet?',
      a: 'MindCare NER incorporates a local-first Edge SQLite engine. All cognitive games, voice alarms, daily reminders, and music operate 100% offline on the tablet. When cellular or Wi-Fi connectivity returns, encrypted logs sync seamlessly in the background.',
      cat: 'technical',
    },
    {
      q: 'Which North East regional languages and dialects are supported?',
      a: 'The platform currently supports 7 regional languages with native acoustic cadence: Assamese (অসমীয়া), Bengali (বাংলা), Meiteilon (Manipuri), Mizo (Mizo ṭawng), Khasi (Ka Ktien Khasi), Hindi, and Indian English.',
      cat: 'languages',
    },
    {
      q: 'How are clinical metrics aligned with MoCA and MMSE standards?',
      a: 'Cognitive exercises are calibrated across six standardized cognitive domains: Short-Term Recall, Visual-Spatial Construction, Executive Functioning, Attention/Vigilance, Language & Sound Association, and Daily Orientation.',
      cat: 'clinical',
    },
    {
      q: 'How is patient health data protected under Indian privacy laws?',
      a: 'MindCare NER complies with the Indian Digital Personal Data Protection (DPDP) Act 2023 and is architected for Ayushman Bharat Digital Mission (ABDM) integration. Health logs are AES-256 encrypted on-device with strict role-based access control.',
      cat: 'security',
    },
    {
      q: 'How can caregivers monitor their parents from outside the region?',
      a: 'Caregivers receive real-time or synced updates via the Caregiver Portal on their mobile or web browser. They can view daily medication adherence, mood check-ins, completed activities, and send one-touch voice notes directly to the senior tablet.',
      cat: 'caregiver',
    },
  ];

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchCat = faqCategory === 'all' || item.cat === faqCategory;
      const matchSearch =
        searchFaq === '' ||
        item.q.toLowerCase().includes(searchFaq.toLowerCase()) ||
        item.a.toLowerCase().includes(searchFaq.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [faqCategory, searchFaq]);

  return (
    <div id="mindcare-complete-platform" className="space-y-12 pb-16">
      {/* Top Banner: 3D/2D Perspective Switcher & Responsive Device Simulator */}
      {/* Quick Access Control Strip */}
      <div className="bg-[#101F31] rounded-2xl border border-[#243A50] p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-[#F4F8FC]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#19C3B1] animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-[#F4F8FC]">
            MindCare NER Platform Ecosystem
          </span>
          <span className="text-xs text-[#7F91A6]">|</span>
          <span className="text-xs font-semibold text-[#38D9C5]">
            {is3DMode ? 'Interactive 3D Central Hub Active' : '2D High-Contrast Mode Active'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 3D vs 2D Mode Switcher */}
          <button
            onClick={() => {
              sound.playClick();
              onToggle3DMode();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              is3DMode
                ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
                : 'bg-[#14283D] text-[#B7C5D6] hover:bg-[#162B40] border border-[#243A50]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{is3DMode ? '3D Ecosystem' : '2D Standard'}</span>
          </button>

          {/* Demonstration Mode Sandbox Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenDemonstrationMode();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-black bg-[#14283D] text-[#F4B740] border border-[#243A50] hover:bg-[#162B40] flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-[#F4B740]" />
            <span>Simulate Profiles</span>
          </button>

          {/* Offline Toggle Simulation */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleOffline();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 cursor-pointer ${
              isOffline
                ? 'bg-red-950/80 text-red-300 border-red-800'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
            }`}
          >
            <WifiOff className="w-3.5 h-3.5" />
            <span>{isOffline ? 'Offline (Simulated)' : 'Online Sync'}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: HERO SECTION WITH CIRCULAR / ARCH-MASKED PHOTOGRAPHY
          ========================================================================= */}
      <section
        id="section-hero"
        className="relative bg-gradient-to-b from-[#101F31] via-[#0B1726] to-[#07111F] rounded-3xl border border-[#243A50] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl scroll-mt-24"
      >
        {/* Calming medical ambient orbs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#19C3B1]/15 blur-3xl animate-drift" />
        <div className="absolute bottom-0 -left-24 w-72 h-72 rounded-full bg-[#5BA7FF]/10 blur-3xl animate-drift" style={{ animationDelay: '-6s' }} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative">
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6 text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#14283D] border border-[#243A50] text-[#38D9C5] text-sm font-black tracking-wide uppercase shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#38D9C5]" />
              <span>AI-Enabled Cognitive Healthcare • North East India</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#F4F8FC] tracking-tight leading-tight">
                Warm, Personalized{' '}
                <span className="text-gradient-calm">Cognitive Care</span>,{' '}
                Designed for North East India.
              </h1>
              <p className="text-lg sm:text-2xl font-bold text-[#5BA7FF] tracking-tight">
                Remember. Engage. Connect. 💙
              </p>
            </div>

            <p className="text-base sm:text-lg text-[#B7C5D6] leading-relaxed max-w-2xl font-normal">
              A reassuring, clinically guided platform that supports memory, daily routines, and
              family connection — built with love and dignity for elderly seniors across Assam,
              Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh, and Sikkim.
            </p>

            {/* Primary Action CTAs — generous touch targets */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => scrollToSection('section-3d-hub')}
                className="btn-senior bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] shadow-lg animate-medical-pulse cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>Explore MindCare 3D</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onSelectRole('PATIENT');
                }}
                className="btn-senior bg-[#14283D] hover:bg-[#162B40] text-[#F4F8FC] border border-[#243A50] shadow-xs cursor-pointer"
              >
                <Brain className="w-5 h-5 text-[#38D9C5]" />
                <span>Launch Senior Tablet Demo</span>
              </button>

              <button
                onClick={() => scrollToSection('section-how-it-works')}
                className="px-4 py-3.5 text-sm sm:text-base font-black text-[#B7C5D6] hover:text-[#F4F8FC] flex items-center gap-1 cursor-pointer"
              >
                <span>How It Works</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 3 Core Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#243A50]">
              <div className="space-y-0.5">
                <span className="text-lg sm:text-2xl font-black text-[#38D9C5]">7 Dialects</span>
                <p className="text-xs text-[#B7C5D6] font-semibold">Native NE Voices</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-lg sm:text-2xl font-black text-[#5BA7FF]">100% Offline</span>
                <p className="text-xs text-[#B7C5D6] font-semibold">Monsoon Resilient</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-lg sm:text-2xl font-black text-[#35D07F]">MoCA Aligned</span>
                <p className="text-xs text-[#B7C5D6] font-semibold">Cognitive Pacing</p>
              </div>
            </div>
          </div>

          {/* Right Visual Column with Circular / Arch Masked Mockup */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Ambient Background Blur Orb */}
            <div className="absolute w-72 h-72 rounded-full bg-[#19C3B1]/20 blur-3xl -z-10 animate-calm-float" />

            {/* Senior Arch Masked Interactive Showcase */}
            <div className="relative w-full max-w-[400px] medical-card p-5 shadow-2xl space-y-4 animate-calm-float" style={{ animationDuration: '9s' }}>
              {/* Top Tablet Camera & Speaker Notch */}
              <div className="flex items-center justify-between pb-2 border-b border-[#243A50]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#19C3B1] animate-pulse" />
                  <span className="text-[11px] font-black uppercase text-[#F4F8FC]">
                    MindCare Senior Tablet
                  </span>
                </div>
                <span className="text-[10px] font-black bg-[#14283D] text-[#35D07F] border border-[#243A50] px-2 py-0.5 rounded-full">
                  10:30 AM • Calm
                </span>
              </div>

              {/* Arch Masked Senior Image Representation */}
              <div className="relative rounded-2xl overflow-hidden bg-[#14283D] border border-[#243A50] p-4 text-center space-y-3">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#19C3B1] text-[#07111F] flex items-center justify-center shadow-lg animate-medical-pulse">
                  <Heart className="w-10 h-10 text-[#07111F] fill-[#07111F]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-black text-[#F4F8FC] text-base">
                    Welcome back, Dhiren 💛
                  </h3>
                  <p className="text-xs text-[#38D9C5] font-bold">
                    "{REGIONAL_PHRASES[currentLang]?.sample || 'Good morning, Dhiren. It is time for your warm tea and morning memory blossom.'}"
                  </p>
                </div>

                {/* Quick Touch Activity */}
                <button
                  onClick={() => {
                    sound.playClick();
                    onSelectRole('PATIENT');
                  }}
                  className="w-full py-3 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] rounded-xl font-black text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-[#07111F]" />
                  <span>Start Morning Memory Bloom</span>
                </button>
              </div>

              {/* Live Caregiver Status Widget */}
              <div className="p-3 bg-[#14283D] rounded-xl border border-[#243A50] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#101F31] text-[#35D07F] border border-[#243A50] flex items-center justify-center font-bold text-xs">
                    PB
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#F4F8FC]">Priyanka (Daughter)</p>
                    <p className="text-[10px] text-[#7F91A6]">Connected from Guwahati</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-[#35D07F] bg-[#101F31] border border-[#243A50] px-2 py-1 rounded">
                  Active Sync
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: PROBLEM STATEMENT (4 CARDS + FLOW)
          ========================================================================= */}
      <section
        id="section-problem"
        className="bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-8 text-[#F4F8FC] scroll-mt-24"
      >
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#F4B740] bg-[#14283D] px-3 py-1 rounded-full border border-[#243A50]">
            Regional Healthcare Reality
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F8FC] tracking-tight">
            Care Shouldn't Depend on Distance.
          </h2>
          <p className="text-sm sm:text-base text-[#B7C5D6]">
            Addressing the unique geographic, cultural, and healthcare challenges faced by seniors
            and caregivers across the North Eastern Region.
          </p>
        </div>

        {/* 4 Problem Dimension Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#14283D] border border-[#243A50] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-red-950/80 text-red-400 border border-red-800 flex items-center justify-center font-black">
              1
            </div>
            <h3 className="font-black text-base text-[#F4F8FC]">Limited Specialist Access</h3>
            <p className="text-xs text-[#B7C5D6] leading-relaxed">
              Neurologists and gerontologists are concentrated in capital hubs like Guwahati or
              Shillong, making frequent clinical travel exhausting for rural elders.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#14283D] border border-[#243A50] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 text-[#F4B740] border border-amber-800 flex items-center justify-center font-black">
              2
            </div>
            <h3 className="font-black text-base text-[#F4F8FC]">Caregiver Distance Anxiety</h3>
            <p className="text-xs text-[#B7C5D6] leading-relaxed">
              Working adult children often migrate to other cities, leaving them worried about daily
              medication, hydration, and emotional isolation back home.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#14283D] border border-[#243A50] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 text-[#5BA7FF] border border-blue-800 flex items-center justify-center font-black">
              3
            </div>
            <h3 className="font-black text-base text-[#F4F8FC]">Language & Literacy Gaps</h3>
            <p className="text-xs text-[#B7C5D6] leading-relaxed">
              Standard healthcare apps only support English or Hindi, creating immense confusion and
              alienation for elders who only speak Assamese, Mizo, or Khasi.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#14283D] border border-[#243A50] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-[#35D07F] border border-emerald-800 flex items-center justify-center font-black">
              4
            </div>
            <h3 className="font-black text-base text-[#F4F8FC]">Monsoonal Disconnections</h3>
            <p className="text-xs text-[#B7C5D6] leading-relaxed">
              Severe monsoon rains, power outages, and unstable hilly cellular networks frequently
              break cloud-only health tracking platforms.
            </p>
          </div>
        </div>

        {/* Visual Transition Flow: PROBLEM -> TECHNOLOGY -> SUPPORT */}
        <div className="p-4 bg-[#14283D] rounded-2xl border border-[#243A50] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-950/80 text-red-400 border border-red-800 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <div>
              <p className="text-xs font-bold text-[#F4F8FC]">Regional Isolation Problem</p>
              <p className="text-[11px] text-[#7F91A6]">Distance & language barriers</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#19C3B1] hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-950/80 text-[#38D9C5] border border-teal-800 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <div>
              <p className="text-xs font-bold text-[#F4F8FC]">MindCare Edge Technology</p>
              <p className="text-[11px] text-[#7F91A6]">7 Native dialects + offline engine</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#19C3B1] hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-950/80 text-[#5BA7FF] border border-blue-800 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <div>
              <p className="text-xs font-bold text-[#F4F8FC]">Continuous Holistic Support</p>
              <p className="text-[11px] text-[#7F91A6]">Dignified living & caregiver calm</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: 3D CENTRAL NEXUS & SPATIAL ECOSYSTEM (OR 2D FALLBACK)
          ========================================================================= */}
      <section id="section-3d-hub" className="scroll-mt-24">
        <MindCare3DHub
          onNavigateSection={scrollToSection}
          onSelectZone={(zone) => {
            scrollToSection(zone.targetSectionId);
          }}
          isInteractive3D={is3DMode}
        />
      </section>

      {/* =========================================================================
          SECTION 4: 3D FIVE-STEP HEALTHCARE ONBOARDING JOURNEY
          ========================================================================= */}
      <HowMindCareWorks3D
        onSelectRole={onSelectRole}
        onOpenVoiceAssistant={onOpenVoiceAssistant}
        currentLang={currentLang}
      />

      {/* =========================================================================
          SECTION 4: CONNECTED PLATFORM ARCHITECTURE (3D SIX PILLARS ECOSYSTEM)
          ========================================================================= */}
      <ConnectedPlatformArchitecture3D
        onSelectRole={onSelectRole}
        onOpenVoiceAssistant={onOpenVoiceAssistant}
        onNavigateSection={scrollToSection}
        currentLang={currentLang}
      />

      {/* =========================================================================
          SECTION 5: COGNITIVE ACTIVITIES & PLAYABLE MINI-DEMO
          ========================================================================= */}
      <section
        id="section-cognitive-activities"
        className="relative bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-8 text-[#F4F8FC] scroll-mt-24"
      >
        <div id="section-patient" className="absolute -top-24 left-0" />
        <div id="section-roles" className="absolute -top-24 left-0" />
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#5BA7FF] bg-[#14283D] px-3 py-1 rounded-full border border-[#243A50]">
            Interactive Activities Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F8FC] tracking-tight">
            Six Culturally Grounded Cognitive Exercises
          </h2>
          <p className="text-sm sm:text-base text-[#B7C5D6]">
            Designed to stimulate neuroplasticity using familiar regional memories, sights, and sounds.
          </p>
        </div>

        {/* Interactive Playable Mini-Demo Preview */}
        <div className="bg-[#14283D] rounded-2xl border border-[#243A50] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#243A50] pb-4">
            <div>
              <h3 className="text-lg font-black text-[#F4F8FC]">
                Try an Interactive Senior Mini-Exercise
              </h3>
              <p className="text-xs text-[#B7C5D6]">
                Experience how tactile buttons and gentle pacing stimulate senior engagement.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#38D9C5] bg-[#101F31] px-3 py-1 rounded-lg border border-[#243A50]">
                Score: {miniGameScore} Points
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  setMiniGameScore(0);
                }}
                className="p-1.5 rounded-lg bg-[#101F31] border border-[#243A50] text-[#B7C5D6] hover:bg-[#162B40] hover:text-[#F4F8FC] cursor-pointer"
                title="Reset Exercise"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mini-Game Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'tea-sorting', label: '🍃 Assam Tea Leaf Sorting (Attention)' },
              { id: 'bihu-sound', label: '🥁 Bihu Dhol Echo (Sound Recall)' },
              { id: 'spice-match', label: '🌶️ Khasi Spice Pairs (Memory)' },
              { id: 'textile-order', label: '🧵 Mizo Puan Sequence (Pattern)' },
            ].map((game) => (
              <button
                key={game.id}
                onClick={() => {
                  sound.playClick();
                  setActiveMiniGame(game.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeMiniGame === game.id
                    ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
                    : 'bg-[#101F31] text-[#B7C5D6] border border-[#243A50] hover:bg-[#162B40] hover:text-[#F4F8FC]'
                }`}
              >
                {game.label}
              </button>
            ))}
          </div>

          {/* Playable Mini Game Area */}
          <div className="p-6 bg-[#101F31] rounded-xl border border-[#243A50] text-center space-y-4">
            {activeMiniGame === 'tea-sorting' && (
              <div className="space-y-4">
                <p className="text-sm font-bold text-[#F4F8FC]">
                  Task: Tap only the tender two-leaves-and-a-bud golden tips for harvest!
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {['🌱 Golden Tip', '🍂 Dry Twig', '🌱 Golden Tip', '🪵 Brown Bark'].map(
                    (item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (item.includes('Golden')) {
                            sound.playSuccess();
                            setMiniGameScore((s) => s + 10);
                          } else {
                            sound.playError();
                          }
                        }}
                        className="p-4 rounded-2xl bg-[#14283D] hover:bg-[#162B40] border border-[#243A50] hover:border-[#19C3B1] text-sm font-black text-[#38D9C5] shadow-xs active:scale-95 transition-transform cursor-pointer"
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {activeMiniGame === 'bihu-sound' && (
              <div className="space-y-4">
                <p className="text-sm font-bold text-[#F4F8FC]">
                  Task: Listen to the spring rhythm cadence and identify the instrument!
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {['🥁 Dhol Beat', '🎺 Pepa Horn', '🪈 Bamboo Flute', '🔔 Taal Cymbal'].map(
                    (inst, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          sound.playSuccess();
                          setMiniGameScore((s) => s + 15);
                        }}
                        className="p-4 rounded-2xl bg-[#14283D] hover:bg-[#162B40] border border-[#243A50] hover:border-[#F4B740] text-sm font-black text-[#F4B740] shadow-xs active:scale-95 transition-transform cursor-pointer"
                      >
                        {inst}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {activeMiniGame === 'spice-match' && (
              <div className="space-y-4">
                <p className="text-sm font-bold text-[#F4F8FC]">
                  Task: Match familiar North Eastern mountain spices!
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {['🌶️ Bhut Jolokia', '🧄 Hill Garlic', '🌿 Bay Leaf', '🌰 Black Cardamom'].map(
                    (spice, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          sound.playSuccess();
                          setMiniGameScore((s) => s + 10);
                        }}
                        className="p-4 rounded-2xl bg-[#14283D] hover:bg-[#162B40] border border-[#243A50] hover:border-[#8B7CFF] text-sm font-black text-[#8B7CFF] shadow-xs active:scale-95 transition-transform cursor-pointer"
                      >
                        {spice}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {activeMiniGame === 'textile-order' && (
              <div className="space-y-4">
                <p className="text-sm font-bold text-[#F4F8FC]">
                  Task: Arrange the traditional weaving colors in sequence!
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {['🟥 Crimson Red', '⬛ Deep Obsidian', '🟨 Golden Silk', '🟩 Bamboo Mint'].map(
                    (color, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          sound.playSuccess();
                          setMiniGameScore((s) => s + 10);
                        }}
                        className="p-4 rounded-2xl bg-[#14283D] hover:bg-[#162B40] border border-[#243A50] hover:border-[#5BA7FF] text-sm font-black text-[#5BA7FF] shadow-xs active:scale-95 transition-transform cursor-pointer"
                      >
                        {color}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            <p className="text-xs text-[#7F91A6] font-medium">
              💡 Full suite includes 24+ clinical cognitive games calibrated across MoCA scoring categories.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: VOICE & MULTILINGUAL SECTION (7 REGIONAL DIALECTS)
          ========================================================================= */}
      <section
        id="section-voice-language"
        className="bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-8 text-[#F4F8FC] scroll-mt-24"
      >
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#38D9C5] bg-[#14283D] px-3 py-1 rounded-full border border-[#243A50]">
            Acoustic Comfort
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F8FC] tracking-tight">
            Technology That Speaks Their Language.
          </h2>
          <p className="text-sm sm:text-base text-[#B7C5D6]">
            Hear how MindCare NER speaks directly to elders in their mother tongue with warm,
            respectful regional cadence.
          </p>
        </div>

        {/* 7 Regional Audio Dialect Players */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(REGIONAL_PHRASES) as SupportedLanguage[]).map((langKey) => {
            const data = REGIONAL_PHRASES[langKey];
            const isSelected = selectedVoiceLang === langKey;

            return (
              <div
                key={langKey}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  isSelected
                    ? 'bg-[#14283D] border-[#19C3B1] shadow-lg'
                    : 'bg-[#14283D] border-[#243A50] hover:border-[#19C3B1]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-sm text-[#F4F8FC]">{data.label}</h3>
                    <span className="text-[11px] font-bold text-[#38D9C5]">{data.state}</span>
                  </div>
                  <button
                    onClick={() => handlePlayVoiceSample(langKey)}
                    className="w-10 h-10 rounded-full bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-transform"
                    title={`Play ${data.label}`}
                  >
                    <Volume2 className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>

                <div className="p-3 bg-[#101F31] rounded-xl border border-[#243A50] space-y-1">
                  <p className="text-xs font-black text-[#F4F8FC]">{data.sample}</p>
                  <p className="text-[10px] text-[#7F91A6] italic">{data.phonetic}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Audio Prompter Trigger */}
        <div className="p-5 bg-[#14283D] rounded-2xl border border-[#243A50] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Volume2 className="w-6 h-6 text-[#38D9C5]" />
            <div>
              <h4 className="font-black text-sm text-[#F4F8FC]">
                Interactive Voice Assistant Modal
              </h4>
              <p className="text-xs text-[#B7C5D6]">
                Test two-way speech recognition and instant calming voice feedback.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onOpenVoiceAssistant();
            }}
            className="px-5 py-2.5 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] font-black text-xs rounded-xl shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            Open Voice Assistant
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: CULTURAL PERSONALIZATION & 8 NORTH EAST STATES MAP
          ========================================================================= */}
      <section
        id="section-cultural-map"
        className="bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-8 text-[#F4F8FC] scroll-mt-24"
      >
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#F4B740] bg-[#14283D] px-3 py-1 rounded-full border border-[#243A50]">
            Regional Heritage Anchors
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F8FC] tracking-tight">
            Rooted in the Eight Sister States.
          </h2>
          <p className="text-sm sm:text-base text-[#B7C5D6]">
            Click each state to explore the local motifs, instruments, and memories embedded in
            MindCare NER.
          </p>
        </div>

        {/* State Selection Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Object.keys(NE_STATES).map((stateKey) => (
            <button
              key={stateKey}
              onClick={() => {
                sound.playClick();
                setSelectedState(stateKey);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedState === stateKey
                  ? 'bg-[#19C3B1] text-[#07111F] shadow-lg scale-105'
                  : 'bg-[#14283D] text-[#B7C5D6] border border-[#243A50] hover:bg-[#162B40] hover:text-[#F4F8FC]'
              }`}
            >
              {NE_STATES[stateKey].name}
            </button>
          ))}
        </div>

        {/* Selected State Profile Card */}
        {NE_STATES[selectedState] && (
          <div className="bg-[#14283D] rounded-2xl border border-[#243A50] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3 text-left">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#38D9C5]" />
                <h3 className="text-2xl font-black text-[#F4F8FC]">
                  {NE_STATES[selectedState].name}
                </h3>
                <span className="text-xs font-bold bg-[#101F31] text-[#38D9C5] px-2.5 py-0.5 rounded-full border border-[#243A50]">
                  Capital: {NE_STATES[selectedState].capital}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-[#B7C5D6]">
                  <strong className="text-[#F4F8FC]">Languages:</strong>{' '}
                  {NE_STATES[selectedState].languages}
                </p>
                <p className="text-[#B7C5D6]">
                  <strong className="text-[#F4F8FC]">Visual Motifs:</strong>{' '}
                  {NE_STATES[selectedState].motif}
                </p>
                <p className="text-[#B7C5D6]">
                  <strong className="text-[#F4F8FC]">Auditory Soundscape:</strong>{' '}
                  {NE_STATES[selectedState].soundscape}
                </p>
              </div>

              <div className="p-3 bg-[#101F31] rounded-xl border border-[#243A50]">
                <span className="text-[11px] font-black uppercase text-[#38D9C5] block">
                  Tailored Cognitive Module:
                </span>
                <p className="text-xs font-bold text-[#F4F8FC] mt-0.5">
                  {NE_STATES[selectedState].culturalFeature}
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 text-center p-6 bg-[#101F31] rounded-2xl border border-[#243A50] shadow-xs space-y-2">
              <span className="text-4xl">🏔️</span>
              <h4 className="font-black text-sm text-[#F4F8FC]">Local Reminiscence Anchor</h4>
              <p className="text-[11px] text-[#7F91A6]">
                Connecting deep childhood memories to daily cognitive exercises.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 9: DAILY ROUTINE & CIRCADIAN TIMELINE
          ========================================================================= */}
      <section
        id="section-daily-routine"
        className="bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-8 text-[#F4F8FC] scroll-mt-24"
      >
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#35D07F] bg-[#14283D] px-3 py-1 rounded-full border border-[#243A50]">
            Predictable Structure
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F8FC] tracking-tight">
            A Calming, Paced Daily Journey.
          </h2>
          <p className="text-sm sm:text-base text-[#B7C5D6]">
            Consistency reduces cognitive load. Here is how MindCare paces an elder's morning,
            afternoon, and evening.
          </p>
        </div>

        {/* Interactive 6-Stage Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              time: '07:30 AM',
              title: 'Morning Awakening',
              tag: 'Hydration & Greetings',
              desc: 'Gentle voice greeting and prompt for morning warm water.',
              status: 'Completed',
              color: 'bg-[#14283D] border-emerald-800 text-emerald-300',
            },
            {
              time: '08:30 AM',
              title: 'Medication Check',
              tag: 'Telmisartan 40mg',
              desc: 'Visual pill photo verification with daughter voice chime.',
              status: 'Completed',
              color: 'bg-[#14283D] border-emerald-800 text-emerald-300',
            },
            {
              time: '10:30 AM',
              title: 'Memory Garden',
              tag: '10 Min Exercise',
              desc: 'Assam tea leaf sorting and family album photo matching.',
              status: 'Active Now',
              color: 'bg-[#14283D] border-[#19C3B1] text-[#38D9C5] ring-2 ring-[#19C3B1]/40',
            },
            {
              time: '01:30 PM',
              title: 'Nutritious Lunch',
              tag: 'Hydration Milestone',
              desc: 'Meal check-in and second hydration reminder (500ml).',
              status: 'Upcoming',
              color: 'bg-[#14283D] border-[#243A50] text-[#B7C5D6]',
            },
            {
              time: '05:00 PM',
              title: 'Peaceful Music',
              tag: 'Sundowning Guard',
              desc: 'Soothing Brahmaputra river flutes & gentle lighting prompt.',
              status: 'Upcoming',
              color: 'bg-[#14283D] border-[#243A50] text-[#B7C5D6]',
            },
            {
              time: '08:30 PM',
              title: 'Night Reflection',
              tag: 'Sleep Hygiene',
              desc: 'Nightly mood check-in and dimming screen for sleep.',
              status: 'Upcoming',
              color: 'bg-[#14283D] border-[#243A50] text-[#B7C5D6]',
            },
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border space-y-2 ${item.color}`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black">{item.time}</span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#101F31] border border-[#243A50]">
                  {item.status}
                </span>
              </div>
              <h4 className="font-black text-sm text-[#F4F8FC]">{item.title}</h4>
              <span className="text-[10px] font-bold opacity-90 block">{item.tag}</span>
              <p className="text-[11px] text-[#B7C5D6] leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: CAREGIVER SECTION & LIVE DASHBOARD OVERVIEW
          ========================================================================= */}
      <section
        id="section-caregiver"
        className="relative bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-8 text-[#F4F8FC] scroll-mt-24"
      >
        <div id="section-family-connect" className="absolute -top-24 left-0" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <span className="text-xs font-black uppercase tracking-wider text-[#35D07F] bg-[#14283D] px-3 py-1 rounded-full border border-[#243A50]">
              Family Peace of Mind
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F4F8FC] tracking-tight">
              Insightful Care, Simplified.
            </h2>
            <p className="text-sm sm:text-base text-[#B7C5D6] leading-relaxed">
              Whether you are working in Guwahati, Bengaluru, or Delhi, stay connected to your
              parent's cognitive wellbeing without feeling intrusive.
            </p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-[#F4F8FC] font-bold">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-time medication confirmation & missed dose alerts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Daily mood & cognitive engagement trajectory curves</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>One-tap family voice note dispatcher directly to senior tablet</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-friction sharing with treating GMCH neurologist</span>
              </li>
            </ul>

            <button
              onClick={() => {
                sound.playClick();
                onSelectRole('CAREGIVER');
              }}
              className="px-6 py-3 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] rounded-2xl font-black text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <HeartHandshake className="w-5 h-5" />
              <span>Launch Caregiver Portal</span>
            </button>
          </div>

          {/* Right Live Overview Card Mockup */}
          <div className="lg:col-span-6 bg-[#14283D] rounded-2xl border border-[#243A50] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#243A50] pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#7F91A6]">
                  Caregiver Overview Live
                </span>
                <h3 className="font-black text-base text-[#F4F8FC]">Dhiren Borah (Father)</h3>
              </div>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Online in Guwahati
              </span>
            </div>

            {/* Live Metrics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#101F31] rounded-xl border border-[#243A50] space-y-0.5">
                <span className="text-[10px] font-bold text-[#7F91A6] block">Today's Tasks</span>
                <p className="text-base font-black text-[#F4F8FC]">6 / 7 Completed</p>
                <span className="text-[10px] text-emerald-400 font-semibold">85% On Schedule</span>
              </div>

              <div className="p-3 bg-[#101F31] rounded-xl border border-[#243A50] space-y-0.5">
                <span className="text-[10px] font-bold text-[#7F91A6] block">Morning BP Med</span>
                <p className="text-base font-black text-emerald-400">Taken (08:32 AM)</p>
                <span className="text-[10px] text-[#7F91A6]">Verified Photo</span>
              </div>

              <div className="p-3 bg-[#101F31] rounded-xl border border-[#243A50] space-y-0.5 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-[#7F91A6] block">Senior Mood</span>
                <p className="text-base font-black text-[#38D9C5]">Calm & Stable</p>
                <span className="text-[10px] text-teal-400">Audio Check-in</span>
              </div>
            </div>

            {/* Quick Alert Banner */}
            <div className="p-3 bg-amber-950/60 rounded-xl border border-amber-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Next Reminder: Afternoon Hydration (01:30 PM)</span>
              </div>
              <span className="text-[10px] text-amber-300 font-black">Scheduled</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: CLINICIAN & ANALYTICS DOME (LONGITUDINAL TELEMETRY)
          ========================================================================= */}
      <section
        id="section-clinician"
        className="relative bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-8 text-[#F4F8FC] scroll-mt-24"
      >
        <div id="section-analytics-dome" className="absolute -top-24 left-0" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#243A50] pb-5">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#8B7CFF] bg-[#14283D] px-3 py-1 rounded-full border border-[#243A50]">
              Clinical Telemetry Dome
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F4F8FC] tracking-tight mt-1">
              Longitudinal Cognitive Trajectory Telemetry
            </h2>
            <p className="text-xs sm:text-sm text-[#B7C5D6]">
              Objective MoCA/MMSE domain tracking for treating neurologists and district health
              officers.
            </p>
          </div>

          {/* Timeframe Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#14283D] p-1 rounded-xl border border-[#243A50]">
            {(['7d', '14d', '30d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  sound.playClick();
                  setAnalyticsTimeframe(tf);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  analyticsTimeframe === tf
                    ? 'bg-[#8B7CFF] text-[#07111F] shadow-xs'
                    : 'text-[#B7C5D6] hover:text-[#F4F8FC]'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Longitudinal Curves */}
        <div className="bg-[#14283D] rounded-2xl border border-[#243A50] p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[#38D9C5]">
                <span className="w-3 h-3 rounded-full bg-[#19C3B1]" />
                Memory Recall (%)
              </span>
              <span className="flex items-center gap-1.5 text-[#5BA7FF]">
                <span className="w-3 h-3 rounded-full bg-[#5BA7FF]" />
                Attention Span (%)
              </span>
            </div>
            <span className="text-[#7F91A6]">Baseline Target: &gt;75%</span>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={clinicalChartData}>
                <defs>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#19C3B1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#19C3B1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorAttention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5BA7FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#5BA7FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#243A50" />
                <XAxis dataKey="day" stroke="#7F91A6" fontSize={11} />
                <YAxis domain={[50, 100]} stroke="#7F91A6" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101F31',
                    borderColor: '#243A50',
                    borderRadius: '0.75rem',
                    color: '#F4F8FC',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="memoryScore"
                  stroke="#19C3B1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorMemory)"
                />
                <Area
                  type="monotone"
                  dataKey="attentionSpan"
                  stroke="#5BA7FF"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorAttention)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Clinical CTAs & ABDM Badge */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#B7C5D6]">
            <Award className="w-4 h-4 text-[#8B7CFF]" />
            <span>Ayushman Bharat Digital Mission (ABDM) Compatible FHIR Standard</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onSelectRole('HEALTHCARE_WORKER');
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#8B7CFF] hover:bg-[#7b6cee] text-[#07111F] font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Enter Clinician Portal</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 12: MEMORY GARDEN & BLOSSOM SANCTUARY
          ========================================================================= */}
      <section
        id="section-memory-garden"
        className="bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-8 text-[#F4F8FC] scroll-mt-24"
      >
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-pink-400 bg-[#14283D] px-3 py-1 rounded-full border border-[#243A50]">
            Reminiscence Sanctuary
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F8FC] tracking-tight">
            A Digital Sanctuary for Your Stories.
          </h2>
          <p className="text-sm sm:text-base text-[#B7C5D6]">
            Cherished family memories bloom as interactive blossoms, stimulating autobiographical
            recall with PixelSwap blossom transitions.
          </p>
        </div>

        {/* PixelSwap Interactive Feature Demo Card */}
        <div className="max-w-2xl mx-auto bg-[#14283D] rounded-2xl border border-[#243A50] p-6 text-center space-y-4">
          <h3 className="font-black text-base text-[#F4F8FC]">
            Interactive Memory Blossom Reveal
          </h3>
          <p className="text-xs text-[#B7C5D6]">
            Click the blossom below to witness how nostalgic photos transition smoothly to stimulate
            elderly reminiscence.
          </p>

          <div className="flex justify-center">
            <PixelSwap
              firstContent={
                <div className="w-72 h-44 bg-[#101F31] rounded-2xl border border-pink-500/50 flex flex-col items-center justify-center p-4 text-center cursor-pointer shadow-sm">
                  <Flower2 className="w-10 h-10 text-pink-400 animate-bounce mb-2" />
                  <span className="text-sm font-black text-pink-300">🌸 1978 Kaziranga Blossom</span>
                  <span className="text-xs text-[#B7C5D6] mt-1">Tap to unfold story memory</span>
                </div>
              }
              secondContent={
                <div className="w-72 h-44 bg-[#101F31] rounded-2xl border border-teal-500/50 flex flex-col items-center justify-center p-4 text-center cursor-pointer shadow-sm">
                  <Heart className="w-10 h-10 text-[#38D9C5] mb-2" />
                  <span className="text-sm font-black text-[#F4F8FC]">
                    "With Dhiren & Bonti in Kaziranga"
                  </span>
                  <span className="text-xs text-[#38D9C5] mt-1">Family audio voice note active</span>
                </div>
              }
              pixelSize={32}
              trigger="click"
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 13: OFFLINE SYNC STATION
          ========================================================================= */}
      <section
        id="section-offline-mode"
        className="bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-6 text-[#F4F8FC] scroll-mt-24"
      >
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#35D07F] bg-[#14283D] px-3 py-1 rounded-full border border-[#243A50]">
            Zero-Bandwidth Resilience
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F8FC] tracking-tight">
            Works Seamlessly Without Internet.
          </h2>
          <p className="text-sm sm:text-base text-[#B7C5D6]">
            Engineered for mountain blackouts and monsoons. All core activities run 100% on the
            tablet's local SQLite vault.
          </p>
        </div>

        {/* 4-Step Offline Data Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#14283D] border border-[#243A50] text-center space-y-1.5">
            <span className="w-8 h-8 rounded-full bg-[#101F31] text-[#38D9C5] border border-[#243A50] inline-flex items-center justify-center font-black text-xs">
              1
            </span>
            <h4 className="font-black text-sm text-[#F4F8FC]">Offline Operation</h4>
            <p className="text-[11px] text-[#B7C5D6]">Elder plays games & logs medication with zero network.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#14283D] border border-[#243A50] text-center space-y-1.5">
            <span className="w-8 h-8 rounded-full bg-[#101F31] text-[#5BA7FF] border border-[#243A50] inline-flex items-center justify-center font-black text-xs">
              2
            </span>
            <h4 className="font-black text-sm text-[#F4F8FC]">Local AES-256 Vault</h4>
            <p className="text-[11px] text-[#B7C5D6]">Encrypted timestamps and scores queued on-device.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#14283D] border border-[#243A50] text-center space-y-1.5">
            <span className="w-8 h-8 rounded-full bg-[#101F31] text-[#8B7CFF] border border-[#243A50] inline-flex items-center justify-center font-black text-xs">
              3
            </span>
            <h4 className="font-black text-sm text-[#F4F8FC]">Signal Reconnection</h4>
            <p className="text-[11px] text-[#B7C5D6]">Device silently detects cellular or Wi-Fi restoration.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#14283D] border border-[#243A50] text-center space-y-1.5">
            <span className="w-8 h-8 rounded-full bg-[#101F31] text-[#35D07F] border border-[#243A50] inline-flex items-center justify-center font-black text-xs">
              4
            </span>
            <h4 className="font-black text-sm text-[#F4F8FC]">Caregiver Sync</h4>
            <p className="text-[11px] text-[#B7C5D6]">Daughter's dashboard receives complete synced log.</p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 14: SECURITY & TRUST (DPDP ACT 2023 & ABDM)
          ========================================================================= */}
      <section
        id="section-security"
        className="bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-6 text-[#F4F8FC] scroll-mt-24"
      >
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#5BA7FF] bg-[#14283D] px-3 py-1 rounded-full border border-[#243A50]">
            Privacy & Trust
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F8FC] tracking-tight">
            Your Health Data Stays Protected.
          </h2>
          <p className="text-sm sm:text-base text-[#B7C5D6]">
            Full compliance with the Indian Digital Personal Data Protection Act 2023.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#14283D] border border-[#243A50] space-y-2">
            <Shield className="w-6 h-6 text-[#38D9C5]" />
            <h3 className="font-black text-sm text-[#F4F8FC]">DPDP Act 2023 Ready</h3>
            <p className="text-xs text-[#B7C5D6] leading-relaxed">
              Explicit consent controls and right-to-forget data governance for every family.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#14283D] border border-[#243A50] space-y-2">
            <Lock className="w-6 h-6 text-[#5BA7FF]" />
            <h3 className="font-black text-sm text-[#F4F8FC]">AES-256 Encryption</h3>
            <p className="text-xs text-[#B7C5D6] leading-relaxed">
              All cognitive logs and voice recordings encrypted at rest and in transit.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#14283D] border border-[#243A50] space-y-2">
            <UserCheck className="w-6 h-6 text-[#35D07F]" />
            <h3 className="font-black text-sm text-[#F4F8FC]">Role-Based Access</h3>
            <p className="text-xs text-[#B7C5D6] leading-relaxed">
              Granular permissions separating patient, caregiver, and doctor access tiers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#14283D] border border-[#243A50] space-y-2">
            <Award className="w-6 h-6 text-[#8B7CFF]" />
            <h3 className="font-black text-sm text-[#F4F8FC]">Zero Ad Monetization</h3>
            <p className="text-xs text-[#B7C5D6] leading-relaxed">
              Health telemetry is never sold, shared with third-party advertisers, or monetized.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 15: ACCESSIBILITY SUITE (WCAG 2.2 AAA)
          ========================================================================= */}
      <section
        id="section-accessibility"
        className="bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-6 text-[#F4F8FC] scroll-mt-24"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#243A50] pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#8B7CFF] bg-[#14283D] px-3 py-1 rounded-full border border-[#243A50]">
              Elderly Inclusivity
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F4F8FC] tracking-tight mt-1">
              Accessibility-First Architecture
            </h2>
            <p className="text-xs sm:text-sm text-[#B7C5D6]">
              Designed from the ground up for aging vision, hearing loss, and hand tremors.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenAccessibility();
            }}
            className="px-4 py-2 bg-[#8B7CFF] hover:bg-[#7b6cee] text-[#07111F] font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <Sliders className="w-4 h-4" />
            <span>Open Accessibility Settings</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-[#14283D] rounded-xl border border-[#243A50] text-center space-y-1">
            <span className="text-xl">🔤</span>
            <h4 className="font-black text-xs text-[#F4F8FC]">Large Typography</h4>
            <p className="text-[10px] text-[#7F91A6]">24px+ baseline text scaling</p>
          </div>

          <div className="p-4 bg-[#14283D] rounded-xl border border-[#243A50] text-center space-y-1">
            <span className="text-xl">🌓</span>
            <h4 className="font-black text-xs text-[#F4F8FC]">High Contrast</h4>
            <p className="text-[10px] text-[#7F91A6]">WCAG AAA yellow/black mode</p>
          </div>

          <div className="p-4 bg-[#14283D] rounded-xl border border-[#243A50] text-center space-y-1">
            <span className="text-xl">🎙️</span>
            <h4 className="font-black text-xs text-[#F4F8FC]">Voice-First Navigation</h4>
            <p className="text-[10px] text-[#7F91A6]">Zero typing needed</p>
          </div>

          <div className="p-4 bg-[#14283D] rounded-xl border border-[#243A50] text-center space-y-1">
            <span className="text-xl">👆</span>
            <h4 className="font-black text-xs text-[#F4F8FC]">Tremor Compensation</h4>
            <p className="text-[10px] text-[#7F91A6]">64px+ oversized touch buttons</p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 16: HOW IT WORKS (5-STEP PROCESS)
          ========================================================================= */}
      <section
        id="section-how-it-works"
        className="bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-8 text-[#F4F8FC] scroll-mt-24"
      >
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#38D9C5] bg-[#14283D] px-3 py-1 rounded-full border border-[#243A50]">
            Seamless Onboarding
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F8FC] tracking-tight">
            How MindCare NER Works in Five Simple Steps
          </h2>
          <p className="text-sm sm:text-base text-[#B7C5D6]">
            From unboxing to daily cognitive engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              num: '1',
              title: 'Family Setup',
              desc: 'Caregiver configures patient profile, language, and medication schedule.',
            },
            {
              num: '2',
              title: 'Senior Tablet Placement',
              desc: 'Tablet sits on magnetic charging dock with high-contrast home display.',
            },
            {
              num: '3',
              title: 'Daily Voice Guidance',
              desc: 'Tablet speaks in Assamese or native dialect reminding elder of tasks.',
            },
            {
              num: '4',
              title: 'Adaptive Play',
              desc: '10-minute daily memory games stimulate neural plasticity.',
            },
            {
              num: '5',
              title: 'Longitudinal Care',
              desc: 'Family and treating doctor receive 30-day stability insights.',
            },
          ].map((st) => (
            <div
              key={st.num}
              className="p-5 rounded-2xl bg-[#14283D] border border-[#243A50] space-y-2 text-center"
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-[#19C3B1] text-[#07111F] flex items-center justify-center font-black text-sm shadow-xs">
                {st.num}
              </div>
              <h4 className="font-black text-sm text-[#F4F8FC]">{st.title}</h4>
              <p className="text-xs text-[#B7C5D6] leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 17: PRICING & ACCESS FRAMEWORK
          ========================================================================= */}
      <section
        id="section-pricing"
        className="bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-8 text-[#F4F8FC] scroll-mt-24"
      >
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#38D9C5] bg-[#14283D] px-3 py-1 rounded-full border border-[#243A50]">
            Access Tiers
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F8FC] tracking-tight">
            Transparent, Community-First Access
          </h2>
          <p className="text-sm sm:text-base text-[#B7C5D6]">
            Pilot access available for families, healthcare workers, and clinical institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-[#14283D] border border-[#243A50] space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#38D9C5]">
              Community / Demo
            </span>
            <h3 className="text-xl font-black text-[#F4F8FC]">[FREE / DEMO]</h3>
            <p className="text-xs text-[#B7C5D6]">
              Interactive browser simulation for families and healthcare advocates.
            </p>
            <button
              onClick={() => {
                sound.playClick();
                onSelectRole('PATIENT');
              }}
              className="w-full py-2 bg-[#101F31] text-[#F4F8FC] border border-[#243A50] rounded-xl font-black text-xs hover:bg-[#162B40] cursor-pointer"
            >
              Try Web Demo
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-[#14283D] border-2 border-[#19C3B1] space-y-3 shadow-lg">
            <span className="text-xs font-black uppercase tracking-wider text-[#38D9C5]">
              Family Senior
            </span>
            <h3 className="text-xl font-black text-[#F4F8FC]">Pilot Access</h3>
            <p className="text-xs text-[#B7C5D6]">
              Senior tablet hardware with 7 dialect voices and full offline mode.
            </p>
            <button
              onClick={() => scrollToSection('section-contact')}
              className="w-full py-2 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] rounded-xl font-black text-xs cursor-pointer active:scale-95 transition-all"
            >
              Request Access
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-[#14283D] border border-[#243A50] space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#35D07F]">
              Caregiver Pro
            </span>
            <h3 className="text-xl font-black text-[#F4F8FC]">Family Connect</h3>
            <p className="text-xs text-[#B7C5D6]">
              Multi-caregiver mobile telemetry and instant voice messaging.
            </p>
            <button
              onClick={() => scrollToSection('section-contact')}
              className="w-full py-2 bg-[#101F31] text-[#F4F8FC] border border-[#243A50] rounded-xl font-black text-xs hover:bg-[#162B40] cursor-pointer"
            >
              Contact Us
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-[#14283D] border border-[#243A50] space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#8B7CFF]">
              Hospital / Clinical
            </span>
            <h3 className="text-xl font-black text-[#F4F8FC]">Institutional</h3>
            <p className="text-xs text-[#B7C5D6]">
              MoCA/MMSE clinical telemetry and ABDM hospital integration.
            </p>
            <button
              onClick={() => scrollToSection('section-contact')}
              className="w-full py-2 bg-[#101F31] text-[#F4F8FC] border border-[#243A50] rounded-xl font-black text-xs hover:bg-[#162B40] cursor-pointer"
            >
              Partner with Us
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 18: FAQ WITH LIVE SEARCH & CATEGORY FILTER
          ========================================================================= */}
      <section
        id="section-faq"
        className="bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-6 text-[#F4F8FC] scroll-mt-24"
      >
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#38D9C5] bg-[#14283D] px-3 py-1 rounded-full border border-[#243A50]">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F8FC] tracking-tight">
            Medically Responsible Q&A
          </h2>
        </div>

        {/* Live Search & Filter */}
        <div className="max-w-xl mx-auto space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 text-[#7F91A6] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchFaq}
              onChange={(e) => setSearchFaq(e.target.value)}
              placeholder="Search questions (e.g. offline, dementia cure, languages)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#243A50] bg-[#14283D] text-[#F4F8FC] placeholder-[#7F91A6] focus:outline-hidden focus:border-[#19C3B1] text-xs sm:text-sm font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'general', label: 'General' },
              { id: 'clinical', label: 'Clinical' },
              { id: 'technical', label: 'Offline / Tech' },
              { id: 'languages', label: 'Languages' },
              { id: 'security', label: 'Security' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  sound.playClick();
                  setFaqCategory(c.id);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-black cursor-pointer transition-all ${
                  faqCategory === c.id
                    ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
                    : 'bg-[#14283D] text-[#B7C5D6] border border-[#243A50] hover:bg-[#162B40] hover:text-[#F4F8FC]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-3 pt-2">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#14283D] border border-[#243A50] space-y-2">
              <h3 className="font-black text-sm text-[#F4F8FC] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#38D9C5] shrink-0" />
                {faq.q}
              </h3>
              <p className="text-xs text-[#B7C5D6] leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 19: CONTACT / PILOT ONBOARDING FORM
          ========================================================================= */}
      <section
        id="section-contact"
        className="bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-6 text-[#F4F8FC] scroll-mt-24"
      >
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#38D9C5] bg-[#14283D] px-3 py-1 rounded-full border border-[#243A50]">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F8FC] tracking-tight">
            Connect with the MindCare NER Team
          </h2>
          <p className="text-sm sm:text-base text-[#B7C5D6]">
            For family pilot inquiries, doctor partnerships, or regional healthcare research.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-[#14283D] rounded-2xl border border-[#243A50] p-6 sm:p-8">
          {contactSubmitted ? (
            <div className="text-center p-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#35D07F] mx-auto" />
              <h3 className="text-xl font-black text-[#F4F8FC]">Thank you for reaching out!</h3>
              <p className="text-xs text-[#B7C5D6]">
                Our Guwahati coordinator will connect with you within 24 hours.
              </p>
              <button
                onClick={() => setContactSubmitted(false)}
                className="px-4 py-2 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] rounded-xl font-black text-xs cursor-pointer"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sound.playSuccess();
                setContactSubmitted(true);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F4F8FC]">Full Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Priyanka Borah"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#243A50] bg-[#101F31] text-[#F4F8FC] placeholder-[#7F91A6] focus:outline-hidden focus:border-[#19C3B1] text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F4F8FC]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="priyanka@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#243A50] bg-[#101F31] text-[#F4F8FC] placeholder-[#7F91A6] focus:outline-hidden focus:border-[#19C3B1] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F4F8FC]">Role</label>
                  <select
                    value={contactForm.role}
                    onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#243A50] bg-[#101F31] text-[#F4F8FC] focus:outline-hidden focus:border-[#19C3B1] text-xs"
                  >
                    <option>Caregiver / Family Member</option>
                    <option>Clinician / Neurologist</option>
                    <option>Healthcare Worker / ASHA</option>
                    <option>Hospital Administrator</option>
                    <option>Researcher / NGO</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F4F8FC]">State in North East</label>
                  <select
                    value={contactForm.state}
                    onChange={(e) => setContactForm({ ...contactForm, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#243A50] bg-[#101F31] text-[#F4F8FC] focus:outline-hidden focus:border-[#19C3B1] text-xs"
                  >
                    <option>Assam</option>
                    <option>Meghalaya</option>
                    <option>Manipur</option>
                    <option>Mizoram</option>
                    <option>Nagaland</option>
                    <option>Tripura</option>
                    <option>Arunachal Pradesh</option>
                    <option>Sikkim</option>
                    <option>Other / Rest of India</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#F4F8FC]">Message</label>
                <textarea
                  rows={3}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="How can MindCare NER support your family or hospital?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#243A50] bg-[#101F31] text-[#F4F8FC] placeholder-[#7F91A6] focus:outline-hidden focus:border-[#19C3B1] text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 20: STATUTORY MEDICAL DISCLAIMER & SEO FOOTER
          ========================================================================= */}
      <footer className="bg-[#0B1726] border border-[#243A50] text-[#B7C5D6] rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#19C3B1]" />
              <h3 className="font-black text-lg text-[#F4F8FC]">MINDCARE NER</h3>
            </div>
            <p className="text-xs text-[#B7C5D6] leading-relaxed max-w-md">
              An AI-enabled personalized cognitive assistance and longitudinal monitoring platform
              designed to support cognitive engagement, daily functioning, and caregiver support
              across the North Eastern Region of India.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-black text-xs text-[#F4F8FC] uppercase tracking-wider">Quick Jump</h4>
            <div className="flex flex-col gap-1.5 text-xs text-[#B7C5D6]">
              <button
                onClick={() => scrollToSection('section-hero')}
                className="text-left hover:text-[#F4F8FC] cursor-pointer"
              >
                Hero & Problem
              </button>
              <button
                onClick={() => scrollToSection('section-3d-hub')}
                className="text-left hover:text-[#F4F8FC] cursor-pointer"
              >
                3D Central Hub
              </button>
              <button
                onClick={() => scrollToSection('section-features')}
                className="text-left hover:text-[#F4F8FC] cursor-pointer"
              >
                6 Connected Pillars
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenArchitecture();
                }}
                className="text-left hover:text-[#F4F8FC] cursor-pointer"
              >
                Inspect Architecture
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-black text-xs text-[#F4F8FC] uppercase tracking-wider">Platform Portals</h4>
            <div className="flex flex-col gap-1.5 text-xs text-[#B7C5D6]">
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectRole('PATIENT');
                }}
                className="text-left hover:text-[#38D9C5] cursor-pointer"
              >
                Senior Tablet View
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectRole('CAREGIVER');
                }}
                className="text-left hover:text-[#38D9C5] cursor-pointer"
              >
                Caregiver Dashboard
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectRole('HEALTHCARE_WORKER');
                }}
                className="text-left hover:text-[#38D9C5] cursor-pointer"
              >
                Clinician Telemetry
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectRole('ADMIN');
                }}
                className="text-left hover:text-[#38D9C5] cursor-pointer"
              >
                Admin Console
              </button>
            </div>
          </div>
        </div>

        {/* Required Medical Positioning Disclaimer */}
        <div className="pt-6 border-t border-[#243A50] text-xs text-[#7F91A6] space-y-2">
          <p className="font-black text-[#F4B740]">
            ⚠️ IMPORTANT MEDICAL & CLINICAL POSITIONING DISCLAIMER:
          </p>
          <p className="text-[11px] leading-relaxed text-[#B7C5D6]">
            MindCare NER is an AI-enabled personalized cognitive assistance and longitudinal
            monitoring platform designed to support cognitive engagement, daily functioning, and
            caregiver support. <strong>It is NOT a medical device</strong> and is not intended to
            diagnose, cure, mitigate, prevent, or treat dementia, Alzheimer's disease, or any
            neurological disorder. All cognitive exercises and routine suggestions are supportive
            lifestyle aids and should not replace professional clinical advice from qualified
            medical practitioners.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 text-[10px] text-[#7F91A6]">
            <span>© 2026 MindCare NER Initiative • North East India Healthcare Technology</span>
            <div className="flex gap-3">
              <button onClick={onOpenPrivacy} className="hover:text-[#F4F8FC] cursor-pointer">
                Privacy Policy (DPDP 2023)
              </button>
              <span>•</span>
              <button onClick={onOpenArchitecture} className="hover:text-[#F4F8FC] cursor-pointer">
                Technical Architecture
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
