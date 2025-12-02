require('dotenv').config() // Para leer variables de entorno
const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
app.use(cors()) // Permite que tu Vue app se conecte aquí

// TUS CREDENCIALES DE SPOTIFY DEVELOPER DASHBOARD
// ¡NUNCA LAS PONGAS DIRECTAMENTE AQUÍ, USA VARIABLES DE ENTORNO!
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const SHOW_ID = '4A7KWpa53WZnevgOBDYEHj' // El ID de tu podcast Crianza Sana

let accessToken = null
let tokenExpiration = null

// Función para obtener el token de acceso de Spotify
async function getAccessToken() {
  if (accessToken && tokenExpiration > Date.now()) {
    return accessToken
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({ grant_type: 'client_credentials' }),
      {
        headers: {
          Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    accessToken = response.data.access_token
    // El token suele durar 1 hora (3600 segundos). Restamos un poco por seguridad.
    tokenExpiration = Date.now() + (response.data.expires_in - 60) * 1000
    return accessToken
  } catch (error) {
    console.error(
      'Error obteniendo token de Spotify',
      error.response ? error.response.data : error.message,
    )
    throw error
  }
}

// La ruta que tu Vue app llamará
app.get('/api/episodios', async (req, res) => {
  try {
    const token = await getAccessToken()
    // Pedimos los últimos 10 episodios
    const response = await axios.get(
      `https://api.spotify.com/v1/shows/${SHOW_ID}/episodes?limit=10&market=MX`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    res.json(response.data.items)
  } catch (error) {
    console.error('Error en /api/episodios:', error.response ? error.response.data : error.message)
    res.status(500).json({ error: 'Error al obtener episodios', details: error.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor backend corriendo en puerto ${PORT}`))
