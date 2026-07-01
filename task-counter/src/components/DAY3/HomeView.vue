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
.home-view { max-width: 520px; margin: 40px auto; padding: 24px; font-family: Arial, sans-serif; }
h1 { color: #1B2A4A; margin-bottom: 16px; }
.error-banner { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; color: #92400e; font-size: 14px; }
.page-nav { display: flex; gap: 16px; margin-bottom: 20px; }
.page-nav a { color: #42B883; text-decoration: none; font-weight: 600; }
/* EXTENSION: active-link styling — vue-router adds .router-link-active automatically */
.page-nav a.router-link-active { color: #1B2A4A; font-weight: 700; text-decoration: underline; }
.task-list { list-style: none; padding: 0; margin: 0; }
.task-list li { padding: 12px; background: white; border-radius: 8px; margin-bottom: 8px; border: 1px solid #eee; cursor: pointer; transition: border-color 0.2s; }
.task-list li:hover { border-color: #42B883; }
.task-list li a { text-decoration: none; color: #334155; display: block; }
.done { text-decoration: line-through; color: #9ca3af; }
</style>
