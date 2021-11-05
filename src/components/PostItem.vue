<script setup lang="ts">
import {
  defineProps,
  onMounted,
  ref
} from 'vue'
import { getPost, Post } from 'src/models/post'

const props = defineProps<{
  id: string
}>()

const post = ref<Post | null>()

onMounted(() => {
  return getPost(props.id)
    .then(sn => {
      post.value = sn.data()
    })
})

</script>
<template>
  <q-card>
    <q-skeleton v-if="!post" />
    <q-card-section v-else>
      {{ post.title }}
      {{ post.createdAt }}
    </q-card-section>
    <q-card-actions>
      <q-btn
        to="/list"
        label="list"
      />
    </q-card-actions>
  </q-card>
</template>
