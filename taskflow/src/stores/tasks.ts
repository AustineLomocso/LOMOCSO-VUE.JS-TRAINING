import { defineStore } from 'pinia';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  done: boolean;
  photo?: string;
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
      },
      {
        id: 2,
        title: 'Build the Tasks tab',
        description: 'Render the task list and wire up navigation to the detail page.',
        priority: 'high',
        done: false,
      },
      {
        id: 3,
        title: 'Build the Completed tab',
        description: 'Show only the tasks that have been marked as done.',
        priority: 'medium',
        done: false,
      },
      {
        id: 4,
        title: 'Write the docs',
        description: 'Document how the tabs and Pinia store fit together.',
        priority: 'low',
        done: true,
      },
    ] as Task[],
  }),
  getters: {
    completedTasks: (state) => state.tasks.filter((task) => task.done === true),
    pendingTasks: (state) => state.tasks.filter((task) => task.done === false),
    getById: (state) => (id: number) => state.tasks.find((task) => task.id === id),
  },
  actions: {
    addTask(payload: { title: string; description: string; priority: Task['priority'] }) {
      const nextId = this.tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
      this.tasks.push({
        id: nextId,
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        done: false,
      });
      return nextId;
    },
    toggleDone(id: number) {
      const task = this.tasks.find((t) => t.id === id);
      if (task) {
        task.done = !task.done;
      }
    },
    addPhotoToTask(id: number, photoPath: string) {
      const task = this.tasks.find((t) => t.id === id);
      if (task) {
        task.photo = photoPath;
      }
    },
  },
});
