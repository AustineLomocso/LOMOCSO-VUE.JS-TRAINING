<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tasks"></ion-back-button>
        </ion-buttons>
        <ion-title>Task Detail</ion-title>
        <ion-buttons slot="end">
          <ion-button v-if="task" aria-label="Edit task" @click="showEdit = true">
            <ion-icon slot="icon-only" :icon="createOutline" />
          </ion-button>
          <ion-button v-if="task" aria-label="Delete task" color="danger" @click="onDelete">
            <ion-icon slot="icon-only" :icon="trashOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div v-if="task" class="ion-padding">
        <ion-card>
          <ion-card-header>
            <div class="title-row">
              <ion-card-title :class="{ done: task.done }">{{ task.title }}</ion-card-title>
              <ion-badge :color="priorityColor(task.priority)">
                {{ priorityLabel(task.priority) }}
              </ion-badge>
            </div>
            <ion-card-subtitle>
              Task #{{ task.id }} · {{ task.done ? 'Completed' : 'In progress' }}
            </ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <div class="chips">
              <ion-chip v-if="task.category" outline>
                <ion-icon :icon="pricetagOutline" aria-hidden="true" />
                <ion-label>{{ task.category }}</ion-label>
              </ion-chip>
              <ion-chip
                v-if="task.dueDate"
                :color="isOverdue(task.dueDate, task.done) ? 'danger' : undefined"
                :outline="!isOverdue(task.dueDate, task.done)"
              >
                <ion-icon
                  :icon="isOverdue(task.dueDate, task.done) ? alertCircleOutline : calendarOutline"
                  aria-hidden="true"
                />
                <ion-label>
                  {{ isOverdue(task.dueDate, task.done) ? 'Overdue · ' : 'Due ' }}{{ formatDate(task.dueDate) }}
                </ion-label>
              </ion-chip>
            </div>

            <p class="description">{{ task.description || 'No description provided.' }}</p>

            <p class="timestamps">
              <span v-if="task.createdAt">Created {{ formatRelative(task.createdAt) }}</span>
              <span v-if="task.updatedAt"> · Updated {{ formatRelative(task.updatedAt) }}</span>
            </p>
          </ion-card-content>
        </ion-card>

        <ion-img
          v-if="task.photo"
          :src="task.photo"
          :alt="`Photo for ${task.title}`"
          class="task-photo"
        />

        <ion-button
          expand="block"
          class="ion-margin-top"
          :color="task.done ? 'medium' : 'success'"
          @click="onToggle"
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

      <task-form-modal
        :is-open="showEdit"
        :task="task"
        @submit="onEditSubmit"
        @close="showEdit = false"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
  IonChip,
  IonLabel,
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
  createOutline,
  trashOutline,
  calendarOutline,
  alertCircleOutline,
  pricetagOutline,
} from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { useTasksStore, type Task } from '@/stores/tasks';
import { usePriority } from '@/composables/usePriority';
import { useHaptics } from '@/composables/useHaptics';
import { useReminders } from '@/composables/useReminders';
import { useTaskActions } from '@/composables/useTaskActions';
import { formatDate, formatRelative, isOverdue } from '@/utils/date';
import CameraModal from '@/components/CameraModal.vue';
import TaskFormModal, { type TaskFormPayload } from '@/components/TaskFormModal.vue';

const route = useRoute();
const router = useRouter();
const store = useTasksStore();
const { priorityColor, priorityLabel } = usePriority();
const haptics = useHaptics();
const reminders = useReminders();
const { deleteWithUndo } = useTaskActions();

const taskId = computed(() => Number(route.params.id));
const task = computed(() => store.getById(taskId.value));
const showCamera = ref(false);
const showEdit = ref(false);

const onToggle = () => {
  store.toggleDone(taskId.value);
  haptics.light();
  const updated = store.getById(taskId.value);
  if (updated) reminders.sync(updated);
};

const onEditSubmit = (payload: TaskFormPayload) => {
  store.updateTask({
    id: taskId.value,
    title: payload.title,
    description: payload.description,
    priority: payload.priority,
    dueDate: payload.dueDate,
    category: payload.category,
  });
  const updated = store.getById(taskId.value);
  if (updated) reminders.sync(updated);
  showEdit.value = false;
};

const onDelete = async () => {
  const current = task.value;
  if (!current) return;
  const snapshot: Task = { ...current };
  router.back();
  await deleteWithUndo(snapshot);
};

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

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.description {
  margin: 0;
  color: var(--ion-color-medium-shade);
}

.timestamps {
  margin: 12px 0 0;
  font-size: 12px;
  color: var(--ion-color-medium);
}

.task-photo {
  margin-top: 16px;
  border-radius: 12px;
  overflow: hidden;
}
</style>
