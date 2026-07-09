<!--
=============================================================
  DAY 3 ASSIGNMENT — HomeView.vue
  Shows the task list with router-link navigation to each task
=============================================================
-->
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '@/components/day3/taskStore'

const taskStore = useTaskStore()
const route     = useRoute()

// TODO 1: Read route.query.error — if it equals 'notfound', show a warning banner
const showErrorBanner = computed(() => route.query.error === 'notfound')
</script>

<template>
  <div class="home-view">
    <h1><i class="fa-solid fa-pen-to-square header-icon"></i> My Tasks</h1>

    <!-- TODO 2: Show a warning banner if showErrorBanner is true -->
    <div class="error-banner" v-if="showErrorBanner">
      <i class="fa-solid fa-triangle-exclamation"></i> Task not found. Redirected back to home.
    </div>

    <nav class="page-nav">
      <!-- TODO 3: Add a RouterLink to /about (+ /stats extension) -->
      <RouterLink to="/day3/about"><i class="fa-solid fa-circle-info"></i> About</RouterLink>
      <RouterLink to="/day3/stats"><i class="fa-solid fa-chart-simple"></i> Stats</RouterLink>
    </nav>

    <!-- TODO 4 & 5: Render each task as a RouterLink to /task/:id -->
    <ul class="task-list">
      <li v-for="task in taskStore.tasks" :key="task.id">
        <RouterLink :to="`/day3/task/${task.id}`">
          <span :class="{ done: task.done }">{{ task.name }}</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.home-view { padding-top: 20px; }
h1 { color: var(--text-strong); margin: 0 0 16px; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
.header-icon { color: var(--primary); font-size: 19px; margin-right: 4px; }
.error-banner { background: var(--warn-soft); border: 1px solid var(--warn-soft-border); border-radius: 10px; padding: 10px 14px; margin-bottom: 16px; color: var(--warn); font-size: 14px; }
.error-banner i { margin-right: 5px; }
.page-nav { display: flex; gap: 16px; margin-bottom: 20px; }
.page-nav a { color: var(--primary); text-decoration: none; font-weight: 600; font-size: 14px; }
.page-nav a i { margin-right: 4px; }
.page-nav a:hover { text-decoration: underline; }
/* EXTENSION: active-link styling — vue-router adds .router-link-active automatically */
.page-nav a.router-link-active { color: var(--text-strong); font-weight: 700; text-decoration: underline; }
.task-list { list-style: none; padding: 0; margin: 0; }
.task-list li { background: var(--surface); border-radius: 12px; margin-bottom: 10px; border: 1px solid var(--border-soft); transition: border-color 0.2s, box-shadow 0.2s, transform 0.1s; }
.task-list li:hover { border-color: var(--primary); box-shadow: 0 4px 14px rgba(56, 74, 54, 0.1); transform: translateY(-1px); }
.task-list li a { text-decoration: none; color: var(--text-body); display: flex; align-items: center; justify-content: space-between; padding: 13px 14px; font-size: 14px; }
.task-list li a::after { content: '›'; color: var(--text-muted); font-size: 18px; line-height: 1; }
.done { text-decoration: line-through; color: var(--text-muted); }
</style>
