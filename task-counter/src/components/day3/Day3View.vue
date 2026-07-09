<!--
=============================================================
  DAY 3 — Vue Router
  Sub-navigation shell. The nested child routes (/day3/home,
  /day3/about, /day3/stats, /day3/task/:id) render in the
  <RouterView> below.
=============================================================
-->
<script setup>
// No logic needed — this is a layout shell for the Day 3 child routes.
</script>

<template>
  <div class="router-shell">
    <nav class="router-nav">
      <RouterLink to="/day3/home"><i class="fa-solid fa-house"></i> Home</RouterLink>
      <RouterLink to="/day3/about"><i class="fa-solid fa-circle-info"></i> About</RouterLink>
      <RouterLink to="/day3/stats"><i class="fa-solid fa-chart-simple"></i> Stats</RouterLink>
    </nav>
    <!-- page transition — matched child component fades in/out -->
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style scoped>
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

/* fade transition between routed child views */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
