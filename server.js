require('dotenv').config()
const express = require('express')
const axios = require('axios')
const cors = require('cors')
const AWS = require('aws-sdk')
const { initializeApp } = require('firebase/app')
const {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  orderBy,
} = require('firebase/firestore')

const app = express()
app.use(cors())
app.use(express.json())

// --- CONFIGURACIÓN AWS ---
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})
const s3 = new AWS.S3()

// --- CONFIGURACIÓN FIREBASE ---
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

// --- SPOTIFY ---
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

// --- AWS ENDPOINTS ---

app.get('/api/aws/read-url', async (req, res) => {
  const { key } = req.query
  if (!key) return res.status(400).json({ error: 'Key is required' })

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: 3600,
  }

  try {
    const url = await s3.getSignedUrlPromise('getObject', params)
    res.json({ url })
  } catch (error) {
    console.error('Error AWS Read URL:', error)
    res.status(500).json({ error: 'Error generating read URL' })
  }
})

app.post('/api/aws/upload-url', async (req, res) => {
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

// --- FIREBASE ENDPOINTS ---

// 1. Get People
app.get('/api/firestore/people', async (req, res) => {
  try {
    const q = query(collection(db, 'people'), where('isSpecialist', '==', 1))
    const querySnapshot = await getDocs(q)

    const people = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const personData = { id: doc.id, ...doc.data() }
        const socialsRef = collection(db, `people/${doc.id}/socials`)
        const socialsSnapshot = await getDocs(socialsRef)
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
app.get('/api/firestore/reels', async (req, res) => {
  const { personId } = req.query
  if (!personId) return res.status(400).json({ error: 'personId required' })

  try {
    const q = query(collection(db, 'reels'), where('idPersona', '==', String(personId)))
    const querySnapshot = await getDocs(q)

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
app.get('/api/firestore/campaign', async (req, res) => {
  try {
    const docRef = doc(db, 'campana', 'tVNJj7bqmEXeUYjb60r2')
    const snap = await getDoc(docRef)

    if (snap.exists()) {
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
app.get('/api/firestore/videos', async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, 'programas'))
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
app.get('/api/firestore/collection/:name', async (req, res) => {
  const { name } = req.params
  const { orderField = 'orden', orderDirection = 'asc' } = req.query
  try {
    const q = query(collection(db, name), orderBy(orderField, orderDirection))
    const snapshot = await getDocs(q)
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json(items)
  } catch (error) {
    console.error(`Error Firestore Collection ${name}:`, error)
    res.status(500).json({ error: `Error fetching collection ${name}` })
  }
})

// 6. Get Blog Comments
app.get('/api/firestore/blogs/:id/comments', async (req, res) => {
  const { id } = req.params
  try {
    const commentsRef = collection(db, `blogs/${id}/comments`)
    const snapshot = await getDocs(commentsRef)
    const comments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json(comments)
  } catch (error) {
    console.error(`Error Firestore Blog Comments ${id}:`, error)
    res.status(500).json({ error: 'Error fetching blog comments' })
  }
})

// 7. Get Galleries
app.get('/api/firestore/galleries', async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, 'galerias'))
    const galleries = await Promise.all(
      snapshot.docs.map(async (docGaleria) => {
        const galeriaData = docGaleria.data()
        const fotosRef = collection(db, `galerias/${docGaleria.id}/fotos`)
        const fotosSnapshot = await getDocs(fotosRef)
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
app.get('/api/firestore/galleries/:galeriaId/images/:imageId/comments', async (req, res) => {
  const { galeriaId, imageId } = req.params
  try {
    const commentsRef = collection(db, `galerias/${galeriaId}/fotos/${imageId}/comments`)
    const q = query(commentsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    const comments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json(comments)
  } catch (error) {
    console.error(`Error Firestore Image Comments ${imageId}:`, error)
    res.status(500).json({ error: 'Error fetching image comments' })
  }
})

// 9. Get Video Comments
app.get('/api/firestore/videos/:id/comments', async (req, res) => {
  const { id } = req.params
  try {
    const commentsRef = collection(db, `programas/${id}/comments`)
    const snapshot = await getDocs(commentsRef)
    const comments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json(comments)
  } catch (error) {
    console.error(`Error Firestore Video Comments ${id}:`, error)
    res.status(500).json({ error: 'Error fetching video comments' })
  }
})

// 10. Get Programs (Temas)
app.get('/api/firestore/programs', async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, 'temas'))
    const programs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json(programs)
  } catch (error) {
    console.error('Error Firestore Programs (Temas):', error)
    res.status(500).json({ error: 'Error fetching programs' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor backend corriendo en puerto ${PORT}`))
