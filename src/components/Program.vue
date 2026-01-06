<template>
    <div class="container programa mt-5 col-md-9">
        <div class="row">
            <div class="logo-container">
                <img src="../assets/csbdk.png" alt="">
            </div>
        </div>
        <div class="line"></div>
        <div class="row">
            <div class="col-md-12 text-center">
                <h3>Visitas al pediatra | Los beneficios de la fisioterapia</h3>
            </div>
        </div>
        <div class="row d-flex justify-content-center">
            <div class="col-6 col-md-4 col-lg-3" v-for="(item, index) in items" :key="index">
                <ImagenPrograma :src="item.image" :borderColor="item.borderColor" :name="item.name"
                    :title="item.title" />
            </div>
        </div>
        <div class="row d-flex justify-content-between align-items-between">
            <div class="col-auto">
                <EventDate />
            </div>
            <div class="col-auto logo-container1">
                <img src="/public/+pop.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
import ImagenPrograma from './ImagenPrograma.vue';
import EventDate from './EventDate.vue';
export default {
    components: {
        ImagenPrograma,
        EventDate, // Registrar el componente
    },
    data() {
        return {
            // Arreglo de objetos (puedes reemplazar con tus datos)
            items: [
                { id: 1, image: '../../MiriamCervantes1.jpg', borderColor: '#f6d411', name: 'Dra. Miriam Cervantes', title: 'Pediatra Cardióloga' },
                { id: 2, image: '../../CarinaLares1.jpg', borderColor: '#f6d411', name: 'TCCI. Carina Lares', title: 'Presentadora' },
                { id: 3, image: '../../KarenMeraz1.jpg', borderColor: '#f6d411', name: 'LFT. Karen Meraz', title: 'Fisioterapeuta' },
                // { id: 4, image: '../../BiancaMacias1.jpg', borderColor: '#f6d411', name: 'Bianca Macias', title: 'Nutrióloga' },
                // { id: 5, image: '../../individualPhotos/AndreaSoria1.jpg', borderColor: '#f6d411', name: 'Andrea Soria', title: 'Nutrióloga' },
                // { id: 5, image: '../../individualPhotos/AndreaSoria1.jpg', borderColor: '#f6d411', name: 'Andrea Soria', title: 'Nutrióloga' },
            ],
        };
    },
    eventInfo: {
        day: 90,
        month: 'DIC',
        year: 2024,
        time: '7:00 PM',
        message: 'sintonízanos por el 95.7 fm',
    },
    color: '#8e356d', // Cambia el color aquí
    mounted() {
        console.log(this.items);
    }
};
</script>

<style scoped>
.programa {
    background-color: #3d89a9;
    width: 70%;
}

.line {
    width: 50%;
    /* Ocupa todo el ancho del contenedor */
    height: 4px;
    /* Grosor de la línea */
    background-color: #f6d411;
    /* Color de la línea */
    margin: 0 auto;
    margin-top: -18px;
    /* Espaciado superior e inferior */
}

.logo-container1 {
    width: 150px;
    /* Tamaño fijo en píxeles para ancho */
    height: 100px;
    /* Tamaño fijo en píxeles para alto */
    display: flex;
    justify-content: center;
    /* Centrar contenido horizontalmente dentro del contenedor */
    align-items: center;
    /* Centrar contenido verticalmente */
    overflow: hidden;
    /* Esconder cualquier contenido fuera del contenedor */
}

.logo-container1 img {
    max-width: 150%;
    /* Asegura que la imagen no exceda el tamaño del contenedor */
    max-height: 150%;
    /* Asegura que la imagen se ajuste verticalmente también */
    object-fit: contain;
    /* Mantén las proporciones originales de la imagen */
}

.logo-container {
    width: 35%;
    max-width: 35%;
    height: auto;
    margin: 0rem;
    overflow: hidden;
}

.logo-container img {
    width: 90%;
    height: 90%;
    margin-top: 0px;
    object-fit: contain;
}

@media (max-width: 768px) {
    .col-lg-3 {
        flex: 0 0 33.33%;
        max-width: 33.33%;
    }

    .col-md-4 {
        flex: 0 0 50%;
        max-width: 50%;
    }
}
</style>