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
// import Ad from '@/components/Ad.vue'

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

      <!-- <div class="thank-you-banner">
        <div class="banner-content">
          <div class="icon-box">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="heart-icon"
            >
              <path
                d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
              />
            </svg>
          </div>
          <div class="text-content">
            <p class="main-message">
              El equipo de <strong>Crianza Sana</strong> agradece su confianza y el acompañamiento
              que brindan a sus hijos cada día.
            </p>
            <div class="divider"></div>
            <p class="wishes">
              ✨ Les deseamos un feliz cierre de año y un año nuevo lleno de
              <strong>calma, presencia y acompañamiento.</strong>
            </p>
          </div>
        </div>
      </div> -->
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
/* Main Banner Container */
.thank-you-banner {
  /* Slightly more vibrant gradient */
  background: linear-gradient(135deg, #d9f4f2 0%, #ffeaf2 100%);
  border-radius: 20px;
  margin: 30px auto;
  max-width: 700px;
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
  padding: 30px 40px;
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
    padding: 20px 20px;
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
