
import { initializeApp } from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'
import { getDatabase } from 'firebase-admin/database'

const app = initializeApp()

const db = getFirestore()
const rtdb = getDatabase()

export { app, db, rtdb }
