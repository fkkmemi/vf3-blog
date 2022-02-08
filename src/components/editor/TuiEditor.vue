<script setup lang="ts">

import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'

import 'prismjs/themes/prism.css'
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript.js'
import 'prismjs/components/prism-typescript.js'
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'

import {
  ref,
  onMounted,
  defineProps,
  defineEmits,
  watch
} from 'vue'

const editorRef = ref()
const editor = ref<Editor | null>()
const props = defineProps<{ modelValue: string, loading: boolean }>()
const emits = defineEmits<{(e: 'update:modelValue', value: string): void,
  (e: 'addImage', file: File, callback: (url: string, text?: string) => void): void}>()

const add = (blob: Blob | File, callback: (url: string, text?: string) => void) => {
  emits('addImage', blob as File, callback)
}

watch(() => props.loading, (n: boolean) => {
  console.log('watch', n)
  if (editor.value) editor.value.destroy()
  if (!n) initialize()
  // editor.value.setMarkdown(n)
})

const initialize = () => {
  editor.value = new Editor({
    el: editorRef.value as HTMLDivElement,
    height: '500px',
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    initialValue: props.modelValue,
    events: {
      change: () => {
        if (!editor.value) return
        emits('update:modelValue', editor.value.getMarkdown())
      }
    },
    hooks: {
      addImageBlobHook: add
    },
    plugins: [[codeSyntaxHighlight, { highlighter: Prism }]]
  })
}

onMounted(() => {
  if (!props.loading) initialize()
})

</script>
<template>
  <div ref="editorRef" />
</template>
