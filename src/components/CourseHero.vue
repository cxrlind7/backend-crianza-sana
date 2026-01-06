<template>
  <header class="hero-section text-center text-lg-start py-4 py-lg-5">
    <div class="row align-items-center gx-lg-5">
      <!-- Texto Hero (Izquierda) -->
      <div class="col-lg-7 order-2 order-lg-1 mt-3 mt-lg-0">
        <!-- Badge color cian -->
        <span class="badge bg-cyan text-white mb-3 px-3 py-2 rounded-pill fw-bold">
          NUEVO PROGRAMA
        </span>
        <h1 class="hero-title fw-bolder mb-3 text-dark">{{ course.title }}</h1>
        <p class="hero-subtitle lead mb-4 text-secondary">{{ course.subtitle }}</p>

        <!-- Info del Presentador (Desktop - Pequeño abajo) -->
        <div
          class="presenter-info d-flex align-items-center mt-4 p-3 rounded-3 presenter-card d-none d-lg-inline-flex"
        >
          <div class="image-glow-ring-small me-3">
            <img
              :src="course.presenter.image"
              :alt="course.presenter.name"
              class="presenter-photo-small"
            />
          </div>
          <div>
            <h5 class="m-0 fw-bold text-cyan">{{ course.presenter.name }}</h5>
            <small class="text-muted">{{ course.presenter.role }}</small>
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Video Intro (Desktop) / Presentador (Móvil) -->
      <div class="col-lg-5 order-1 order-lg-2 mb-4 mb-lg-0 text-center">
        <!-- Versión Móvil: Foto del Presentador -->
        <div class="d-lg-none">
          <div class="image-glow-ring mx-auto mb-3">
            <img
              :src="course.presenter.image"
              :alt="course.presenter.name"
              class="presenter-photo-large"
            />
          </div>
          <h4 class="text-cyan fw-bold mb-1">{{ course.presenter.name }}</h4>
          <p class="text-muted mb-0">{{ course.presenter.role }}</p>
        </div>

        <!-- Versión Desktop: Placeholder de Video Intro -->
        <div class="d-none d-lg-block">
          <!-- Contenedor que simula el video -->
          <div
            class="video-intro-placeholder position-relative rounded-4 overflow-hidden shadow-lg mx-auto ms-lg-auto"
          >
            <!-- Miniatura (Usamos la foto del presentador oscurecida) -->
            <img
              :src="course.presenter.image"
              alt="Miniatura Video Introducción"
              class="img-fluid w-100 video-thumbnail"
            />

            <!-- Overlay con Botón de Play -->
            <div
              class="play-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
            >
              <!-- Círculo blanco de fondo para el play -->
              <div
                class="play-button-bg bg-white rounded-circle d-flex justify-content-center align-items-center mb-2"
              >
                <i class="bi bi-play-fill text-cyan play-icon"></i>
              </div>
              <span class="text-white fw-bold text-shadow">Ver Introducción</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  props: ['course'],
}
</script>

<style scoped>
.hero-title {
  font-size: 2.5rem;
  line-height: 1.2;
  color: #2c3e50;
}
.bg-cyan {
  background-color: var(--accent-cyan) !important;
}
.text-cyan {
  color: var(--accent-cyan) !important;
}

/* --- Estilos del Presentador --- */
.presenter-card {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(6, 182, 212, 0.3);
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.image-glow-ring,
.image-glow-ring-small {
  display: inline-block;
  border-radius: 50%;
  border: 3px solid var(--accent-cyan);
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.3);
  background-color: rgba(255, 255, 255, 0.5);
}
.image-glow-ring {
  padding: 5px;
}
.image-glow-ring-small {
  padding: 3px;
  border-width: 2px;
}

.presenter-photo-large {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
}
.presenter-photo-small {
  width: 65px;
  height: 65px;
  object-fit: cover;
  border-radius: 50%;
}

/* --- Nuevos Estilos para el Video Placeholder (Desktop) --- */
.video-intro-placeholder {
  max-width: 450px; /* Tamaño máximo para que no se vea enorme */
  cursor: pointer;
  border: 2px solid rgba(6, 182, 212, 0.5); /* Borde cian sutil */
  transition: all 0.3s ease;
}

.video-intro-placeholder:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(6, 182, 212, 0.4) !important; /* Glow cian al pasar el mouse */
}

.video-thumbnail {
  height: 300px; /* Altura fija para consistencia */
  object-fit: cover;
  filter: brightness(0.6); /* Oscurecer la imagen para que resalte el play */
  transition: filter 0.3s ease;
}

.video-intro-placeholder:hover .video-thumbnail {
  filter: brightness(0.7); /* Aclarar un poco al pasar el mouse */
}

.play-overlay {
  background-color: rgba(0, 0, 0, 0.2); /* Capa oscura sutil sobre la imagen */
}

.play-button-bg {
  width: 80px;
  height: 80px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.play-icon {
  font-size: 3rem;
  margin-left: 5px; /* Pequeño ajuste óptico para centrar el triángulo */
}

.video-intro-placeholder:hover .play-button-bg {
  transform: scale(1.1); /* Efecto de pulso en el botón al pasar el mouse */
}

.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 1.8rem;
  }
  .hero-subtitle {
    font-size: 1.1rem;
  }
}
</style>
