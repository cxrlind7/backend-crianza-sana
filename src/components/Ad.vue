<template>
  <div
    class="promo-image-container"
    :class="{ 'expanded-mobile': isMobileExpanded }"
    @click="handleToggle"
  >
    <img :src="currentImageSrc" alt="Anuncio Buen Fin Vitafix" />
  </div>
</template>

<script>
export default {
  name: 'PromoBuenFin',
  data() {
    return {
      isMobile: false, // Para saber si activar la lógica móvil
      isMobileExpanded: false, // Controla la clase .expanded-mobile

      // --- Nuevos datos para el carrusel de imágenes ---
      images: [
        'https://res.cloudinary.com/duiqgfa0v/image/upload/v1769474008/IMG_1400_djwzjb.png',
        'https://res.cloudinary.com/duiqgfa0v/image/upload/v1769474008/IMG_1400_djwzjb.png',
      ],
      currentImageIndex: 0,
      imageInterval: null, // Para guardar la referencia del setInterval
    }
  },
  computed: {
    /**
     * Propiedad computada que devuelve la ruta de la imagen actual
     */
    currentImageSrc() {
      return this.images[this.currentImageIndex]
    },
  },
  mounted() {
    // 1. Verificamos el tamaño al cargar
    this.checkDeviceType()

    // 2. Escuchamos por si el usuario cambia el tamaño de la ventana
    window.addEventListener('resize', this.checkDeviceType)

    // 3. Si es móvil, ejecutamos la animación de "aparecer y esconderse"
    if (this.isMobile) {
      this.isMobileExpanded = true // Empezamos expandidos
      setTimeout(() => {
        this.isMobileExpanded = false // Nos contraemos
      }, 6000) // Después de 4 segundos
    }

    // 4. Iniciamos el carrusel de imágenes
    this.startImageCarousel()
  },
  beforeUnmount() {
    // Limpiamos los "listeners" para evitar problemas de memoria
    window.removeEventListener('resize', this.checkDeviceType)
    clearInterval(this.imageInterval) // Detenemos el carrusel
  },
  methods: {
    // Método que revisa el tamaño de la pantalla
    checkDeviceType() {
      this.isMobile = window.innerWidth <= 768
    },

    // Se llama al hacer clic en la IMAGEN
    handleToggle() {
      // Esta lógica SÓLO se ejecuta si es móvil
      if (this.isMobile) {
        this.isMobileExpanded = !this.isMobileExpanded
      }
      // En PC, no hace nada, porque el CSS :hover se encarga
    },

    // Inicia el intervalo para cambiar la imagen
    startImageCarousel() {
      // Limpiamos cualquier intervalo anterior por si acaso
      clearInterval(this.imageInterval)

      this.imageInterval = setInterval(() => {
        // Calculamos el siguiente índice, volviendo a 0 si llega al final
        const nextIndex = (this.currentImageIndex + 1) % this.images.length
        this.currentImageIndex = nextIndex
      }, 4000) // Cambia cada 4 segundos
    },
  },
}
</script>

<style scoped>
/* --- ESTILO BASE (Común para PC y Móvil) --- */
.promo-image-container {
  position: fixed;
  z-index: 1000;
  top: 50%;
  right: 0;

  /* Estado contraído:
    Se asume que la imagen mide 320px y queremos que se asomen 55px
    (320px - 55px = 265px).
    Ajustamos la translación para que se oculte 265px.
  */
  transform: translateY(-50%) translateX(265px); /* 320px - 55px = 265px */

  transition: transform 0.3s ease-in-out;
  cursor: pointer;
  box-shadow: -2px 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px 0 0 10px;
  overflow: hidden; /* Para que los bordes redondeados corten la imagen */
  line-height: 0; /* Evita espacios extra debajo de la imagen */
}

.promo-image-container img {
  display: block;
  width: 320px; /* Ancho del panel desplegado */
  height: auto;
}

/* --- LÓGICA DE EXPANSIÓN CON MEDIA QUERIES --- */

/* 1. VERSIÓN PC (Pantallas de más de 768px) */
@media (min-width: 769px) {
  /* Usamos la pseudo-clase :hover de CSS para expandir */
  .promo-image-container:hover {
    transform: translateY(-50%) translateX(0);
  }
}

/* 2. VERSIÓN MÓVIL (Pantallas de 768px o menos) */
@media (max-width: 768px) {
  /* Estado contraído:
    En móvil, usamos la misma lógica de 55px asomados.
  */
  .promo-image-container {
    transform: translateY(-50%) translateX(265px);
  }

  /* Estado expandido:
    Usamos la clase .expanded-mobile de Vue para expandir
  */
  .promo-image-container.expanded-mobile {
    transform: translateY(-50%) translateX(0);
  }
}

/* --- Estilos del Modal eliminados --- */
</style>
