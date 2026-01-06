<template lang="html">
    <div class="container">
        <div class="element">
            <img :src="src" alt="Imagen programa" class="rounded-image" :style="{ borderColor: borderColor }">
            <h3 class="name" :style="{ color: borderColor }">{{ name }}</h3>
            <h4 class="title">{{ title }}</h4>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        src: {
            type: String, // URL de la imagen
            required: true,
        },
        borderColor: {
            type: String, // El color del borde
            default: "#000", // Negro como valor predeterminado
        },
        name: {
            type: String,
            default: "Nombre no especificado", // Texto predeterminado
        },
        title: {
            type: String,
            default: "Título no especificado", // Texto predeterminado
        },
    },

};
</script>
<!-- 
<style scoped>
.container {
    display: flex;
    /* Usa Flexbox para alinear elementos horizontalmente */
    flex-wrap: wrap;
    /* Permite que los elementos se muevan a la siguiente línea si no hay espacio */
    justify-content: center;
    /* Centra los elementos horizontalmente */
    gap: 10px;
    /* Ajusta el espacio horizontal y vertical entre elementos */
    text-align: center;
    /* Centra el contenido dentro de cada elemento */
}

.element {
    margin: 0;
    /* Elimina márgenes internos del elemento */
    padding: 0px;
    /* Opcional: agrega un poco de espacio interno */
}

.name {
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
    /* Sombra negra con transparencia */
}

.title {
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    margin-top: -10px;
    /* Sombra negra con transparencia */
}

/* Estilo para imágenes redondeadas */
.rounded-image {
    width: 20vw;
    /* Depende del ancho de la ventana */
    height: 20vw;
    /* Mantiene proporciones */
    object-fit: cover;
    /* Ajusta el contenido de la imagen */
    border-radius: 50%;
    /* Hace la imagen redondeada */
    border: 5px solid;
    /* Borde cuyo color se define por la prop */
}
</style> -->

<style scoped>
.container {
    display: flex;
    flex-wrap: wrap;
    /* justify-content: space-between; */
    justify-content: center;
    text-align: center;
}

.element {
    text-align: center;
}

.name {
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
    font-size: 1.2rem;
}

.title {
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    margin-top: -10px;
    font-size: 1rem;
}

.rounded-image {
    width: 15vw;
    height: 15vw;
    object-fit: cover;
    border-radius: 50%;
    border: 5px solid;
    transition: all 0.3s;
}

@media (max-width: 992px) {
    .rounded-image {
        width: 15vw;
        height: 15vw;
    }

    .name {
        font-size: 1rem;
    }

    .title {
        font-size: 0.9rem;
    }
}

@media (max-width: 768px) {
    .rounded-image {
        width: 30vw;
        height: 30vw;
    }

    .name {
        font-size: 0.9rem;
    }

    .title {
        font-size: 0.8rem;
    }
}
</style>
