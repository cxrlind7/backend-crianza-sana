<template>
  <!-- Aplicamos las nuevas variables CSS de color -->
  <div class="course-sales-container" :style="themeColors" v-if="course">
    <!-- BOTÓN DE REGRESAR (Estilo PersonProfile) -->
    <div class="container mt-5 fade-in">
      <router-link to="/store" class="btn-back text-decoration-none">
        <i class="fas fa-arrow-left"></i>
        <span class="ms-2 d-none d-sm-inline">Regresar a la Tienda</span>
      </router-link>
    </div>

    <!-- ESTADO 1: PÁGINA DE VENTAS (Si no ha comprado) -->
    <main v-if="!hasPurchased" class="sales-content container pb-5">
      <!-- Componente Hero: Intro y Presentador -->
      <CourseHero :course="course" />

      <div class="row mt-5 gx-lg-5">
        <!-- Columna Izquierda: Descripción y Temario -->
        <div class="col-lg-7 mb-5 mb-lg-0">
          <section class="course-description mb-5">
            <h2 class="section-title mb-4">¿Qué lograrás con este curso?</h2>
            <p class="lead text-body">{{ course.description }}</p>
          </section>

          <section class="course-preview">
            <h3 class="section-title mb-4">Estructura del Programa</h3>
            <div class="preview-list">
              <div
                v-for="(item, index) in course.content"
                :key="index"
                class="preview-item d-flex align-items-center mb-3 p-3"
              >
                <!-- Iconos cambiados a color cyan -->
                <i
                  :class="[
                    'me-3 fs-4',
                    item.type === 'video'
                      ? 'bi bi-play-circle-fill text-cyan'
                      : 'bi bi-file-earmark-text-fill text-info',
                  ]"
                ></i>
                <div>
                  <h5 class="m-0 text-dark">{{ item.title }}</h5>
                  <small class="text-muted" v-if="item.duration">{{ item.duration }}</small>
                  <small class="text-muted" v-else>{{ item.format }}</small>
                </div>
                <i class="bi bi-lock-fill ms-auto text-muted fs-5" title="Contenido bloqueado"></i>
              </div>
            </div>
          </section>
        </div>

        <!-- Columna Derecha: Tarjeta de Precio (Sticky en desktop) -->
        <div class="col-lg-5">
          <div class="sticky-lg-top" style="top: 2rem; z-index: 10">
            <CoursePricing
              id="pricing-section"
              :course="course"
              @trigger-purchase="simulatePurchase"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- ESTADO 2: PANEL DE CONTENIDO (Si ya compró) -->
    <main v-else class="content-dashboard container pb-5">
      <!-- Header simple del dashboard -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold m-0 text-dark">Panel de Alumno</h2>
        <span class="badge bg-cyan text-white">Acceso Total</span>
      </div>
      <CourseContent :course="course" />
    </main>

    <!-- Footer simple -->
    <!-- <AppFooter /> -->
  </div>
  <div v-else class="container mt-5 text-center">
    <h3>Curso no encontrado</h3>
    <router-link to="/store" class="btn btn-primary mt-3">Volver a la tienda</router-link>
  </div>
</template>

<script>
import { courses } from '../data/courseData'
import CourseHero from '../components/CourseHero.vue'
import CoursePricing from '../components/CoursePricing.vue'
import CourseContent from '../components/CourseContent.vue'
// import AppFooter from '../components/Footer.vue'
import { useRoute } from 'vue-router'

export default {
  name: 'StoreDetailView',
  components: {
    CourseHero,
    CoursePricing,
    CourseContent,
    // AppFooter,
  },
  data() {
    return {
      course: null,
      hasPurchased: false,
      isLoadingPayment: false,
    }
  },
  created() {
    const route = useRoute()
    const courseId = route.params.id
    this.course = courses.find((c) => c.id === courseId)
  },
  computed: {
    themeColors() {
      // NUEVA PALETA DE COLORES (Psicología / Azul y Cian) - VERSIÓN LIGHT
      return {
        // Fondo principal: Gradiente claro similar a PersonProfile
        '--bg-primary': '#f8f9fa',
        '--bg-secondary': '#ffffff',
        // Color de acento: Cian/Turquesa (basado en la imagen de Luis)
        '--accent-cyan': '#06B6D4',
        '--text-light': '#333333', // Texto oscuro para fondo claro
        '--text-muted': '#6c757d',
      }
    },
  },
  methods: {
    simulatePurchase() {
      this.isLoadingPayment = true
      setTimeout(() => {
        alert('¡Bienvenido! Tu inscripción al curso de Luis ha sido exitosa.')
        this.hasPurchased = true
        this.isLoadingPayment = false
        window.scrollTo(0, 0)
      }, 1500)
    },
  },
}
</script>

<style scoped>
/* Asegúrate de importar Bootstrap Icons en tu proyecto principal */
/* @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"); */

.course-sales-container {
  font-family: 'Montserrat', sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* Fondo claro armonizado con PersonProfile */
  background-image: radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
    radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%);
  background-size: 100% 100%;
  color: var(--text-light);
}

/* Clase utilitaria para el nuevo color de acento */
.text-cyan {
  color: var(--accent-cyan) !important;
}
.text-body {
  color: #333;
}

/* Estilos del botón Regresar (Igual a PersonProfile) */
.btn-back {
  display: inline-flex;
  align-items: center;
  margin-top: 2rem;
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
}

.btn-back:hover {
  background-color: #ffffff;
  color: #000;
  transform: translateX(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-weight: 700;
  position: relative;
  padding-bottom: 1rem;
  color: #2c3e50; /* Color oscuro para títulos */
}
.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: var(--accent-cyan);
}

.preview-item {
  background-color: rgba(255, 255, 255, 0.6); /* Fondo blanco semitransparente */
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
}
.preview-item:hover {
  background-color: #ffffff;
  border-color: var(--accent-cyan);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }
}
</style>
