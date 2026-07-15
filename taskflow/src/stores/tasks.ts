import { defineStore } from 'pinia';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = 'taskflow_tasks';

export type Priority = 'low' | 'medium' | 'high';

/** Categories a task can be filed under. Kept here so the form and filters share one source. */
export const TASK_CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Other'] as const;
export type TaskCategory = (typeof TASK_CATEGORIES)[number];

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  done: boolean;
  photo?: string;
  /** ISO date string (yyyy-mm-dd or full ISO). Optional. */
  dueDate?: string;
  /** Free-form category label (see TASK_CATEGORIES). Optional. */
  category?: string;
  /** ISO timestamp set when the task is created. */
  createdAt?: string;
  /** ISO timestamp bumped on every mutation. */
  updatedAt?: string;
}

/** Payload accepted when creating a task. */
export interface NewTaskInput {
  title: string;
  description: string;
  priority: Priority;
  dueDate?: string;
  category?: string;
}

/** Payload accepted when editing a task — id plus any subset of editable fields. */
export type TaskUpdate = { id: number } & Partial<
  Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'category'>
>;

/**
 * Coerce a raw (possibly legacy) persisted item into a valid Task, backfilling
 * defaults so payloads saved before newer fields existed never break the app.
 */
function normalizeTask(raw: unknown, fallbackId: number): Task {
  const r = (raw ?? {}) as Record<string, unknown>;
  const now = new Date().toISOString();
  const priority: Priority =
    r.priority === 'low' || r.priority === 'high' ? r.priority : 'medium';

  return {
    id: typeof r.id === 'number' ? r.id : fallbackId,
    title: typeof r.title === 'string' ? r.title : '',
    description: typeof r.description === 'string' ? r.description : '',
    priority,
    done: Boolean(r.done),
    photo: typeof r.photo === 'string' ? r.photo : undefined,
    dueDate: typeof r.dueDate === 'string' && r.dueDate ? r.dueDate : undefined,
    category: typeof r.category === 'string' && r.category ? r.category : undefined,
    // createdAt is read unconditionally by the "newest" sort, so it must never be missing.
    createdAt: typeof r.createdAt === 'string' ? r.createdAt : now,
    updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : undefined,
  };
}

/** Start of the current day — used for overdue comparisons. */
function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [
      {
        id: 1,
        title: 'Set up the project',
        description: 'Scaffold the Ionic Vue app and install dependencies.',
        priority: 'high',
        done: true,
        createdAt: '2026-01-01T09:00:00.000Z',
      },
      {
        id: 2,
        title: 'Build the Tasks tab',
        description: 'Render the task list and wire up navigation to the detail page.',
        priority: 'high',
        done: false,
        createdAt: '2026-01-02T09:00:00.000Z',
      },
      {
        id: 3,
        title: 'Build the Completed tab',
        description: 'Show only the tasks that have been marked as done.',
        priority: 'medium',
        done: false,
        createdAt: '2026-01-03T09:00:00.000Z',
      },
      {
        id: 4,
        title: 'Write the docs',
        description: 'Document how the tabs and Pinia store fit together.',
        priority: 'low',
        done: true,
        createdAt: '2026-01-04T09:00:00.000Z',
      },
    ] as Task[],
    /** True while the initial load from storage is in flight (drives skeletons). */
    isLoading: false,
  }),
  getters: {
    completedTasks: (state) => state.tasks.filter((task) => task.done === true),
    pendingTasks: (state) => state.tasks.filter((task) => task.done === false),
    getById: (state) => (id: number) => state.tasks.find((task) => task.id === id),
    /** Aggregate counts for the Settings dashboard. */
    stats: (state) => {
      const total = state.tasks.length;
      const completed = state.tasks.filter((t) => t.done).length;
      const start = startOfToday();
      const overdue = state.tasks.filter(
        (t) => !t.done && t.dueDate && new Date(t.dueDate) < start,
      ).length;
      return {
        total,
        completed,
        pending: total - completed,
        pct: total ? Math.round((completed / total) * 100) : 0,
        overdue,
        byPriority: {
          high: state.tasks.filter((t) => t.priority === 'high').length,
          medium: state.tasks.filter((t) => t.priority === 'medium').length,
          low: state.tasks.filter((t) => t.priority === 'low').length,
        },
      };
    },
  },
  actions: {
    async saveTasks() {
      await Preferences.set({
        key: STORAGE_KEY,
        value: JSON.stringify(this.tasks),
      });
    },
    async loadTasks() {
      this.isLoading = true;
      try {
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        if (!value) {
          return;
        }
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          this.tasks = parsed.map((raw, i) => normalizeTask(raw, i + 1));
        }
      } catch {
        this.tasks = [];
      } finally {
        this.isLoading = false;
      }
    },
    addTask(payload: NewTaskInput) {
      const nextId = this.tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
      const now = new Date().toISOString();
      this.tasks.push({
        id: nextId,
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        done: false,
        dueDate: payload.dueDate || undefined,
        category: payload.category || undefined,
        createdAt: now,
        updatedAt: now,
      });
      this.saveTasks();
      return nextId;
    },
    updateTask(payload: TaskUpdate) {
      const { id, ...changes } = payload;
      const task = this.tasks.find((t) => t.id === id);
      if (!task) {
        return;
      }
      // Normalize empties to undefined so cleared date/category don't persist as "".
      if ('dueDate' in changes) {
        changes.dueDate = changes.dueDate || undefined;
      }
      if ('category' in changes) {
        changes.category = changes.category || undefined;
      }
      Object.assign(task, changes);
      task.updatedAt = new Date().toISOString();
      this.saveTasks();
    },
    removeTask(id: number) {
      this.tasks = this.tasks.filter((t) => t.id !== id);
      this.saveTasks();
    },
    /** Re-insert a previously removed task (for undo), preserving id/photo/dates. */
    restoreTask(task: Task) {
      if (this.tasks.some((t) => t.id === task.id)) {
        return;
      }
      this.tasks.push({ ...task });
      this.tasks.sort((a, b) => a.id - b.id);
      this.saveTasks();
    },
    /** Move a task within the array (manual ordering). */
    reorderTasks(from: number, to: number) {
      const [moved] = this.tasks.splice(from, 1);
      if (moved) {
        this.tasks.splice(to, 0, moved);
        this.saveTasks();
      }
    },
    toggleDone(id: number) {
      const task = this.tasks.find((t) => t.id === id);
      if (task) {
        task.done = !task.done;
        task.updatedAt = new Date().toISOString();
        this.saveTasks();
      }
    },
    addPhotoToTask(id: number, photoPath: string) {
      const task = this.tasks.find((t) => t.id === id);
      if (task) {
        task.photo = photoPath;
        task.updatedAt = new Date().toISOString();
        this.saveTasks();
      }
    },
  },
});
