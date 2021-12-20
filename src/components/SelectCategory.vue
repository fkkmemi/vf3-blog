<script setup lang="ts">
import {
  ref,
  defineProps,
  defineEmits,
  onMounted
} from 'vue'
import { useDatabase } from 'src/composables/useDatabase'

const { setCategory, getCategories } = useDatabase()

const props = defineProps<{ modelValue: string }>()
const emits = defineEmits<{(e: 'update:modelValue', value: string): void}>()
const value = ref(props.modelValue)
const options = ref<string[]>([])

onMounted(() => {
  getCategories()
    .then(sn => {
      options.value = sn.val() as string[] || []
    })
    .catch(console.error)
})

async function createValue (inputValue: string, doneFn: (item?: any, mode?: 'add' | 'add-unique' | 'toggle' | undefined) => void) {
  if (!options.value.includes(inputValue)) {
    options.value.push(inputValue)
    await setCategory(inputValue)
  }
  doneFn(inputValue, 'add-unique')
}

function updateValue (input: string) {
  console.log(input)
  emits('update:modelValue', input)
}

</script>
<template>
  <q-select
    v-model="value"
    :options="options"
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
