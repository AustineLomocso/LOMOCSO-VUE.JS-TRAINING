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

// TODO 1: Export a useTaskStore function using defineStore
// The store ID is 'tasks' — this appears in Vue DevTools
export const useTaskStore = defineStore('tasks', () => {

  // TODO 2: Define state using ref()
  const tasks  = ref([])
  const nextId = ref(1)

  // TODO 3: Define getters using computed()
  const totalCount   = computed(() => tasks.value.length)
  const doneCount    = computed(() => tasks.value.filter(task => task.done).length)
  const pendingCount = computed(() => tasks.value.filter(task => !task.done).length)

  // TODO 4: Define addTask(name) action
  // - Guard against empty names
  // - Push a new task: { id: nextId.value++, name, done: false }
  function addTask(name) {
    // your code here
    if(name === '') return
    tasks.value.push({ id: nextId.value++, name, done: false })
  }

  // TODO 5: Define toggleTask(id) action
  function toggleTask(id) {
    // your code here
    const task = tasks.value.find(task => task.id === id)
    if(task) task.done = !task.done
  }

  // TODO 6: Define removeTask(id) action
  function removeTask(id) {
    // your code here
    tasks.value = tasks.value.filter(task => task.id !== id)
  }

  // TODO 7: Return everything the component needs to access
  return { tasks, totalCount, doneCount, pendingCount, addTask, toggleTask, removeTask }

}, {
  persist: true,
})
