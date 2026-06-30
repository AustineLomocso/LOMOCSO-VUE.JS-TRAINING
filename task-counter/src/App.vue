<script setup>
import { ref, computed } from 'vue'
import TaskListView from './components/TaskListView_day2.vue'

// TODO 1: Create a ref for the text input value (initial value: '')
const newTaskName = ref('')
const newTaskPriority = ref('Medium')
const filter = ref('all')

// TODO 2: Create a ref for the tasks array (initial value: [])
const tasks = ref([])

// TODO 3: Create computed() values for total, done, and pending counts
const totalCount  = computed(() => tasks.value.length)
const doneCount   = computed(() => tasks.value.filter(t => t.done).length)
const pendingCount = computed(() => tasks.value.filter(t => !t.done).length)

const visibleTasks = computed(() => {
  if(filter.value === 'done') return tasks.value.filter(t => t.done)
  if(filter.value === 'pending') return tasks.value.filter(t => !t.done)
  return tasks.value
})
// TODO 4: Write the addTask() function
// - Prevent empty tasks
// - Push a new task object to tasks.value: { id, name, done }
// - Clear the input
function addTask() {  
    const name = newTaskName.value.trim()
    if(!name) return
    tasks.value.push({
      id: Date.now(),
      name,
      done: false,
      priority: newTaskPriority.value,
    })
    newTaskName.value = ''
}

// TODO 5: Write toggleTask(id) — flip task.done for the matching task
function toggleTask(id) {
  const task = tasks.value.find(t=> t.id === id)
  if(task) task.done = !task.done
}

// TODO 6: Write removeTask(id) — filter out the task with this id
function removeTask(id) {
  tasks.value = tasks.value.filter(t => t.id !== id)

}

// Carousel state — switch between Day 1 and Day 2 views
const slides = ['Day 1 — Task Counter', 'Day 2 — Task Cards']
const currentSlide = ref(0)
function goToSlide(i) { currentSlide.value = i }
function nextSlide() { currentSlide.value = (currentSlide.value + 1) % slides.length }
function prevSlide() { currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length }
</script>

<template>
  <div class="carousel">
    <!-- Carousel navigation header -->
    <div class="carousel-nav">
      <button class="nav-arrow" @click="prevSlide" aria-label="Previous">‹</button>
      <div class="carousel-tabs">
        <button
          v-for="(label, i) in slides"
          :key="i"
          class="tab"
          :class="{ active: currentSlide === i }"
          @click="goToSlide(i)"
        >
          {{ label }}
        </button>
      </div>
      <button class="nav-arrow" @click="nextSlide" aria-label="Next">›</button>
    </div>

    <!-- Sliding track -->
    <div class="carousel-viewport">
      <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">

        <!-- ───── SLIDE 1: Day 1 — Task Counter ───── -->
        <div class="slide">
          <div class="app">
            <header class="app-header">
              <h1>Task Counter</h1>
              <p class="subtitle">Stay on top of what matters today</p>
            </header>

            <!-- TODO 7: Add an input with v-model, @keyup.enter, and placeholder -->
            <!-- TODO 8: Add an "Add Task" button with @click="addTask" -->
            <div class="input-row">
              <!-- your input and button here -->
              <input
                v-model="newTaskName"
                @keyup.enter="addTask"
                placeholder="Add a new task..."
              />
              <select v-model="newTaskPriority">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <button @click="addTask">+ Add</button>
            </div>

            <!-- TODO 9: Display the stats bar using your computed values -->
            <!-- Format: Total: X | Done: X | Pending: X -->
            <div class="stats">
              <div class="stat">
                <span class="stat-value">{{ totalCount }}</span>
                <span class="stat-label">Total</span>
              </div>
              <div class="stat stat--done">
                <span class="stat-value">{{ doneCount }}</span>
                <span class="stat-label">Done</span>
              </div>
              <div class="stat stat--pending">
                <span class="stat-value">{{ pendingCount }}</span>
                <span class="stat-label">Pending</span>
              </div>
            </div>

            <div class="filter-row">
              <button :class="{ active: filter === 'all' }" @click="filter = 'all'">All</button>
              <button :class="{ active: filter === 'done' }" @click="filter = 'done'">Done</button>
              <button :class="{ active: filter === 'pending' }" @click="filter = 'pending'">Pending</button>
            </div>

            <!-- TODO 10: Show this message only when the task list is empty -->
            <p v-if="tasks.length === 0" class="empty">No tasks yet. Add one above!</p>

            <!-- TODO 11: Render the task list using v-for -->
            <!-- Each item needs: checkbox (v-model), task name (:class done), remove button -->
            <ul class="task-list">
              <li v-for="task in visibleTasks" :key="task.id" :class="{ 'is-done': task.done }">
                <input type="checkbox" v-model="task.done" />
                <span class="task-name" :class="{ done: task.done }">
                  {{ task.name }}
                  <small class="priority" :class="'priority--' + task.priority.toLowerCase()">{{ task.priority }}</small>
                </span>
                <button @click="removeTask(task.id)">Remove</button>
              </li>
            </ul>
          </div>
        </div>

        <!-- ───── SLIDE 2: Day 2 — Task Cards ───── -->
        <div class="slide">
          <TaskListView />
        </div>

      </div>
    </div>

    <!-- Dot indicators -->
    <div class="carousel-dots">
      <button
        v-for="(label, i) in slides"
        :key="i"
        class="dot"
        :class="{ active: currentSlide === i }"
        @click="goToSlide(i)"
        :aria-label="label"
      ></button>
    </div>
  </div>
</template>

<style scoped>
/* ───── Carousel shell ───── */
.carousel {
  max-width: 560px;
  margin: 48px auto;
  font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
}

.carousel-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.nav-arrow {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 50%;
  font-size: 22px;
  line-height: 1;
  color: #1B2A4A;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(27, 42, 74, 0.06);
}
.nav-arrow:hover {
  background: #42B883;
  color: #fff;
  border-color: #42B883;
}

.carousel-tabs {
  flex: 1;
  display: flex;
  gap: 6px;
  background: #eef1f6;
  padding: 4px;
  border-radius: 12px;
}
.tab {
  flex: 1;
  padding: 8px 10px;
  border: none;
  background: transparent;
  border-radius: 9px;
  font-size: 12.5px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.tab.active {
  background: #fff;
  color: #1B2A4A;
  box-shadow: 0 1px 4px rgba(27, 42, 74, 0.12);
}

.carousel-viewport {
  overflow: hidden;
  border-radius: 18px;
}
.carousel-track {
  display: flex;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide {
  flex: 0 0 100%;
  min-width: 100%;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}
.dot {
  width: 9px;
  height: 9px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: #cbd5e1;
  cursor: pointer;
  transition: all 0.2s;
}
.dot.active {
  background: #42B883;
  width: 24px;
  border-radius: 999px;
}

.app {
  font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
  padding: 32px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 12px 40px rgba(27, 42, 74, 0.12);
  border: 1px solid #eef1f6;
}

.app-header {
  margin-bottom: 24px;
}

h1 {
  color: #1B2A4A;
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.subtitle {
  margin: 4px 0 0;
  color: #8a94a6;
  font-size: 14px;
}

.input-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.input-row input {
  flex: 1;
  padding: 11px 14px;
  border: 1px solid #dfe3ea;
  border-radius: 10px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-row input:focus {
  outline: none;
  border-color: #42B883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.15);
}

.input-row select {
  padding: 11px 12px;
  border: 1px solid #dfe3ea;
  border-radius: 10px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
}

.input-row button {
  padding: 11px 20px;
  background: #42B883;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  transition: background 0.2s, transform 0.05s;
}

.input-row button:hover { background: #369d6f; }
.input-row button:active { transform: scale(0.97); }

.stats {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 14px 8px;
  background: #f4f6fa;
  border-radius: 12px;
  border: 1px solid #eef1f6;
}

.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: #1B2A4A;
  line-height: 1;
}

.stat-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #8a94a6;
  font-weight: 600;
}

.stat--done { background: #ecfdf3; border-color: #c8f0d8; }
.stat--done .stat-value { color: #1f9d57; }
.stat--pending { background: #fff7ed; border-color: #fde4c8; }
.stat--pending .stat-value { color: #d97706; }

.empty {
  text-align: center;
  color: #aab2c0;
  font-style: italic;
  margin: 36px 0;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  background: white;
  border-radius: 12px;
  margin-bottom: 10px;
  border: 1px solid #eef1f6;
  transition: box-shadow 0.2s, transform 0.1s, opacity 0.2s;
}

.task-list li:hover {
  box-shadow: 0 4px 14px rgba(27, 42, 74, 0.08);
  transform: translateY(-1px);
}

.task-list li.is-done {
  background: #fafbfc;
  opacity: 0.75;
}

.task-list li input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #42B883;
  cursor: pointer;
}

.task-name {
  flex: 1;
  font-size: 14px;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 8px;
}

.priority {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  padding: 2px 8px;
  border-radius: 999px;
}

.priority--low { background: #eef2ff; color: #4f46e5; }
.priority--medium { background: #fff7ed; color: #d97706; }
.priority--high { background: #fef2f2; color: #dc2626; }

/* TODO: Apply this class to task names when task.done is true */
.done {
  text-decoration: line-through;
  color: #aab2c0;
}

.task-list li button {
  padding: 6px 12px;
  background: #fef2f2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.2s;
}

.task-list li button:hover { background: #fee2e2; }

.filter-row {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.filter-row button {
  padding: 7px 16px;
  border: 1px solid #dfe3ea;
  background: white;
  border-radius: 999px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  transition: all 0.2s;
}

.filter-row button:hover { border-color: #42B883; color: #42B883; }

.filter-row button.active {
  background: #42B883;
  color: white;
  border-color: #42B883;
}

.filter-row .clear {
  margin-left: auto;
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

</style>
