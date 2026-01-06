<template>
  <div class="container-banda">
    <!-- <div class="banda-columns">
      <div class="banda-inner">
        <div v-for="(img, i) in duplicadas" :key="img.src + '-' + i" class="banda-foto">
          <img :src="img.src" :alt="'foto ' + (i + 1)" />
        </div>
      </div>
    </div> -->
    <!-- Overlay de texto portada -->
    <img src="../../public/PortadaNoviembre.jpeg" class="portada-img" alt="" />
    <div class="portada-overlay">
      <div class="text-overlay">
        <div class="upper-text">
          <h1>Crianza Sana</h1>
          <h2>by D-Kids</h2>
        </div>
        <div class="lower-text">
          <h2>
            Un espacio creado por especialistas en las áreas familiar, civil, psicológica y de
            salud. Con la finalidad de crear en el ejercicio de la paternidad responsable, a través
            de consejos y sugerencias.
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Tu lista original
const fotosOriginal = [
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/KarenJunio1.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/KarenJunio2.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/KarenJunio3.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/KarenJunio4.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/RobertoJunio1.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/RobertoJunio2.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/RobertoJunio3.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/RobertoJunio4.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/AndreaJunio1.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/AndreaJunio2.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/AndreaJunio3.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/AndreaJunio4.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/LuisJunio1.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/LuisJunio2.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/LuisJunio3.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/LuisJunio4.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/MiriamJunio1.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/MiriamJunio2.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/MiriamJunio3.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/MiriamJunio4.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/AnaLauJunio1.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/AnaLauJunio2.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/AnaLauJunio3.png' },
  { src: 'https://csdkids-images.s3.us-east-2.amazonaws.com/AnaLauJunio4.png' },
]

// Función para mezclar (Fisher-Yates shuffle)
function shuffle(array) {
  const arr = array.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Barajamos una sola vez por montaje:
const imagenes = ref(shuffle(fotosOriginal))
// Duplicamos para el efecto infinito:
const duplicadas = computed(() => [...imagenes.value])
</script>

<style scoped>
.container-banda {
  position: relative;
  width: 100vw;
  height: 100vh; /* Full screen */
  min-height: 400px;
  overflow: hidden;
  box-sizing: border-box;
  margin-top: 0; /* Remove margin to go behind navbar */
}
.portada-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%; /* Shift image slightly to position faces better */
  z-index: 1;
}

.banda-columns {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.banda-inner {
  columns: 4 220px;
  column-gap: 0;
  width: 100%;
  animation: bandamove-columns 30s linear infinite;
}

.banda-foto {
  width: 100%;
  display: block;
  break-inside: avoid;
  margin: 0;
  margin-bottom: 0;
  overflow: hidden;
  border-radius: 0;
}

.banda-foto img {
  width: 100%;
  display: block;
  margin: 0;
  border-radius: 0;
  filter: grayscale(10%) brightness(0.97);
  transition: filter 0.18s;
}

@keyframes bandamove-columns {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-50%);
  }
}

/* Overlay de portada */
.portada-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    /* Slight dark at top for navbar visibility */ transparent 30%,
    rgba(0, 0, 0, 0.6) 70%,
    rgba(0, 0, 0, 0.95) 100%
  ); /* Darker gradient at bottom for text legibility */
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  pointer-events: none;
  padding-bottom: 3rem;
}

.text-overlay {
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 1rem;
}

.upper-text {
  margin-bottom: 0.5rem;
  width: 100%;
  text-align: center;
}

.lower-text {
  width: 100%;
  max-width: 900px;
  text-align: center;
}

.text-overlay h1 {
  font-size: 4rem;
  margin: 0;
  text-shadow: 2px 4px 12px rgba(0, 0, 0, 0.9);
  font-weight: 800;
  letter-spacing: 0.05em;
  line-height: 1.1;
  text-transform: uppercase;
}

.text-overlay h2 {
  font-size: 1.2rem;
  text-shadow: 1px 2px 8px rgba(0, 0, 0, 0.9);
  font-weight: 400;
  line-height: 1.5;
  opacity: 1; /* Increased opacity */
}

.upper-text h2 {
  font-size: 2rem;
  font-weight: 300;
  margin-top: 0.2rem;
  text-transform: none;
  opacity: 1;
}

/* Responsive */
@media (max-width: 1000px) {
  .banda-inner {
    columns: 2 140px;
    animation-duration: calc(30s * 3);
  }
}

@media (max-width: 768px) {
  .container-banda {
    height: 10vh; /* Reduced to minimize empty space */
    min-height: 350px;
    margin-top: 0;
    background-color: #cbb093; /* Match image background to hide letterboxing */
  }

  .banda-inner {
    animation-duration: calc(30s * 3);
    columns: 1 90vw;
  }

  .text-overlay h1 {
    font-size: 2rem;
  }

  .upper-text h2 {
    font-size: 1.1rem;
  }

  .text-overlay h2 {
    font-size: 0.85rem;
    line-height: 1.3;
  }

  .portada-overlay {
    padding-bottom: 1.5rem;
    background: linear-gradient(
      to bottom,
      transparent 30%,
      rgba(0, 0, 0, 0.3) 60%,
      rgba(0, 0, 0, 0.85) 100%
    );
  }

  .portada-img {
    object-fit: contain; /* Show complete image - don't crop people */
    object-position: center center;
    width: 100%;
    height: 100%;
  }
}
</style>
