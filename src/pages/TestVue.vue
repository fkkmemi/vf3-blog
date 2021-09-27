<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        text: {{ addedText }}
      </q-card-section>
      <q-card-section>
        <q-input v-model="text" />
      </q-card-section>
      <q-card-actions>
        <q-btn
          flat
          label="add"
          @click="add"
        />
      </q-card-actions>
      <q-card-section>
        compo...
        <TestCompo :text="text" />
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref, computed, provide } from 'vue'
import TestCompo from 'components/TestCompo.vue'

export default defineComponent({
  name: 'TestVue',
  components: { TestCompo },
  // data () {
  //   return {
  //     text: 'abc'
  //   }
  // },
  // computed: {
  //   addedText (): string {
  //     return this.text + ' added'
  //   }
  // },
  // methods: {
  //   add () {
  //     this.text += ' add'
  //   }
  // }
  setup () {
    const text = ref('abc')
    const addedText = computed(() => text.value + ' added')
    const add = () => {
      text.value += ' add'
    }

    provide('text', text)

    return {
      text,
      addedText,
      add
    }
  }
})
</script>
