import React, { useState } from 'react';
import {
  PhoneCall,
  Mic,
  AlertTriangle,
  Heart,
  CheckCircle,
  X,
  Radio,
  Send,
  ShieldAlert,
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';

interface AssistanceModeModalProps {
  isOpen: boolean;
  currentLang: SupportedLanguage;
  patientName: string;
  caregiverName: string;
  caregiverPhone: string;
  onClose: () => void;
}

export const AssistanceModeModal: React.FC<AssistanceModeModalProps> = ({
  isOpen,
  currentLang,
  patientName,
  caregiverName,
  caregiverPhone,
  onClose,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNoteSent, setVoiceNoteSent] = useState(false);
  const [alertDispatched, setAlertDispatched] = useState(false);

  if (!isOpen) return null;

  const handleCallCaregiver = () => {
    sound.playClick();
    voice.speak(`Connecting phone call to your caregiver ${caregiverName}.`, currentLang);
    window.location.href = `tel:${caregiverPhone}`;
  };

  const handleRecordVoiceNote = () => {
    sound.playClick();
    setIsRecording(true);
    // Simulate 4-second recording
    setTimeout(() => {
      setIsRecording(false);
      setVoiceNoteSent(true);
      sound.playSuccess();
      voice.speak(`Voice message sent to ${caregiverName}. She has been notified.`, currentLang);
    }, 4000);
  };

  const handleEmergencyAlert = () => {
    sound.playAlert();
    setAlertDispatched(true);

    // Save high priority alert to localStorage
    const newAlert = {
      id: `alert_asst_${Date.now()}`,
      patientId: 'p_dhiren_01',
      patientName,
      caregiverId: 'cg_priyanka_01',
      type: 'ASSISTANCE_REQUEST',
      severity: 'high',
      priority: 'HIGH',
      title: `🚨 ${patientName} requested immediate assistance`,
      description: `${patientName} triggered one-tap assistance mode from patient device.`,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('mindcare_alerts') || '[]');
      localStorage.setItem('mindcare_alerts', JSON.stringify([newAlert, ...existing]));
    } catch {
      // ignore
    }

    voice.speak(
      currentLang === 'as'
        ? `আপোনাৰ জৰুৰী বাৰ্তা প্ৰিয়ংকাক জনোৱা হৈছে। তেওঁ সোনকালে আপোনাৰ কাষলৈ আহিব।`
        : `Immediate assistance alert sent to ${caregiverName}. Help is on the way.`,
      currentLang,
    );
  };

  return (
    <div
      id="assistance-mode-modal"
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-md"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border-4 border-rose-500 shadow-2xl space-y-6 text-center">
        {/* Urgent Header */}
        <div className="flex items-center justify-between border-b-2 border-rose-100 pb-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black animate-pulse">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-black text-rose-600 uppercase tracking-widest">
                Assistance & Emergency Mode
              </span>
              <h3 className="text-2xl font-black text-[#001849]">Contact Your Caregiver</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-2xl bg-[#f2f4fc] hover:bg-[#eaedff] flex items-center justify-center text-[#455f88] cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {alertDispatched ? (
          <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-300 space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-xl font-black text-emerald-950">
              High Priority Alert Sent to {caregiverName}!
            </h4>
            <p className="text-xs sm:text-sm font-semibold text-emerald-800">
              Priyanka has received your notification on her Caregiver Dashboard with sound alert.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Giant 1-Tap Emergency Trigger */}
            <button
              id="emergency-dispatch-btn"
              onClick={handleEmergencyAlert}
              className="w-full min-h-[90px] p-5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-xl sm:text-2xl rounded-3xl shadow-lg flex items-center justify-center gap-4 transition-transform active:scale-95 cursor-pointer border-2 border-rose-400"
            >
              <AlertTriangle className="w-9 h-9 animate-bounce" />
              <span>🚨 I NEED ASSISTANCE NOW</span>
            </button>

            {/* Direct Phone Call Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <button
                id="call-caregiver-direct-btn"
                onClick={handleCallCaregiver}
                className="min-h-[72px] p-4 bg-[#006767] hover:bg-[#004d4d] text-white font-extrabold text-base rounded-2xl flex items-center justify-center gap-3 shadow-md active:scale-95 cursor-pointer"
              >
                <PhoneCall className="w-6 h-6" />
                <div className="text-left">
                  <span className="block text-xs opacity-80">Direct Call</span>
                  <span className="block font-black text-sm">{caregiverName} ({caregiverPhone})</span>
                </div>
              </button>

              {/* Quick Voice Note */}
              <button
                id="record-voice-note-btn"
                onClick={handleRecordVoiceNote}
                disabled={isRecording}
                className={`min-h-[72px] p-4 rounded-2xl flex items-center justify-center gap-3 shadow-md transition-all active:scale-95 cursor-pointer font-extrabold text-base ${
                  isRecording
                    ? 'bg-amber-500 text-white animate-pulse'
                    : voiceNoteSent
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#001849] hover:bg-[#002b74] text-white'
                }`}
              >
                <Mic className="w-6 h-6" />
                <div className="text-left">
                  <span className="block text-xs opacity-80">
                    {isRecording ? 'Listening (4s)...' : voiceNoteSent ? 'Sent!' : 'Send Voice Note'}
                  </span>
                  <span className="block font-black text-sm">
                    {isRecording ? 'Recording...' : voiceNoteSent ? 'Delivered to App' : 'Speak Message'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Safety Assurances */}
        <div className="bg-[#fafbff] p-4 rounded-2xl border border-[#dae1ff] text-xs text-[#455f88] font-semibold text-left flex items-center gap-3">
          <Heart className="w-5 h-5 text-rose-500 shrink-0" />
          <span>
            You are always safe and supported. Your daughter Priyanka Borah is listed as primary contact.
          </span>
        </div>
      </div>
    </div>
  );
};
