<!--
=============================================================
  DAY 4 — Pinia Store
  Login box backed by the Pinia userStore + the Pinia-backed
  task list (TaskListView).
=============================================================
-->
<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import TaskListView from './TaskListView.vue'
import { useUserStore } from '@/components/day4/userStore'

const userStore = useUserStore()
const { currentUser, isLoggedIn } = storeToRefs(userStore)
const { login, logout } = userStore
const loginName = ref('')

function handleLogin() {
  login(loginName.value.trim())
  loginName.value = ''
}
</script>

<template>
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
    <TaskListView />
  </div>
</template>

<style scoped>
.app {
  font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
  padding: 32px;
  background: var(--surface);
  border-radius: 18px;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-soft);
}

.app-header {
  margin-bottom: 24px;
}

.day4-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

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
</style>
