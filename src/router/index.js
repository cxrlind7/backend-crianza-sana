import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import LiveView from '@/views/LiveView.vue'
import PersonProfile from '@/components/PersonProfile.vue'
import BlogDetail from '@/views/BlogDetail.vue'
import TiendaView from '@/views/TiendaView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogView.vue'),
    },
    {
      path: '/programs',
      name: 'programs',
      component: () => import('../views/ProgramView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      // component: () => import('../views/ProgramView.vue'),
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('../views/AnalyticsView.vue'),
    },
    {
      path: '/live',
      name: 'live',
      component: () => import('../views/LiveView.vue'),
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: () => import('../views/GalleryView.vue'),
    },
    {
      path: '/store',
      name: 'store',
      component: () => import('../views/StoreView.vue'),
    },
    {
      path: '/store/:id',
      name: 'store-detail',
      component: () => import('../views/StoreDetailView.vue'),
      props: true,
    },

    // {
    //   path: '/special',
    //   name: 'special',
    //   component: () => import('../views/SpecialView.vue'),
    // },
    {
      path: '/person/:id',
      name: 'PersonProfile',
      component: PersonProfile, // Componente para mostrar los detalles de la persona
      props: true, // Permitir que los parámetros se pasen como props
    },
    {
      path: '/blog/:id',
      name: 'BlogDetail',
      component: BlogDetail, // Componente para mostrar los detalles de la persona
      props: true, // Permitir que los parámetros se pasen como props
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // Si hay una posición guardada (por ejemplo, al usar el botón "Atrás")
      return savedPosition
    } else {
      // Si no, vuelve al inicio de la página
      return { top: 0 }
    }
  },
})

export default router
