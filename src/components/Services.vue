<template lang="html">
  <section class="services-section">
    <h2 class="section-title">Nuestros Servicios Integrales</h2>
    <p class="section-subtitle">
      Un equipo multidisciplinario enfocado en la generación de las crianzas responsables.
    </p>

    <!-- Contenedor relativo para posicionar las flechas -->
    <div class="swiper-container-wrapper">
      <swiper
        :slidesPerView="1.15"
        :spaceBetween="20"
        :centeredSlides="true"
        :pagination="{
          clickable: true,
          dynamicBullets: true,
        }"
        :navigation="{
          nextEl: '.custom-next-arrow',
          prevEl: '.custom-prev-arrow',
        }"
        :breakpoints="{
          '640': {
            slidesPerView: 2,
            spaceBetween: 20,
            centeredSlides: false,
          },
          '968': {
            slidesPerView: 3,
            spaceBetween: 30,
            centeredSlides: false,
          },
          '1200': {
            slidesPerView: 4,
            spaceBetween: 30,
            centeredSlides: false,
          },
        }"
        :modules="modules"
        class="services-swiper"
      >
        <swiper-slide v-for="(servicio, index) in servicios" :key="index">
          <router-link :to="`/person/${servicio.personId}`" class="service-card">
            <div class="image-wrapper">
              <img :src="servicio.image" :alt="servicio.title" class="rounded-image" />
            </div>

            <div class="info-container">
              <h4 class="title">{{ servicio.title }}</h4>
              <p class="description">{{ servicio.description }}</p>
            </div>

            <div class="card-cta">
              <a
                :href="getWhatsAppLink(servicio.title)"
                target="_blank"
                class="whatsapp-btn"
                @click.stop
              >
                <i class="fab fa-whatsapp"></i>
                <span>Contactar</span>
              </a>

              <div class="view-profile-link">
                <span>Ver especialista</span>
                <i class="fas fa-arrow-right"></i>
              </div>
            </div>
          </router-link>
        </swiper-slide>

        <!-- --- NUEVAS FLECHAS PERSONALIZADAS --- -->
        <!-- Se colocan DENTRO del componente swiper pero FUERA de los slides -->
        <div class="custom-prev-arrow">
          <i class="fas fa-chevron-left"></i>
        </div>
        <div class="custom-next-arrow">
          <i class="fas fa-chevron-right"></i>
        </div>
      </swiper>
    </div>
  </section>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
// Nota: Ya no necesitamos importar 'swiper/css/navigation' porque usaremos nuestros propios estilos
import { Pagination, Navigation } from 'swiper/modules'

export default {
  name: 'ServicesGrid',
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      modules: [Pagination, Navigation],
    }
  },
  data() {
    return {
      clinicPhoneNumber: '5215512345678',
      servicios: [
        {
          personId: 9,
          title: 'Terapia de lenguaje',
          description: 'Terapia de lenguaje para retrasos, trastornos del habla y comunicación.',
          image: '../../trlenguaje.jpg',
        },
        {
          personId: 3,
          title: 'Nutrición',
          description:
            'Facilitar cambios de hábitos con soluciones personalizadas para un peso saludable y control de enfermedades.',
          image: '../../Nutricion1.png',
        },
        {
          personId: 2,
          title: 'Terapia cognitivo-conductual',
          description:
            'Brindar atención cognitiva, personal, social y emocional a los niños y niñas en la primera etapa de su infancia.',
          image: '../../CarinaInfo.png',
        },
        {
          personId: 6,
          title: 'Psicología',
          description:
            'Psicoterapia para niños y adolescentes con el objetivo de potencializar su desarrollo. Asesoría en crianza para padres.',
          image: '../../ServicioPsicologia.jpg',
        },
        {
          personId: 4,
          title: 'Odontopediatría',
          description:
            'Orientada a la prevención, curación y mantenimiento de la salud oral de bebés, niños y adolescentes.',
          image: '../../Odontopediatria1.png',
        },
        {
          personId: 5,
          title: 'Pediatría y Cardiología',
          description: 'Control de niño sano y enfermo, lactancia, vacunas, cardiopatías.',
          image: '../../CardiologiaPediatra.png',
        },
        {
          personId: 1,
          title: 'Fisioterapia',
          description:
            'Comprometidos con el bienestar de nuestros pacientes, brindando atención segura y de calidad para mejorar su salud.',
          image: '../../Fisioterapia1.jpeg',
        },
        {
          personId: 8,
          title: 'Derecho',
          description:
            'Servicios jurídicos y asesoría especializada con compromiso ético, responsable y justo, garantizando confianza.',
          image: '../../Derecho1.jpeg',
        },
      ],
    }
  },
  methods: {
    getWhatsAppLink(serviceTitle) {
      const message = `Hola, me gustaría solicitar información sobre el servicio de ${serviceTitle}.`
      const encodedMessage = encodeURIComponent(message)
      return `https://wa.me/${this.clinicPhoneNumber}?text=${encodedMessage}`
    },
  },
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.services-section {
  padding: 40px 0;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.section-title {
  text-align: center;
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 10px;
  padding: 0 20px;
}

.section-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
}

/* Wrapper para posicionamiento relativo */
.swiper-container-wrapper {
  position: relative;
  width: 100%;
  padding: 0 20px; /* Un poco de padding lateral para que las flechas no se salgan de la pantalla en móvil */
}

/* --- Estilos del Swiper --- */
.services-swiper {
  width: 100%;
  padding-bottom: 35px; /* Espacio para los puntitos */
  padding-top: 20px;
  position: static; /* Importante para que las flechas absolutas se posicionen respecto al wrapper */
}

.swiper-slide {
  height: auto;
  display: flex;
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #d63384;
}

/* --- ESTILOS DE LAS FLECHAS PERSONALIZADAS --- */
.custom-prev-arrow,
.custom-next-arrow {
  position: absolute;
  top: 50%; /* Centradas verticalmente */
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background-color: #ffffff;
  color: #d63384; /* Color rosa del icono */
  border-radius: 50%; /* Círculo perfecto */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Sombra suave */
  cursor: pointer;
  z-index: 10; /* Por encima de las cards */
  transition: all 0.3s ease;
  font-size: 1rem;
}

.custom-prev-arrow {
  left: 0px; /* Pegada a la izquierda */
}

.custom-next-arrow {
  right: 0px; /* Pegada a la derecha */
}

/* Hover effect */
.custom-prev-arrow:hover,
.custom-next-arrow:hover {
  background-color: #d63384;
  color: #ffffff;
  box-shadow: 0 6px 15px rgba(214, 51, 132, 0.3);
}

/* Estado deshabilitado (cuando llegas al final o principio) */
.custom-prev-arrow.swiper-button-disabled,
.custom-next-arrow.swiper-button-disabled {
  opacity: 0.5;
  cursor: default;
  pointer-events: none; /* Evita clicks */
  box-shadow: none;
}

/* Ajustes para móvil */
@media (max-width: 640px) {
  .swiper-container-wrapper {
    padding: 0 10px; /* Menos padding en móvil */
  }

  .custom-prev-arrow,
  .custom-next-arrow {
    width: 35px; /* Un poco más pequeñas en móvil */
    height: 35px;
    font-size: 0.9rem;
  }

  .custom-prev-arrow {
    left: -5px;
  }
  .custom-next-arrow {
    right: -5px;
  }
}

/* --- Tarjetas (Links) --- */
.service-card {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  text-decoration: none;
  color: inherit;
  width: 100%;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

/* Efecto hover solo en desktop */
@media (min-width: 769px) {
  .services-section {
    padding: 40px 20px;
  }

  .service-card:hover {
    transform: translateY(-7px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
    border-color: rgba(0, 0, 0, 0);
  }

  .service-card:hover .rounded-image {
    transform: scale(1.05);
  }

  /* Show CTA on hover in desktop */
  .service-card:hover .card-cta {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Imagen */
.image-wrapper {
  padding: 25px 20px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.rounded-image {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

/* Información */
.info-container {
  padding: 15px 25px;
  text-align: center;
  flex-grow: 1;
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #2c3e50;
}

.description {
  font-size: 0.95rem;
  font-weight: 400;
  line-height: 1.5;
  color: #64748b;
}

/* --- Call to Action --- */
.card-cta {
  padding: 15px 20px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border-top: 1px solid #f0f0f0;
  background-color: #fafafa;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

/* Botón de WhatsApp */
.whatsapp-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #25d366;
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;
  box-shadow: 0 2px 5px rgba(37, 211, 102, 0.2);
}

.whatsapp-btn:hover {
  background-color: #128c7e;
  transform: translateY(-2px);
}

.whatsapp-btn i {
  font-size: 1.1rem;
}

/* Enlace de Ver Especialista */
.view-profile-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.view-profile-link:hover,
.service-card:hover .view-profile-link {
  color: #d63384;
}

.view-profile-link i {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.view-profile-link:hover i,
.service-card:hover .view-profile-link i {
  transform: translateX(4px);
}

/* Responsive adjustments (Móvil) */
@media (max-width: 768px) {
  .service-card {
    box-shadow: none;
    border: 1px solid #e5e7eb;
  }

  .card-cta {
    opacity: 1;
    transform: translateY(0);
    padding-top: 15px;
    padding-bottom: 20px;
  }
}
</style>
