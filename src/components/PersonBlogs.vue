<template>
  <!-- Solo mostramos la sección si hay blogs filtrados -->
  <div v-if="filteredBlogs.length > 0" class="person-blogs-section">
    <div class="container-fluid main-container">
      <!-- Título de la sección -->
      <div class="text-center mb-5 fade-in">
        <h6 class="text-uppercase letter-spacing-2 text-muted mb-2">Publicaciones</h6>
        <h2 class="display-6 fw-bold text-dark">Artículos Recientes</h2>
      </div>

      <!-- Carrusel Swiper -->
      <!-- Añadimos 'position-relative' para posicionar las flechas -->
      <div class="carousel-container position-relative fade-in delay-1">
        <swiper
          :modules="modules"
          :slides-per-view="slidesPerView"
          :space-between="30"
          :autoplay="{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }"
          :pagination="{ clickable: true, dynamicBullets: true }"
          :navigation="{
            nextEl: '.custom-next',
            prevEl: '.custom-prev',
          }"
          :breakpoints="swiperBreakpoints"
          :loop="filteredBlogs.length > slidesPerView"
          class="blogs-swiper"
        >
          <swiper-slide v-for="blog in filteredBlogs" :key="blog.id" class="h-auto">
            <!-- Tarjeta de Blog (con h-100 para igualar alturas) -->
            <article class="blog-card h-100" @click="goToBlog(blog.id)">
              <div class="blog-image-wrapper">
                <img :src="blog.imageUrl" :alt="blog.title" class="blog-image" />
                <span
                  class="category-badge"
                  :style="{ backgroundColor: blog.categoryColor || personColor || '#2563eb' }"
                >
                  {{ blog.category }}
                </span>
              </div>

              <div class="blog-content">
                <div class="blog-meta">
                  <span class="blog-date"
                    ><i class="far fa-calendar-alt me-2"></i>{{ formatDate(blog.date) }}</span
                  >
                </div>

                <h3 class="blog-title">{{ blog.title }}</h3>
                <p class="blog-excerpt">{{ truncateText(blog.description, 100) }}</p>

                <div class="blog-footer">
                  <!-- Usamos el color de la persona también para el enlace "Leer más" -->
                  <span class="read-more" :style="{ color: personColor }">
                    Leer más <i class="fas fa-arrow-right ms-1"></i>
                  </span>
                </div>
              </div>
            </article>
          </swiper-slide>

          <!-- Paginación -->
          <template v-slot:pagination>
            <div class="swiper-pagination"></div>
          </template>
        </swiper>

        <!-- --- NUEVAS FLECHAS DE NAVEGACIÓN ESTILIZADAS --- -->
        <!-- Usamos una variable CSS inline para pasar el color dinámico al CSS -->
        <div class="custom-arrow custom-prev" :style="{ '--arrow-color': personColor }">
          <i class="fas fa-chevron-left"></i>
        </div>
        <div class="custom-arrow custom-next" :style="{ '--arrow-color': personColor }">
          <i class="fas fa-chevron-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCollection } from '../composables/useFirestore'
import { areNamesEquivalent } from '@/utils/stringUtils'
// 1. Importar componentes y módulos de Swiper (Añadido Navigation)
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

// 2. Importar estilos de Swiper
import 'swiper/css'
import 'swiper/css/pagination'
// No es necesario importar navigation.css porque usamos estilos propios

export default {
  name: 'PersonBlogs',
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    personName: {
      type: String,
      required: true,
    },
    // NUEVA PROP: Necesitamos el color de la persona
    personColor: {
      type: String,
      required: true,
      default: '#2563eb', // Un azul por defecto si no llega nada
    },
  },
  data() {
    return {
      allBlogs: [],
      loading: true,
      // Configuración de Swiper (Añadido Navigation)
      modules: [Autoplay, Pagination, Navigation],
      slidesPerView: 1.1,
      swiperBreakpoints: {
        576: { slidesPerView: 1.5, spaceBetween: 20 },
        768: { slidesPerView: 2.2, spaceBetween: 30 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
      },
    }
  },
  async mounted() {
    try {
      const data = await getCollection('blogs')
      // Sort by date descending (Más recientes primero)
      this.allBlogs = data.sort((a, b) => {
        const dateA = a.date && a.date.toDate ? a.date.toDate() : new Date(0)
        const dateB = b.date && b.date.toDate ? b.date.toDate() : new Date(0)
        return dateB - dateA
      })
    } catch (error) {
      console.error('Error loading blogs:', error)
    } finally {
      this.loading = false
    }
  },
  computed: {
    filteredBlogs() {
      if (!this.personName || this.allBlogs.length === 0) return []

      return this.allBlogs
        .filter((blog) => {
          if (!blog.authorName) return false
          return areNamesEquivalent(blog.authorName, this.personName)
        })
        .slice(0, 5)
    },
  },
  methods: {
    goToBlog(id) {
      if (this.$router) {
        this.$router.push({ name: 'BlogDetail', params: { id } }).catch(() => {
          window.location.href = `/blog/${id}`
        })
      } else {
        window.location.href = `/blog/${id}`
      }
    },
    truncateText(text, length) {
      if (!text) return ''
      if (text.length <= length) return text
      return text.substring(0, length) + '...'
    },
    // En PersonBlogs.vue, dentro de methods:
    // En PersonBlogs.vue, dentro de methods:

    formatDate(timestamp) {
      // 1. Si no hay dato, no mostramos nada.
      if (!timestamp) return ''

      let date

      // --- PARSEO ROBUSTO BASADO EN TUS LOGS ---

      // Caso A: Es un objeto Timestamp estándar de Firestore (tiene .toDate())
      if (typeof timestamp.toDate === 'function') {
        date = timestamp.toDate()
      }
      // Caso B: Es el objeto Proxy que mostraste en los logs (tiene _seconds)
      // Multiplicamos los segundos por 1000 para obtener milisegundos, que es lo que pide 'new Date()'
      else if (timestamp._seconds && typeof timestamp._seconds === 'number') {
        date = new Date(timestamp._seconds * 1000)
      }
      // Caso C: Intento genérico (por si es un string de fecha normal o un número de milisegundos)
      else {
        date = new Date(timestamp)
      }

      // --- SEGURIDAD ---
      // Si después de todo esto la fecha sigue siendo inválida, devolvemos un texto seguro.
      if (isNaN(date.getTime())) {
        // console.warn('No se pudo parsear la fecha:', timestamp); // Descomenta para depurar si hace falta
        return 'Fecha no disp.'
      }

      // --- LÓGICA DE FECHA RELATIVA (La que te gustó) ---

      const today = new Date()
      // Reseteamos horas para comparar días netos
      today.setHours(0, 0, 0, 0)
      const dateToCompare = new Date(date)
      dateToCompare.setHours(0, 0, 0, 0)

      const differenceInTime = today.getTime() - dateToCompare.getTime()
      // Calculamos diferencia en días
      const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24))

      if (differenceInDays === 0) {
        return '¡Nuevo!✨'
      } else if (differenceInDays > 0 && differenceInDays <= 3) {
        return `Hace ${differenceInDays} días`
      } else {
        // Formato estándar para fechas más antiguas
        return date
          .toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
          .replace(/\//g, '-') // Formato dd-mm-yyyy
      }
    },
  },
}
</script>

<style scoped>
.person-blogs-section {
  padding: 10px 0;
}

.main-container {
  max-width: 1400px;
  padding-left: 5%;
  padding-right: 5%;
}

.letter-spacing-2 {
  letter-spacing: 2px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Estilos del Swiper */
.carousel-container {
  padding-bottom: 50px;
  /* position: relative; <-- Ya añadido en el template con clase de bootstrap */
}

.blogs-swiper {
  padding: 20px 10px;
  margin: -20px -10px;
}

.swiper-slide {
  height: auto;
  display: flex;
}

/* --- ESTILOS DE LAS FLECHAS PERSONALIZADAS (Copiados del componente anterior) --- */
.custom-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background-color: #ffffff;
  /* Usamos la variable CSS definida en el estilo inline del template */
  color: var(--arrow-color);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  border: 2px solid transparent;
}

.custom-prev {
  left: -25px;
}

.custom-next {
  right: -25px;
}

/* Efecto Hover Dinámico */
.custom-arrow:hover {
  background-color: var(--arrow-color);
  color: #ffffff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-50%) scale(1.1);
}

/* Estado deshabilitado */
.custom-arrow.swiper-button-disabled {
  opacity: 0.4;
  cursor: default;
  pointer-events: none;
  box-shadow: none;
}

/* Ocultar flechas en móviles pequeños */
@media (max-width: 768px) {
  .custom-arrow {
    display: none;
  }
  .main-container {
    padding-left: 15px;
    padding-right: 15px;
  }
  .custom-prev {
    left: 0;
  }
  .custom-next {
    right: 0;
  }
}

/* Estilos de la Tarjeta */
.blog-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.blog-card:hover {
  transform: translateY(-7px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border-color: transparent;
}

.blog-image-wrapper {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.blog-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.blog-card:hover .blog-image {
  transform: scale(1.05);
}

.category-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.blog-content {
  padding: 25px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.blog-meta {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 10px;
}

.blog-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
  line-height: 1.4;
}

.blog-excerpt {
  font-size: 0.95rem;
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 20px;
  flex-grow: 1;
}

.blog-footer {
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.read-more {
  /* color: #2563eb;  <-- Eliminado, ahora se usa estilo inline dinámico */
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  transition: opacity 0.2s;
}

.blog-card:hover .read-more {
  opacity: 0.8; /* Ligero efecto al hacer hover en la tarjeta */
}

/* Estilos de Paginación de Swiper */
:deep(.swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  background: #ccc;
  opacity: 0.6;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  /* Usamos la variable de color también para los puntos */
  background: var(--arrow-color) !important;
  width: 25px;
  border-radius: 5px;
  opacity: 1;
}

/* Animation */
.fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease-out forwards;
}
.delay-1 {
  animation-delay: 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .person-blogs-section {
    padding: 50px 0;
  }
  .blog-image-wrapper {
    height: 180px;
  }
  .blog-content {
    padding: 20px;
  }
}
</style>
