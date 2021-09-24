<template>
  <div>
    <TestCompo test="abcd">
      ijijijij
    </TestCompo>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import TestCompo from 'components/TestCompo.vue'

export default defineComponent({
  name: 'TestVue',
  components: { TestCompo },

  setup () {
    //
  }
})
</script>
