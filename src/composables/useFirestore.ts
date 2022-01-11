import { onSnapshot, doc, Unsubscribe } from 'firebase/firestore'
import { db } from 'boot/firebase'
import { User, converter as userConverter } from 'src/models/user'
import { User as FirebaseUser } from 'firebase/auth'
import { ref } from 'vue'

const unsubscribe = ref<Unsubscribe | null>()
export const user = ref<User | null>()

export const useFirestore = () => {
  const onSnapshotUser = (firebaseUser: FirebaseUser) => {
    const userRef = doc(db, 'users', firebaseUser.uid).withConverter(userConverter)
    unsubscribe.value = onSnapshot(userRef, sn => {
      // console.log(sn.data())
      user.value = sn.data()
    })
  }
  const offSnapshotUser = () => {
    if (unsubscribe.value) unsubscribe.value()
  }

  return {
    onSnapshotUser,
    offSnapshotUser
  }
}
