<script setup>
import CardsExample2 from '@/components/CardsExample2.vue'
import featured from '@/components/featured.vue'
// import Footer from '@/components/Footer.vue'
</script>

<template>
  <main class="about-page">
    <featured />

    <section class="content-section">
      <div class="cards-container">
        <CardsExample2 />
      </div>
    </section>

    <!-- <Footer /> -->
  </main>
</template>

<style scoped>
.about-page {
  width: 100%;
  overflow-x: hidden;
}

.content-section {
  padding: 4rem 2rem;
  /* background-color: var(--color-background-soft); */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color, #ed1c24);
  margin-bottom: 1rem;
  text-align: center;
}

.section-description {
  font-size: 1.2rem;
  color: var(--color-text);
  max-width: 800px;
  text-align: center;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.cards-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content-section {
    padding: 3rem 1rem;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>
