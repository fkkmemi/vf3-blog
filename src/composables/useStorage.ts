import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from 'boot/firebase'
import imageCompression from 'browser-image-compression'

export default () => {
  const uploadFile = (path: string, file: File) => {
    const storageRef = ref(storage, path)
    return uploadBytes(storageRef, file)
  }

  const getURL = (path: string) => {
    const storageRef = ref(storage, path)
    return getDownloadURL(storageRef)
  }

  const imageCompress = (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 480,
      useWebWorker: true
    }
    return imageCompression(file, options)
  }
  return { uploadFile, getURL, imageCompress }
}
