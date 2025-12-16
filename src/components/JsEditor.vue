<script setup lang="ts">
import { shallowRef } from 'vue'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
import type * as Monaco from 'monaco-editor'

interface Props {
  code: string
}

defineProps<Props>()

const editor = shallowRef<Monaco.editor.IStandaloneCodeEditor | null>(null)
const handleMount = (editorInstance: Monaco.editor.IStandaloneCodeEditor) => {
  editor.value = editorInstance
}
</script>

<template>
  <div class="js-editor-wrapper">
    <vue-monaco-editor
      :value="code"
      language="javascript"
      theme="vs-light"
      :options="{
        automaticLayout: true,
        formatOnType: true,
        formatOnPaste: true,
        links: false,
        minimap: { enabled: false },
      }"
      @mount="handleMount"
    />
  </div>
</template>

<style scoped>
.js-editor-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
