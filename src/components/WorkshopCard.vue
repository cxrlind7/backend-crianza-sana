<template>
  <section class="upcoming-events-section">
    <div class="container-fluid main-container">
      <!-- 1. Título de la Sección (Fijo) -->
      <div class="text-center mb-4 fade-in">
        <h2 class="section-title">Próximos Eventos</h2>
        <p class="section-subtitle">Talleres y conferencias para el cuidado de nuestros niños.</p>
      </div>

      <!-- Se usa :key para forzar a Vue a reactualizar esta sección cuando cambia el índice -->
      <div :key="currentEventIndex" class="fade-in-cycle">
        <!-- 2. Contenedor de la Imagen (Dinámico) -->
        <div class="image-container text-center delay-1">
          <!-- Usamos :src y :alt dinámicos basados en el evento actual -->
          <img :src="currentEvent.imageSrc" :alt="currentEvent.altText" class="flyer-image" />
        </div>

        <!-- 3. Botón de Registro (Dinámico) -->
        <div class="cta-container text-center delay-2">
          <a
            :href="whatsappLink"
            target="_blank"
            rel="noopener noreferrer"
            class="whatsapp-register-btn"
          >
            <i class="fab fa-whatsapp icon-wa"></i>
            <!-- Texto del botón dinámico -->
            {{ currentEvent.buttonText }}
          </a>
          <p class="cta-small-text mt-3 text-muted">Haz clic para abrir el chat directo.</p>
        </div>
      </div>

      <!-- Indicadores opcionales (puntitos) para saber qué evento es -->
      <div class="text-center mt-3">
        <span
          v-for="(event, index) in events"
          :key="index"
          class="indicator-dot"
          :class="{ active: index === currentEventIndex }"
          @click="manualChange(index)"
        ></span>
      </div>
    </div>
  </section>
</template>

<script>
import flyerWorkshop2 from '@/assets/images/flyer-workshop2.png'
import restart2 from '@/assets/images/restart2.png'

export default {
  name: 'UpcomingEventsRotator',
  data() {
    return {
      currentEventIndex: 0, // Empieza mostrando el primer evento
      timer: null, // Variable para guardar el identificador del intervalo
      events: [
        // --- EVENTO 1: El Nuevo (Workshop) ---
        {
          altText: 'Workshop Salvando Pulpitas - Dra. Patricia Peña',
          // Usamos require para asegurar que Webpack procese la ruta dinámica
          imageSrc: flyerWorkshop2,
          phone: '526188002379',
          message:
            'Hola, estoy interesado/a en inscribirme al Workshop "Salvando Pulpitas" de la Dra. Patricia Peña. ¿Me podrían dar más información?',
          buttonText: 'Regístrate al Workshop vía WhatsApp',
        },
        // --- EVENTO 2: El Viejito (Reto Reiníciate) ---
        {
          altText: 'Reto Reiniciate 2026',
          imageSrc: restart2,
          phone: '526182692637',
          message:
            'Hola, estoy interesado/a en inscribirme al "RETO REINÍCIATE 2026" de 8 semanas. ¿Me podrían dar más información sobre el proceso de registro?',
          buttonText: 'Regístrate al Reto vía WhatsApp',
        },
      ],
    }
  },
  computed: {
    // Ayudante para obtener los datos del evento que se muestra actualmente
    currentEvent() {
      return this.events[this.currentEventIndex]
    },
    // Genera el link dinámicamente basado en el evento actual
    whatsappLink() {
      const encodedMessage = encodeURIComponent(this.currentEvent.message)
      return `https://wa.me/${this.currentEvent.phone}?text=${encodedMessage}`
    },
  },
  mounted() {
    // Cuando el componente se monta, iniciamos el temporizador
    this.startRotation()
  },
  beforeUnmount() {
    // IMPORTANTE: Limpiar el temporizador cuando el componente se destruye
    // para evitar fugas de memoria. (Usa 'destroyed()' si estás en Vue 2)
    clearInterval(this.timer)
  },
  methods: {
    startRotation() {
      // Establece el intervalo de 10 segundos (10000 ms)
      this.timer = setInterval(() => {
        this.nextEvent()
      }, 10000)
    },
    nextEvent() {
      // Calcula el siguiente índice. El operador % (módulo) hace que
      // cuando llegue al final (índice 1), vuelva al principio (índice 0).
      this.currentEventIndex = (this.currentEventIndex + 1) % this.events.length
    },
    // Opcional: si quieres que al hacer clic en los puntitos se reinicie el timer
    manualChange(index) {
      this.currentEventIndex = index
      clearInterval(this.timer) // Pausa el automático
      this.startRotation() // Reinicia el automático
    },
  },
}
</script>

<style scoped>
/* TUS ESTILOS ORIGINALES SE MANTIENEN IGUAL */
.upcoming-events-section {
  padding: 50px 0;
  background-color: transparent;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.main-container {
  max-width: 1000px;
  padding-left: 5%;
  padding-right: 5%;
}

.section-title {
  text-align: center;
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 10px;
  padding: 0 20px;
}

.section-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
}

.image-container {
  margin-bottom: 30px;
}

.flyer-image {
  width: auto;
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.cta-container {
  margin-top: 20px;
}

.whatsapp-register-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #25d366, #128c7e);
  color: white;
  padding: 16px 32px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(37, 211, 102, 0.25);
}

.whatsapp-register-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(37, 211, 102, 0.4);
  filter: brightness(1.05);
  color: white;
}

.icon-wa {
  font-size: 1.4rem;
  margin-right: 10px;
}

.cta-small-text {
  font-size: 0.9rem;
}

/* Animaciones Originales (Solo para la carga inicial) */
.fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease-out forwards;
}
.delay-1 {
  animation-delay: 0.2s;
}
.delay-2 {
  animation-delay: 0.4s;
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

/* NUEVOS ESTILOS PARA LA ROTACIÓN */

/* Una animación suave cada vez que cambia el ciclo */
.fade-in-cycle {
  animation: fadeInCycle 1s ease-out;
}

@keyframes fadeInCycle {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}

/* Estilos para los puntitos indicadores (opcional) */
.indicator-dot {
  height: 10px;
  width: 10px;
  margin: 0 5px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.indicator-dot.active {
  background-color: #128c7e; /* Color de WhatsApp */
  width: 12px;
  height: 12px;
}

@media (max-width: 768px) {
  .upcoming-events-section {
    padding: 30px 0;
  }
  .flyer-image {
    max-height: 70vh;
    border-radius: 15px;
  }
  .whatsapp-register-btn {
    width: 100%;
    max-width: 350px;
    font-size: 1rem;
    padding: 14px 24px;
  }
  .cta-container {
    margin-top: 15px;
  }
}
</style>
