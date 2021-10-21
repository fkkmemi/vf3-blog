import onUser from './events/user'

export const userCreated = onUser.created
export const userDeleted = onUser.deleted

console.log(`run ${new Date().toLocaleString()}`)
