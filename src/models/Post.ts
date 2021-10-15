import {
  FirestoreDataConverter,
  Timestamp,
  doc,
  setDoc,
  collection, query, getDocs
} from 'firebase/firestore'
import { db } from 'boot/firebase'

export class Post {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    readonly title: string,
    readonly content: string,
    readonly createdAt?: Date | undefined,
    readonly updatedAt?: Date
  ) { }
}

const converter: FirestoreDataConverter<Post> = {
  toFirestore (model: Post) {
    return {
      title: model.title,
      content: model.content,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  fromFirestore (snapshot) {
    const data = snapshot.data()
    return new Post(
      data.title,
      data.content,
      data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
      data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined
    )
  }
}

export const setPost = (post: Post) => {
  const ref = doc(db, 'posts', post.title).withConverter(converter)
  return setDoc(ref, post)
}

export const getPosts = () => {
  const ref = collection(db, 'posts').withConverter(converter)
  const q = query(ref)
  return getDocs(q)
}
