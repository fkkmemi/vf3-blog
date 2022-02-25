import { messaging } from 'src/boot/firebase'
import { getToken, onMessage } from 'firebase/messaging'
import { ref } from 'vue'

export const token = ref('')
onMessage(messaging, (payload) => {
  console.log('Message received. ', payload)
  // ...
})
export const useMessaging = () => {
  const setToken = async () => {
    console.log(process.env.VAPID_KEY)
    token.value = await getToken(messaging, { vapidKey: process.env.VAPID_KEY })
    console.log(token.value)
  }

  return { setToken }
}
