<!--
=============================================================
  DAY 3 — AboutView.vue
  Static info page reached via /about
=============================================================
-->
<script setup>
</script>

<template>
  <div class="about-view">
    <h1><i class="fa-solid fa-circle-info header-icon"></i> About</h1>
    <p>
      This is the Day 3 routing demo for the Vue.js training. It uses
      <strong>vue-router</strong> with dynamic routes, a navigation guard that
      protects the task detail page, query params for error handling, and
      programmatic navigation.
    </p>
    <ul>
      <li><code>/home</code> — task list</li>
      <li><code>/task/:id</code> — task detail (guarded)</li>
      <li><code>/about</code> — this page</li>
      <li><code>/stats</code> — task counts</li>
    </ul>
    <nav class="page-nav">
      <RouterLink to="/home"><i class="fa-solid fa-arrow-left"></i> Back to tasks</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.about-view { padding-top: 20px; }
h1 { color: var(--text-strong); margin: 0 0 16px; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
.header-icon { color: var(--primary); font-size: 19px; margin-right: 4px; }
p { color: var(--text-body); font-size: 15px; line-height: 1.6; margin: 0 0 12px; }
ul { color: var(--text-body); font-size: 14px; line-height: 2; margin: 0; padding-left: 20px; }
code { background: var(--surface-soft); border: 1px solid var(--border-soft); padding: 1px 7px; border-radius: 6px; color: var(--text-strong); font-size: 13px; }
.page-nav { margin-top: 20px; }
.page-nav a { color: var(--primary); text-decoration: none; font-weight: 600; font-size: 14px; }
.page-nav a i { margin-right: 4px; }
.page-nav a:hover { text-decoration: underline; }
</style>
