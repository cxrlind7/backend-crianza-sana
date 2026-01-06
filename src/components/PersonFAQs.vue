<template>
  <div class="person-faq-section" v-if="preguntas && preguntas.length">
    <div class="container-fluid main-container">
      <!-- Título de la sección -->
      <div class="text-center mb-5 fade-in">
        <h6 class="text-uppercase letter-spacing-2 text-muted mb-2">Dudas Resueltas</h6>
        <h2 class="display-6 fw-bold text-dark">Preguntas Frecuentes</h2>
      </div>

      <!-- Card Blanca con sombra -->
      <div class="accordion-wrapper fade-in delay-1">
        <!-- Contenedor con Scroll elegante -->
        <div class="faq-scroll-container">
          <!-- Se usa 'accordion-flush' para un look limpio dentro de la card -->
          <div class="accordion accordion-flush" id="faqAccordion">
            <div class="accordion-item mb-2" v-for="(faq, index) in preguntas" :key="index">
              <h2 class="accordion-header" :id="'heading' + index">
                <!--
                  IMPORTANTE: Se pasa el color de la persona como variable CSS
                  en el estilo en línea (--accent-color) para que el CSS lo pueda usar.
                -->
                <button
                  class="accordion-button collapsed px-0"
                  type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="'#collapse' + index"
                  aria-expanded="false"
                  :aria-controls="'collapse' + index"
                  :style="{ '--accent-color': personColor }"
                >
                  {{ faq.pregunta }}
                </button>
              </h2>
              <div
                :id="'collapse' + index"
                class="accordion-collapse collapse"
                :aria-labelledby="'heading' + index"
                data-bs-parent="#faqAccordion"
              >
                <div class="accordion-body text-muted px-0 pb-3 pt-1">
                  {{ faq.respuesta }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Fin container scroll -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonFAQs',
  props: {
    preguntas: {
      type: Array,
      default: () => [],
    },
    personColor: {
      type: String,
      default: '#0d6efd', // Color de respaldo si no llega nada
    },
  },
}
</script>

<style scoped>
.person-faq-section {
  padding: 40px 0;
}

.main-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Títulos */
.letter-spacing-2 {
  letter-spacing: 2px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* --- Estilos de la Card Blanca --- */
.accordion-wrapper {
  background: #ffffff;
  border-radius: 24px;
  padding: 30px 30px 10px 30px;
  /* Sombra pronunciada y elegante */
  box-shadow:
    0 20px 40px rgba(50, 50, 93, 0.08),
    0 10px 20px rgba(0, 0, 0, 0.05) !important;
}

/* --- Estilos del Scroll Elegante --- */
.faq-scroll-container {
  max-height: 450px; /* Altura máxima */
  overflow-y: auto;
  padding-right: 15px;
  margin-bottom: 20px;
}

/* Personalización de la barra de scroll */
.faq-scroll-container::-webkit-scrollbar {
  width: 5px;
}

.faq-scroll-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 10px;
}

.faq-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 10px;
}

.faq-scroll-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}

/* --- Estilos del Acordeón --- */
.accordion-item {
  background-color: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
}

.accordion-item:last-child {
  border-bottom: none !important;
}

/* Estilos base del botón (cerrado) */
.accordion-button {
  background-color: transparent;
  box-shadow: none;
  padding: 1rem 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #2c3e50;
  transition: all 0.3s ease;
}

/* --- ESTADO ACTIVO (ABIERTO) - CORRECCIÓN DE COLOR --- */
.accordion-button:not(.collapsed) {
  background-color: transparent !important; /* Asegura fondo transparente */
  /* Usamos !important para forzar el color de la variable CSS sobre el azul de Bootstrap */
  color: var(--accent-color) !important;
  box-shadow: none !important; /* Elimina el anillo de enfoque azul */
}

/* Eliminar el estilo de foco al hacer clic */
.accordion-button:focus {
  box-shadow: none !important;
  border-color: transparent !important;
  color: var(--accent-color); /* Mantiene el color al hacer foco */
}

/* Icono del acordeón (flecha) */
.accordion-button::after {
  background-size: 1rem;
  transition: all 0.3s ease;
  opacity: 0.5;
}

/* Icono cuando está ABIERTO */
.accordion-button:not(.collapsed):after {
  /* Truco CSS: Usa un filtro de sombra para "pintar" el SVG original (que es negro/gris)
     con el color de la variable --accent-color */
  filter: drop-shadow(0 0 0 var(--accent-color)) saturate(1000%);
  opacity: 1;
  transform: rotate(180deg);
}

.accordion-body {
  font-size: 1rem;
  line-height: 1.6;
  color: #6c757d;
}

/* Animaciones */
.fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease-out forwards;
}
.delay-1 {
  animation-delay: 0.2s;
}

@keyframes fadeIn {
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
