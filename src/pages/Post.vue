<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PostItem from 'src/components/PostItem.vue'

const route = useRoute()

const id = computed(() => route.params.id as string)

</script>
<template>
  <q-page padding>
    <PostItem :id="id" />
  </q-page>
</template>
