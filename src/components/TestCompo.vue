<template>
  <div>
    slot out {{ test }}
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TestCompo',
  props: ['test'],

  setup () {
    //
  }
})
</script>
