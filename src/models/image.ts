import {
  DocumentReference,
  FirestoreDataConverter,
  doc,
  collection,
  setDoc,
  Timestamp,
  serverTimestamp

} from 'firebase/firestore'
import { db } from 'src/boot/firebase'
import { firebaseUser } from 'src/composables/useAuth'
import useStorage from 'src/composables/useStorage'

export class PostImage {
  constructor (
    readonly name: string,
    readonly size: number,
    readonly userRef: DocumentReference,
    readonly createdAt?: Date | undefined
  ) { }

  toJSON () {
    return {
      name: this.name,
      size: this.size,
      userRef: this.userRef,
      createdAt: this.createdAt || serverTimestamp()
    }
  }
}

const converter: FirestoreDataConverter<PostImage> = {
  toFirestore (model: PostImage) {
    return model.toJSON()
  },
  fromFirestore (snapshot) {
    const data = snapshot.data()
    return new PostImage(
      data.name,
      data.size,
      data.userRef,
      data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined
    )
  }
}

const { uploadFile } = useStorage()

export const setImage = async (file: File) => {
  if (!firebaseUser.value) throw Error('user not signed')
  const userRef = doc(db, 'users', firebaseUser.value.uid)
  const imageRef = doc(collection(db, 'images')).withConverter(converter)
  const originPath = `images/${imageRef.id}/origin`

  await uploadFile(originPath, file)

  const postImage = new PostImage(file.name, file.size, userRef)
  await setDoc(imageRef, postImage)
  return imageRef.id
}
