<template>
  <div class="person-downloads-section" v-if="files && files.length">
    <div class="container-fluid main-container">
      <!-- Título de la sección -->
      <div class="text-center mb-5 fade-in">
        <h6 class="text-uppercase letter-spacing-2 text-muted mb-2">Recursos Útiles</h6>
        <h2 class="display-6 fw-bold text-dark">Material Descargable</h2>
      </div>

      <!-- Card Blanca con sombra -->
      <div class="downloads-wrapper fade-in delay-1">
        <div class="list-group list-group-flush">
          <div
            v-for="(file, index) in files"
            :key="index"
            @click="openPreview(file)"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3 cursor-pointer"
            :style="{ '--accent-color': personColor }"
          >
            <div class="d-flex align-items-center">
              <i class="fas fa-file-pdf me-3 file-icon" :style="{ color: personColor }"></i>
              <span class="file-name">{{ file.name }}</span>
            </div>
            <div class="d-flex align-items-center">
              <i class="fas fa-eye text-muted me-3 view-icon" title="Vista previa"></i>
              <a
                :href="file.url"
                target="_blank"
                @click.stop
                class="text-muted download-link"
                title="Descargar"
              >
                <i class="fas fa-download download-icon"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Vista Previa -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showModal" class="modal-overlay" @click="closePreview">
          <div class="modal-content-custom" @click.stop>
            <button class="close-btn" @click="closePreview">
              <i class="fas fa-times"></i>
            </button>
            <div class="iframe-container">
              <iframe
                :src="currentFileUrl"
                width="100%"
                height="100%"
                frameborder="0"
                allow="autoplay"
              ></iframe>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script>
export default {
  name: 'PersonDownloads',
  props: {
    files: {
      type: Array,
      default: () => [],
    },
    personColor: {
      type: String,
      default: '#0d6efd',
    },
  },
  data() {
    return {
      showModal: false,
      currentFileUrl: '',
    }
  },
  methods: {
    openPreview(file) {
      this.currentFileUrl = this.getPreviewUrl(file.url)
      // Verificamos si se pudo generar una URL válida
      if (this.currentFileUrl) {
        this.showModal = true
        document.body.style.overflow = 'hidden' // Evitar scroll del fondo
      } else {
        // Opcional: Manejar el caso donde no se puede previsualizar
        console.warn('No se puede previsualizar este tipo de archivo o la URL es inválida.')
        // Podrías abrirlo en una pestaña nueva como fallback:
        window.open(file.url, '_blank')
      }
    },
    closePreview() {
      this.showModal = false
      this.currentFileUrl = ''
      document.body.style.overflow = '' // Restaurar scroll
    },
    getPreviewUrl(url) {
      if (!url) return ''

      // --- Lógica corregida para Google Drive ---
      if (url.includes('drive.google.com')) {
        try {
          // 1. Usamos el objeto URL para limpiar parámetros de forma segura
          const urlObj = new URL(url)
          // Nos quedamos solo con el origen y la ruta base (sin query params como ?usp=sharing)
          let cleanPath = urlObj.origin + urlObj.pathname

          // 2. Normalizamos la ruta: quitamos '/view' o barras finales si existen
          // Esto convierte ".../file/d/ID/view" o ".../file/d/ID/" en ".../file/d/ID"
          cleanPath = cleanPath.replace(/\/view\/?$/, '').replace(/\/$/, '')

          // 3. Añadimos '/preview' al final para obtener el formato de embed correcto
          return `${cleanPath}/preview`
        } catch (e) {
          console.error('Error al procesar URL de Drive:', e)
          return url // Fallback en caso de error extraño en la URL
        }
      }

      // --- Lógica para otros archivos (PDFs directos, imágenes, etc.) ---
      // Si el navegador puede renderizarlo nativamente, devolver la URL tal cual.
      // Nota: Algunos navegadores pueden bloquear la incrustación de ciertos sitios por cabeceras X-Frame-Options.
      return url
    },
  },
}
</script>

<style scoped>
.person-downloads-section {
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
.downloads-wrapper {
  background: #ffffff;
  border-radius: 24px;
  padding: 20px;
  box-shadow:
    0 20px 40px rgba(50, 50, 93, 0.08),
    0 10px 20px rgba(0, 0, 0, 0.05) !important;
}

.list-group-item {
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  border-radius: 12px;
  margin-bottom: 5px;
}

.list-group-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.list-group-item:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
}

.cursor-pointer {
  cursor: pointer;
}

.file-icon {
  font-size: 1.5rem;
}

.file-name {
  font-weight: 600;
  color: #2c3e50;
}

/* Iconos de acción */
.view-icon,
.download-icon {
  transition: all 0.2s;
}

.list-group-item:hover .view-icon {
  color: var(--accent-color) !important;
}

.list-group-item:hover .download-icon {
  color: #6c757d;
}

.download-link:hover .download-icon {
  color: var(--accent-color) !important;
}

/* --- Modal Styles Corregidos --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999; /* Z-index muy alto para estar sobre todo */
  backdrop-filter: blur(8px);
  padding: 20px;
}

.modal-content-custom {
  width: 100%;
  max-width: 1000px;
  height: 85vh;
  background: white;
  border-radius: 16px;
  position: relative;
  /* Mantenemos hidden aquí para que nada se salga de las esquinas redondeadas */
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px; /* Reverted to right */
  background: #ffffff; /* Fully opaque to hide the underlying button */
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  z-index: 20; /* Aumentado z-index para asegurar que esté sobre el iframe */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  color: #333;
}

.close-btn:hover {
  background: #ffffff;
  transform: scale(1.1);
  color: #dc3545;
}

.iframe-container {
  width: 100%;
  /* --- FIX: Usar flex: 1 en lugar de height: 100% --- */
  /* Esto hace que llene el espacio vertical disponible exactamente */
  flex: 1;
  height: auto;
  background: #f3f4f6;
  position: relative;
  /* --- FIX: Asegurar que el contenedor del iframe no desborde --- */
  overflow: hidden;
  display: flex; /* Para centrar el iframe si fuera necesario */
}

/* --- FIX: Asegurar que el iframe llene su contenedor --- */
.iframe-container iframe {
  width: 100%;
  height: 100%;
  border: none;
  /* El iframe manejará su propio scroll interno si el contenido es muy grande */
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

/* Transición del Modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
