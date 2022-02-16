import {
  FirestoreDataConverter
} from 'firebase/firestore'

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

export const contentConverter: FirestoreDataConverter<Content> = {
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
