/* eslint-env node */
require('dotenv').config()
console.log('🚀 INICIO DEL SCRIPT SERVER.JS')
console.log('Variables de entorno cargadas.')
// Usamos fs.promises para lectura asíncrona
const fs = require('fs').promises
const path = require('path')
const express = require('express')
const axios = require('axios')
const cors = require('cors')
const AWS = require('aws-sdk')
const admin = require('firebase-admin')

// --- MANEJO DE ERRORES GLOBALES ---
process.on('uncaughtException', (err) => {
  console.error('🔥 Excepción no capturada:', err)
})
process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 Rechazo de promesa no manejado:', reason)
})

const app = express()
const PORT = process.env.PORT || 3000
console.log(`Puerto configurado: ${PORT}`)

// ==========================================
// 1. RUTA DE SALUD (¡LO PRIMERO!)
// ==========================================
// Esta ruta debe responder INSTANTÁNEAMENTE para que Railway no mate el servidor.
app.get('/', (req, res) => {
  res.status(200).send('OK')
})

// Middlewares
app.use(cors())
app.use(express.json())

// ==========================================
// 2. VARIABLES GLOBALES (Se llenarán al iniciar)
// ==========================================
let db = null
let s3 = null
let indexTemplate = null

// Valores por defecto para los metadatos del blog
const defaultMeta = {
  title: 'Crianza Sana by Kids',
  description: 'Especialistas en el desarrollo integral de niños y niñas.',
  image: 'https://csdkids-images.s3.us-east-2.amazonaws.com/portadota.png',
}
// URL base de tu frontend en Hostinger
const FRONTEND_BASE_URL = 'https://staging.crianzasanabydkids.mx'

// ==========================================
// 3. FUNCIÓN DE INICIALIZACIÓN ASÍNCRONA
// ==========================================
async function initializeServices() {
  console.log('🔵 Iniciando servicios en segundo plano...')

  try {
    // --- FIREBASE ---
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      throw new Error('Falta la variable de entorno FIREBASE_SERVICE_ACCOUNT')
    }
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
    db = admin.firestore()
    console.log('✅ Firebase Admin inicializado.')

    // --- AWS ---
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    })
    s3 = new AWS.S3()
    console.log('✅ AWS S3 inicializado.')

    // --- LEER PLANTILLA HTML (Asíncrono) ---
    const templatePath = path.join(__dirname, 'templates', 'index.html')
    // Usamos await para no bloquear el hilo principal
    indexTemplate = await fs.readFile(templatePath, 'utf8')
    console.log('✅ Plantilla HTML cargada.')

    console.log('🟢 ¡Todos los servicios listos y operativos!')
  } catch (error) {
    console.error('🔴 ERROR CRÍTICO inicializando servicios:', error)
    // No hacemos process.exit(1) para que el servidor siga vivo y responda al health check,
    // pero las rutas protegidas darán error 503.
  }
}

// ==========================================
// 4. MIDDLEWARE DE SEGURIDAD
// ==========================================
// Asegura que los servicios están listos antes de procesar una petición que los necesite.
const ensureServicesReady = (req, res, next) => {
  if (!db || !s3 || !indexTemplate) {
    console.warn('⚠️ Petición recibida antes de que los servicios estuvieran listos.')
    return res.status(503).json({
      error: 'El servidor se está iniciando. Por favor, intenta de nuevo en unos segundos.',
      retryAfter: 5,
    })
  }
  next()
}

// ==========================================
// 5. RUTAS (Protegidas con el middleware)
// ==========================================

// --- SPOTIFY (No necesita db/s3, pero sí axios) ---
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const SHOW_ID = '4A7KWpa53WZnevgOBDYEHj'
let accessToken = null
let tokenExpiration = null

async function getSpotifyToken() {
  if (accessToken && tokenExpiration > Date.now()) return accessToken
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({ grant_type: 'client_credentials' }),
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    accessToken = response.data.access_token
    tokenExpiration = Date.now() + (response.data.expires_in - 60) * 1000
    return accessToken
  } catch (error) {
    console.error('Error Spotify Token:', error.message)
    throw error
  }
}

app.get('/api/episodios', async (req, res) => {
  try {
    const token = await getSpotifyToken()
    const response = await axios.get(
      `https://api.spotify.com/v1/shows/${SHOW_ID}/episodes?limit=10&market=MX`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    res.json(response.data.items)
  } catch (error) {
    console.error('Error /api/episodios:', error.message)
    res.status(500).json({ error: 'Error al obtener episodios' })
  }
})

// --- AWS ENDPOINTS (Necesitan s3) ---
app.get('/api/aws/read-url', ensureServicesReady, async (req, res) => {
  const { key } = req.query
  if (!key) return res.status(400).json({ error: 'Key is required' })
  const params = { Bucket: process.env.AWS_BUCKET_NAME, Key: key, Expires: 3600 }
  try {
    const url = await s3.getSignedUrlPromise('getObject', params)
    res.json({ url })
  } catch (error) {
    console.error('Error AWS Read URL:', error)
    res.status(500).json({ error: 'Error generating read URL' })
  }
})

app.post('/api/aws/upload-url', ensureServicesReady, async (req, res) => {
  const { key, contentType } = req.body
  if (!key) return res.status(400).json({ error: 'Key is required' })
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: 300,
    ContentType: contentType || 'application/octet-stream',
    ACL: 'public-read',
  }
  try {
    const url = await s3.getSignedUrlPromise('putObject', params)
    res.json({ url })
  } catch (error) {
    console.error('Error AWS Upload URL:', error)
    res.status(500).json({ error: 'Error generating upload URL' })
  }
})

// --- FIREBASE ENDPOINTS (Necesitan db) ---

// 1. Get People
app.get('/api/firestore/people', ensureServicesReady, async (req, res) => {
  try {
    const querySnapshot = await db.collection('people').where('isSpecialist', '==', 1).get()
    const people = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const personData = { id: doc.id, ...doc.data() }
        const socialsSnapshot = await db.collection(`people/${doc.id}/socials`).get()
        personData.socials = socialsSnapshot.docs.map((s) => ({ id: s.id, ...s.data() }))
        return personData
      }),
    )
    res.json(people)
  } catch (error) {
    console.error('Error Firestore People:', error)
    res.status(500).json({ error: 'Error fetching people' })
  }
})

// 2. Get Reels
app.get('/api/firestore/reels', ensureServicesReady, async (req, res) => {
  const { personId } = req.query
  if (!personId) return res.status(400).json({ error: 'personId required' })
  try {
    const querySnapshot = await db
      .collection('reels')
      .where('idPersona', '==', String(personId))
      .get()
    const reels = querySnapshot.docs
      .map((doc) => {
        const data = doc.data()
        try {
          const url = data.url
          if (!url) return null
          const match = url.match(/\/reel\/([^/?#]+)/)
          return match ? match[1] : null
        } catch (e) {
          return null
        }
      })
      .filter((id) => id !== null)
    res.json(reels)
  } catch (error) {
    console.error('Error Firestore Reels:', error)
    res.status(500).json({ error: 'Error fetching reels' })
  }
})

// 3. Get Campaign
app.get('/api/firestore/campaign', ensureServicesReady, async (req, res) => {
  try {
    const docRef = db.collection('campana').doc('tVNJj7bqmEXeUYjb60r2')
    const snap = await docRef.get()
    if (snap.exists) {
      const data = snap.data()
      const { finalDate, img } = data
      if (!finalDate || !img) return res.json(null)
      const [day, month, year] = finalDate.split('-').map(Number)
      const expiryDate = new Date(year, month - 1, day)
      expiryDate.setHours(23, 59, 59, 999)
      const now = new Date()
      if (now <= expiryDate) {
        res.json({ img, show: true })
      } else {
        res.json({ img, show: false })
      }
    } else {
      res.json(null)
    }
  } catch (error) {
    console.error('Error Firestore Campaign:', error)
    res.status(500).json({ error: 'Error fetching campaign' })
  }
})

// 4. Get Videos (Programas)
app.get('/api/firestore/videos', ensureServicesReady, async (req, res) => {
  try {
    const snapshot = await db.collection('programas').get()
    const videos = snapshot.docs.map((doc) => {
      const data = doc.data()
      return { id: doc.id, ...data, parsedDate: new Date(data.date.split('-').reverse().join('-')) }
    })
    videos.sort((a, b) => b.parsedDate - a.parsedDate)
    res.json(videos)
  } catch (error) {
    console.error('Error Firestore Videos:', error)
    res.status(500).json({ error: 'Error fetching videos' })
  }
})

// 5. Get Collection (Generic)
app.get('/api/firestore/collection/:name', ensureServicesReady, async (req, res) => {
  const { name } = req.params
  const { orderField = 'orden', orderDirection = 'asc' } = req.query
  try {
    const snapshot = await db.collection(name).orderBy(orderField, orderDirection).get()
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json(items)
  } catch (error) {
    console.error(`Error Firestore Collection ${name}:`, error)
    res.status(500).json({ error: `Error fetching collection ${name}` })
  }
})

// 6. Get Blog Comments
app.get('/api/firestore/blogs/:id/comments', ensureServicesReady, async (req, res) => {
  const { id } = req.params
  try {
    const snapshot = await db.collection(`blogs/${id}/comments`).get()
    const comments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json(comments)
  } catch (error) {
    console.error(`Error Firestore Blog Comments ${id}:`, error)
    res.status(500).json({ error: 'Error fetching blog comments' })
  }
})

// 7. Get Galleries
app.get('/api/firestore/galleries', ensureServicesReady, async (req, res) => {
  try {
    const snapshot = await db.collection('galerias').get()
    const galleries = await Promise.all(
      snapshot.docs.map(async (docGaleria) => {
        const galeriaData = docGaleria.data()
        const fotosSnapshot = await db.collection(`galerias/${docGaleria.id}/fotos`).get()
        const fotos = fotosSnapshot.docs.map((f) => ({ id: f.id, ...f.data(), comments: [] }))
        return { id: docGaleria.id, ...galeriaData, images: fotos }
      }),
    )
    res.json(galleries)
  } catch (error) {
    console.error('Error Firestore Galleries:', error)
    res.status(500).json({ error: 'Error fetching galleries' })
  }
})

// 8. Get Image Comments
app.get(
  '/api/firestore/galleries/:galeriaId/images/:imageId/comments',
  ensureServicesReady,
  async (req, res) => {
    const { galeriaId, imageId } = req.params
    try {
      const snapshot = await db
        .collection(`galerias/${galeriaId}/fotos/${imageId}/comments`)
        .orderBy('createdAt', 'desc')
        .get()
      const comments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      res.json(comments)
    } catch (error) {
      console.error(`Error Firestore Image Comments ${imageId}:`, error)
      res.status(500).json({ error: 'Error fetching image comments' })
    }
  },
)

// 9. Get Video Comments
app.get('/api/firestore/videos/:id/comments', ensureServicesReady, async (req, res) => {
  const { id } = req.params
  try {
    const snapshot = await db.collection(`programas/${id}/comments`).get()
    const comments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json(comments)
  } catch (error) {
    console.error(`Error Firestore Video Comments ${id}:`, error)
    res.status(500).json({ error: 'Error fetching video comments' })
  }
})

// 10. Get Programs (Temas)
app.get('/api/firestore/programs', ensureServicesReady, async (req, res) => {
  try {
    const snapshot = await db.collection('temas').get()
    const programs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json(programs)
  } catch (error) {
    console.error('Error Firestore Programs (Temas):', error)
    res.status(500).json({ error: 'Error fetching programs' })
  }
})

// --- RUTA ESPECIAL PARA COMPARTIR BLOGS (Necesita db e indexTemplate) ---
app.get('/blog/:id', ensureServicesReady, async (req, res) => {
  const blogId = req.params.id
  console.log(`🤖 Solicitud de blog para metadatos: ${blogId}`)

  try {
    const blogRef = db.collection('blogs').doc(blogId)
    const doc = await blogRef.get()

    let metaData = defaultMeta

    if (doc.exists) {
      const blogData = doc.data()
      metaData = {
        title: blogData.title || defaultMeta.title,
        description:
          blogData.title1 || blogData.text?.substring(0, 150) + '...' || defaultMeta.description,
        image: blogData.imageUrl || defaultMeta.image,
      }
      console.log('✅ Datos del blog encontrados:', metaData.title)
    } else {
      console.log('❌ Blog no encontrado en Firebase, usando defaults')
    }

    const finalRedirectUrl = `${FRONTEND_BASE_URL}/blog/${blogId}`

    // Reemplazar los placeholders en la plantilla HTML
    // Usamos una expresión regular global (/.../g) para reemplazar todas las ocurrencias
    let finalHtml = indexTemplate
      .replace(/__OG_TITLE__/g, metaData.title)
      .replace(/__OG_DESCRIPTION__/g, metaData.description)
      .replace(/__OG_IMAGE__/g, metaData.image)
      .replace(/__FRONTEND_REDIRECT_URL__/g, finalRedirectUrl)

    res.send(finalHtml)
  } catch (error) {
    console.error('❌ Error generando metadatos del blog:', error)
    // En caso de error, redirigir al home del frontend por seguridad
    res.redirect(FRONTEND_BASE_URL)
  }
})

// ==========================================
// 6. ¡ARRANCAR EL SERVIDOR!
// ==========================================
// Primero empezamos a escuchar. El Health Check funcionará inmediatamente.
app.listen(PORT, '0.0.0.0', () => {
  // 👈 AGREGA '0.0.0.0' AQUÍ
  console.log(`🚀 Servidor backend escuchando en puerto ${PORT}`)
  console.log(`🩺 Health check disponible en http://0.0.0.0:${PORT}/`)

  // Una vez que escuchamos, iniciamos los servicios pesados
  initializeServices()
})

process.on('SIGTERM', () => {
  console.log('🛑 Recibido SIGTERM. Cerrando servidor grácilmente...')
  process.exit(0)
})
