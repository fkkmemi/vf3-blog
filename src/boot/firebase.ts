import { initializeApp } from 'firebase/app'
import firebaseConfig from '../../firebaseConfig'
import {
  getAuth, connectAuthEmulator
} from 'firebase/auth'

import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getDatabase, connectDatabaseEmulator } from 'firebase/database'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getMessaging } from 'firebase/messaging'

import firebaseJson from '../../firebase.json'

const app = initializeApp(firebaseConfig)

const auth = getAuth()
auth.useDeviceLanguage()
const db = getFirestore()
const rtdb = getDatabase(app)
const storage = getStorage(app)
const messaging = getMessaging(app)

if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, `http://localhost:${firebaseJson.emulators.auth.port}`, { disableWarnings: true })

  connectFirestoreEmulator(db, 'localhost', firebaseJson.emulators.firestore.port)

  connectDatabaseEmulator(rtdb, 'localhost', firebaseJson.emulators.database.port)

  connectStorageEmulator(storage, 'localhost', firebaseJson.emulators.storage.port)
}

export { app, auth, db, rtdb, storage, messaging }
