<template>
  <div v-if="videos && videos.length > 0" class="person-youtube-section">
    <div class="container-fluid main-container">
      <!-- Título de la sección -->
      <div class="text-center mb-5 fade-in">
        <h6 class="text-uppercase letter-spacing-2 text-muted mb-2">Canal de YouTube</h6>
        <h2 class="display-6 fw-bold text-dark">Videos Recientes</h2>
        <a
          v-if="channelUrl"
          :href="channelUrl"
          target="_blank"
          rel="noopener"
          class="channel-link"
          :style="{ color: personColor }"
        >
          <i class="fab fa-youtube me-2"></i>Ver canal completo
        </a>
      </div>

      <!-- Carrusel Swiper -->
      <div class="carousel-container position-relative fade-in delay-1">
        <swiper
          :modules="modules"
          :slides-per-view="slidesPerView"
          :space-between="30"
          :autoplay="{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }"
          :pagination="{ clickable: true, dynamicBullets: true }"
          :navigation="{
            nextEl: '.yt-custom-next',
            prevEl: '.yt-custom-prev',
          }"
          :breakpoints="swiperBreakpoints"
          :loop="videos.length > slidesPerView"
          class="youtube-swiper"
        >
          <swiper-slide v-for="video in videos" :key="video.id" class="h-auto">
            <a
              class="video-card h-100"
              :href="`https://www.youtube.com/watch?v=${video.id}`"
              target="_blank"
              rel="noopener"
            >
              <div class="video-image-wrapper">
                <img :src="thumbnailUrl(video.id)" :alt="video.title" class="video-image" loading="lazy" />
                <span class="play-badge" :style="{ backgroundColor: personColor || '#ff0000' }">
                  <i class="fas fa-play"></i>
                </span>
              </div>

              <div class="video-content">
                <h3 class="video-title">{{ video.title }}</h3>
                <span class="watch-more" :style="{ color: personColor }">
                  Ver en YouTube <i class="fas fa-arrow-right ms-1"></i>
                </span>
              </div>
            </a>
          </swiper-slide>

          <template v-slot:pagination>
            <div class="swiper-pagination"></div>
          </template>
        </swiper>

        <div class="custom-arrow yt-custom-prev" :style="{ '--arrow-color': personColor }">
          <i class="fas fa-chevron-left"></i>
        </div>
        <div class="custom-arrow yt-custom-next" :style="{ '--arrow-color': personColor }">
          <i class="fas fa-chevron-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'

export default {
  name: 'PersonYoutube',
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    videos: {
      type: Array,
      default: () => [],
    },
    channelUrl: {
      type: String,
      default: '',
    },
    personColor: {
      type: String,
      default: '#2563eb',
    },
  },
  data() {
    return {
      modules: [Autoplay, Pagination, Navigation],
      slidesPerView: 1.1,
      swiperBreakpoints: {
        576: { slidesPerView: 1.5, spaceBetween: 20 },
        768: { slidesPerView: 2.2, spaceBetween: 30 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
      },
    }
  },
  methods: {
    thumbnailUrl(id) {
      return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    },
  },
}
</script>

<style scoped>
.person-youtube-section {
  padding: 10px 0;
}

.main-container {
  max-width: 1400px;
  padding-left: 5%;
  padding-right: 5%;
}

.letter-spacing-2 {
  letter-spacing: 2px;
  font-size: 0.85rem;
  font-weight: 600;
}

.channel-link {
  display: inline-flex;
  align-items: center;
  margin-top: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
}

.channel-link:hover {
  text-decoration: underline;
}

.carousel-container {
  padding-bottom: 50px;
}

.youtube-swiper {
  padding: 20px 10px;
  margin: -20px -10px;
}

.swiper-slide {
  height: auto;
  display: flex;
}

.custom-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background-color: var(--dm-surface);
  color: var(--arrow-color);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  border: 2px solid transparent;
}

.yt-custom-prev {
  left: -25px;
}

.yt-custom-next {
  right: -25px;
}

.custom-arrow:hover {
  background-color: var(--arrow-color);
  color: #ffffff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-50%) scale(1.1);
}

.custom-arrow.swiper-button-disabled {
  opacity: 0.4;
  cursor: default;
  pointer-events: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .custom-arrow {
    display: none;
  }
  .main-container {
    padding-left: 15px;
    padding-right: 15px;
  }
  .yt-custom-prev {
    left: 0;
  }
  .yt-custom-next {
    right: 0;
  }
}

.video-card {
  background: var(--dm-surface);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.03);
  text-decoration: none;
  color: inherit;
}

.video-card:hover {
  transform: translateY(-7px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border-color: transparent;
  color: inherit;
}

.video-image-wrapper {
  position: relative;
  height: 220px;
  overflow: hidden;
  background-color: #000;
}

.video-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.video-card:hover .video-image {
  transform: scale(1.05);
}

.play-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  opacity: 0.92;
  transition: transform 0.3s ease;
}

.video-card:hover .play-badge {
  transform: translate(-50%, -50%) scale(1.1);
}

.video-content {
  padding: 20px 25px 25px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.video-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--dm-text);
  margin-bottom: 15px;
  line-height: 1.4;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.watch-more {
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid var(--dm-border);
}

.video-card:hover .watch-more {
  opacity: 0.8;
}

:deep(.swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  background: #ccc;
  opacity: 0.6;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  background: var(--arrow-color) !important;
  width: 25px;
  border-radius: 5px;
  opacity: 1;
}

.fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease-out forwards;
}
.delay-1 {
  animation-delay: 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .person-youtube-section {
    padding: 50px 0;
  }
  .video-image-wrapper {
    height: 180px;
  }
  .video-content {
    padding: 15px 20px 20px;
  }
}
</style>
