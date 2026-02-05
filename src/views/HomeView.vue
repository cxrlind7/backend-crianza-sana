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
import MainBanner from '@/components/MainBanner.vue'
import { ref } from 'vue'
import Ad from '@/components/Ad.vue'
import QuizCallToAction from '@/components/QuizCallToAction.vue'

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
      <MainBanner />
      <QuizCallToAction />
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

.todo {
  position: relative;
  z-index: 2;
}

.profile-page-wrapper {
  position: relative;
  min-height: 100vh;
}
</style>
