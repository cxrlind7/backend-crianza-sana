<template>
  <transition name="fade">
    <div v-if="showToast" class="toast">
      <span>Enlace copiado al portapapeles</span>
      <button @click="showToast = false">✖</button>
    </div>
  </transition>
  <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
    <!-- <div class="carousel-overlay-title">
      <span class="name">Ana Laura Sosa Nevárez</span>
      <span class="separator"> - </span>
      <span class="title">Terapeuta de la Comunicación Humana</span>
      <div style="margin-left: .5rem;">
        <h5 class="album-title">¡Comparte este álbum!
          <font-awesome-icon icon="fa-solid fa-share-from-square" class="share-icon" title="Compartir"
            @click="shareAlbum" />
        </h5>
        <p>{{ formatDate(album.date) }}</p>
      </div>
    </div> -->

    <div class="carousel-inner">
      <div
        v-for="(slide, index) in slides"
        :class="['carousel-item', { active: index === 0 }]"
        :key="index"
      >
        <div class="image-wrapper">
          <div class="image-inner">
            <!-- <a href="https://www.crianzasanabydkids.mx/gallery?idAlbum=N0OWOjIWUulBDhkgH7mF" target="_blank"> -->
            <h6 class="caption-letters">{{ slide.caption }}</h6>
            <img :src="slide.image" :alt="slide.caption" />
            <!-- </a> -->
            <div class="image-gradient"></div>
            <div class="image-caption">
              <div
                :class="[
                  'subcaption-letters',
                  index === 0 || index === 2 || index === 5 ? 'subcaption-special' : '',
                ]"
              >
                <!-- Si es string y NO es double -->
                <p v-if="typeof slide.subcaption === 'string' && slide.type !== 'double'">
                  {{ slide.subcaption }}
                </p>

                <!-- Si es string Y es double -->
                <div
                  v-else-if="typeof slide.subcaption === 'string' && slide.type === 'double'"
                  class="subcaption-grid1"
                >
                  <p
                    v-for="(line, i) in slide.subcaption.split(' ').filter((s) => s.trim())"
                    :key="i"
                  >
                    {{ line }}
                  </p>
                </div>

                <div
                  v-else
                  class="subcaption-grid"
                  :class="{ 'two-columns': slide.subcaption.length > 3 }"
                >
                  <p v-for="(line, i) in slide.subcaption" :key="i" class="subcaption-line">
                    {{ line }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      class="carousel-control-prev"
      type="button"
      data-bs-target="#carouselExampleCaptions"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>

    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#carouselExampleCaptions"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>

    <div class="carousel-indicators">
      <button
        v-for="(slide, index) in slides"
        :key="'indicator-' + index"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        :data-bs-slide-to="index"
        :class="{ active: index === 0 }"
        :aria-current="index === 0 ? 'true' : null"
        :aria-label="`Slide ${index + 1}`"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
const showToast = ref(false)

const shareAlbum = () => {
  const galeriaId = 'N0OWOjIWUulBDhkgH7mF'
  const title = 'Ana Laura Sosa Nevárez - Junio'

  const albumUrl = `${window.location.origin}/gallery?idAlbum=${galeriaId}`
  const message = `"${title}" - Explora este álbum completo 📷 ${albumUrl}`

  navigator.clipboard
    .writeText(message)
    .then(() => {
      showToast.value = true
      setTimeout(() => {
        showToast.value = false
      }, 3000)
    })
    .catch((err) => console.error('❌ Error al copiar el enlace:', err))
}

const slides = ref([
  {
    image: 'https://csdkids-images.s3.us-east-2.amazonaws.com/1dkids12.jpeg',
    caption:
      'Carina Lares terapeuta cognitivo conductual infantil Guía Montessori Directora de D-kids',
    subcaption: [
      'D-kids. Centro de Desarrollo Infantil: Guardería',
      'D-kids Academy Preescolar. Clave: 10PJN268X',
    ],
  },
  {
    image: 'https://csdkids-images.s3.us-east-2.amazonaws.com/1dkids11.jpeg',
    caption: 'TCCI: Carina Lares. Directora de D-kids.',
    subcaption: [' '],
  },
  {
    image: 'https://csdkids-images.s3.us-east-2.amazonaws.com/1dkids1.jpeg',
    caption: '10 años al servicio y cuidados de los niños👦🏻 y niñas👧🏻',
    subcaption: ['Terapia de aprendizaje y conducta.', 'D-kids. Centro de Desarrollo Infantil.'],
  },
  {
    image: 'https://csdkids-images.s3.us-east-2.amazonaws.com/1dkids2.jpeg',
    caption: '10 años al servicio y cuidados de los niños👦🏻 y niñas👧🏻',
    type: 'double',

    subcaption: [
      'Autismo',
      'Atención a niños y niñas neurodivergentes',
      'Down',
      'Retraso en el neuro desarrollo',
      'TDAH',
      'Guardería y preescolar',
    ],
  },
  {
    image: 'https://csdkids-images.s3.us-east-2.amazonaws.com/1dkids3.jpeg',
    caption: '10 años al servicio y cuidados de los niños👦🏻 y niñas👧🏻',
    // caption: 'Evaluación InBody',
    subcaption: ['Horario: vespertino y sabatino'],
  },
  {
    image: 'https://csdkids-images.s3.us-east-2.amazonaws.com/1dkids4.jpeg',
    caption: '10 años al servicio y cuidados de los niños👦🏻 y niñas👧🏻',
    // caption: 'Evaluación InBody',
    subcaption: ['Guardería: lactantes y maternales'],
  },
  {
    image: 'https://csdkids-images.s3.us-east-2.amazonaws.com/1dkids13.jpeg',
    caption: '10 años al servicio y cuidados de los niños👦🏻 y niñas👧🏻',
    // caption: 'Evaluación InBody',
    subcaption: 'Clases de pintura 🎨',
  },
  {
    image: 'https://csdkids-images.s3.us-east-2.amazonaws.com/1dkids5.jpeg',
    caption: '10 años al servicio y cuidados de los niños👦🏻 y niñas👧🏻',
    // caption: 'Evaluación InBody',
    subcaption: ['Terapia de lenguaje y aprendizaje'],
  },
  {
    image: 'https://csdkids-images.s3.us-east-2.amazonaws.com/1dkids6.jpeg',
    caption: '10 años al servicio y cuidados de los niños👦🏻 y niñas👧🏻',
    // caption: 'Evaluación InBody',
    subcaption: ['Terapia de lenguaje y aprendizaje'],
  },
  {
    image: 'https://csdkids-images.s3.us-east-2.amazonaws.com/1dkids7.jpeg',
    caption: 'D-kids Academy Preescolar',
    // caption: 'Evaluación InBody',
    subcaption: [
      'D-kids. Academy Preescolar',
      'Horario extendido\n desde las \n7:30 a las 5:00 pm',
    ],
  },
  {
    image: 'https://csdkids-images.s3.us-east-2.amazonaws.com/1dkids8.jpeg',
    caption: 'D-kids. Academy Preescolar',
    // caption: 'Evaluación InBody',
    subcaption: [
      'D-kids. Academy Preescolar',
      'Horario extendido\n desde las \n7:30 a las 5:00 pm',
    ],
  },
  {
    image: 'https://csdkids-images.s3.us-east-2.amazonaws.com/1dkids9.jpeg',
    caption: 'D-kids Academy Preescolar',
    // caption: 'Evaluación InBody',
    subcaption: [
      'D-kids. Academy Preescolar',
      'Horario extendido\n desde las \n7:30 a las 5:00 pm',
    ],
  },
])
</script>

<style scoped>
.subcaption-line {
  white-space: pre-line;
}
/* Estilo base para el contenedor */
.subcaption-grid {
  display: grid;
  gap: 0 1rem; /* Espacio entre columnas (0 vertical, 1rem horizontal) */
}
.subcaption-grid1 {
  display: grid;
  display: none;
  text-align: end;
  gap: 0 1rem; /* Espacio entre columnas (0 vertical, 1rem horizontal) */
}

/* Esta clase se aplica CONDICIONALMENTE para crear las dos columnas */
.subcaption-grid.two-columns {
  grid-template-columns: repeat(2, 1fr); /* Divide el espacio en 2 columnas iguales */
  text-align: end;
}

.subcaption-grid p {
  margin: 0.3rem 0;
}
.toast {
  position: fixed;
  top: 50px;
  right: 20px;
  background-color: #f8fafb;
  color: #343a3f;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 250px;
  max-width: 300px;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  z-index: 198980;
}

.toast button {
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  margin-left: 10px;
  cursor: pointer;
}

/* Efecto de desvanecimiento */
.fade-leave-active {
  transition: opacity 0.8s ease-in-out;
}

.fade-leave-to {
  opacity: 0;
}

.share-icon {
  cursor: pointer;
  color: #0081ff;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.share-icon:hover {
  color: #02a2b9;
}

.carousel-overlay-title {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.6);
  white-space: nowrap;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.carousel-overlay-title .name {
  margin-right: 0.5rem;
  font-size: 1.6rem;
}

.carousel-overlay-title .title {
  font-size: 1.6rem;
  margin-left: 0.5rem;
  /* width: 1rem; */
}

.carousel-caption {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 100%;
  padding: 20px;
  text-align: center;
  z-index: 5;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  box-sizing: border-box;
}

.carousel-indicators {
  position: absolute;
  padding-bottom: 4.3rem;
  z-index: 15;
}

.carousel-indicators button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  border: none;
  transition: all 0.3s ease;
  margin: 0 5px;
}

.carousel-indicators button.active {
  background-color: #fff;
  transform: scale(1.3);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0rem;
  text-align: center;
  z-index: 5;
  /* background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent); */
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.caption-letters {
  font-size: 1.3rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
}

.subcaption-letters {
  font-size: 1.3rem;
  padding-bottom: 1rem;
  line-height: 1;
  color: #ffffff;
  text-shadow:
    1px 1px 2px black,
    0 0 1em black,
    0 0 0.2em black;
}

.image-wrapper {
  width: 100%;
  padding-top: 0rem;
  /* padding-top: 4rem; */
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.image-inner {
  /* position: relative;
  border-radius: 8px;
  overflow: hidden;
  display: inline-block; */
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  /* 🎯 FIX CLAVE: Cambiar a block/flex para centrado adecuado 🎯 */
  display: flex;
  flex-direction: column; /* Apila la imagen y la leyenda (si la leyenda fuera parte del flujo) */
  align-items: center; /* Asegura que el contenido interno también se centre */
  /* NO uses display: inline-block; */
}

.image-inner img {
  max-width: 100%;
  max-height: 72vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

.image-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20%;
  /* background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent); */
  pointer-events: none;
}

@media (max-width: 768px) {
  .subcaption-grid {
    grid-template-columns: 1fr 1fr; /* 👈 Dos columnas */
    gap: 0.2rem 0.8rem; /* Menos espacio vertical, más horizontal */
    padding: 0 0.3rem;
    text-align: left;
  }

  .subcaption-grid p {
    margin: 0.15rem 0;
    font-size: 0.7rem; /* Más pequeño para que quepa */
    line-height: 1.2;
  }

  .carousel-overlay-title {
    padding-top: 1.2rem;
    flex-direction: column;
    font-size: 1.5rem;
  }

  .carousel-overlay-title .name {
    margin-right: 0;
  }

  .carousel-overlay-title .title {
    margin-left: 0;
    overflow: visible;
    white-space: normal;
    text-overflow: unset;
  }

  .carousel-overlay-title .separator {
    display: none;
  }

  .image-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    text-align: center;
    z-index: 5;
    /* background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent); */
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    box-sizing: border-box;
  }

  .caption-letters {
    font-size: 1.1rem;
    font-weight: bold;
    color: #fff;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
  }

  /* .subcaption-letters {
    padding-top: -4rem;
    font-size: 1rem;
    color: #ffffff;
    line-height: .8;
  } */

  .image-inner img {
    max-width: 100%;
    max-height: 75vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  }

  .image-gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20%;
    /* background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent); */
    pointer-events: none;
  }

  .subcaption-letters {
    font-size: 0.9rem;
    color: #fff;
    padding-top: 3rem;
    line-height: 1.2;
  }

  .subcaption-special {
    padding-bottom: 3rem;
  }

  .carousel-indicators {
    position: absolute;
    padding-bottom: 2rem;
    z-index: 15;
  }
}
</style>
