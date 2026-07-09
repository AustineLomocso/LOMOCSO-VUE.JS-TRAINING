<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import TaskListView from './components/TaskListView_day2.vue'
import TaskStoreView from './components/day-4-assignment/TaskListView.vue'
import TodoListView from './components/day5/TodoListView.vue'
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

// Carousel state — switch between Day 1 through Day 5 views
const slides = [
  { label: 'Day 1', title: 'Day 1 — Task Counter', icon: 'fa-solid fa-list-check' },
  { label: 'Day 2', title: 'Day 2 — Task Cards',   icon: 'fa-solid fa-layer-group' },
  { label: 'Day 3', title: 'Day 3 — Routing',      icon: 'fa-solid fa-route' },
  { label: 'Day 4', title: 'Day 4 — Pinia Store',  icon: 'fa-solid fa-database' },
  { label: 'Day 5', title: 'Day 5 — API Fetch',    icon: 'fa-solid fa-cloud-arrow-down' },
]
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
      <span class="brand-logo"><i class="fa-brands fa-vuejs"></i></span>
      <div>
        <p class="brand-title">Vue.js Training</p>
        <p class="brand-sub">
          <i :class="slides[currentSlide].icon"></i>
          {{ slides[currentSlide].title }}
        </p>
      </div>
      <span class="brand-day">{{ currentSlide + 1 }} / {{ slides.length }}</span>
    </header>

    <!-- Carousel navigation header -->
    <div class="carousel-nav">
      <button class="nav-arrow" @click="prevSlide" aria-label="Previous">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <div class="carousel-tabs">
        <button
          v-for="(slide, i) in slides"
          :key="i"
          class="tab"
          :class="{ active: currentSlide === i }"
          :title="slide.title"
          @click="goToSlide(i)"
        >
          <i :class="slide.icon"></i>
          <span>{{ slide.label }}</span>
        </button>
      </div>
      <button class="nav-arrow" @click="nextSlide" aria-label="Next">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>

    <!-- Sliding track -->
    <div class="carousel-viewport">
      <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">

        <!-- ───── SLIDE 1: Day 1 — Task Counter ───── -->
        <div class="slide">
          <div class="app">
            <header class="app-header">
              <h1><i class="fa-solid fa-list-check header-icon"></i> Task Counter</h1>
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
              <button @click="addTask"><i class="fa-solid fa-plus"></i> Add</button>
            </div>

            <!-- TODO 9: Display the stats bar using your computed values -->
            <!-- Format: Total: X | Done: X | Pending: X -->
            <div class="stats">
              <div class="stat">
                <span class="stat-value">{{ totalCount }}</span>
                <span class="stat-label"><i class="fa-solid fa-list"></i> Total</span>
              </div>
              <div class="stat stat--done">
                <span class="stat-value">{{ doneCount }}</span>
                <span class="stat-label"><i class="fa-solid fa-circle-check"></i> Done</span>
              </div>
              <div class="stat stat--pending">
                <span class="stat-value">{{ pendingCount }}</span>
                <span class="stat-label"><i class="fa-regular fa-clock"></i> Pending</span>
              </div>
            </div>

            <div class="filter-row">
              <button :class="{ active: filter === 'all' }" @click="filter = 'all'">
                <i class="fa-solid fa-list"></i> All
              </button>
              <button :class="{ active: filter === 'done' }" @click="filter = 'done'">
                <i class="fa-solid fa-circle-check"></i> Done
              </button>
              <button :class="{ active: filter === 'pending' }" @click="filter = 'pending'">
                <i class="fa-regular fa-clock"></i> Pending
              </button>
              <button v-if="doneCount > 0" class="clear" @click="clearDone">
                <i class="fa-solid fa-broom"></i> Clear done
              </button>
            </div>

            <!-- TODO 10: Show this message only when the task list is empty -->
            <p v-if="tasks.length === 0" class="empty">
              <i class="fa-regular fa-clipboard"></i> No tasks yet. Add one above!
            </p>

            <!-- TODO 11: Render the task list using v-for -->
            <!-- Each item needs: checkbox (v-model), task name (:class done), remove button -->
            <TransitionGroup tag="ul" name="list" class="task-list">
              <li v-for="task in visibleTasks" :key="task.id" :class="{ 'is-done': task.done }">
                <input type="checkbox" v-model="task.done" />
                <span class="task-name" :class="{ done: task.done }">
                  {{ task.name }}
                  <small class="priority" :class="'priority--' + task.priority.toLowerCase()">{{ task.priority }}</small>
                </span>
                <button @click="removeTask(task.id)">
                  <i class="fa-solid fa-trash-can"></i> Remove
                </button>
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
              <RouterLink to="/home"><i class="fa-solid fa-house"></i> Home</RouterLink>
              <RouterLink to="/about"><i class="fa-solid fa-circle-info"></i> About</RouterLink>
              <RouterLink to="/stats"><i class="fa-solid fa-chart-simple"></i> Stats</RouterLink>
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
                <h1><i class="fa-solid fa-database header-icon"></i> Pinia Store</h1>
                <p class="subtitle">Centralized state with Pinia</p>
              </div>
              <div class="user-box">
                <span v-if="isLoggedIn" class="user-greeting">
                  <i class="fa-solid fa-circle-user"></i> {{ currentUser }}
                </span>
                <button v-if="isLoggedIn" class="user-btn" @click="logout">
                  <i class="fa-solid fa-right-from-bracket"></i> Logout
                </button>
                <template v-else>
                  <input
                    v-model="loginName"
                    class="user-input"
                    placeholder="Your name..."
                    @keyup.enter="handleLogin"
                  />
                  <button class="user-btn" @click="handleLogin">
                    <i class="fa-solid fa-right-to-bracket"></i> Login
                  </button>
                </template>
              </div>
            </header>
            <TaskStoreView />
          </div>
        </div>

        <!-- ───── SLIDE 5: Day 5 — API Fetch ───── -->
        <div class="slide">
          <div class="app">
            <TodoListView />
          </div>
        </div>

      </div>
    </div>

    <!-- Dot indicators -->
    <div class="carousel-dots">
      <button
        v-for="(slide, i) in slides"
        :key="i"
        class="dot"
        :class="{ active: currentSlide === i }"
        @click="goToSlide(i)"
        :aria-label="slide.title"
      ></button>
    </div>
  </div>
</template>

<style scoped>
/* ───── Carousel shell ───── */
.carousel {
  max-width: 640px;
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
  background: linear-gradient(135deg, var(--primary), var(--primary-hover));
  color: #fff;
  font-size: 22px;
  box-shadow: 0 4px 12px rgba(60, 107, 80, 0.35);
}
.brand-title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: var(--text-strong);
  letter-spacing: -0.3px;
  line-height: 1.2;
}
.brand-sub {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
}
.brand-sub i {
  color: var(--primary);
  margin-right: 3px;
}
.brand-day {
  margin-left: auto;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-body);
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  padding: 4px 12px;
  box-shadow: var(--shadow-soft);
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
  border: 1px solid var(--border-soft);
  background: var(--surface);
  border-radius: 50%;
  font-size: 14px;
  line-height: 1;
  color: var(--text-strong);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--shadow-soft);
}
.nav-arrow:hover {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.carousel-tabs {
  flex: 1;
  display: flex;
  gap: 6px;
  background: var(--surface-soft);
  border: 1px solid var(--border-soft);
  padding: 4px;
  border-radius: 12px;
}
.tab {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 10px;
  border: none;
  background: transparent;
  border-radius: 9px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-body);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.tab i { font-size: 12px; }
.tab.active {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 1px 4px rgba(56, 74, 54, 0.2);
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
  background: var(--primary-soft-border);
  cursor: pointer;
  transition: all 0.2s;
}
.dot.active {
  background: var(--primary);
  width: 24px;
  border-radius: 999px;
}

.app {
  font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
  padding: 32px;
  background: var(--surface);
  border-radius: 18px;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-soft);
}

/* ───── Day 3 router slide ───── */
.router-shell {
  font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
  padding: 24px 32px 32px;
  background: var(--surface);
  border-radius: 18px;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-soft);
  min-height: 360px;
}
.router-nav {
  display: flex;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-soft);
}
.router-nav a {
  padding: 7px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-body);
  text-decoration: none;
  transition: all 0.2s;
}
.router-nav a i { margin-right: 5px; }
.router-nav a:hover { color: var(--primary); }
.router-nav a.router-link-active {
  background: var(--primary);
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
  color: var(--text-strong);
}
.user-greeting i { color: var(--primary); margin-right: 4px; }

.user-input {
  padding: 8px 12px;
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  font-size: 13px;
  width: 130px;
  background: var(--surface);
  color: var(--text-strong);
}

.user-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(60, 107, 80, 0.15);
}

.user-btn {
  padding: 8px 14px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
  transition: background 0.2s;
}
.user-btn i { margin-right: 5px; }
.user-btn:hover { background: var(--primary-hover); }

h1 {
  color: var(--text-strong);
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
}
.header-icon {
  color: var(--primary);
  font-size: 22px;
  margin-right: 4px;
}

.subtitle {
  margin: 4px 0 0;
  color: var(--text-muted);
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
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  font-size: 14px;
  background: var(--surface);
  color: var(--text-strong);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-row input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(60, 107, 80, 0.15);
}

.input-row select {
  padding: 11px 12px;
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  font-size: 14px;
  background: var(--surface);
  color: var(--text-strong);
  cursor: pointer;
}

.input-row button {
  padding: 11px 20px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  transition: background 0.2s, transform 0.05s;
}
.input-row button i { margin-right: 5px; }

.input-row button:hover { background: var(--primary-hover); }
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
  background: var(--surface-soft);
  border-radius: 12px;
  border: 1px solid var(--border-soft);
}

.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-strong);
  line-height: 1;
}

.stat-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--text-muted);
  font-weight: 600;
}
.stat-label i { margin-right: 3px; }

.stat--done { background: var(--primary-soft); border-color: var(--primary-soft-border); }
.stat--done .stat-value { color: var(--primary); }
.stat--pending { background: var(--warn-soft); border-color: var(--warn-soft-border); }
.stat--pending .stat-value { color: var(--warn); }

.empty {
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
  margin: 36px 0;
}
.empty i { margin-right: 6px; }

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
  background: var(--surface);
  border-radius: 12px;
  margin-bottom: 10px;
  border: 1px solid var(--border-soft);
  transition: box-shadow 0.2s, transform 0.1s, opacity 0.2s;
}

.task-list li:hover {
  box-shadow: 0 4px 14px rgba(56, 74, 54, 0.1);
  transform: translateY(-1px);
}

.task-list li.is-done {
  background: var(--primary-soft);
  border-color: var(--primary-soft-border);
  opacity: 0.8;
}

.task-list li input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
  cursor: pointer;
}

.task-name {
  flex: 1;
  font-size: 14px;
  color: var(--text-body);
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

.priority--low { background: var(--primary-soft); color: var(--primary-hover); }
.priority--medium { background: var(--warn-soft); color: var(--warn); }
.priority--high { background: var(--danger-soft); color: var(--danger); }

/* TODO: Apply this class to task names when task.done is true */
.done {
  text-decoration: line-through;
  color: var(--text-muted);
}

.task-list li button {
  padding: 6px 12px;
  background: var(--danger-soft);
  color: var(--danger);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.2s;
}
.task-list li button i { margin-right: 4px; }

.task-list li button:hover { background: var(--danger-soft-border); }

.filter-row {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.filter-row button {
  padding: 7px 16px;
  border: 1px solid var(--border-soft);
  background: var(--surface);
  border-radius: 999px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-body);
  transition: all 0.2s;
}
.filter-row button i { margin-right: 4px; }

.filter-row button:hover { border-color: var(--primary); color: var(--primary); }

.filter-row button.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.filter-row .clear {
  margin-left: auto;
  background: var(--danger-soft);
  color: var(--danger);
  border-color: var(--danger-soft-border);
}
.filter-row .clear:hover {
  background: var(--danger-soft-border);
  color: var(--danger);
  border-color: var(--danger);
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
