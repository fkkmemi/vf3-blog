import {
  FirestoreDataConverter,
  collection,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore'
import { db } from 'boot/firebase'

export class Content {
  constructor (
    readonly no: number,
    readonly content: string
  ) { }

  toJSON () {
    return {
      no: this.no,
      content: this.content
    }
  }
}

export const converter: FirestoreDataConverter<Content> = {
  toFirestore (model: Content) {
    return model.toJSON()
  },
  fromFirestore (snapshot) {
    const data = snapshot.data()
    return new Content(
      data.no,
      data.content
    )
  }
}

export const getContents = async (id: string) => {
  const ref = collection(db, 'posts', id, 'contents').withConverter(converter)
  const q = query(ref, orderBy('no'))
  return await getDocs(q)
}
