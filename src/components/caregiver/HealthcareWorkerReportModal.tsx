import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  CheckCircle,
  TrendingUp,
  X,
  Printer,
  ShieldCheck,
  BarChart2,
  PieChart,
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { sound } from '../../services/sound';

interface HealthcareWorkerReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
}

export const HealthcareWorkerReportModal: React.FC<HealthcareWorkerReportModalProps> = ({
  isOpen,
  onClose,
  patientName,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    sound.playClick();
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Date,TimeSlot,ActivityName,Category,Difficulty,Score,Accuracy,ResponseTimeMs,SyncStatus\n' +
      '2026-08-28,Morning,Familiar Sound Recognition,SOUND_RECOGNITION,Easy,95,95%,1420,SYNCED\n' +
      '2026-08-28,Morning,Morning Hydration Routine,ROUTINE,Easy,100,100%,820,SYNCED\n' +
      '2026-08-27,Afternoon,Cultural Memory Match,MEMORY,Easy,88,88%,1650,SYNCED\n' +
      '2026-08-27,Evening,Family Album Quiz,FAMILY_MEMORY,Easy,100,100%,1100,SYNCED\n' +
      '2026-08-26,Morning,Daily Routine Sequencing,DAILY_RECALL,Medium,82,80%,1900,SYNCED\n' +
      '2026-08-25,Afternoon,Spot the Different Motif,ATTENTION,Easy,90,90%,1350,SYNCED\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MindCare_Engagement_Report_${patientName.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    setDownloadSuccess('CSV Exported Successfully');
    sound.playSuccess();
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handlePrintReport = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div
      id="healthcare-report-modal"
      className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border-2 border-[#dae1ff] shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto print:p-0 print:border-none print:shadow-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dae1ff] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#001849] text-white flex items-center justify-center font-black">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#001849]">
                  Non-Diagnostic Cognitive Engagement Report
                </h3>
                <span className="bg-[#f0fdf4] text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                  ASHA / Clinical Format
                </span>
              </div>
              <span className="text-xs font-semibold text-[#455f88]">
                Patient: <strong className="text-[#001849]">{patientName}</strong> • Age 72 • Guwahati, Assam
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#f2f4fc] hover:bg-[#eaedff] flex items-center justify-center text-[#455f88] cursor-pointer print:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clinical Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-[#fafbff] rounded-2xl border border-[#dae1ff]">
            <span className="text-[10px] font-black text-[#455f88] uppercase">Engagement Rate</span>
            <div className="text-xl font-black text-[#001849] mt-0.5">88.4%</div>
            <span className="text-[10px] font-bold text-emerald-600">Active & Consistent</span>
          </div>

          <div className="p-3.5 bg-[#fafbff] rounded-2xl border border-[#dae1ff]">
            <span className="text-[10px] font-black text-[#455f88] uppercase">Med Adherence</span>
            <div className="text-xl font-black text-[#001849] mt-0.5">94.2%</div>
            <span className="text-[10px] font-bold text-emerald-600">On Time Reminders</span>
          </div>

          <div className="p-3.5 bg-[#fafbff] rounded-2xl border border-[#dae1ff]">
            <span className="text-[10px] font-black text-[#455f88] uppercase">Average Score</span>
            <div className="text-xl font-black text-[#001849] mt-0.5">86 / 100</div>
            <span className="text-[10px] font-bold text-[#006767]">30-Day Rolling Mean</span>
          </div>

          <div className="p-3.5 bg-[#fafbff] rounded-2xl border border-[#dae1ff]">
            <span className="text-[10px] font-black text-[#455f88] uppercase">Active Streak</span>
            <div className="text-xl font-black text-[#001849] mt-0.5">18 Days</div>
            <span className="text-[10px] font-bold text-amber-600">Memory Garden Blooming</span>
          </div>
        </div>

        {/* Detailed Domain Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-black text-[#001849] uppercase tracking-wider">
            Cognitive Domain Activity Breakdown (30 Days)
          </h4>

          <div className="space-y-2">
            {[
              { domain: 'Visual Working Memory (Motif Match & Object Recall)', score: 88, sessions: 28, status: 'Consistent' },
              { domain: 'Auditory Gnosia & Sound Recognition', score: 92, sessions: 18, status: 'High Engagement' },
              { domain: 'Temporal Sequencing & Daily Routine Recall', score: 82, sessions: 22, status: 'Stable' },
              { domain: 'Selective Visual Attention & Focus', score: 84, sessions: 16, status: 'Stable' },
              { domain: 'Episodic Reminiscence & Family Album', score: 96, sessions: 30, status: 'Peak Joy' },
            ].map((d, i) => (
              <div
                key={i}
                className="p-3 bg-[#fafbff] rounded-xl border border-[#dae1ff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-[#001849]">{d.domain}</span>
                  <span className="text-[11px] text-[#455f88] block">
                    {d.sessions} completed sessions • Status: {d.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-24 bg-slate-200 rounded-full h-2">
                    <div className="bg-[#006767] h-2 rounded-full" style={{ width: `${d.score}%` }} />
                  </div>
                  <span className="font-black text-xs text-[#001849] w-12 text-right">{d.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ethical Non-Diagnostic Disclaimer */}
        <div className="bg-[#fafbff] p-4 rounded-2xl border border-[#dae1ff] text-xs text-[#455f88] space-y-1">
          <div className="flex items-center gap-2 font-bold text-[#001849]">
            <ShieldCheck className="w-4 h-4 text-[#006767]" />
            <span>Ethical Terminology & Non-Diagnostic Clinical Notice</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            This report represents behavioral game participation, response pacing, and reminder adherence only. It does NOT constitute a diagnostic medical test, dementia staging, or disease progression forecast. Intended to assist healthcare workers and primary caregivers in tracking daily engagement trends.
          </p>
        </div>

        {/* Actions (Export CSV & Print) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#dae1ff] print:hidden">
          <div className="flex items-center gap-2">
            <button
              id="export-report-csv-btn"
              onClick={handleDownloadCSV}
              className="min-h-[44px] px-5 bg-[#006767] hover:bg-[#004d4d] text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Raw Data (CSV)</span>
            </button>

            <button
              id="print-report-btn"
              onClick={handlePrintReport}
              className="min-h-[44px] px-5 bg-[#001849] hover:bg-[#002b74] text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>

          {downloadSuccess && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> {downloadSuccess}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
