<script setup lang="ts">
import { shallowRef } from 'vue'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
import type * as Monaco from 'monaco-editor'

interface Props {
  code: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:code': [value: string]
}>()

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
      @update:value="emit('update:code', $event)"
      @mount="handleMount"
    />
  </div>
</template>

<style scoped>
.js-editor-wrapper {
  flex: 1 1 0;
  overflow: hidden;
}
</style>
