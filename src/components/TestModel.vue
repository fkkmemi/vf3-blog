<script setup lang="ts">
import {
  ref,
  defineProps,
  defineEmits
} from 'vue'

const props = defineProps<{ modelValue: string}>()
const emits = defineEmits<{(e: 'update:modelValue', value: string): void}>()
const changeText = ref(props.modelValue)

function change () {
  emits('update:modelValue', changeText.value)
}

</script>
<template>
  <q-card>
    <q-card-section>
      <textarea
        v-model="changeText"
        @input="change"
      />
    </q-card-section>
    <q-card-actions>
      <q-btn
        label="change"
        @click="change"
      />
    </q-card-actions>
  </q-card>
</template>
