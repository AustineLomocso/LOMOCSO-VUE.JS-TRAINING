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

      <ion-list>
        <ion-item>
          <ion-label>Total tasks</ion-label>
          <ion-note slot="end">{{ store.tasks.length }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Completed</ion-label>
          <ion-note slot="end">{{ store.completedTasks.length }}</ion-note>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
} from '@ionic/vue';
import { useTasksStore } from '@/stores/tasks';

const store = useTasksStore();
</script>
