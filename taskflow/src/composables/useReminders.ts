import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import type { Task } from '@/stores/tasks';

/**
 * Schedules/cancels local notifications for tasks with a due date.
 *
 * Notifications are a native-only concern here: on the web we no-op (the
 * official plugin has no reliable web implementation), so every method is a
 * safe call regardless of platform. The task's own `id` is used as the
 * notification id so scheduling is idempotent per task.
 */
export function useReminders() {
  const supported = Capacitor.isNativePlatform();

  async function ensurePermission(): Promise<boolean> {
    if (!supported) {
      return false;
    }
    try {
      const status = await LocalNotifications.checkPermissions();
      if (status.display === 'granted') {
        return true;
      }
      const requested = await LocalNotifications.requestPermissions();
      return requested.display === 'granted';
    } catch {
      return false;
    }
  }

  async function schedule(task: Task): Promise<void> {
    if (!supported || !task.dueDate || task.done) {
      return;
    }
    const at = new Date(task.dueDate);
    if (Number.isNaN(at.getTime()) || at.getTime() <= Date.now()) {
      return; // don't schedule for invalid or past dates
    }
    if (!(await ensurePermission())) {
      return;
    }
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: task.id,
            title: 'Task due',
            body: task.title,
            schedule: { at },
          },
        ],
      });
    } catch {
      /* best-effort */
    }
  }

  async function cancel(taskId: number): Promise<void> {
    if (!supported) {
      return;
    }
    try {
      await LocalNotifications.cancel({ notifications: [{ id: taskId }] });
    } catch {
      /* best-effort */
    }
  }

  /** Cancel then (re)schedule so the reminder matches the task's current state. */
  async function sync(task: Task): Promise<void> {
    await cancel(task.id);
    await schedule(task);
  }

  return { supported, ensurePermission, schedule, cancel, sync };
}
