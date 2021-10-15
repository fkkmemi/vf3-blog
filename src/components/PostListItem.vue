<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { QueryDocumentSnapshot } from 'firebase/firestore'
import { Post } from 'src/models/Post'

const props = defineProps<{
  item: QueryDocumentSnapshot<Post>
}>()

const post = computed(() => props.item.data())

</script>
<template>
  <q-item>
    <q-item-section avatar>
      {{ item.id }}
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ post.title }}</q-item-label>
      <q-item-label caption>
        {{ post.content }}
      </q-item-label>
      <q-item-label caption>
        {{ post.createdAt }}
      </q-item-label>
      <q-item-label caption>
        {{ post.updatedAt }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>
