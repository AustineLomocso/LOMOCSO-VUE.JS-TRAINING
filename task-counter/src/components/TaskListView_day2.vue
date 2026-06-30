<script setup>
import { ref } from 'vue'
import TaskCard from './TaskCard_day2.vue'


// TODO 1: Create a ref() tasks array with at least 3 sample tasks
// Each task: { id, name, done, dueDate }
// const tasks = ref([...])
const tasks = ref([
  { id: 1, name: 'Cook Rice',  done: false, dueDate: '06/30/26', priority: 'high'   },
  { id: 2, name: 'Get Food',   done: false, dueDate: '06/30/26', priority: 'medium' },
  { id: 3, name: 'Get Water',  done: false, dueDate: '06/30/26', priority: 'low'    },
])

// TODO 2: Write handleComplete(id) — toggle the done state of the task with this id
function handleComplete(id) {
  // your code here
  const task = tasks.value.find(t=> t.id === id)
  if(task) task.done = !task.done
}

// TODO 3: Write handleDelete(id) — remove the task with this id from the array
function handleDelete(id) {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

// EXTENSION: update the task name when TaskCard emits 'update'
function handleUpdate({ id, name }) {
  const task = tasks.value.find(t => t.id === id)
  if (task) task.name = name
}
</script>

<template>
  <div class="task-list-view">
    <div class="list-header">
      <h1>My Tasks</h1>
      <span class="count-badge">{{ tasks.length }}</span>
    </div>

    <!-- TODO 4: Render a <TaskCard> for each task using v-for
         - Pass :task="task" as a prop
         - Listen @complete="handleComplete"
         - Listen @delete="handleDelete"
         - Fill the "meta" named slot with the due date
    -->
    <TaskCard
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      :priority="task.priority"
      @complete="handleComplete"
      @delete="handleDelete"
      @update="handleUpdate"
    >
      <template #meta>
        Due: {{ task.dueDate }}
      </template>
    </TaskCard>
  </div>
</template>

<style scoped>
.task-list-view {
  padding: 32px;
  font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #eef1f6;
  box-shadow: 0 12px 40px rgba(27, 42, 74, 0.12);
}
.list-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
h1 {
  color: #1B2A4A;
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
}
.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: 0 8px;
  background: #42B883;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  border-radius: 999px;
}
</style>
