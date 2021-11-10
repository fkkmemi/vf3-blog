<script setup lang="ts">
import {
  defineProps,
  onMounted,
  ref
} from 'vue'
import { getPost, Post } from 'src/models/post'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = defineProps<{
  id: string
}>()

const post = ref<Post | null>()
const editor = useEditor({
  content: '',
  extensions: [
    StarterKit
  ],
  editable: false
})

onMounted(() => {
  return getPost(props.id)
    .then(data => {
      post.value = data
      editor.value.commands.setContent(data.content || '')
    })
})

</script>
<template>
  <q-card>
    <q-skeleton v-if="!post" />
    <template v-else>
      <q-card-section>
        {{ post.title }}
        {{ post.createdAt }}
      </q-card-section>
      <!-- <q-card-section v-html="post.content" />
       -->
      <q-card-section>
        <editor-content :editor="editor" />
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
