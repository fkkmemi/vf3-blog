<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { setPost } from 'src/models/post'

const title = ref('')
const content = ref('')

const existsRule = (val: string) => (val && val.length > 0) || '내용을 쓰세요'
const router = useRouter()
const onSubmit = async () => {
  await setPost(title.value, content.value)
  await router.push('/list')
}

const onReset = () => {
  title.value = ''
  content.value = ''
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
          v-model="title"
          filled
          label="제목"
          hint="제목을 쓰세요"
          lazy-rules
          :rules="[ existsRule ]"
        />

        <q-input
          v-model="content"
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
