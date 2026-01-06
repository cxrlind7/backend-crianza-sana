<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="show" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content elegant-christmas">
          <div class="modal-header-accent"></div>
          <button class="close-button" @click="closeModal" aria-label="Cerrar">
            <span class="close-icon">✕</span>
          </button>
          <div class="carousel-container">
            <button class="nav-button prev" @click="prevSlide" aria-label="Anterior">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div class="slide-content">
              <div class="image-wrapper">
                <transition name="slide-fade" mode="out-in">
                  <img
                    :key="currentSlide.image"
                    :src="currentSlide.image"
                    :alt="currentSlide.message"
                    class="campaign-image"
                  />
                </transition>
              </div>
              <div class="message-container">
                <p class="christmas-message">{{ currentSlide.message }}</p>
              </div>
            </div>
            <button class="nav-button next" @click="nextSlide" aria-label="Siguiente">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          <div class="dots-container">
            <button
              v-for="(slide, index) in slides"
              :key="index"
              class="dot"
              :class="{ active: index === currentIndex }"
              @click="goToSlide(index)"
              :aria-label="'Ir a la diapositiva ' + (index + 1)"
            ></button>
          </div>

          <!-- Sección de Compartir -->
          <div class="share-actions">
            <span class="share-label">Compartir:</span>
            <!-- Botón Copiar Enlace -->
            <button class="share-btn copy-btn" @click="shareUrl" title="Copiar enlace">
              <font-awesome-icon icon="fa-solid fa-link" />
            </button>
            <!-- Botón Facebook -->
            <button
              class="share-btn facebook-btn"
              @click="shareToFacebook"
              title="Compartir en Facebook"
            >
              <font-awesome-icon icon="fa-brands fa-facebook-f" />
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast de notificación -->
    <transition name="toast-fade">
      <div v-if="showToast" class="toast-notification">
        <font-awesome-icon icon="fa-solid fa-check-circle" class="toast-icon" />
        <span>Enlace copiado al portapapeles</span>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLink, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'

// Añadir iconos a la librería
library.add(faLink, faFacebookF, faCheckCircle)

// Import images
import img3 from '@/assets/images/navCrianza-3.jpg'
import img24 from '@/assets/images/navCrianza-24.jpg'
import img35 from '@/assets/images/navCrianza-35.jpg'
import img49 from '@/assets/images/navCrianza-49.jpg'
import img54 from '@/assets/images/navCrianza-54.jpg'
import img57 from '@/assets/images/navCrianza-57.jpg'
import img73 from '@/assets/images/navCrianza-73.jpg'
import img78 from '@/assets/images/navCrianza-78.jpg'
import img86 from '@/assets/images/navCrianza-86.jpg'
import img94 from '@/assets/images/navCrianza-94.jpg'
import img100 from '@/assets/images/navCrianza-100.jpg'
import img109 from '@/assets/images/navCrianza-109.jpg'
import img118 from '@/assets/images/navCrianza-118.jpg'
import img121 from '@/assets/images/navCrianza-121.jpg'
import img127 from '@/assets/images/navCrianza-127.jpg'
import img144 from '@/assets/images/navCrianza-144.jpg'
import img158 from '@/assets/images/navCrianza-158.jpg'

const show = ref(false)
const currentIndex = ref(0)
const emit = defineEmits(['close'])
let autoPlayInterval = null
const showToast = ref(false)

const STORAGE_KEY = 'campaign_last_view_date_v2'

const slides = [
  {
    image: img3,
    message: 'Esta Navidad, el regalo más valioso es el tiempo de calidad en familia.',
  },
  {
    image: img24,
    message: 'Que la paz y el entendimiento sean los pilares de su hogar estas fiestas.',
  },
  { image: img35, message: 'Fortalezcamos los vínculos afectivos con presencia y escucha activa.' },
  {
    image: img49,
    message: 'La Navidad es una oportunidad para nutrir el corazón de nuestra familia.',
  },
  {
    image: img54,
    message: 'Celebremos los pequeños logros y momentos que construyen una infancia feliz.',
  },
  {
    image: img57,
    message: 'Que la esperanza y la salud emocional iluminen cada rincón de su hogar.',
  },
  { image: img73, message: 'Creando recuerdos significativos que serán la base de su futuro.' },
  {
    image: img78,
    message: 'Proteger la ilusión y el bienestar de los niños es nuestra prioridad.',
  },
  { image: img86, message: 'Deseamos armonía, salud y un entorno lleno de amor para su familia.' },
  {
    image: img94,
    message: 'Que la magia de estas fechas inspire una crianza llena de paciencia y amor.',
  },
  {
    image: img100,
    message: 'Gracias por confiar en nosotros para acompañar el crecimiento de sus hijos.',
  },
  {
    image: img109,
    message: 'Que los sueños de su familia se construyan sobre bases sólidas de apoyo mutuo.',
  },
  {
    image: img118,
    message: 'Brindemos por un año nuevo lleno de salud integral y metas compartidas.',
  },
  {
    image: img121,
    message: 'La unión familiar es la herramienta más poderosa para enfrentar cualquier reto.',
  },
  {
    image: img127,
    message: 'Que la calidez de la Navidad fomente la seguridad y confianza en sus hijos.',
  },
  {
    image: img144,
    message: 'Compartir con empatía y respeto es el verdadero espíritu de estas fiestas.',
  },
  { image: img158, message: '¡Felices fiestas! Sigamos construyendo juntos un futuro saludable.' },
]

const currentSlide = computed(() => slides[currentIndex.value])

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.length
  resetAutoPlay()
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + slides.length) % slides.length
  resetAutoPlay()
}

const goToSlide = (index) => {
  currentIndex.value = index
  resetAutoPlay()
}

const resetAutoPlay = () => {
  if (autoPlayInterval) clearInterval(autoPlayInterval)
  autoPlayInterval = setInterval(nextSlide, 6000)
}

const closeModal = () => {
  show.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
  if (autoPlayInterval) clearInterval(autoPlayInterval)
}

const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0]
}

const shareUrl = () => {
  // Usamos la URL de producción para asegurar que sea compartible correctamente
  const url = 'https://www.crianzasanabydkids.mx/'
  navigator.clipboard
    .writeText(url)
    .then(() => {
      showToast.value = true
      setTimeout(() => {
        showToast.value = false
      }, 3000)
    })
    .catch((err) => console.error('Error al copiar:', err))
}

const shareToFacebook = () => {
  // Usamos la URL de producción para que Facebook pueda leer los meta tags
  const url = encodeURIComponent('https://www.crianzasanabydkids.mx/')
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
  window.open(facebookShareUrl, 'facebook-share-dialog', 'width=626,height=436')
}

onMounted(() => {
  const today = getTodayDateString()
  const lastViewDate = localStorage.getItem(STORAGE_KEY)

  // --- INICIO DEL CAMBIO PARA DESARROLLO ---
  // Comentamos esta validación para que el modal se muestre siempre durante las pruebas.
  // Cuando termines de probar, descomenta estas líneas:

  /*
  if (lastViewDate === today) {
    show.value = false
    emit('close')
    return
  }
  */
  // --- FIN DEL CAMBIO PARA DESARROLLO ---

  setTimeout(() => {
    show.value = true
  }, 100)

  // También puedes comentar esto si no quieres que se guarde la fecha durante las pruebas
  // localStorage.setItem(STORAGE_KEY, today)

  resetAutoPlay()
})

onUnmounted(() => {
  if (autoPlayInterval) clearInterval(autoPlayInterval)
})
</script>

<style scoped>
/* Variables de color */
:root {
  --christmas-red-deep: #a01a1c;
  --christmas-gold: #c5a05e;
  --text-color-dark: #2c3e50;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8); /* Fondo un poco más oscuro para resaltar más */
  backdrop-filter: blur(5px);
  z-index: 999999;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px; /* Padding exterior mínimo */
}

.modal-content {
  position: relative;
  width: 100%;
  /* AUMENTADO: Ancho máximo mucho mayor */
  max-width: 1200px;
  background: #fff;
  border-radius: 12px; /* Radio un poco más sutil para ganar espacio en esquinas */
  /* REDUCIDO: Padding interno mínimo para maximizar área útil */
  padding: 15px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(197, 160, 94, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(197, 160, 94, 0.3);
  overflow: hidden;
  /* Asegura que quepa en pantalla pero ocupando casi todo */
  max-height: 98vh;
}

/* Acento decorativo superior */
.modal-header-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px; /* Un poco más delgado */
  background: linear-gradient(
    90deg,
    var(--christmas-red-deep, #a01a1c),
    var(--christmas-gold, #c5a05e),
    var(--christmas-red-deep, #a01a1c)
  );
}

/* Botón de cerrar */
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(
    255,
    255,
    255,
    0.8
  ); /* Fondo semi-transparente para que se vea sobre la imagen si es necesario */
  border: none;
  width: 32px; /* Un poco más pequeño */
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 20; /* Z-index más alto para asegurar que esté sobre todo */
  transition: all 0.3s ease;
  color: #999;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.close-button:hover {
  background-color: var(--christmas-red-deep, #a01a1c);
  color: white;
  transform: rotate(90deg);
}

.close-icon {
  font-size: 1.2rem;
  line-height: 1;
}

/* Layout del Carrusel */
.carousel-container {
  display: flex;
  align-items: center;
  width: 100%;
  /* REDUCIDO: Menos espacio entre flechas e imagen */
  gap: 10px;
  margin-top: 5px;
  flex: 1;
  min-height: 0;
}

.slide-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* REDUCIDO: Menos espacio entre imagen y texto */
  gap: 15px;
  height: 100%;
  justify-content: center;
  width: 100%; /* Asegura que ocupe el ancho disponible */
}

.image-wrapper {
  width: 100%;
  /* AUMENTADO SIGNIFICATIVAMENTE: Ocupa casi el 80% de la altura de la pantalla */
  height: 78vh;
  /* ELIMINADO: Sin límite de píxeles */
  /* max-height: 700px; */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
  background: #fafafa;
}

.campaign-image {
  width: 100%;
  height: 100%;
  /* Mantenemos contain para no recortar, pero ahora el contenedor es mucho más grande */
  object-fit: contain;
}

.message-container {
  text-align: center;
  padding: 0 10px;
  max-width: 95%;
  flex-shrink: 0;
}

/* Tipografía */
.christmas-message {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 1.3rem;
  line-height: 1.4;
  color: var(--text-color-dark, #2c3e50);
  font-weight: normal;
  margin: 0;
  border-bottom: 1px solid rgba(197, 160, 94, 0.3); /* Línea más sutil */
  padding-bottom: 10px;
  display: inline-block;
}

/* Botones de Navegación */
.nav-button {
  background: transparent;
  border: 1px solid rgba(197, 160, 94, 0.3);
  color: var(--christmas-gold, #c5a05e);
  cursor: pointer;
  padding: 0;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; /* Ligeramente más pequeños */
  height: 40px;
  flex-shrink: 0;
}

.nav-button:hover {
  background: var(--christmas-gold, #c5a05e);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 10px rgba(197, 160, 94, 0.3);
}

/* Puntos de navegación */
.dots-container {
  display: flex;
  gap: 8px;
  margin-top: 15px; /* Menos margen superior */
  flex-wrap: wrap;
  justify-content: center;
  flex-shrink: 0;
  padding-bottom: 5px;
}

.dot {
  width: 8px; /* Puntos ligeramente más pequeños */
  height: 8px;
  border-radius: 50%;
  background: #e0e0e0;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.dot.active {
  background: var(--christmas-gold, #c5a05e);
  transform: scale(1.3);
  box-shadow: 0 0 10px rgba(197, 160, 94, 0.4);
}

/* --- Estilos para Compartir --- */
.share-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  flex-shrink: 0;
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
  background-color: #1877f2;
  color: white;
}
.facebook-btn:hover {
  background-color: #166fe5;
  transform: translateY(-2px);
}

/* --- Toast Notification Moderno (Igual que BlogDetail) --- */
.toast-notification {
  position: fixed;
  top: 30px;
  right: 30px;
  background: white;
  color: #2d3748;
  padding: 12px 20px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  z-index: 1000000; /* Ensure it's above the modal (modal is 999999) */
  font-weight: 600;
  font-size: 0.95rem;
  border-left: 4px solid #48bb78; /* Verde éxito */
}

.toast-icon {
  color: #48bb78;
  margin-right: 10px;
  font-size: 1.1rem;
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

/* Transiciones Vue */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.4s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    padding: 10px; /* Padding mínimo en móvil */
    width: 98%;
  }
  .image-wrapper {
    /* AUMENTADO: Mucha más altura en móviles */
    height: 60vh;
  }

  .christmas-message {
    font-size: 1.1rem;
    padding-bottom: 8px;
  }

  .nav-button {
    width: 32px;
    height: 32px;
  }

  .carousel-container {
    gap: 5px; /* Espacio mínimo entre flechas */
  }

  .slide-content {
    gap: 10px;
  }
}
</style>
