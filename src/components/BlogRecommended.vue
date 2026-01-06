<template>
  <h2 class="section-title">Recomendado</h2>

  <section class="blog-recommended-section">
    <!-- Área principal de visualización con transición -->
    <transition name="fade-smooth" mode="out-in">
      <div v-if="blog" :key="blog.id" class="blog-display-wrapper">
        <!-- CASO 1: Imagen decorativa / Banner -->
        <div v-if="blog.isImage" class="banner-card">
          <a :href="blog.link || '#'" target="_blank" rel="noopener noreferrer" class="banner-link">
            <img :src="blog.imageUrl" alt="Destacado" class="banner-image" />
          </a>
        </div>

        <!-- CASO 2: Tarjeta de Blog Estándar -->
        <article v-else class="blog-card">
          <div class="blog-card__image-container">
            <img :src="blog.imageUrl" :alt="blog.title" class="blog-card__image" />
          </div>

          <div class="blog-card__content">
            <div class="blog-card__header">
              <div class="accent-line"></div>
              <h2 class="blog-title">{{ blog.title }}</h2>
            </div>

            <p class="blog-description">{{ blog.description }}</p>

            <div class="blog-card__footer">
              <router-link
                :to="{ name: 'BlogDetail', params: { id: blog.id } }"
                class="read-more-btn"
                @click="() => trackBlogClick(blog.title)"
              >
                Leer artículo
              </router-link>
            </div>
          </div>
        </article>
      </div>
    </transition>

    <!-- NUEVO: Contenedor de Paginación (Puntitos) -->
    <!-- Solo se muestra si hay más de un elemento -->
    <div class="pagination-container" v-if="blogCycle.length > 1">
      <span
        v-for="(item, index) in blogCycle"
        :key="index"
        class="pagination-dot"
        :class="{ active: index === currentIndex }"
        @click="goToIndex(index)"
        role="button"
        :aria-label="'Ir al elemento ' + (index + 1)"
      ></span>
    </div>
  </section>
</template>

<script>
import { getCollection } from '@/composables/useFirestore'

export default {
  name: 'BlogRecommended',
  data() {
    return {
      blogs: [],
      currentIndex: 0,
      interval: null,
    }
  },
  computed: {
    sortedBlogs() {
      if (!this.blogs.length) return []
      return [...this.blogs].sort((a, b) => (b.orden || 0) - (a.orden || 0)).slice(0, 2)
    },
    blogCycle() {
      // Si decides usar la imagen decorativa, descomenta esto:
      /*
      const decorativeImage = {
        id: 'banner-promo-1',
        isImage: true,
        imageUrl: 'https://csdkids-images.s3.us-east-2.amazonaws.com/CumpleAndrea.jpeg',
        link: 'https://crianzasanabydkids.mx/blog/EJWl5vPqxELyMMK1Gzft'
      };
      return [decorativeImage, ...this.sortedBlogs];
      */
      return [...this.sortedBlogs]
    },
    blog() {
      if (!this.blogCycle.length) return null
      return this.blogCycle[this.currentIndex]
    },
  },
  methods: {
    async loadBlogs() {
      try {
        const fetchedBlogs = await getCollection('blogs')
        this.blogs = fetchedBlogs.filter((b) => b.title && b.imageUrl)

        if (this.blogCycle.length > 1) {
          this.startAlternating()
        }
      } catch (error) {
        console.error('❌ Error cargando blogs recomendados:', error)
      }
    },
    trackBlogClick(blogTitle) {
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'click_blog_leer', {
          event_category: 'navegacion_blog',
          event_label: blogTitle,
        })
      }
    },
    startAlternating() {
      if (this.interval) clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.blogCycle.length
      }, 7000)
    },
    // NUEVO MÉTODO: Para navegar manualmente al hacer clic en los puntitos
    goToIndex(index) {
      this.currentIndex = index
      // Reiniciamos el intervalo para que no cambie inmediatamente después del clic manual
      this.startAlternating()
    },
  },
  mounted() {
    this.loadBlogs()
  },
  beforeUnmount() {
    if (this.interval) clearInterval(this.interval)
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
}
/* Variables locales */
.blog-recommended-section {
  --accent-color: #d63384;
  --text-dark: #2c3e50;
  --text-light: #64748b;
  --card-radius: 20px;
  --card-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.08), 0 5px 15px -5px rgba(0, 0, 0, 0.04);

  padding: 40px 20px;
  display: flex;
  flex-direction: column; /* Cambiado a columna para apilar el contenido y los puntos */
  align-items: center; /* Centrar horizontalmente */
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.blog-display-wrapper {
  width: 100%;
  max-width: 1100px;
}

/* --- NUEVOS ESTILOS: PAGINACIÓN (Puntitos) --- */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px; /* Espacio entre la tarjeta y los puntos */
  gap: 12px; /* Espacio entre puntos */
}

.pagination-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #e2e8f0; /* Color gris claro para inactivos */
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Estado Activo */
.pagination-dot.active {
  background-color: var(--accent-color); /* Color rosa de la marca */
  transform: scale(1.25); /* Un poco más grande */
  box-shadow: 0 2px 6px rgba(214, 51, 132, 0.4);
}

/* Hover en inactivos */
.pagination-dot:not(.active):hover {
  background-color: #cbd5e1; /* Un gris un poco más oscuro al pasar el mouse */
}

/* --- ESTILOS DE LA TARJETA (Igual que antes) --- */
.blog-card {
  display: flex;
  background-color: #ffffff;
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  overflow: hidden;
  min-height: 400px;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.blog-card__image-container {
  flex: 0 0 45%;
  position: relative;
  overflow: hidden;
}

.blog-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.blog-card:hover .blog-card__image {
  transform: scale(1.03);
}

.blog-card__content {
  flex: 1;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.blog-card__header {
  margin-bottom: 25px;
}

.accent-line {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-color), transparent);
  margin-bottom: 15px;
  border-radius: 2px;
}

.blog-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-dark);
  margin: 0;
  line-height: 1.2;
}

.blog-description {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--text-light);
  margin-bottom: 35px;
  max-width: 90%;
}

.blog-card__footer {
  margin-top: auto;
}

.read-more-btn {
  display: inline-block;
  background-color: var(--accent-color);
  color: white;
  text-decoration: none;
  padding: 14px 36px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(214, 51, 132, 0.3);
}

.read-more-btn:hover {
  background-color: #c22a75;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(214, 51, 132, 0.4);
}

/* --- ESTILOS PARA EL BANNER --- */
.banner-card {
  width: 100%;
  border-radius: var(--card-radius);
  overflow: hidden;
  box-shadow: var(--card-shadow);
  background-color: #fff;
}

.banner-link {
  display: block;
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.banner-card:hover .banner-image {
  transform: scale(1.02);
}

/* --- TRANSICIONES --- */
.fade-smooth-enter-active,
.fade-smooth-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-smooth-enter-from,
.fade-smooth-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* --- RESPONSIVIDAD --- */
@media (max-width: 900px) {
  .blog-card {
    flex-direction: column;
    min-height: auto;
  }

  .blog-card__image-container {
    flex: none;
    width: 100%;
    height: 250px;
  }

  .blog-card__content {
    padding: 30px 25px;
    align-items: center;
    text-align: center;
  }

  .accent-line {
    margin-left: auto;
    margin-right: auto;
    background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
  }

  .blog-title {
    font-size: 1.6rem;
  }

  .blog-description {
    font-size: 1rem;
    max-width: 100%;
  }

  .read-more-btn {
    width: 100%;
    max-width: 280px;
    text-align: center;
  }
}
</style>
