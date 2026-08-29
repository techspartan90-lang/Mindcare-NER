import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Download,
  Trash2,
  CheckCircle,
  X,
  FileText,
  Key,
  Users,
  Mic,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import { CaregiverPermissions, PrivacyCenterConfig } from '../../types';
import { sound } from '../../services/sound';

interface PrivacyCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_PERMISSIONS: CaregiverPermissions = {
  viewPatientProfile: true,
  viewActivities: true,
  manageReminders: true,
  viewAnalytics: true,
  viewAlerts: true,
  manageMemoryAlbum: true,
  accessLocation: false,
  contactPatient: true,
};

const DEFAULT_CONFIG: PrivacyCenterConfig = {
  patientId: 'p_dhiren_01',
  voiceRecordingEnabled: true,
  storeAudioLocallyOnly: true,
  locationSharingEnabled: false,
  analyticsSharingApproved: true,
  doctorAccessApproved: true,
  dataRetentionDays: 90,
};

export const PrivacyCenterModal: React.FC<PrivacyCenterModalProps> = ({ isOpen, onClose }) => {
  const [permissions, setPermissions] = useState<CaregiverPermissions>(() => {
    try {
      const saved = localStorage.getItem('mindcare_caregiver_permissions');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_PERMISSIONS;
  });

  const [privacyConfig, setPrivacyConfig] = useState<PrivacyCenterConfig>(() => {
    try {
      const saved = localStorage.getItem('mindcare_privacy_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_CONFIG;
  });

  const [activeTab, setActiveTab] = useState<'PERMISSIONS' | 'DATA_CONTROLS' | 'ACCESS_LOGS'>(
    'PERMISSIONS',
  );
  const [exportSuccess, setExportSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleTogglePermission = (key: keyof CaregiverPermissions) => {
    sound.playClick();
    const updated = { ...permissions, [key]: !permissions[key] };
    setPermissions(updated);
    try {
      localStorage.setItem('mindcare_caregiver_permissions', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleToggleConfig = (key: keyof PrivacyCenterConfig) => {
    sound.playClick();
    const updated = { ...privacyConfig, [key]: !privacyConfig[key] };
    setPrivacyConfig(updated);
    try {
      localStorage.setItem('mindcare_privacy_config', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleExportData = () => {
    sound.playClick();
    const exportPayload = {
      patientProfile: {
        id: 'p_dhiren_01',
        name: 'Dhiren Borah',
        age: 72,
        location: 'Guwahati, Assam',
        exportedAt: new Date().toISOString(),
      },
      permissions,
      privacyConfig,
      sessionResults: JSON.parse(localStorage.getItem('mindcare_local_sessions') || '[]'),
      memoryGarden: JSON.parse(localStorage.getItem('mindcare_memory_garden') || '{}'),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mindcare_patient_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportSuccess(true);
    sound.playSuccess();
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleDeleteData = () => {
    sound.playAlert();
    localStorage.removeItem('mindcare_recent_voice_commands');
    localStorage.removeItem('mindcare_local_sessions');
    localStorage.removeItem('mindcare_emotion_logs');
    setDeleteConfirm(false);
    onClose();
  };

  return (
    <div
      id="privacy-center-modal"
      className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-2 border-[#dae1ff] shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dae1ff] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#001849] text-white flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#001849]">Privacy Center & Data Trust</h3>
              <span className="text-xs font-bold text-[#455f88]">
                Role permissions, consent switches, and data ownership
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#f2f4fc] hover:bg-[#eaedff] flex items-center justify-center text-[#455f88] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#dae1ff] pb-3 flex-wrap">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('PERMISSIONS');
            }}
            className={`min-h-[40px] px-4 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'PERMISSIONS'
                ? 'bg-[#006767] text-white shadow-2xs'
                : 'bg-[#f2f4fc] text-[#455f88] hover:bg-[#eaedff]'
            }`}
          >
            👥 Caregiver Permissions
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('DATA_CONTROLS');
            }}
            className={`min-h-[40px] px-4 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'DATA_CONTROLS'
                ? 'bg-[#006767] text-white shadow-2xs'
                : 'bg-[#f2f4fc] text-[#455f88] hover:bg-[#eaedff]'
            }`}
          >
            🔒 Privacy & Storage Controls
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('ACCESS_LOGS');
            }}
            className={`min-h-[40px] px-4 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'ACCESS_LOGS'
                ? 'bg-[#006767] text-white shadow-2xs'
                : 'bg-[#f2f4fc] text-[#455f88] hover:bg-[#eaedff]'
            }`}
          >
            📜 Data Access Audit
          </button>
        </div>

        {/* TAB 1: CAREGIVER PERMISSIONS */}
        {activeTab === 'PERMISSIONS' && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-[#455f88]">
              Configure what data and controls authorized caregiver{' '}
              <span className="font-extrabold text-[#001849]">Priyanka Borah</span> can view or manage:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'viewPatientProfile', label: 'View Profile & Medical Details' },
                { key: 'viewActivities', label: 'View Daily Activity Plans' },
                { key: 'manageReminders', label: 'Create & Edit Medication Reminders' },
                { key: 'viewAnalytics', label: 'View Cognitive Progress Reports' },
                { key: 'viewAlerts', label: 'Receive High Priority Alerts' },
                { key: 'manageMemoryAlbum', label: 'Add Family Photos & Stories' },
                { key: 'accessLocation', label: 'Real-time GPS Location Access' },
                { key: 'contactPatient', label: 'One-Tap Video & Voice Calling' },
              ].map((perm) => {
                const isEnabled = permissions[perm.key as keyof CaregiverPermissions];
                return (
                  <div
                    key={perm.key}
                    className="p-3.5 rounded-2xl border border-[#dae1ff] bg-[#fafbff] flex items-center justify-between gap-2"
                  >
                    <span className="text-xs font-bold text-[#001849]">{perm.label}</span>
                    <button
                      onClick={() => handleTogglePermission(perm.key as keyof CaregiverPermissions)}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        isEnabled ? 'bg-[#006767]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                          isEnabled ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: PRIVACY & STORAGE CONTROLS */}
        {activeTab === 'DATA_CONTROLS' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-[#dae1ff] bg-[#fafbff] flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-black text-[#001849]">Local Audio Processing Only</h4>
                  <p className="text-xs text-[#455f88]">
                    Keep speech recognition and voice commands on device without cloud transmission.
                  </p>
                </div>
                <button
                  onClick={() => handleToggleConfig('storeAudioLocallyOnly')}
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                    privacyConfig.storeAudioLocallyOnly ? 'bg-[#006767]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      privacyConfig.storeAudioLocallyOnly ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-[#dae1ff] bg-[#fafbff] flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-black text-[#001849]">Anonymous Research Telemetry</h4>
                  <p className="text-xs text-[#455f88]">
                    Share anonymized non-diagnostic activity engagement trends to improve regional AI models.
                  </p>
                </div>
                <button
                  onClick={() => handleToggleConfig('analyticsSharingApproved')}
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                    privacyConfig.analyticsSharingApproved ? 'bg-[#006767]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      privacyConfig.analyticsSharingApproved ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Export & Deletion */}
            <div className="pt-3 border-t border-[#dae1ff] flex flex-col sm:flex-row items-center gap-3">
              <button
                id="export-patient-data-btn"
                onClick={handleExportData}
                className="w-full sm:w-auto min-h-[44px] px-5 bg-[#001849] hover:bg-[#002b74] text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export My Complete Data (JSON)</span>
              </button>

              <button
                onClick={() => setDeleteConfirm(true)}
                className="w-full sm:w-auto min-h-[44px] px-4 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Clear Local Device Cache</span>
              </button>
            </div>

            {exportSuccess && (
              <div className="bg-emerald-50 text-emerald-900 p-3 rounded-xl border border-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Data archive successfully downloaded to your device!</span>
              </div>
            )}

            {deleteConfirm && (
              <div className="bg-rose-50 p-4 rounded-2xl border-2 border-rose-300 space-y-3">
                <div className="flex items-center gap-2 text-rose-900 font-black text-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>Are you sure you want to clear local cache?</span>
                </div>
                <p className="text-xs text-rose-800">
                  This will clear local voice history and unsynced game drafts on this device.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDeleteData}
                    className="px-4 py-2 bg-rose-600 text-white font-black text-xs rounded-xl"
                  >
                    Yes, Clear Cache
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="px-4 py-2 bg-white text-[#455f88] font-bold text-xs rounded-xl border"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ACCESS AUDIT LOGS */}
        {activeTab === 'ACCESS_LOGS' && (
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#455f88] flex items-center justify-between">
              <span>Timestamp & Access Action</span>
              <span>Authorized User</span>
            </div>

            <div className="space-y-2">
              {[
                {
                  action: 'Viewed 30-Day Cognitive Trend Report',
                  user: 'Dr. Ananya Sarma (GMCH)',
                  time: 'Today, 10:14 AM',
                  status: 'AUTHORIZED',
                },
                {
                  action: 'Updated Morning Medicine Reminder',
                  user: 'Priyanka Borah (Caregiver)',
                  time: 'Today, 08:30 AM',
                  status: 'AUTHORIZED',
                },
                {
                  action: 'Exported Family Memory Album Quiz',
                  user: 'Dhiren Borah (Patient)',
                  time: 'Yesterday, 04:15 PM',
                  status: 'AUTHORIZED',
                },
              ].map((log, i) => (
                <div
                  key={i}
                  className="p-3 bg-[#fafbff] rounded-xl border border-[#dae1ff] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-black text-[#001849] block">{log.action}</span>
                    <span className="text-[11px] text-[#455f88]">{log.time}</span>
                  </div>
                  <span className="font-bold text-[#006767] bg-[#e6f5f5] px-2.5 py-1 rounded-full text-[10px]">
                    {log.user}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
