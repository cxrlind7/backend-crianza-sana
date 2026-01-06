import {
  collection,
  getDocs,
  query,
  doc,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth'
import { db, auth } from '../firebase/firebaseConfig'
import { getSignedUrl } from '../services/aws'
import axios from 'axios'

// URL del backend
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

// Avatares por defecto
const defaultAvatars = [
  'https://csdkids-images.s3.us-east-2.amazonaws.com/defaultAvatar1.jpg',
  'https://csdkids-images.s3.us-east-2.amazonaws.com/defaultAvatar2.jpg',
  'https://csdkids-images.s3.us-east-2.amazonaws.com/defaultAvatar3.jpg',
  'https://csdkids-images.s3.us-east-2.amazonaws.com/defaultAvatar4.jpg',
  'https://csdkids-images.s3.us-east-2.amazonaws.com/defaultAvatar5.jpg',
  'https://csdkids-images.s3.us-east-2.amazonaws.com/defaultAvatar6.jpg',
  'https://csdkids-images.s3.us-east-2.amazonaws.com/defaultAvatar7.jpg',
]

const getRandomAvatar = () => {
  const index = Math.floor(Math.random() * defaultAvatars.length)
  return defaultAvatars[index]
}

/**
 * Obtiene personas de una colección, incluyendo sus redes sociales.
 * @param {string} collectionName - Nombre de la colección.
 * @param {Array} filters - Filtros opcionales para la consulta.
 * @returns {Promise<Array>} Lista de personas con sus redes sociales.
 */
export const getPeople = async (collectionName, filters = []) => {
  // Si es la colección 'people' y estamos filtrando especialistas, usamos el backend
  // Nota: Esta es una simplificación. Si se usan otros filtros, habría que ajustar el backend.
  if (collectionName === 'people') {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/firestore/people`)
      console.log('Obteniendo de: ' + BACKEND_URL)
      console.log(response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error obteniendo people del backend:', error)
      // Fallback a Firestore local si falla el backend (opcional, pero seguro por ahora)
      // O lanzar error.
      throw error
    }
  }

  // Fallback a lógica original para otras colecciones o filtros complejos no soportados por backend
  try {
    const q = query(collection(db, collectionName), ...filters)
    const querySnapshot = await getDocs(q)

    const people = await Promise.all(
      querySnapshot.docs.map(async (document) => {
        const personData = {
          id: document.id,
          ...document.data(),
        }

        const socialsRef = collection(db, `${collectionName}/${document.id}/socials`)
        const socialsSnapshot = await getDocs(socialsRef)

        personData.socials = socialsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        return personData
      }),
    )

    return people
  } catch (error) {
    console.error(`❌ Error obteniendo la colección "${collectionName}":`, error)
    throw error
  }
}

/**
 * Obtiene documentos de una colección ordenados por un campo.
 * @param {string} collectionName - Nombre de la colección.
 * @param {string} orderField - Campo por el cual ordenar.
 * @param {string} orderDirection - Dirección del orden ('asc' o 'desc').
 * @returns {Promise<Array>} Lista de documentos.
 */
export const getCollection = async (
  collectionName,
  orderField = 'orden',
  orderDirection = 'asc',
) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/firestore/collection/${collectionName}`, {
      params: { orderField, orderDirection },
    })
    return response.data
  } catch (error) {
    console.error(`❌ Error obteniendo la colección "${collectionName}" del backend:`, error)
    throw error
  }
}

/**
 * Obtiene los reels de una persona.
 * @param {string} personId - ID de la persona.
 * @returns {Promise<Array>} Lista de IDs de reels.
 */
export const getReels = async (personId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/firestore/reels`, {
      params: { personId },
    })
    return response.data
  } catch (error) {
    console.error(`❌ Error obteniendo reels del backend para persona ${personId}:`, error)
    throw error
  }
}

/**
 * Obtiene los datos de la campaña y valida la fecha final.
 * @returns {Promise<Object|null>} Datos de la campaña si es válida, null si expiró o no existe.
 */
export const getCampaignData = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/firestore/campaign`)
    return response.data
  } catch (error) {
    console.error('❌ Error getting campaign data from backend:', error)
    return null
  }
}

/**
 * Obtiene los comentarios de un blog.
 * @param {string} blogId - ID del blog.
 * @returns {Promise<Array>} Lista de comentarios.
 */
export const getComments = async (blogId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/firestore/blogs/${blogId}/comments`)
    return response.data
  } catch (error) {
    console.error(`❌ Error obteniendo los comentarios del blog ${blogId} del backend:`, error)
    throw error
  }
}

/**
 * Agrega un comentario a un blog.
 * @param {string} blogId - ID del blog.
 * @param {Object} commentData - Datos del comentario.
 * @returns {Promise<string>} ID del comentario creado.
 */
export const addComment = async (blogId, commentData) => {
  try {
    const commentsRef = collection(doc(db, 'blogs', blogId), 'comments')

    const docRef = await addDoc(commentsRef, {
      ...commentData,
      createdAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    console.error(`❌ Error al agregar comentario en el blog ${blogId}:`, error)
    throw error
  }
}

/**
 * Elimina un comentario de un blog.
 * @param {string} blogId - ID del blog.
 * @param {string} commentId - ID del comentario.
 */
export const deleteComment = async (blogId, commentId) => {
  try {
    const commentRef = doc(db, 'blogs', blogId, 'comments', commentId)
    await deleteDoc(commentRef)
  } catch (error) {
    console.error(`❌ Error eliminando comentario ${commentId} del blog ${blogId}:`, error)
    throw error
  }
}

/**
 * Obtiene todas las galerías y sus fotos.
 * @returns {Promise<Array>} Lista de galerías con sus fotos.
 */
export const getGalleries = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/firestore/galleries`)
    return response.data
  } catch (error) {
    console.error('❌ Error obteniendo las galerías del backend:', error)
    throw error
  }
}

/**
 * Obtiene los comentarios de una imagen en una galería.
 * @param {string} galeriaId - ID de la galería.
 * @param {string} imageId - ID de la imagen.
 * @returns {Promise<Array>} Lista de comentarios.
 */
export const getImageComments = async (galeriaId, imageId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/firestore/galleries/${galeriaId}/images/${imageId}/comments`,
    )
    return response.data
  } catch (error) {
    console.error(
      `❌ Error obteniendo los comentarios de la imagen ${imageId} en galería ${galeriaId} del backend:`,
      error,
    )
    throw error
  }
}

/**
 * Agrega un comentario a una imagen en una galería.
 * @param {string} galeriaId - ID de la galería.
 * @param {string} imageId - ID de la imagen.
 * @param {Object} commentData - Datos del comentario.
 * @returns {Promise<string>} ID del comentario creado.
 */
export const addImageComment = async (galeriaId, imageId, commentData) => {
  try {
    const commentsRef = collection(doc(db, 'galerias', galeriaId, 'fotos', imageId), 'comments')

    const docRef = await addDoc(commentsRef, {
      ...commentData,
      createdAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    console.error(`❌ Error al agregar comentario a la imagen ${imageId}:`, error)
    throw error
  }
}

/**
 * Elimina un comentario de una imagen en una galería.
 * @param {string} galeriaId - ID de la galería.
 * @param {string} imageId - ID de la imagen.
 * @param {string} commentId - ID del comentario.
 */
export const deleteCommentGaleria = async (galeriaId, imageId, commentId) => {
  try {
    const commentRef = doc(db, 'galerias', galeriaId, 'fotos', imageId, 'comments', commentId)
    await deleteDoc(commentRef)
  } catch (error) {
    console.error(`❌ Error eliminando comentario ${commentId}:`, error)
    throw error
  }
}

/**
 * Obtiene la lista de programas (videos).
 * @returns {Promise<Array>} Lista de programas ordenados por fecha.
 */
export const getVideos = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/firestore/videos`)
    // Reconstruir fechas (vienen como string ISO o similar desde JSON)
    const videos = response.data.map((v) => ({
      ...v,
      parsedDate: new Date(v.parsedDate),
    }))
    return videos
  } catch (error) {
    console.error('❌ Error obteniendo videos del backend:', error)
    throw error
  }
}

/**
 * Obtiene los comentarios de un video.
 * @param {string} videoId - ID del video.
 * @returns {Promise<Array>} Lista de comentarios.
 */
export const getCommentsVideo = async (videoId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/firestore/videos/${videoId}/comments`)
    return response.data
  } catch (error) {
    console.error(`❌ Error obteniendo comentarios del video ${videoId} del backend:`, error)
    throw error
  }
}

/**
 * Agrega un comentario a un video.
 * @param {string} videoId - ID del video.
 * @param {Object} commentData - Datos del comentario.
 * @returns {Promise<string>} ID del comentario creado.
 */
export const addCommentVideo = async (videoId, commentData) => {
  try {
    const commentsRef = collection(doc(db, 'programas', videoId), 'comments')
    const docRef = await addDoc(commentsRef, {
      ...commentData,
      createdAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    console.error(`❌ Error al agregar comentario al video ${videoId}:`, error)
    throw error
  }
}

/**
 * Elimina un comentario de un video.
 * @param {string} videoId - ID del video.
 * @param {string} commentId - ID del comentario.
 */
export const deleteCommentVideo = async (videoId, commentId) => {
  try {
    const commentRef = doc(db, 'programas', videoId, 'comments', commentId)
    await deleteDoc(commentRef)
  } catch (error) {
    console.error(`❌ Error al eliminar comentario ${commentId} del video ${videoId}:`, error)
    throw error
  }
}

/**
 * Obtiene la lista de temas (anteriormente programas).
 * @returns {Promise<Array>} Lista de temas.
 */
export const getPrograms = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/firestore/programs`)
    return response.data
  } catch (error) {
    console.error('❌ Error obteniendo la colección de temas del backend:', error)
    throw error
  }
}

// Usuarios

/**
 * Registra un nuevo usuario.
 * @param {string} email - Correo electrónico.
 * @param {string} password - Contraseña.
 * @param {string} name - Nombre del usuario.
 * @returns {Promise<Object>} Usuario registrado.
 */
export const registerUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await updateProfile(user, {
      displayName: name,
      photoURL: getRandomAvatar(),
    })

    await sendEmailVerification(user)
    return user
  } catch (error) {
    console.error('❌ Error registrando usuario:', error)
    throw error
  }
}

/**
 * Inicia sesión con correo y contraseña.
 * @param {string} email - Correo electrónico.
 * @param {string} password - Contraseña.
 * @returns {Promise<Object>} Usuario autenticado.
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error('❌ Error iniciando sesión:', error)
    throw error
  }
}

/**
 * Cierra la sesión del usuario actual.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('❌ Error cerrando sesión:', error)
    throw error
  }
}

// Exportar getSignedUrl desde el servicio AWS para compatibilidad
export { getSignedUrl }
