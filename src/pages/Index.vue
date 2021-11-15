<script setup lang="ts">
import { ref } from 'vue'
import TuiEditor from 'src/components/editor/TuiEditor.vue'
import TuiViewer from 'src/components/editor/TuiViewer.vue'

const text = ref('# abcfwefwd\n## abcd!!!')
</script>
<template>
  <q-page padding>
    <TuiEditor v-model="text" />
    <q-card>{{ text }}</q-card>
    <TuiViewer :content="text" />
  </q-page>
</template>
