import {
  FirestoreDataConverter,
  Timestamp,
  SetOptions,
  DocumentReference,
  DocumentSnapshot,
  doc,
  setDoc,
  collection, query, getDocs,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from 'boot/firebase'
import { getUser, User } from './user'

export class Post {
  constructor (
    readonly title: string,
    readonly content: string,
    readonly userRef: DocumentReference,
    readonly createdAt?: Date | undefined,
    readonly updatedAt?: Date,
    public userSnapshot?: DocumentSnapshot<User> | undefined
  ) { }

  toJSON () {
    return {
      title: this.title,
      content: this.content,
      userRef: this.userRef,
      createdAt: this.createdAt || serverTimestamp(),
      updatedAt: this.updatedAt || serverTimestamp()
    }
  }

  update (id: string, content: string) {
    const ref = doc(db, 'posts', id).withConverter(converter)
    return setDoc(ref, { content }, { merge: true })
  }

  remove (id: string) {
    const ref = doc(db, 'posts', id)
    return deleteDoc(ref)
  }
}

const converter: FirestoreDataConverter<Post> = {
  toFirestore (model: Post, options?: SetOptions) {
    if (options) return Object.assign(model, { updatedAt: serverTimestamp() })
    return model.toJSON()
  },
  fromFirestore (snapshot) {
    const data = snapshot.data()
    const uid = data.userRef instanceof DocumentReference ? data.userRef.id : ''
    const findUserSnapshot = userSnapshots.find(u => u.id === uid)
    return new Post(
      data.title,
      data.content,
      data.userRef,
      data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
      data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined,
      findUserSnapshot
    )
  }
}
export const setPost = (post: Post) => {
  const ref = doc(db, 'posts', post.title).withConverter(converter)
  return setDoc(ref, post)
}
const userSnapshots: DocumentSnapshot<User>[] = []
export const getPosts = async () => {
  const ref = collection(db, 'posts').withConverter(converter)
  const q = query(ref)
  const sn = await getDocs(q)
  for (const postSnapshot of sn.docs) {
    const data = postSnapshot.data()
    const findUserSnapshot = userSnapshots.find(u => u.id === data.userRef.id)
    if (findUserSnapshot) continue
    const userSnapshot = await getUser(data.userRef.id)
    userSnapshots.push(userSnapshot)
  }

  return sn
}
