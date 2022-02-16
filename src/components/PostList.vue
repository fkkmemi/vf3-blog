<script setup lang="ts">
import PostListItem from './PostListItem.vue'
import { QueryDocumentSnapshot } from 'firebase/firestore'
import { onMounted, ref } from 'vue'
import { Post } from 'src/models/post'
import { useFirestore } from 'src/composables/useFirestore'

const { getPosts } = useFirestore()

const items = ref<QueryDocumentSnapshot<Post>[]>([])

const getData = async () => {
  const querySnapshot = await getPosts()
  items.value = querySnapshot.docs
}

onMounted(() => getData())

</script>
<template>
  <!-- <q-list>
    <PostListItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      @refresh="getData"
    />
  </q-list> -->
  <div class="row q-col-gutter-md">
    <div
      v-for="item in items"
      :key="item.id"
      class="col-12 col-sm-6 col-md-4 col-lg-3"
    >
      <PostListItem
        :item="item"
        @refresh="getData"
      />
    </div>
  </div>

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
