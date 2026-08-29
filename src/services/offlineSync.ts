import { SyncQueueItem, GameSessionResult, ReminderItem } from '../types';

const SYNC_QUEUE_KEY = 'mindcare_sync_queue';
const LOCAL_SESSIONS_KEY = 'mindcare_local_sessions';
const LOCAL_REMINDERS_KEY = 'mindcare_local_reminders';
const LOCAL_HYDRATION_KEY = 'mindcare_local_hydration';
const OFFLINE_OVERRIDE_KEY = 'mindcare_simulated_offline';

export class OfflineSyncManager {
  private isSimulatedOffline: boolean = false;
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(OFFLINE_OVERRIDE_KEY);
      this.isSimulatedOffline = stored === 'true';

      window.addEventListener('online', () => this.handleNetworkChange());
      window.addEventListener('offline', () => this.handleNetworkChange());
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public isOnline(): boolean {
    if (this.isSimulatedOffline) return false;
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      return navigator.onLine;
    }
    return true;
  }

  public setSimulatedOffline(offline: boolean) {
    this.isSimulatedOffline = offline;
    if (typeof window !== 'undefined') {
      localStorage.setItem(OFFLINE_OVERRIDE_KEY, String(offline));
    }
    this.notify();
    if (!offline) {
      this.syncNow();
    }
  }

  private handleNetworkChange() {
    this.notify();
    if (this.isOnline()) {
      this.syncNow();
    }
  }

  // Enqueue an action to be synchronized
  public enqueue(
    patientId: string,
    entityType: SyncQueueItem['entityType'],
    entityId: string,
    operation: SyncQueueItem['operation'],
    payload: any,
  ): SyncQueueItem {
    const queue = this.getQueue();
    const item: SyncQueueItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      patientId,
      deviceId: 'device_assam_tab_01',
      entityType,
      entityId,
      operation,
      payload,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };
    queue.push(item);
    this.saveQueue(queue);
    this.notify();

    // If currently online, attempt immediate sync
    if (this.isOnline()) {
      setTimeout(() => this.syncNow(), 200);
    }
    return item;
  }

  public getQueue(): SyncQueueItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(SYNC_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveQueue(queue: SyncQueueItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  }

  public getPendingCount(): number {
    return this.getQueue().filter((item) => item.status === 'PENDING' || item.status === 'FAILED').length;
  }

  // Save session locally
  public saveLocalSession(session: GameSessionResult) {
    if (typeof window === 'undefined') return;
    const existing = this.getLocalSessions();
    const index = existing.findIndex((s) => s.id === session.id);
    if (index >= 0) {
      existing[index] = session;
    } else {
      existing.unshift(session);
    }
    localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(existing));
    this.enqueue(session.patientId, 'GAME_SESSION', session.id, 'CREATE', session);
  }

  public getLocalSessions(): GameSessionResult[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(LOCAL_SESSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // Save hydration count locally
  public setLocalHydration(count: number, patientId: string = 'p_dhiren_01') {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_HYDRATION_KEY, String(count));
    this.enqueue(patientId, 'HYDRATION_LOG', `hydro_${Date.now()}`, 'UPDATE', { count, date: new Date().toISOString() });
  }

  public getLocalHydration(): number {
    if (typeof window === 'undefined') return 5;
    const val = localStorage.getItem(LOCAL_HYDRATION_KEY);
    return val !== null ? parseInt(val, 10) : 5;
  }

  // Perform synchronization against server
  public async syncNow(): Promise<{ syncedCount: number; errors: number }> {
    const queue = this.getQueue();
    const pending = queue.filter((item) => item.status === 'PENDING' || item.status === 'FAILED');
    if (pending.length === 0) {
      return { syncedCount: 0, errors: 0 };
    }

    if (!this.isOnline()) {
      return { syncedCount: 0, errors: pending.length };
    }

    let syncedCount = 0;
    let errors = 0;

    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: pending }),
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.success) {
          const syncedIds = new Set(resData.data?.syncedIds || pending.map((p) => p.id));
          const updatedQueue = queue.map((item) => {
            if (syncedIds.has(item.id)) {
              return { ...item, status: 'SYNCED' as const, syncedAt: new Date().toISOString() };
            }
            return item;
          });
          // Retain recent 30 synced items for inspection
          this.saveQueue(updatedQueue.slice(-30));
          syncedCount = syncedIds.size;
        } else {
          errors = pending.length;
        }
      } else {
        errors = pending.length;
      }
    } catch (err) {
      errors = pending.length;
      // Mark retry count
      const updatedQueue = queue.map((item) => {
        if (item.status === 'PENDING') {
          return { ...item, retryCount: item.retryCount + 1, status: 'FAILED' as const };
        }
        return item;
      });
      this.saveQueue(updatedQueue);
    }

    this.notify();
    return { syncedCount, errors };
  }

  public clearAllSyncHistory() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SYNC_QUEUE_KEY);
    this.notify();
  }
}

export const SynchronizationService = OfflineSyncManager;
export const offlineSyncManager = new OfflineSyncManager();
export const offlineSync = offlineSyncManager;
