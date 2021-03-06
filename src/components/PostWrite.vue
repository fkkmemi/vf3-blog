<script setup lang="ts">
import { ref, defineProps, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Post } from 'src/models/post'
import TuiEditor from './editor/TuiEditor.vue'
import { setImage } from 'src/models/image'
import useStorage from 'src/composables/useStorage'
import SelectCategory from './SelectCategory.vue'
import SelectTags from './SelectTags.vue'
import { useFirestore } from 'src/composables/useFirestore'

const { setPost, getPost, deletePost, getContentString } = useFirestore()
const props = defineProps<{
  id: string
}>()

const post = ref<Post | null>()

const title = ref('')
const content = ref('')
const thumbnail = ref('')
const category = ref('')
const tags = ref<string[]>([])
const loading = ref(true)

onMounted(async () => {
  if (!props.id) {
    loading.value = false
    return
  }
  const doc = await getPost(props.id)
  post.value = doc.data()
  if (!post.value) {
    loading.value = false
    return
  }
  title.value = post.value.title
  content.value = await getContentString(props.id)
  thumbnail.value = post.value.thumbnail
  category.value = post.value.category
  tags.value = post.value.tags

  loading.value = false
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

const existsRule = (val: string) => (val && val.length > 0) || '내용을 쓰세요'
const router = useRouter()
const onSubmit = async () => {
  if (!content.value) throw Error('내용을 쓰세요')
  if (post.value) {
    if (post.value.title !== title.value) await deletePost(props.id)
  }
  let t = thumbnail.value
  if (!t && thumbnails.value.length) t = thumbnails.value[0]
  const id = await setPost(
    title.value,
    content.value,
    t,
    category.value,
    tags.value,
    !!props.id)
  await router.push(`/post/${id}`)
}

const onReset = () => {
  title.value = ''
  content.value = ''
  category.value = ''
  tags.value = []
}
const { getURL } = useStorage()
const addImage = async (file: File | Blob, callback: (url: string, text?: string) => void) => {
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
      </q-card-section>
      <q-card-section>
        <SelectCategory
          v-model="category"
          :rules="[ existsRule ]"
        />
      </q-card-section>

      <q-card-section>
        <SelectTags v-model="tags" />
        {{ tags }}
      </q-card-section>
      <q-card-section>
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

      <q-card-actions>
        <q-space />
        <q-btn
          to="/list"
          label="list"
        />
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
