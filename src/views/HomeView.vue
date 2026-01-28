<script setup>
import Title from '@/components/Title.vue'
import Services from '@/components/Services.vue'
// import Footer from '@/components/Footer.vue'
import UpcomingProgram from '@/components/UpcomingProgram.vue'
import BlogRecommended from '@/components/BlogRecommended.vue'
import CampaignModal from '@/components/CampaignModal.vue'
import SpotifySection from '@/components/SpotifySection.vue'
import DynamicEventCard from '@/components/DynamicEventCard.vue'
import WorkshopCard from '@/components/WorkshopCard.vue'
import { ref } from 'vue'
import Ad from '@/components/Ad.vue'

const showModal = ref(false)

const closeVideo = () => {
  showModal.value = false
}
</script>

<template>
  <div class="profile-page-wrapper">
    <br />
    <br />
    <div class="todo">
      <Title></Title>
      <CampaignModal v-if="showModal" @close="closeVideo" />
      <Ad />
      <div class="thank-you-banner">
        <div class="banner-content">
          <div class="image-box">
            <img
              src="https://res.cloudinary.com/duiqgfa0v/image/upload/v1769641672/WhatsApp_Image_2026-01-26_at_18.57.02_q9bjld.jpg"
              alt="Imagen de prueba"
              class="banner-img"
            />
          </div>
        </div>
      </div>
      <br />
      <WorkshopCard />
      <br />
      <SpotifySection />
      <br />
      <Services />
      <br />
      <UpcomingProgram />

      <br />
      <BlogRecommended />
    </div>
  </div>
</template>

<style scoped>
.image-box {
  flex-shrink: 0;
  margin-bottom: 0;
}

.banner-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  border-radius: 20px 20px 0 0; /* Optional: match container radius if desired, or just 0 if full bleed */
}

@media (min-width: 600px) {
  .image-box {
    margin-bottom: 0;
  }
}

/* Main Banner Container */
.thank-you-banner {
  /* Slightly more vibrant gradient */
  background: linear-gradient(135deg, #d9f4f2 0%, #ffeaf2 100%);
  border-radius: 20px;
  margin: 30px auto;
  max-width: 500px;
  position: relative;
  box-shadow:
    0 10px 25px -5px rgba(168, 237, 234, 0.4),
    0 8px 10px -6px rgba(254, 214, 227, 0.4);
  /* Glassmorphism subtle border */
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  overflow: hidden;
}

.thank-you-banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.1);
}

/* Inner Layout */
.banner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  text-align: center;
}

/* Icon Styles */
.icon-box {
  background: rgba(255, 255, 255, 0.6);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.heart-icon {
  width: 24px;
  height: 24px;
  color: #ff8fa3; /* Soft pink for the heart */
}

/* Typography */
.main-message {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #4a5568;
  font-size: 1.05rem;
  line-height: 1.6;
  margin: 0;
}

.main-message strong {
  color: #2d3748;
  font-weight: 700;
}

/* Small divider line */
.divider {
  width: 40px;
  height: 2px;
  background-color: rgba(0, 0, 0, 0.05);
  margin: 15px auto;
}

.wishes {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #555;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  font-style: italic;
}

.wishes strong {
  color: #d53f8c; /* A slightly deeper pink for emphasis */
}

/* Media query for mobile */
@media (max-width: 600px) {
  .banner-content {
    padding: 0;
  }
  .thank-you-banner {
    margin: 20px 15px; /* Add side margins on mobile */
  }
}

.todo {
  position: relative;
  z-index: 2;
}

.profile-page-wrapper {
  position: relative;
  min-height: 100vh;
}
</style>
