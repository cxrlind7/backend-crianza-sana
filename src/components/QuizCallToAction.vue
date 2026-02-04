<template>
  <div class="container my-5">
    <div
      class="row align-items-center quiz-cta-card p-4 rounded-4 shadow-sm position-relative overflow-hidden"
    >
      <!-- Fondo decorativo suave -->
      <div class="mesh-bg"></div>

      <!-- Elementos Decorativos Flotantes -->
      <div class="floating-icons">
        <div class="float-icon icon-1">❓</div>
        <div class="float-icon icon-2">💭</div>
        <div class="float-icon icon-3">❔</div>
      </div>

      <div class="col-md-8 position-relative z-1 mb-3 mb-md-0">
        <h2 class="fw-bold mb-2 text-dark">¿Tu hijo necesita apoyo?</h2>
        <p class="mb-0 text-muted lead">
          Responde nuestro breve cuestionario para identificar si podría beneficiarse de
          acompañamiento en Psicología, Nutrición o Lenguaje.
        </p>
      </div>

      <div class="col-md-4 text-center text-md-end position-relative z-1">
        <router-link
          to="/quiz"
          class="btn-cta btn-lg rounded-pill px-5 shadow-sm hover-scale text-decoration-none d-inline-flex align-items-center"
        >
          <span class="btn-icon-wrapper me-2">
            <i class="bi bi-magic"></i>
          </span>
          <span class="fw-bold">Realizar Test</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuizCallToAction',
}
</script>

<style scoped>
.quiz-cta-card {
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.mesh-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  z-index: 0;
  background: radial-gradient(circle at 10% 90%, rgba(255, 100, 100, 0.1), transparent 40%),
    radial-gradient(circle at 90% 10%, rgba(100, 255, 255, 0.2), transparent 40%);
}

.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.05);
}

/* floating icons decoration */
.floating-icons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.float-icon {
  position: absolute;
  font-size: 2rem; /* Un poco más pequeños que en el quiz full */
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
}

.icon-1 {
  top: 10%;
  right: 10%;
  animation-delay: 0s;
  color: #ff6b6b;
  transform: rotate(-15deg);
}

.btn-cta {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white !important;
  border: none;
  height: 3rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(108, 92, 231, 0.3) !important;
  background: linear-gradient(135deg, #5f4dd0, #9188f0);
}

.btn-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-2 {
  bottom: 10%;
  left: 5%;
  animation-delay: 2s;
  color: #4ecdc4;
  font-size: 1.5rem;
}
.icon-3 {
  top: 40%;
  left: 40%;
  animation-delay: 4s;
  color: #ffe66d;
  transform: rotate(15deg);
  opacity: 0.4;
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
}
</style>
