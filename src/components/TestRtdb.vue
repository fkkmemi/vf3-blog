<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  ref as rtRef,
  set,
  get,
  onValue,
  remove
} from 'firebase/database'
import { rtdb } from 'src/boot/firebase'

interface UserData {
  name: string;
  age: number;
}

const name = ref('aaa')
const age = ref(0)
const userData = ref<UserData>({ name: '', age: 0 })

const userRef = rtRef(rtdb, 'users/id')
function save () {
  return set(userRef, {
    name: name.value,
    age: age.value
  })
}

async function read () {
  const sn = await get(userRef)
  userData.value = sn.val() as UserData
}
function removeData () {
  return remove(userRef)
}

onMounted(() => {
  onValue(userRef, (sn) => {
    userData.value = sn.val() as UserData
  })
})

</script>
<template>
  <q-card>
    <q-card-section>test</q-card-section>
    <q-card-section>
      <q-input v-model="name" />
      <q-input
        v-model.number="age"
        type="number"
      />
    </q-card-section>
    <q-card-actions>
      <q-btn
        label="save"
        @click="save"
      />
      <q-btn
        label="read"
        @click="read"
      />
      <q-btn
        label="remove"
        @click="removeData"
      />
    </q-card-actions>
    <q-card-section>
      {{ userData }}
    </q-card-section>
  </q-card>
</template>
