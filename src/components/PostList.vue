<script setup lang="ts">
import PostListItem from './PostListItem.vue'
import { QueryDocumentSnapshot } from 'firebase/firestore'
import { onMounted, ref } from 'vue'
import { Post, getPosts } from 'src/models/Post'

const items = ref<QueryDocumentSnapshot<Post>[]>([])

const getData = async () => {
  const querySnapshot = await getPosts()
  items.value = querySnapshot.docs
}

onMounted(() => getData())

</script>
<template>
  <q-list>
    <PostListItem
      v-for="item in items"
      :key="item.id"
      :item="item"
    />
  </q-list>

  <q-page-sticky
    position="bottom-right"
    :offset="[18, 18]"
  >
    <q-btn
      round
      color="pink"
      icon="mdi-pencil"
      to="/write"
    />
  </q-page-sticky>
</template>
