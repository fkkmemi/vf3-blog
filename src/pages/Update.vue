<script setup lang="ts">
import { computed } from 'vue'
import PostItemUpdate from 'src/components/PostItemUpdate.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = computed(() => route.params.id as string)

</script>
<template>
  <q-page padding>
    <PostItemUpdate :id="id" />
  </q-page>
</template>
