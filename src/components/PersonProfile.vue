<template>
  <div class="profile-page-wrapper pt-5 pt-md-6">
    <!-- Botón de Regresar -->
    <div class="container mb-4 mt-5 fade-in">
      <button @click="goBack" class="btn-back">
        <i class="fas fa-arrow-left"></i>
        <span class="ms-2 d-none d-sm-inline">Regresar</span>
      </button>
    </div>

    <div v-if="person" class="container pb-5 main-container">
      <!-- Main Profile Header Card -->
      <div class="card profile-header-card shadow-lg border-0 mb-5 fade-in delay-1">
        <div class="card-body p-0">
          <div class="row g-0 h-100">
            <!-- Left Column: Image Section -->
            <div
              class="col-lg-5 image-column d-flex align-items-center justify-content-center p-5"
              :style="{ backgroundColor: person.color + '0D' }"
            >
              <div class="text-center">
                <img
                  :src="person.image"
                  :style="{ borderColor: person.color }"
                  alt="Foto de perfil"
                  class="img-fluid rounded-circle profile-image shadow"
                />
              </div>
            </div>

            <!-- Right Column: Info Section -->
            <div class="col-lg-7 p-4 p-md-5 d-flex flex-column justify-content-center">
              <h6 class="text-uppercase letter-spacing-2 mb-3" :style="{ color: person.color }">
                {{ person.title }}
              </h6>
              <h1 class="display-5 fw-bold text-dark mb-4">{{ person.name }}</h1>

              <div class="bio-text lead text-muted mb-4" v-html="person.detalle"></div>

              <!-- --- NUEVA SECCIÓN DE BOTONES SOCIALES CON TEXTO --- -->
              <ul class="list-inline social-list mb-0 mt-auto">
                <!-- Redes Sociales -->
                <li v-for="(social, index) in person.socials" :key="index" class="list-inline-item">
                  <a
                    :href="social.link"
                    target="_blank"
                    class="social-btn-link"
                    :style="{ '--hover-color': person.color, color: person.color }"
                  >
                    <!-- Icono -->
                    <i :class="social.iconClass + ' fa-lg'"></i>
                    <!-- Texto (Nombre de la red detectado automáticamente) -->
                    <span class="social-text">{{ getSocialName(social.iconClass) }}</span>
                  </a>
                </li>

                <!-- Ubicación / Mapa -->
                <li class="list-inline-item">
                  <a
                    :href="person.direccion.link"
                    target="_blank"
                    class="social-btn-link map-link"
                    :style="{ '--hover-color': person.color }"
                  >
                    <img src="../../public/icons8-map-64.png" alt="Mapa" class="map-icon" />
                    <!-- Texto fijo para el mapa -->
                    <span class="social-text">Ubicación</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Sub Components Sections -->
      <div class="content-section mb-2 fade-in delay-2">
        <MisionProfile :mision="person.mision" :vision="person.vision" />
      </div>
      <div class="content-section mb-2 fade-in delay-3">
        <ServicesProfile
          :servicios="person.servicios"
          :mision="person.mision"
          :personColor="person.color"
        />
      </div>
      <div class="content-section mb-2 fade-in delay-3">
        <PersonFAQs :preguntas="person.preguntasFrecuentes" :personColor="person.color" />
      </div>
      <div class="content-section mb-2 fade-in delay-3">
        <PersonDownloads :files="person.files" :personColor="person.color" />
      </div>
      <div class="content-section mb-2 fade-in delay-3">
        <PersonReels
          :personId="person.id"
          :profileUrl="person.socials[0].link"
          :instagramProfileData="person.instagramProfileData"
        />
      </div>
      <div class="content-section mb-2 fade-in delay-3">
        <PersonBlogs :personName="person.name" :personColor="person.color" />
      </div>
    </div>
    <div v-else class="container py-5 text-center">
      <p class="text-muted">Persona no encontrada.</p>
    </div>
  </div>
  <!-- <Footer /> -->
</template>

<script>
import people from '../../data'
import ServicesProfile from './ServicesProfile.vue'
import MisionProfile from './MisionProfile.vue'
import PersonBlogs from './PersonBlogs.vue'
import PersonReels from './PersonReels.vue'
import PersonFAQs from './PersonFAQs.vue'
import PersonDownloads from './PersonDownloads.vue'
import Footer from './Footer.vue'

export default {
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  components: {
    ServicesProfile,
    MisionProfile,
    PersonBlogs,
    PersonReels,
    PersonFAQs,
    PersonDownloads,
    Footer,
  },
  data() {
    return {
      people,
      showDownloads: false,
      mockInstagramData: {
        url: 'https://www.instagram.com/cambiandohabitos.nutricion/',
        username: 'cambiandohabitos.nutricion',
        // Usa una imagen real que tengas, esta es de ejemplo
        profileImage:
          'https://res.cloudinary.com/duiqgfa0v/image/upload/v1761837867/samples/zoom.avif',
        stats: {
          posts: 731,
          followers: 1965,
          following: 489,
        },
        fullName: 'Cambiando Habitos Nutrición',
        // Nota los \n para los saltos de línea
        bio: 'Medicina y salud\nSomos tu equipo de nutriologas y te ayudamos a cambiar tus hábitos 🤩\n🍓 Control de peso\n🍉 ... más',
      },
    }
  },
  computed: {
    person() {
      return this.people.find((p) => p.id === Number(this.id))
    },
  },
  methods: {
    goBack() {
      if (this.$router) {
        this.$router.back()
      } else {
        window.history.back()
      }
    },
    // NUEVO MÉTODO: Detecta el nombre de la red social basado en la clase del icono
    getSocialName(iconClass) {
      if (!iconClass) return 'Ver perfil'
      const lowerClass = iconClass.toLowerCase()
      if (lowerClass.includes('instagram')) return 'Instagram'
      if (lowerClass.includes('facebook')) return 'Facebook'
      if (lowerClass.includes('twitter') || lowerClass.includes('x-twitter')) return 'X (Twitter)'
      if (lowerClass.includes('linkedin')) return 'LinkedIn'
      if (lowerClass.includes('tiktok')) return 'TikTok'
      if (lowerClass.includes('youtube')) return 'YouTube'
      if (lowerClass.includes('whatsapp')) return 'WhatsApp'
      if (lowerClass.includes('web') || lowerClass.includes('globe')) return 'Sitio web'
      return 'Ver perfil' // Texto por defecto si no reconoce el icono
    },
  },
  mounted() {
    if (typeof window.gtag === 'function') {
      const path = `/person/${this.id}`
      const title = this.person?.name || `Perfil de persona ${this.id}`
      window.gtag('event', 'page_view', { page_path: path, page_title: title })
      window.gtag('event', 'view_person_profile', {
        person_id: this.id,
        person_name: this.person?.name || 'Desconocido',
      })
    }
  },
}
</script>

<style scoped>
/* Page Background */
.profile-page-wrapper {
  background-image: radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
    radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%);
  background-size: 100% 100%;
  min-height: 100vh;
}

.main-container {
  max-width: 1140px;
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
}

.btn-back:hover {
  background-color: #ffffff;
  color: #000;
  transform: translateX(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.btn-back i {
  font-size: 1rem;
}

/* Main Card Styling */
.profile-header-card {
  border-radius: 16px;
  overflow: hidden;
  background: #ffffff;
  box-shadow:
    0 15px 35px rgba(50, 50, 93, 0.03),
    0 5px 15px rgba(0, 0, 0, 0.03) !important;
}

/* Image Section */
.image-column {
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.profile-image {
  width: 240px;
  height: 240px;
  object-fit: cover;
  border-width: 4px;
  border-style: solid;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4) !important;
  transition: transform 0.3s ease;
}

.profile-image:hover {
  transform: scale(1.02);
}

/* Typography & Content */
.letter-spacing-2 {
  letter-spacing: 2px;
  font-weight: 600;
  font-size: 0.9rem;
}

.bio-text {
  font-weight: 300;
  line-height: 1.7;
  font-size: 1.15rem;
}

/* --- NUEVOS ESTILOS PARA BOTONES SOCIALES CON TEXTO --- */
.social-list {
  margin-left: -5px; /* Ajuste ligero */
  display: flex;
  flex-wrap: wrap;
  gap: 12px; /* Espacio entre los botones */
}

/* Clase renombrada de .social-icon-link a .social-btn-link */
.social-btn-link {
  display: inline-flex;
  align-items: center;
  /* Padding para forma de botón alargado */
  padding: 10px 20px;
  /* Bordes completamente redondeados (forma de pastilla) */
  border-radius: 30px;
  background-color: #ffffff;
  margin: 0;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-decoration: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  cursor: pointer;
  /* Color del texto por defecto (se sobrescribe con el inline style para el icono) */
  color: #555;
  font-weight: 600;
  font-size: 0.95rem;
}

/* Espacio entre el icono y el texto */
.social-text {
  margin-left: 10px;
  color: #555; /* Color base del texto */
  transition: color 0.3s ease;
}

/* Ajuste de tamaño de iconos */
.social-btn-link i {
  font-size: 1.3rem;
}

.map-icon {
  width: 26px;
  height: 26px;
  transition: all 0.3s ease;
}

/* --- Efecto Hover --- */
.social-btn-link:hover {
  /* Fondo del color de la persona */
  background-color: var(--hover-color);
  /* Icono blanco */
  color: #ffffff !important;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-color: var(--hover-color);
}

/* El texto también se vuelve blanco en hover */
.social-btn-link:hover .social-text {
  color: #ffffff;
}

/* El icono del mapa se vuelve blanco en hover */
.map-link:hover .map-icon {
  filter: brightness(0) invert(1);
}

/* Responsive adjustments */
@media (max-width: 991px) {
  .image-column {
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding-bottom: 2rem !important;
  }

  .profile-image {
    width: 200px;
    height: 200px;
  }

  .social-list {
    justify-content: center;
    margin-top: 2rem !important;
    margin-left: 0;
  }
}

/* Simple Fade In Animation */
.fade-in {
  opacity: 0;
  animation: fadeInAnimation 0.8s ease-out forwards;
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

@keyframes fadeInAnimation {
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
