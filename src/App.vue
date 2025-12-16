<script setup lang="ts">
import { ref } from 'vue'
import JsEditor from './components/JsEditor.vue'
import JsPreview from './components/JsPreview.vue'
import ToolBar from './components/ToolBar.vue'

const code = ref(`function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  ellipse(mouseX, mouseY, 50, 50);
}`)

const isRunning = ref(false)
const jsPreviewInstance = ref<InstanceType<typeof JsPreview> | null>(null)
const iframeKey = ref(crypto.randomUUID()) // To force iframe reloads

const runSketch = () => {
  const iframe = jsPreviewInstance.value?.$refs.iframe as HTMLIFrameElement
  if (!iframe) return

  const contentDocument = iframe.contentDocument || iframe.contentWindow?.document
  if (!contentDocument) return

  /* eslint-disable no-useless-escape */
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        * { margin: 0; padding: 0; }
        html, body { width: 100%; height: 100%; overflow: hidden; }
        body { display: flex; justify-content: center; align-items: center; }
        canvas { display: block; }
      </style>
      <script src="https://cdn.jsdelivr.net/npm/p5@1.11.11/lib/p5.min.js"><\/script>
    </head>
    <body>
      <script>${code.value}<\/script>
    </body>
    </html>
  `
  /* eslint-enable no-useless-escape */

  contentDocument.open()
  contentDocument.write(html)
  contentDocument.close()

  isRunning.value = true
}

const stopSketch = () => {
  iframeKey.value = crypto.randomUUID()
  isRunning.value = false
}
</script>

<template>
  <div class="container">
    <ToolBar :is-running="isRunning" @run="runSketch" @stop="stopSketch" />
    <div class="main-content">
      <div class="editor-section">
        <JsEditor :code="code" @update:code="code = $event" />
      </div>
      <div class="preview-section">
        <JsPreview ref="jsPreviewInstance" :key="iframeKey" />
      </div>
    </div>
  </div>
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.main-content {
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 0;
}

.editor-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.preview-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
</style>
