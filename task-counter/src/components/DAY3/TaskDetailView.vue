<!--
=============================================================
  DAY 3 ASSIGNMENT — TaskDetailView.vue
  Displays full details for a single task
=============================================================
-->
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/components/DAY3/taskStore'

// TODO 1: Get the current route and router instances
const route  = useRoute()   // read the current route (params, query)
const router = useRouter()   // navigate programmatically (push, back)

const taskStore = useTaskStore()

// TODO 2: Find the task matching the route param.
// route.params.id is a STRING — cast to Number before comparing.
// computed() so it re-derives if the id changes while staying on this route.
const task = computed(() =>
  taskStore.tasks.find(t => t.id === Number(route.params.id))
)

// TODO 3: goBack() using programmatic navigation
function goBack() {
  router.push('/home')
}
</script>

<template>
  <div class="detail-view">

    <!-- TODO 4: Show this only if the task was found -->
    <div v-if="task">
      <button class="back-btn" @click="goBack"><i class="fa-solid fa-arrow-left"></i> Back</button>

      <!-- TODO 5: Display task.name, task.done status, and task.dueDate -->
      <h1>{{ task.name }}</h1>
      <p>
        Status:
        <strong :class="task.done ? 'status-done' : 'status-pending'">
          <i :class="task.done ? 'fa-solid fa-circle-check' : 'fa-regular fa-clock'"></i>
          {{ task.done ? 'Done' : 'Pending' }}
        </strong>
      </p>
      <p><i class="fa-regular fa-calendar meta-icon"></i> Due: {{ task.dueDate }}</p>
      <p><i class="fa-solid fa-flag meta-icon"></i> Priority: <span class="priority" :class="`priority--${task.priority}`">{{ task.priority }}</span></p>
    </div>

    <!-- Fallback: the router guard should stop bad ids reaching here -->
    <div v-else>
      <p><i class="fa-solid fa-triangle-exclamation"></i> Task not found.</p>
      <button class="back-btn" @click="goBack"><i class="fa-solid fa-arrow-left"></i> Go Back</button>
    </div>
  </div>
</template>

<style scoped>
.detail-view { padding-top: 20px; }
.back-btn { background: var(--surface); border: 1px solid var(--border-soft); border-radius: 999px; padding: 7px 16px; cursor: pointer; margin-bottom: 20px; font-size: 13px; font-weight: 600; color: var(--text-body); transition: all 0.2s; }
.back-btn i { margin-right: 4px; }
.back-btn:hover { border-color: var(--primary); color: var(--primary); }
h1 { color: var(--text-strong); font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin: 0 0 12px; }
p { color: var(--text-body); font-size: 15px; margin: 6px 0; }
.meta-icon { color: var(--primary); margin-right: 4px; }
.status-done { color: var(--primary); }
.status-pending { color: var(--warn); }
.priority { text-transform: uppercase; font-size: 11px; font-weight: 700; padding: 2px 9px; border-radius: 999px; }
.priority--low    { background: var(--primary-soft); color: var(--primary-hover); }
.priority--medium { background: var(--warn-soft); color: var(--warn); }
.priority--high   { background: var(--danger-soft); color: var(--danger); }
</style>
