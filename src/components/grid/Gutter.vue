<script setup lang="ts">
import { ref } from 'vue'
const gutter = ref('q-gutter-sm')
const gutters = ['xs', 'sm', 'md', 'lg', 'xl'].map(v => 'q-gutter-' + v)

</script>
<template>
  <q-card>
    <q-toolbar>
      <q-toolbar-title>gutter</q-toolbar-title>
      <q-select
        v-model="gutter"
        :options="gutters"
      />
    </q-toolbar>
    <q-card-section>
      {{ gutter }} {{ gutters }}
    </q-card-section>
    <div :class="gutter">
      <q-btn
        v-for="n in 7"
        :key="`xs-${n}`"
        color="brown"
        label="Button"
      />
    </div>
    <q-card-actions>
      <q-space />
      <q-btn
        v-for="n in 7"
        :key="`xs-${n}`"
        color="brown"
        label="Button"
      />
    </q-card-actions>
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn
        round
        color="accent"
        icon="arrow_forward"
        class="rotate-45"
      />
    </q-page-sticky>
  </q-card>
</template>
