<script setup lang="ts">
import { ref } from 'vue'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../../../firebaseConfig'
import {
  getAuth, connectAuthEmulator,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth'

initializeApp(firebaseConfig)

const auth = getAuth()
connectAuthEmulator(auth, 'http://localhost:9099')
auth.useDeviceLanguage()
const provider = new GoogleAuthProvider()
const firebaseUser = ref<User | null>(null)
onAuthStateChanged(auth, user => {
  firebaseUser.value = user
})
</script>
<template>
  <q-btn
    v-if="firebaseUser"
    round
    color="info"
  >
    <q-avatar size="32px">
      <img :src="firebaseUser.photoURL || ''">
      <q-menu>
        <q-card>
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-icon name="mdi-account" />
              </q-item-section>
              <q-item-section>
                <q-item-label>이름</q-item-label>
                <q-item-label caption>
                  {{ firebaseUser.displayName }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon name="mdi-email" />
              </q-item-section>
              <q-item-section>
                <q-item-label>이메일</q-item-label>
                <q-item-label caption>
                  {{ firebaseUser.email }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-card-actions align="right">
            <q-btn
              icon="mdi-logout"
              label="로그아웃"
              flat
              color="primary"
              @click="signOut(auth)"
            />
          </q-card-actions>
        </q-card>
      </q-menu>
    </q-avatar>
  </q-btn>
  <q-btn
    v-else
    round
    color="info"
    @click="signInWithPopup(auth, provider)"
  >
    <q-avatar
      icon="mdi-login"
      size="32px"
    />
  </q-btn>
</template>
