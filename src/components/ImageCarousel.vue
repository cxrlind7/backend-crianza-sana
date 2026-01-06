<template>
  <div class="carousel">
    <div class="carousel-container" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <!-- Cada componente personalizado como un slide -->
      <div class="carousel-slide" v-for="(component, index) in components" :key="index">
        <component :is="component"></component>
      </div>
    </div>
    <div class="carousel-nav">
      <!-- Botones de navegación -->
      <button class="prev" @click="prevSlide">&#8249;</button>
      <button class="next" @click="nextSlide">&#8250;</button>
    </div>
  </div>
</template>

<script>
// import SlideOne from "@/components/UpcomingProgram.vue";
import SlideTwo from '@/components/UpcomingProgram.vue'

export default {
  name: 'ImageCarousel',
  data() {
    return {
      components: [SlideTwo], // Lista de componentes
      currentIndex: 0,
      autoSlideInterval: null, // Almacena el intervalo para detenerlo si es necesario
    }
  },
  methods: {
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.components.length // Siguiente slide
    },
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.components.length) % this.components.length // Slide anterior
    },
    startAutoSlide() {
      this.autoSlideInterval = setInterval(this.nextSlide, 6000) // Cambia automáticamente cada 2 segundos
    },
    stopAutoSlide() {
      clearInterval(this.autoSlideInterval) // Detiene el cambio automático
    },
  },
  mounted() {
    this.startAutoSlide() // Inicia el cambio automático cuando se monta el componente
  },
  beforeUnmount() {
    this.stopAutoSlide() // Limpia el intervalo al destruir el componente
  },
}
</script>

<style>
.carousel {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
}

.carousel-container {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
}

.carousel-nav button {
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 2rem;
  padding: 1rem;
  cursor: pointer;
  z-index: 10;
}

.carousel-nav .prev {
  position: absolute;
  left: 2rem;
}

.carousel-nav .next {
  position: absolute;
  right: 2rem;
}
</style>
