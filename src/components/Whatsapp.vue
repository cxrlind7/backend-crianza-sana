<template>
  <!-- Botón flotante con animación de entrada -->
  <transition name="fade-up" appear>
    <button
      v-if="!isChatOpen"
      class="whatsapp-float-btn"
      @click="toggleChat"
      aria-label="Abrir chat de WhatsApp"
    >
      <i class="bi bi-whatsapp"></i>
      <span class="notification-badge">1</span>
    </button>
  </transition>

  <!-- Widget de Chat Interactivo -->
  <transition name="slide-up">
    <div v-if="isChatOpen" class="chat-widget" role="dialog" aria-modal="true">
      <!-- Encabezado del Chat -->
      <div class="chat-header">
        <div class="d-flex align-items-center">
          <i class="bi bi-whatsapp fs-4 me-2 text-white"></i>
          <div>
            <h3 class="m-0 text-white fw-bold fs-6">Equipo Crianza Sana</h3>
            <small class="text-white-50" style="font-size: 0.75rem"
              >Solemos responder en minutos</small
            >
          </div>
        </div>
        <button class="close-chat-btn" @click="toggleChat" aria-label="Cerrar chat">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Cuerpo del Chat (Lista de Especialistas) -->
      <div class="chat-body">
        <div class="welcome-message mb-3 p-3 rounded-3 bg-light shadow-sm">
          <p class="m-0 text-dark" style="font-size: 0.9rem">
            ¡Hola! 👋 ¿Con quién te gustaría hablar hoy? Selecciona un especialista para iniciar un
            chat directo por WhatsApp.
          </p>
        </div>

        <ul class="specialist-list">
          <li v-for="(person, index) in people" :key="person.id || index" class="specialist-item">
            <!-- Avatar con indicador de estado -->
            <div class="avatar-container">
              <img
                :src="person.image"
                :alt="person.name"
                class="avatar"
                :style="{ borderColor: person.color }"
              />
              <span class="status-indicator online"></span>
            </div>

            <div class="specialist-info">
              <h4 class="name">{{ person.name }}</h4>
              <p class="role">{{ person.title }}</p>
            </div>

            <button
              class="start-chat-btn"
              @click="openWhatsApp(person)"
              :aria-label="`Iniciar chat con ${person.name}`"
            >
              <i class="bi bi-send-fill"></i>
            </button>
          </li>
        </ul>
      </div>

      <!-- Pie del chat (opcional, marca de agua) -->
      <div class="chat-footer text-center py-2 bg-light" style="font-size: 0.7rem; color: #888">
        <i class="bi bi-shield-lock-fill me-1"></i> Chat seguro vía WhatsApp
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import peopleData from '../../data'

const people = ref([])
const isChatOpen = ref(false)

// Filter only specialists from the existing data
people.value = peopleData.filter((person) => person.socials && person.socials.length > 0)

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value
}

// Función para extraer el número de teléfono del link de WhatsApp
const getPhoneFromWhatsAppLink = (person) => {
  const whatsappSocial = person.socials.find((s) => s.iconClass.includes('whatsapp'))
  if (whatsappSocial && whatsappSocial.link) {
    // Extraer el número de teléfono de la URL de WhatsApp
    const match = whatsappSocial.link.match(/wa\.me\/(\d+)/)
    return match ? match[1] : null
  }
  return null
}

// Función para generar el mensaje personalizado
const getPersonalizedMessage = (person) => {
  const specialty = person.title.toLowerCase()
  let message = `Hola ${person.name}, `

  if (specialty.includes('psicólog')) {
    message += 'me gustaría solicitar información sobre una consulta psicológica para mi hijo/a.'
  } else if (specialty.includes('nutri')) {
    message += 'estoy interesado/a en una asesoría nutricional pediátrica.'
  } else if (specialty.includes('pediatra')) {
    message += 'quisiera agendar una cita pediátrica.'
  } else if (specialty.includes('terapeuta')) {
    message += 'busco información sobre terapia para mi hijo/a.'
  } else {
    // Mensaje por defecto si no coincide ninguna especialidad clave
    message +=
      'te contacto desde el sitio web de Crianza Sana, me gustaría recibir más información.'
  }

  return message
}

const openWhatsApp = (person) => {
  const phone = getPhoneFromWhatsAppLink(person)
  if (!phone) {
    console.error('No se encontró número de teléfono para', person.name)
    return
  }

  const message = getPersonalizedMessage(person)
  // Usamos la API universal de WhatsApp que funciona mejor en desktop y móvil
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}
</script>

<style scoped>
/* Importar Bootstrap Icons si no está global */
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css');

/* --- Botón Flotante --- */
.whatsapp-float-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, #25d366, #128c7e);
  color: white;
  font-size: 30px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.whatsapp-float-btn:hover {
  transform: scale(1.1);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff3b30;
  color: white;
  font-size: 12px;
  font-weight: bold;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

/* --- Widget de Chat --- */
.chat-widget {
  position: fixed;
  bottom: 90px; /* Justo encima del botón flotante original */
  right: 20px;
  width: 350px;
  max-width: calc(100% - 40px);
  height: 500px;
  max-height: calc(100vh - 120px);
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.chat-header {
  background: linear-gradient(45deg, #128c7e, #25d366);
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.close-chat-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.close-chat-btn:hover {
  opacity: 1;
}

.chat-body {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: #f0f2f5; /* Color de fondo estilo WhatsApp */
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM32 63c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm57-13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d1d7db' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E");
}

/* --- Lista de Especialistas --- */
.specialist-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.specialist-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.specialist-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.avatar-container {
  position: relative;
  margin-right: 12px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid transparent; /* El color se aplica inline */
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background-color: #25d366; /* Verde online */
  border: 2px solid #fff;
  border-radius: 50%;
}

.specialist-info {
  flex: 1;
}

.name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

.role {
  margin: 2px 0 0;
  font-size: 0.8rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.start-chat-btn {
  background-color: #f0f2f5;
  color: #25d366;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.start-chat-btn:hover {
  background-color: #25d366;
  color: white;
}

/* --- Transiciones Vue --- */
/* Fade Up para el botón */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* Slide Up para el widget */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  pointer-events: none;
}

/* --- Responsive --- */
@media (max-width: 480px) {
  .chat-widget {
    width: calc(100% - 30px);
    right: 15px;
    bottom: 85px;
    height: 450px;
  }

  .whatsapp-float-btn {
    bottom: 15px;
    right: 15px;
    width: 55px;
    height: 55px;
  }
}
</style>
