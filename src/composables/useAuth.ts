import { ref, computed } from 'vue'
import { auth } from 'boot/firebase'
import {
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { onChangeStatus, offChangeStatus } from './statusChange'

export const firebaseUser = ref<User | null>(null)
export const isSigned = computed(() => firebaseUser.value !== null)

export const useAuth = () => {
  const initialize = () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        onChangeStatus(user.uid)
      } else {
        offChangeStatus(firebaseUser.value?.uid || '').catch(e => console.error('off err', e))
      }
      firebaseUser.value = user
    })
  }
  return { initialize }
}
