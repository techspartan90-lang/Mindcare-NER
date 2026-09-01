import React from 'react';
import {
  Home,
  Gamepad2,
  Calendar,
  Flower2,
  HeartHandshake,
  Users,
  Bell,
  BarChart3,
  Settings,
  Shield,
  FileText,
} from 'lucide-react';
import { UserRole } from '../../types';
import { DashboardViewId } from './DashboardSidebar';
import { sound } from '../../services/sound';

interface DashboardMobileBottomNavProps {
  currentRole: UserRole;
  activeView: DashboardViewId;
  onSelectView: (view: DashboardViewId) => void;
}

export const DashboardMobileBottomNav: React.FC<DashboardMobileBottomNavProps> = ({
  currentRole,
  activeView,
  onSelectView,
}) => {
  const getNavItems = () => {
    switch (currentRole) {
      case 'PATIENT':
        return [
          { id: 'overview' as DashboardViewId, label: 'Home', icon: Home },
          { id: 'activities' as DashboardViewId, label: 'Activities', icon: Gamepad2 },
          { id: 'routine' as DashboardViewId, label: 'Routine', icon: Calendar },
          { id: 'memory' as DashboardViewId, label: 'Memories', icon: Flower2 },
          { id: 'family' as DashboardViewId, label: 'Family', icon: HeartHandshake },
        ];
      case 'CAREGIVER':
        return [
          { id: 'overview' as DashboardViewId, label: 'Overview', icon: Home },
          { id: 'family' as DashboardViewId, label: 'Patients', icon: Users },
          { id: 'notifications' as DashboardViewId, label: 'Alerts', icon: Bell },
          { id: 'routine' as DashboardViewId, label: 'Routine', icon: Calendar },
          { id: 'settings' as DashboardViewId, label: 'Settings', icon: Settings },
        ];
      case 'HEALTHCARE_WORKER':
        return [
          { id: 'overview' as DashboardViewId, label: 'Overview', icon: Home },
          { id: 'analytics' as DashboardViewId, label: 'Telemetry', icon: BarChart3 },
          { id: 'help' as DashboardViewId, label: 'Reports', icon: FileText },
          { id: 'settings' as DashboardViewId, label: 'Settings', icon: Settings },
        ];
      case 'ADMIN':
      default:
        return [
          { id: 'overview' as DashboardViewId, label: 'Overview', icon: Home },
          { id: 'activities' as DashboardViewId, label: 'Content', icon: Shield },
          { id: 'analytics' as DashboardViewId, label: 'System', icon: BarChart3 },
          { id: 'settings' as DashboardViewId, label: 'Settings', icon: Settings },
        ];
    }
  };

  const items = getNavItems();

  return (
    <nav
      aria-label="Mobile Application Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B1726]/95 backdrop-blur-lg border-t border-[#243A50] px-2 py-2 flex items-center justify-around"
    >
      {items.map((item) => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              sound.playClick();
              onSelectView(item.id);
            }}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer min-w-[56px] ${
              isActive ? 'text-[#38D9C5]' : 'text-[#7F91A6] hover:text-[#F4F8FC]'
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
            <span className="text-[10px] font-bold mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
