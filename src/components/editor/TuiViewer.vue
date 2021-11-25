<script setup lang="ts">
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'

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
    initialValue: props.content
  })
})

</script>
<template>
  <div ref="editorRef" />
</template>
