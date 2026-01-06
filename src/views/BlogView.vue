<template lang="html">
  <!-- Toast de notificación -->
  <transition name="fade">
    <div v-if="showToast" class="toast-notification">
      <i class="fas fa-check-circle me-2"></i>
      <span>Enlace copiado al portapapeles</span>
      <button @click="showToast = false" class="toast-close">✖</button>
    </div>
  </transition>

  <div class="blogs-page-container">
    <!-- Botón de Regresar -->
    <div class="container mb-4 fade-in">
      <button @click="goBack" class="btn-back">
        <font-awesome-icon icon="fa-solid fa-arrow-left" />
        <span class="ms-2 d-none d-sm-inline">Regresar</span>
      </button>
    </div>
    <!-- Cabecera de la sección -->
    <header class="blogs-header text-center fade-in">
      <!-- Título más pequeño y sutil como pediste -->
      <h3
        class="text-uppercase letter-spacing-2 text-dark mb-4 mt-0"
        style="font-size: 1.5rem; opacity: 0.8"
      >
        Nuestro Blog
      </h3>

      <!-- NUEVO: Botón para mostrar/ocultar filtros -->
      <button class="btn-toggle-filters fade-in delay-1" @click="showFilters = !showFilters">
        <i class="fas fa-sliders-h me-2"></i>
        {{ showFilters ? 'Ocultar Filtros' : 'Filtrar y Ordenar' }}
      </button>
    </header>

    <!-- Controles de Filtrado y Ordenamiento (DESPLEGABLE) -->
    <!-- Usamos una transición para que se despliegue suavemente -->
    <transition name="slide-down">
      <section v-if="showFilters" class="blog-controls-section">
        <div class="controls-container">
          <!-- Filtro por Categoría -->
          <div class="filter-group">
            <label class="control-label">
              <i class="fas fa-filter me-2"></i>Filtrar por Categoría:
            </label>
            <div class="category-pills">
              <button
                v-for="cat in uniqueCategories"
                :key="cat"
                class="category-pill"
                :class="{ active: selectedCategories.includes(cat) }"
                :style="
                  selectedCategories.includes(cat)
                    ? { backgroundColor: getCategoryColor(cat), borderColor: getCategoryColor(cat) }
                    : {}
                "
                @click="toggleCategory(cat)"
              >
                {{ cat }}
              </button>
              <button
                v-if="selectedCategories.length"
                class="clear-filters-btn"
                @click="clearFilters"
              >
                Limpiar ✖
              </button>
            </div>
          </div>

          <!-- Ordenar por Fecha -->
          <div class="sort-group">
            <label class="control-label"><i class="fas fa-sort me-2"></i>Ordenar por:</label>
            <div class="sort-segmented-control">
              <button @click="sortByRecent" :class="{ active: sortOrder === 'recent' }">
                Más Recientes
              </button>
              <button @click="sortByOldest" :class="{ active: sortOrder === 'oldest' }">
                Más Antiguos
              </button>
            </div>
          </div>
        </div>
      </section>
    </transition>

    <!-- Lista de Blogs (Grid) -->
    <section class="blog-grid-section fade-in delay-2">
      <div v-if="paginatedBlogs.length > 0" class="blog-grid">
        <article class="blog-card-modern" v-for="(blog, index) in paginatedBlogs" :key="index">
          <!-- Imagen y Categoría -->
          <div class="blog-card-image-wrapper">
            <img :src="blog.imageUrl" :alt="blog.title" class="blog-card-image" />
            <span
              v-if="blog.category"
              class="blog-card-category"
              :style="{ backgroundColor: blog.categoryColor || '#2563eb' }"
            >
              {{ blog.category }}
            </span>
            <!-- Botón de compartir flotante -->
            <button class="share-btn-floating" @click.stop="shareBlog(blog.id)" title="Compartir">
              <font-awesome-icon icon="fa-solid fa-share-from-square" />
            </button>
          </div>

          <!-- Contenido de la Tarjeta -->
          <div class="blog-card-content">
            <div class="blog-card-meta">
              <span class="blog-date">
                <i class="far fa-calendar-alt me-2"></i>{{ getFormattedFirestoreDate(blog.date) }}
              </span>
            </div>

            <h3 class="blog-card-title">
              <a :href="`/blog/${blog.id}`" @click.prevent="goToBlogDetail(blog.id)">
                {{ blog.title }}
              </a>
            </h3>

            <p class="blog-card-excerpt">{{ truncateText(blog.description, 120) }}</p>

            <!-- Footer de la Tarjeta: Autor y Botón -->
            <div class="blog-card-footer">
              <div class="blog-author-info">
                <img
                  :src="getImagePerCategory(blog.authorName)"
                  alt="Author"
                  class="author-avatar"
                />
                <span class="author-name">{{ blog.authorName }}</span>
              </div>
              <button class="read-more-btn" @click="goToBlogDetail(blog.id)">
                Leer más <i class="fas fa-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- Estado vacío si no hay blogs -->
      <div v-else class="no-results text-center py-5">
        <div class="empty-state-container">
          <i class="fas fa-search fa-3x mb-3"></i>
          <h4 class="">No se encontraron artículos.</h4>
          <p class="">Intenta seleccionar otras categorías.</p>
        </div>
      </div>
    </section>

    <!-- Paginación Moderna -->
    <nav v-if="totalPages > 1" class="pagination-modern fade-in delay-3">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="pagination-arrow"
        title="Anterior"
      >
        <i class="fas fa-chevron-left"></i>
      </button>

      <div class="pagination-pages">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="['pagination-page-btn', { active: currentPage === page }]"
        >
          {{ page }}
        </button>
      </div>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="pagination-arrow"
        title="Siguiente"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </nav>

    <!-- <Footer /> -->
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faShare,
  faCheckCircle,
  faFilter,
  faSort,
  faChevronLeft,
  faChevronRight,
  faSearch,
  faArrowRight,
  faSlidersH, // Nuevo icono para el botón de toggle
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { getCollection } from '../composables/useFirestore'
// import Footer from '@/components/Footer.vue'

// Añadir iconos a la librería
library.add(
  faShare,
  faCheckCircle,
  faFilter,
  faSort,
  faChevronLeft,
  faChevronRight,
  faSearch,
  faArrowRight,
  faCalendarAlt,
  faSlidersH,
  faArrowLeft,
)

const blogs = ref([])
const showToast = ref(false)
const originalBlogs = ref([])
const selectedCategories = ref([])
const sortOrder = ref('recent')
// NUEVO: Estado para controlar si se muestran los filtros
const showFilters = ref(false)

// Variables para paginación
const currentPage = ref(1)
const itemsPerPage = ref(9)

// Computed para blogs paginados
const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return blogs.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(blogs.value.length / itemsPerPage.value)
})

const uniqueCategories = computed(() => {
  const categories = originalBlogs.value.map((blog) => blog.category).filter(Boolean)
  return [...new Set(categories)]
})

// --- FUNCIONES DE ORDENAMIENTO Y FILTRADO ---

const parseBlogDate = (dateField) => {
  if (!dateField) return new Date(0)
  if (typeof dateField.toDate === 'function') return dateField.toDate()
  if (dateField.seconds || dateField._seconds) {
    const seconds = dateField.seconds || dateField._seconds
    return new Date(seconds * 1000)
  }
  return new Date(dateField)
}

const filterBlogs = () => {
  let filtered = [...originalBlogs.value]
  // Filtrado por categorías
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter((blog) => selectedCategories.value.includes(blog.category))
  }
  // Ordenamiento
  if (sortOrder.value === 'recent') {
    filtered.sort((a, b) => parseBlogDate(b.date) - parseBlogDate(a.date))
  } else {
    filtered.sort((a, b) => parseBlogDate(a.date) - parseBlogDate(b.date))
  }
  blogs.value = filtered
  currentPage.value = 1
}

const sortByRecent = () => {
  sortOrder.value = 'recent'
  filterBlogs()
}

const sortByOldest = () => {
  sortOrder.value = 'oldest'
  filterBlogs()
}

// ARREGLO FILTROS: Usamos deep: true para asegurar reactividad en arrays
watch(
  selectedCategories,
  () => {
    filterBlogs()
  },
  { deep: true },
)

// Función para alternar categorías (activar/desactivar)
const toggleCategory = (category) => {
  if (selectedCategories.value.includes(category)) {
    // Si ya está, la quitamos
    selectedCategories.value = selectedCategories.value.filter((c) => c !== category)
  } else {
    // Si no está, la añadimos
    selectedCategories.value.push(category)
  }
}

const clearFilters = () => {
  selectedCategories.value = []
}

const getCategoryColor = (category) => {
  const blogWithCategory = originalBlogs.value.find((b) => b.category === category)
  return blogWithCategory?.categoryColor || '#6c757d'
}

// Funciones de paginación
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    scrollToTop()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    scrollToTop()
  }
}

const goToPage = (page) => {
  currentPage.value = page
  scrollToTop()
}

const getImagePerCategory = (authorName) => {
  if (!authorName)
    return 'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761837867/samples/zoom.avif'
  const name = authorName.toLowerCase().trim()
  const authorImages = {
    'dra. miriam cervantes':
      'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839072/MiriamCervantes1_vid8ol.jpg',
    'miriam cervantes':
      'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839072/MiriamCervantes1_vid8ol.jpg',
    'psic. luis a. galván':
      'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839071/Luis1_ehonlp.jpg',
    'luis a. galván solís':
      'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839071/Luis1_ehonlp.jpg',
    'luis a. galván':
      'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839071/Luis1_ehonlp.jpg',
    'roberto bravo':
      'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839073/RobertoBravo1_icbrae.jpg',
    'roberto bravo romo':
      'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839073/RobertoBravo1_icbrae.jpg',
    'patricia peña':
      'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839072/PatriciaPena1_d62zwv.jpg',
    'patricia peña raigosa':
      'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839072/PatriciaPena1_d62zwv.jpg',
    'bianca macías':
      'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761842183/BiancaMacias1_re7wap.jpg',
    'ana laura sosa nevárez':
      'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839074/ANALSI_vd5vol.jpg',
    'silvia andrea soria díaz':
      'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839075/AndreaSoria1_wcgo0t.jpg',
    'karen meraz':
      'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839079/KarenMeraz1_htsbaq.jpg',
    'carina lares':
      'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839076/CarinaLares1_la9v6u.png',
    'carina lares cervantes':
      'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839076/CarinaLares1_la9v6u.png',
    'saraid chávez':
      'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761839078/SaraidChavez1_uyd3va.jpg',
  }
  return (
    authorImages[name] ||
    'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761837867/samples/zoom.avif'
  )
}

const scrollToTop = () => {
  const gridSection = document.querySelector('.blog-grid-section')
  if (gridSection) {
    gridSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const loadBlogs = async () => {
  try {
    const data = await getCollection('blogs')
    originalBlogs.value = data
    filterBlogs()
  } catch (error) {
    console.error('Error cargando blogs:', error)
  }
}

const goToBlogDetail = (id) => {
  window.location.href = `/blog/${id}`
}

const shareBlog = (id) => {
  const blog = blogs.value.find((b) => b.id === id)
  if (!blog) return
  const blogUrl = `${window.location.origin}/blog/${id}`
  const message = `"${blog.title}" - ¡Echa un vistazo a este artículo! ${blogUrl}`
  navigator.clipboard
    .writeText(message)
    .then(() => {
      showToast.value = true
      setTimeout(() => {
        showToast.value = false
      }, 3000)
    })
    .catch((err) => console.error('Error al copiar el enlace:', err))
}

const truncateText = (text, length) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    window.location.href = '/'
  }
}

const getFormattedFirestoreDate = (timestamp) => {
  if (!timestamp) return ''
  const date = parseBlogDate(timestamp)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dateToCompare = new Date(date)
  dateToCompare.setHours(0, 0, 0, 0)

  const differenceInTime = today.getTime() - dateToCompare.getTime()
  const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24))

  if (differenceInDays === 0) {
    return '¡Nuevo hoy! ✨'
  } else if (differenceInDays > 0 && differenceInDays <= 7) {
    return `Hace ${differenceInDays} días`
  } else {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }
}

onMounted(() => {
  loadBlogs()
})
</script>

<style scoped>
/* --- Estilos Generales y Tipografía --- */
.blogs-page-container {
  padding-top: 60px;
  /* RESTAURADO: Fondo de gradiente original */
  /* background: linear-gradient(to right, #d7e1ec, #b0c6e8); */
  min-height: 100vh;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #343a40;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Botón de Regresar */
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
  margin-left: 5%;
}

.btn-back:hover {
  background-color: #ffffff;
  color: #000;
  transform: translateX(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.letter-spacing-2 {
  letter-spacing: 2px;
  font-weight: 600;
}

/* --- Cabecera y Botón Toggle --- */
.blogs-header {
  padding: 10px 20px 20px; /* Reducido el padding */
  margin-top: 0;
}

/* Nuevo botón para mostrar/ocultar filtros */
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

/* --- Controles Desplegables --- */
.blog-controls-section {
  padding: 0 20px 30px 20px;
  overflow: hidden; /* Necesario para la transición */
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

/* Transición suave para el despliegue */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  max-height: 500px; /* Altura máxima aproximada del contenedor abierto */
  opacity: 1;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.control-label {
  display: block;
  font-weight: 700;
  font-size: 0.95rem;
  color: #495057;
  margin-bottom: 12px;
}

/* Filtros de Categoría (Pills) */
.filter-group {
  flex: 1;
  min-width: 300px;
}

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
  border-color: #adb5bd;
  background: #f8f9fa;
}

.category-pill.active {
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.clear-filters-btn {
  padding: 8px 16px;
  border: none;
  background: none;
  color: #dc3545;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.2s;
}
.clear-filters-btn:hover {
  color: #bd2130;
  text-decoration: underline;
}

/* Ordenar (Segmented Control) */
.sort-group {
  min-width: 250px;
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

/* --- Grid de Blogs --- */
.blog-grid-section {
  padding: 0 20px 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

/* --- Tarjeta de Blog Moderna --- */
.blog-card-modern {
  background: rgba(255, 255, 255, 0.95); /* Fondo semi-transparente */
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: 100%;
  backdrop-filter: blur(5px);
}

.blog-card-modern:hover {
  transform: translateY(-7px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.blog-card-image-wrapper {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.blog-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.blog-card-modern:hover .blog-card-image {
  transform: scale(1.05);
}

.blog-card-category {
  position: absolute;
  top: 15px;
  left: 15px;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.share-btn-floating {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;
  font-size: 1rem;
}

.share-btn-floating:hover {
  background: white;
  color: #0d6efd;
  transform: scale(1.1);
}

.blog-card-content {
  padding: 25px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.blog-card-meta {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 12px;
}

.blog-card-title {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 15px;
}

.blog-card-title a {
  color: #212529;
  text-decoration: none;
  transition: color 0.2s;
}

.blog-card-title a:hover {
  color: #0d6efd;
}

.blog-card-excerpt {
  font-size: 0.95rem;
  color: #495057;
  line-height: 1.6;
  margin-bottom: 25px;
  flex-grow: 1;
}

.blog-card-footer {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.blog-author-info {
  display: flex;
  align-items: center;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
  border: 2px solid #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.author-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
}

.read-more-btn {
  background: none;
  border: none;
  color: #0d6efd;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  padding: 0;
}

.read-more-btn:hover {
  color: #0a58ca;
  transform: translateX(5px);
}

/* --- Estado Vacío --- */
.empty-state-container {
  background: rgba(255, 255, 255, 0.8);
  padding: 40px;
  border-radius: 16px;
  display: inline-block;
  color: #6c757d;
}

/* --- Paginación Moderna --- */
.pagination-modern {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 60px;
}

.pagination-arrow,
.pagination-page-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  color: #495057;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.pagination-arrow:hover:not(:disabled),
.pagination-page-btn:hover {
  background: white;
  color: #212529;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.pagination-page-btn.active {
  background: #0d6efd;
  color: white;
  box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
}

.pagination-arrow:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.5);
}

.pagination-pages {
  display: flex;
  gap: 8px;
}

/* --- Toast Notification --- */
.toast-notification {
  position: fixed;
  top: 5rem;
  right: 30px;
  background: white;
  color: #212529;
  padding: 15px 25px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  z-index: 1050;
  font-weight: 600;
  border-left: 5px solid #198754;
}

.toast-notification i {
  color: #198754;
  font-size: 1.2rem;
}

.toast-close {
  background: none;
  border: none;
  color: #adb5bd;
  font-size: 1.1rem;
  margin-left: 20px;
  cursor: pointer;
  transition: color 0.2s;
}
.toast-close:hover {
  color: #495057;
}

/* --- Animaciones y Utilidades --- */
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
.delay-3 {
  animation-delay: 0.6s;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .blogs-header {
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
  .blog-grid {
    grid-template-columns: 1fr;
  }
  .blog-card-image-wrapper {
    height: 200px;
  }
  .blog-card-content {
    padding: 20px;
  }
  .blog-card-title {
    font-size: 1.25rem;
  }
}
</style>
