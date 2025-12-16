<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  isRunning: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  run: []
  stop: []
  download: []
  upload: [file: File]
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file && file.name.endsWith('.js')) {
    emit('upload', file)
  }
  // Reset input value to allow re-uploading the same file
  if (target) {
    target.value = ''
  }
}

const triggerUpload = () => {
  fileInput.value?.click()
}
</script>

<template>
  <div class="toolbar">
    <button class="run-button" :disabled="isRunning" @click="emit('run')">Run</button>
    <button class="stop-button" :disabled="!isRunning" @click="emit('stop')">Stop</button>
    <div class="divider"></div>
    <button class="upload-button" @click="triggerUpload">Upload</button>
    <button class="download-button" @click="emit('download')">Download</button>
    <input
      ref="fileInput"
      type="file"
      accept=".js"
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  padding: 8px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
  width: 100%;
}

.run-button {
  padding: 6px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 8px;
}

.run-button:hover:not(:disabled) {
  background-color: #45a049;
}

.run-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.stop-button {
  padding: 6px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.stop-button:hover:not(:disabled) {
  background-color: #da190b;
}

.stop-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.divider {
  width: 1px;
  background-color: #666;
  margin: 0 12px;
  align-self: stretch;
}

.upload-button {
  padding: 6px 16px;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 8px;
}

.upload-button:hover {
  background-color: #e68900;
}

.download-button {
  padding: 6px 16px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.download-button:hover {
  background-color: #0b7dda;
}
</style>
