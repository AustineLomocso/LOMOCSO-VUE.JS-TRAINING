<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tasks"></ion-back-button>
        </ion-buttons>
        <ion-title>Task Detail</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div v-if="task" class="ion-padding">
        <ion-card>
          <ion-card-header>
            <div class="title-row">
              <ion-card-title :class="{ done: task.done }">{{ task.title }}</ion-card-title>
              <ion-badge :color="priorityColor(task.priority)">{{ task.priority }}</ion-badge>
            </div>
            <ion-card-subtitle>
              Task #{{ task.id }} · {{ task.done ? 'Completed' : 'In progress' }}
            </ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p class="description">{{ task.description || 'No description provided.' }}</p>
          </ion-card-content>
        </ion-card>

        <ion-img v-if="task.photo" :src="task.photo" class="task-photo" />

        <ion-button
          expand="block"
          class="ion-margin-top"
          :color="task.done ? 'medium' : 'success'"
          @click="store.toggleDone(task.id)"
        >
          <ion-icon slot="start" :icon="task.done ? arrowUndoOutline : checkmarkCircleOutline" />
          {{ task.done ? 'Mark as Open' : 'Mark as Complete' }}
        </ion-button>

        <ion-button expand="block" fill="outline" @click="capturePhoto">
          <ion-icon slot="start" :icon="cameraOutline" />
          {{ task.photo ? 'Replace Photo' : 'Add Photo' }}
        </ion-button>
      </div>

      <div v-else class="ion-padding">
        <p>Task not found.</p>
      </div>

      <camera-modal
        :is-open="showCamera"
        @captured="onCaptured"
        @close="showCamera = false"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonImg,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/vue';
import {
  cameraOutline,
  checkmarkCircleOutline,
  arrowUndoOutline,
} from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { useTasksStore, type Task } from '@/stores/tasks';
import CameraModal from '@/components/CameraModal.vue';

const route = useRoute();
const store = useTasksStore();

const taskId = computed(() => Number(route.params.id));
const task = computed(() => store.getById(taskId.value));
const showCamera = ref(false);

const priorityColor = (priority: Task['priority']) =>
  ({ high: 'danger', medium: 'warning', low: 'medium' })[priority];

const capturePhoto = async () => {
  // On a real device use the native camera; on the web open our getUserMedia modal.
  if (!Capacitor.isNativePlatform()) {
    showCamera.value = true;
    return;
  }

  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });
    if (photo.webPath) {
      store.addPhotoToTask(taskId.value, photo.webPath);
    }
  } catch (error) {
    console.warn('Photo capture cancelled or failed', error);
  }
};

const onCaptured = (dataUrl: string) => {
  store.addPhotoToTask(taskId.value, dataUrl);
  showCamera.value = false;
};
</script>

<style scoped>
.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.done {
  text-decoration: line-through;
  opacity: 0.6;
}

.description {
  margin: 0;
  color: var(--ion-color-medium-shade);
}

.task-photo {
  margin-top: 16px;
  border-radius: 12px;
  overflow: hidden;
}
</style>
