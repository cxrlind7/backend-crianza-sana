<template>
    <div class="container">
        <!-- Banderines decorativos -->
        <div class="banner">
            <div class="flag"></div>
            <div class="flag"></div>
            <div class="flag"></div>
            <div class="flag"></div>
            <div class="flag"></div>
        </div>
        <div class="image">
            <img :src="blog.image" alt="Nutriólogo celebrando" />
        </div>

        <div class="content">
            <div class="text-section">
                <!-- <br>
                <h2> Celebrando el día del Nutriólogo: 27 de Enero</h2> -->
                <div class="line"></div>
                <h1>{{ blog.title }}</h1>
                <p>{{ blog.description }}</p>
            </div>
            <router-link :to="{ name: 'BlogDetail', params: { id: blog.id } }" class="button">
                Leer
            </router-link>
        </div>
    </div>
</template>

<script>
import blogs from '../../dataBlog';
export default {
    name: "DiaDelNutriologo",
    data() {
        return {
            blogs,
        };
    },
    computed: {
        blog() {
            // Busca el blog con ID 4
            return this.blogs.find((blog) => blog.id === 8);
        },
    },
};
</script>

<style scoped>
/* Contenedor principal */
.container {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    gap: 20px;
    width: 90%;
    max-width: 1000px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
}

/* Banderines decorativos */
.banner {
    position: absolute;
    top: -30px;
    left: 10px;
    display: flex;
    /* gap: 5px; */
}

.flag {
    width: 60px;
    height: 80px;
    background-color: #d33548;
    clip-path: polygon(0 0, 100% 0, 50% 100%);
}

.flag:nth-child(2) {
    background-color: #ff6331;
}

.flag:nth-child(3) {
    background-color: #62a83e;
}

.flag:nth-child(4) {
    background-color: #f47ab5;
}

.flag:nth-child(5) {
    background-color: #50c3f7;
}

/* Imagen */
.image {
    flex: 1 1 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f9f9f9;
}

.image img {
    width: 100%;
    height: auto;
    border-radius: 2%;
    object-fit: cover;
}

/* Contenido */
.content {
    flex: 1 1 50%;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #ffffff;
}

.text-section {
    margin-bottom: 20px;
}

.line {
    width: 80px;
    height: 4px;
    background-color: #fe4b4b;
    margin-bottom: 20px;
    border-radius: 2px;
}

.content h1 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333333;
    margin-bottom: 15px;
}

.content p {
    font-size: 1rem;
    line-height: 1.6;
    color: #555555;
    text-align: justify;
    margin-bottom: 20px;
}

/* Botón */
.button {
    background-color: #fe4b4b;
    color: white;
    text-transform: uppercase;
    text-decoration: none;
    padding: 12px 30px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    align-self: flex-start;
    transition: all 0.3s ease;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.button:hover {
    background-color: #e04343;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Responsividad */
@media (max-width: 768px) {
    .container {
        flex-direction: column;
        /* padding-top: 0; */
    }

    /* .container div{
        padding-top: 0px;
    } */

    .image {
        margin-top: -4rem;
        flex: none;
        width: 100%;
        background-color: #f0f0f0;
    }

    .image img {
        width: 100%;
        /* padding-top: -4rem; */
        height: 100%;
        border-radius: 0;
    }

    .content {
        flex: none;
        width: 100%;
        padding: 20px;
    }

    .content h1 {
        font-size: 1.5rem;
    }

    .content p {
        font-size: 0.9rem;
    }

    .button {
        align-self: center;
    }

    .flag {
        position: relative;
        width: 40px;
        height: 40px;
        background-color: #ffb703;
        clip-path: polygon(0 0, 100% 0, 50% 100%);
    }

    .banner {
        position: relative;
        top: auto;
        left: 10px;
        display: flex;
        gap: 22px;
    }

}
</style>
