<!--
=============================================================
  DAY 3 — StatsView.vue  (EXTENSION)
  Shows total / done / pending counts reached via /stats
=============================================================
-->
<script setup>
import { computed } from 'vue'
import { useTaskStore } from '@/components/DAY3/taskStore'

const taskStore = useTaskStore()

const total   = computed(() => taskStore.tasks.length)
const done    = computed(() => taskStore.tasks.filter(t => t.done).length)
const pending = computed(() => taskStore.tasks.filter(t => !t.done).length)
</script>

<template>
  <div class="stats-view">
    <h1>📊 Stats</h1>

    <div class="stats">
      <div class="stat">
        <span class="stat-value">{{ total }}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat stat--done">
        <span class="stat-value">{{ done }}</span>
        <span class="stat-label">Done</span>
      </div>
      <div class="stat stat--pending">
        <span class="stat-value">{{ pending }}</span>
        <span class="stat-label">Pending</span>
      </div>
    </div>

    <nav class="page-nav">
      <RouterLink to="/home">← Back to tasks</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.stats-view { max-width: 520px; margin: 40px auto; padding: 24px; font-family: Arial, sans-serif; }
h1 { color: #1B2A4A; margin-bottom: 20px; }
.stats { display: flex; gap: 12px; margin-bottom: 20px; }
.stat { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 18px 8px; background: #f4f6fa; border-radius: 12px; border: 1px solid #eef1f6; }
.stat-value { font-size: 28px; font-weight: 800; color: #1B2A4A; line-height: 1; }
.stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: #8a94a6; font-weight: 600; }
.stat--done { background: #ecfdf3; border-color: #c8f0d8; }
.stat--done .stat-value { color: #1f9d57; }
.stat--pending { background: #fff7ed; border-color: #fde4c8; }
.stat--pending .stat-value { color: #d97706; }
.page-nav a { color: #42B883; text-decoration: none; font-weight: 600; }
</style>
