<template>
  <!-- Sección principal con animación de entrada -->
  <section v-if="instaData" class="instagram-profile-replica fade-in">
    <div class="container-fluid main-container">
      <!-- Título de la sección (Estilo consistente) -->
      <div class="text-center mb-5 fade-in">
        <h6 class="text-uppercase letter-spacing-2 text-muted mb-2">Contenido Multimedia</h6>
        <h2 class="display-6 fw-bold text-dark">Social Media</h2>
      </div>

      <!-- Nuevo contenedor tipo tarjeta -->
      <div class="card-container">
        <!-- Solo se muestra si hay datos del perfil -->
        <div v-if="instaData" class="profile-header">
          <!-- Columna Izquierda: Foto de Perfil -->
          <div class="header-pic-col">
            <div class="insta-pic-wrapper">
              <img :src="instaData.profileImage" alt="Profile Picture" class="insta-pic" />
            </div>
          </div>

          <!-- Columna Derecha: Información y Acciones -->
          <div class="header-info-col">
            <!-- Fila 1: Nombre de usuario y Botones -->
            <div class="info-row-top">
              <h2 class="insta-username">{{ instaData.username }}</h2>
              <div class="header-actions">
                <!-- Botón "Seguir" (enlace real al perfil) -->
                <a
                  :href="instaData.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="insta-btn btn-primary"
                >
                  Seguir
                </a>
                <!-- Botón "Enviar mensaje" (AHORA TAMBIÉN ES UN ENLACE AL PERFIL) -->
                <a
                  :href="instaData.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="insta-btn btn-secondary"
                >
                  Enviar mensaje
                </a>
              </div>
            </div>

            <!-- Fila 2: Estadísticas (Publicaciones, Seguidores, Seguidos) -->
            <ul class="insta-stats-row">
              <li>
                <span class="stat-bold">{{ formatNumber(instaData.stats.posts) }}</span>
                publicaciones
              </li>
              <li>
                <a
                  :href="instaData.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="stat-link"
                >
                  <span class="stat-bold">{{ formatNumber(instaData.stats.followers) }}</span>
                  seguidores
                </a>
              </li>
              <li>
                <a
                  :href="instaData.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="stat-link"
                >
                  <span class="stat-bold">{{ formatNumber(instaData.stats.following) }}</span>
                  seguidos
                </a>
              </li>
            </ul>

            <!-- Fila 3: Nombre completo y Biografía -->
            <div class="insta-bio-block">
              <h1 class="insta-fullname">{{ instaData.fullName }}</h1>
              <!-- Usamos v-html para respetar los saltos de línea y emojis de la bio -->
              <div class="insta-bio-text" v-html="formattedBio"></div>
            </div>

            <!-- SECCIÓN "SEGUIDO POR..." ELIMINADA -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'InstagramProfileReplica',
  props: {
    instagramProfileData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      instaData: this.instagramProfileData,
    }
  },
  computed: {
    formattedBio() {
      if (!this.instaData || !this.instaData.bio) return ''
      return this.instaData.bio.replace(/\n/g, '<br>')
    },
  },
  watch: {
    instagramProfileData(newVal) {
      this.instaData = newVal
    },
  },
  methods: {
    formatNumber(num) {
      if (!num) return '0'
      // Formateador para miles (K) y millones (M)
      return new Intl.NumberFormat('es-ES', {
        notation: 'compact',
        compactDisplay: 'short',
      }).format(num)
    },
  },
}
</script>

<style scoped>
/* --- Estilos Generales --- */
.instagram-profile-replica {
  padding: 60px 20px; /* Más espacio alrededor */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #262626;
  display: flex;
  justify-content: center;
}

/* --- NUEVO: Contenedor tipo Tarjeta Redondeada --- */
.card-container {
  max-width: 935px;
  width: 100%;
  background-color: #fff; /* Fondo blanco para la tarjeta */
  border-radius: 24px; /* Bordes muy redondeados */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); /* Sombra suave y moderna */
  padding: 40px; /* Espacio interno generoso */
  margin: 0 auto;
}

/* --- Layout de la Cabecera --- */
.profile-header {
  display: flex;
  /* margin-bottom eliminado, ya no hay nada debajo */
}

/* Columna Izquierda: Foto */
.header-pic-col {
  flex-shrink: 0;
  margin-right: 40px; /* Más espacio entre foto e info */
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Alinear arriba */
}

.insta-pic-wrapper {
  width: 160px; /* Un poco más grande */
  height: 160px;
  border-radius: 50%;
  border: 1px solid #dbdbdb;
  padding: 3px;
}

.insta-pic {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

/* Columna Derecha: Info y Acciones */
.header-info-col {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* --- Fila 1: Usuario y Botones --- */
.info-row-top {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
}

.insta-username {
  font-weight: 300;
  font-size: 32px; /* Un poco más grande */
  line-height: 36px;
  margin: 0;
  margin-right: 25px;
  color: #262626;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Estilos de Botones */
.insta-btn {
  border: 1px solid transparent;
  border-radius: 8px; /* Botones más redondeados */
  cursor: pointer;
  font-weight: 600;
  padding: 8px 24px; /* Botones más grandes */
  text-align: center;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.insta-btn:hover {
  transform: translateY(-2px); /* Efecto sutil al pasar el mouse */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: #0095f6;
  color: #fff;
}
.btn-primary:hover {
  background-color: #0085e0; /* Un poco más oscuro al hover */
}

.btn-secondary {
  background-color: transparent;
  border: 1px solid #dbdbdb;
  color: #262626;
}
.btn-secondary:hover {
  background-color: #f8f8f8;
  border-color: #c7c7c7;
}

.btn-icon {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.btn-icon:hover {
  background-color: #f0f0f0;
  border-radius: 50%;
  transform: none;
  box-shadow: none;
}

/* --- Fila 2: Estadísticas --- */
.insta-stats-row {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0 0 25px 0;
  font-size: 17px; /* Un poco más grande */
}

.insta-stats-row li {
  margin-right: 45px;
  color: #262626;
}

.insta-stats-row li:last-child {
  margin-right: 0;
}

.stat-bold {
  font-weight: 700; /* Más negrita */
  color: #262626;
}

.stat-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}
.stat-link:hover {
  text-decoration: underline;
}

/* --- Fila 3: Biografía --- */
.insta-bio-block {
  font-size: 16px;
  line-height: 26px;
  /* margin-bottom eliminado */
}

.insta-fullname {
  font-weight: 700;
  font-size: 18px;
  margin: 0 0 6px 0;
  color: #262626;
}

.insta-bio-text {
  white-space: pre-wrap;
  color: #262626;
}

/* --- Animación --- */
.fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* --- Diseño Responsivo (Móvil) --- */
@media (max-width: 768px) {
  .card-container {
    padding: 25px; /* Menos padding en móvil */
    border-radius: 20px;
  }

  .profile-header {
    flex-direction: column;
  }

  .header-pic-col {
    margin-right: 0;
    margin-bottom: 25px;
    justify-content: center; /* Centrar foto en móvil */
  }

  .insta-pic-wrapper {
    width: 100px; /* Foto más pequeña */
    height: 100px;
  }

  .info-row-top {
    margin-bottom: 20px;
    gap: 15px;
    flex-direction: column; /* Usuario arriba, botones abajo */
    align-items: flex-start;
  }

  .insta-username {
    font-size: 26px;
    margin-right: 0;
    width: 100%;
    text-align: center; /* Centrar usuario */
  }

  .header-actions {
    width: 100%;
    justify-content: center; /* Centrar botones */
    gap: 10px;
  }

  .insta-btn {
    flex-grow: 1;
    padding: 8px 16px;
    font-size: 13px;
  }
  .btn-icon {
    flex-grow: 0;
  }

  .insta-stats-row {
    justify-content: space-around;
    border-top: 1px solid #efefef;
    border-bottom: 1px solid #efefef;
    padding: 15px 0;
    margin-bottom: 20px;
    font-size: 15px;
  }

  .insta-stats-row li {
    margin-right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #8e8e8e;
  }

  .stat-bold {
    display: block;
    font-size: 18px;
    color: #262626;
    margin-bottom: 2px;
  }

  .insta-bio-block {
    font-size: 15px;
    text-align: left; /* Bio alineada a la izquierda */
    padding: 0 10px;
  }
}
</style>
