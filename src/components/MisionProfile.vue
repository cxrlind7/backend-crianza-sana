<template>
  <div class="mission-vision-section">
    <div class="container">
      <!-- Caso 1: Ambas existen (Grid de 2) -->
      <div v-if="mision && vision" class="mission-vision-grid">
        <!-- Tarjeta Misión -->
        <div class="mv-card mission-card fade-in">
          <div class="card-content p-4 p-lg-5">
            <div class="d-flex align-items-center mb-4">
              <div class="icon-box me-3">
                <i class="fas fa-bullseye fa-lg text-primary-muted"></i>
              </div>
              <h3 class="card-title mb-0">Misión</h3>
            </div>
            <p class="card-description">{{ mision }}</p>
          </div>
        </div>
        <!-- Tarjeta Visión -->
        <div class="mv-card vision-card fade-in delay-1">
          <div class="card-content p-4 p-lg-5">
            <div class="d-flex align-items-center mb-4">
              <div class="icon-box me-3">
                <i class="fas fa-lightbulb fa-lg text-info-muted"></i>
              </div>
              <h3 class="card-title mb-0">Visión</h3>
            </div>
            <p class="card-description">{{ vision }}</p>
          </div>
        </div>
      </div>

      <!-- Caso 2: Solo una existe (Tarjeta única ancha) -->
      <div v-else-if="mision || vision" class="single-card-wrapper fade-in">
        <div class="mv-card single-card">
          <div class="card-content p-4 p-lg-5 text-center">
            <h3 class="card-title mb-4">Misión y Visión</h3>
            <p class="card-description lead" style="max-width: 800px; margin: auto">
              {{ mision || vision }}
            </p>
          </div>
        </div>
      </div>

      <!-- Caso 3: Ninguna existe -->
      <div v-else class="text-center py-5 text-muted fade-in">
        <p>No hay información disponible.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MisionProfile',
  props: {
    mision: {
      type: String,
      required: true,
    },
    vision: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
/* Contenedor principal */
.mission-vision-section {
  width: 100%;
  padding: 20px 0 60px 0;
  /* Eliminamos fondos y sombras del contenedor principal para que se integre en el padre */
}

/* Contenedor tipo grid */
.mission-vision-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px; /* Aumentamos el espacio entre tarjetas */
  width: 100%;
}

/* Estilo Base de las Tarjetas (Coherente con ServicesProfile) */
.mv-card {
  background-color: #ffffff;
  border-radius: 16px;
  /* Sombra suave y elegante */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  height: 100%;
  overflow: hidden;
}

.mv-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
  border-color: transparent;
}

/* Detalles visuales para diferenciar Misión de Visión sutilmente */
.mission-card {
  border-bottom: 3px solid rgba(0, 123, 255, 0.2); /* Azul sutil */
}
.vision-card {
  border-bottom: 3px solid rgba(23, 162, 184, 0.2); /* Cian sutil */
}

/* Cajas de Iconos */
.icon-box {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #f8f9fa;
}
.text-primary-muted {
  color: #007bff99;
}
.text-info-muted {
  color: #17a2b899;
}

/* Título de las tarjetas */
.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  letter-spacing: -0.5px;
}

/* Descripción de las tarjetas */
.card-description {
  font-size: 1.05rem;
  line-height: 1.8; /* Mayor interlineado para elegancia */
  color: #555;
  font-weight: 300; /* Fuente más ligera */
  text-align: left; /* Justificado a la izquierda es más moderno que 'justify' */
}

/* Animaciones de entrada */
.fade-in {
  opacity: 0;
  animation: fadeInAnimation 0.6s ease-out forwards;
}
.delay-1 {
  animation-delay: 0.2s;
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

/* Responsividad */
@media (max-width: 768px) {
  .mission-vision-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .card-content {
    padding: 1.5rem !important;
  }
}
</style>
