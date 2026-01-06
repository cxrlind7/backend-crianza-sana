<template lang="html">
  <div class="container">
    <div class="portada">
      <img src="../assets/EquipoRadio-115.jpg" class="img-portada" alt="Imagen de portada">

      <div class="overlay">
        <div class="text-overlay">
          <div class="upper-text">
            <h1>Crianza Sana</h1>
            <h2>by D-Kids</h2>
          </div>
          <div class="lower-text">
            <h2>
              Un espacio creado por especialistas en las áreas familiar, civil, psicológica y de salud.
              Con la finalidad de crear en el ejercicio de la paternidad responsable, a través de consejos
              y sugerencias.
            </h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.container {
  width: 100%;
  overflow: hidden;
}

/* Contenedor de la portada */
.portada {
  width: 100%;
  position: relative;
  aspect-ratio: 16 / 9;
  /* Mantiene la proporción 16:9 */
  overflow: hidden;
}

/* Imagen de portada */
.img-portada {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Asegura que la imagen llene el espacio sin distorsionarse */
  position: absolute;
  top: 0;
  left: 0;
}

/* Overlay (capa oscura) */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  /* Oscurece la imagen */
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Texto en el overlay */
.text-overlay {
  color: white;
  text-align: center;
  /* padding: 20px; */
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  /* Espacio vertical entre los hijos */
  align-items: center;
}

.upper-text {
  padding-top: 2rem;
  /* Espacio interno en cada div */
  /* background-color: lightgray; */
  /* Fondo para visualizar los elementos */
  width: 80%;
  /* Ancho ajustado de los hijos */
  text-align: center;
}

.lower-text {
  padding: 1rem;
  padding-bottom: 3.5em;
  /* Espacio interno en cada div */
  /* background-color: lightgray; */
  /* Fondo para visualizar los elementos */
  width: 80%;
  /* Ancho ajustado de los hijos */
  text-align: center;
}

.text-overlay h1 {
  font-size: 3vw;
  /* Escala el texto con el ancho de la pantalla */
  margin: 0;
  text-shadow: 2px 3px 5px black;
}

.text-overlay h2 {
  font-size: 2vw;
  /* margin: 10px 0; */
  text-shadow: 2px 3px 5px black;
}

/* Ajustes para pantallas pequeñas */
@media (max-width: 768px) {
  .container {
    padding-top: 50px;
  }

  .text-overlay h1 {
    font-size: 5vw;
  }

  .text-overlay h2 {
    font-size: 3.5vw;
  }

  .upper-text {
    padding-top: .5rem;
    /* Espacio interno en cada div */
    /* background-color: lightgray; */
    /* Fondo para visualizar los elementos */
    width: 80%;
    /* Ancho ajustado de los hijos */
    text-align: center;
  }

  .lower-text {
    padding: 1rem;
    padding-bottom: .2em;
    /* Espacio interno en cada div */
    /* background-color: lightgray; */
    /* Fondo para visualizar los elementos */
    width: 90%;
    /* Ancho ajustado de los hijos */
    text-align: center;
  }
}

@media (max-width: 480px) {
  .text-overlay h1 {
    font-size: 3vw;
  }

  .text-overlay h2 {
    font-size: 2.9vw;
  }
}
</style>
