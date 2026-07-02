<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import TaskListView from './components/TaskListView_day2.vue'
import TaskStoreView from './components/day-4-assignment/TaskListView.vue'
import { useUserStore } from '@/components/day-4-assignment/userStore'

const userStore = useUserStore()
const { currentUser, isLoggedIn } = storeToRefs(userStore)
const { login, logout } = userStore
const loginName = ref('')

function handleLogin() {
  login(loginName.value.trim())
  loginName.value = ''
}

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

function clearDone() {
  tasks.value = tasks.value.filter(t => !t.done)
}

// Carousel state — switch between Day 1, Day 2 and Day 3 views
const slides = ['Day 1 — Task Counter', 'Day 2 — Task Cards', 'Day 3 — Routing', 'Day 4 — Pinia Store']
const currentSlide = ref(0)
function goToSlide(i) { currentSlide.value = i }
function nextSlide() { currentSlide.value = (currentSlide.value + 1) % slides.length }
function prevSlide() { currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length }

// Keyboard navigation — arrow keys switch slides, unless the user is typing
function handleKeydown(e) {
  const tag = e.target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
  if (e.key === 'ArrowRight') nextSlide()
  if (e.key === 'ArrowLeft') prevSlide()
}
onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="carousel">
    <!-- App brand header -->
    <header class="brand">
      <span class="brand-logo">V</span>
      <div>
        <p class="brand-title">Vue.js Training</p>
        <p class="brand-sub">{{ slides[currentSlide] }}</p>
      </div>
      <span class="brand-day">{{ currentSlide + 1 }} / {{ slides.length }}</span>
    </header>

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
              <button v-if="doneCount > 0" class="clear" @click="clearDone">Clear done</button>
            </div>

            <!-- TODO 10: Show this message only when the task list is empty -->
            <p v-if="tasks.length === 0" class="empty">No tasks yet. Add one above!</p>

            <!-- TODO 11: Render the task list using v-for -->
            <!-- Each item needs: checkbox (v-model), task name (:class done), remove button -->
            <TransitionGroup tag="ul" name="list" class="task-list">
              <li v-for="task in visibleTasks" :key="task.id" :class="{ 'is-done': task.done }">
                <input type="checkbox" v-model="task.done" />
                <span class="task-name" :class="{ done: task.done }">
                  {{ task.name }}
                  <small class="priority" :class="'priority--' + task.priority.toLowerCase()">{{ task.priority }}</small>
                </span>
                <button @click="removeTask(task.id)">Remove</button>
              </li>
            </TransitionGroup>
          </div>
        </div>

        <!-- ───── SLIDE 2: Day 2 — Task Cards ───── -->
        <div class="slide">
          <TaskListView />
        </div>

        <!-- ───── SLIDE 3: Day 3 — Vue Router ───── -->
        <div class="slide">
          <div class="router-shell">
            <nav class="router-nav">
              <RouterLink to="/home">Home</RouterLink>
              <RouterLink to="/about">About</RouterLink>
              <RouterLink to="/stats">Stats</RouterLink>
            </nav>
            <!-- EXTENSION: page transition — matched component fades in/out -->
            <RouterView v-slot="{ Component }">
              <Transition name="fade" mode="out-in">
                <component :is="Component" />
              </Transition>
            </RouterView>
          </div>
        </div>

        <!-- ───── SLIDE 4: Day 4 — Pinia Store ───── -->
        <div class="slide">
          <div class="app">
            <header class="app-header day4-header">
              <div>
                <h1>Pinia Store</h1>
                <p class="subtitle">Centralized state with Pinia</p>
              </div>
              <div class="user-box">
                <span v-if="isLoggedIn" class="user-greeting">👤 {{ currentUser }}</span>
                <button v-if="isLoggedIn" class="user-btn" @click="logout">Logout</button>
                <template v-else>
                  <input
                    v-model="loginName"
                    class="user-input"
                    placeholder="Your name..."
                    @keyup.enter="handleLogin"
                  />
                  <button class="user-btn" @click="handleLogin">Login</button>
                </template>
              </div>
            </header>
            <TaskStoreView />
          </div>
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
  max-width: 620px;
  margin: 32px auto 48px;
  font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
}

/* ───── Brand header ───── */
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 0 4px;
}
.brand-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #42B883, #2f9d6e);
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.35);
}
.brand-title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #1B2A4A;
  letter-spacing: -0.3px;
  line-height: 1.2;
}
.brand-sub {
  margin: 0;
  font-size: 12px;
  color: #8a94a6;
  font-weight: 600;
}
.brand-day {
  margin-left: auto;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 4px 12px;
  box-shadow: 0 1px 3px rgba(27, 42, 74, 0.06);
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

/* ───── Day 3 router slide ───── */
.router-shell {
  font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
  padding: 24px 32px 32px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 12px 40px rgba(27, 42, 74, 0.12);
  border: 1px solid #eef1f6;
  min-height: 360px;
}
.router-nav {
  display: flex;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eef1f6;
}
.router-nav a {
  padding: 7px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  text-decoration: none;
  transition: all 0.2s;
}
.router-nav a:hover { color: #42B883; }
.router-nav a.router-link-active {
  background: #42B883;
  color: #fff;
}

/* EXTENSION: fade transition between routed views */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.app-header {
  margin-bottom: 24px;
}

.day4-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.user-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-greeting {
  font-size: 13px;
  font-weight: 700;
  color: #1B2A4A;
}

.user-input {
  padding: 8px 12px;
  border: 1px solid #dfe3ea;
  border-radius: 10px;
  font-size: 13px;
  width: 130px;
}

.user-input:focus {
  outline: none;
  border-color: #42B883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.15);
}

.user-btn {
  padding: 8px 14px;
  background: #42B883;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
  transition: background 0.2s;
}

.user-btn:hover { background: #369d6f; }

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
.filter-row .clear:hover {
  background: #fee2e2;
  color: #b91c1c;
  border-color: #fca5a5;
}

/* ───── Task list enter/leave/move animations ───── */
.list-enter-active,
.list-leave-active {
  transition: all 0.25s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
.list-leave-active {
  position: absolute;
  width: 100%;
}
.list-move {
  transition: transform 0.25s ease;
}
.task-list {
  position: relative;
}

</style>
