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
    <div id="reminders-main-view" className="space-y-6 text-[#F4F8FC]">
      {/* Header Banner */}
      <div className="bg-[#101F31] rounded-3xl p-6 border border-[#243A50] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#19C3B1] text-[#07111F] flex items-center justify-center shadow-xs">
            <Bell className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#F4F8FC]">
              {t.remindersTitle}
            </h2>
            <p className="text-sm font-semibold text-[#B7C5D6]">
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
          className="min-h-[48px] px-5 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] text-sm font-black rounded-2xl flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
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
              className={`bg-[#101F31] rounded-3xl p-5 sm:p-6 border transition-all shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isDone
                  ? 'border-emerald-800/60 bg-[#101F31]/80 opacity-80'
                  : isSnoozed
                  ? 'border-amber-800/80 bg-[#14283D]'
                  : 'border-[#243A50] hover:border-[#19C3B1]'
              }`}
            >
              {/* Icon & Title */}
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : isSnoozed
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-[#14283D] text-[#38D9C5] border border-[#243A50]'
                  }`}
                >
                  <IconComponent className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-[#14283D] text-[#F4F8FC] border border-[#243A50] px-2.5 py-0.5 rounded-full text-xs font-black">
                      {reminder.scheduledTime}
                    </span>
                    <span
                      className={`text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                        isDone
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          : isSnoozed
                          ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                          : 'bg-[#14283D] text-[#38D9C5] border-[#243A50]'
                      }`}
                    >
                      {isDone ? t.completed : isSnoozed ? t.snoozed : t.upcoming}
                    </span>
                  </div>

                  <h3
                    className={`text-xl font-black text-[#F4F8FC] ${
                      isDone ? 'line-through text-[#7F91A6]' : ''
                    }`}
                  >
                    {reminder.title}
                  </h3>

                  {reminder.dosageOrDetails && (
                    <p className="text-sm font-semibold text-[#B7C5D6]">
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
                    className="min-h-[52px] px-4 bg-[#14283D] hover:bg-[#162B40] text-[#F4B740] text-xs font-black rounded-2xl border border-[#243A50] flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-initial cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                    <span>{t.snooze10m}</span>
                  </button>
                )}

                <button
                  id={`toggle-done-btn-${reminder.id}`}
                  onClick={() => handleToggleStatus(reminder)}
                  className={`min-h-[52px] px-6 text-sm font-black rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 flex-1 sm:flex-initial cursor-pointer ${
                    isDone
                      ? 'bg-[#14283D] hover:bg-[#162B40] text-[#B7C5D6] border border-[#243A50]'
                      : 'bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F]'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  <span>{isDone ? 'Completed' : t.markDone}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Reminder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#07111F]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101F31] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#243A50] space-y-4 text-[#F4F8FC]">
            <h3 className="text-2xl font-black text-[#F4F8FC]">
              Add Routine Reminder
            </h3>

            <form onSubmit={handleCreateReminder} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#B7C5D6] block mb-1">
                  Reminder Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evening Multivitamin Capsule"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3.5 bg-[#14283D] border border-[#243A50] rounded-xl text-base font-semibold text-[#F4F8FC] placeholder-[#7F91A6] focus:outline-none focus:border-[#19C3B1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#B7C5D6] block mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 05:30 PM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-3.5 bg-[#14283D] border border-[#243A50] rounded-xl text-base font-semibold text-[#F4F8FC] placeholder-[#7F91A6] focus:outline-none focus:border-[#19C3B1]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#B7C5D6] block mb-1">
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ReminderItem['type'])}
                    className="w-full p-3.5 bg-[#14283D] border border-[#243A50] rounded-xl text-sm font-semibold text-[#F4F8FC] focus:outline-none focus:border-[#19C3B1]"
                  >
                    <option value="MEDICINE">Medicine</option>
                    <option value="HYDRATION">Hydration</option>
                    <option value="COGNITIVE_GAME">Brain Game</option>
                    <option value="APPOINTMENT">Appointment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#B7C5D6] block mb-1">
                  Dosage / Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1 Tablet after meal with water"
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  className="w-full p-3.5 bg-[#14283D] border border-[#243A50] rounded-xl text-base font-semibold text-[#F4F8FC] placeholder-[#7F91A6] focus:outline-none focus:border-[#19C3B1]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 min-h-[48px] bg-[#14283D] border border-[#243A50] text-[#B7C5D6] font-black rounded-xl hover:bg-[#162B40] hover:text-[#F4F8FC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[48px] bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] font-black rounded-xl shadow-xs cursor-pointer"
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
