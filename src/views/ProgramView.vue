<template>
  <LoginModal v-if="showLoginModal" @close="showLoginModal = false" />

  <!-- Toast de notificación -->
  <Teleport to="body">
    <transition name="toast-fade">
      <div v-if="showToast" class="toast-notification">
        <font-awesome-icon icon="fa-solid fa-check-circle" class="toast-icon" />
        <span>¡Enlace copiado al portapapeles!</span>
      </div>
    </transition>
  </Teleport>

  <div class="programs-page-container">
    <!-- Botón de Regresar -->
    <div class="container mb-4 fade-in">
      <button @click="goBack" class="btn-back">
        <font-awesome-icon icon="fa-solid fa-arrow-left" />
        <span class="ms-2 d-none d-sm-inline">Regresar</span>
      </button>
    </div>

    <div class="content-wrapper">
      <!-- Cabecera -->
      <header class="programs-header text-center fade-in delay-1">
        <h3
          class="text-uppercase letter-spacing-2 text-dark mb-4 mt-0"
          style="font-size: 1.5rem; opacity: 0.8"
        >
          Programas y Multimedia
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
            <!-- 1. Filtro por Categoría -->
            <div class="filter-group">
              <label class="control-label">
                <font-awesome-icon icon="fa-solid fa-filter" class="me-2" />Categorías:
              </label>
              <div class="category-pills">
                <button
                  v-for="cat in uniqueCategories"
                  :key="cat"
                  class="category-pill"
                  :class="[{ active: selectedCategories.includes(cat) }, cat]"
                  @click="toggleCategory(cat)"
                >
                  {{ formatCategory(cat) }}
                </button>
              </div>
            </div>

            <!-- 2. Filtro por Especialista -->
            <div class="filter-group" v-if="uniqueSpecialists.length > 0">
              <label class="control-label">
                <font-awesome-icon icon="fa-solid fa-user-tie" class="me-2" />Especialista:
              </label>
              <div class="select-wrapper">
                <select v-model="selectedSpecialist" class="form-select modern-select">
                  <option :value="null">Todos los especialistas</option>
                  <option
                    v-for="specialist in uniqueSpecialists"
                    :key="specialist"
                    :value="specialist"
                  >
                    {{ specialist }}
                  </option>
                </select>
              </div>
            </div>

            <!-- 3. Ordenar y Limpiar -->
            <div class="filter-group sort-group">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="control-label mb-0">
                  <font-awesome-icon icon="fa-solid fa-sort" class="me-2" />Ordenar:
                </label>
                <button
                  v-if="selectedCategories.length || selectedSpecialist"
                  class="clear-filters-btn"
                  @click="clearFilters"
                >
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

      <!-- Lista de videos (Grid) -->
      <transition-group name="list" tag="div" class="video-grid fade-in delay-2">
        <div
          v-for="(video, index) in filteredAndSortedVideos"
          :key="video.id || index"
          class="video-card-clean"
          @click="selectVideo(video)"
        >
          <!-- Thumbnail con Overlay y Badge -->
          <div class="thumbnail-wrapper">
            <img :src="video.thumbnail" :alt="video.title" class="video-thumbnail-img" />
            <div class="play-overlay">
              <div class="play-circle">
                <font-awesome-icon icon="fa-solid fa-play" class="play-icon-svg" />
              </div>
            </div>
            <span v-if="video.category" class="category-badge-in-img" :class="video.category">
              {{ formatCategory(video.category) }}
            </span>
          </div>

          <!-- Información del Video -->
          <div class="card-info">
            <h3 class="card-title" :title="video.title">{{ video.title }}</h3>

            <p v-if="video.participant" class="card-specialist">
              <font-awesome-icon icon="fa-solid fa-user-tie" class="me-1" /> {{ video.participant }}
            </p>

            <div class="card-meta">
              <span v-if="video.formattedDate" class="meta-date">
                <font-awesome-icon icon="fa-regular fa-calendar" class="me-1" />
                {{ video.formattedDate }}
              </span>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Mensaje si no hay resultados -->
      <div v-if="filteredAndSortedVideos.length === 0" class="no-results-container fade-in delay-2">
        <div class="empty-state-box">
          <font-awesome-icon icon="fa-solid fa-search" class="mb-3 fa-3x" style="opacity: 0.5" />
          <h3>No se encontraron programas.</h3>
          <p>Intenta ajustar tus filtros de búsqueda.</p>
          <button class="btn btn-link" @click="clearFilters">Limpiar todos los filtros</button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL DEL REPRODUCTOR (FONDO BLANCO EN INFO) ================= -->
    <Teleport to="body">
      <transition name="modal-fade">
        <div class="video-modal-overlay" v-if="selectedVideo" @click.self="closeVideo">
          <div class="video-modal-container">
            <!-- Botón cerrar sobre el fondo negro del video -->
            <button class="close-modal-btn-on-dark" @click="closeVideo" title="Cerrar">✖</button>

            <div class="modal-layout">
              <!-- Sección Izquierda: Video Player (Fondo Negro) -->
              <div class="video-player-section">
                <div class="iframe-wrapper-absolute">
                  <iframe
                    :src="selectedVideo.url"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    class="video-iframe-fit"
                  ></iframe>
                </div>
              </div>

              <!-- Sección Derecha: Detalles y Comentarios (FONDO BLANCO) -->
              <div class="video-details-section light-theme">
                <div class="details-header">
                  <h2 class="modal-video-title">{{ selectedVideo.title }}</h2>
                </div>

                <div class="modal-video-meta">
                  <p v-if="selectedVideo.participant" class="meta-specialist mb-2">
                    <font-awesome-icon icon="fa-solid fa-user-tie" class="me-2" />
                    <strong>{{ selectedVideo.participant }}</strong>
                  </p>

                  <div class="d-flex align-items-center text-muted">
                    <span v-if="selectedVideo.formattedDate">
                      <font-awesome-icon icon="fa-regular fa-calendar-alt" class="me-1" />
                      {{ selectedVideo.formattedDate }}
                    </span>
                    <span
                      v-if="selectedVideo.category"
                      class="ms-3 text-uppercase category-tag-modal"
                      :class="selectedVideo.category"
                    >
                      | {{ selectedVideo.category }}
                    </span>
                    <button
                      class="btn-share-sm"
                      @click.stop="shareVideo(selectedVideo)"
                      title="Copiar enlace"
                    >
                      <font-awesome-icon icon="fa-solid fa-link" />
                    </button>
                  </div>

                  <p v-if="selectedVideo.description" class="meta-desc mt-3">
                    {{ selectedVideo.description }}
                  </p>
                </div>

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

                        <!-- Burbuja de comentario clara -->
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
                      <p>Aún no hay comentarios. ¡Sé el primero!</p>
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
  faPlay,
  faShareNodes,
  faTrashCan,
  faPaperPlane,
  faCheckCircle,
  faArrowLeft,
  faSliders,
  faFilter,
  faSort,
  faSearch,
  faUserTie,
  faLink,
} from '@fortawesome/free-solid-svg-icons'
import { faCalendar, faComments, faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import {
  getVideos,
  getCommentsVideo,
  addCommentVideo,
  deleteCommentVideo,
} from '@/composables/useFirestore'
import { auth } from '@/firebase/firebaseConfig'
import LoginModal from '@/components/LoginModal.vue'
import { useRoute, useRouter } from 'vue-router'

library.add(
  faPlay,
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
  faSearch,
  faCalendarAlt,
  faUserTie,
  faLink,
)

// --- DATOS ESTÁTICOS AÑADIDOS ---
const videosesp = ref([
  {
    id: '1',
    title: '30 de abril: Día del niño',
    thumbnail: 'https://csdkids-images.s3.us-east-2.amazonaws.com/vidEsp1.png',
    url: 'https://csdkids-images.s3.us-east-2.amazonaws.com/30AbrilDia.mp4',
    description:
      'Celebrando el Día del Niño con amor y alegría. En este día especial, recordamos la importancia de proteger, educar y brindar un entorno seguro para que todos los niños puedan crecer felices y saludables. ¡Feliz Día del Niño a todos los pequeños que llenan nuestras vidas de luz y esperanza!',
    category: 'especiales',
    date: new Date('2024-04-30').toISOString(), // Fecha aproximada añadida para ordenamiento
  },
  {
    id: '2',
    title: 'Emma: La luz que inspira el camino de otros',
    thumbnail: 'https://csdkids-images.s3.us-east-2.amazonaws.com/flyer10Abril.jpeg',
    url: 'https://csdkids-images.s3.us-east-2.amazonaws.com/Emma_+La+luz+que+inspira+el+camino+de+otros.mp4',
    category: 'webinar',
    date: new Date('2024-04-10').toISOString(),
  },
  {
    id: '3',
    title: 'Mi casa es neurodiversa y neurodivergente',
    thumbnail: 'https://csdkids-images.s3.us-east-2.amazonaws.com/14AgostoWebinar.jpeg',
    url: 'https://csdkids-images.s3.us-east-2.amazonaws.com/Mi+casa+es.mp4',
    category: 'webinar',
    date: new Date('2024-08-14').toISOString(),
  },
  {
    id: '4',
    title: 'Radio Universidad 100.5 FM. Crianza Sana by D-kids.',
    thumbnail: 'https://csdkids-images.s3.us-east-2.amazonaws.com/radio-u.png',
    url: 'https://csdkids-images.s3.us-east-2.amazonaws.com/RadioUniversidad100.5FM.mp4',
    description:
      'Gracias a Radio Universidad 100.5 FM. Por la invitación y dar conoceré el propósito de Crianza Sana by D-kids. #reeducarparaformar #crianzasana #niños #niñas #adolescentes',
    category: 'especiales',
    date: new Date('2024-01-01').toISOString(),
  },
])

const allVideos = ref([])
const showFilters = ref(false)
const selectedCategories = ref([])
const selectedSpecialist = ref(null)
const sortOrder = ref('recent')

const selectedVideo = ref(null)
const newComment = ref('')
const comments = ref([])
const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
const activeMenu = ref(null)
const showLoginModal = ref(false)
const showToast = ref(false)
const route = useRoute()
const router = useRouter()
const commentsListRef = ref(null)

// --- Lógica de Filtrado y Ordenamiento ---

const uniqueCategories = computed(() => {
  return ['radio', 'webinar', 'especiales']
})

const uniqueSpecialists = computed(() => {
  const specialists = allVideos.value.map((v) => v.participant).filter((p) => p && p.trim() !== '')
  return [...new Set(specialists)].sort()
})

const filteredAndSortedVideos = computed(() => {
  let result = [...allVideos.value]

  if (selectedCategories.value.length > 0) {
    result = result.filter((video) => selectedCategories.value.includes(video.category))
  }

  if (selectedSpecialist.value) {
    result = result.filter((video) => video.participant === selectedSpecialist.value)
  }

  result.sort((a, b) => {
    const dateA = new Date(a.date || 0)
    const dateB = new Date(b.date || 0)
    return sortOrder.value === 'recent' ? dateB - dateA : dateA - dateB
  })

  return result
})

const toggleCategory = (category) => {
  if (selectedCategories.value.includes(category)) {
    selectedCategories.value = selectedCategories.value.filter((c) => c !== category)
  } else {
    selectedCategories.value.push(category)
  }
}

const clearFilters = () => {
  selectedCategories.value = []
  selectedSpecialist.value = null
}

watch(selectedCategories, () => {}, { deep: true })
watch(selectedSpecialist, () => {})

// --- Funciones de Utilidad y Navegación ---

const formatCategory = (cat) => {
  if (!cat) return ''
  const names = {
    radio: 'Radio',
    webinar: 'Webinar',
    especiales: 'Especiales',
  }
  return names[cat] || cat.charAt(0).toUpperCase() + cat.slice(1)
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

  if (isNaN(dateObj.getTime())) return ''

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

// --- Funciones del Reproductor y Comentarios ---

const shareVideo = (video) => {
  if (!video || !video.id) return
  const url = `${window.location.origin}/programs?id=${video.id}`
  const message = `"${video.title}" - ¡Mira este programa en Crianza Sana! 📺 ${url}`

  navigator.clipboard
    .writeText(message)
    .then(() => {
      showToast.value = true
      setTimeout(() => (showToast.value = false), 3000)
    })
    .catch((err) => console.error('❌ Error al copiar enlace:', err))
}

const selectVideo = async (video) => {
  selectedVideo.value = video
  await loadComments(video.id)
  router.replace({ query: { id: video.id } })
}

const loadComments = async (videoId) => {
  try {
    comments.value = await getCommentsVideo(videoId)
    scrollToBottomComments()
  } catch (error) {
    console.error('❌ Error al cargar los comentarios:', error)
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
    const commentId = await addCommentVideo(selectedVideo.value.id.toString(), commentData)
    commentData.id = commentId
    comments.value.push(commentData)
    newComment.value = ''
    scrollToBottomComments()
  } catch (error) {
    console.error('❌ Error al agregar comentario:', error)
    alert('Error al publicar el comentario')
  }
}

const scrollToBottomComments = () => {
  nextTick(() => {
    if (commentsListRef.value) {
      commentsListRef.value.scrollTop = commentsListRef.value.scrollHeight
    }
  })
}

const closeVideo = () => {
  selectedVideo.value = null
  comments.value = []
  activeMenu.value = null
  router.replace({ query: {} })
}

const deleteComment = async (comment, idx) => {
  const user = auth.currentUser
  if (!user || user.uid !== comment.userId) return
  if (!confirm('¿Estás seguro de que deseas eliminar este comentario?')) return

  try {
    await deleteCommentVideo(selectedVideo.value.id.toString(), comment.id)
    comments.value.splice(idx, 1)
    activeMenu.value = null
  } catch (error) {
    console.error('❌ Error al eliminar comentario:', error)
  }
}

const toggleMenu = (index) => {
  activeMenu.value = activeMenu.value === index ? null : index
}

onMounted(async () => {
  try {
    // 1. Obtener videos de Firestore
    const firestoreVideos = await getVideos()

    // 2. Mapearlos y forzar categoría 'radio'
    const mappedFirestoreVideos = firestoreVideos.map((v) => ({
      ...v,
      category: 'radio',
      participant: v.participant || null,
      date: v.date || new Date().toISOString(),
    }))

    // 3. Combinar videos estáticos (videosesp) con los de Firestore
    allVideos.value = [...videosesp.value, ...mappedFirestoreVideos]

    // 4. Formatear fechas para todos
    allVideos.value.forEach((v) => {
      v.formattedDate = formatDate(v.date)
    })

    const videoId = route.query.id
    if (videoId) {
      const video = allVideos.value.find((v) => v.id === videoId)
      if (video) selectVideo(video)
    }
  } catch (error) {
    console.error('❌ Error al cargar los videos:', error)
  }
})
</script>

<style scoped>
/* =========================================
   Variables CSS
   ========================================= */
/* :root removed from scoped style */

/* =========================================
   Estilos Generales
   ========================================= */
.programs-page-container {
  /* Variables locales para el componente */
  --bg-main: #f8f9fa;
  --text-dark: #343a40;
  --text-muted: #6c757d;
  --accent-color: #0d6efd;
  --accent-hover: #0a58ca;
  --radius-pill: 50px;
  --radius-lg: 16px;
  --shadow-sm: 0 4px 10px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 10px 30px rgba(0, 0, 0, 0.08);

  /* Colores de Categoría Premium */
  --cat-radio: #6610f2;
  --cat-webinar: #fd7e14;
  --cat-especiales: #0dcaf0;

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
  /* padding: 20px; */
}
.btn-back {
  display: inline-flex;
  margin-top: 20px;
  align-items: center;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 30px;
  color: #555;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  align-self: flex-start;
  margin-left: 10%;
}
.btn-back:hover {
  background-color: #ffffff;
  color: #000;
  transform: translateX(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

/* Cabecera */
.programs-header {
  padding: 10px 20px 20px; /* Reducido el padding */
  margin-top: 0;
}
.letter-spacing-2 {
  letter-spacing: 2px;
  font-weight: 600;
}
.section-subtitle {
  color: var(--text-muted);
  font-size: 1.1rem;
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
   Sección de Filtros
   ========================================= */
.controls-section {
  padding: 0 20px 30px 20px;
  overflow: hidden;
}

.controls-container {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95); /* Fondo semi-transparente para que se integre */
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: space-between;
  align-items: flex-start;
  backdrop-filter: blur(10px); /* Efecto de desenfoque moderno */
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

/* Pills de Categoría */
.category-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.category-pill {
  padding: 8px 16px;
  border-radius: 50px;
  border: 2px solid #e9ecef;
  background: white;
  color: #6c757d;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.category-pill:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
}

.category-pill.radio {
  color: var(--cat-radio);
  border-color: var(--cat-radio);
  background-color: rgba(102, 16, 242, 0.05);
}
.category-pill.webinar {
  color: var(--cat-webinar);
  border-color: var(--cat-webinar);
  background-color: rgba(253, 126, 20, 0.05);
}
.category-pill.especiales {
  color: var(--cat-especiales);
  border-color: var(--cat-especiales);
  background-color: rgba(13, 202, 240, 0.05);
}

.category-pill.active.radio {
  background-color: #6610f2 !important;
  border-color: #6610f2 !important;
  color: white !important;
  box-shadow: 0 4px 10px rgba(102, 16, 242, 0.3);
}
.category-pill.active.webinar {
  background-color: #fd7e14 !important;
  border-color: #fd7e14 !important;
  color: white !important;
  box-shadow: 0 4px 10px rgba(253, 126, 20, 0.3);
}
.category-pill.active.especiales {
  background-color: #0dcaf0 !important;
  border-color: #0dcaf0 !important;
  color: white !important;
  box-shadow: 0 4px 10px rgba(13, 202, 240, 0.3);
}

/* Select de Especialista */
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
   Grid de Videos
   ========================================= */
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  padding-bottom: 40px;
}

.video-card-clean {
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
.video-card-clean:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-md);
}

.thumbnail-wrapper {
  position: relative;
  height: 180px;
  overflow: hidden;
  background-color: #eee;
}
.video-thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.video-card-clean:hover .video-thumbnail-img {
  transform: scale(1.05);
}

.category-badge-in-img {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  z-index: 2;
}
.category-badge-in-img.radio {
  background: var(--cat-radio);
}
.category-badge-in-img.webinar {
  background: var(--cat-webinar);
}
.category-badge-in-img.especiales {
  background: var(--cat-especiales);
}

.play-overlay {
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
.video-card-clean:hover .play-overlay {
  opacity: 1;
}
.play-circle {
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
.video-card-clean:hover .play-circle {
  transform: scale(1.1);
}
.play-icon-svg {
  font-size: 1.2rem;
  color: var(--text-dark);
  margin-left: 3px;
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
.card-specialist {
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
   MODAL DEL REPRODUCTOR (ESTILO MIXTO: OSCURO/CLARO)
   ========================================= */
.video-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  z-index: 8888;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  backdrop-filter: blur(8px);
}

.video-modal-container {
  background: #fff; /* Fondo general blanco */
  width: 100%;
  max-width: 1100px;
  height: 85vh;
  max-height: 750px;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

/* Botón cerrar sobre el fondo oscuro del video */
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
  z-index: 20; /* Z-index alto */
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

/* --- Sección de Video (FONDO NEGRO) --- */
.video-player-section {
  flex: 3;
  background: #000;
  position: relative;
  overflow: hidden;
}

.iframe-wrapper-absolute {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
}

.video-iframe-fit {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border: none;
  background: #000;
}

/* --- Sección de Detalles (FONDO BLANCO) --- */
.video-details-section.light-theme {
  flex: 2;
  padding: 30px;
  display: flex;
  flex-direction: column;
  background: #ffffff; /* Fondo blanco explícito */
  color: var(--text-dark); /* Texto oscuro */
  overflow: hidden;
  border-left: 1px solid #e9ecef;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-right: 10px;
}
.modal-video-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
  color: var(--text-dark);
}

/* Botón compartir para fondo claro */
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

.modal-video-meta {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}
.meta-specialist {
  color: var(--accent-color);
  font-size: 1.1rem;
}
.meta-desc {
  line-height: 1.6;
  font-size: 0.95rem;
  color: #495057;
}

/* Tag de categoría en el modal */
.category-tag-modal {
  font-size: 0.8rem;
  letter-spacing: 1px;
  opacity: 0.9;
  font-weight: 700;
}
.category-tag-modal.radio {
  color: var(--cat-radio);
}
.category-tag-modal.webinar {
  color: var(--cat-webinar);
}
.category-tag-modal.especiales {
  color: var(--cat-especiales);
}

/* --- Comentarios Claros --- */
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

/* Burbuja de comentario clara */
.comment-body.light-comment-bg {
  flex-grow: 1;
  background: #f8f9fa; /* Gris muy claro */
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

/* Menú y Botones Claros */
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

/* Input Comentarios Claro */
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
.comment-input-field.light-input-bg::placeholder {
  color: var(--text-muted);
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
  .video-modal-container {
    height: auto;
    max-height: 95vh;
  }
  .modal-layout {
    flex-direction: column;
  }
  .video-player-section {
    width: 100%;
    height: 45vh;
    min-height: 300px;
  }
  .video-details-section.light-theme {
    flex: 1;
    padding: 20px;
    max-height: 50vh;
    border-left: none;
    border-top: 1px solid #e9ecef;
  }
  .close-modal-btn-on-dark {
    top: 10px;
    right: 10px;
  }
}

@media (max-width: 768px) {
  .programs-header {
    padding: 30px 20px;
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
  .video-grid {
    grid-template-columns: 1fr;
  }
  .thumbnail-wrapper {
    height: 200px;
  }
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
  flex-shrink: 0;
  margin-left: 5px;
}
.btn-share-sm:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}
</style>
