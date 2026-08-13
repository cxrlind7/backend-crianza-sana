<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/firebaseConfig'
import { ref, provide } from 'vue'
import Whatsapp from './components/Whatsapp.vue'
import AppFooter from './components/Footer.vue'
import SubscribeModal from './components/SubscribeModal.vue'

const currentUser = ref(null)

onAuthStateChanged(auth, (user) => {
  currentUser.value = user
})

// Proveerlo globalmente
provide('currentUser', currentUser)
</script>

<template>
  <div class="app-background"></div>
  <NavBar />
  <div class="app-content">
    <RouterView />
  </div>
  <AppFooter />
  <Whatsapp />
  <SubscribeModal />
</template>

<style scoped>
.app-background {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-color: var(--dm-bg);
  background-image: radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
    radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%);
  background-size: 100% 100%;
  transition: background-color 0.3s ease;
}

:global([data-theme='dark']) .app-background {
  background-image: radial-gradient(circle at 30% 70%, rgba(72, 91, 168, 0.18), transparent 60%),
    radial-gradient(circle at 70% 30%, rgba(168, 72, 130, 0.16), transparent 60%);
}

.app-content {
  position: relative;
  z-index: 1;
}
</style>
