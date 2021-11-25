import { initializeApp } from 'firebase/app'
import firebaseConfig from '../../firebaseConfig'
import {
  getAuth, connectAuthEmulator
} from 'firebase/auth'

import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getDatabase, connectDatabaseEmulator } from 'firebase/database'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import firebaseJson from '../../firebase.json'

const app = initializeApp(firebaseConfig)

const auth = getAuth()
auth.useDeviceLanguage()
connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })

const db = getFirestore()
connectFirestoreEmulator(db, 'localhost', firebaseJson.emulators.firestore.port)

const rtdb = getDatabase(app)
connectDatabaseEmulator(rtdb, 'localhost', firebaseJson.emulators.database.port)

const storage = getStorage(app)
connectStorageEmulator(storage, 'localhost', firebaseJson.emulators.storage.port)

export { app, auth, db, rtdb, storage }
