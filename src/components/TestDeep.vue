<template>
  <div>
    {{ text }}
  </div>
</template>
<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  name: 'TestDeep',
  setup () {
    const text = inject('text')
    return { text }
  }

})
</script>
