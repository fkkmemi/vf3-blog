import { ref, computed } from 'vue'
import { auth } from 'boot/firebase'
import {
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { useDatabase } from 'src/composables/useDatabase'
import { useFirestore } from 'src/composables/useFirestore'

export const firebaseUser = ref<User | null>(null)
export const isSigned = computed(() => firebaseUser.value !== null)

const { onChangeStatus, offChangeStatus } = useDatabase()
const { onSnapshotUser, offSnapshotUser } = useFirestore()

export const useAuth = () => {
  const initialize = () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        onChangeStatus(user.uid)
        onSnapshotUser(user)
      } else {
        offChangeStatus(firebaseUser.value?.uid || '').catch(e => console.error('off err', e))
        offSnapshotUser()
      }
      firebaseUser.value = user
    })
  }
  return { initialize }
}
