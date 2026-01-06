// ✅ Firebase
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// ✅ Validación de variables de entorno
const validateConfig = () => {
  const requiredKeys = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_FIREBASE_MEASUREMENT_ID',
  ]

  const missingKeys = requiredKeys.filter((key) => !import.meta.env[key])

  if (missingKeys.length > 0) {
    console.error(
      `❌ Error Crítico: Faltan las siguientes variables de entorno para Firebase: ${missingKeys.join(', ')}`,
    )
    throw new Error('Configuración de Firebase incompleta.')
  }
}

// Ejecutar validación al inicio
validateConfig()

// ✅ Configuración de Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// ✅ Inicializa Firebase solo si no hay ninguna app creada (Patrón Singleton)
let app
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

const analytics = getAnalytics(app)
const db = getFirestore(app)
const auth = getAuth(app)

// ✅ Observador de estado de autenticación (opcional, para depuración)
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('✅ Firebase: Usuario autenticado')
  }
})

export { app, db, analytics, auth }
