import React, { useState } from 'react';
import {
  Brain,
  Globe,
  Sliders,
  ChevronDown,
  Menu,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { LANGUAGE_METADATA } from '../../services/i18n';
import { sound } from '../../services/sound';

interface PublicMarketingHeaderProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
  onOpenAccessibility: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const PublicMarketingHeader: React.FC<PublicMarketingHeaderProps> = ({
  currentLang,
  onLanguageChange,
  onOpenLogin,
  onOpenSignUp,
  onOpenAccessibility,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const toggleSound = () => {
    const next = !isMuted;
    sound.setMuted(next);
    setIsMuted(next);
    if (!next) sound.playClick();
  };

  const navItems = [
    { label: 'Home', sectionId: 'section-hero' },
    { label: 'How It Works', sectionId: 'section-how-it-works' },
    { label: 'Features', sectionId: 'section-features' },
    { label: 'For Families', sectionId: 'section-caregiver' },
    { label: 'For Clinicians', sectionId: 'section-clinician' },
    { label: 'About', sectionId: 'section-problem' },
    { label: 'FAQ', sectionId: 'section-faq' },
    { label: 'Contact', sectionId: 'section-contact' },
  ];

  const handleNavClick = (sectionId: string) => {
    sound.playClick();
    setMobileMenuOpen(false);
    onNavigateSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#07111F]/90 backdrop-blur-md border-b border-[#243A50]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* LEFT: Brand Logo */}
        <button
          onClick={() => handleNavClick('section-hero')}
          className="flex items-center gap-3 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#19C3B1] rounded-xl p-1"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#14283D] border border-[#19C3B1]/40 flex items-center justify-center text-[#19C3B1] shadow-md shadow-[#19C3B1]/10">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-[#F4F8FC] leading-none">
              MINDCARE <span className="text-[#38D9C5]">NER</span>
            </h1>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#7F91A6] block mt-0.5">
              Cognitive Care Ecosystem
            </span>
          </div>
        </button>

        {/* CENTER: Marketing Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.sectionId)}
              className="px-3 py-2 rounded-xl text-xs font-extrabold text-[#B7C5D6] hover:text-[#F4F8FC] hover:bg-[#14283D] transition-all cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* RIGHT: Actions (Language, Accessibility, Login, Get Started) */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-2 rounded-xl text-[#B7C5D6] hover:text-[#F4F8FC] hover:bg-[#14283D] border border-[#243A50] transition-all cursor-pointer hidden sm:flex"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#38D9C5]" />}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#B7C5D6] bg-[#14283D] border border-[#243A50] hover:text-[#F4F8FC] transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#38D9C5]" />
              <span className="hidden sm:inline">{LANGUAGE_METADATA[currentLang]?.nativeName || 'EN'}</span>
              <ChevronDown className="w-3 h-3 text-[#7F91A6]" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#101F31] border border-[#243A50] rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                {Object.entries(LANGUAGE_METADATA).map(([code, meta]) => (
                  <button
                    key={code}
                    onClick={() => {
                      sound.playClick();
                      onLanguageChange(code as SupportedLanguage);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      currentLang === code
                        ? 'bg-[#19C3B1] text-[#07111F]'
                        : 'text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC]'
                    }`}
                  >
                    <span>{meta.nativeName}</span>
                    <span className="text-[10px] opacity-70">({meta.label})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accessibility Drawer Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAccessibility();
            }}
            aria-label="Open Accessibility Options"
            className="p-2 rounded-xl text-[#B7C5D6] hover:text-[#F4F8FC] hover:bg-[#14283D] border border-[#243A50] transition-all cursor-pointer"
            title="Accessibility Settings"
          >
            <Sliders className="w-4 h-4 text-[#5BA7FF]" />
          </button>

          {/* Login Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenLogin();
            }}
            className="px-4 py-2 rounded-xl text-xs font-black text-[#F4F8FC] hover:text-[#38D9C5] bg-[#14283D] border border-[#243A50] hover:border-[#19C3B1] transition-all cursor-pointer"
          >
            Login
          </button>

          {/* Get Started Primary CTA */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSignUp();
            }}
            className="px-4 py-2 rounded-xl text-xs font-black text-[#07111F] bg-[#19C3B1] hover:bg-[#38D9C5] shadow-md shadow-[#19C3B1]/20 transition-all cursor-pointer active:scale-95"
          >
            Get Started
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#B7C5D6] hover:text-[#F4F8FC] bg-[#14283D] border border-[#243A50] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1726] border-b border-[#243A50] px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.sectionId)}
              className="w-full px-4 py-2.5 rounded-xl text-left text-sm font-bold text-[#B7C5D6] hover:text-[#F4F8FC] hover:bg-[#14283D] transition-all cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
