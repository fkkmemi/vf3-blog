import onUser from './events/user'
import onStatus from './events/status'
import onImage from './events/image'

export const userCreated = onUser.created
export const userDeleted = onUser.deleted
export const statusUpdated = onStatus.updated
export const imageDeleted = onImage.deleted

console.log(`run ${new Date().toLocaleString()}`)
