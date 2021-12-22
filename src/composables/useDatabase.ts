import { rtdb } from 'boot/firebase'
import {
  ref,
  set,
  get
} from 'firebase/database'

const categoryRef = ref(rtdb, 'site/categories')
const tagsRef = ref(rtdb, 'site/tags')

export const useDatabase = () => {
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
    setCategories,
    getCategories,
    setTags,
    getTags
  }
}
