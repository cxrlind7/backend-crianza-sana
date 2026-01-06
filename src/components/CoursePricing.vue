<template>
  <div class="pricing-card p-4 p-md-5 text-center">
    <div class="ribbon">CUPO LIMITADO</div>
    <h3 class="mb-4 fw-bold text-dark">Invierte en el bienestar de tu familia</h3>

    <div class="price-container mb-4">
      <span class="original-price text-muted text-decoration-line-through me-2 fs-5">
        ${{ course.price.original }} {{ course.price.currency }}
      </span>
      <!-- Precio en cian -->
      <div class="current-price text-cyan fw-bolder">
        <span class="display-4 fw-bold">${{ course.price.discounted }}</span>
        <span class="fs-5 ms-1">{{ course.price.currency }}</span>
      </div>
    </div>

    <ul class="features-list text-start mb-4 d-inline-block mx-auto">
      <li
        v-for="(feature, index) in course.features"
        :key="index"
        class="mb-3 d-flex align-items-center text-secondary"
      >
        <!-- Checkmark cian -->
        <i class="bi bi-check-circle-fill text-cyan me-3 fs-5"></i>
        <span>{{ feature }}</span>
      </li>
    </ul>

    <!-- Botón con gradiente cian/azul -->
    <button
      class="btn btn-cyan-gradient btn-lg w-100 fw-bold py-3 pulse-animation"
      @click="$emit('trigger-purchase')"
    >
      <i class="bi bi-person-check-fill me-2"></i> INSCRIBIRME AHORA
    </button>
    <p class="text-muted mt-3 small d-flex align-items-center justify-content-center">
      <i class="bi bi-shield-lock-fill me-2"></i>
      Pagos procesados con <i class="fab fa-stripe fa-2x ms-2 align-middle"></i>
    </p>
  </div>
</template>

<script>
export default {
  props: ['course'],
  emits: ['trigger-purchase'],
}
</script>

<style scoped>
.text-cyan {
  color: var(--accent-cyan) !important;
}

.pricing-card {
  /* Fondo blanco con gradiente sutil */
  background: linear-gradient(145deg, #ffffff, #f0f9ff);
  border-radius: 24px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(6, 182, 212, 0.2); /* Borde cian sutil */
  position: relative;
  overflow: hidden;
}

.ribbon {
  position: absolute;
  top: 20px;
  right: -35px;
  transform: rotate(45deg);
  background-color: var(--accent-cyan); /* Ribbon cian */
  color: #fff;
  padding: 5px 40px;
  font-weight: bold;
  font-size: 0.8rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.features-list {
  list-style: none;
  padding: 0;
}

/* Nuevo gradiente para el botón (Cian a Azul) */
.btn-cyan-gradient {
  background: linear-gradient(to right, var(--accent-cyan), #0ea5e9);
  color: #fff;
  border: none;
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
  transition: all 0.3s ease;
}
.btn-cyan-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(6, 182, 212, 0.5);
  color: #fff;
}

/* Animación de pulso cian */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.5);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(6, 182, 212, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(6, 182, 212, 0);
  }
}
.pulse-animation {
  animation: pulse 2s infinite;
}
</style>
