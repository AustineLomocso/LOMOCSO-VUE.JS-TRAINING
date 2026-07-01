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
      <button class="back-btn" @click="goBack">← Back</button>

      <!-- TODO 5: Display task.name, task.done status, and task.dueDate -->
      <h1>{{ task.name }}</h1>
      <p>Status: <strong>{{ task.done ? '✅ Done' : '⏳ Pending' }}</strong></p>
      <p>Due: {{ task.dueDate }}</p>
      <p>Priority: <span class="priority" :class="`priority--${task.priority}`">{{ task.priority }}</span></p>
    </div>

    <!-- Fallback: the router guard should stop bad ids reaching here -->
    <div v-else>
      <p>Task not found.</p>
      <button class="back-btn" @click="goBack">Go Back</button>
    </div>
  </div>
</template>

<style scoped>
.detail-view { max-width: 520px; margin: 40px auto; padding: 24px; font-family: Arial, sans-serif; }
.back-btn { background: none; border: 1px solid #ddd; border-radius: 6px; padding: 6px 14px; cursor: pointer; margin-bottom: 20px; }
.back-btn:hover { background: #f3f4f6; }
h1 { color: #1B2A4A; font-size: 24px; margin-bottom: 12px; }
p { color: #4A5568; font-size: 15px; margin: 6px 0; }
.priority { text-transform: uppercase; font-size: 11px; font-weight: 700; padding: 2px 9px; border-radius: 999px; }
.priority--low    { background: #d1fae5; color: #065f46; }
.priority--medium { background: #fef3c7; color: #92400e; }
.priority--high   { background: #fee2e2; color: #991b1b; }
</style>
