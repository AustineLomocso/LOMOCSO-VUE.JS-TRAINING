// =============================================================
//  DAY 4 ASSIGNMENT — Pinia Store: stores/taskStore.js
//  Topic: Centralized State with Pinia (state, getters, actions)
//  Files: stores/taskStore.js  |  TaskListView.vue (updated)
//  Time: 60 minutes
// =============================================================
//
// OBJECTIVE
// ---------
// Migrate all task-related state OUT of your components and INTO a
// centralized Pinia store. Components become thin — they only call
// store actions and read store state. They never manage task data locally.
//
// WHAT TO BUILD
// -------------
// stores/taskStore.js:
//   - state: tasks array, nextId counter
//   - getters (computed): doneCount, pendingCount, totalCount
//   - actions: addTask(name), toggleTask(id), removeTask(id)
//
// TaskListView.vue (update your existing component):
//   - Remove all local task state and action functions
//   - Import and use the Pinia store
//   - Use storeToRefs() for reactive state destructuring
//   - Destructure actions directly from the store (no storeToRefs needed)
//
// REQUIREMENTS (Acceptance Criteria)
// ------------------------------------
//  [x] defineStore('tasks', setup function) — use the Setup Store pattern
//  [x] tasks and nextId are refs inside the store
//  [x] doneCount, pendingCount, totalCount are computed() getters
//  [x] All 3 actions are defined inside the store
//  [x] store is registered in main.js: app.use(createPinia())
//  [x] Component uses storeToRefs() for state and computed
//  [x] Component uses store.action() directly (not storeToRefs for actions)
//  [x] No task state remains in any component
//
// EXTENSION
// ---------
//  - Add a userStore.js with: currentUser (name), isLoggedIn (bool)
//  - Display the current user's name in the app header
//  - Add a "login" action that sets the user name
//  - Add pinia-plugin-persistedstate to persist tasks to localStorage:
//      npm install pinia-plugin-persistedstate
//
// HINTS (read only if stuck)
// ---------------------------
//  Hint 1: import { defineStore } from 'pinia'
//  Hint 2: export const useTaskStore = defineStore('tasks', () => { ... })
//  Hint 3: The setup function must return EVERYTHING the component needs:
//          return { tasks, doneCount, addTask, toggleTask, removeTask }
//  Hint 4: In the component:
//          const store = useTaskStore()
//          const { tasks, doneCount } = storeToRefs(store)  // reactive!
//          const { addTask } = store                          // NOT storeToRefs
//  Hint 5: storeToRefs is imported from 'pinia', not 'vue'
//  Hint 6: nextId.value++ increments THEN returns — use it as the id before push
// =============================================================

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import 'pinia-plugin-persistedstate'

export type Priority = 'Low' | 'Medium' | 'High'

interface Task {
  id: number
  name: string
  done: boolean
  priority: Priority
}

// TODO 1: Export a useTaskStore function using defineStore
// The store ID is 'tasks' — this appears in Vue DevTools
export const useTaskStore = defineStore('tasks', () => {

  // TODO 2: Define state using ref()
  const tasks  = ref<Task[]>([])
  const nextId = ref(1)

  // TODO 3: Define getters using computed()
  const totalCount   = computed(() => tasks.value.length)
  const doneCount    = computed(() => tasks.value.filter(task => task.done).length)
  const pendingCount = computed(() => tasks.value.filter(task => !task.done).length)

  // addTask(name, priority) — Day 1 tasks carry a priority
  // - Guard against empty names
  // - Push a new task: { id, name, done: false, priority }
  function addTask(name: string, priority: Priority = 'Medium') {
    const trimmed = name.trim()
    if (trimmed === '') return
    tasks.value.push({ id: nextId.value++, name: trimmed, done: false, priority })
  }

  // toggleTask(id) — flip the done state
  function toggleTask(id: number) {
    const task = tasks.value.find(task => task.id === id)
    if (task) task.done = !task.done
  }

  // removeTask(id) — drop the matching task
  function removeTask(id: number) {
    tasks.value = tasks.value.filter(task => task.id !== id)
  }

  // clearDone() — remove every completed task (Day 1 "Clear done")
  function clearDone() {
    tasks.value = tasks.value.filter(task => !task.done)
  }

  // Return everything the components need to access
  return { tasks, totalCount, doneCount, pendingCount, addTask, toggleTask, removeTask, clearDone }

}, {
  persist: true,
})
