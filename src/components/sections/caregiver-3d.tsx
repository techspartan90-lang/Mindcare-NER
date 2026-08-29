import React from 'react';
import { HeartHandshake, Stethoscope, Bell, BarChart3, Users, CheckCircle2 } from 'lucide-react';

export const Caregiver3DSection: React.FC = () => {
  return (
    <div
      id="product-story-caregiver-section"
      className="relative min-h-[80vh] flex flex-col justify-center px-4 sm:px-8 py-12 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-6 text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fce7f3] border border-[#fbcfe8] text-[#db2777] text-xs font-black uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5 text-[#db2777]" />
            <span>360° Care Circle</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001849] tracking-tight">
              Caregiver Ecosystem
            </h2>
            <p className="text-lg sm:text-xl font-bold text-[#006767]">
              Patient • AI Companion • Family Caregiver • Clinician
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#3e4948] leading-relaxed">
            Dementia care is not an isolated journey. MindCare NER acts as a continuous reassurance
            lifeline—connecting the elder at home with their primary caregiver (daughter Priyanka)
            and their attending neurologist (Dr. Ananya at GMCH) through transparent telemetry.
          </p>

          {/* 4 Ecosystem Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 bg-white rounded-2xl border border-[#dae1ff] shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-[#006767]">
                <Bell className="w-4 h-4" />
                <h4 className="font-extrabold text-sm text-[#001849]">Real-Time Safety Alerts</h4>
              </div>
              <p className="text-xs text-[#455f88] leading-relaxed">
                Instant SMS and app notifications if a scheduled medication is unconfirmed or unusual disengagement occurs.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#dae1ff] shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-[#0284c7]">
                <BarChart3 className="w-4 h-4" />
                <h4 className="font-extrabold text-sm text-[#001849]">Doctor Trend Analytics</h4>
              </div>
              <p className="text-xs text-[#455f88] leading-relaxed">
                Comprehensive weekly PDF reports with reaction speed graphs and memory retention scores for clinical reviews.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#dae1ff] shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-[#16a34a]">
                <Users className="w-4 h-4" />
                <h4 className="font-extrabold text-sm text-[#001849]">Remote Memory Upload</h4>
              </div>
              <p className="text-xs text-[#455f88] leading-relaxed">
                Family members in Guwahati, Delhi, or abroad can remotely upload tagged family photos to the patient's album.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#dae1ff] shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-[#7c3aed]">
                <Stethoscope className="w-4 h-4" />
                <h4 className="font-extrabold text-sm text-[#001849]">Clinical Goal Setting</h4>
              </div>
              <p className="text-xs text-[#455f88] leading-relaxed">
                Physicians can prescribe tailored daily exercises (e.g. 15 mins of sound recognition + 10 mins of daily recall).
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 hidden lg:block" />
      </div>
    </div>
  );
};
