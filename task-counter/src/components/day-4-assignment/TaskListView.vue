<!--
=============================================================
  DAY 4 ASSIGNMENT — TaskListView.vue (refactored for Pinia)
  Remove all local state. Use the store for everything.
=============================================================
-->
<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

// TODO 1: Import your store
// import { useTaskStore } from '@/stores/taskStore'

// TODO 2: Get the store instance
// const taskStore = useTaskStore()

// TODO 3: Destructure REACTIVE STATE using storeToRefs()
// const { tasks, doneCount, pendingCount, totalCount } = storeToRefs(taskStore)

// TODO 4: Destructure ACTIONS directly (no storeToRefs needed for functions)
// const { addTask, toggleTask, removeTask } = taskStore

// This local ref is fine — it's UI state, not task state
const newTaskName = ref('')

function handleAdd() {
  // TODO 5: Call addTask() from the store, then clear the input
}
</script>

<template>
  <div class="task-view">
    <h1>📝 Tasks</h1>

    <!-- TODO 6: Display totalCount, doneCount, pendingCount from the store -->
    <div class="stats">
      <!-- Total: {{ ??? }} | Done: {{ ??? }} | Pending: {{ ??? }} -->
    </div>

    <div class="input-row">
      <input v-model="newTaskName" placeholder="New task..." @keyup.enter="handleAdd" />
      <button @click="handleAdd">Add</button>
    </div>

    <!-- TODO 7: Render the task list using tasks from the store -->
    <ul class="task-list">
      <!-- v-for task in tasks -->
      <!--   checkbox v-model="task.done" @change="toggleTask(task.id)" -->
      <!--   span :class done -->
      <!--   remove button @click="removeTask(task.id)" -->
    </ul>
  </div>
</template>

<style scoped>
.task-view { max-width: 480px; margin: 40px auto; padding: 24px; font-family: Arial, sans-serif; }
h1 { color: #1B2A4A; }
.stats { font-size: 13px; color: #555; padding: 8px 12px; background: #e9f7f0; border-radius: 6px; margin-bottom: 16px; }
.input-row { display: flex; gap: 8px; margin-bottom: 16px; }
.input-row input { flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
.input-row button { padding: 8px 16px; background: #42B883; color: white; border: none; border-radius: 6px; cursor: pointer; }
.task-list { list-style: none; padding: 0; margin: 0; }
.task-list li { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: white; border-radius: 6px; margin-bottom: 8px; border: 1px solid #eee; }
.task-list li span { flex: 1; font-size: 14px; }
.done { text-decoration: line-through; color: #9ca3af; }
.task-list li .remove { padding: 4px 10px; background: #fee2e2; color: #dc2626; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
</style>
