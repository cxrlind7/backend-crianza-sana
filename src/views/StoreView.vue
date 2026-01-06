<template>
  <div class="store-page-container">
    <!-- Botón de Regresar -->
    <div class="container mb-0 fade-in">
      <button @click="goBack" class="btn-back">
        <font-awesome-icon icon="fa-solid fa-arrow-left" />
        <span class="ms-2 d-none d-sm-inline">Regresar</span>
      </button>
    </div>

    <div class="content-wrapper">
      <!-- Cabecera -->
      <header class="store-header text-center fade-in delay-1">
        <h3
          class="text-uppercase letter-spacing-2 text-dark mb-4 mt-0"
          style="font-size: 1.5rem; opacity: 0.8"
        >
          Tienda de Cursos
        </h3>
      </header>

      <!-- Lista de Cursos (Grid) -->
      <transition-group name="list" tag="div" class="course-grid fade-in delay-2">
        <div
          v-for="(course, index) in courses"
          :key="course.id || index"
          class="course-card-clean"
          @click="goToCourse(course.id)"
        >
          <!-- Thumbnail con Overlay -->
          <div class="thumbnail-wrapper">
            <!-- Usamos la imagen del presentador como thumbnail por ahora si no hay imagen de curso -->
            <img :src="course.presenter.image" :alt="course.title" class="course-thumbnail-img" />
            <div class="view-overlay">
              <div class="view-circle">
                <font-awesome-icon icon="fa-solid fa-eye" class="view-icon-svg" />
              </div>
            </div>
          </div>

          <!-- Información del Curso -->
          <div class="card-info">
            <h3 class="card-title" :title="course.title">{{ course.title }}</h3>

            <p class="card-presenter">
              <font-awesome-icon icon="fa-solid fa-user-tie" class="me-1" />
              {{ course.presenter.name }}
            </p>

            <div class="card-meta">
              <span class="meta-price">
                {{ formatPrice(course.price.discounted) }} {{ course.price.currency }}
              </span>
              <span class="meta-original-price text-muted text-decoration-line-through ms-2">
                {{ formatPrice(course.price.original) }}
              </span>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Mensaje si no hay resultados -->
      <div v-if="courses.length === 0" class="no-results-container fade-in delay-2">
        <div class="empty-state-box">
          <font-awesome-icon icon="fa-solid fa-search" class="mb-3 fa-3x" style="opacity: 0.5" />
          <h3>No se encontraron cursos disponibles.</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { courses as coursesData } from '../data/courseData'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft, faUserTie, faEye, faSearch } from '@fortawesome/free-solid-svg-icons'

library.add(faArrowLeft, faUserTie, faEye, faSearch)

const router = useRouter()
const courses = ref([])

onMounted(() => {
  courses.value = coursesData
})

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    router.push('/')
  }
}

const goToCourse = (id) => {
  router.push({ name: 'store-detail', params: { id } })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price)
}
</script>

<style scoped>
.store-page-container {
  padding-top: 60px;
  min-height: 100vh;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #343a40;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background-color: #f8f9fa; */
}

.content-wrapper {
  max-width: 1200px;
  width: 100%;
  padding: 20px;
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
  align-self: flex-start;
  margin-left: 10%;
}
.btn-back:hover {
  background-color: #ffffff;
  color: #000;
  transform: translateX(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.store-header {
  padding: 10px 20px 20px;
  margin-top: 0;
}
.letter-spacing-2 {
  letter-spacing: 2px;
  font-weight: 600;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  padding-bottom: 50px;
}

.course-card-clean {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.course-card-clean:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}

.thumbnail-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  background-color: #f0f0f0;
  overflow: hidden;
}

.course-thumbnail-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.course-card-clean:hover .course-thumbnail-img {
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
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.course-card-clean:hover .view-overlay {
  opacity: 1;
}

.view-circle {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0.8);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.course-card-clean:hover .view-circle {
  transform: scale(1);
}

.view-icon-svg {
  font-size: 1.5rem;
  color: #333;
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
  margin-bottom: 10px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #212529;
}

.card-presenter {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.card-meta {
  margin-top: auto;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.meta-price {
  font-weight: 700;
  color: #0d6efd;
  font-size: 1.1rem;
}

.no-results-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.empty-state-box {
  text-align: center;
  color: #6c757d;
}

/* Animations */
.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
  opacity: 0;
}

.delay-1 {
  animation-delay: 0.1s;
}

.delay-2 {
  animation-delay: 0.2s;
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
</style>
