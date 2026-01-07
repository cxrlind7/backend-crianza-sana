<template>
  <div class="gallery-container">
    <div class="gallery-wrapper">
      <div class="team-grid">
        <template v-for="(member, index) in team" :key="index">
          <h1 v-if="index === 4" class="inserted-title">#ReeducarParaFormar</h1>

          <router-link
            :to="`/person/${member.id}`"
            class="polaroid-card"
            :style="getCardStyle(index)"
            @mouseenter="hoveredIndex = index"
            @mouseleave="hoveredIndex = null"
          >
            <div class="polaroid-frame">
              <div class="image-container">
                <img
                  v-if="member.src"
                  :src="member.src"
                  :alt="member.name"
                  class="team-member-photo"
                />
                <div v-else class="image-placeholder">
                  <div class="placeholder-content">
                    <p>Foto</p>
                  </div>
                </div>
                <div class="image-overlay" :class="{ 'overlay-visible': hoveredIndex === index }" />
              </div>
              <div class="name-container">
                <h3 class="member-name">
                  {{ member.name }}
                </h3>
                <!-- NUEVO: Especialidad con color dinámico -->
                <!-- Se usa :style para aplicar el color definido en los datos -->
                <p class="member-specialty" :style="{ color: member.color }">
                  {{ member.specialty }}
                </p>
                <!-- FIN NUEVO -->
              </div>
            </div>
            <div class="active-pin" :class="{ 'pin-visible': isHighlighted(index) }" />
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

// 1. Estado
const activeIndex = ref(0)
const hoveredIndex = ref(null)

// 2. Datos
// CAMBIO IMPORTANTE: Se añadieron 'specialty' y 'color' a cada miembro.
// He usado los colores de tu imagen de referencia.
// Por favor, actualiza los nombres y especialidades restantes según corresponda.
const team = [
  {
    id: 2,
    name: 'Carina',
    src: '../../CarinaNoviembre1.jpeg',
    specialty: 'Terapéuta cognitivo conductual',
    color: '#FF4DA3', // Rosa
  },
  {
    id: 4,
    name: 'Patricia',
    src: '../../PatyNoviembre1.jpeg',
    // Actualizado según la segunda imagen
    specialty: 'Odontopediatra',
    color: '#E70885', // Rosa
  },
  {
    id: 6,
    name: 'Luis',
    src: '../../LuisNoviembre1.jpeg',
    specialty: 'Psicólogo Infanto-Juvenil',
    color: '#1A9FAD', // Cian
  },
  {
    id: 3,
    name: 'Andrea',
    src: '../../AndreaNoviembre1.jpeg',
    // Andrea no aparecía en las imágenes de referencia, mantengo placeholder
    specialty: 'Lic. en Nutrición',
    color: '#7ABB4B',
  },
  {
    id: 1,
    name: 'Karen',
    src: '../../KarenNoviembre1.jpeg',
    // Actualizado según la segunda imagen
    specialty: 'Lic. en Fisioterapia',
    color: '#8F0072', // Rosa
  },
  {
    id: 5,
    name: 'Miriam',
    src: '../../MiriamNoviembre1.jpeg',
    specialty: 'Pediatra - Cardióloga pediatra',
    color: '#1e40af', // Azul oscuro
  },
  {
    id: 8,
    name: 'Roberto',
    src: '../../RobertoNoviembre1.jpeg',
    // Actualizado según la segunda imagen
    specialty: 'Lic. en Derecho',
    color: '#112548', // Azul oscuro (similar al de Miriam)
  },
  {
    id: 9,
    name: 'Ana Laura',
    src: '../../AnaLauNoviembre1.jpeg',
    // Actualizado según la segunda imagen
    specialty: 'Terapeuta de la Comunicación Humana',
    color: '#00a6c7', // Cian
  },
]

const rotations = [3, -2, 4, -3, 2, -4, 3, -2]

// 3. Métodos
const getRotation = (index) => {
  return rotations[index]
}

const isHighlighted = (index) => {
  return (
    hoveredIndex.value === index || (activeIndex.value === index && hoveredIndex.value === null)
  )
}

const getCardStyle = (index) => {
  const isHovered = hoveredIndex.value === index
  const isActive = activeIndex.value === index && hoveredIndex.value === null

  const rotation = isHovered ? 0 : getRotation(index)
  const scale = isHovered ? 1.1 : isActive ? 1.05 : 1
  const translateY = isHovered ? '-20px' : '0px'
  const z = isHovered ? 50 : isActive ? 20 : 10

  return {
    transform: `rotate(${rotation}deg) scale(${scale}) translateY(${translateY})`,
    zIndex: z,
  }
}

// 4. Lógica de ciclo de vida (Intervalo)
let intervalId = null

const startInterval = () => {
  if (intervalId) clearInterval(intervalId)
  intervalId = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % team.length
  }, 2000)
}

const stopInterval = () => {
  if (intervalId) clearInterval(intervalId)
  intervalId = null
}

watch(
  hoveredIndex,
  (newVal) => {
    if (newVal === null) {
      startInterval()
    } else {
      stopInterval()
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  stopInterval()
})
</script>

<style scoped>
.inserted-title {
  grid-column: 1 / -1;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: #1e293b;
  margin: 0;
}

/* Contenedor principal */
.gallery-container {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
}

.gallery-wrapper {
  max-width: 80rem;
  width: 100%;
}

/* Título */
.gallery-title {
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 4rem;
  color: #1e293b;
}

/* Grid del equipo */
.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  place-items: center;
}

@media (max-width: 1024px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .team-grid {
    grid-template-columns: 1fr;
  }
}

/* Tarjeta Polaroid */
.polaroid-card {
  position: relative;
  cursor: pointer;
  transition: all 500ms ease-out;
  text-decoration: none;
  color: inherit;
  display: block;
}

/* Marco blanco de la polaroid */
.polaroid-frame {
  background-color: #ffffff;
  padding: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border-radius: 0.125rem;
}

/* Contenedor de la imagen */
.image-container {
  width: 16rem;
  height: 20rem;
  background: linear-gradient(to bottom right, #e2e8f0, #cbd5e1);
  margin-bottom: 1rem;
  overflow: hidden;
  position: relative;
}

/* Imagen del miembro */
.team-member-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 700ms ease;
}

/* Efecto de zoom en la imagen al hacer hover en la tarjeta */
.polaroid-card:hover .team-member-photo {
  transform: scale(1.1);
}

/* Placeholder para cuando no hay foto */
.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
}

.placeholder-icon {
  width: 5rem;
  height: 5rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
  fill: currentColor;
}

/* Overlay oscuro sobre la imagen */
.image-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  opacity: 0;
  transition: opacity 300ms ease;
}

/* Clase que se añade con Vue para mostrar el overlay */
.image-overlay.overlay-visible {
  opacity: 0;
}

/* Contenedor del nombre y especialidad */
.name-container {
  text-align: center;
}

/* Texto del nombre */
.member-name {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  font-size: 1.25rem;
  color: #1e293b;
  letter-spacing: 0.025em;
  margin-bottom: 0.25rem; /* Pequeño margen debajo del nombre */
}

/* NUEVO: Estilos para la especialidad */
.member-specialty {
  /* Usamos una fuente sans-serif normal para la especialidad, diferente al nombre */
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  font-size: 0.875rem; /* Un poco más pequeño que el nombre */
  font-weight: 600; /* Semibold */
  margin: 0;
  line-height: 1.2;
}

/* Pin rojo indicador (Estilo Caramelo de Menta) */
.active-pin {
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  width: 1.5rem; /* Aumentado para ver mejor el detalle */
  height: 1.5rem;
  /* Conic gradient para simular caramelo de menta (rojo y blanco) */
  background: repeating-conic-gradient(from 0deg, #ef4444 0deg 20deg, #c4f1d2 20deg 40deg);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 2px solid #ffffff; /* Borde blanco para suavizar */
  transition: all 300ms ease;
  opacity: 0;
  transform: translateX(-50%) scale(0);
}

@media (max-width: 768px) {
  .team-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    align-items: start;
  }

  .inserted-title {
    grid-column: 1 / -1;
    font-size: 1.25rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .polaroid-card {
    width: 100%;
    transform: none !important;
  }

  .polaroid-frame {
    padding: 0.5rem;
  }

  .image-container {
    width: 100%;
    aspect-ratio: 3 / 4;
    height: auto;
  }

  .team-member-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .member-name {
    font-size: 0.7rem;
    margin-bottom: 0.1rem;
  }

  /* NUEVO: Ajuste de tamaño para móvil */
  .member-specialty {
    font-size: 0.6rem;
  }

  /* Ajuste del caramelo en móvil */
  .active-pin {
    width: 1rem;
    height: 1rem;
    bottom: -0.75rem;
  }
}

/* Copos de nieve CSS */
.snowflake {
  color: #dbeafe; /* Azul muy claro */
  font-size: 2.5em; /* Aumentado de 1.5em */
  font-family: Arial, sans-serif;
  text-shadow: 0 0 5px #000;
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 25;
  user-select: none;
  cursor: default;
  animation: snow-wiggle 3s ease-in-out infinite;
}

.snowflake:nth-child(2) {
  top: auto;
  bottom: 10px;
  right: auto;
  left: -10px;
  font-size: 2em; /* Aumentado de 1.2em */
  animation-delay: 1s;
}

@keyframes snow-wiggle {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(20deg);
  }
}

/* Luces de Navidad Mejoradas */
.christmas-lights {
  position: absolute;
  top: -20px; /* Ajustado para la nueva curva */
  left: -5px;
  right: -5px;
  height: 40px;
  display: flex;
  justify-content: space-around;
  align-items: flex-end; /* Alineado al fondo para que los focos cuelguen de la curva inferior */
  z-index: 15;
  pointer-events: none;
  border-bottom: 2px solid #444; /* Curva hacia abajo (U) */
  border-radius: 50%;
  box-sizing: border-box;
  padding-bottom: 0px;
}

.bulb {
  position: relative;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-bottom: -14px; /* Ajuste para que cuelguen del cable inferior */
  animation: twinkle 1.5s infinite alternate;
  opacity: 0.8;
}

/* Socket (base del foco) */
.bulb::before {
  content: '';
  position: absolute;
  top: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 4px;
  background: #222;
  border-radius: 2px;
}

.bulb.red {
  background-color: #ff3333;
  box-shadow:
    0 0 10px #ff3333,
    0 0 20px #ff3333;
  animation-delay: 0s;
}
.bulb.green {
  background-color: #33ff33;
  box-shadow:
    0 0 10px #33ff33,
    0 0 20px #33ff33;
  animation-delay: 0.3s;
}
.bulb.gold {
  background-color: #ffcc00;
  box-shadow:
    0 0 10px #ffcc00,
    0 0 20px #ffcc00;
  animation-delay: 0.6s;
}
.bulb.blue {
  background-color: #33ccff;
  box-shadow:
    0 0 10px #33ccff,
    0 0 20px #33ccff;
  animation-delay: 0.9s;
}

@keyframes twinkle {
  0% {
    opacity: 0.5;
    transform: scale(0.9);
    box-shadow: 0 0 5px currentColor;
  }
  100% {
    opacity: 1;
    transform: scale(1.1);
    box-shadow:
      0 0 15px currentColor,
      0 0 30px currentColor;
  }
}

/* Ajuste de posición de los focos para seguir la curva */
.bulb:nth-child(1),
.bulb:nth-child(6) {
  margin-bottom: -8px; /* Más arriba en los extremos */
}

.bulb:nth-child(2),
.bulb:nth-child(5) {
  margin-bottom: -11px; /* Altura media */
}

.bulb:nth-child(3),
.bulb:nth-child(4) {
  margin-bottom: -15px; /* Casi en el fondo (centro de la curva) */
}

@media (max-width: 480px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
