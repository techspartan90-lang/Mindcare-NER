import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Filter,
  RefreshCw,
  ShieldAlert,
  WifiOff,
  UserX,
  PhoneCall,
  Activity,
  Plus,
  Check,
} from 'lucide-react';
import { AlertItem, AlertCategory, AlertState } from '../../types';
import { sound } from '../../services/sound';
import { CaregiverAlertService } from '../../services/caregiverAlertService';

interface CaregiverAlertCenterProps {
  patientId: string;
  patientName: string;
  onCallPatient?: () => void;
}

export const CaregiverAlertCenter: React.FC<CaregiverAlertCenterProps> = ({
  patientId,
  patientName,
  onCallPatient,
}) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [filterState, setFilterState] = useState<'ALL' | AlertState>('ALL');
  const [filterCategory, setFilterCategory] = useState<'ALL' | AlertCategory>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<AlertCategory>('MISSED_MEDICINE');
  const [newSeverity, setNewSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/caregiver/alerts');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setAlerts(json.data);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // fallback to service
    }
    setAlerts(CaregiverAlertService.getAlerts());
    setIsLoading(false);
  };

  useEffect(() => {
    loadAlerts();
  }, [patientId]);

  const handleAcknowledge = async (id: string) => {
    sound.playClick();
    try {
      await fetch(`/api/caregiver/alerts/${id}/acknowledge`, { method: 'POST' });
    } catch {}
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'ACKNOWLEDGED' as AlertState } : a))
    );
  };

  const handleResolve = async (id: string) => {
    sound.playClick();
    try {
      await fetch(`/api/caregiver/alerts/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolvedBy: 'Caregiver Priyanka' }),
      });
    } catch {}
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'RESOLVED' as AlertState,
              resolvedAt: new Date().toISOString(),
              resolvedBy: 'Caregiver Priyanka',
            }
          : a
      )
    );
    sound.playSuccess();
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    sound.playClick();
    const alert = CaregiverAlertService.createAlert(
      patientId,
      patientName,
      newCategory,
      newTitle,
      newDescription || 'Caregiver initiated alert',
      newSeverity
    );

    try {
      await fetch('/api/caregiver/alerts/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert),
      });
    } catch {}

    setAlerts((prev) => [alert, ...prev]);
    setShowTriggerModal(false);
    setNewTitle('');
    setNewDescription('');
    sound.playSuccess();
  };

  const unreadCount = alerts.filter((a) => a.status === 'UNREAD').length;

  const filteredAlerts = alerts.filter((a) => {
    if (filterState !== 'ALL' && a.status !== filterState) return false;
    if (filterCategory !== 'ALL' && a.type !== filterCategory) return false;
    return true;
  });

  const getCategoryIcon = (category: AlertCategory) => {
    switch (category) {
      case 'MISSED_MEDICINE':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'DEVICE_OFFLINE':
        return <WifiOff className="w-5 h-5 text-purple-600" />;
      case 'PROLONGED_INACTIVITY':
        return <UserX className="w-5 h-5 text-blue-600" />;
      case 'COGNITIVE_DROP':
        return <Activity className="w-5 h-5 text-rose-600" />;
      case 'ASSISTANCE_REQUEST':
        return <ShieldAlert className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-[#006767]" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#dae1ff] shadow-xs space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dae1ff] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-[#001849]">
                Caregiver Safety & Alert Center
              </h3>
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full animate-pulse">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-[#455f88]">
              Automated safety triggers, routine non-adherence alerts, and assistance requests for {patientName}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setShowTriggerModal(true);
            }}
            className="px-3.5 py-2 bg-[#006767] hover:bg-[#004f4f] text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Alert</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              loadAlerts();
            }}
            disabled={isLoading}
            className="p-2 bg-[#f2f4fc] hover:bg-[#eaedff] text-[#001849] rounded-xl border border-[#dae1ff] cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 bg-[#f2f4fc] p-1 rounded-xl border border-[#dae1ff]">
          {(['ALL', 'UNREAD', 'ACKNOWLEDGED', 'RESOLVED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => {
                sound.playClick();
                setFilterState(st);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterState === st
                  ? 'bg-white text-[#001849] shadow-xs'
                  : 'text-[#455f88] hover:text-[#001849]'
              }`}
            >
              {st === 'ALL' ? 'All Alerts' : st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#455f88]" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="bg-white border border-[#dae1ff] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#001849] outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="MISSED_MEDICINE">Missed Medicine</option>
            <option value="DEVICE_OFFLINE">Device Offline</option>
            <option value="PROLONGED_INACTIVITY">Inactivity</option>
            <option value="COGNITIVE_DROP">Cognitive Shift</option>
            <option value="ASSISTANCE_REQUEST">Assistance Call</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-[#f8f9ff] rounded-2xl border border-[#dae1ff] space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-[#001849]">No Active Alerts</h4>
            <p className="text-xs text-[#455f88]">
              All daily routines and patient safety parameters are normal.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isUnread = alert.status === 'UNREAD';
            const isResolved = alert.status === 'RESOLVED';
            const isAcknowledged = alert.status === 'ACKNOWLEDGED';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border-2 transition-all space-y-3 ${
                  isUnread
                    ? 'bg-amber-50/50 border-amber-300 shadow-xs'
                    : isResolved
                    ? 'bg-[#fcfdff] border-[#dae1ff] opacity-80'
                    : 'bg-white border-blue-200'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-white rounded-xl border border-[#dae1ff] shadow-xs shrink-0">
                      {getCategoryIcon(alert.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-[#001849]">{alert.title}</h4>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            alert.severity === 'critical' || alert.severity === 'high'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : alert.severity === 'medium'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            isUnread
                              ? 'bg-amber-500 text-white'
                              : isAcknowledged
                              ? 'bg-blue-500 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {alert.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#455f88] mt-1 leading-relaxed">
                        {alert.description}
                      </p>
                      {alert.actionRequired && (
                        <div className="mt-2 text-xs font-bold text-amber-900 bg-amber-100/70 p-2 rounded-lg inline-block">
                          Recommended Action: {alert.actionRequired}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isUnread && (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="px-3 py-1.5 bg-[#f2f4fc] hover:bg-[#eaedff] text-[#001849] text-xs font-bold rounded-xl border border-[#dae1ff] cursor-pointer"
                      >
                        Acknowledge
                      </button>
                    )}

                    {!isResolved && (
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#869fc4] pt-2 border-t border-[#dae1ff]/50">
                  <span>Triggered: {new Date(alert.createdAt).toLocaleTimeString()}</span>
                  {alert.resolvedAt && (
                    <span className="text-emerald-700 font-semibold">
                      Resolved at {new Date(alert.resolvedAt).toLocaleTimeString()} by {alert.resolvedBy || 'Caregiver'}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Manual Alert Modal */}
      {showTriggerModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-2 border-[#dae1ff] shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#dae1ff] pb-3">
              <h4 className="text-lg font-black text-[#001849]">Create Safety / Caregiver Alert</h4>
              <button
                onClick={() => setShowTriggerModal(false)}
                className="text-[#455f88] hover:text-[#001849] font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#001849]">Alert Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full mt-1 p-2 bg-[#f8f9ff] border border-[#dae1ff] rounded-xl text-xs font-medium"
                >
                  <option value="MISSED_MEDICINE">Missed Medicine / Schedule</option>
                  <option value="PROLONGED_INACTIVITY">Inactivity / Fatigue Check</option>
                  <option value="COGNITIVE_DROP">Cognitive Engagement Anomaly</option>
                  <option value="DEVICE_OFFLINE">Device Offline Status</option>
                  <option value="ASSISTANCE_REQUEST">Caregiver Direct Assistance</option>
                  <option value="DAILY_SUMMARY">Daily Summary Check-in</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#001849]">Severity Level</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as any)}
                  className="w-full mt-1 p-2 bg-[#f8f9ff] border border-[#dae1ff] rounded-xl text-xs font-medium"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical Immediate Action</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#001849]">Alert Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Hydration Missed"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-[#f8f9ff] border border-[#dae1ff] rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#001849]">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Details for caregiver response..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-[#f8f9ff] border border-[#dae1ff] rounded-xl text-xs font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTriggerModal(false)}
                  className="px-4 py-2 bg-[#f2f4fc] text-[#001849] text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#006767] hover:bg-[#004f4f] text-white text-xs font-black rounded-xl shadow-xs cursor-pointer"
                >
                  Publish Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
