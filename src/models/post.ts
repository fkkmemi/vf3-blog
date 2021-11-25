import {
  FirestoreDataConverter,
  Timestamp,
  SetOptions,
  DocumentReference,
  DocumentSnapshot,
  doc,
  collection, query, getDocs,
  serverTimestamp,
  getDoc,
  writeBatch
} from 'firebase/firestore'
import { db } from 'boot/firebase'
import { getUser, User } from './user'
import { firebaseUser } from 'src/composables/useAuth'
import {
  Content, converter as contentConverter,
  getContents
} from './content'

export class Post {
  constructor (
    readonly title: string,
    readonly summary: string,
    readonly userRef: DocumentReference,
    readonly createdAt?: Date | undefined,
    readonly updatedAt?: Date,
    public userSnapshot?: DocumentSnapshot<User> | undefined,
    public content?: string | undefined
  ) { }

  toJSON () {
    return {
      title: this.title,
      summary: this.summary,
      userRef: this.userRef,
      createdAt: this.createdAt || serverTimestamp(),
      updatedAt: this.updatedAt || serverTimestamp()
    }
  }

  // update (id: string, content: string) {
  //   const ref = doc(db, 'posts', id).withConverter(converter)
  //   return setDoc(ref, { content }, { merge: true })
  // }

  // remove (id: string) {
  //   const ref = doc(db, 'posts', id)
  //   return deleteDoc(ref)
  // }
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
      data.summary,
      data.userRef,
      data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
      data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined,
      findUserSnapshot
    )
  }
}

const titleToId = (text: string) => {
  // eslint-disable-next-line no-useless-escape
  const pattern = /[\{\}\[\]\/?.,;:|\)*~`!^\_+<>@\#$%&\\\=\(\'\"]/gi

  return text.replace(pattern, '').split(' ').join('-')
}

const contentsToChunks = (str: string) => {
  const chunks = []
  const tmps = []
  const lines = str.split('\n')
  for (const line of lines) {
    tmps.push(line)
    const joinStr = tmps.join('\n')
    if (joinStr.length < 1000) continue
    chunks.push(joinStr)
    tmps.splice(0, tmps.length)
  }
  if (tmps.length) chunks.push(tmps.join('\n'))
  return chunks
}

export const setPost = async (title: string, content: string) => {
  if (!firebaseUser.value) throw Error('user not signed')
  const batch = writeBatch(db)
  const userRef = doc(db, 'users', firebaseUser.value.uid)
  const id = titleToId(title)
  const chunks = contentsToChunks(content)
  const summary = content.slice(0, 100) // chunks.splice(0, 1).join('\n')

  const postRef = doc(db, 'posts', id).withConverter(converter)
  const post = new Post(
    title,
    summary,
    userRef
  )
  batch.set(postRef, post)
  const sn = await getContents(id)
  sn.docs.forEach(d => batch.delete(d.ref))
  chunks.forEach((c, i) => {
    const ref = doc(collection(db, 'posts', id, 'contents')).withConverter(contentConverter)
    batch.set(ref, new Content(i, c))
  })

  await batch.commit()
  return id
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

export const getPost = async (id: string) => {
  const ref = doc(db, 'posts', id).withConverter(converter)
  const postSnapshot = await getDoc(ref)
  const post = postSnapshot.data()
  if (!post) throw Error('post not exists')
  const contentsSnapshot = await getContents(id)
  const contents = contentsSnapshot.docs.map(d => d.data().content)
  post.content = contents.join('\n')
  return post
}

export const deletePost = async (id: string) => {
  const batch = writeBatch(db)
  const sn = await getContents(id)
  sn.docs.forEach(d => batch.delete(d.ref))
  batch.delete(doc(db, 'posts', id))
  return await batch.commit()
}
