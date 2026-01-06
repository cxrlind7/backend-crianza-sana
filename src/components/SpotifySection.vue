<template>
  <section class="spotify-section py-5" id="spotify-player-anchor">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-9 col-xl-8">
          <!-- Reduje un poco el ancho en pantallas grandes -->
          <div class="text-center mb-4">
            <h2 class="fw-bold mb-2 spotify-title">
              <i class="bi bi-spotify me-2"></i>Escúchanos en Spotify
            </h2>
            <p class="text-muted mb-0 small">Últimos episodios y contenidos exclusivos.</p>
          </div>

          <!-- REPRODUCTOR ACTIVO (Fijo arriba) -->
          <div
            class="active-player-wrapper mb-3 shadow-sm rounded-4 overflow-hidden"
            v-if="currentEpisodeId"
          >
            <iframe
              style="border-radius: 12px"
              :src="`https://open.spotify.com/embed/episode/${currentEpisodeId}?utm_source=generator&theme=0`"
              width="100%"
              height="152"
              frameBorder="0"
              allowfullscreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            >
            </iframe>
          </div>

          <!-- ESTADO DE CARGA -->
          <div v-if="loading" class="text-center py-4 text-muted small">
            <div class="spinner-border spinner-border-sm text-success mb-2" role="status"></div>
            <p class="mb-0">Cargando episodios...</p>
          </div>

          <!-- ESTADO DE ERROR -->
          <div v-else-if="error" class="text-center py-4 text-danger small">
            <i class="bi bi-exclamation-triangle-fill fs-5 mb-2"></i>
            <p class="mb-0">No se pudieron cargar los episodios.</p>
          </div>

          <!-- CONTENEDOR DE LA LISTA Y BOTÓN TOGGLE -->
          <div v-else>
            <!-- Botón Toggle -->
            <div class="text-center mb-3">
              <button class="btn btn-toggle-list btn-sm rounded-pill px-4" @click="toggleList">
                <span v-if="!showList"><i class="bi bi-list-ul me-2"></i>Ver más episodios</span>
                <span v-else><i class="bi bi-chevron-up me-2"></i>Ocultar lista</span>
              </button>
            </div>

            <!-- LISTA PERSONALIZADA (Con transición) -->
            <transition name="fade-slide">
              <div
                v-if="showList"
                class="custom-episode-list shadow-sm rounded-4 bg-white overflow-hidden"
              >
                <div
                  v-for="(episode, index) in episodes"
                  :key="episode.id"
                  class="episode-item d-flex align-items-center p-2 border-bottom"
                  :class="{ 'bg-selected': currentEpisodeId === episode.id }"
                  @click="playEpisode(episode.id)"
                >
                  <!-- Imagen del episodio (Más pequeña) -->
                  <img
                    :src="episode.images[2].url"
                    alt="Portada"
                    class="episode-img rounded-3 me-3"
                    width="48"
                    height="48"
                  />

                  <!-- Info del episodio (Más compacta) -->
                  <div class="episode-info flex-grow-1 pe-3 overflow-hidden">
                    <h6 class="episode-title mb-1 text-dark text-truncate">{{ episode.name }}</h6>
                    <div class="d-flex align-items-center text-muted extra-small">
                      <span class="me-2"
                        ><i class="bi bi-calendar3 me-1"></i
                        >{{ formatDate(episode.release_date) }}</span
                      >
                      <span
                        ><i class="bi bi-clock me-1"></i
                        >{{ formatDuration(episode.duration_ms) }} min</span
                      >
                    </div>
                    <!-- Descripción (Solo desktop y muy corta) -->
                    <p
                      class="episode-description text-muted mb-0 mt-1 d-none d-md-block text-truncate"
                    >
                      {{ episode.description }}
                    </p>
                  </div>

                  <!-- Botón de Play (Centrado y más pequeño) -->
                  <div class="play-btn-container ms-auto align-self-center">
                    <button class="btn btn-spotify-play rounded-circle shadow-sm">
                      <i
                        :class="
                          currentEpisodeId === episode.id
                            ? 'bi bi-bar-chart-fill'
                            : 'bi bi-play-fill'
                        "
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SpotifySectionCustom',
  data() {
    return {
      loading: true,
      error: false,
      episodes: [],
      currentEpisodeId: null,
      showList: false, // Nuevo estado para el toggle
      // Asegúrate de que esta URL apunte a tu servidor backend real
      backendUrl: 'https://backend-crianza-sana-production.up.railway.app/api/episodios',
    }
  },
  async mounted() {
    await this.fetchEpisodes()
  },
  methods: {
    async fetchEpisodes() {
      try {
        this.loading = true
        const response = await axios.get(this.backendUrl)
        this.episodes = response.data
        if (this.episodes.length > 0) {
          this.currentEpisodeId = this.episodes[0].id
        }
        this.loading = false
      } catch (err) {
        console.error('Error fetching episodes:', err)
        this.error = true
        this.loading = false
      }
    },
    playEpisode(id) {
      this.currentEpisodeId = id
      // Scroll suave hacia el reproductor principal
      document.getElementById('spotify-player-anchor').scrollIntoView({ behavior: 'smooth' })
    },
    toggleList() {
      this.showList = !this.showList
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('es-MX', options)
    },
    formatDuration(ms) {
      return Math.floor(ms / 60000)
    },
    // Ya no necesitamos truncateText porque usamos CSS text-truncate
  },
}
</script>

<style scoped>
.spotify-section {
  background-image: radial-gradient(circle at 50% 0%, rgba(29, 185, 84, 0.05) 0%, transparent 40%);
}

.spotify-title {
  color: #1db954;
  font-size: 1.75rem;
}

/* --- Estilos del Botón Toggle --- */
.btn-toggle-list {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #e9ecef;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.btn-toggle-list:hover {
  background-color: #e2e6ea;
  color: #1db954;
  border-color: #1db954;
}

/* --- MEJORAS EN LA LISTA (Compacta y Elegante) --- */
.custom-episode-list {
  border: 1px solid rgba(0, 0, 0, 0.04);
  max-height: 400px; /* Un poco más baja */
  overflow-y: auto;
}

/* Scrollbar fina */
.custom-episode-list::-webkit-scrollbar {
  width: 6px;
}
.custom-episode-list::-webkit-scrollbar-track {
  background: transparent;
}
.custom-episode-list::-webkit-scrollbar-thumb {
  background: #d1d1d1;
  border-radius: 4px;
}

.episode-item {
  transition: all 0.2s ease;
  cursor: pointer;
  /* Padding reducido (p-2 en el HTML) */
}

.episode-item:hover {
  background-color: #f1f3f5;
}

.bg-selected {
  background-color: rgba(29, 185, 84, 0.08) !important; /* Verde muy sutil para el activo */
}

.episode-item:last-child {
  border-bottom: none !important;
}

.episode-img {
  object-fit: cover;
  /* Tamaño reducido a 48x48 en el HTML */
}

.episode-title {
  font-size: 0.95rem;
  font-weight: 600;
}

.extra-small {
  font-size: 0.75rem;
}

.episode-description {
  font-size: 0.8rem;
  /* Usamos text-truncate de bootstrap en el HTML para cortar con "..." */
}

/* --- Botón de Play (Centrado y más pequeño) --- */
.play-btn-container {
  /* Asegura que el contenedor no se aplaste */
  flex-shrink: 0;
}

.btn-spotify-play {
  width: 38px; /* Más pequeño */
  height: 38px;
  background-color: #1db954;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem; /* Icono más pequeño */
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  padding-left: 3px; /* Ajuste óptico */
}

.btn-spotify-play:hover {
  background-color: #1ed760;
  transform: scale(1.1);
}

.btn-spotify-play i.bi-bar-chart-fill {
  margin-left: -2px;
  font-size: 1rem;
}

/* --- Transición para el Toggle --- */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
  max-height: 400px; /* Debe coincidir con el max-height de la lista */
  opacity: 1;
  overflow: hidden;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  border: none;
}
</style>
