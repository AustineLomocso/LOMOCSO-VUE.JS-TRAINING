<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Settings</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Appearance -->
      <ion-list :inset="true">
        <ion-list-header>Appearance</ion-list-header>
        <ion-item lines="none">
          <ion-label>Theme</ion-label>
        </ion-item>
        <ion-item lines="none">
          <ion-segment :value="preference" @ion-change="onThemeChange">
            <ion-segment-button value="light">
              <ion-icon :icon="sunnyOutline" aria-hidden="true" />
              <ion-label>Light</ion-label>
            </ion-segment-button>
            <ion-segment-button value="dark">
              <ion-icon :icon="moonOutline" aria-hidden="true" />
              <ion-label>Dark</ion-label>
            </ion-segment-button>
            <ion-segment-button value="system">
              <ion-icon :icon="phonePortraitOutline" aria-hidden="true" />
              <ion-label>System</ion-label>
            </ion-segment-button>
          </ion-segment>
        </ion-item>
      </ion-list>

      <!-- Progress -->
      <ion-list :inset="true">
        <ion-list-header>Progress</ion-list-header>
        <ion-item lines="none">
          <ion-label>
            <h2>{{ stats.completed }} of {{ stats.total }} completed</h2>
            <ion-progress-bar :value="stats.pct / 100" class="progress" />
          </ion-label>
          <ion-note slot="end" class="pct">{{ stats.pct }}%</ion-note>
        </ion-item>
      </ion-list>

      <!-- Breakdown -->
      <ion-list :inset="true">
        <ion-list-header>Overview</ion-list-header>
        <ion-item>
          <ion-icon slot="start" :icon="listOutline" color="primary" aria-hidden="true" />
          <ion-label>Total tasks</ion-label>
          <ion-note slot="end">{{ stats.total }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" :icon="hourglassOutline" color="warning" aria-hidden="true" />
          <ion-label>Pending</ion-label>
          <ion-note slot="end">{{ stats.pending }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" :icon="checkmarkCircleOutline" color="success" aria-hidden="true" />
          <ion-label>Completed</ion-label>
          <ion-note slot="end">{{ stats.completed }}</ion-note>
        </ion-item>
        <ion-item v-if="stats.overdue">
          <ion-icon slot="start" :icon="alertCircleOutline" color="danger" aria-hidden="true" />
          <ion-label>Overdue</ion-label>
          <ion-note slot="end" color="danger">{{ stats.overdue }}</ion-note>
        </ion-item>
      </ion-list>

      <!-- By priority -->
      <ion-list :inset="true">
        <ion-list-header>By priority</ion-list-header>
        <ion-item>
          <ion-badge slot="start" color="danger">High</ion-badge>
          <ion-note slot="end">{{ stats.byPriority.high }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-badge slot="start" color="warning">Medium</ion-badge>
          <ion-note slot="end">{{ stats.byPriority.medium }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-badge slot="start" color="medium">Low</ion-badge>
          <ion-note slot="end">{{ stats.byPriority.low }}</ion-note>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonNote,
  IonIcon,
  IonBadge,
  IonProgressBar,
  IonSegment,
  IonSegmentButton,
} from '@ionic/vue';
import {
  sunnyOutline,
  moonOutline,
  phonePortraitOutline,
  listOutline,
  hourglassOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
} from 'ionicons/icons';
import { useTasksStore } from '@/stores/tasks';
import { useTheme, type ThemePreference } from '@/composables/useTheme';

const store = useTasksStore();
const { preference, setTheme } = useTheme();

const stats = computed(() => store.stats);

const onThemeChange = (event: CustomEvent) => {
  const value = (event.detail as { value?: string }).value;
  if (value === 'light' || value === 'dark' || value === 'system') {
    setTheme(value as ThemePreference);
  }
};
</script>

<style scoped>
.progress {
  margin-top: 8px;
}

.pct {
  font-size: 18px;
  font-weight: 600;
}
</style>
