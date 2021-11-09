<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import PostWrite from './PostWrite.vue'
import { getPost, Post } from 'src/models/post'

const props = defineProps<{ id: string }>()
const post = ref<Post | null>()

onMounted(() => {
  return getPost(props.id)
    .then(data => {
      post.value = data
    })
})

</script>
<template>
  <q-card>
    <q-skeleton v-if="!post" />
    <PostWrite
      v-else
      :id="id"
      :title="post.title"
      :content="post.content || ''"
    />
  </q-card>
</template>
