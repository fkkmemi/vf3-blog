
import { initializeApp } from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'

const app = initializeApp()

const db = getFirestore()

export { app, db }
