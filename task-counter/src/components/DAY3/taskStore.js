// =============================================================
//  DAY 3 — Shared task store (plain reactive module, no Pinia)
//
//  Required dependency of HomeView.vue, TaskDetailView.vue and
//  router-index.js — they all import useTaskStore. The guide (§0.2)
//  allows skipping Pinia and exposing a plain shared reactive array
//  instead. useTaskStore() returns the same reactive object every
//  time, so the router guard and every view read the same tasks.
// =============================================================
import { reactive } from 'vue'

const store = reactive({
  tasks: [
    { id: 1, name: 'Cook Rice',        done: false, dueDate: '06/30/26', priority: 'high'   },
    { id: 2, name: 'Get Food',         done: true,  dueDate: '06/30/26', priority: 'medium' },
    { id: 3, name: 'Get Water',        done: false, dueDate: '07/01/26', priority: 'low'    },
    { id: 4, name: 'Study Vue Router', done: false, dueDate: '07/02/26', priority: 'high'   },
  ],
})

export function useTaskStore() {
  return store
}
