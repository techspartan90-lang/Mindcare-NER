import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Activity,
  BatteryCharging,
  Wifi,
  MapPin,
  Clock,
  Pill,
  Brain,
  AlertTriangle,
  CheckCircle2,
  Plus,
  TrendingUp,
  ShieldCheck,
  Send,
  Phone,
  Sparkles,
  Calendar,
  Layers,
  FileText,
  Image as ImageIcon,
  Shield,
  Download,
} from 'lucide-react';
import {
  PatientProfile,
  SupportedLanguage,
  AlertItem,
  CaregiverNote,
  ReminderItem,
  GameSessionResult,
} from '../../types';
import { getTranslation } from '../../services/i18n';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';
import { HealthcareWorkerReportModal } from './HealthcareWorkerReportModal';
import { FamilyMemoryAlbum } from '../patient/FamilyMemoryAlbum';
import { CaregiverAlertCenter } from './CaregiverAlertCenter';

interface CaregiverDashboardProps {
  patient: PatientProfile;
  currentLang: SupportedLanguage;
  onOpenReminders: () => void;
  onOpenGames: () => void;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({
  patient,
  currentLang,
  onOpenReminders,
  onOpenGames,
}) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [sessions, setSessions] = useState<GameSessionResult[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFamilyAlbumModal, setShowFamilyAlbumModal] = useState(false);
  const [notes, setNotes] = useState<CaregiverNote[]>([
    {
      id: 'note_01',
      patientId: patient.id,
      authorName: 'Priyanka Borah',
      authorRole: 'Daughter',
      date: new Date(Date.now() - 3600000 * 5).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      content:
        'Father was cheerful after morning tea. He recognized all motifs in the Memory Match game without hesitation.',
      category: 'Cognitive',
    },
    {
      id: 'note_02',
      patientId: patient.id,
      authorName: 'Priyanka Borah',
      authorRole: 'Daughter',
      date: 'Yesterday, 8:30 PM',
      content:
        'Slept soundly after 15 minutes of listening to the Cherrapunji Forest Rain soundscape. Evening agitation was noticeably reduced.',
      category: 'Mood',
    },
  ]);

  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<
    'Mood' | 'Physical' | 'Cognitive' | 'Routine'
  >('Cognitive');

  const [safeZoneRadius, setSafeZoneRadius] = useState('500m');
  const [isPromptSent, setIsPromptSent] = useState(false);
  const t = getTranslation(currentLang);

  useEffect(() => {
    // Load reminders
    fetch('/api/reminders')
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setReminders(res.data);
      })
      .catch(() => {});

    // Load alerts
    fetch('/api/alerts')
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setAlerts(res.data);
      })
      .catch(() => {});

    // Load analytics
    fetch(`/api/analytics/${patient.id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setAnalytics(res.data);
      })
      .catch(() => {});

    // Load history
    fetch(`/api/games/history/${patient.id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setSessions(res.data);
      })
      .catch(() => {});
  }, [patient.id]);

  const handleResolveAlert = async (id: string) => {
    sound.playClick();
    try {
      await fetch(`/api/alerts/${id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolvedBy: patient.caregiverName }),
      });
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status: 'RESOLVED', resolvedBy: patient.caregiverName }
            : a,
        ),
      );
      sound.playSuccess();
    } catch {}
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    sound.playSuccess();
    const newNote: CaregiverNote = {
      id: `note_${Date.now()}`,
      patientId: patient.id,
      authorName: patient.caregiverName,
      authorRole: patient.caregiverRelationship,
      date: 'Just now',
      content: newNoteContent.trim(),
      category: newNoteCategory,
    };
    setNotes([newNote, ...notes]);
    setNewNoteContent('');
  };

  const handleSendVoiceNudge = () => {
    sound.playReminderBell();
    setIsPromptSent(true);
    setTimeout(() => setIsPromptSent(false), 3500);
    voice.speak(
      `Priyanka has sent a reminder: Please enjoy a glass of fresh water and rest.`,
      currentLang,
    );
  };

  return (
    <div id="caregiver-dashboard-view" className="space-y-6 pb-12 text-[#F4F8FC]">
      {/* Caregiver Welcome & Real-Time Patient Status */}
      <div className="bg-[#101F31] rounded-3xl p-6 border border-[#243A50] shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#14283D] text-[#38D9C5] border border-[#243A50] px-3 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-[#19C3B1]" />
                Primary Caregiver Portal
              </span>
              <span className="text-xs font-semibold text-[#38D9C5]">
                Logged in as {patient.caregiverName} ({patient.caregiverRelationship})
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#F4F8FC]">
              Monitoring {patient.name} (Age {patient.age})
            </h2>

            <p className="text-xs font-medium text-[#B7C5D6] flex items-center gap-2">
              <span>Stage: {patient.dementiaStage}</span>
              <span>•</span>
              <span>Doctor: {patient.assignedDoctor}</span>
            </p>
          </div>

            {/* Quick Telehealth / Remote Voice Nudge Action */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              id="open-clinical-report-btn"
              onClick={() => {
                sound.playClick();
                setShowReportModal(true);
              }}
              className="min-h-[48px] px-4 bg-[#8B7CFF] hover:bg-[#7b6cee] text-[#07111F] font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>ASHA / Clinical Report</span>
            </button>

            <button
              id="manage-family-album-caregiver-btn"
              onClick={() => {
                sound.playClick();
                setShowFamilyAlbumModal(true);
              }}
              className="min-h-[48px] px-4 bg-pink-600 hover:bg-pink-500 text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Manage Family Album</span>
            </button>

            <button
              id="send-remote-voice-nudge-btn"
              onClick={handleSendVoiceNudge}
              className="flex-1 sm:flex-initial min-h-[48px] px-4 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              {isPromptSent ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Prompt Delivered</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Voice Nudge</span>
                </>
              )}
            </button>

            <a
              href={`tel:${patient.caregiverPhone}`}
              className="min-h-[48px] px-4 bg-[#14283D] hover:bg-[#162B40] text-[#F4F8FC] border border-[#243A50] font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4 text-[#38D9C5]" />
              <span>Speed Call</span>
            </a>
          </div>
        </div>

        {/* 4 Status Tiles: Battery, Online Sync, Safe Zone Location, Today Compliance */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-[#243A50]">
          <div className="bg-[#14283D] p-4 rounded-2xl border border-[#243A50]">
            <span className="text-[11px] font-bold text-[#7F91A6] uppercase block">
              Device Battery
            </span>
            <div className="flex items-center gap-2 mt-1">
              <BatteryCharging className="w-5 h-5 text-emerald-400" />
              <span className="text-xl font-extrabold text-[#F4F8FC]">
                {patient.batteryLevel}% (Healthy)
              </span>
            </div>
          </div>

          <div className="bg-[#14283D] p-4 rounded-2xl border border-[#243A50]">
            <span className="text-[11px] font-bold text-[#7F91A6] uppercase block">
              Sync Connectivity
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Wifi className="w-5 h-5 text-blue-400" />
              <span className="text-xl font-extrabold text-[#F4F8FC]">
                Online • Active
              </span>
            </div>
          </div>

          <div className="bg-[#14283D] p-4 rounded-2xl border border-[#243A50]">
            <span className="text-[11px] font-bold text-[#7F91A6] uppercase block">
              Location / Geo-Fence
            </span>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-5 h-5 text-[#38D9C5]" />
              <span className="text-xl font-extrabold text-[#F4F8FC]">
                Inside Safe Zone
              </span>
            </div>
          </div>

          <div className="bg-[#14283D] p-4 rounded-2xl border border-[#243A50]">
            <span className="text-[11px] font-bold text-[#7F91A6] uppercase block">
              Routine Adherence
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Activity className="w-5 h-5 text-purple-400" />
              <span className="text-xl font-extrabold text-[#F4F8FC]">
                {analytics?.reminderAdherenceRate || 94}% On Time
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Left = Routine & Alerts; Right = Cognitive Analytics & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Routine Schedule & Geo-Fencing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Medication & Routine Schedule */}
          <div className="bg-[#101F31] rounded-3xl p-6 border border-[#243A50] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-[#38D9C5]" />
                <h3 className="text-xl font-black text-[#F4F8FC]">
                  Today's Caregiver Schedule Checklist
                </h3>
              </div>
              <button
                onClick={onOpenReminders}
                className="text-xs font-bold text-[#38D9C5] hover:underline cursor-pointer"
              >
                Manage All
              </button>
            </div>

            <div className="space-y-2">
              {reminders.map((rem) => {
                const isCompleted = rem.status === 'COMPLETED';

                return (
                  <div
                    key={rem.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                      isCompleted
                        ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                        : 'bg-[#14283D] border-[#243A50] text-[#F4F8FC]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#162B40] text-[#38D9C5] border border-[#243A50]'
                        }`}
                      >
                        {isCompleted ? '✓' : '⏰'}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-[#F4F8FC]">
                          {rem.title}
                        </h4>
                        <p className="text-xs text-[#B7C5D6]">
                          {rem.scheduledTime} • {rem.dosageOrDetails}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                        isCompleted
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {rem.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safe Zone Geofencing & Location Assurance */}
          <div className="bg-[#101F31] rounded-3xl p-6 border border-[#243A50] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#38D9C5]" />
                <h3 className="text-xl font-black text-[#F4F8FC]">
                  Smart Safe-Zone Geofence
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#7F91A6]">Radius:</span>
                <select
                  value={safeZoneRadius}
                  onChange={(e) => setSafeZoneRadius(e.target.value)}
                  className="bg-[#14283D] text-xs font-bold text-[#F4F8FC] rounded-lg px-2 py-1 border border-[#243A50]"
                >
                  <option value="300m">300 meters (Home Perimeter)</option>
                  <option value="500m">500 meters (Neighborhood)</option>
                  <option value="1km">1.0 km (Town Vicinity)</option>
                </select>
              </div>
            </div>

            {/* Visual Safe Zone Map Representation */}
            <div className="bg-gradient-to-br from-[#0B1726] to-[#14283D] border border-[#243A50] rounded-2xl p-6 relative overflow-hidden text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#19C3B1] text-[#07111F] flex items-center justify-center mx-auto shadow-md ring-8 ring-teal-500/20 animate-pulse">
                <MapPin className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#F4F8FC]">
                  Patient is Currently Safe at Home Residence
                </h4>
                <p className="text-xs font-medium text-[#38D9C5] mt-0.5">
                  Guwahati Residence (Lat: 26.1445° N, Long: 91.7362° E) • Within {safeZoneRadius}
                </p>
              </div>
              <span className="inline-block bg-[#101F31] border border-[#243A50] text-[#38D9C5] text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                Active GPS & Wi-Fi Geofence Monitoring
              </span>
            </div>
          </div>

          {/* Dedicated Caregiver Alert & Safety Notification Center */}
          <CaregiverAlertCenter
            patientId={patient.id}
            patientName={patient.name}
          />
        </div>

        {/* Right Column (1 Col): Cognitive Performance & Caregiver Notes */}
        <div className="space-y-6">
          {/* Cognitive Stats Card */}
          <div className="bg-[#101F31] rounded-3xl p-6 border border-[#243A50] shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#38D9C5]" />
              <h3 className="text-lg font-black text-[#F4F8FC]">
                Cognitive Performance
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#14283D] p-3.5 rounded-2xl border border-[#243A50]">
                <span className="text-[11px] font-bold text-[#7F91A6] block">
                  Avg Accuracy
                </span>
                <span className="text-2xl font-black text-[#38D9C5]">
                  {analytics?.overallAverageAccuracy || 88}%
                </span>
              </div>

              <div className="bg-[#14283D] p-3.5 rounded-2xl border border-[#243A50]">
                <span className="text-[11px] font-bold text-[#7F91A6] block">
                  Total Sessions
                </span>
                <span className="text-2xl font-black text-[#F4F8FC]">
                  {sessions.length} Completed
                </span>
              </div>
            </div>

            {/* Weekly Completion Bar Chart */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-[#7F91A6] uppercase block">
                7-Day Activity Trend
              </span>
              <div className="flex items-end justify-between gap-1 h-28 bg-[#14283D] p-3 rounded-2xl border border-[#243A50]">
                {analytics?.weeklyTrends?.map((w: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
                  >
                    <div
                      style={{ height: `${w.completionRate}%` }}
                      className="w-full bg-[#19C3B1] rounded-md transition-all hover:bg-[#38D9C5]"
                      title={`${w.day}: ${w.completionRate}% completion`}
                    ></div>
                    <span className="text-[10px] font-bold text-[#7F91A6]">
                      {w.day.substring(0, 3)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Caregiver Daily Observation Notes */}
          <div className="bg-[#101F31] rounded-3xl p-6 border border-[#243A50] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#F4F8FC]">
                Caregiver Journal
              </h3>
              <span className="text-xs text-[#7F91A6]">Shared with Doctor</span>
            </div>

            {/* Add note input */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Write an observation (e.g. mood, appetite, clarity, sleep)..."
                rows={2}
                className="w-full p-3 bg-[#14283D] text-sm text-[#F4F8FC] placeholder-[#7F91A6] rounded-xl border border-[#243A50] focus:outline-none focus:ring-2 focus:ring-[#19C3B1]"
              />

              <div className="flex items-center justify-between gap-2">
                <select
                  value={newNoteCategory}
                  onChange={(e) => setNewNoteCategory(e.target.value as any)}
                  className="bg-[#14283D] text-xs font-bold text-[#F4F8FC] rounded-xl px-2.5 py-1.5 border border-[#243A50]"
                >
                  <option value="Cognitive">Cognitive</option>
                  <option value="Mood">Mood & Sleep</option>
                  <option value="Physical">Physical & Appetite</option>
                  <option value="Routine">Daily Routine</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] text-xs font-black rounded-xl transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Save Note
                </button>
              </div>
            </form>

            {/* Notes timeline */}
            <div className="space-y-3 pt-2 max-h-72 overflow-y-auto">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="p-3.5 rounded-2xl bg-[#14283D] border border-[#243A50] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#38D9C5]">
                      {n.category}
                    </span>
                    <span className="text-[#7F91A6]">{n.date}</span>
                  </div>
                  <p className="text-[#F4F8FC] font-medium">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Healthcare Worker / ASHA Clinical Report Modal */}
      <HealthcareWorkerReportModal
        isOpen={showReportModal}
        patientName={patient.name}
        onClose={() => setShowReportModal(false)}
      />

      {/* Caregiver Family Memory Album Management Modal */}
      {showFamilyAlbumModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-[#101F31] rounded-3xl max-w-4xl w-full p-6 border border-[#243A50] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-left text-[#F4F8FC]">
            <div className="flex items-center justify-between border-b border-[#243A50] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📸</span>
                <h3 className="text-xl font-black text-[#F4F8FC]">
                  Caregiver Family Album Management
                </h3>
              </div>
              <button
                onClick={() => setShowFamilyAlbumModal(false)}
                className="px-4 py-1.5 bg-[#14283D] hover:bg-[#162B40] text-[#F4F8FC] font-bold text-xs rounded-xl border border-[#243A50] cursor-pointer"
              >
                Close Album
              </button>
            </div>

            <FamilyMemoryAlbum
              currentLang={currentLang}
              currentRole="CAREGIVER"
              patientName={patient.name}
            />
          </div>
        </div>
      )}
    </div>
  );
};
