<template>
  <LoginModal v-if="showLoginModal" @close="showLoginModal = false" />

  <!-- Contenedor principal con padding superior para el navbar -->
  <div class="blog-container fade-in">
    <!-- Botón de Regresar -->
    <div class="container mb-4 fade-in">
      <button @click="goBack" class="btn-back">
        <font-awesome-icon icon="fa-solid fa-arrow-left" />
        <span class="ms-2 d-none d-sm-inline">Regresar</span>
      </button>
    </div>

    <div v-if="blog" class="blog-detail-card">
      <!-- HEADER DEL BLOG -->
      <header class="blog-header">
        <!-- Categoría -->
        <span
          v-if="blog.category"
          class="blog-category-pill"
          :style="{ backgroundColor: blog.categoryColor || '#3b82f6' }"
        >
          {{ blog.category }}
        </span>

        <!-- Título Principal -->
        <h1 class="blog-title">{{ blog.title }}</h1>
        <h2 v-if="blog.title1" class="blog-subtitle">{{ blog.title1 }}</h2>

        <!-- Meta Info (Autor, Fecha y Compartir) -->
        <div class="blog-meta-wrapper">
          <div class="author-meta">
            <img :src="getImagePerCategory(blog.authorName)" alt="Author" class="author-avatar" />
            <div class="author-details">
              <span class="author-name">{{ blog.authorName }}</span>
              <span class="meta-date">{{ formattedDate }}</span>
            </div>
          </div>

          <!-- Sección de Compartir Rediseñada -->
          <div class="share-actions">
            <span class="share-label">Compartir:</span>
            <!-- Botón Copiar Enlace -->
            <button class="share-btn copy-btn" @click="shareBlog(blog.id)" title="Copiar enlace">
              <font-awesome-icon icon="fa-solid fa-link" />
            </button>
            <!-- Botón Facebook -->
            <button
              class="share-btn facebook-btn"
              @click="shareToFacebook(blog.id)"
              title="Compartir en Facebook"
            >
              <font-awesome-icon icon="fa-brands fa-facebook-f" />
            </button>
            <!-- Botón Instagram -->
            <button
              class="share-btn instagram-btn"
              @click="generateInstagramStory"
              title="Compartir en Historias (Descargar Imagen)"
              :disabled="isGeneratingImage"
            >
              <font-awesome-icon v-if="!isGeneratingImage" icon="fa-brands fa-instagram" />
              <div v-else class="spinner-border spinner-border-sm" role="status"></div>
            </button>
          </div>
        </div>
      </header>

      <!-- IMAGEN DESTACADA -->
      <div class="featured-image-container">
        <img :src="blog.imageUrl" :alt="blog.title" class="featured-image" />
      </div>

      <!-- CUERPO DEL ARTÍCULO -->
      <article class="blog-body">
        <!-- Usamos una clase específica para dar estilo al contenido HTML -->
        <div class="blog-content-typography" v-html="formattedText"></div>
      </article>

      <!-- SECCIÓN DE COMENTARIOS -->
      <section class="comments-section">
        <h3 class="comments-title">
          Comentarios <span class="comments-count">({{ comments.length }})</span>
        </h3>

        <!-- Input de Comentarios Moderno -->
        <div class="comment-input-wrapper">
          <img
            :src="authUser?.photoURL || defaultAvatar"
            alt="Tu avatar"
            class="current-user-avatar"
          />
          <div class="input-group-modern">
            <input
              v-model="newComment"
              placeholder="Escribe un comentario..."
              class="comment-input-modern"
              @keyup.enter="addNewComment"
            />
            <button
              class="send-button-modern"
              @click="addNewComment"
              :disabled="!newComment.trim()"
              title="Enviar comentario"
            >
              <font-awesome-icon icon="fa-solid fa-paper-plane" />
            </button>
          </div>
        </div>

        <!-- Lista de Comentarios -->
        <div class="comments-list">
          <transition-group name="list">
            <div v-for="(comment, idx) in comments" :key="comment.id || idx" class="comment-item">
              <img :src="comment.image || defaultAvatar" alt="User Avatar" class="comment-avatar" />

              <div class="comment-bubble">
                <div class="comment-header">
                  <span class="comment-author-name">{{ comment.userName }}</span>

                  <!-- Menú desplegable (solo si es el autor) -->
                  <div class="comment-options" v-if="comment.userId === authUser?.uid">
                    <button class="options-btn" @click.stop="toggleMenu(idx)">⋮</button>
                    <transition name="fade-fast">
                      <div v-if="activeMenu === idx" class="options-dropdown">
                        <button
                          class="dropdown-item text-danger"
                          @click="deleteComment(comment, idx)"
                        >
                          <font-awesome-icon icon="fa-solid fa-trash" class="me-2" /> Eliminar
                        </button>
                      </div>
                    </transition>
                  </div>
                </div>
                <p class="comment-text">{{ comment.commentText }}</p>
              </div>
            </div>
          </transition-group>
        </div>

        <div v-if="comments.length === 0" class="no-comments-state">
          <p>Aún no hay comentarios. ¡Sé el primero en opinar!</p>
        </div>
      </section>
    </div>

    <!-- Estado de carga o error -->
    <div v-else class="loading-container">
      <p>Cargando artículo o no encontrado...</p>
    </div>

    <!-- Botón Toast de notificación -->
    <!-- ... (toast original) ... -->

    <!-- TEMPLATE OCULTO PARA INSTAGRAM STORIES -->
    <!-- Nota: Lo renderizamos fuera de la vista pero visible para html2canvas -->
    <div class="instagram-story-wrapper">
      <div ref="instagramStoryRef" class="instagram-story-template" v-if="blog">
        <!-- Fondo con degradado y branding -->
        <div class="story-background" :style="{ background: getStoryGradient(blog) }">
          <!-- Header de Marca -->
          <div class="story-header">
            <span class="story-brand">Crianza Sana</span>
          </div>

          <!-- Contenido Principal -->
          <div class="story-content">
            <!-- Imagen del Blog con marco -->
            <div class="story-image-container">
              <!-- Usamos background-image porque html2canvas maneja mejor el object-fit/cover así -->
              <div
                class="story-main-image-bg"
                :style="{ backgroundImage: `url(${blog.imageUrl})` }"
              ></div>
            </div>

            <!-- Título y Categoría -->
            <div class="story-text-container">
              <span class="story-category" :style="{ backgroundColor: getCategoryColor(blog) }">
                {{ blog.category }}
              </span>
              <h1 class="story-title">{{ blog.title }}</h1>
              <div class="story-author">
                <img
                  :src="getImagePerCategory(blog.authorName)"
                  crossorigin="anonymous"
                  class="story-author-img"
                />
                <span>{{ blog.authorName }}</span>
              </div>
            </div>
          </div>

          <!-- Footer Simulado -->
          <div class="story-footer">
            <div class="story-listen-badge">
              <span>Leer en el blog</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="toast-fade">
      <div v-if="showToast" class="toast-notification">
        <font-awesome-icon icon="fa-solid fa-check-circle" class="toast-icon" />
        <span>Enlace copiado al portapapeles</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
// Importamos los iconos necesarios, incluyendo Facebook y nuevos iconos de UI
import {
  faLink,
  faPaperPlane,
  faTrash,
  faCheckCircle,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { getCollection, getComments, addComment, deleteComment } from '../composables/useFirestore'
import { auth } from '@/firebase/firebaseConfig'
import LoginModal from '@/components/LoginModal.vue'
// import { onMounted, onBeforeUnmount } from 'vue' // Removed unused imports
import html2canvas from 'html2canvas'

import people from '../../data.js'

// Añadir iconos a la librería
library.add(faLink, faFacebookF, faInstagram, faPaperPlane, faTrash, faCheckCircle, faArrowLeft)

let scrollListener

export default {
  components: {
    FontAwesomeIcon,
    LoginModal,
  },
  data() {
    return {
      blogs: [],
      comments: [],
      authUser: null,
      newComment: '',
      activeMenu: null,
      showToast: false,
      showLoginModal: false,
      defaultAvatar:
        'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761837867/samples/zoom.avif',
      isGeneratingImage: false,
      specialists: people,
    }
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    blog() {
      return this.blogs.find((blog) => blog.id === this.id)
    },
    formattedDate() {
      if (!this.blog || !this.blog.date) return ''
      let publicationDate
      const dateField = this.blog.date

      // Lógica robusta de parseo (igual que en BlogView.vue)
      if (typeof dateField.toDate === 'function') {
        publicationDate = dateField.toDate()
      } else if (dateField.seconds || dateField._seconds) {
        const seconds = dateField.seconds || dateField._seconds
        publicationDate = new Date(seconds * 1000)
      } else {
        publicationDate = new Date(dateField)
      }

      // Validación extra
      if (isNaN(publicationDate.getTime())) {
        return 'Fecha no disponible'
      }

      // Formato de fecha más legible
      return publicationDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    },
    formattedText() {
      // Reemplazo robusto de saltos de línea
      return this.blog ? this.blog.text.replace(/(?:\r\n|\r|\n)/g, '<br>') : ''
    },
  },
  methods: {
    async loadBlogs() {
      try {
        this.blogs = await getCollection('blogs')
      } catch (error) {
        console.error('❌ Error cargando blogs:', error)
      }
    },
    toggleMenu(index) {
      this.activeMenu = this.activeMenu === index ? null : index
    },
    // Cierra el menú si se hace clic fuera
    closeMenuOnClickOutside(e) {
      if (this.activeMenu !== null && !e.target.closest('.comment-options')) {
        this.activeMenu = null
      }
    },
    getImagePerCategory(authorName) {
      if (!authorName) return this.defaultAvatar
      const name = authorName.toLowerCase().trim()
      // (Tu switch original aquí - abreviado para el ejemplo, funciona igual)
      switch (name) {
        case 'dra. miriam cervantes':
        case 'miriam cervantes':
          return 'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839072/MiriamCervantes1_vid8ol.jpg'
        case 'psic. luis a. galván':
        case 'luis a. galván solís':
        case 'luis a. galván':
          return 'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839071/Luis1_ehonlp.jpg'
        case 'roberto bravo':
        case 'roberto bravo romo':
          return 'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839073/RobertoBravo1_icbrae.jpg'
        case 'patricia peña':
        case 'patricia peña raigosa':
          return 'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839072/PatriciaPena1_d62zwv.jpg'
        case 'bianca macías':
          return 'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761842183/BiancaMacias1_re7wap.jpg'
        case 'ana laura sosa nevárez':
          return 'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839074/ANALSI_vd5vol.jpg'
        case 'silvia andrea soria díaz':
          return 'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839075/AndreaSoria1_wcgo0t.jpg'
        case 'karen meraz':
          return 'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839079/KarenMeraz1_htsbaq.jpg'
        case 'carina lares':
        case 'carina lares cervantes':
          return 'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839076/CarinaLares1_la9v6u.png'
        case 'saraid chávez':
          return 'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839078/SaraidChavez1_uyd3va.jpg'
        default:
          return this.defaultAvatar
      }
    },
    async loadComments() {
      if (!this.id) return
      try {
        this.comments = await getComments(this.id)
      } catch (error) {
        console.error('❌ Error cargando comentarios:', error)
      }
    },
    async addNewComment() {
      if (!this.newComment.trim()) return
      const user = auth.currentUser

      // Opcional: Descomentar para forzar inicio de sesión
      /* if (!user) { this.showLoginModal = true; return; } */

      try {
        const newCommentData = {
          userId: user ? user.uid : 'guest_' + Date.now(),
          userName: user ? user.displayName || 'Usuario Invitado' : 'Usuario Invitado',
          commentText: this.newComment,
          image: user ? user.photoURL : null,
          createdAt: new Date(), // Útil para ordenar
        }
        const commentId = await addComment(this.id, newCommentData)
        this.comments.push({ ...newCommentData, id: commentId })
        this.newComment = ''
      } catch (error) {
        console.error('❌ Error al agregar comentario:', error)
      }
    },
    async deleteComment(comment, idx) {
      const user = auth.currentUser
      if (!user || user.uid !== comment.userId) return
      if (!confirm('¿Estás seguro de que deseas eliminar este comentario?')) return

      try {
        await deleteComment(this.blog.id, comment.id)
        this.comments.splice(idx, 1)
        this.activeMenu = null
      } catch (error) {
        console.error('❌ Error al eliminar comentario:', error)
      }
    },
    shareBlog(id) {
      if (!this.blog) return
      const blogUrl = `${window.location.origin}/blog/${id}`
      // Solo copiamos el enlace, es más limpio
      navigator.clipboard
        .writeText(blogUrl)
        .then(() => {
          this.showToast = true
          setTimeout(() => {
            this.showToast = false
          }, 3000)
          this.trackShare('clipboard', id)
        })
        .catch((err) => console.error('Error al copiar:', err))
    },
    // NUEVA FUNCIÓN: Compartir en Facebook
    // NUEVA FUNCIÓN CORREGIDA: Compartir la URL exacta actual en Facebook
    // En tu componente Vue
    shareToFacebook(id) {
      if (!this.blog) return

      // ❌ ASÍ ESTÁ AHORA (INCORRECTO):
      // const backendUrl = 'https://crianza-sana-backend-production.up.railway.app'

      // ✅ ASÍ DEBE SER (CORRECTO):
      // Fíjate en el orden: backend-crianza-sana
      const backendUrl = 'https://backend-crianza-sana-production.up.railway.app'

      const shareUrl = encodeURIComponent(`${backendUrl}/blog/${id}`)
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`

      window.open(facebookShareUrl, 'facebook-share-dialog', 'width=626,height=436')
      // ...
    },
    // NUEVA FUNCIÓN: Generar Historia de Instagram
    async generateInstagramStory() {
      if (this.isGeneratingImage) return
      this.isGeneratingImage = true

      try {
        const element = this.$refs.instagramStoryRef
        if (!element) {
          console.error('No se encontró el elemento para la historia')
          this.isGeneratingImage = false
          return
        }

        // Configuración para mejor calidad
        // Eliminamos await nextTick para reducir latencia, asumimos que el elemento ya está (v-if="blog")
        const canvas = await html2canvas(element, {
          useCORS: true,
          scale: 2,
          backgroundColor: null,
          logging: false,
        })

        // --- LÓGICA WEB SHARE API OPTIMIZADA ---
        // 1. Convertir a DataURL (Síncrono)
        const dataUrl = canvas.toDataURL('image/png')

        // 2. Convertir a Blob (Síncrono con helper) para evitar callbacks async de toBlob
        const blob = this.dataURItoBlob(dataUrl)
        const file = new File([blob], `crianza-sana-story-${this.blog.id}.png`, {
          type: 'image/png',
        })

        // 3. Intentar compartir DIRECTAMENTE
        if (navigator.share) {
          try {
            // Algunos navegadores requieren solo 'files' para compartir archivos
            const shareData = {
              files: [file],
            }

            // Intentamos compartir
            await navigator.share(shareData)
            this.trackShare('instagram_story_share_api', this.blog.id)
          } catch (shareError) {
            // Si el usuario cancela, no hacemos nada (AbortError)
            // Si es otro error (ej. formato no soportado), hacemos fallback
            if (shareError.name !== 'AbortError') {
              console.warn('Share API falló, fallback a descarga:', shareError)
              this.downloadImage(dataUrl)
            }
          }
        } else {
          // Fallback para Desktop
          this.downloadImage(dataUrl)
        }
      } catch (error) {
        console.error('Error generando historia:', error)
        alert('Hubo un error al generar la imagen.')
      } finally {
        this.isGeneratingImage = false
      }
    },
    // Helper síncrono para mantener la interacción de usuario activa
    dataURItoBlob(dataURI) {
      const byteString = atob(dataURI.split(',')[1])
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ab], { type: mimeString })
    },
    downloadImage(dataUrl) {
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `crianza-sana-story-${this.blog.id}.png`
      link.click()
      this.trackShare('instagram_story_download', this.blog.id)

      // Mensaje más claro para el fallback
      alert(
        'No se pudo abrir Instagram directamente. La imagen se ha guardado en tu dispositivo. ¡Ábrela desde Instagram Stories!',
      )
    },
    getCategoryColor(blog) {
      if (!blog) return '#718096'

      // 1. Prioridad: Buscar color del especialista por nombre de autor
      if (blog.authorName) {
        const authorName = blog.authorName.toLowerCase().trim()
        const specialist = this.specialists.find((p) => p.name.toLowerCase().trim() === authorName)
        if (specialist && specialist.color) {
          return specialist.color
        }
      }

      // 2. Fallback: Color explícito en categoría (campo DB legacy)
      if (blog.categoryColor) return blog.categoryColor

      // 3. Fallback final: Por nombre de categoría
      const category = blog.category || ''
      const cat = category.toLowerCase().trim()

      if (cat.includes('crianza')) return '#e53e3e' // Rojo/Rosa fuerte
      if (cat.includes('salud')) return '#38a169' // Verde
      if (cat.includes('educa')) return '#3182ce' // Azul
      if (cat.includes('nutri')) return '#dd6b20' // Naranja
      if (cat.includes('psico')) return '#805ad5' // Morado
      if (cat.includes('odont')) return '#d53f8c' // Rosa fuerte (Odontopediatría)

      return '#718096'
    },
    getStoryGradient(blog) {
      if (!blog) return 'linear-gradient(180deg, #1a202c 0%, #2d3748 100%)'

      const color = this.getCategoryColor(blog)

      return `linear-gradient(180deg, ${color} 0%, #1a202c 100%)`
    },
    onImageLoad() {
      //- Helper para saber cuando la imagen cargó, aunque html2canvas suele manejarlo con useCORS
    },
    trackShare(method, id) {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'share_blog', {
          event_category: 'interacción',
          event_label: this.blog.title,
          blog_id: id,
          method: method,
        })
      }
    },
    goBack() {
      if (this.$router) {
        this.$router.back()
      } else {
        window.history.back()
      }
    },
  },
  async mounted() {
    await this.loadBlogs()
    await this.loadComments()
    this.authUser = auth.currentUser

    // Listener para cerrar menús al hacer clic fuera
    document.addEventListener('click', this.closeMenuOnClickOutside)

    scrollListener = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = scrollTop / docHeight
      if (scrollPercent >= 0.8) {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'scroll_blog_completo', {
            event_category: 'lectura_blog',
            event_label: this.blog?.title || this.id,
          })
        }
        window.removeEventListener('scroll', scrollListener)
      }
    }
    window.addEventListener('scroll', scrollListener)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeMenuOnClickOutside)
    if (typeof scrollListener === 'function') {
      window.removeEventListener('scroll', scrollListener)
    }
  },
}
</script>

<style scoped>
/* --- Estilos Globales y Contenedor Principal --- */
.blog-container {
  width: 100%;
  min-height: 100vh;
  /* SOLUCIÓN NAVBAR: Padding superior grande para evitar superposición */
  padding: 110px 20px 60px;
  /* Fondo degradado moderno y profesional */
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: var(--dm-text); /* Color de texto principal más suave que el negro puro */
  flex-direction: column;
  align-items: center;
}

/* Botón de Regresar */
.btn-back {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 30px;
  color: var(--dm-text-secondary);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  margin-left: 10px;
}

.btn-back:hover {
  background-color: var(--dm-surface);
  color: var(--dm-text);
  transform: translateX(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

/* --- Tarjeta del Detalle del Blog --- */
.blog-detail-card {
  background-color: var(--dm-surface);
  width: 100%;
  max-width: 850px; /* Ancho óptimo para lectura */
  border-radius: 16px;
  /* Sombra suave y moderna */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* --- Header del Blog --- */
.blog-header {
  padding: 40px 40px 30px;
}

.blog-category-pill {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 30px;
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.blog-title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--dm-text);
  margin-bottom: 10px;
}

.blog-subtitle {
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--dm-text-secondary);
  margin-bottom: 25px;
}

/* --- Meta Info y Compartir --- */
.blog-meta-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--dm-border);
}

.author-meta {
  display: flex;
  align-items: center;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--dm-text);
}

.meta-date {
  font-size: 0.9rem;
  color: var(--dm-text-secondary);
}

/* Botones de Compartir */
.share-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.share-label {
  font-size: 0.9rem;
  color: var(--dm-text-secondary);
  font-weight: 600;
}

.share-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.copy-btn {
  background-color: var(--dm-border);
  color: var(--dm-text-secondary);
}
.copy-btn:hover {
  background-color: var(--dm-border);
  color: var(--dm-text);
}

.facebook-btn {
  background-color: #1877f2; /* Color oficial de Facebook */
  color: white;
}
/* Botón Instagram */
.instagram-btn {
  background: radial-gradient(
    circle at 30% 107%,
    #fdf497 0%,
    #fdf497 5%,
    #fd5949 45%,
    #d6249f 60%,
    #285aeb 90%
  );
  color: white;
}
.instagram-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* --- Estilos para la Historia de Instagram Generada --- */
/* Wrapper oculto pero renderizado */
.instagram-story-wrapper {
  position: absolute;
  top: -9999px;
  left: -9999px;
  /* Importante: width/height fijos para simular pantalla de móvil */
  width: 1080px;
  height: 1920px;
  overflow: hidden;
}

.instagram-story-template {
  width: 1080px;
  height: 1920px;
  position: relative;
  font-family: 'Inter', sans-serif; /* Asegurar fuente moderna */
}

.story-background {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 80px;
  box-sizing: border-box;
}

.story-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
}

.story-brand {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.story-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 60px;
}

.story-image-container {
  width: 800px;
  height: 800px; /* Cuadrado o ratio 4:5 */
  border-radius: 40px;
  overflow: hidden;
  box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.5); /* Sombra dramática estilo Spotify */
  position: relative;
}

.story-main-image-bg {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.story-text-container {
  text-align: center;
  color: white;
  max-width: 900px;
}

.story-category {
  display: inline-block;
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 25px;
  border-radius: 50px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.story-title {
  font-size: 4rem; /* Muy grande y legible */
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 30px;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.story-author {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  font-size: 1.8rem;
  font-weight: 500;
}

.story-author-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid white;
}

.story-footer {
  display: flex;
  justify-content: center;
  padding-top: 40px;
}

.story-listen-badge {
  background: var(--dm-surface);
  color: var(--dm-text);
  padding: 15px 40px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* --- Imagen Destacada --- */
.featured-image-container {
  width: 100%;
  max-height: 450px;
  overflow: hidden;
}

.featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* --- Cuerpo del Artículo (Tipografía Mejorada) --- */
.blog-body {
  padding: 40px;
}

.blog-content-typography {
  font-size: 1.125rem; /* 18px es excelente para lectura */
  line-height: 1.8; /* Interlineado amplio para facilitar la lectura */
  color: var(--dm-text);
  text-align: left; /* NUNCA justificar texto en web */
}

/* --- Headings inside article --- */
.blog-content-typography :deep(h2) {
  font-size: 1.65rem;
  font-weight: 800;
  color: var(--dm-text);
  margin: 2rem 0 0.75rem;
  line-height: 1.25;
  border-bottom: 2px solid var(--dm-border);
  padding-bottom: 0.4rem;
}
.blog-content-typography :deep(h3) {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--dm-text);
  margin: 1.5rem 0 0.5rem;
}

/* --- Blockquote / Citas destacadas --- */
.blog-content-typography :deep(blockquote) {
  position: relative;
  margin: 2rem 0;
  padding: 1.25rem 1.5rem 1.25rem 1.75rem;
  background: rgba(124, 58, 237, 0.1);
  border-left: 5px solid #7c3aed;
  border-radius: 0 12px 12px 0;
  font-style: italic;
  font-size: 1.1rem;
  color: #4c1d95;
  line-height: 1.75;
  quotes: none;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.08);
}
.blog-content-typography :deep(blockquote)::before {
  content: '\201C';
  position: absolute;
  top: -4px;
  left: 14px;
  font-size: 4rem;
  font-style: normal;
  color: #7c3aed;
  opacity: 0.25;
  line-height: 1;
  font-family: Georgia, serif;
  pointer-events: none;
}

/* --- Lists --- */
.blog-content-typography :deep(ul),
.blog-content-typography :deep(ol) {
  padding-left: 1.75rem;
  margin: 0.75rem 0 1.25rem;
}
.blog-content-typography :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.7;
}
.blog-content-typography :deep(ul li)::marker {
  color: #7c3aed;
}
.blog-content-typography :deep(ol li)::marker {
  color: #7c3aed;
  font-weight: 700;
}

/* --- Links --- */
.blog-content-typography :deep(a) {
  color: #7c3aed;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
}
.blog-content-typography :deep(a:hover) {
  color: #4c1d95;
}

/* --- Bold / Italic --- */
.blog-content-typography :deep(strong) {
  font-weight: 700;
  color: var(--dm-text);
}
.blog-content-typography :deep(em) {
  font-style: italic;
  color: var(--dm-text-secondary);
}

/* --- Paragraphs spacing --- */
.blog-content-typography :deep(p) {
  margin-bottom: 1.1rem;
}

/* --- Sección de Comentarios Moderna --- */
.comments-section {
  padding: 0 40px 40px;
  background-color: var(--dm-surface-2); /* Fondo ligeramente diferente para separar */
  border-top: 1px solid var(--dm-border);
}

.comments-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 30px 0 25px;
  color: var(--dm-text);
}

.comments-count {
  color: var(--dm-text-secondary);
  font-weight: 400;
}

/* Input de Comentarios Estilo Chat */
.comment-input-wrapper {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.current-user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.input-group-modern {
  flex-grow: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.comment-input-modern {
  width: 100%;
  padding: 12px 50px 12px 20px;
  border: 2px solid var(--dm-border);
  border-radius: 25px;
  background-color: var(--dm-surface);
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.comment-input-modern:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.send-button-modern {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: #3b82f6;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-button-modern:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-50%) scale(1.05);
}

.send-button-modern:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

/* Lista de Comentarios */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-bubble {
  background-color: var(--dm-surface);
  padding: 15px;
  border-radius: 18px;
  border-top-left-radius: 2px; /* Efecto burbuja de chat */
  flex-grow: 1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--dm-border);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-author-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--dm-text);
}

.comment-text {
  font-size: 0.95rem;
  color: var(--dm-text-secondary);
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
}

/* Menú Desplegable de Opciones */
.comment-options {
  position: relative;
}

.options-btn {
  background: none;
  border: none;
  color: var(--dm-text-secondary);
  font-size: 1.2rem;
  padding: 0 5px;
  cursor: pointer;
}
.options-btn:hover {
  color: var(--dm-text-secondary);
}

.options-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--dm-surface);
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 5px;
  z-index: 10;
  min-width: 120px;
  border: 1px solid var(--dm-border);
}

.dropdown-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
}
.dropdown-item:hover {
  background-color: var(--dm-surface-2);
}
.text-danger {
  color: #e53e3e;
}

.no-comments-state {
  text-align: center;
  padding: 30px;
  color: var(--dm-text-secondary);
  font-style: italic;
}

/* --- Toast Notification Moderno --- */
.toast-notification {
  position: fixed;
  top: 30px;
  right: 30px;
  background: var(--dm-surface);
  color: var(--dm-text);
  padding: 12px 20px;
  margin-top: 3rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  z-index: 1050;
  font-weight: 600;
  font-size: 0.95rem;
  border-left: 4px solid #48bb78; /* Verde éxito */
}
.toast-icon {
  color: #48bb78;
  margin-right: 10px;
  font-size: 1.1rem;
}

/* --- Animaciones y Loading --- */
.fade-in {
  animation: fadeIn 0.6s ease-out;
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

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.2s ease;
}
.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding-top: 100px;
  color: var(--dm-text-secondary);
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .blog-container {
    padding: 90px 15px 40px;
  } /* Ajuste de padding en móvil */
  .blog-header,
  .blog-body,
  .comments-section {
    padding: 30px 20px;
  }
  .blog-title {
    font-size: 1.8rem;
  }
  .blog-subtitle {
    font-size: 1.2rem;
  }
  .blog-meta-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  .share-actions {
    width: 100%;
    justify-content: flex-start;
  }
  .featured-image-container {
    max-height: 250px;
  }
  .blog-content-typography {
    font-size: 1.05rem;
  }
}
</style>
