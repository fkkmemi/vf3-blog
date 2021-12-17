<script setup lang="ts">
import { ref, defineProps, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { setPost, deletePost, Post, getPost } from 'src/models/post'
import TuiEditor from './editor/TuiEditor.vue'
import { setImage } from 'src/models/image'
import useStorage from 'src/composables/useStorage'

const props = defineProps<{
  id: string
}>()

const post = ref<Post | null>()

const title = ref('')
const content = ref('')
const thumbnail = ref('')
const loading = ref(true)

onMounted(() => {
  if (!props.id) {
    loading.value = false
    return
  }
  return getPost(props.id)
    .then(data => {
      console.log(data)
      post.value = data
      title.value = post.value.title
      content.value = post.value.content || ''
      thumbnail.value = post.value.thumbnail
      loading.value = false
    })
})

const thumbnails = computed(() => {
  const ts = content.value.split('')
  let step = 0
  const buf = []
  const urls = []
  while (ts.length) {
    const t = ts.shift()
    switch (step) {
      case 0:
        if (t === '!') step++
        break
      case 1:
        if (t === '[') step++
        else step = 0
        break
      case 2:
        if (t === ']') step++
        else buf.push(t)
        break
      case 3:
        if (t === '(') step++
        break
      case 4:
        if (t === ')') {
          const url = buf.join('')
          buf.splice(0, buf.length)
          urls.push(url)
          step = 0
        }
        break
    }
  }
  return urls
})

const summary = computed(() => {
  return content.value.slice(0, 100)
})

const existsRule = (val: string) => (val && val.length > 0) || '내용을 쓰세요'
const router = useRouter()
const onSubmit = async () => {
  if (post.value) {
    if (post.value.title !== title.value) await deletePost(props.id)
  }
  let t = thumbnail.value
  if (!t && thumbnails.value.length) t = thumbnails.value[0]
  console.log(t)
  const id = await setPost(
    title.value,
    content.value,
    summary.value,
    t)
  await router.push(`/post/${id}`)
}

const onReset = () => {
  title.value = ''
  content.value = ''
}
const { getURL } = useStorage()
const addImage = async (file: File | Blob, callback: (url: string, text?: string) => void) => {
  console.log('add')
  const id = await setImage(file as File)
  const origin = await getURL(`images/${id}/origin`)
  const thumbnail = await getURL(`images/${id}/thumbnail`)

  callback(origin, thumbnail)
}

// const loading = computed(() => !props.id ? false : !post.value)

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
        <TuiEditor
          v-model="content"
          :loading="loading"
          @add-image="addImage"
        />
      </q-card-section>
      <q-card-section>
        <div class="row q-gutter-sm">
          <div
            v-for="(url, i) in thumbnails"
            :key="i"
            class="col-4 col-sm-3 col-md-2 col-lg-1"
          >
            <q-card>
              <q-img
                :src="url"
                :ratio="1"
              >
                <div class="absolute-bottom text-right">
                  <q-btn
                    round
                    flat
                    :icon="thumbnail === url || (i === 0 && thumbnail === '') ? 'mdi-check' : 'mdi-close'"
                    @click="thumbnail = url"
                  />
                </div>
              </q-img>
            </q-card>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        {{ thumbnails }}
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
