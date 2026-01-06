<template>
  <section class="eventos-section" aria-labelledby="eventos-title">
    <h1 style="text-align: center">Eventos</h1>

    <!-- centered container for an image -->
    <div class="image-wrap">
      <!-- pass imageSrc prop or let it fall back to placeholder -->
      <img :src="imageSrc" alt="Imagen del evento" class="evento-image" />
    </div>

    <!-- optional caption -->
    <!-- <p class="caption" v-if="caption">{{ caption }}</p> -->
  </section>
</template>

<script>
export default {
  name: 'Events',
  props: {
    imageSrc: {
      type: String,
      default: '/LuisEventoNov.jpeg', // reemplazar por la ruta real o pasar como prop
    },
    // caption: {
    //   type: String,
    //   default: '',
    // },
  },
}
</script>

<style scoped>
.eventos-section {
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  background: var(--bg, transparent);
}

/* título */
.title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--text-color, #111);
}

/* contenedor centrado para la imagen */
.image-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 900px; /* ancho máximo en pantallas grandes */
  margin: 0 auto;
  padding: 12px;
  box-sizing: border-box;
}

/* imagen responsiva */
.evento-image {
  display: block;
  width: 100%;
  max-width: 800px; /* evita que crezca demasiado en pantallas grandes */
  height: auto;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

/* leyenda opcional */
.caption {
  margin: 0;
  font-size: 0.95rem;
  color: var(--muted, #555);
}

/* Media query para móviles */
@media (max-width: 600px) {
  .eventos-section {
    padding: 20px 12px;
  }

  .title {
    font-size: 1.25rem;
  }

  .image-wrap {
    padding: 8px;
    max-width: 100%;
  }

  .evento-image {
    max-width: 100%;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  .caption {
    font-size: 0.9rem;
    padding: 0 6px;
  }
}
</style>
