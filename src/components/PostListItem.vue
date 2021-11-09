<script setup lang="ts">
import { defineProps, computed, defineEmits } from 'vue'
import { QueryDocumentSnapshot } from 'firebase/firestore'
import { Post, deletePost } from 'src/models/post'

const props = defineProps<{
  item: QueryDocumentSnapshot<Post>
}>()

const emit = defineEmits<{(e: 'refresh'): void}>()

const post = computed(() => props.item.data())
const user = computed(() => post.value.userSnapshot?.data())

async function remove () {
  await deletePost(props.item.id)
  emit('refresh')
}

</script>
<template>
  <q-item>
    <q-item-section avatar>
      {{ item.id }}
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ post.title }}</q-item-label>
      <q-item-label caption>
        {{ post.summary }}
      </q-item-label>
      <q-item-label caption>
        {{ post.createdAt }}
      </q-item-label>
      <q-item-label caption>
        {{ post.updatedAt }}
      </q-item-label>
      <q-item-label caption>
        {{ post.userRef.id }}
      </q-item-label>
      <q-item-label caption>
        {{ user?.email }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn
        label="delete"
        @click="remove"
      />
    </q-item-section>
    <q-item-section side>
      <q-btn
        label="go"
        :to="`/post/${item.id}`"
      />
    </q-item-section>
  </q-item>
</template>
