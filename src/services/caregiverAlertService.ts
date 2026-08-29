import { AlertItem, AlertCategory, AlertState } from '../types';

export class CaregiverAlertService {
  private static alerts: AlertItem[] = [
    {
      id: 'alt_01',
      patientId: 'p_dhiren_01',
      patientName: 'Dhiren Borah',
      caregiverId: 'user_priyanka',
      type: 'MISSED_MEDICINE',
      severity: 'medium',
      priority: 'HIGH',
      title: 'Morning BP Medicine Reminder',
      description: 'Morning Amlodipine (5mg) scheduled for 08:30 AM has not been confirmed yet.',
      status: 'UNREAD',
      createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
      actionRequired: 'Call patient or verify with local family helper',
    },
    {
      id: 'alt_02',
      patientId: 'p_dhiren_01',
      patientName: 'Dhiren Borah',
      caregiverId: 'user_priyanka',
      type: 'SYNC_DELAY',
      severity: 'low',
      priority: 'LOW',
      title: 'Routine Sync Check',
      description: 'Device was offline for 30 minutes in the morning during a network fluctuation; all 2 sessions have synced successfully.',
      status: 'RESOLVED',
      createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
      resolvedAt: new Date(Date.now() - 2.5 * 3600000).toISOString(),
      resolvedBy: 'Priyanka Borah',
    },
  ];

  public static getAlerts(): AlertItem[] {
    return [...this.alerts];
  }

  public static acknowledgeAlert(id: string): AlertItem | null {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      alert.status = 'ACKNOWLEDGED';
      return alert;
    }
    return null;
  }

  public static resolveAlert(id: string, resolvedBy: string = 'Caregiver'): AlertItem | null {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      alert.status = 'RESOLVED';
      alert.resolvedAt = new Date().toISOString();
      alert.resolvedBy = resolvedBy;
      return alert;
    }
    return null;
  }

  public static createAlert(
    patientId: string,
    patientName: string,
    type: AlertCategory,
    title: string,
    description: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): AlertItem {
    const newAlert: AlertItem = {
      id: `alt_${Date.now()}`,
      patientId,
      patientName,
      caregiverId: 'user_priyanka',
      type,
      severity,
      title,
      description,
      status: 'UNREAD',
      createdAt: new Date().toISOString(),
    };
    this.alerts.unshift(newAlert);
    return newAlert;
  }
}
