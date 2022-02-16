import {
  onSnapshot,
  doc,
  Unsubscribe,
  DocumentSnapshot,
  getDoc,
  writeBatch,
  collection,
  query,
  getDocs,
  orderBy,
  increment,
  updateDoc
} from 'firebase/firestore'
import { db } from 'boot/firebase'
import { User, converter as userConverter } from 'src/models/user'
import { User as FirebaseUser } from 'firebase/auth'
import { firebaseUser } from 'src/composables/useAuth'
import { ref } from 'vue'
import { postConverter } from 'src/models/post'
import { Content, contentConverter } from 'src/models/content'

const unsubscribe = ref<Unsubscribe | null>()
export const user = ref<User | null>()
export const userSnapshots = ref<DocumentSnapshot<User>[]>([])

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

export const useFirestore = () => {
  const onSnapshotUser = (firebaseUser: FirebaseUser) => {
    const userRef = doc(db, 'users', firebaseUser.uid).withConverter(userConverter)
    unsubscribe.value = onSnapshot(userRef, sn => {
      // console.log(sn.data())
      user.value = sn.data()
    })
  }
  const offSnapshotUser = () => {
    if (unsubscribe.value) unsubscribe.value()
  }

  const setPost = async (title: string, content: string, thumbnail: string, category: string, tags: string[], merge: boolean) => {
    if (!firebaseUser.value) throw Error('user not signed')
    const batch = writeBatch(db)
    const userRef = doc(db, 'users', firebaseUser.value.uid)
    const id = titleToId(title)
    const chunks = contentsToChunks(content)
    const summary = chunks.splice(0, 1).join('\n').slice(300)

    const postRef = doc(db, 'posts', id).withConverter(postConverter)
    // const post = new Post(
    //   title,
    //   summary,
    //   thumbnail,
    //   category,
    //   tags,
    //   userRef,
    //   0
    // )
    // batch.set(postRef, post, { merge: true })
    const post = { title, summary, thumbnail, category, tags, userRef }
    batch.set(postRef, post, { merge })

    const ref = collection(db, 'posts', id, 'contents').withConverter(contentConverter)
    const q = query(ref, orderBy('no'))
    const sn = await getDocs(q)
    sn.docs.forEach(d => batch.delete(d.ref))
    chunks.forEach((c, i) => {
      const ref = doc(collection(db, 'posts', id, 'contents')).withConverter(contentConverter)
      batch.set(ref, new Content(i, c))
    })

    await batch.commit()
    return id
  }

  const getPosts = async () => {
    const ref = collection(db, 'posts').withConverter(postConverter)
    const q = query(ref)
    const sn = await getDocs(q)

    return sn
  }

  const getPost = async (id: string) => {
    const ref = doc(db, 'posts', id).withConverter(postConverter)
    await updateDoc(ref, { readCount: increment(1) })
    const postDoc = await getDoc(ref)
    return postDoc
  }

  const getContents = async (id: string) => {
    const ref = collection(db, 'posts', id, 'contents').withConverter(contentConverter)
    const q = query(ref, orderBy('no'))
    const sn = await getDocs(q)
    return sn
  }

  const getContentString = async (id: string) => {
    const sn = await getContents(id)
    if (sn.empty) return ''
    const contents = sn.docs.map(d => d.data().content)
    return contents.join('\n')
  }

  const deletePost = async (id: string) => {
    const batch = writeBatch(db)
    const sn = await getContents(id)
    sn.docs.forEach(d => batch.delete(d.ref))
    batch.delete(doc(db, 'posts', id))
    return await batch.commit()
  }

  return {
    onSnapshotUser,
    offSnapshotUser,
    setPost,
    getPost,
    getPosts,
    getContentString,
    deletePost
  }
}
