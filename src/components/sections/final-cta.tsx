import React from 'react';
import {
  Brain,
  Sparkles,
  HeartHandshake,
  Stethoscope,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { UserRole } from '../../types';

interface FinalCTAProps {
  onSelectRole: (role: UserRole) => void;
  onScrollToTop: () => void;
  onOpenArchitecture: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  onSelectRole,
  onScrollToTop,
  onOpenArchitecture,
}) => {
  return (
    <div
      id="product-story-final-section"
      className="relative min-h-[85vh] flex flex-col justify-center px-4 sm:px-8 py-16 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6 text-left z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f7f7] border border-[#a2e8e8] text-[#006767] text-xs font-black uppercase tracking-wider shadow-xs">
            <Sparkles className="w-4 h-4 text-[#006767]" />
            <span>Ready for Deployment & Clinical Trials</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#001849] tracking-tight leading-tight">
              Remember. Engage. Connect.
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-[#455f88]">
              Empowering elders across North East India with dignity and joy.
            </p>
          </div>

          <p className="text-base text-[#3e4948] leading-relaxed max-w-xl">
            Experience the live interactive software running directly inside your browser. Switch roles
            to explore the patient’s memory games, the caregiver’s reassurance center, or the physician’s
            clinical trend dashboard.
          </p>

          {/* Interactive Role Portals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              id="cta-launch-patient"
              onClick={() => onSelectRole('PATIENT')}
              className="p-4 bg-white hover:bg-[#e6f7f7] border border-[#dae1ff] hover:border-[#006767] rounded-2xl shadow-xs hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#e6f7f7] group-hover:bg-[#006767] text-[#006767] group-hover:text-white flex items-center justify-center transition-colors mb-3">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-[#001849] mb-1 flex items-center justify-between">
                <span>Patient Experience</span>
                <ArrowRight className="w-4 h-4 text-[#006767] opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-xs text-[#455f88]">
                Daily games, voice chimes & family memory albums.
              </p>
            </button>

            <button
              id="cta-launch-caregiver"
              onClick={() => onSelectRole('CAREGIVER')}
              className="p-4 bg-white hover:bg-[#eff6ff] border border-[#dae1ff] hover:border-[#0284c7] rounded-2xl shadow-xs hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#eff6ff] group-hover:bg-[#0284c7] text-[#0284c7] group-hover:text-white flex items-center justify-center transition-colors mb-3">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-[#001849] mb-1 flex items-center justify-between">
                <span>Caregiver Center</span>
                <ArrowRight className="w-4 h-4 text-[#0284c7] opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-xs text-[#455f88]">
                Medication tracking, routine planner & safety logs.
              </p>
            </button>

            <button
              id="cta-launch-clinician"
              onClick={() => onSelectRole('HEALTHCARE_WORKER')}
              className="p-4 bg-white hover:bg-[#f0fdf4] border border-[#dae1ff] hover:border-[#16a34a] rounded-2xl shadow-xs hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] group-hover:bg-[#16a34a] text-[#16a34a] group-hover:text-white flex items-center justify-center transition-colors mb-3">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-[#001849] mb-1 flex items-center justify-between">
                <span>Clinician Portal</span>
                <ArrowRight className="w-4 h-4 text-[#16a34a] opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-xs text-[#455f88]">
                Neurological trends, MCI stage tracking & reports.
              </p>
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              id="cta-replay-story-btn"
              onClick={onScrollToTop}
              className="px-5 py-3 rounded-xl border border-[#dae1ff] bg-white hover:bg-[#eaedff] text-[#001849] font-bold text-xs flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#006767]" />
              <span>Back to Top</span>
            </button>

            <button
              id="cta-open-architecture-btn"
              onClick={onOpenArchitecture}
              className="px-5 py-3 rounded-xl border border-[#dae1ff] bg-white hover:bg-[#eaedff] text-[#001849] font-bold text-xs flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#0284c7]" />
              <span>View System Architecture & Whitepaper</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 hidden lg:block" />
      </div>
    </div>
  );
};
