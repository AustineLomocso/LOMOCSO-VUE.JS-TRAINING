<template>
  <ion-modal :is-open="isOpen" @didPresent="startCamera" @didDismiss="handleDismiss">
    <ion-header>
      <ion-toolbar>
        <ion-title>Take a Photo</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="cancel">Cancel</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="camera-content">
      <div class="camera-stage">
        <video
          v-show="!error"
          ref="videoEl"
          class="camera-preview"
          autoplay
          playsinline
          muted
        ></video>
        <p v-if="error" class="camera-error">{{ error }}</p>
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-button expand="block" :disabled="!ready" @click="capture">
          <ion-icon slot="start" :icon="cameraOutline" />
          Capture
        </ion-button>
      </ion-toolbar>
    </ion-footer>
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
  IonFooter,
  IonIcon,
} from '@ionic/vue';
import { cameraOutline } from 'ionicons/icons';

defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{
  (e: 'captured', dataUrl: string): void;
  (e: 'close'): void;
}>();

const videoEl = ref<HTMLVideoElement | null>(null);
const ready = ref(false);
const error = ref('');
let stream: MediaStream | null = null;

const startCamera = async () => {
  error.value = '';
  ready.value = false;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    });
    if (videoEl.value) {
      videoEl.value.srcObject = stream;
      await videoEl.value.play();
      ready.value = true;
    }
  } catch (err) {
    console.error('getUserMedia failed', err);
    error.value =
      'Could not access the camera. Check that a camera is connected and that you granted permission.';
  }
};

const stopCamera = () => {
  stream?.getTracks().forEach((track) => track.stop());
  stream = null;
  ready.value = false;
};

const capture = () => {
  const video = videoEl.value;
  if (!video) return;

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

  stopCamera();
  emit('captured', dataUrl);
};

const cancel = () => {
  stopCamera();
  emit('close');
};

// Fires when the modal is dismissed by any means (backdrop, swipe, cancel).
const handleDismiss = () => {
  stopCamera();
  emit('close');
};
</script>

<style scoped>
.camera-content {
  --background: #000;
}

.camera-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.camera-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.camera-error {
  color: #fff;
  text-align: center;
  padding: 24px;
}
</style>
