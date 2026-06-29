<script setup>
import { ref, computed } from 'vue'

// Step 2: reactive state
const tasks = ref([])
const newTask = ref('')

// Step 3: add a task
function addTask() {
  const title = newTask.value.trim()
  if (!title) return
  tasks.value.push({ id: Date.now(), title, done: false })
  newTask.value = ''
}

// Bonus: remove a task
function removeTask(id) {
  tasks.value = tasks.value.filter((task) => task.id !== id)
}

// Step 5: computed properties
const totalTasks = computed(() => tasks.value.length)
const doneTasks = computed(() => tasks.value.filter((task) => task.done).length)
const pendingTasks = computed(() => totalTasks.value - doneTasks.value)
</script>

<template>
  <main class="app">
    <h1>Task Counter</h1>

    <!-- Step 4: v-model on the input -->
    <form class="add-form" @submit.prevent="addTask">
      <input
        v-model="newTask"
        type="text"
        placeholder="What needs doing?"
        aria-label="New task"
      />
      <!-- Step 3: button calls addTask() on click -->
      <button type="submit">Add</button>
    </form>

    <!-- Step 6: display the counts -->
    <ul class="counts">
      <li>Total: <strong>{{ totalTasks }}</strong></li>
      <li>Done: <strong>{{ doneTasks }}</strong></li>
      <li>Pending: <strong>{{ pendingTasks }}</strong></li>
    </ul>

    <!-- Step 4: v-for to render the list -->
    <ul class="task-list">
      <li v-for="task in tasks" :key="task.id" :class="{ done: task.done }">
        <label>
          <input type="checkbox" v-model="task.done" />
          <span>{{ task.title }}</span>
        </label>
        <!-- Bonus: remove button per task -->
        <button class="remove" @click="removeTask(task.id)">✕</button>
      </li>
      <li v-if="tasks.length === 0" class="empty">No tasks yet — add one above.</li>
    </ul>
  </main>
</template>

<style scoped>
.app {
  max-width: 480px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: system-ui, sans-serif;
}

h1 {
  text-align: center;
}

.add-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.add-form input {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
}

.add-form button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.counts {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  list-style: none;
  padding: 0.75rem;
  margin: 0 0 1rem;
  background: rgba(127, 127, 127, 0.1);
  border-radius: 6px;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(127, 127, 127, 0.2);
}

.task-list label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.task-list li.done span {
  text-decoration: line-through;
  opacity: 0.6;
}

.task-list li.empty {
  justify-content: center;
  opacity: 0.6;
  border-bottom: none;
}

.remove {
  border: none;
  background: transparent;
  color: #e03131;
  font-size: 1rem;
  cursor: pointer;
}
</style>
