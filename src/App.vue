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
</template>

<style scoped>
.app-background {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image: radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
    radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%);
  background-size: 100% 100%;
}

.app-content {
  position: relative;
  z-index: 1;
}
</style>
