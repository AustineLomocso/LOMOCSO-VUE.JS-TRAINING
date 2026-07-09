<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

// Day navigation — each entry is a top-level route rendered in <RouterView>
const days = [
  { to: '/day1', label: 'Day 1', title: 'Day 1 — Task Counter', icon: 'fa-solid fa-list-check' },
  { to: '/day2', label: 'Day 2', title: 'Day 2 — Task Cards',   icon: 'fa-solid fa-layer-group' },
  { to: '/day3', label: 'Day 3', title: 'Day 3 — Routing',      icon: 'fa-solid fa-route' },
  { to: '/day4', label: 'Day 4', title: 'Day 4 — Pinia Store',  icon: 'fa-solid fa-database' },
  { to: '/day5', label: 'Day 5', title: 'Day 5 — API Fetch',    icon: 'fa-solid fa-cloud-arrow-down' },
]

const route = useRoute()

// Which day are we on? (match by path prefix so /day3/home still highlights Day 3)
const activeIndex = computed(() =>
  days.findIndex(d => route.path.startsWith(d.to))
)
const activeDay = computed(() => days[activeIndex.value] ?? days[0])
</script>

<template>
  <div class="shell">
    <!-- App brand header -->
    <header class="brand">
      <span class="brand-logo"><i class="fa-brands fa-vuejs"></i></span>
      <div>
        <p class="brand-title">Vue.js Training</p>
        <p class="brand-sub">
          <i :class="activeDay.icon"></i>
          {{ activeDay.title }}
        </p>
      </div>
      <span class="brand-day">{{ (activeIndex < 0 ? 0 : activeIndex) + 1 }} / {{ days.length }}</span>
    </header>

    <!-- Day navigation -->
    <nav class="day-nav">
      <RouterLink
        v-for="day in days"
        :key="day.to"
        :to="day.to"
        class="tab"
        :title="day.title"
      >
        <i :class="day.icon"></i>
        <span>{{ day.label }}</span>
      </RouterLink>
    </nav>

    <!-- Routed day view -->
    <div class="day-viewport">
      <RouterView v-slot="{ Component }">
        <Transition name="slide-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style scoped>
/* ───── App shell ───── */
.shell {
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

/* ───── Day navigation ───── */
.day-nav {
  display: flex;
  gap: 6px;
  background: var(--surface-soft);
  border: 1px solid var(--border-soft);
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 16px;
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
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.tab i { font-size: 12px; }
.tab:hover { color: var(--primary); }
.tab.router-link-active {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 1px 4px rgba(56, 74, 54, 0.2);
}

.day-viewport {
  border-radius: 18px;
}

/* ───── View transition ───── */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
