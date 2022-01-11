import { rtdb } from 'boot/firebase'
import {
  ref,
  set,
  get,
  onValue,
  onDisconnect,
  serverTimestamp,
  off
} from 'firebase/database'

const infoConectedRef = ref(rtdb, '.info/connected')
const categoryRef = ref(rtdb, 'site/categories')
const tagsRef = ref(rtdb, 'site/tags')

export const useDatabase = () => {
  const onChangeStatus = (uid: string) => {
    onValue(infoConectedRef, snapshot => {
      const connected = snapshot.val() as boolean
      if (!connected) return
      const statusRef = ref(rtdb, `status/${uid}`)
      return onDisconnect(statusRef).set({ online: false, visitedAt: serverTimestamp() })
        .then(() => {
          return set(statusRef, { online: true, visitedAt: serverTimestamp() })
        })
    })
  }

  const offChangeStatus = (uid: string) => {
    off(infoConectedRef)
    if (!uid) return Promise.resolve()
    const statusRef = ref(rtdb, `status/${uid}`)
    return set(statusRef, { online: false, visitedAt: serverTimestamp() })
  }
  const setCategories = async (categories: string[]) => {
    await set(categoryRef, categories)
  }

  const getCategories = () => {
    return get(categoryRef)
  }
  const setTags = async (items: string[]) => {
    await set(tagsRef, items)
  }

  const getTags = () => {
    return get(tagsRef)
  }

  return {
    onChangeStatus,
    offChangeStatus,
    setCategories,
    getCategories,
    setTags,
    getTags
  }
}
