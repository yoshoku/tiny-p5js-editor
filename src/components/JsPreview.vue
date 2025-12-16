<script setup lang="ts">
import { ref } from 'vue'

const iframe = ref<HTMLIFrameElement | null>(null)

defineExpose({
  iframe,
})
</script>

<template>
  <div class="js-preview-wrapper">
    <iframe ref="iframe" class="js-preview-iframe"></iframe>
  </div>
</template>

<style scoped>
.js-preview-wrapper {
  flex: 1 1 0;
  background-color: #f5f5f5;
  position: relative;
}

.js-preview-iframe {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  border: none;
}
</style>
