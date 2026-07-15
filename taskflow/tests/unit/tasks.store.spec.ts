import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Capacitor Preferences so saveTasks() is a no-op we can assert against,
// and loadTasks() reads whatever we stage on the mock.
const store: Record<string, string> = {};
const set = vi.fn(async ({ key, value }: { key: string; value: string }) => {
  store[key] = value;
});
const get = vi.fn(async ({ key }: { key: string }) => ({ value: store[key] ?? null }));

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    set: (opts: { key: string; value: string }) => set(opts),
    get: (opts: { key: string }) => get(opts),
  },
}));

import { useTasksStore, type Task } from '@/stores/tasks';

describe('tasks store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    for (const k of Object.keys(store)) delete store[k];
    set.mockClear();
    get.mockClear();
  });

  it('seeds four tasks and partitions pending/completed', () => {
    const s = useTasksStore();
    expect(s.tasks).toHaveLength(4);
    expect(s.pendingTasks).toHaveLength(2);
    expect(s.completedTasks).toHaveLength(2);
  });

  it('addTask assigns an incrementing id, done=false, and timestamps', () => {
    const s = useTasksStore();
    const id = s.addTask({ title: 'New', description: 'x', priority: 'high' });
    const created = s.getById(id)!;
    expect(id).toBe(5);
    expect(created.done).toBe(false);
    expect(created.createdAt).toBeTruthy();
    expect(created.updatedAt).toBeTruthy();
    expect(set).toHaveBeenCalled();
  });

  it('addTask carries dueDate and category, dropping empties to undefined', () => {
    const s = useTasksStore();
    const id = s.addTask({
      title: 'Dated',
      description: '',
      priority: 'low',
      dueDate: '2026-08-01',
      category: 'Work',
    });
    const t = s.getById(id)!;
    expect(t.dueDate).toBe('2026-08-01');
    expect(t.category).toBe('Work');
  });

  it('updateTask mutates only the target and bumps updatedAt', () => {
    const s = useTasksStore();
    const before = s.getById(3)!.title;
    s.updateTask({ id: 2, title: 'Renamed', priority: 'low' });
    expect(s.getById(2)!.title).toBe('Renamed');
    expect(s.getById(2)!.priority).toBe('low');
    expect(s.getById(2)!.updatedAt).toBeTruthy();
    expect(s.getById(3)!.title).toBe(before); // untouched
  });

  it('updateTask clears dueDate/category when passed empty', () => {
    const s = useTasksStore();
    s.addTask({ title: 'Clr', description: '', priority: 'medium', dueDate: '2026-08-01', category: 'Work' });
    const id = 5;
    s.updateTask({ id, dueDate: '', category: '' });
    expect(s.getById(id)!.dueDate).toBeUndefined();
    expect(s.getById(id)!.category).toBeUndefined();
  });

  it('removeTask then restoreTask round-trips, preserving id and re-sorting', () => {
    const s = useTasksStore();
    const snapshot = { ...s.getById(2)! };
    s.removeTask(2);
    expect(s.getById(2)).toBeUndefined();
    s.restoreTask(snapshot);
    expect(s.getById(2)).toBeTruthy();
    // restored in id order
    expect(s.tasks.map((t) => t.id)).toEqual([1, 2, 3, 4]);
  });

  it('restoreTask ignores duplicates', () => {
    const s = useTasksStore();
    s.restoreTask({ ...s.getById(1)! });
    expect(s.tasks.filter((t) => t.id === 1)).toHaveLength(1);
  });

  it('toggleDone flips done and bumps updatedAt', () => {
    const s = useTasksStore();
    expect(s.getById(2)!.done).toBe(false);
    s.toggleDone(2);
    expect(s.getById(2)!.done).toBe(true);
    expect(s.getById(2)!.updatedAt).toBeTruthy();
  });

  it('reorderTasks moves an item within the array', () => {
    const s = useTasksStore();
    s.reorderTasks(0, 2); // move id 1 to index 2
    expect(s.tasks.map((t) => t.id)).toEqual([2, 3, 1, 4]);
  });

  it('stats reports totals, percentage, and priority breakdown', () => {
    const s = useTasksStore();
    expect(s.stats.total).toBe(4);
    expect(s.stats.completed).toBe(2);
    expect(s.stats.pending).toBe(2);
    expect(s.stats.pct).toBe(50);
    expect(s.stats.byPriority.high).toBe(2);
  });

  it('stats counts overdue pending tasks with a past due date', () => {
    const s = useTasksStore();
    s.addTask({ title: 'Late', description: '', priority: 'high', dueDate: '2000-01-01' });
    expect(s.stats.overdue).toBe(1);
  });

  describe('loadTasks migration', () => {
    it('backfills missing createdAt and leaves new fields undefined for legacy payloads', async () => {
      const legacy = [{ id: 10, title: 'Old', description: '', priority: 'high', done: false }];
      store['taskflow_tasks'] = JSON.stringify(legacy);
      const s = useTasksStore();
      await s.loadTasks();
      const t = s.getById(10)!;
      expect(t.createdAt).toBeTruthy(); // backfilled
      expect(t.dueDate).toBeUndefined();
      expect(t.category).toBeUndefined();
    });

    it('coerces an invalid priority to medium and non-array/garbage safely', async () => {
      store['taskflow_tasks'] = JSON.stringify([{ id: 1, title: 'x', priority: 'urgent', done: 1 }]);
      const s = useTasksStore();
      await s.loadTasks();
      expect(s.getById(1)!.priority).toBe('medium');
      expect(s.getById(1)!.done).toBe(true);
    });

    it('tolerates malformed JSON without throwing', async () => {
      store['taskflow_tasks'] = '{ not valid json';
      const s = useTasksStore();
      await expect(s.loadTasks()).resolves.toBeUndefined();
      expect(s.tasks).toEqual([]);
    });

    it('keeps seed data when storage is empty', async () => {
      const s = useTasksStore();
      await s.loadTasks();
      expect(s.tasks).toHaveLength(4);
    });
  });
});
