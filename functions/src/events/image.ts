import * as functions from 'firebase-functions'
import { storage } from '../plugins/firebase'
import path from 'path'

const deleted = functions.firestore.document('images/{id}').onDelete((snapshot, context) => {
  const imageDir = path.join('images', context.params.id)
  return storage.bucket().deleteFiles({ prefix: imageDir })
})

export default { deleted }
