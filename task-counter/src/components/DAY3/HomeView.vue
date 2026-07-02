<!--
=============================================================
  DAY 3 ASSIGNMENT — HomeView.vue
  Shows the task list with router-link navigation to each task
=============================================================
-->
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '@/components/DAY3/taskStore'

const taskStore = useTaskStore()
const route     = useRoute()

// TODO 1: Read route.query.error — if it equals 'notfound', show a warning banner
const showErrorBanner = computed(() => route.query.error === 'notfound')
</script>

<template>
  <div class="home-view">
    <h1>📝 My Tasks</h1>

    <!-- TODO 2: Show a warning banner if showErrorBanner is true -->
    <div class="error-banner" v-if="showErrorBanner">
      ⚠️ Task not found. Redirected back to home.
    </div>

    <nav class="page-nav">
      <!-- TODO 3: Add a RouterLink to /about (+ /stats extension) -->
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/stats">Stats</RouterLink>
    </nav>

    <!-- TODO 4 & 5: Render each task as a RouterLink to /task/:id -->
    <ul class="task-list">
      <li v-for="task in taskStore.tasks" :key="task.id">
        <RouterLink :to="`/task/${task.id}`">
          <span :class="{ done: task.done }">{{ task.name }}</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.home-view { padding-top: 20px; }
h1 { color: #1B2A4A; margin: 0 0 16px; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
.error-banner { background: #fef3c7; border: 1px solid #fbbf24; border-radius: 10px; padding: 10px 14px; margin-bottom: 16px; color: #92400e; font-size: 14px; }
.page-nav { display: flex; gap: 16px; margin-bottom: 20px; }
.page-nav a { color: #42B883; text-decoration: none; font-weight: 600; font-size: 14px; }
.page-nav a:hover { text-decoration: underline; }
/* EXTENSION: active-link styling — vue-router adds .router-link-active automatically */
.page-nav a.router-link-active { color: #1B2A4A; font-weight: 700; text-decoration: underline; }
.task-list { list-style: none; padding: 0; margin: 0; }
.task-list li { background: white; border-radius: 12px; margin-bottom: 10px; border: 1px solid #eef1f6; transition: border-color 0.2s, box-shadow 0.2s, transform 0.1s; }
.task-list li:hover { border-color: #42B883; box-shadow: 0 4px 14px rgba(27, 42, 74, 0.08); transform: translateY(-1px); }
.task-list li a { text-decoration: none; color: #334155; display: flex; align-items: center; justify-content: space-between; padding: 13px 14px; font-size: 14px; }
.task-list li a::after { content: '›'; color: #cbd5e1; font-size: 18px; line-height: 1; }
.done { text-decoration: line-through; color: #9ca3af; }
</style>
