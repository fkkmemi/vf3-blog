import { initializeApp } from 'firebase/app'
import firebaseConfig from '../../firebaseConfig'
import {
  getAuth, connectAuthEmulator
} from 'firebase/auth'

import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import firebaseJson from '../../firebase.json'

const app = initializeApp(firebaseConfig)

const auth = getAuth()
auth.useDeviceLanguage()
connectAuthEmulator(auth, 'http://localhost:9099')

const db = getFirestore(app)
connectFirestoreEmulator(db, 'localhost', firebaseJson.emulators.firestore.port)

export { app, auth, db }
