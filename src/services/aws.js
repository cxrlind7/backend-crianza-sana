import axios from 'axios'

// URL del backend (ajustar según entorno)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

/**
 * Genera una URL firmada para acceder a un objeto en S3.
 * @param {string} key - La clave (ruta) del archivo en S3.
 * @returns {Promise<string|null>} La URL firmada o null si hay error.
 */
export const getSignedUrl = async (key) => {
  if (!key) {
    console.error('❌ Error: Key no proporcionada para getSignedUrl')
    return null
  }

  try {
    const response = await axios.get(`${BACKEND_URL}/api/aws/read-url`, {
      params: { key },
    })
    return response.data.url
  } catch (error) {
    console.error('❌ Error obteniendo URL firmada del backend:', error)
    return null
  }
}

/**
 * Obtiene una URL firmada para subir un archivo a S3.
 * @param {string} key - La clave (ruta) del archivo en S3.
 * @param {string} contentType - Tipo de contenido del archivo.
 * @returns {Promise<string|null>} La URL firmada o null si hay error.
 */
export const getUploadUrl = async (key, contentType) => {
  if (!key) {
    console.error('❌ Error: Key no proporcionada para getUploadUrl')
    return null
  }

  try {
    const response = await axios.post(`${BACKEND_URL}/api/aws/upload-url`, {
      key,
      contentType,
    })
    return response.data.url
  } catch (error) {
    console.error('❌ Error obteniendo URL de subida del backend:', error)
    return null
  }
}
