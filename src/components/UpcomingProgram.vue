<template>
  <!--
    IMPORTANTE: Para probar el diseño si no tienes eventos futuros,
    cambia temporalmente la siguiente línea a: <section v-if="programa" ...>
  -->
  <h2 v-if="programa && isUpcoming" class="section-title">Próximo Programa</h2>
  <section
    v-if="programa && isUpcoming"
    class="broadcast-container"
    :style="{
      '--bg-primary': colors.primario || '#4a1a1a',
      '--accent-gold': colors.secundario || '#fcd34d',
      '--text-light': colors.titulo || '#ffffff',
    }"
  >
    <div class="content-wrapper container">
      <!-- HEADER: Logos Superiores y Título Principal -->
      <header class="header-section mb-4">
        <!-- Se modificó el contenedor para usar flex y centrar los logos -->
        <div
          class="logos-top d-flex align-items-center justify-content-center flex-wrap gap-3 mb-3"
        >
          <img src="../assets/csbdk.png" alt="Logo CSBDK" class="main-logo" />
          <!-- NUEVOS LOGOS SUPERIORES (Reemplaza las rutas src) -->
          <!-- <img
            src="../assets/vitafix.png"
            alt="Logo Vitafix"
            class="secondary-logo d-none d-md-block"
          />
          <img
            src="../assets/dkids-academy.png"
            alt="Logo D-Kids Academy"
            class="secondary-logo d-none d-md-block"
          /> -->
        </div>
        <h1 class="main-headline text-center">
          <span v-html="currentTema.name"></span>
        </h1>
      </header>

      <!-- SECCIÓN DE PRESENTADORAS -->
      <div class="presenters-section row justify-content-center gx-lg-4">
        <!-- Presentadora Fija (Izquierda) -->
        <div class="col-12 col-md-5 text-center presenter-col mb-3 mb-md-0">
          <div class="image-glow-ring">
            <img :src="fixedItem.image" :alt="fixedItem.name" class="presenter-photo" />
          </div>
          <h3 class="presenter-name">{{ fixedItem.name }}</h3>
          <h4 class="presenter-role">Presentadora</h4>
        </div>

        <!-- Presentador/a Rotativo/a (Derecha) -->
        <div class="col-12 col-md-5 text-center presenter-col">
          <div class="image-glow-ring">
            <img
              :key="currentItem.image"
              :src="currentItem.image"
              :alt="currentItem.name"
              class="presenter-photo"
            />
          </div>
          <h3 class="presenter-name">{{ currentItem.name }}</h3>
          <h4 class="presenter-role">{{ currentItem.title }}</h4>
        </div>
      </div>
    </div>

    <!-- FOOTER: Banner de Fecha y Logos Inferiores -->
    <footer class="footer-section">
      <div
        class="container-fluid p-0 d-flex align-items-end justify-content-between position-relative footer-content"
      >
        <!-- Banner Dorado de Fecha (Izquierda) -->
        <div class="date-banner">
          <div class="banner-content d-flex align-items-center">
            <div class="date-big me-3">{{ eventInfo.day }}</div>
            <div class="date-small me-4">
              <span class="d-block font-weight-bold">{{ eventInfo.month }}</span>
              <span class="d-block">{{ eventInfo.year }}</span>
            </div>
            <div class="vertical-separator me-4"></div>
            <div class="time-info">
              <div class="time-text">{{ eventInfo.time }}</div>
              <div class="sintoniza-text">{{ eventInfo.message }}</div>
            </div>
          </div>
        </div>

        <!-- NUEVO LOGO CENTRAL INFERIOR (CFID) -->
        <div class="middle-logo-container mx-3 mb-2 d-none d-md-block">
          <!-- Reemplaza la ruta src -->
          <!-- <img src="../assets/cfid.png" alt="Logo CFID" class="middle-logo" /> -->
        </div>

        <!-- Logo Inferior Derecho (+pop) -->
        <div class="bottom-logo-container pe-4 pe-md-5 mb-2">
          <img src="/public/+pop.png" alt="Logo +Pop" class="bottom-logo" />
        </div>
      </div>
    </footer>
  </section>
</template>

<script>
import people from '../../data'
import { getPrograms } from '../composables/useFirestore'

export default {
  name: 'UpcomingProgramBroadcastStyle',
  data() {
    return {
      programa: null,
      currentIndex: 1,
      intervalId: null,
    }
  },
  computed: {
    temas() {
      return this.programa?.temas || []
    },
    eventInfo() {
      if (!this.programa?.evento) return {}
      const fechaStr = this.programa.evento.fecha
      const dateStrFormatted = fechaStr.includes('T') ? fechaStr : `${fechaStr}T00:00:00`
      const date = new Date(dateStrFormatted)

      if (isNaN(date.getTime())) {
        return { message: '', time: '', day: '--', month: '-', year: '----' }
      }

      const day = date.getDate().toString().padStart(2, '0')
      const month = date.toLocaleString('es-ES', { month: 'short' }).replace('.', '').toUpperCase()
      const year = date.getFullYear()

      return {
        message: this.programa.evento.mensaje || 'Sintonízanos',
        time: this.programa.evento.hora,
        day,
        month,
        year,
      }
    },
    colors() {
      return this.programa?.colores || {}
    },
    items() {
      if (!this.programa?.participantes) return []
      return this.programa.participantes
        .map((id) => people.find((person) => person.id === id))
        .filter(Boolean)
    },
    fixedItem() {
      return this.items[0] || { name: 'Cargando...', image: '', title: '' }
    },
    currentItem() {
      return this.items[this.currentIndex] || { name: 'Cargando...', image: '', title: '' }
    },
    currentTema() {
      if (this.temas.length === 0) return { name: 'Próximamente' }
      const temaIndex = (this.currentIndex - 1) % this.temas.length
      return { name: this.temas[temaIndex] }
    },
    isUpcoming() {
      if (!this.programa?.evento?.fecha) return false

      // Extraer solo la fecha (sin hora) del evento
      const programDateStr = this.programa.evento.fecha.split('T')[0]
      const [year, month, day] = programDateStr.split('-')

      // Crear fecha del programa a medianoche
      const programDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      programDate.setHours(0, 0, 0, 0)

      // Crear fecha de hoy a medianoche
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // CAMBIO CLAVE: >= en lugar de > para incluir HOY
      return programDate.getTime() >= today.getTime()
    },
  },
  methods: {
    async loadPrograma() {
      try {
        const programas = await getPrograms()
        if (programas && programas.length > 0) {
          this.programa = programas[0]
          console.log('✅ Programa cargado:', this.programa)
          console.log('📅 Fecha del evento:', this.programa.evento?.fecha)
          console.log('🔍 isUpcoming:', this.isUpcoming)

          if (this.items.length > 2) {
            this.startRotation()
          }
        }
      } catch (error) {
        console.error('❌ Error al cargar el programa:', error)
      }
    },
    switchContent() {
      const rotatableItemsCount = this.items.length - 1
      if (rotatableItemsCount <= 0) return
      let nextRelativeIndex = (this.currentIndex - 1 + 1) % rotatableItemsCount
      this.currentIndex = nextRelativeIndex + 1
    },
    startRotation() {
      if (this.intervalId) clearInterval(this.intervalId)
      this.intervalId = setInterval(this.switchContent, 3000)
    },
  },
  mounted() {
    this.loadPrograma()
  },
  beforeUnmount() {
    if (this.intervalId) clearInterval(this.intervalId)
  },
}
</script>

<style scoped>
.section-title {
  text-align: center;
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 10px;
  padding: 0 20px;
  margin-bottom: 2rem;
}
.broadcast-container {
  font-family: 'Montserrat', 'Segoe UI', Roboto, sans-serif;
  position: relative;
  width: 70%;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 2rem;
  overflow: hidden;
  background-color: var(--bg-primary);
  background-image: radial-gradient(
    circle at 50% 30%,
    rgba(255, 255, 255, 0.15) 0%,
    var(--bg-primary) 70%
  );
  color: var(--text-light);
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
}

.content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* --- Header --- */
.main-logo {
  max-width: 160px; /* Ajustado ligeramente */
  height: auto;
}

/* Estilos para los nuevos logos secundarios en desktop */
.secondary-logo {
  max-width: 130px;
  height: auto;
}

.main-headline {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-light);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-top: 0.5rem;
}

.main-headline ::v-deep span {
  color: inherit;
}

/* --- Presentadoras --- */
.presenter-col {
  z-index: 2;
}

.image-glow-ring {
  display: inline-block;
  border-radius: 50%;
  padding: 6px;
  border: 4px solid var(--accent-gold);
  box-shadow: 0 0 20px rgba(var(--accent-gold), 0.4);
  background-color: rgba(0, 0, 0, 0.2);
  margin-bottom: 0.5rem;
}

.presenter-photo {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

.presenter-name {
  color: var(--accent-gold);
  font-size: 1.4rem;
  font-weight: 700;
  margin-top: 0.5rem;
  margin-bottom: 0.2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.presenter-role {
  color: var(--text-light);
  font-size: 1rem;
  font-weight: 400;
  opacity: 0.9;
}

/* --- Footer y Banner --- */
.footer-section {
  margin-top: auto;
  position: relative;
  min-height: auto;
  padding-bottom: 1rem;
}

.footer-content {
  /* Se asegura que los elementos del footer se alineen abajo */
  align-items: flex-end !important;
}

.date-banner {
  background-color: var(--accent-gold);
  color: #2c3e50;
  padding: 1rem 2rem 1rem 3rem;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
  min-width: 35%; /* Reducido ligeramente para dar espacio al logo central */
}

.date-big {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
}

.date-small {
  font-size: 1.1rem;
  text-transform: uppercase;
  line-height: 1.1;
}

.vertical-separator {
  width: 3px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.15);
}

.time-text {
  font-size: 1.6rem;
  font-weight: 800;
}

.sintoniza-text {
  font-size: 1rem;
  font-weight: 600;
}

/* Estilos para el nuevo logo central del footer */
.middle-logo {
  max-width: 90px;
  height: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.bottom-logo-container {
  z-index: 2;
}

.bottom-logo {
  max-width: 140px;
  height: auto;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
}

/* --- Responsividad: Diseño Móvil COMPACTO con Imágenes Grandes --- */
@media (max-width: 768px) {
  .broadcast-container {
    width: 95%;
    margin: 0.3rem auto;
    height: auto;
    min-height: auto;
    max-height: none;
    border-radius: 12px;
    padding: 0.8rem 0.5rem 0.5rem 0.5rem;
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1rem;
  }

  .content-wrapper {
    flex: 0 1 auto;
    display: block;
    justify-content: center;
    padding: 0;
  }

  /* Header Compacto Móvil */
  .header-section {
    margin-bottom: 0.5rem;
    text-align: center;
  }

  /* En móvil, ocultamos los logos secundarios para ahorrar espacio,
     como suele hacerse en diseños responsivos, o se pueden hacer más pequeños.
     Por ahora, el CSS los oculta con d-none d-md-block en el HTML.
     Si los quieres en móvil, quita esa clase y ajusta el tamaño aquí: */
  .main-logo {
    max-width: 100px;
  }

  .main-headline {
    font-size: 1.1rem;
    line-height: 1.2;
    padding: 0 0.5rem;
    margin-top: 0.2rem;
  }

  /* Presentadoras en Fila Compacta con Imágenes MÁS GRANDES */
  .presenters-section {
    flex-direction: row !important;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    margin-bottom: 0.5rem;
  }

  .presenter-col {
    flex: 0 1 auto;
    width: auto;
    max-width: 48%;
    margin-bottom: 0 !important;
  }

  .image-glow-ring {
    padding: 3px;
    border-width: 3px;
    margin-bottom: 0.3rem;
  }

  .presenter-photo {
    width: 110px;
    height: 110px;
  }

  .presenter-name {
    font-size: 0.85rem;
    margin-top: 0.2rem;
    margin-bottom: 0.1rem;
    line-height: 1.1;
  }

  .presenter-role {
    font-size: 0.7rem;
    line-height: 1.1;
  }

  /* Footer Compacto Móvil */
  .footer-section {
    padding-bottom: 0;
    margin-top: 0.5rem;
  }

  .footer-content {
    flex-direction: column;
    align-items: center !important;
    width: 100%;
  }

  .date-banner {
    width: 100%;
    min-width: auto;
    padding-top: 1rem;
    border-radius: 8px;
    padding: 0.5rem 0.5rem;
    margin-bottom: 0.3rem;
    display: flex;
    justify-content: center;
  }

  .banner-content {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
  }

  .date-big {
    font-size: 2rem;
    margin-right: 0.3rem !important;
  }

  .date-small {
    font-size: 0.75rem;
    margin-right: 0.5rem !important;
  }

  .vertical-separator {
    height: 30px;
    width: 2px;
    margin-right: 0.5rem !important;
    display: block;
  }

  .time-info {
    text-align: left;
  }

  .time-text {
    font-size: 1rem;
    line-height: 1.1;
  }

  .sintoniza-text {
    font-size: 0.7rem;
    white-space: nowrap;
    line-height: 1.1;
  }

  /* En móvil, el logo central también se oculta para no saturar.
     Si se desea mostrar, quitar d-none d-md-block del HTML y ajustar aquí. */

  .bottom-logo-container {
    padding-right: 0 !important;
    margin-bottom: 0.2rem;
  }

  .bottom-logo {
    max-width: 75px;
  }
}
</style>
