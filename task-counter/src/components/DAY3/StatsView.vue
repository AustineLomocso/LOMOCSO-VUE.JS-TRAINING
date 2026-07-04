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
    <h1><i class="fa-solid fa-chart-simple header-icon"></i> Stats</h1>

    <div class="stats">
      <div class="stat">
        <span class="stat-value">{{ total }}</span>
        <span class="stat-label"><i class="fa-solid fa-list"></i> Total</span>
      </div>
      <div class="stat stat--done">
        <span class="stat-value">{{ done }}</span>
        <span class="stat-label"><i class="fa-solid fa-circle-check"></i> Done</span>
      </div>
      <div class="stat stat--pending">
        <span class="stat-value">{{ pending }}</span>
        <span class="stat-label"><i class="fa-regular fa-clock"></i> Pending</span>
      </div>
    </div>

    <nav class="page-nav">
      <RouterLink to="/home"><i class="fa-solid fa-arrow-left"></i> Back to tasks</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.stats-view { padding-top: 20px; }
h1 { color: var(--text-strong); margin: 0 0 20px; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
.header-icon { color: var(--primary); font-size: 19px; margin-right: 4px; }
.stats { display: flex; gap: 12px; margin-bottom: 20px; }
.stat { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 18px 8px; background: var(--surface-soft); border-radius: 12px; border: 1px solid var(--border-soft); }
.stat-value { font-size: 28px; font-weight: 800; color: var(--text-strong); line-height: 1; }
.stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: var(--text-muted); font-weight: 600; }
.stat-label i { margin-right: 3px; }
.stat--done { background: var(--primary-soft); border-color: var(--primary-soft-border); }
.stat--done .stat-value { color: var(--primary); }
.stat--pending { background: var(--warn-soft); border-color: var(--warn-soft-border); }
.stat--pending .stat-value { color: var(--warn); }
.page-nav a { color: var(--primary); text-decoration: none; font-weight: 600; font-size: 14px; }
.page-nav a i { margin-right: 4px; }
.page-nav a:hover { text-decoration: underline; }
</style>
