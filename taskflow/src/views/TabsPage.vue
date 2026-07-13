<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tasks" href="/tabs/tasks">
          <ion-icon aria-hidden="true" :icon="listOutline" />
          <ion-label>Tasks</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="completed" href="/tabs/completed">
          <ion-icon aria-hidden="true" :icon="checkmarkCircle" />
          <ion-label>Completed</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="settings" href="/tabs/settings">
          <ion-icon aria-hidden="true" :icon="settingsOutline" />
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { listOutline, checkmarkCircle, settingsOutline } from 'ionicons/icons';
</script>
