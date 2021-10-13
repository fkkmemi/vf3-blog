import { ref, computed } from 'vue'
import { auth } from 'boot/firebase'
import {
  onAuthStateChanged,
  User
} from 'firebase/auth'

export const firebaseUser = ref<User | null>(null)
export const isSigned = computed(() => firebaseUser.value !== null)

export const useAuth = () => {
  onAuthStateChanged(auth, user => {
    firebaseUser.value = user
  })
}
