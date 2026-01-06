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

    <!-- Toast de notificación -->
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
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { getCollection, getComments, addComment, deleteComment } from '../composables/useFirestore'
import { auth } from '@/firebase/firebaseConfig'
import LoginModal from '@/components/LoginModal.vue'
import { onMounted, onBeforeUnmount } from 'vue'

// Añadir iconos a la librería
library.add(faLink, faFacebookF, faPaperPlane, faTrash, faCheckCircle, faArrowLeft)

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
  color: #2c3e50; /* Color de texto principal más suave que el negro puro */
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
  color: #555;
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
  background-color: #ffffff;
  color: #000;
  transform: translateX(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

/* --- Tarjeta del Detalle del Blog --- */
.blog-detail-card {
  background-color: #ffffff;
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
  color: #1a202c;
  margin-bottom: 10px;
}

.blog-subtitle {
  font-size: 1.5rem;
  font-weight: 400;
  color: #4a5568;
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
  border-top: 1px solid #edf2f7;
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
  color: #2d3748;
}

.meta-date {
  font-size: 0.9rem;
  color: #718096;
}

/* Botones de Compartir */
.share-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.share-label {
  font-size: 0.9rem;
  color: #718096;
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
  background-color: #edf2f7;
  color: #4a5568;
}
.copy-btn:hover {
  background-color: #e2e8f0;
  color: #2d3748;
}

.facebook-btn {
  background-color: #1877f2; /* Color oficial de Facebook */
  color: white;
}
.facebook-btn:hover {
  background-color: #166fe5;
  transform: translateY(-2px);
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
  color: #2d3748;
  text-align: left; /* NUNCA justificar texto en web */
}

/* --- Sección de Comentarios Moderna --- */
.comments-section {
  padding: 0 40px 40px;
  background-color: #f8fafc; /* Fondo ligeramente diferente para separar */
  border-top: 1px solid #edf2f7;
}

.comments-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 30px 0 25px;
  color: #1a202c;
}

.comments-count {
  color: #718096;
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
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  background-color: white;
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
  background-color: white;
  padding: 15px;
  border-radius: 18px;
  border-top-left-radius: 2px; /* Efecto burbuja de chat */
  flex-grow: 1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid #edf2f7;
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
  color: #2d3748;
}

.comment-text {
  font-size: 0.95rem;
  color: #4a5568;
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
  color: #a0aec0;
  font-size: 1.2rem;
  padding: 0 5px;
  cursor: pointer;
}
.options-btn:hover {
  color: #718096;
}

.options-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 5px;
  z-index: 10;
  min-width: 120px;
  border: 1px solid #edf2f7;
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
  background-color: #f7fafc;
}
.text-danger {
  color: #e53e3e;
}

.no-comments-state {
  text-align: center;
  padding: 30px;
  color: #a0aec0;
  font-style: italic;
}

/* --- Toast Notification Moderno --- */
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
  color: #718096;
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
