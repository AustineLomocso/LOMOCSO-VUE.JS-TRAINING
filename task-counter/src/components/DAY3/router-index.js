// =============================================================
//  DAY 3 ASSIGNMENT — Vue Router: router/index.js
//  Topic: Dynamic Routes, Navigation Guards, Programmatic Navigation
//  Files: router/index.js  |  HomeView.vue  |  TaskDetailView.vue
//  Time: 60 minutes
// =============================================================
//
// OBJECTIVE
// ---------
// Add client-side routing to your task app. Students will create a
// multi-page SPA with dynamic routes, query params, and a guard that
// protects the detail page from invalid task IDs.
//
// WHAT TO BUILD
// -------------
//  1. /home         → HomeView.vue  (task list with router-link to each task)
//  2. /task/:id     → TaskDetailView.vue  (detail page for one task)
//  3. /about        → AboutView.vue  (static info page)
//  4. /             → redirects to /home
//
// NAVIGATION GUARD
// ----------------
//  If the user navigates to /task/:id with a non-existent ID:
//  → redirect to /home?error=notfound
//  HomeView should display a warning banner when it sees ?error=notfound
//
// REQUIREMENTS (Acceptance Criteria)
// ------------------------------------
//  [x] Install vue-router@4: npm install vue-router@4
//  [x] createRouter with createWebHistory
//  [x] Dynamic route: /task/:id (params.id is a string — cast to Number)
//  [x] router.beforeEach checks if the task exists
//  [x] router-link used on HomeView for navigation (not <a> tags)
//  [x] useRoute() used in TaskDetailView to read params.id
//  [x] useRouter() used for the "Back" button (programmatic navigation)
//  [x] App.vue contains <RouterView />
//
// EXTENSION (addtional points)
// ---------
//  - Add a /stats route that shows total/done/pending counts
//  - Add router-link-active styling to the nav links
//  - Add a page transition animation using Vue's <Transition> component
//
// HINTS (read only if stuck)
// ---------------------------
//  Hint 1: import { createRouter, createWebHistory } from 'vue-router'
//  Hint 2: { path: '/task/:id', component: TaskDetailView, meta: { requiresTask: true } }
//  Hint 3: router.beforeEach((to, from, next) => { ... next() ... })
//  Hint 4: In TaskDetailView — const route = useRoute(); route.params.id
//  Hint 5: Cast param to number — Number(route.params.id) or parseInt(route.params.id)
//  Hint 6: For the error banner — useRoute().query.error === 'notfound'
//  Hint 7: Always call next() at the end of beforeEach or navigation hangs!
// =============================================================

import { createRouter, createWebHistory } from 'vue-router'

// TODO 1: Import your view components
// (Files live in @/components/DAY3 — see guide §0.1 Option B — so imports point there.)
import HomeView       from '@/components/DAY3/HomeView.vue'
import TaskDetailView from '@/components/DAY3/TaskDetailView.vue'
import AboutView      from '@/components/DAY3/AboutView.vue'
import StatsView      from '@/components/DAY3/StatsView.vue'

// TODO 2: Import the task store so the guard can check if a task exists.
// (Plain reactive store instead of Pinia — see guide §0.2. Called INSIDE the guard.)
import { useTaskStore } from '@/components/DAY3/taskStore'

const routes = [
  // TODO 3: Redirect '/' → '/home'
  { path: '/', redirect: '/home' },

  // TODO 4: The /home route
  { path: '/home', component: HomeView },

  // TODO 5: The /task/:id dynamic route — meta flag tells the guard to protect it
  { path: '/task/:id', component: TaskDetailView, meta: { requiresTask: true } },

  // TODO 6: The /about route
  { path: '/about', component: AboutView },

  // EXTENSION: /stats route (total / done / pending counts)
  { path: '/stats', component: StatsView },
]

const router = createRouter({
  // TODO 7: createWebHistory() for clean URLs (/task/42 instead of /#/task/42)
  history: createWebHistory(),
  routes,
})

// TODO 8: beforeEach navigation guard — block /task/:id for IDs that don't exist
router.beforeEach((to, from, next) => {
  if (to.meta.requiresTask) {
    const store = useTaskStore()          // get the store INSIDE the guard
    const id = Number(to.params.id)       // params are strings — cast to Number
    const exists = store.tasks.some(t => t.id === id)

    if (!exists) {
      // redirect home and flag the error so HomeView can show a banner
      return next({ path: '/home', query: { error: 'notfound' } })
    }
  }
  next() // don't remove this — it must always be called
})

export default router
