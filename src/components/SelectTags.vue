<script setup lang="ts">
import {
  ref,
  onMounted,
  defineProps,
  defineEmits,
  watch
} from 'vue'
import { useDatabase } from 'src/composables/useDatabase'

const { getTags, setTags } = useDatabase()

const fullOptions = ref<string[]>([])
const options = ref<string[]>([])
const props = defineProps<{ modelValue: string[] }>()
const emits = defineEmits<{(e: 'update:modelValue', value: string[]): void}>()
const value = ref(props.modelValue)

watch(() => props.modelValue, (n) => {
  value.value = n
})

onMounted(async () => {
  const sn = await getTags()
  fullOptions.value = sn.val() as string[] || []
})

async function newValue (inputValue: string, doneFn: (item?: string, mode?: 'add' | 'add-unique' | 'toggle' | undefined) => void) {
  if (!fullOptions.value.includes(inputValue)) {
    fullOptions.value.push(inputValue)
    await setTags(fullOptions.value)
  }
  doneFn(inputValue, 'add-unique')
}

function updateValue (input: string[]) {
  emits('update:modelValue', input)
}

function filterFn (val: string, update: (callbackFn: () => void) => void) {
  update(() => {
    if (!val) {
      options.value = fullOptions.value
    } else {
      const needle = val.toLowerCase()
      options.value = fullOptions.value.filter(
        v => v.toLowerCase().indexOf(needle) > -1
      )
    }
  })
}

</script>
<template>
  <q-select
    v-model="value"
    :options="options"
    label="태그"
    filled
    input-debounce="0"
    use-input
    use-chips
    multiple
    clearable
    @new-value="newValue"
    @update:model-value="updateValue"
    @filter="filterFn"
  />
</template>
