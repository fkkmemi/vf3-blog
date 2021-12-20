import { rtdb } from 'boot/firebase'
import {
  ref,
  set,
  get
} from 'firebase/database'

const categories: string[] = []
const categoryRef = ref(rtdb, 'site/categories')

export const useDatabase = () => {
  const setCategory = async (category: string) => {
    if (!categories.includes(category)) categories.push(category)
    await set(categoryRef, categories)
  }

  const getCategories = () => {
    return get(categoryRef)
  }

  return {
    setCategory,
    getCategories
  }
}
