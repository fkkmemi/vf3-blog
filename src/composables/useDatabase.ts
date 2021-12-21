import { rtdb } from 'boot/firebase'
import {
  ref,
  set,
  get
} from 'firebase/database'

const categoryRef = ref(rtdb, 'site/categories')

export const useDatabase = () => {
  const setCategories = async (categories: string[]) => {
    await set(categoryRef, categories)
  }

  const getCategories = () => {
    return get(categoryRef)
  }

  return {
    setCategories,
    getCategories
  }
}
