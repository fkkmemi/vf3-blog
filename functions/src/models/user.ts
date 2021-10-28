import {
  FirestoreDataConverter,
  DocumentData,
  FieldValue
} from 'firebase-admin/firestore'
import {
  UserRecord
} from 'firebase-admin/auth'
import { createHash } from 'crypto'
import { db } from '../plugins/firebase'

export class User {
  constructor (
    readonly email: string,
    readonly displayName: string,
    readonly photoURL: string,
    readonly createdAt?: Date | undefined,
    readonly online?: boolean,
    readonly visitedAt?: Date | undefined
  ) { }

  toJSON () {
    return {
      email: this.email,
      displayName: this.displayName,
      photoURL: this.photoURL,
      createdAt: this.createdAt || FieldValue.serverTimestamp(),
      online: this.online || true,
      visitedAt: this.visitedAt || FieldValue.serverTimestamp()
    }
  }
}

const converter: FirestoreDataConverter<User> = {
  toFirestore (model: User): DocumentData {
    return model.toJSON()
  },
  fromFirestore (snapshot): User {
    const data = snapshot.data()
    return new User(
      data.email,
      data.displayName,
      data.photoURL
    )
  }
}
const collection = db.collection('users').withConverter(converter)
export const createUser = (userRecord: UserRecord) => {
  if (!userRecord.email) throw Error('invalid email')
  const hash = createHash('md5').update(userRecord.uid).digest('hex')
  const photoURL = userRecord.photoURL || `https://www.gravatar.com/avatar/${hash}`
  const user = new User(
    userRecord.email,
    userRecord.displayName || '',
    photoURL
  )
  return collection.doc(userRecord.uid).set(user)
}

export const deleteUser = (userRecord: UserRecord) => {
  return collection.doc(userRecord.uid).delete()
}

export const updateState = (uid: string, online: boolean, visitedAt: Date) => {
  return collection.doc(uid).update({ online, visitedAt })
}
