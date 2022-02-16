import {
  FirestoreDataConverter,
  Timestamp,
  SetOptions,
  DocumentReference,
  serverTimestamp,
  PartialWithFieldValue
} from 'firebase/firestore'

export class Post {
  constructor (
    readonly title: string,
    readonly summary: string,
    readonly thumbnail: string,
    readonly category: string,
    readonly tags: string[],
    readonly userRef: DocumentReference,
    readonly readCount?: number,
    readonly createdAt?: Date | undefined,
    readonly updatedAt?: Date
  ) { }

  toJSON () {
    return {
      title: this.title,
      summary: this.summary,
      thumbnail: this.thumbnail,
      category: this.category,
      tags: this.tags,
      userRef: this.userRef,
      readCount: this.readCount,
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
// interface CustomSetOptions extends SetOptions {
//   merge: boolean;
// }
export const postConverter: FirestoreDataConverter<Post> = {
  toFirestore (model: PartialWithFieldValue<Post>, options?: SetOptions) {
    // @ts-expect-error: Unreachable code error
    if (options?.merge) return Object.assign(model, { updatedAt: serverTimestamp() })
    return {
      title: model.title,
      summary: model.summary,
      thumbnail: model.thumbnail,
      category: model.category,
      tags: model.tags,
      userRef: model.userRef,
      readCount: model.readCount || 0,
      createdAt: model.createdAt || serverTimestamp(),
      updatedAt: model.updatedAt || serverTimestamp()
    }
  },
  fromFirestore (snapshot) {
    const data = snapshot.data()
    return new Post(
      data.title,
      data.summary,
      data.thumbnail,
      data.category,
      data.tags,
      data.userRef,
      data.readCount,
      data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
      data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined
    )
  }
}
