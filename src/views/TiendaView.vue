<template>
  <LoginModal v-if="showLoginModal" @close="showLoginModal = false" />

  <!-- Toast de notificación -->
  <!-- Toast de notificación -->
  <Teleport to="body">
    <transition name="toast-fade">
      <div v-if="showToast" class="toast-notification">
        <font-awesome-icon icon="fa-solid fa-check-circle" class="toast-icon" />
        <span>¡Enlace copiado al portapapeles!</span>
      </div>
    </transition>
  </Teleport>

  <div class="gallery-page-container">
    <!-- Botón de Regresar -->
    <div class="container mb-4 fade-in">
      <button @click="goBack" class="btn-back">
        <font-awesome-icon icon="fa-solid fa-arrow-left" />
        <span class="ms-2 d-none d-sm-inline">Regresar</span>
      </button>
    </div>

    <div class="content-wrapper">
      <!-- Cabecera -->
      <header class="gallery-header text-center fade-in delay-1">
        <h3
          class="text-uppercase letter-spacing-2 text-dark mb-4 mt-0"
          style="font-size: 1.5rem; opacity: 0.8"
        >
          Galería de Álbumes
        </h3>
        <!-- Botón Toggle para Filtros -->
        <button class="btn-toggle-filters" @click="showFilters = !showFilters">
          <font-awesome-icon icon="fa-solid fa-sliders" class="me-2" />
          {{ showFilters ? 'Ocultar Filtros' : 'Filtrar y Ordenar' }}
        </button>
      </header>

      <!-- Sección de Filtros Desplegable -->
      <transition name="slide-down">
        <section v-if="showFilters" class="controls-section mb-5">
          <div class="controls-container">
            <!-- 1. Filtro por Persona (Extraído del nombre) -->
            <div class="filter-group" v-if="uniquePeople.length > 0">
              <label class="control-label">
                <font-awesome-icon icon="fa-solid fa-user-tie" class="me-2" />Especialista:
              </label>
              <div class="select-wrapper">
                <select v-model="selectedPerson" class="form-select modern-select">
                  <option :value="null">Todas las personas</option>
                  <option v-for="person in uniquePeople" :key="person" :value="person">
                    {{ person }}
                  </option>
                </select>
              </div>
            </div>

            <!-- 2. Ordenar y Limpiar -->
            <div class="filter-group sort-group">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="control-label mb-0">
                  <font-awesome-icon icon="fa-solid fa-sort" class="me-2" />Ordenar:
                </label>
                <!-- Botón limpiar filtros si hay alguno activo -->
                <button v-if="selectedPerson" class="clear-filters-btn" @click="clearFilters">
                  Limpiar filtros ✖
                </button>
              </div>

              <div class="sort-segmented-control">
                <button @click="sortOrder = 'recent'" :class="{ active: sortOrder === 'recent' }">
                  Más Recientes
                </button>
                <button @click="sortOrder = 'oldest'" :class="{ active: sortOrder === 'oldest' }">
                  Más Antiguos
                </button>
              </div>
            </div>
          </div>
        </section>
      </transition>

      <!-- Lista de Álbumes (Grid estilo Programas) -->
      <transition-group name="list" tag="div" class="album-grid fade-in delay-2">
        <div
          v-for="(album, index) in filteredAndSortedAlbums"
          :key="album.id || index"
          class="album-card-clean"
          @click="openAlbum(album)"
        >
          <!-- Thumbnail con Overlay -->
          <div class="thumbnail-wrapper">
            <img
              :src="album.images[0]?.url"
              :alt="album.name"
              class="album-thumbnail-img"
              loading="lazy"
            />
            <div class="view-overlay">
              <div class="view-circle">
                <font-awesome-icon icon="fa-regular fa-images" class="view-icon-svg" />
              </div>
            </div>
          </div>

          <!-- Información del Álbum -->
          <div class="card-info">
            <h3 class="card-title" :title="album.name">{{ album.name }}</h3>

            <!-- Mostrar nombre de la persona si se detectó -->
            <p v-if="getPersonName(album.name)" class="card-person">
              <font-awesome-icon icon="fa-solid fa-user-tie" class="me-1" />
              {{ getPersonName(album.name) }}
            </p>

            <div class="card-meta">
              <span v-if="album.date" class="meta-date">
                <font-awesome-icon icon="fa-regular fa-calendar" class="me-1" />
                {{ formatDate(album.date) }}
              </span>
              <span class="ms-auto photo-count-badge"> {{ album.images.length }} fotos </span>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Mensaje si no hay resultados -->
      <div v-if="filteredAndSortedAlbums.length === 0" class="no-results-container fade-in delay-2">
        <div class="empty-state-box">
          <font-awesome-icon icon="fa-regular fa-images" class="mb-3 fa-3x" style="opacity: 0.5" />
          <h3>No se encontraron álbumes.</h3>
          <p v-if="selectedPerson">Intenta limpiar los filtros.</p>
        </div>
      </div>
    </div>

    <!-- ================= MODAL DE GALERÍA (Estilo Pantalla Dividida) ================= -->
    <Teleport to="body">
      <transition name="modal-fade">
        <div class="gallery-modal-overlay" v-if="selectedAlbum" @click.self="closeAlbum">
          <div class="gallery-modal-container">
            <!-- Botón cerrar sobre el fondo negro -->
            <button class="close-modal-btn-on-dark" @click="closeAlbum" title="Cerrar">✖</button>

            <div class="modal-layout">
              <!-- Sección Izquierda: Visor de Imagen (Fondo Negro) -->
              <div class="image-viewer-section">
                <div v-if="currentImage" class="viewer-wrapper">
                  <img
                    :src="currentImage.url"
                    class="main-viewer-image"
                    :alt="currentImage.title"
                  />

                  <!-- Navegación -->
                  <button class="nav-button left" @click.stop="prevImage" v-if="hasMultipleImages">
                    <font-awesome-icon icon="fa-solid fa-chevron-left" />
                  </button>
                  <button class="nav-button right" @click.stop="nextImage" v-if="hasMultipleImages">
                    <font-awesome-icon icon="fa-solid fa-chevron-right" />
                  </button>
                </div>
              </div>

              <!-- Sección Derecha: Detalles, Miniaturas y Comentarios (FONDO BLANCO) -->
              <div class="gallery-details-section light-theme">
                <div class="details-header">
                  <div>
                    <h2 class="modal-album-title">{{ selectedAlbum.name }}</h2>
                    <!-- Mostrar persona en el modal también -->
                    <p v-if="getPersonName(selectedAlbum.name)" class="modal-person-subtitle">
                      <font-awesome-icon icon="fa-solid fa-user-tie" class="me-1" />
                      {{ getPersonName(selectedAlbum.name) }}
                    </p>
                  </div>

                  <!-- Botón compartir álbum -->
                  <!-- <button
                    class="share-btn-light"
                    @click.stop="shareAlbum(selectedAlbum)"
                    title="Compartir Álbum"
                  >
                    <font-awesome-icon icon="fa-solid fa-share-nodes" />
                  </button> -->
                </div>

                <div class="modal-album-meta">
                  <div class="d-flex align-items-center text-muted mb-3">
                    <span v-if="selectedAlbum.date">
                      <font-awesome-icon icon="fa-regular fa-calendar-alt" class="me-1" />
                      {{ formatDate(selectedAlbum.date) }}
                    </span>
                  </div>

                  <!-- Título de la imagen actual y botón de compartir imagen -->
                  <div class="current-image-info d-flex justify-content-between align-items-center">
                    <h5 class="m-0 text-accent">{{ currentImage?.title || 'Sin título' }}</h5>
                    <button
                      class="btn-share-sm"
                      @click.stop="shareImage(currentImage)"
                      title="Compartir esta imagen"
                    >
                      <font-awesome-icon icon="fa-solid fa-link" />
                    </button>
                  </div>

                  <!-- Grid de Miniaturas del Álbum -->
                  <div class="thumbnails-grid-container mt-3">
                    <div class="thumbnails-scroll">
                      <img
                        v-for="(img, idx) in selectedAlbum.images"
                        :key="img.id"
                        :src="img.url"
                        class="mini-thumbnail"
                        :class="{ active: idx === selectedImageIndex }"
                        @click="selectImageByIndex(idx)"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                <!-- Sección de Comentarios (Reutilizada del estilo Programas) -->
                <div class="comments-container">
                  <h4 class="comments-title">
                    Comentarios <span class="comment-count">({{ comments.length }})</span>
                  </h4>

                  <div class="comments-list light-scroll" ref="commentsListRef">
                    <div v-if="comments.length">
                      <div v-for="(comment, idx) in comments" :key="idx" class="comment-item">
                        <img
                          :src="comment.image || defaultAvatar"
                          alt="Avatar"
                          class="comment-avatar"
                        />

                        <div class="comment-body light-comment-bg">
                          <div class="comment-header">
                            <span class="comment-author">{{ comment.userName }}</span>
                            <div
                              class="comment-menu"
                              v-if="comment.userId === auth.currentUser?.uid"
                            >
                              <button class="menu-trigger text-muted" @click="toggleMenu(idx)">
                                ⋮
                              </button>
                              <transition name="fade-menu">
                                <div
                                  v-if="activeMenu === idx"
                                  class="menu-dropdown light-dropdown-bg"
                                >
                                  <button class="btn-delete" @click="deleteComment(comment, idx)">
                                    <font-awesome-icon icon="fa-solid fa-trash-can" /> Eliminar
                                  </button>
                                </div>
                              </transition>
                            </div>
                          </div>
                          <p class="comment-text">{{ comment.commentText }}</p>
                        </div>
                      </div>
                    </div>
                    <div v-else class="no-comments-placeholder text-muted">
                      <font-awesome-icon
                        icon="fa-regular fa-comments"
                        class="placeholder-icon-small"
                      />
                      <p>Sé el primero en comentar esta foto.</p>
                    </div>
                  </div>

                  <!-- Input de Comentarios Claro -->
                  <div class="comment-input-wrapper light-border-top">
                    <img
                      :src="auth.currentUser?.photoURL || defaultAvatar"
                      class="input-avatar"
                      alt="Tu avatar"
                    />
                    <div class="input-box">
                      <input
                        v-model="newComment"
                        placeholder="Añadir un comentario..."
                        class="comment-input-field light-input-bg"
                        @keyup.enter="addNewComment"
                      />
                      <button
                        class="send-comment-btn"
                        @click="addNewComment"
                        :disabled="!newComment.trim()"
                      >
                        <font-awesome-icon icon="fa-solid fa-paper-plane" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faShareNodes,
  faTrashCan,
  faPaperPlane,
  faCheckCircle,
  faArrowLeft,
  faSliders,
  faFilter,
  faSort,
  faChevronLeft,
  faChevronRight,
  faLink,
  faUserTie, // Importado icono de persona
} from '@fortawesome/free-solid-svg-icons'
import {
  faCalendar,
  faComments,
  faCalendarAlt,
  faImages,
} from '@fortawesome/free-regular-svg-icons'
import {
  getGalleries,
  getImageComments,
  addImageComment,
  deleteCommentGaleria,
} from '@/composables/useFirestore'
import { auth } from '@/firebase/firebaseConfig'
import LoginModal from '@/components/LoginModal.vue'
import { useRoute, useRouter } from 'vue-router'

library.add(
  faShareNodes,
  faTrashCan,
  faPaperPlane,
  faCheckCircle,
  faArrowLeft,
  faSliders,
  faFilter,
  faSort,
  faCalendar,
  faComments,
  faCalendarAlt,
  faImages,
  faChevronLeft,
  faChevronRight,
  faLink,
  faUserTie,
)

// --- Estado General ---
const allAlbums = ref([])
const showFilters = ref(false)
const sortOrder = ref('recent')
const selectedPerson = ref(null) // Nuevo estado para el filtro de persona
const showLoginModal = ref(false)
const showToast = ref(false)
const route = useRoute()
const router = useRouter()

// --- Estado del Modal y Comentarios ---
const selectedAlbum = ref(null)
const selectedImageIndex = ref(0)
const newComment = ref('')
const comments = ref([])
const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
const activeMenu = ref(null)
const commentsListRef = ref(null)

// --- Lógica de Extracción de Nombres ---
const nameMapping = {
  'Galería de Karen': 'Karen Meraz Cardosa',
  'Galería de Andrea': 'Andrea Soria',
  'Galería de Carina': 'Carina Lares',
  'Galería de Patricia Peña': 'Patricia Peña Raigosa',
}

// Función auxiliar para obtener el nombre antes del " - "
const getPersonName = (albumName) => {
  if (!albumName) return null
  const parts = albumName.split(' - ')
  let name = parts.length > 0 && parts[0].trim() !== '' ? parts[0].trim() : null

  if (name) {
    // Normalización específica
    if (nameMapping[name]) {
      return nameMapping[name]
    }
    // Limpieza genérica "Galería de "
    if (name.startsWith('Galería de ')) {
      return name.replace('Galería de ', '').trim()
    }
  }
  return name
}

// Computado para obtener la lista única de personas
const uniquePeople = computed(() => {
  const people = allAlbums.value.map((album) => getPersonName(album.name)).filter((p) => p !== null)
  return [...new Set(people)].sort()
})

// --- Computados de Filtrado y Ordenamiento ---
const filteredAndSortedAlbums = computed(() => {
  let result = [...allAlbums.value]

  // Filtro por Persona
  if (selectedPerson.value) {
    result = result.filter((album) => getPersonName(album.name) === selectedPerson.value)
  }

  // Ordenamiento
  result.sort((a, b) => {
    const dateA = new Date(a.date ? (a.date.seconds ? a.date.seconds * 1000 : a.date) : 0)
    const dateB = new Date(b.date ? (b.date.seconds ? b.date.seconds * 1000 : b.date) : 0)
    return sortOrder.value === 'recent' ? dateB - dateA : dateA - dateB
  })

  return result
})

const currentImage = computed(() => {
  if (!selectedAlbum.value || selectedAlbum.value.images.length === 0) return null
  return selectedAlbum.value.images[selectedImageIndex.value]
})

const hasMultipleImages = computed(() => {
  return selectedAlbum.value && selectedAlbum.value.images.length > 1
})

// --- Funciones de Utilidad y Navegación ---
const clearFilters = () => {
  selectedPerson.value = null
}

const formatDate = (rawDate) => {
  if (!rawDate) return ''
  let dateObj
  if (typeof rawDate.toDate === 'function') {
    dateObj = rawDate.toDate()
  } else if (rawDate.seconds || rawDate._seconds) {
    const seconds = rawDate.seconds || rawDate._seconds
    dateObj = new Date(seconds * 1000)
  } else {
    dateObj = new Date(rawDate)
  }

  if (isNaN(dateObj.getTime())) return 'Fecha no disponible'

  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    router.push('/')
  }
}

const showToastNotification = () => {
  showToast.value = true
  setTimeout(() => (showToast.value = false), 3000)
}

// --- Funciones del Modal (Abrir/Cerrar/Navegar) ---
const openAlbum = async (album, imageId = null) => {
  selectedAlbum.value = album
  let index = 0
  if (imageId) {
    index = album.images.findIndex((img) => img.id === imageId)
    if (index === -1) index = 0
  }
  selectedImageIndex.value = index
  updateRouterQuery()
  await loadCommentsForCurrentImage()
}

const closeAlbum = () => {
  selectedAlbum.value = null
  selectedImageIndex.value = 0
  comments.value = []
  activeMenu.value = null
  router.replace({ query: {} })
}

const selectImageByIndex = async (index) => {
  selectedImageIndex.value = index
  updateRouterQuery()
  await loadCommentsForCurrentImage()
}

const prevImage = () => {
  if (selectedImageIndex.value > 0) {
    selectImageByIndex(selectedImageIndex.value - 1)
  } else {
    selectImageByIndex(selectedAlbum.value.images.length - 1)
  }
}

const nextImage = () => {
  if (selectedImageIndex.value < selectedAlbum.value.images.length - 1) {
    selectImageByIndex(selectedImageIndex.value + 1)
  } else {
    selectImageByIndex(0)
  }
}

const updateRouterQuery = () => {
  if (!selectedAlbum.value || !currentImage.value) return
  router.replace({
    query: {
      idAlbum: selectedAlbum.value.id,
      idFoto: currentImage.value.id,
    },
  })
}

// --- Funciones de Compartir ---
const shareAlbum = (album) => {
  if (!album || !album.id) return
  const url = `${window.location.origin}/gallery?idAlbum=${album.id}`
  const message = `"${album.name}" - ¡Mira este álbum de fotos! 📷 ${url}`
  navigator.clipboard.writeText(message).then(showToastNotification)
}

const shareImage = (image) => {
  if (!image || !selectedAlbum.value) return
  const url = `${window.location.origin}/gallery?idAlbum=${selectedAlbum.value.id}&idFoto=${image.id}`
  const message = `"${image.title || 'Foto'}" - ¡Mira esta imagen! 📸 ${url}`
  navigator.clipboard.writeText(message).then(showToastNotification)
}

// --- Funciones de Comentarios ---
const loadCommentsForCurrentImage = async () => {
  if (!selectedAlbum.value || !currentImage.value) return
  comments.value = []
  try {
    comments.value = await getImageComments(selectedAlbum.value.id, currentImage.value.id)
    scrollToBottomComments()
  } catch (error) {
    console.error('❌ Error al cargar comentarios:', error)
  }
}

const addNewComment = async () => {
  if (!newComment.value.trim()) return
  const user = auth.currentUser

  const commentData = {
    userId: user ? user.uid : 'guest_' + Date.now(),
    userName: user ? user.displayName || 'Usuario Invitado' : 'Usuario Invitado',
    commentText: newComment.value,
    image: user ? user.photoURL || defaultAvatar : defaultAvatar,
    createdAt: new Date().toISOString(),
  }

  try {
    const galeriaId = selectedAlbum.value.id
    const imageId = currentImage.value.id
    const commentId = await addImageComment(galeriaId, imageId, commentData)
    commentData.id = commentId
    comments.value.push(commentData)
    newComment.value = ''
    scrollToBottomComments()
  } catch (error) {
    console.error('❌ Error al agregar comentario:', error)
    alert('Error al publicar el comentario')
  }
}

const deleteComment = async (comment, idx) => {
  const user = auth.currentUser
  if (!user || user.uid !== comment.userId) {
    alert('No tienes permiso para eliminar este comentario.')
    return
  }
  if (!confirm('¿Estás seguro de que deseas eliminar este comentario?')) return

  try {
    await deleteCommentGaleria(selectedAlbum.value.id, currentImage.value.id, comment.id)
    comments.value.splice(idx, 1)
    activeMenu.value = null
  } catch (error) {
    console.error('❌ Error al eliminar comentario:', error)
  }
}

const scrollToBottomComments = () => {
  nextTick(() => {
    if (commentsListRef.value) {
      commentsListRef.value.scrollTop = commentsListRef.value.scrollHeight
    }
  })
}

const toggleMenu = (index) => {
  activeMenu.value = activeMenu.value === index ? null : index
}

// --- Lifecycle ---
onMounted(async () => {
  try {
    allAlbums.value = await getGalleries()

    const idAlbum = route.query.idAlbum
    const idFoto = route.query.idFoto

    if (idAlbum) {
      const album = allAlbums.value.find((a) => a.id === idAlbum)
      if (album) {
        openAlbum(album, idFoto)
      }
    }
  } catch (error) {
    console.error('❌ Error al cargar los álbumes:', error)
  }
})
</script>

<style scoped>
/* =========================================
   Variables CSS
   ========================================= */
:root {
  --text-dark: #343a40;
  --text-muted: #6c757d;
  --accent-color: #0d6efd;
  --accent-hover: #0a58ca;
  --radius-pill: 50px;
  --radius-lg: 16px;
  --shadow-sm: 0 4px 10px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.text-accent {
  color: var(--accent-color);
}

/* =========================================
   Estilos Generales de la Página
   ========================================= */
.gallery-page-container {
  padding-top: 60px;
  min-height: 100vh;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: var(--text-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--bg-main);
}

.content-wrapper {
  max-width: 1200px;
  width: 100%;
  padding: 20px;
}

/* Botón Regresar y Header */
.btn-back {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 30px;
  color: #555;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}
.btn-back:hover {
  background-color: #ffffff;
  color: #000;
  transform: translateX(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.gallery-header {
  margin-bottom: 30px;
}
.letter-spacing-2 {
  letter-spacing: 2px;
  font-weight: 600;
}
.btn-toggle-filters {
  background: white;
  color: #495057;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}
.btn-toggle-filters:hover {
  background: #f8f9fa;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  color: #212529;
}

/* =========================================
   Sección de Filtros (Actualizada con estilos de Select)
   ========================================= */
.controls-section {
  overflow: hidden;
}
.controls-container {
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: space-between;
  align-items: flex-start;
  backdrop-filter: blur(10px);
}

.filter-group {
  flex: 1;
  min-width: 250px;
  display: flex;
  flex-direction: column;
}
.control-label {
  display: block;
  font-weight: 700;
  font-size: 0.95rem;
  color: #495057;
  margin-bottom: 12px;
}

/* Estilos para el Select Moderno (Copiados de Programas) */
.select-wrapper {
  position: relative;
}
.modern-select {
  width: 100%;
  padding: 10px 15px;
  border-radius: 12px;
  border: 2px solid #e9ecef;
  background-color: white;
  color: #495057;
  font-weight: 600;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 12px;
  transition: all 0.2s ease;
}
.modern-select:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

/* Botón Limpiar y Ordenar */
.clear-filters-btn {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
}
.clear-filters-btn:hover {
  text-decoration: underline;
}

.sort-segmented-control {
  display: flex;
  background: #e9ecef;
  border-radius: 8px;
  padding: 4px;
}
.sort-segmented-control button {
  flex: 1;
  padding: 8px 12px;
  border: none;
  background: none;
  color: #6c757d;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.sort-segmented-control button.active {
  background: white;
  color: #212529;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* =========================================
   Grid de Álbumes
   ========================================= */
.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  padding-bottom: 40px;
}

.album-card-clean {
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}
.album-card-clean:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-md);
}

.thumbnail-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
  background-color: #eee;
}
.album-thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.album-card-clean:hover .album-thumbnail-img {
  transform: scale(1.05);
}

.view-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.album-card-clean:hover .view-overlay {
  opacity: 1;
}
.view-circle {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}
.album-card-clean:hover .view-circle {
  transform: scale(1.1);
}
.view-icon-svg {
  font-size: 1.4rem;
  color: var(--text-dark);
}

.card-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.4;
  color: var(--text-dark);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-person {
  font-size: 0.9rem;
  color: var(--accent-color);
  font-weight: 600;
  margin-bottom: 12px;
}
.card-meta {
  margin-top: auto;
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
}
.photo-count-badge {
  background: #e9ecef;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Estado Vacío */
.no-results-container {
  text-align: center;
  padding: 40px 20px;
}
.empty-state-box {
  background: rgba(255, 255, 255, 0.8);
  padding: 40px;
  border-radius: 16px;
  display: inline-block;
  color: #6c757d;
  box-shadow: var(--shadow-sm);
}

/* =========================================
   MODAL DE GALERÍA (Estilo Pantalla Dividida)
   ========================================= */
.gallery-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  /* Z-INDEX AUMENTADO PARA ESTAR SOBRE EL NAVBAR */
  z-index: 8888;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.gallery-modal-container {
  background: #fff;
  width: 100%;
  max-width: 1200px;
  height: 90vh;
  max-height: 800px;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.close-modal-btn-on-dark {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  font-size: 1.2rem;
  color: #ffffff;
  cursor: pointer;
  z-index: 30;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
}
.close-modal-btn-on-dark:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: rotate(90deg);
}

.modal-layout {
  display: flex;
  height: 100%;
}

/* --- Sección Izquierda: Visor de Imagen (Fondo Negro) --- */
.image-viewer-section {
  flex: 3;
  background: #000;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewer-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-viewer-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
}

/* Botones de Navegación (Flechas) */
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.7);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 20;
}
.nav-button:hover {
  background: rgba(0, 0, 0, 0.6);
  color: white;
}
.nav-button.left {
  left: 20px;
}
.nav-button.right {
  right: 20px;
}

/* --- Sección Derecha: Detalles (Fondo Blanco) --- */
.gallery-details-section.light-theme {
  flex: 2;
  min-width: 350px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  color: var(--text-dark);
  overflow: hidden;
  border-left: 1px solid #e9ecef;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}
.modal-album-title {
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
  color: var(--text-dark);
}
.modal-person-subtitle {
  font-size: 1rem;
  color: var(--accent-color);
  font-weight: 600;
  margin: 5px 0 0 0;
}

.share-btn-light {
  background: #f1f3f5;
  border: none;
  color: var(--text-dark);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-left: 15px;
  font-size: 1.1rem;
}
.share-btn-light:hover {
  background: var(--accent-color);
  color: white;
}

.modal-album-meta {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.btn-share-sm {
  background: none;
  border: 1px solid #e9ecef;
  color: var(--text-muted);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}
.btn-share-sm:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

/* Grid de Miniaturas en el panel derecho */
.thumbnails-grid-container {
  overflow-x: auto;
  padding-bottom: 10px;
  scrollbar-width: thin;
  scrollbar-color: #dee2e6 transparent;
}
.thumbnails-grid-container::-webkit-scrollbar {
  height: 6px;
}
.thumbnails-grid-container::-webkit-scrollbar-thumb {
  background-color: #dee2e6;
  border-radius: 10px;
}

.thumbnails-scroll {
  display: flex;
  gap: 10px;
}
.mini-thumbnail {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}
.mini-thumbnail:hover {
  opacity: 1;
}
.mini-thumbnail.active {
  opacity: 1;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.2);
}

/* --- Comentarios (Reutilización exacta de estilos) --- */
.comments-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.comments-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: var(--text-dark);
}
.comment-count {
  color: var(--text-muted);
  font-weight: 400;
}

.comments-list.light-scroll {
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 10px;
  margin-bottom: 20px;
  scrollbar-width: thin;
  scrollbar-color: #dee2e6 transparent;
}
.comments-list.light-scroll::-webkit-scrollbar {
  width: 6px;
}
.comments-list.light-scroll::-webkit-scrollbar-thumb {
  background-color: #dee2e6;
  border-radius: 10px;
}

.comment-item {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}
.comment-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.comment-body.light-comment-bg {
  flex-grow: 1;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 12px;
  position: relative;
  color: var(--text-dark);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.comment-author {
  font-weight: 700;
  font-size: 1rem;
}
.comment-text {
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  color: #495057;
}

.menu-trigger {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 5px;
}
.menu-dropdown.light-dropdown-bg {
  background: #fff;
  border: 1px solid #e9ecef;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  border-radius: 8px;
  padding: 5px;
}
.btn-delete {
  color: #ff6b6b;
  background: none;
  border: none;
  padding: 8px 12px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
.btn-delete:hover {
  background: #fff5f5;
  border-radius: 4px;
}

.no-comments-placeholder {
  text-align: center;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}
.placeholder-icon-small {
  font-size: 3rem;
  opacity: 0.3;
}

.comment-input-wrapper.light-border-top {
  display: flex;
  align-items: center;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.input-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
  flex-shrink: 0;
}

.input-box {
  flex-grow: 1;
  position: relative;
}
.comment-input-field.light-input-bg {
  width: 100%;
  padding: 14px 55px 14px 20px;
  border: 2px solid #e9ecef;
  background: #f8f9fa;
  color: var(--text-dark);
  border-radius: var(--radius-pill);
  font-size: 1rem;
  transition: all 0.3s ease;
}
.comment-input-field.light-input-bg:focus {
  outline: none;
  border-color: var(--accent-color);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

.send-comment-btn {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--accent-color);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
  font-size: 1.1rem;
}
.send-comment-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-50%) scale(1.1);
}
.send-comment-btn:disabled {
  background: #e9ecef;
  color: var(--text-muted);
  cursor: not-allowed;
}

/* =========================================
   Toast & Animaciones
   ========================================= */
.toast-notification {
  position: fixed;
  top: 30px;
  right: 30px;
  background: white;
  color: #2d3748;
  padding: 12px 20px;
  margin-top: 3rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  z-index: 9999;
  font-weight: 600;
  font-size: 0.95rem;
  border-left: 4px solid #48bb78; /* Verde éxito */
}
.toast-icon {
  color: #48bb78;
  margin-right: 10px;
  font-size: 1.1rem;
}

/* Transiciones */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease-out forwards;
}
.delay-1 {
  animation-delay: 0.2s;
}
.delay-2 {
  animation-delay: 0.4s;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  max-height: 500px;
  opacity: 1;
}
.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  margin: 0;
  padding: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.fade-menu-enter-active,
.fade-menu-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-menu-enter-from,
.fade-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* =========================================
   Responsive
   ========================================= */
@media (max-width: 992px) {
  .gallery-modal-container {
    height: auto;
    max-height: 95vh;
  }
  .modal-layout {
    flex-direction: column;
  }
  .image-viewer-section {
    width: 100%;
    height: 50vh;
    min-height: 300px;
  }
  .gallery-details-section.light-theme {
    flex: 1;
    padding: 20px;
    max-height: 45vh;
    border-left: none;
    border-top: 1px solid #e9ecef;
  }
  .close-modal-btn-on-dark {
    top: 10px;
    right: 10px;
  }
  .nav-button {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  .nav-button.left {
    left: 10px;
  }
  .nav-button.right {
    right: 10px;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 10px;
  }
  .gallery-header {
    margin-bottom: 20px;
  }
  .controls-container {
    flex-direction: column;
    gap: 25px;
    padding: 20px;
  }
  .filter-group,
  .sort-group {
    min-width: 100%;
  }
  .album-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .thumbnail-wrapper {
    height: 220px;
  }
}
</style>
