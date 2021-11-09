<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { setPost, deletePost } from 'src/models/post'

const props = defineProps<{
  id: string,
  title: string,
  content: string
}>()

const postTitle = ref(props.title)
const postContent = ref(props.content)

const existsRule = (val: string) => (val && val.length > 0) || '내용을 쓰세요'
const router = useRouter()
const onSubmit = async () => {
  if (props.id) {
    if (props.title !== postTitle.value) await deletePost(props.id)
  }
  const id = await setPost(postTitle.value, postContent.value)
  await router.push(`/post/${id}`)
}

const onReset = () => {
  postTitle.value = ''
  postContent.value = ''
}
</script>
<template>
  <q-form
    class="q-gutter-md"
    @submit="onSubmit"
    @reset="onReset"
  >
    <q-card>
      <q-card-section>
        <q-input
          v-model="postTitle"
          filled
          label="제목"
          hint="제목을 쓰세요"
          lazy-rules
          :rules="[ existsRule ]"
        />

        <q-input
          v-model="postContent"
          filled
          type="textarea"
          label="내용"
          hint="내용을 쓰세요"
          lazy-rules
          :rules="[ existsRule ]"
        />
      </q-card-section>

      <q-card-actions>
        <q-space />
        <q-btn
          label="Submit"
          type="submit"
          color="primary"
        />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
        />
      </q-card-actions>
    </q-card>
  </q-form>
</template>
