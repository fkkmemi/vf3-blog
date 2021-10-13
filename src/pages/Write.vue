<script setup lang="ts">
import { } from 'vue'
import { firebaseUser, isSigned } from 'src/composables/useAuth'

</script>
<template>
  <q-page padding>
    <q-card>
      write
    </q-card>
    <q-page-sticky
      v-if="isSigned"
      position="bottom-right"
      :offset="[28, 28]"
      :expand="false"
    >
      <q-btn>write {{ firebaseUser?.email }}</q-btn>
    </q-page-sticky>
  </q-page>
</template>
