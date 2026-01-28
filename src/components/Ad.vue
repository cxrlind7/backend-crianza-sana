<template>
  <div
    class="promo-image-container"
    :class="{ 'expanded-mobile': isMobileExpanded }"
    @click="handleToggle"
  >
    <div class="close-btn" @click.stop="closePromo">×</div>

    <img :src="currentImageSrc" alt="Anuncio Buen Fin Vitafix" />
  </div>
</template>

<script>
export default {
  name: 'PromoBuenFin',
  data() {
    return {
      isMobile: false,
      isMobileExpanded: false,
      images: [
        'https://res.cloudinary.com/duiqgfa0v/image/upload/v1769474008/IMG_1400_djwzjb.png',
        'https://res.cloudinary.com/duiqgfa0v/image/upload/v1769474008/IMG_1400_djwzjb.png',
      ],
      currentImageIndex: 0,
      imageInterval: null,
    }
  },
  computed: {
    currentImageSrc() {
      return this.images[this.currentImageIndex]
    },
  },
  mounted() {
    this.checkDeviceType()
    window.addEventListener('resize', this.checkDeviceType)

    // Aparece a los 5 segundos
    setTimeout(() => {
      this.isMobileExpanded = true
    }, 5000)

    this.startImageCarousel()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkDeviceType)
    clearInterval(this.imageInterval)
  },
  methods: {
    checkDeviceType() {
      this.isMobile = window.innerWidth <= 768
    },
    handleToggle() {
      if (this.isMobile) {
        this.isMobileExpanded = !this.isMobileExpanded
      }
    },
    closePromo() {
      this.isMobileExpanded = false
    },
    startImageCarousel() {
      clearInterval(this.imageInterval)
      this.imageInterval = setInterval(() => {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length
      }, 4000)
    },
  },
}
</script>

<style scoped>
.promo-image-container {
  position: fixed;
  z-index: 1000;
  top: 50%;
  right: 0;
  transform: translateY(-50%) translateX(265px);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: -4px 4px 15px rgba(0, 0, 0, 0.3);
  border-radius: 20px 0 0 20px;
  overflow: hidden;
  line-height: 0;
}

.promo-image-container img {
  display: block;
  width: 320px;
  height: auto;
  border-radius: 20px 0 0 20px;
}

/* Estilo de la X */
.close-btn {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Arial', sans-serif;
  font-size: 20px;
  z-index: 1001;

  /* ESCONDIDA POR DEFECTO */
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s ease,
    visibility 0.3s;
}

/* MOSTRAR LA X SOLO CUANDO ESTÁ AFUERA */

/* En PC al pasar el mouse */
@media (min-width: 769px) {
  .promo-image-container:hover {
    transform: translateY(-50%) translateX(0);
  }
  .promo-image-container:hover .close-btn {
    opacity: 1;
    visibility: visible;
  }
}

/* En Móvil cuando tiene la clase expandida */
@media (max-width: 768px) {
  .promo-image-container.expanded-mobile {
    transform: translateY(-50%) translateX(0);
  }
  .promo-image-container.expanded-mobile .close-btn {
    opacity: 1;
    visibility: visible;
  }
}
</style>
