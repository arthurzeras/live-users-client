import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const params = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID
}

export const firebaseApp = firebase.initializeApp({
  ...params,
  databaseURL: process.env.VUE_APP_DATABASE_URL
})

export const firebaseApp2 = firebase.initializeApp({
  ...params,
  databaseURL: process.env.VUE_APP_DATABASE2_URL
}, 'app2')

export default function install (Vue) {
  Object.defineProperty(Vue.prototype, '$firebase', {
    get () {
      return firebaseApp
    }
  })
}
