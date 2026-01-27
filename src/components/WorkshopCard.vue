<template>
  <section class="upcoming-events-section">
    <div class="container-fluid main-container">
      <div class="text-center mb-4 fade-in">
        <h2 class="section-title">Próximos Eventos</h2>
        <p class="section-subtitle">Talleres y conferencias para el cuidado de nuestros niños.</p>
      </div>

      <div :key="currentEventIndex" class="fade-in-cycle">
        <div class="image-container text-center delay-1">
          <img :src="currentEvent.imageSrc" :alt="currentEvent.altText" class="flyer-image" />
        </div>

        <div class="cta-container text-center delay-2">
          <a
            :href="actionLink"
            @click="handleBtnClick($event)"
            target="_blank"
            rel="noopener noreferrer"
            class="register-btn"
            :class="{
              'btn-whatsapp': currentEvent.type === 'whatsapp',
              'btn-phone': currentEvent.type === 'call',
            }"
          >
            <i :class="actionIcon" class="icon-btn"></i>

            {{ currentEvent.buttonText }}
          </a>

          <p class="cta-small-text mt-3 text-muted">
            {{ helpText }}
          </p>
        </div>
      </div>

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

    <transition name="toast-fade">
      <div v-if="showToast" class="toast-notification">
        <i class="fas fa-check-circle toast-icon"></i>
        <span>Número copiado al portapapeles</span>
      </div>
    </transition>
  </section>
</template>

<script>
import flyerWorkshop2 from '@/assets/images/flyer-workshop2.png'
import restart2 from '@/assets/images/restart2.png'
import neuro from '@/assets/images/neuro.png'

export default {
  name: 'UpcomingEventsRotator',
  data() {
    return {
      currentEventIndex: 0,
      timer: null,
      showToast: false, // Variable para controlar el Toast
      events: [
        // {
        //   type: 'whatsapp',
        //   altText: 'Workshop Salvando Pulpitas - Dra. Patricia Peña',
        //   imageSrc: flyerWorkshop2,
        //   phone: '526188002379',
        //   message: 'Hola, estoy interesado/a en inscribirme al Workshop "Salvando Pulpitas"...',
        //   buttonText: 'Regístrate vía WhatsApp',
        // },
        // {
        //   type: 'whatsapp',
        //   altText: 'Reto Reiniciate 2026',
        //   imageSrc: restart2,
        //   phone: '526182692637',
        //   message: 'Hola, estoy interesado/a en inscribirme al "RETO REINÍCIATE 2026"...',
        //   buttonText: 'Regístrate vía WhatsApp',
        // },
        {
          type: 'call',
          altText: 'NeuroKids Center Durango - Desarrollo Cognitivo',
          imageSrc: neuro,
          phone: '6181072514',
          message: '',
          buttonText: 'Llamar para Cita',
        },
      ],
    }
  },
  computed: {
    currentEvent() {
      return this.events[this.currentEventIndex]
    },
    actionIcon() {
      return this.currentEvent.type === 'whatsapp' ? 'fab fa-whatsapp' : 'fas fa-phone'
    },
    helpText() {
      if (this.currentEvent.type === 'call') {
        return 'Da clic para llamar o copiar número.'
      }
      return 'Haz clic para abrir el chat directo.'
    },
    actionLink() {
      if (this.currentEvent.type === 'whatsapp') {
        const encodedMessage = encodeURIComponent(this.currentEvent.message)
        return `https://wa.me/${this.currentEvent.phone}?text=${encodedMessage}`
      } else {
        return `tel:${this.currentEvent.phone}`
      }
    },
  },
  mounted() {
    this.startRotation()
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  methods: {
    startRotation() {
      this.timer = setInterval(() => {
        this.nextEvent()
      }, 10000)
    },
    nextEvent() {
      this.currentEventIndex = (this.currentEventIndex + 1) % this.events.length
    },
    manualChange(index) {
      this.currentEventIndex = index
      clearInterval(this.timer)
      this.startRotation()
    },
    handleBtnClick(event) {
      if (this.currentEvent.type === 'whatsapp') return

      if (this.currentEvent.type === 'call') {
        // Si es PC (pantalla grande), copiamos y mostramos Toast
        if (window.innerWidth > 768) {
          event.preventDefault()

          const numberToCopy = this.currentEvent.phone

          navigator.clipboard
            .writeText(numberToCopy)
            .then(() => {
              // ACTIVAR TOAST AQUÍ
              this.showToast = true
              setTimeout(() => {
                this.showToast = false
              }, 3000)
            })
            .catch((err) => {
              console.error('Error al copiar: ', err)
            })
        }
      }
    },
  },
}
</script>

<style scoped>
/* ESTILOS PREVIOS SE MANTIENEN IGUAL */
.upcoming-events-section {
  padding: 50px 0;
  background-color: transparent;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  /* Importante para que el Toast fijo se posicione relativo a la ventana si se desea,
     pero si quieres que sea global, position fixed funciona bien */
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
}

.section-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 40px;
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

.register-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 16px 32px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-whatsapp {
  background: linear-gradient(45deg, #25d366, #128c7e);
  box-shadow: 0 10px 20px rgba(37, 211, 102, 0.25);
}
.btn-whatsapp:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(37, 211, 102, 0.4);
  filter: brightness(1.05);
}

.btn-phone {
  background: linear-gradient(45deg, #3498db, #2980b9);
  box-shadow: 0 10px 20px rgba(52, 152, 219, 0.25);
}
.btn-phone:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(52, 152, 219, 0.4);
  filter: brightness(1.05);
}

.icon-btn {
  font-size: 1.4rem;
  margin-right: 10px;
}

.cta-small-text {
  font-size: 0.9rem;
}

/* ANIMACIONES BÁSICAS */
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
  background-color: #128c7e;
  width: 12px;
  height: 12px;
}

/* --- ESTILOS DEL TOAST (Copiados y adaptados de BlogDetail) --- */
.toast-notification {
  position: fixed;
  top: 30px; /* Ajusta esto si tu navbar tapa el toast */
  right: 30px;
  background: white;
  color: #2d3748;
  padding: 12px 20px;
  margin-top: 3rem; /* Margen extra por seguridad */
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  z-index: 9999; /* Z-index alto para que se vea sobre todo */
  font-weight: 600;
  font-size: 0.95rem;
  border-left: 4px solid #48bb78; /* Verde éxito */
}

.toast-icon {
  color: #48bb78;
  margin-right: 10px;
  font-size: 1.1rem;
}

/* Animaciones del Toast */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 768px) {
  .register-btn {
    width: 100%;
    max-width: 350px;
    font-size: 1rem;
  }
}
</style>
