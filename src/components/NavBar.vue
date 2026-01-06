<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="navbar-container">
      <!-- Logo -->
      <RouterLink to="/" class="navbar-logo">
        <img src="../assets/logo_sin_fondo.png" alt="Logo Crianza Sana" />
      </RouterLink>

      <!-- Mobile Menu Button -->
      <button
        class="menu-toggle"
        @click="toggleMenu"
        aria-label="Toggle navigation menu"
        :aria-expanded="isMenuOpen"
      >
        <i class="fas" :class="isMenuOpen ? 'fa-times' : 'fa-bars'"></i>
      </button>

      <!-- Navigation Links -->
      <div class="nav-menu" :class="{ 'nav-menu-active': isMenuOpen }">
        <ul class="nav-list">
          <li v-for="link in links" :key="link.name" class="nav-item">
            <RouterLink
              :to="link.path"
              class="nav-link"
              active-class="active-link"
              @click="closeMenu"
            >
              {{ link.name }}
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/programs" class="nav-link construction-link" @click="closeMenu">
              Programas
            </RouterLink>
          </li>
        </ul>

        <!-- User Profile / Auth -->
        <div class="user-section">
          <div v-if="currentUser" class="user-profile" @click="toggleUserMenu">
            <img
              :src="currentUser.photoURL || '/defaultAvatar5.jpg'"
              alt="Perfil"
              class="user-avatar"
            />
            <div v-if="showUserMenu" class="user-dropdown">
              <button @click="handleSignOut">Cerrar sesión</button>
            </div>
          </div>
          <button v-else class="login-btn" @click="goToLogin">Iniciar sesión</button>
        </div>
      </div>

      <!-- Mobile Overlay -->
      <div v-if="isMenuOpen" class="mobile-overlay" @click="closeMenu"></div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/firebaseConfig'
import { signOut, onAuthStateChanged } from 'firebase/auth'

const router = useRouter()
const currentUser = inject('currentUser', ref(null))

// State
const isMenuOpen = ref(false)
const isScrolled = ref(false)
const showUserMenu = ref(false)

// Links configuration
const links = [
  { name: 'Inicio', path: '/' },
  { name: '¿Quiénes somos?', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Galería', path: '/gallery' },
  // { name: 'Tienda', path: '/store' },
]

// Methods
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden' // Prevent scrolling when menu is open
  } else {
    document.body.style.overflow = ''
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const handleSignOut = async () => {
  try {
    await signOut(auth)
    currentUser.value = null
    closeMenu()
    router.push('/')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

const goToLogin = () => {
  closeMenu()
  router.push('/login')
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  // Ensure auth state is synced if not provided by parent
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Variables */
:root {
  --navbar-height: 80px;
  --primary-color: #ed1c24;
  --text-color: #333;
  --bg-color: #ffffff;
  --glass-bg: rgba(255, 255, 255, 0.95);
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px; /* Fallback */
  height: var(--navbar-height, 80px);
  z-index: 1000;
  transition: all 0.3s ease;
  background-color: transparent;
}

.navbar-scrolled {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: 70px;
}

.navbar-container {
  max-width: 1200px;
  width: 100%; /* Ensure full width within max-width */
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo */
.navbar-logo img {
  height: 50px;
  width: auto;
  transition: height 0.3s ease;
}

.navbar-scrolled .navbar-logo img {
  height: 40px;
}

/* Desktop Menu */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 25px;
  margin: 0;
  padding: 0;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 600;
  font-size: 1.1rem; /* Increased font size */
  position: relative;
  transition: color 0.3s ease;
  padding: 5px 0;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #ed1c24;
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.active-link::after {
  width: 100%;
}

.active-link {
  color: #ed1c24;
}

.construction-link {
  background-color: #ed1c24;
  color: white !important;
  padding: 8px 16px;
  border-radius: 20px;
}

.construction-link::after {
  display: none;
}

.construction-link:hover {
  background-color: #c41219;
  transform: translateY(-2px);
}

/* User Section */
.user-section {
  margin-left: 20px;
}

.login-btn {
  background-color: transparent;
  border: 2px solid #ed1c24;
  color: #ed1c24;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background-color: #ed1c24;
  color: white;
}

.user-profile {
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ed1c24;
}

.user-dropdown {
  position: absolute;
  top: 120%;
  right: 0;
  background-color: white;
  min-width: 150px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 10px;
  animation: fadeIn 0.2s ease;
}

.user-dropdown button {
  width: 100%;
  background: none;
  border: none;
  text-align: left;
  padding: 8px;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
}

.user-dropdown button:hover {
  background-color: #f5f5f5;
  color: #ed1c24;
}

/* Mobile Toggle */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
  z-index: 1001;
}

.mobile-overlay {
  display: none;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 80%;
    max-width: 300px;
    height: 100vh;
    background-color: white;
    flex-direction: column;
    padding: 80px 20px 20px;
    transition: right 0.3s ease-in-out;
    z-index: 1000;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    align-items: flex-start;
  }

  .nav-menu-active {
    right: 0;
  }

  .nav-list {
    flex-direction: column;
    width: 100%;
    gap: 20px;
  }

  .nav-item {
    width: 100%;
  }

  .nav-link {
    display: block;
    font-size: 1.2rem;
    padding: 10px 0;
  }

  .user-section {
    margin-left: 0;
    margin-top: auto;
    width: 100%;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .user-dropdown {
    position: static;
    box-shadow: none;
    padding: 10px 0 0;
    width: 100%;
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    backdrop-filter: blur(2px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
