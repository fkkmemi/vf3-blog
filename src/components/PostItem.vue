<script setup lang="ts">
import {
  defineProps,
  onMounted,
  ref
} from 'vue'
import { Post } from 'src/models/post'
import TuiViewer from './editor/TuiViewer.vue'
import { useFirestore } from 'src/composables/useFirestore'

const { getPost, getContentString } = useFirestore()
const props = defineProps<{
  id: string
}>()

const post = ref<Post | null>()
const content = ref('')

onMounted(async () => {
  const doc = await getPost(props.id)
  post.value = doc.data()
  content.value = await getContentString(props.id)
})

</script>
<template>
  <q-card>
    <q-skeleton v-if="!post" />
    <template v-else>
      <q-card-section>
        {{ post.title }}
        {{ post.createdAt }}
        {{ post.updatedAt }}
        {{ post.readCount }}
      </q-card-section>
      <!-- <q-card-section v-html="post.content" />
       -->
      <q-card-section v-if="content">
        <TuiViewer :content="content" />
      </q-card-section>
    </template>
    <q-card-actions>
      <q-btn
        to="/list"
        label="list"
      />
      <q-btn
        :to="`/post/${id}/update`"
        label="update"
      />
    </q-card-actions>
  </q-card>
</template>
