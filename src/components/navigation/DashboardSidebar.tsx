import React from 'react';
import {
  Brain,
  Home,
  Gamepad2,
  Calendar,
  Flower2,
  HeartHandshake,
  MessageSquare,
  Bell,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../../types';
import { sound } from '../../services/sound';

export type DashboardViewId =
  | 'overview'
  | 'activities'
  | 'routine'
  | 'memory'
  | 'family'
  | 'messages'
  | 'notifications'
  | 'analytics'
  | 'settings'
  | 'help';

interface DashboardSidebarProps {
  currentRole: UserRole;
  activeView: DashboardViewId;
  onSelectView: (view: DashboardViewId) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onRoleSwitch?: (role: UserRole) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentRole,
  activeView,
  onSelectView,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  onRoleSwitch,
}) => {
  const navItems = [
    { id: 'overview' as DashboardViewId, label: 'Dashboard', icon: Home },
    { id: 'activities' as DashboardViewId, label: 'Activities', icon: Gamepad2 },
    { id: 'routine' as DashboardViewId, label: 'Routine', icon: Calendar },
    { id: 'memory' as DashboardViewId, label: 'Memory Garden', icon: Flower2 },
    { id: 'family' as DashboardViewId, label: 'Family Connect', icon: HeartHandshake },
    { id: 'messages' as DashboardViewId, label: 'Messages', icon: MessageSquare, badge: '2' },
    { id: 'notifications' as DashboardViewId, label: 'Notifications', icon: Bell },
    { id: 'analytics' as DashboardViewId, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as DashboardViewId, label: 'Settings', icon: Settings },
    { id: 'help' as DashboardViewId, label: 'Help & FAQ', icon: HelpCircle },
  ];

  const roleMeta = {
    PATIENT: { label: 'Patient Workspace', color: '#19C3B1', icon: Brain },
    CAREGIVER: { label: 'Caregiver Portal', color: '#5BA7FF', icon: HeartHandshake },
    HEALTHCARE_WORKER: { label: 'Clinician Telemetry', color: '#8B7CFF', icon: Stethoscope },
    ADMIN: { label: 'System Admin', color: '#F4B740', icon: Shield },
    AWARENESS: { label: 'Community', color: '#38D9C5', icon: Sparkles },
  }[currentRole];

  return (
    <aside
      aria-label="Application Navigation"
      className={`hidden md:flex flex-col justify-between bg-[#0B1726] border-r border-[#243A50] transition-all duration-300 z-30 shrink-0 ${
        isCollapsed ? 'w-20 p-3' : 'w-64 p-5'
      }`}
    >
      {/* Top Brand & Workspace Header */}
      <div className="space-y-6">
        {/* Brand Logo & Collapse Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-[#14283D] border border-[#19C3B1]/40 flex items-center justify-center text-[#19C3B1] shrink-0 shadow-md shadow-[#19C3B1]/10">
              <Brain className="w-6 h-6" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-base font-black tracking-wider text-[#F4F8FC] leading-none">
                  MINDCARE <span className="text-[#38D9C5]">NER</span>
                </h2>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#7F91A6] block mt-0.5">
                  Application Shell
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onToggleCollapse();
            }}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="p-1.5 rounded-xl text-[#7F91A6] hover:text-[#F4F8FC] hover:bg-[#14283D] transition-all cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Current Active Role Badge */}
        {!isCollapsed ? (
          <div className="p-3 bg-[#101F31] rounded-2xl border border-[#243A50] flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${roleMeta.color}20`, color: roleMeta.color }}
            >
              <roleMeta.icon className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-black uppercase text-[#7F91A6] block">
                Active Portal
              </span>
              <p className="text-xs font-black text-[#F4F8FC] truncate">{roleMeta.label}</p>
            </div>
          </div>
        ) : (
          <div
            className="w-10 h-10 mx-auto rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${roleMeta.color}20`, color: roleMeta.color }}
            title={roleMeta.label}
          >
            <roleMeta.icon className="w-5 h-5" />
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onSelectView(item.id);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-[#19C3B1] text-[#07111F] shadow-sm font-black'
                    : 'text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC]'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#07111F]' : 'text-[#7F91A6] group-hover:text-[#38D9C5]'
                  }`}
                />
                {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}
                {!isCollapsed && item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-[#5BA7FF] text-[#07111F]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Switcher & Logout */}
      <div className="pt-4 border-t border-[#243A50] space-y-2">
        {/* Quick Role Switch Dropdown for Pair-Testing */}
        {onRoleSwitch && !isCollapsed && (
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase text-[#7F91A6] block px-1">
              Switch Role View:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onRoleSwitch('PATIENT')}
                className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer truncate ${
                  currentRole === 'PATIENT'
                    ? 'bg-[#19C3B1] text-[#07111F]'
                    : 'bg-[#14283D] text-[#B7C5D6] hover:text-[#F4F8FC]'
                }`}
              >
                👴 Patient
              </button>
              <button
                onClick={() => onRoleSwitch('CAREGIVER')}
                className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer truncate ${
                  currentRole === 'CAREGIVER'
                    ? 'bg-[#5BA7FF] text-[#07111F]'
                    : 'bg-[#14283D] text-[#B7C5D6] hover:text-[#F4F8FC]'
                }`}
              >
                👩‍⚕️ Caregiver
              </button>
              <button
                onClick={() => onRoleSwitch('HEALTHCARE_WORKER')}
                className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer truncate ${
                  currentRole === 'HEALTHCARE_WORKER'
                    ? 'bg-[#8B7CFF] text-[#07111F]'
                    : 'bg-[#14283D] text-[#B7C5D6] hover:text-[#F4F8FC]'
                }`}
              >
                🩺 Clinician
              </button>
              <button
                onClick={() => onRoleSwitch('ADMIN')}
                className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer truncate ${
                  currentRole === 'ADMIN'
                    ? 'bg-[#F4B740] text-[#07111F]'
                    : 'bg-[#14283D] text-[#B7C5D6] hover:text-[#F4F8FC]'
                }`}
              >
                ⚙️ Admin
              </button>
            </div>
          </div>
        )}

        {/* Exit Application / Logout Button */}
        <button
          onClick={() => {
            sound.playClick();
            onLogout();
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-all cursor-pointer"
          title={isCollapsed ? 'Exit to Marketing Website' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Exit to Public Site</span>}
        </button>
      </div>
    </aside>
  );
};
