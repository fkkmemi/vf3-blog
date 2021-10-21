import * as functions from 'firebase-functions'
import { createUser, deleteUser } from '../models/user'

const created = functions.auth.user().onCreate((user) => {
  return createUser(user)
})

const deleted = functions.auth.user().onDelete((user) => {
  return deleteUser(user)
})

export default { created, deleted }
