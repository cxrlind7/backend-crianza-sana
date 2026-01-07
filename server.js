/* eslint-env node */
import 'dotenv/config' // Usamos import para dotenv
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import axios from 'axios'
import cors from 'cors'
import AWS from 'aws-sdk'
import admin from 'firebase-admin'
import {
  getBlogPageViews,
  getHomepageDailyViews,
  getRoutePageViews,
  getPersonPageViews,
  getBlogEventBreakdown,
} from './utils/getAnalyticsData.js'
// import compression from 'compression'
// --- CONFIGURACIÓN DE RUTAS Y DIRECTORIOS ---
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🚀 INICIO DEL SERVIDOR UNIFICADO')

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
// 1. RUTA DE SALUD (Health Check)
// ==========================================
app.get('/health', (req, res) => {
  console.log('💓 Health Check recibido.')
  res.set('Connection', 'close')
  res.status(200).send('OK')
})

// Middlewares
app.use(cors())
app.use(express.json())

// ==========================================
// 2. VARIABLES GLOBALES (Servicios)
// ==========================================
let db = null
let s3 = null
let indexTemplate = null

// Valores por defecto para metadatos del blog
const defaultMeta = {
  title: 'Crianza Sana by Kids',
  description: 'Especialistas en el desarrollo integral de niños y niñas.',
  image: 'https://csdkids-images.s3.us-east-2.amazonaws.com/portadota.png',
}
const FRONTEND_BASE_URL = 'https://staging.crianzasanabydkids.mx' // Ajusta según tu dominio real

// ==========================================
// 3. INICIALIZACIÓN DE SERVICIOS
// ==========================================
async function initializeServices() {
  console.log('🔵 Iniciando servicios en segundo plano...')

  try {
    // --- FIREBASE ---
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      // Verificar si ya existe una app para no reinicializar
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        })
      }
      db = admin.firestore()
      console.log('✅ Firebase Admin inicializado.')
    } else {
      console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT no definida. Firebase no funcionará.')
    }

    // --- AWS ---
    if (process.env.AWS_ACCESS_KEY_ID) {
      AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      })
      s3 = new AWS.S3()
      console.log('✅ AWS S3 inicializado.')
    } else {
      console.warn('⚠️ Credenciales AWS no definidas. S3 no funcionará.')
    }

    // --- LEER PLANTILLA HTML ---
    // Intentamos leer primero de dist/index.html (producción), si no, de templates/index.html (fallback)
    const distIndexPath = path.join(__dirname, 'dist', 'index.html')
    const templatePath = path.join(__dirname, 'templates', 'index.html')

    try {
      await fs.access(distIndexPath)
      indexTemplate = await fs.readFile(distIndexPath, 'utf8')
      console.log('✅ Plantilla HTML cargada desde dist/index.html')
    } catch (e) {
      console.log('ℹ️ dist/index.html no encontrado, buscando en templates...')
      try {
        indexTemplate = await fs.readFile(templatePath, 'utf8')
        console.log('✅ Plantilla HTML cargada desde templates/index.html')
      } catch (err) {
        console.warn('⚠️ No se pudo cargar ninguna plantilla HTML. El SEO dinámico no funcionará.')
      }
    }

    console.log('🟢 Servicios inicializados.')
  } catch (error) {
    console.error('🔴 ERROR CRÍTICO inicializando servicios:', error)
  }
}

// Middleware para asegurar servicios listos (opcional, para rutas críticas)
const ensureServicesReady = (req, res, next) => {
  if (!db && req.path.includes('firestore')) {
    // Solo bloqueamos si realmente necesitamos DB y no está
    // Podríamos ser más permisivos o estrictos según necesidad
  }
  next()
}

// ==========================================
// 4. API ENDPOINTS
// ==========================================

// --- SPOTIFY ---
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const SHOW_ID = '4A7KWpa53WZnevgOBDYEHj'
let spotifyAccessToken = null
let spotifyTokenExpiration = null

async function getSpotifyToken() {
  if (spotifyAccessToken && spotifyTokenExpiration > Date.now()) return spotifyAccessToken
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
    spotifyAccessToken = response.data.access_token
    spotifyTokenExpiration = Date.now() + (response.data.expires_in - 60) * 1000
    return spotifyAccessToken
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
      { headers: { Authorization: `Bearer ${token}` } },
    )
    res.json(response.data.items)
  } catch (error) {
    console.error('Error /api/episodios:', error.message)
    res.status(500).json({ error: 'Error al obtener episodios' })
  }
})

// --- ANALYTICS (Google Analytics 4) ---
app.get('/api/routes-views', async (req, res) => {
  try {
    const paths = ['/about', '/blog', '/programs', '/login', '/live', '/gallery']
    const { startDate, endDate } = req.query
    const data = await getRoutePageViews(paths, startDate, endDate)
    res.json(data)
  } catch (error) {
    console.error('Error analytics routes-views:', error)
    res.status(500).json({ error: 'Error interno' })
  }
})

app.get('/api/blog-views', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const data = await getBlogPageViews(startDate, endDate)
    res.json(data)
  } catch (error) {
    console.error('Error analytics blog-views:', error)
    res.status(500).json({ error: 'Error interno' })
  }
})

app.get('/api/person-views', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const data = await getPersonPageViews(startDate, endDate)
    res.json(data)
  } catch (error) {
    console.error('Error analytics person-views:', error)
    res.status(500).json({ error: 'Error interno' })
  }
})

app.get('/api/homepage-views', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const data = await getHomepageDailyViews(startDate, endDate)
    res.json(data)
  } catch (error) {
    console.error('Error analytics homepage-views:', error)
    res.status(500).json({ error: 'Error interno' })
  }
})

app.get('/api/blog-events-breakdown', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const data = await getBlogEventBreakdown(startDate, endDate)
    res.json(data)
  } catch (error) {
    console.error('Error analytics blog-events:', error)
    res.status(500).json({ error: 'Error interno' })
  }
})

// --- AWS S3 ---
app.get('/api/aws/read-url', async (req, res) => {
  if (!s3) return res.status(503).json({ error: 'Servicio AWS no disponible' })
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

app.post('/api/aws/upload-url', async (req, res) => {
  if (!s3) return res.status(503).json({ error: 'Servicio AWS no disponible' })
  const { key, contentType } = req.body
  // Soporte para fileName/fileType (legacy) o key/contentType
  const finalKey = key || req.body.fileName
  const finalType = contentType || req.body.fileType

  if (!finalKey) return res.status(400).json({ error: 'Key/FileName is required' })

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: finalKey,
    Expires: 300,
    ContentType: finalType || 'application/octet-stream',
    ACL: 'public-read',
  }
  try {
    const url = await s3.getSignedUrlPromise('putObject', params)
    res.json({ url }) // Devolvemos { url } o { uploadUrl: url } según necesite el front
  } catch (error) {
    console.error('Error AWS Upload URL:', error)
    res.status(500).json({ error: 'Error generating upload URL' })
  }
})

// --- FIREBASE FIRESTORE ---
// Helper para verificar DB
const checkDb = (res) => {
  if (!db) {
    res.status(503).json({ error: 'Base de datos no disponible' })
    return false
  }
  return true
}

app.get('/api/firestore/people', async (req, res) => {
  if (!checkDb(res)) return
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

app.get('/api/firestore/reels', async (req, res) => {
  if (!checkDb(res)) return
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

app.get('/api/firestore/campaign', async (req, res) => {
  if (!checkDb(res)) return
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
      res.json({ img, show: now <= expiryDate })
    } else {
      res.json(null)
    }
  } catch (error) {
    console.error('Error Firestore Campaign:', error)
    res.status(500).json({ error: 'Error fetching campaign' })
  }
})

app.get('/api/firestore/videos', async (req, res) => {
  if (!checkDb(res)) return
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

app.get('/api/firestore/collection/:name', async (req, res) => {
  if (!checkDb(res)) return
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

app.get('/api/firestore/blogs/:id/comments', async (req, res) => {
  if (!checkDb(res)) return
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

app.get('/api/firestore/galleries', async (req, res) => {
  if (!checkDb(res)) return
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

app.get('/api/firestore/galleries/:galeriaId/images/:imageId/comments', async (req, res) => {
  if (!checkDb(res)) return
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
})

app.get('/api/firestore/videos/:id/comments', async (req, res) => {
  if (!checkDb(res)) return
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

app.get('/api/firestore/programs', async (req, res) => {
  if (!checkDb(res)) return
  try {
    const snapshot = await db.collection('temas').get()
    const programs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json(programs)
  } catch (error) {
    console.error('Error Firestore Programs (Temas):', error)
    res.status(500).json({ error: 'Error fetching programs' })
  }
})

// --- SEO / SERVER SIDE RENDERING (LIGERO) ---
app.get('/blog/:id', async (req, res) => {
  const blogId = req.params.id
  console.log(`🤖 Solicitud de blog para metadatos: ${blogId}`)

  if (!indexTemplate) {
    // Si no hay template, redirigir al home o servir archivo estático normal
    return res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  }

  try {
    let metaData = defaultMeta
    if (db) {
      const blogRef = db.collection('blogs').doc(blogId)
      const doc = await blogRef.get()
      if (doc.exists) {
        const blogData = doc.data()
        metaData = {
          title: blogData.title || defaultMeta.title,
          description:
            blogData.title1 || blogData.text?.substring(0, 150) + '...' || defaultMeta.description,
          image: blogData.imageUrl || defaultMeta.image,
        }
      }
    }

    const finalRedirectUrl = `${FRONTEND_BASE_URL}/blog/${blogId}`
    let finalHtml = indexTemplate
      .replace(/__OG_TITLE__/g, metaData.title)
      .replace(/__OG_DESCRIPTION__/g, metaData.description)
      .replace(/__OG_IMAGE__/g, metaData.image)
      .replace(/__FRONTEND_REDIRECT_URL__/g, finalRedirectUrl)

    res.send(finalHtml)
  } catch (error) {
    console.error('❌ Error generando metadatos del blog:', error)
    res.redirect('/')
  }
})
// app.use(compression())
// ==========================================
// 5. SERVIR FRONTEND (VUE)
// ==========================================
// Servir archivos estáticos de la carpeta dist
app.use(express.static(path.join(__dirname, 'dist')))

// Cualquier otra ruta que no sea API, enviar al index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// ==========================================
// 6. ARRANCAR SERVIDOR
// ==========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor unificado escuchando en puerto ${PORT}`)

  initializeServices().catch((err) => {
    console.error('Error fatal iniciando servicios:', err)
  })
})
