import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Plus,
  Pill,
  Droplet,
  Brain,
  Calendar,
  Sparkles,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { ReminderItem, SupportedLanguage } from '../../types';
import { getTranslation } from '../../services/i18n';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';

interface RemindersViewProps {
  currentLang: SupportedLanguage;
}

export const RemindersView: React.FC<RemindersViewProps> = ({ currentLang }) => {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('02:00 PM');
  const [newType, setNewType] = useState<ReminderItem['type']>('MEDICINE');
  const [newDetails, setNewDetails] = useState('');
  const t = getTranslation(currentLang);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await fetch('/api/reminders');
      if (res.ok) {
        const json = await res.json();
        if (json.data) setReminders(json.data);
      }
    } catch {
      // Fallback
    }
  };

  const handleToggleStatus = async (reminder: ReminderItem) => {
    sound.playSuccess();
    const nextStatus = reminder.status === 'COMPLETED' ? 'UPCOMING' : 'COMPLETED';

    // Optimistic UI update
    setReminders((prev) =>
      prev.map((r) =>
        r.id === reminder.id
          ? {
              ...r,
              status: nextStatus,
              completedAt: nextStatus === 'COMPLETED' ? new Date().toISOString() : undefined,
            }
          : r,
      ),
    );

    if (nextStatus === 'COMPLETED') {
      voice.speak(`Marked ${reminder.title} as completed. Good job!`, currentLang);
    }

    try {
      await fetch(`/api/reminders/${reminder.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch {}
  };

  const handleSnooze = async (reminder: ReminderItem) => {
    sound.playReminderBell();
    voice.speak(`Snoozed for 10 minutes. I will remind you again.`, currentLang);

    setReminders((prev) =>
      prev.map((r) => (r.id === reminder.id ? { ...r, status: 'SNOOZED' } : r)),
    );

    try {
      await fetch(`/api/reminders/${reminder.id}/snooze`, {
        method: 'POST',
      });
    } catch {}
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    sound.playClick();

    const payload = {
      title: newTitle,
      scheduledTime: newTime,
      type: newType,
      dosageOrDetails: newDetails,
    };

    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setReminders((prev) => [...prev, json.data]);
        }
      }
    } catch {}

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDetails('');
  };

  const getReminderIcon = (type: ReminderItem['type']) => {
    switch (type) {
      case 'MEDICINE':
        return Pill;
      case 'HYDRATION':
        return Droplet;
      case 'COGNITIVE_GAME':
        return Brain;
      case 'APPOINTMENT':
        return Calendar;
      default:
        return Bell;
    }
  };

  return (
    <div id="reminders-main-view" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#dae1ff] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#006767] text-white flex items-center justify-center shadow-xs">
            <Bell className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[#001849]">
              {t.remindersTitle}
            </h2>
            <p className="text-sm font-semibold text-[#455f88]">
              Never miss your daily medicines, fresh water, or appointments
            </p>
          </div>
        </div>

        <button
          id="add-custom-reminder-btn"
          onClick={() => {
            sound.playClick();
            setIsAddModalOpen(true);
          }}
          className="min-h-[48px] px-5 bg-[#006767] hover:bg-[#208181] text-white text-sm font-bold rounded-2xl flex items-center gap-2 shadow-xs transition-transform active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {reminders.map((reminder) => {
          const IconComponent = getReminderIcon(reminder.type);
          const isDone = reminder.status === 'COMPLETED';
          const isSnoozed = reminder.status === 'SNOOZED';

          return (
            <div
              key={reminder.id}
              id={`reminder-item-${reminder.id}`}
              className={`bg-white rounded-3xl p-5 sm:p-6 border-2 transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isDone
                  ? 'border-emerald-200 bg-[#f8fffe] opacity-80'
                  : isSnoozed
                  ? 'border-amber-300 bg-[#fffbeb]'
                  : 'border-[#dae1ff] hover:border-[#006767]'
              }`}
            >
              {/* Icon & Title */}
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-xs ${
                    isDone
                      ? 'bg-emerald-600'
                      : isSnoozed
                      ? 'bg-amber-500'
                      : 'bg-[#006767]'
                  }`}
                >
                  <IconComponent className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-[#e2e7ff] text-[#002b74] px-2.5 py-0.5 rounded-full text-xs font-black">
                      {reminder.scheduledTime}
                    </span>
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : isSnoozed
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {isDone ? t.completed : isSnoozed ? t.snoozed : t.upcoming}
                    </span>
                  </div>

                  <h3
                    className={`text-xl font-extrabold text-[#001849] ${
                      isDone ? 'line-through text-gray-500' : ''
                    }`}
                  >
                    {reminder.title}
                  </h3>

                  {reminder.dosageOrDetails && (
                    <p className="text-sm font-semibold text-[#455f88]">
                      {reminder.dosageOrDetails}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons: Mark Done & Snooze */}
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                {!isDone && (
                  <button
                    id={`snooze-btn-${reminder.id}`}
                    onClick={() => handleSnooze(reminder)}
                    className="min-h-[52px] px-4 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#8a4c27] text-xs font-extrabold rounded-2xl border border-[#dae1ff] flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-initial"
                  >
                    <Clock className="w-4 h-4" />
                    <span>{t.snooze10m}</span>
                  </button>
                )}

                <button
                  id={`toggle-done-btn-${reminder.id}`}
                  onClick={() => handleToggleStatus(reminder)}
                  className={`min-h-[52px] px-6 text-sm font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 flex-1 sm:flex-initial ${
                    isDone
                      ? 'bg-white hover:bg-gray-100 text-gray-700 border-2 border-gray-300'
                      : 'bg-[#006767] hover:bg-[#208181] text-white'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{isDone ? 'Completed' : t.markDone}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Reminder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-[#006767] space-y-4">
            <h3 className="text-2xl font-extrabold text-[#001849]">
              Add Routine Reminder
            </h3>

            <form onSubmit={handleCreateReminder} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#455f88] block mb-1">
                  Reminder Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evening Multivitamin Capsule"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3.5 bg-[#f2f3ff] border border-[#dae1ff] rounded-xl text-base font-semibold text-[#001849] focus:outline-none focus:ring-2 focus:ring-[#006767]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#455f88] block mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 05:30 PM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-3.5 bg-[#f2f3ff] border border-[#dae1ff] rounded-xl text-base font-semibold text-[#001849] focus:outline-none focus:ring-2 focus:ring-[#006767]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#455f88] block mb-1">
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ReminderItem['type'])}
                    className="w-full p-3.5 bg-[#f2f3ff] border border-[#dae1ff] rounded-xl text-sm font-semibold text-[#001849] focus:outline-none focus:ring-2 focus:ring-[#006767]"
                  >
                    <option value="MEDICINE">Medicine</option>
                    <option value="HYDRATION">Hydration</option>
                    <option value="COGNITIVE_GAME">Brain Game</option>
                    <option value="APPOINTMENT">Appointment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#455f88] block mb-1">
                  Dosage / Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1 Tablet after meal with water"
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  className="w-full p-3.5 bg-[#f2f3ff] border border-[#dae1ff] rounded-xl text-base font-semibold text-[#001849] focus:outline-none focus:ring-2 focus:ring-[#006767]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 min-h-[48px] bg-white border border-[#dae1ff] text-[#455f88] font-bold rounded-xl hover:bg-[#eaedff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[48px] bg-[#006767] hover:bg-[#208181] text-white font-bold rounded-xl shadow-xs"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
