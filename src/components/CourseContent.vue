<template>
  <div class="course-dashboard-content">
    <div class="row">
      <!-- Columna Principal: Reproductor / Visor -->
      <div class="col-lg-8 mb-4">
        <div
          class="video-player-container ratio ratio-16x9 rounded-3 overflow-hidden shadow-lg mb-3"
        >
          <iframe
            :src="`https://www.youtube.com/embed/${activeContent.videoId}?rel=0&modestbranding=1`"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            v-if="activeContent.type === 'video'"
          ></iframe>

          <!-- Placeholder para archivos -->
          <div
            v-else
            class="d-flex flex-column align-items-center justify-content-center bg-light-blue h-100 text-muted p-5"
          >
            <!-- Icono cian -->
            <i :class="['bi display-1 mb-3 text-cyan', getIconForType(activeContent.type)]"></i>
            <h3 class="text-dark">Material Descargable</h3>
            <p>Haz clic abajo para obtener el archivo.</p>
            <!-- Botón outline cian -->
            <a
              :href="activeContent.url"
              class="btn btn-outline-cyan mt-3 px-4 py-2 fw-bold"
              target="_blank"
            >
              <i class="bi bi-download me-2"></i> Descargar {{ activeContent.format }}
            </a>
          </div>
        </div>
        <!-- Título cian -->
        <h3 class="fw-bold text-cyan">{{ activeContent.title }}</h3>
      </div>

      <!-- Columna Lateral: Lista de Contenidos -->
      <div class="col-lg-4">
        <div class="content-list-card p-3 rounded-3">
          <h5 class="mb-3 fw-bold px-2 text-dark">Módulos del Curso</h5>
          <div class="list-group list-group-flush rounded-3 overflow-hidden">
            <button
              v-for="(item, index) in course.content"
              :key="index"
              :class="[
                'list-group-item list-group-item-action d-flex align-items-center p-3 border-0',
                { 'active-item': activeIndex === index },
              ]"
              @click="setActiveContent(index)"
            >
              <i
                :class="[
                  'me-3 fs-5',
                  getIconForType(item.type),
                  // Icono cian si no está activo, oscuro si está activo
                  activeIndex === index ? 'text-white' : 'text-cyan',
                ]"
              ></i>
              <div class="flex-grow-1">
                <h6 class="m-0 fw-bold">{{ item.title }}</h6>
                <small :class="activeIndex === index ? 'text-white-50' : 'text-muted'">
                  {{ item.duration || item.format }}
                </small>
              </div>
              <i
                class="bi bi-play-fill fs-4 ms-2"
                v-if="activeIndex === index && item.type === 'video'"
              ></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['course'],
  data() {
    return {
      activeIndex: 0,
    }
  },
  computed: {
    activeContent() {
      return this.course.content[this.activeIndex]
    },
  },
  methods: {
    setActiveContent(index) {
      this.activeIndex = index
      if (window.innerWidth < 992) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    getIconForType(type) {
      switch (type) {
        case 'video':
          return 'bi bi-play-circle-fill'
        case 'file':
          return 'bi bi-file-earmark-text-fill'
        default:
          return 'bi bi-file-earmark'
      }
    },
  },
}
</script>

<style scoped>
.text-cyan {
  color: var(--accent-cyan) !important;
}
.bg-light-blue {
  background-color: #f0f9ff;
}

.video-player-container {
  background-color: #000;
  /* Borde cian sutil */
  border: 1px solid rgba(6, 182, 212, 0.2);
}

.content-list-card {
  background-color: #ffffff;
  border: 1px solid rgba(6, 182, 212, 0.1);
  max-height: 600px;
  overflow-y: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.list-group-item {
  background-color: transparent;
  color: #333;
  transition: all 0.2s;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}
.list-group-item:hover {
  background-color: rgba(6, 182, 212, 0.05);
}

/* Estado activo: Fondo cian, texto blanco */
.active-item {
  background-color: var(--accent-cyan) !important;
  color: #fff !important;
}
.active-item .text-white-50 {
  color: rgba(255, 255, 255, 0.8) !important;
}

/* Botón outline cian */
.btn-outline-cyan {
  color: var(--accent-cyan);
  border-color: var(--accent-cyan);
}
.btn-outline-cyan:hover {
  background-color: var(--accent-cyan);
  color: #fff;
}

/* Scrollbar cian */
.content-list-card::-webkit-scrollbar {
  width: 8px;
}
.content-list-card::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}
.content-list-card::-webkit-scrollbar-thumb {
  background: var(--accent-cyan);
  border-radius: 4px;
}
</style>
