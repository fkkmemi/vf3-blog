<script setup lang="ts">
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'
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
  withDefaults
} from 'vue'

const editorRef = ref()
const viewer = ref<Viewer | null>()
const props = withDefaults(
  defineProps<{ content?: string }>(),
  { content: '' }
)

onMounted(() => {
  viewer.value = new Viewer({
    el: editorRef.value as HTMLDivElement,
    initialValue: props.content,
    plugins: [[codeSyntaxHighlight, { highlighter: Prism }]]
  })
})

</script>
<template>
  <div ref="editorRef" />
</template>
