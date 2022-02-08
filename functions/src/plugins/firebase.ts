
import { initializeApp } from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'
import { getDatabase } from 'firebase-admin/database'
import { getStorage } from 'firebase-admin/storage'

const app = initializeApp()

const db = getFirestore()
const rtdb = getDatabase()
const storage = getStorage()

export { app, db, rtdb, storage }
