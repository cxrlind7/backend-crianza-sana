<template>
  <div class="position-relative pt-5 mt-4">
    <!-- Botón Regresar -->
    <div class="container fade-in" style="z-index: 100">
      <button @click="goBack" class="btn-back">
        <i class="bi bi-arrow-left me-2"></i>
        <span class="d-none d-sm-inline">Regresar</span>
      </button>

      <!-- Título de la Vista -->
      <h3
        class="text-uppercase letter-spacing-2 text-dark text-center mb-0 mt-3"
        style="font-size: 1.5rem; opacity: 0.8"
      >
        Quiz Crianza Sana
      </h3>
    </div>
    <QuizCrianza />
  </div>
</template>

<script>
import QuizCrianza from '@/components/QuizCrianza.vue'

export default {
  name: 'QuizView',
  components: {
    QuizCrianza,
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
/* Botón Regresar (Estilo BlogView) */
.btn-back {
  background: rgba(255, 255, 255, 0.9);
  color: var(--dm-text-secondary);
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 8px 20px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: inline-flex;
  align-items: center;
  margin-left: 5rem;
}

.btn-back:hover {
  background-color: var(--dm-surface);
  transform: translateX(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  color: var(--dm-text);
}
</style>
