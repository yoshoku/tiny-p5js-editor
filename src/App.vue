<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
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

const contentArea = ref<HTMLElement | null>(null)
const editorWidth = ref(50) // Percentage width of the editor
const iframeKey = ref(crypto.randomUUID()) // To force iframe reloads
const isDragging = ref(false)
const isRunning = ref(false)
const jsPreviewInstance = ref<InstanceType<typeof JsPreview> | null>(null)

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

const downloadSketch = () => {
  const blob = new Blob([code.value], { type: 'text/javascript' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'sketch.js'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const uploadSketch = (file: File) => {
  const reader = new FileReader()
  reader.onload = e => {
    const content = e.target?.result
    if (typeof content === 'string') {
      code.value = content
      if (isRunning.value) {
        stopSketch()
      }
    }
  }
  reader.readAsText(file)
}

const startResize = (e: MouseEvent) => {
  isDragging.value = true
  e.preventDefault()
}

const handleResize = (e: MouseEvent) => {
  if (!isDragging.value || !contentArea.value) return

  const rect = contentArea.value.getBoundingClientRect()
  const offsetX = e.clientX - rect.left
  const newWidth = (offsetX / rect.width) * 100

  // Set minimum and maximum widths (20% to 80%)
  if (newWidth >= 20 && newWidth <= 80) {
    editorWidth.value = newWidth
  }
}

const stopResize = () => {
  isDragging.value = false
}

onMounted(() => {
  window.addEventListener('mousemove', handleResize)
  window.addEventListener('mouseup', stopResize)
  window.addEventListener('mouseleave', stopResize)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleResize)
  window.removeEventListener('mouseup', stopResize)
  window.removeEventListener('mouseleave', stopResize)
})
</script>

<template>
  <div class="container">
    <ToolBar
      :is-running="isRunning"
      @run="runSketch"
      @stop="stopSketch"
      @upload="uploadSketch"
      @download="downloadSketch"
    />
    <div ref="contentArea" class="main-content" :class="{ dragging: isDragging }">
      <div
        class="editor-section"
        :style="{ width: editorWidth + '%' }"
        :class="{ 'no-pointer-events': isDragging }"
      >
        <JsEditor :code="code" @update:code="code = $event" />
      </div>
      <div class="divider" :class="{ dragging: isDragging }" @mousedown="startResize"></div>
      <div class="preview-section" :class="{ 'no-pointer-events': isDragging }">
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

.main-content.dragging {
  cursor: col-resize;
  user-select: none;
}

.editor-section {
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 20%;
  max-width: 80%;
}

.preview-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.divider {
  width: 8px;
  background-color: #ccc;
  cursor: col-resize;
  position: relative;
  flex-shrink: 0;
}

.divider:hover {
  background-color: #999;
}

.divider.dragging {
  background-color: #666;
}

.no-pointer-events {
  pointer-events: none;
}
</style>
