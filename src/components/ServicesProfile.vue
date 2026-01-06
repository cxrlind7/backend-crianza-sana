<template>
  <div class="services-section-wrapper">
    <div class="container-fluid main-container">
      <!-- Título de la sección -->
      <div class="text-center mb-5 fade-in">
        <h6 class="text-uppercase letter-spacing-2 text-muted mb-2">Lo que ofrecemos</h6>
        <h2 class="display-6 fw-bold text-dark">Nuestros Servicios</h2>
      </div>

      <!-- Carrusel de Servicios con Swiper -->
      <!-- Añadimos 'position-relative' aquí para que las flechas absolutas se posicionen respecto a este contenedor -->
      <div class="carousel-container position-relative fade-in delay-1">
        <swiper
          :modules="modules"
          :slides-per-view="slidesPerView"
          :space-between="30"
          :autoplay="{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }"
          :pagination="{ clickable: true, dynamicBullets: true }"
          :navigation="{
            nextEl: '.custom-next',
            prevEl: '.custom-prev',
          }"
          :breakpoints="swiperBreakpoints"
          :loop="servicios.length > slidesPerView"
          class="services-swiper"
        >
          <swiper-slide v-for="(service, index) in servicios" :key="index" class="h-auto">
            <!-- La tarjeta debe tener altura 100% para normalizar tamaños -->
            <div class="service-card h-100">
              <div class="card-content">
                <!-- Contenedor del icono -->
                <div class="icon-wrapper mb-4" :style="{ borderColor: personColor }">
                  <!-- Usamos un div con background-image para mejor control del escalado y centrado -->
                  <div
                    class="service-icon-img"
                    :style="{ backgroundImage: `url(${service.image})` }"
                    role="img"
                    aria-label="Icono del servicio"
                  ></div>
                </div>
                <!-- Título -->
                <h4 class="service-title mb-3">{{ service.titulo }}</h4>
                <!-- Descripción -->
                <p class="service-description text-muted mb-0">{{ service.descripcion }}</p>
              </div>
            </div>
          </swiper-slide>

          <!-- Paginación (puntitos) -->
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
import { Swiper, SwiperSlide } from 'swiper/vue'
// IMPORTANTE: Importar el módulo Navigation
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'
// No necesitamos importar swiper/css/navigation porque usaremos estilos propios

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    servicios: {
      type: Array,
      required: true,
    },
    // NUEVA PROP: Necesitamos el color de la persona para estilar las flechas
    personColor: {
      type: String,
      required: true,
      default: '#333', // Color por defecto por si acaso
    },
  },
  data() {
    return {
      // Añadir Navigation a los módulos
      modules: [Autoplay, Pagination, Navigation],
      slidesPerView: 1.1,
      swiperBreakpoints: {
        576: { slidesPerView: 1.5, spaceBetween: 20 },
        768: { slidesPerView: 2.2, spaceBetween: 30 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
        1400: { slidesPerView: 4, spaceBetween: 30 },
      },
    }
  },
}
</script>

<style scoped>
/* Wrapper principal */
.services-section-wrapper {
  padding: 80px 0;
}

.main-container {
  max-width: 1400px;
  padding-left: 5%;
  padding-right: 5%;
}

/* Tipografía */
.letter-spacing-2 {
  letter-spacing: 2px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Estilos del Swiper */
.carousel-container {
  padding-bottom: 50px;
  /* position: relative;  <-- Ya añadido en el template con clase de bootstrap */
}

.services-swiper {
  padding: 20px 10px;
  margin: -20px -10px;
}

.swiper-slide {
  height: auto;
  display: flex;
}

/* --- ESTILOS DE LAS FLECHAS PERSONALIZADAS --- */
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
  border: 2px solid transparent; /* Prepara el borde para el hover */
}

.custom-prev {
  left: -25px; /* Las sacamos un poco del contenedor */
}

.custom-next {
  right: -25px;
}

/* Efecto Hover Dinámico */
.custom-arrow:hover {
  /* El fondo toma el color de la persona */
  background-color: var(--arrow-color);
  color: #ffffff; /* Icono blanco */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-50%) scale(1.1); /* Crece un poco */
}

/* Estado deshabilitado (inicio/fin del carrusel) */
.custom-arrow.swiper-button-disabled {
  opacity: 0.4;
  cursor: default;
  pointer-events: none;
  box-shadow: none;
}

/* Ocultar flechas en móviles pequeños si molestan */
@media (max-width: 768px) {
  .custom-arrow {
    display: none;
  }
  .main-container {
    padding-left: 15px; /* Reducir padding en móvil */
    padding-right: 15px;
  }
  .custom-prev {
    left: 0;
  }
  .custom-next {
    right: 0;
  }
}

/* Estilo de la Tarjeta (Mantenemos la elegancia anterior) */
.service-card {
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  border: 1px solid rgba(0, 0, 0, 0.04);
  width: 100%;
  display: flex;
  flex-direction: column;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border-color: transparent;
}

.card-content {
  padding: 40px 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

/* Estilo del Icono */
.icon-wrapper {
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f0f2f5;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.03);
  transition: all 0.4s ease;
  overflow: hidden; /* Para recortar la imagen */
  border: 4px solid transparent; /* Se sobreescribe con el estilo inline */
}

.service-card:hover .icon-wrapper {
  background-color: #ffffff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: scale(1.08);
}

.service-icon-img {
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover; /* Para que cubra todo el círculo */
}

/* Tipografía de la tarjeta */
.service-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #2c3e50;
  margin-top: 1rem;
}

.service-description {
  font-size: 1rem;
  line-height: 1.7;
  font-weight: 300;
  color: #6c757d;
}

/* Personalización de los puntos de paginación de Swiper */
:deep(.swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  background: #ccc;
  opacity: 0.6;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  /* Usamos también el color de la persona para los puntos activos */
  background: var(--arrow-color) !important; /* Forzamos con !important por si acaso */
  width: 25px;
  border-radius: 5px;
  opacity: 1;
}

/* Animación de entrada */
.fade-in {
  opacity: 0;
  animation: fadeInAnimation 0.8s ease-out forwards;
}
.delay-1 {
  animation-delay: 0.3s;
}

@keyframes fadeInAnimation {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividad Específica */
@media (max-width: 768px) {
  .services-section-wrapper {
    padding: 50px 0;
  }
  .card-content {
    padding: 30px 20px;
  }
  .icon-wrapper {
    width: 90px;
    height: 90px;
  }
  .service-title {
    font-size: 1.2rem;
  }
}
</style>
