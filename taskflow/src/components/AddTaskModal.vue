<template>
  <ion-modal :is-open="isOpen" @didDismiss="handleDismiss">
    <ion-header>
      <ion-toolbar>
        <ion-title>New Task</ion-title>
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
      </ion-list>

      <ion-button
        expand="block"
        class="ion-margin-top"
        :disabled="!title.trim()"
        @click="save"
      >
        Add Task
      </ion-button>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
} from '@ionic/vue';
import type { Task } from '@/stores/tasks';

defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{
  (e: 'create', payload: { title: string; description: string; priority: Task['priority'] }): void;
  (e: 'close'): void;
}>();

const title = ref('');
const description = ref('');
const priority = ref<Task['priority']>('medium');

const reset = () => {
  title.value = '';
  description.value = '';
  priority.value = 'medium';
};

const save = () => {
  if (!title.value.trim()) return;
  emit('create', {
    title: title.value.trim(),
    description: description.value.trim(),
    priority: priority.value,
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
