<template>
    <div>
        <!-- Contenedor principal del video -->
        <div id="fb-root"></div>
        <div class="video-viewer">
            <div class="fb-video" :data-href="selectedVideo.url" :data-width="width" :data-show-text="showText">
                <div class="fb-xfbml-parse-ignore">
                    <blockquote :cite="selectedVideo.url">
                        <a :href="selectedVideo.url">{{ selectedVideo.title }}</a>
                        <p>{{ selectedVideo.description }}</p>
                        Posted by <a :href="selectedVideo.posterUrl">{{ selectedVideo.poster }}</a> on
                        {{ selectedVideo.postDate }}
                    </blockquote>
                </div>
            </div>
        </div>

        <!-- Lista de miniaturas -->
        <div class="thumbnails">
            <div v-for="(video, index) in videoList" :key="index" class="thumbnail" @click="selectVideo(video)">
                <img :src="video.thumbnail" :alt="video.title" />
                <p>{{ video.title }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        videoList: {
            type: Array,
            required: true,
        },
        width: {
            type: String,
            default: "500",
        },
        showText: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            selectedVideo: {},
        };
    },
    mounted() {
        // Seleccionar el primer video por defecto
        this.selectedVideo = this.videoList[0];

        // Cargar el SDK de Facebook si no está cargado
        if (!window.FB) {
            const sdkScript = document.createElement("script");
            sdkScript.async = true;
            sdkScript.defer = true;
            sdkScript.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2";
            document.body.appendChild(sdkScript);
        } else {
            this.parseFbVideo();
        }
    },
    methods: {
        parseFbVideo() {
            // Volver a analizar el DOM para elementos XFBML
            if (window.FB) {
                window.FB.XFBML.parse();
            }
        },
        selectVideo(video) {
            // Cambiar al video seleccionado y volver a analizar
            this.selectedVideo = video;
            this.$nextTick(() => this.parseFbVideo());
        },
    },
};
</script>

<style scoped>
.video-viewer {
    margin-bottom: 20px;
}

.thumbnails {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.thumbnail {
    cursor: pointer;
    text-align: center;
    width: 150px;
}

.thumbnail img {
    width: 100%;
    height: auto;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s;
}

.thumbnail:hover img {
    transform: scale(1.05);
}
</style>
