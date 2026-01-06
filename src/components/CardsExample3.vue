<template>
    <div class="cards-container">
        <div class="card" v-for="(person, index) in people" :key="index">
            <!-- Cara frontal -->
            <div class="card-face card-front">
                <div class="image-container">
                    <img :src="person.image" alt="Foto de perfil" class="profile-image" />
                </div>
                <div class="info-container">
                    <h3 class="name">{{ person.name }}</h3>
                    <h4 class="title">{{ person.title }}</h4>
                    <p class="description">{{ person.description }}</p>
                    <div class="social-icons">
                        <a v-for="(icon, i) in person.socials" :key="i" :href="icon.link" target="_blank">
                            <i :class="icon.iconClass"></i>
                        </a>
                    </div>
                </div>
            </div>
            <!-- Cara trasera -->
            <div class="card-face card-back">
                <p class="background-phrase">"Sigue avanzando, los sueños se cumplen"</p>
            </div>
        </div>
    </div>
</template>



<script>
export default {
    data() {
        return {
            people: [
                {
                    name: "Bianca Viridiana Gámiz Macías",
                    title: "Lic. Terapia de la Comunicación Humana",
                    description:
                        "Brindo intervención de calidad para identificar, diagnosticar y tratar dificultades del habla y lenguaje, respetando el desarrollo de cada peque. Conmigo tendrán una aliada empática en el crecimiento integral de su hijo/a.",
                    image: '../public/individualPhotos/BiancaMacias1.jpg',
                    socials: [
                        { iconClass: "fab fa-tiktok", link: "#" },
                        { iconClass: "fab fa-instagram", link: "#" },
                        { iconClass: "fab fa-facebook", link: "#" },
                    ],
                },
                {
                    name: "Silvia Andrea Soria Díaz",
                    title: "Lic. En Nutrición",
                    description:
                        "Ofrezco soluciones científicas y personalizadas para mejorar tu salud, con planes nutricionales accesibles que tratan diabetes, hipotiroidismo y nutrición deportiva.",
                    image: '../public/individualPhotos/AndreaSoria1.jpg',
                    socials: [
                        { iconClass: "fab fa-tiktok", link: "#" },
                        { iconClass: "fab fa-instagram", link: "#" },
                        { iconClass: "fab fa-facebook", link: "#" },
                    ],
                },
                // {
                //     name: "Silvia Andrea Soria Díaz",
                //     title: "Lic. En Nutrición",
                //     description:
                //         "Ofrezco soluciones científicas y personalizadas para mejorar tu salud, con planes nutricionales accesibles que tratan diabetes, hipotiroidismo y nutrición deportiva.",
                //     image: '../public/individualPhotos/MiriamCervantes1.jpg',
                //     socials: [
                //         { iconClass: "fab fa-tiktok", link: "#" },
                //         { iconClass: "fab fa-instagram", link: "#" },
                //         { iconClass: "fab fa-facebook", link: "#" },
                //     ],
                // },
                // {
                //     name: "Silvia Andrea Soria Díaz",
                //     title: "Lic. En Nutrición",
                //     description:
                //         "Ofrezco soluciones científicas y personalizadas para mejorar tu salud, con planes nutricionales accesibles que tratan diabetes, hipotiroidismo y nutrición deportiva.",
                //     image: '../public/individualPhotos/Luis1.jpg',
                //     socials: [
                //         { iconClass: "fab fa-tiktok", link: "#" },
                //         { iconClass: "fab fa-instagram", link: "#" },
                //         { iconClass: "fab fa-facebook", link: "#" },
                //     ],
                // },
            ],
        };
    },
};
</script>

<style scoped>
/* Contenedor principal */
.cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    margin: 20px;
}

/* Tarjeta general */
.card {
    width: 300px;
    height: 400px;
    perspective: 1000px;
    /* Habilita la perspectiva 3D */
}

.card-face {
    width: 100%;
    height: 100%;
    position: absolute;
    backface-visibility: hidden;
    /* Oculta la parte trasera */
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.6s;
}

/* Cara frontal */
.card-front {
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* Cara trasera */
.card-back {
    background-color: #3b82f6;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: rotateY(180deg);
    /* Esconde esta cara inicialmente */
}

.background-phrase {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    padding: 20px;
}

/* Interacción para girar */
.card:hover .card-front {
    transform: rotateY(180deg);
}

.card:hover .card-back {
    transform: rotateY(360deg);
}

/* Imagen */
.image-container {
    background-color: #f8f8f8;
    padding: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.profile-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
}

/* Información */
.info-container {
    padding: 15px;
    text-align: center;
}

.name {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
}

.title {
    font-size: 1rem;
    font-weight: 500;
    color: #555;
    margin-bottom: 10px;
}

.description {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 15px;
    line-height: 1.4;
}

/* Iconos sociales */
.social-icons {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.social-icons a {
    font-size: 1.2rem;
    color: #666;
    transition: color 0.3s;
}

.social-icons a:hover {
    color: #007bff;
}
</style>