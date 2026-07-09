// =============================================================
//  APP ROUTER — src/router/index.js
//  Each training day (1–5) is a top-level route. App.vue renders
//  the matched day in its single <RouterView>.
//
//  Day 3 keeps its own sub-navigation (Vue Router assignment):
//  its pages are nested CHILD routes under /day3, rendered inside
//  Day3View's own <RouterView>.
// =============================================================

import { createRouter, createWebHistory } from 'vue-router'

// Day container views — one entry component per day
import Day1View from '@/components/day1/Day1View.vue'
import Day2View from '@/components/day2/Day2View.vue'
import Day3View from '@/components/day3/Day3View.vue'
import Day4View from '@/components/day4/Day4View.vue'
import Day5View from '@/components/day5/Day5View.vue'

// Day 3 child pages
import HomeView       from '@/components/day3/HomeView.vue'
import TaskDetailView from '@/components/day3/TaskDetailView.vue'
import AboutView      from '@/components/day3/AboutView.vue'
import StatsView      from '@/components/day3/StatsView.vue'

// Day 3 plain reactive store — used by the guard to check a task exists
import { useTaskStore } from '@/components/day3/taskStore'

const routes = [
  // Land on Day 1 by default
  { path: '/', redirect: '/day1' },

  { path: '/day1', component: Day1View },
  { path: '/day2', component: Day2View },

  // Day 3 — nested routes rendered inside Day3View's <RouterView>
  {
    path: '/day3',
    component: Day3View,
    redirect: '/day3/home',
    children: [
      { path: 'home', component: HomeView },
      { path: 'task/:id', component: TaskDetailView, meta: { requiresTask: true } },
      { path: 'about', component: AboutView },
      { path: 'stats', component: StatsView },
    ],
  },

  { path: '/day4', component: Day4View },
  { path: '/day5', component: Day5View },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Day 3 navigation guard — block /day3/task/:id for IDs that don't exist
router.beforeEach((to, from, next) => {
  if (to.meta.requiresTask) {
    const store = useTaskStore()          // get the store INSIDE the guard
    const id = Number(to.params.id)       // params are strings — cast to Number
    const exists = store.tasks.some(t => t.id === id)

    if (!exists) {
      // redirect to the Day 3 home and flag the error so HomeView shows a banner
      return next({ path: '/day3/home', query: { error: 'notfound' } })
    }
  }
  next() // must always be called or navigation hangs
})

export default router
