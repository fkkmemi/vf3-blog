<template>
  <div>
    text: {{ text }}
  </div>
  <div>
    upper: {{ text.toUpperCase() }}
  </div>
  <div>
    deep: <TestDeep />
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import TestDeep from 'components/TestDeep.vue'

export default defineComponent({
  name: 'TestCompo',
  components: { TestDeep },
  props: {
    text: {
      type: String,
      default: () => 'abcd'
    }
  },

  setup (props) {
    const upper = computed(() => props.text)
    return { upper }
    //
  }
})
</script>
