<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { User, getUsers } from 'src/models/user'
import { QueryDocumentSnapshot } from 'firebase/firestore'
import UserListItem from './UserListItem.vue'

const items = ref<QueryDocumentSnapshot<User>[]>([])
const getData = async () => {
  const sn = await getUsers()
  items.value = sn.docs
}

onMounted(() => getData())
</script>
<template>
  <q-card>
    <q-toolbar>
      <q-toolbar-title>users</q-toolbar-title>
      <q-btn
        icon="mdi-refresh"
        round
        flat
        @click="getData"
      />
    </q-toolbar>
    <q-list>
      <UserListItem
        v-for="item in items"
        :key="item.id"
        :item="item"
      />
    </q-list>
  </q-card>
</template>
