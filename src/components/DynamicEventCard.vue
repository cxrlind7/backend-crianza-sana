<template>
  <!--
    El contenedor principal.
    La clase dinámica :class="`theme-${colorPalette}`" aplica las variables de color CSS correspondientes.
  -->
  <div class="event-card-container" :class="`theme-${colorPalette}`">
    <!-- Formas de fondo abstractas (decorativas) -->
    <div class="abstract-shape shape-1"></div>
    <div class="abstract-shape shape-2"></div>

    <div class="card-content relative z-10">
      <!-- HEADER: Logos y Badge -->
      <div class="card-header">
        <div class="logos-area">
          <!-- Si hay logos, los mostramos -->
          <img v-if="mainLogo" :src="mainLogo" alt="Logo principal" class="main-logo" />
        </div>
        <div v-if="isLive" class="live-badge">LIVE</div>
      </div>

      <!-- TITULOS -->
      <div class="text-center my-6">
        <h3 v-if="eventType" class="event-type uppercase tracking-widest">{{ eventType }}</h3>
        <h1 class="main-title">{{ title }}</h1>
        <h2 v-if="subtitle" class="subtitle">{{ subtitle }}</h2>
      </div>

      <!-- BARRA DE INFO (Fecha, Hora, Lugar) -->
      <div class="info-bar">
        <div class="info-item">
          <i class="fas fa-calendar-alt"></i>
          <span>{{ date }}</span>
        </div>
        <div class="info-item">
          <i class="far fa-clock"></i>
          <span>{{ time }}</span>
        </div>
        <div v-if="location" class="info-item location-item">
          <i class="fas fa-map-marker-alt"></i>
          <span>{{ location }}</span>
        </div>
      </div>

      <!-- SECCIÓN DE PONENTES (Dinámica: 1 o 2 columnas) -->
      <div
        class="speakers-section"
        :class="{
          'single-speaker-layout': speakers.length === 1,
          'multi-speaker-layout': speakers.length > 1,
        }"
      >
        <div v-for="(speaker, index) in speakers" :key="index" class="speaker-card">
          <div class="speaker-image-wrapper">
            <img :src="speaker.image" :alt="speaker.name" class="speaker-image" />
          </div>
          <div class="speaker-info text-center">
            <h4 class="speaker-name">{{ speaker.name }}</h4>
            <!-- Soporta saltos de línea en los títulos largos -->
            <p class="speaker-title" v-html="formatTitles(speaker.title)"></p>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div v-if="footerText" class="card-footer">
        {{ footerText }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DynamicEventCard',
  props: {
    // --- Configuración Visual ---
    // Opciones: 'peach-blue', 'purple-pink', 'red-orange', 'blue-orange'
    colorPalette: {
      type: String,
      default: 'peach-blue',
    },

    // --- Datos del Evento ---
    eventType: {
      type: String,
      default: 'Webinar', // Ej: Webinar, Charla, Programa Especial
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    mainLogo: {
      type: String,
      default: '', // URL del logo superior izquierdo si lo hay
    },

    // --- Fecha y Lugar ---
    date: {
      type: String,
      required: true, // Ej: "Jueves 25 Septiembre, 2025"
    },
    time: {
      type: String,
      required: true, // Ej: "7:30 PM"
    },
    location: {
      type: String,
      default: '', // Ej: "Auditorio Rex" o "95.7 FM". Si es vacío, no se muestra.
    },

    // --- Ponentes (Array de objetos) ---
    // Estructura esperada: [{ name: '...', title: '...', image: '...' }]
    speakers: {
      type: Array,
      default: () => [],
    },

    // --- Footer ---
    footerText: {
      type: String,
      default: 'crianzasanabydkids.mx',
    },
  },
  methods: {
    // Utilidad para permitir saltos de línea en los títulos largos de los ponentes
    formatTitles(text) {
      if (!text) return ''
      return text.replace(/\n/g, '<br>')
    },
  },
}
</script>

<style scoped>
/* =========================================
   DEFINICIÓN DE PALETAS DE COLOR (Variables CSS)
   ========================================= */

/* Paleta A: Peach/Blue (Inspirada en Imagen 2) */
.theme-peach-blue {
  --bg-primary: #fdfbf9; /* Fondo claro */
  --accent-warm: #f4b19b; /* Color salmón/durazno */
  --accent-cool: #6b7cba; /* Azul medio */
  --text-dark: #2c3e50;
  --text-light: #ffffff;
  --shape-color-1: rgba(244, 177, 155, 0.4); /* Salmón transparente */
  --shape-color-2: rgba(107, 124, 186, 0.3); /* Azul transparente */
}

/* Paleta B: Purple/Pink (Inspirada en Imagen 3) */
.theme-purple-pink {
  --bg-primary: #f8f0fc;
  --accent-warm: #d53f8c; /* Rosa fuerte */
  --accent-cool: #805ad5; /* Morado */
  --text-dark: #44337a;
  --text-light: #ffffff;
  --shape-color-1: rgba(213, 63, 140, 0.3);
  --shape-color-2: rgba(128, 90, 213, 0.4);
}

/* Paleta C: Red/Orange (Inspirada en Imagen 4) */
.theme-red-orange {
  --bg-primary: #fffaf0;
  --accent-warm: #dd6b20; /* Naranja quemado */
  --accent-cool: #c53030; /* Rojo intenso */
  --text-dark: #742a2a;
  --text-light: #ffffff;
  --shape-color-1: rgba(221, 107, 32, 0.3);
  --shape-color-2: rgba(197, 48, 48, 0.4);
}

/* Paleta D: Blue/Orange (Inspirada en Imagen 5) */
.theme-blue-orange {
  --bg-primary: #ebf8ff;
  --accent-warm: #ff7e35; /* Naranja brillante */
  --accent-cool: #2b6cb0; /* Azul fuerte */
  --text-dark: #1a365d;
  --text-light: #ffffff;
  --shape-color-1: rgba(255, 126, 53, 0.3);
  --shape-color-2: rgba(43, 108, 176, 0.3);
}

/* =========================================
   ESTILOS DEL COMPONENTE
   ========================================= */

.event-card-container {
  width: 80%;
  margin: 0 auto;
  position: relative;
  background-color: var(--bg-primary);
  color: var(--text-dark);
  border-radius: 24px;
  overflow: hidden; /* Para cortar las formas abstractas */
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 2rem;
  /* Altura mínima para que se vea imponente */
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

/* --- Formas Abstractas de Fondo --- */
.abstract-shape {
  position: absolute;
  border-radius: 50%;
  z-index: 0; /* Detrás del contenido */
}

.shape-1 {
  top: -10%;
  right: -10%;
  width: 300px;
  height: 300px;
  background-color: var(--shape-color-1);
  filter: blur(40px);
}

.shape-2 {
  bottom: -15%;
  left: -5%;
  width: 400px;
  height: 400px;
  background-color: var(--shape-color-2);
  filter: blur(50px);
}

/* --- Header --- */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.main-logo {
  height: 50px;
  object-fit: contain;
}

.live-badge {
  background-color: var(--accent-cool);
  color: var(--text-light);
  font-weight: bold;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

/* --- Títulos --- */
.event-type {
  color: var(--accent-cool);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-family: sans-serif;
}

.main-title {
  font-size: 2.5rem;
  line-height: 1.1;
  font-weight: 800;
  /* Un degradado sutil en el texto del título principal */
  background: linear-gradient(45deg, var(--accent-cool), var(--accent-warm));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  /* Fuente estilo "script" o display si la tienes, si no, sans-serif bold */
  font-family: 'Montserrat', sans-serif; /* Asegúrate de tener una fuente bold cargada */
}

.subtitle {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-dark);
  opacity: 0.9;
}

/* --- Barra de Info --- */
.info-bar {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  background-color: var(--accent-warm);
  color: var(--text-light);
  padding: 0.75rem 1.5rem;
  border-radius: 50px; /* Forma de píldora */
  margin: 2rem auto;
  width: fit-content;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.info-item {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 0.95rem;
}

.info-item i {
  margin-right: 0.5rem;
}

.location-item {
  /* Separador visual si hay lugar */
  border-left: 2px solid rgba(255, 255, 255, 0.3);
  padding-left: 1rem;
}

/* --- Sección de Ponentes --- */
.speakers-section {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: auto; /* Empuja hacia abajo */
  margin-bottom: 2rem;
}

/* Layout para 2 o más ponentes */
.multi-speaker-layout {
  flex-wrap: wrap;
}

/* Layout para 1 solo ponente (más grande y centrado) */
.single-speaker-layout .speaker-card {
  flex-direction: row; /* Imagen a la izquierda, texto a la derecha */
  align-items: center;
  text-align: left;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  padding: 1.5rem;
  border-radius: 20px;
  max-width: 500px;
}

.single-speaker-layout .speaker-image-wrapper {
  width: 150px;
  height: 150px;
  margin-right: 1.5rem;
  margin-bottom: 0;
}

.single-speaker-layout .speaker-info {
  text-align: left;
}

/* Estilos generales de tarjeta de ponente */
.speaker-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.speaker-image-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  /* Borde colorido alrededor de la foto */
  padding: 4px;
  background: linear-gradient(to bottom, var(--accent-cool), var(--accent-warm));
  margin-bottom: 1rem;
}

.speaker-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--bg-primary); /* Pequeño borde blanco interno */
}

.speaker-name {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  color: var(--accent-cool);
}

.speaker-title {
  font-size: 0.85rem;
  opacity: 0.8;
  line-height: 1.3;
}

/* --- Footer --- */
.card-footer {
  text-align: center;
  font-weight: 700;
  color: var(--accent-cool);
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* --- Responsive --- */
@media (max-width: 640px) {
  .main-title {
    font-size: 1.8rem;
  }
  .info-bar {
    flex-direction: column;
    border-radius: 20px;
    gap: 0.5rem;
    width: 100%;
  }
  .location-item {
    border-left: none;
    padding-left: 0;
  }
  .single-speaker-layout .speaker-card {
    flex-direction: column;
    text-align: center;
  }
  .single-speaker-layout .speaker-image-wrapper {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  .single-speaker-layout .speaker-info {
    text-align: center;
  }
}
</style>
