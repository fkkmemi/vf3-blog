<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PostWrite from 'src/components/PostWrite.vue'

const route = useRoute()
const id = computed(() => route.params.id as string || '')

</script>
<template>
  <q-page padding>
    <PostWrite :id="id" />
  </q-page>
</template>
