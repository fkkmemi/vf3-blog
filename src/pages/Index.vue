<script setup lang="ts">
import { ref } from 'vue'
import TestModelVue from 'src/components/TestModel.vue'

const text = ref('abcd')
</script>
<template>
  <q-page padding>
    <TestModelVue
      v-model="text"
    />
    <q-card>{{ text }}</q-card>
  </q-page>
</template>
