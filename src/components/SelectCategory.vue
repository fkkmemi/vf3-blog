<script setup lang="ts">
import {
  ref,
  defineProps,
  defineEmits,
  onMounted,
  watch
} from 'vue'
import { useDatabase } from 'src/composables/useDatabase'

const { setCategories, getCategories } = useDatabase()

const props = defineProps<{ modelValue: string, rules: [(val: string) => boolean | string] }>()
const emits = defineEmits<{(e: 'update:modelValue', value: string): void}>()
const value = ref(props.modelValue)
const options = ref<string[]>([])

watch(() => props.modelValue, (n) => {
  value.value = n
})

onMounted(async () => {
  const sn = await getCategories()
  options.value = sn.val() as string[] || []
})

async function createValue (inputValue: string, doneFn: (item: string, mode: 'add' | 'add-unique' | 'toggle') => void) {
  if (!options.value.includes(inputValue)) {
    options.value.push(inputValue)
    await setCategories(options.value)
  }
  doneFn(inputValue, 'add-unique')
}

function updateValue (input: string) {
  emits('update:modelValue', input || '')
}

</script>
<template>
  <q-select
    v-model="value"
    :options="options"
    :rules="rules"
    label="카테고리"
    filled
    input-debounce="0"
    new-value-mode="add-unique"
    use-input
    clearable
    @new-value="createValue"
    @update:model-value="updateValue"
  />
</template>
