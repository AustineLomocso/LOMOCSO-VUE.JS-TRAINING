<template>
  <ion-modal :is-open="isOpen" @didDismiss="handleDismiss" @willPresent="syncFromTask">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ isEditing ? 'Edit Task' : 'New Task' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="cancel">Cancel</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-input
            label="Title"
            label-placement="stacked"
            placeholder="What needs doing?"
            v-model="title"
          />
        </ion-item>
        <ion-item>
          <ion-textarea
            label="Description"
            label-placement="stacked"
            placeholder="Add a few details"
            :auto-grow="true"
            v-model="description"
          />
        </ion-item>
        <ion-item>
          <ion-select
            label="Priority"
            label-placement="stacked"
            v-model="priority"
            interface="popover"
          >
            <ion-select-option value="low">Low</ion-select-option>
            <ion-select-option value="medium">Medium</ion-select-option>
            <ion-select-option value="high">High</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-select
            label="Category"
            label-placement="stacked"
            v-model="category"
            interface="popover"
            placeholder="None"
          >
            <ion-select-option value="">None</ion-select-option>
            <ion-select-option v-for="c in categories" :key="c" :value="c">
              {{ c }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label>Due date</ion-label>
          <ion-datetime-button datetime="due-date" slot="end" />
          <ion-button
            v-if="dueDate"
            slot="end"
            fill="clear"
            size="small"
            aria-label="Clear due date"
            @click="dueDate = ''"
          >
            <ion-icon :icon="closeCircleOutline" slot="icon-only" />
          </ion-button>
        </ion-item>
      </ion-list>

      <!-- keep-contents-mounted lets the button read/show the datetime value -->
      <ion-modal :keep-contents-mounted="true">
        <ion-datetime
          id="due-date"
          presentation="date"
          :value="dueDate || undefined"
          @ion-change="onDateChange"
          show-clear-button
        />
      </ion-modal>

      <ion-button
        expand="block"
        class="ion-margin-top"
        :disabled="!title.trim()"
        @click="save"
      >
        {{ isEditing ? 'Save Changes' : 'Add Task' }}
      </ion-button>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonDatetimeButton,
} from '@ionic/vue';
import { closeCircleOutline } from 'ionicons/icons';
import { TASK_CATEGORIES, type Priority, type Task } from '@/stores/tasks';

const props = defineProps<{ isOpen: boolean; task?: Task | null }>();

export interface TaskFormPayload {
  id?: number;
  title: string;
  description: string;
  priority: Priority;
  dueDate?: string;
  category?: string;
}

const emit = defineEmits<{
  (e: 'submit', payload: TaskFormPayload): void;
  (e: 'close'): void;
}>();

const categories = TASK_CATEGORIES;

const title = ref('');
const description = ref('');
const priority = ref<Priority>('medium');
const category = ref('');
const dueDate = ref('');

const isEditing = computed(() => !!props.task);

const syncFromTask = () => {
  const t = props.task;
  title.value = t?.title ?? '';
  description.value = t?.description ?? '';
  priority.value = t?.priority ?? 'medium';
  category.value = t?.category ?? '';
  dueDate.value = t?.dueDate ?? '';
};

// Also resync if the target task changes while the modal is already open.
watch(
  () => props.task,
  () => {
    if (props.isOpen) syncFromTask();
  },
);

const reset = () => {
  title.value = '';
  description.value = '';
  priority.value = 'medium';
  category.value = '';
  dueDate.value = '';
};

const onDateChange = (event: CustomEvent) => {
  const value = (event.detail as { value?: string | string[] | null }).value;
  dueDate.value = typeof value === 'string' ? value : '';
};

const save = () => {
  if (!title.value.trim()) return;
  emit('submit', {
    id: props.task?.id,
    title: title.value.trim(),
    description: description.value.trim(),
    priority: priority.value,
    dueDate: dueDate.value || undefined,
    category: category.value || undefined,
  });
  reset();
};

const cancel = () => {
  reset();
  emit('close');
};

// Covers backdrop tap / swipe-to-dismiss as well as programmatic close.
const handleDismiss = () => {
  emit('close');
};
</script>
