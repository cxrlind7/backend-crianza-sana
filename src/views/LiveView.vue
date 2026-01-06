<template>
  <div class="live-wrapper">
    <div class="event-header">
      <h1 class="event-title">Hablar salva vidas: Prevención del suicidio en adolescentes </h1>
      <!-- <h3 class="event-title1">100 programas al aire</h3> -->
      <p class="event-date">Jueves, 25 de septiembre de 2025 • 7:30 p.m. (hora CDMX)</p>
      <p class="event-description">
        Autolesiones en la adolescencia. La autolesiones es un fenómeno atravesado por el silencio. Mi hijo murió por
        autolesiones; hablar ayuda a prevenirlo.
      </p>
    </div>

    <!-- <div class="video-container"> -->

    <div style="width:100%;height:0px;position:relative;padding-bottom:56.25%;"><iframe
        src="https://streamyard.com/watch/42fqhRVqiqzf?embed=true" width="100%" height="100%" frameborder="0"
        allow="autoplay; fullscreen"
        style="width:100%;height:100%;position:absolute;left:0px;top:0px;overflow:hidden;"></iframe></div>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  name: "LiveView",
};
</script>

<style scoped>
.live-wrapper {
  background-color: #111827;
  color: white;
  min-height: 100vh;
  /* width: 100vw; */
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.event-header {
  max-width: 900px;
  text-align: center;
  margin-bottom: 2rem;
}

.event-title {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.event-title1 {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.event-date {
  font-size: 1rem;
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.event-description {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #e5e7eb;
  white-space: pre-wrap;
}

.video-container {
  width: 100%;
  height: 100%;
  /* max-width: 960px; */
  aspect-ratio: 16 / 9;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.video-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* 📱 Media Query para dispositivos pequeños */
@media (max-width: 768px) {
  .event-title {
    font-size: 1.5rem;
  }

  .event-description {
    font-size: 1rem;
    text-align: left;
  }

  .event-header {
    text-align: left;
    padding: 0 1rem;
  }

  .video-container {
    border-radius: 0;
    box-shadow: none;
  }

  .live-wrapper {
    background-color: #111827;
    color: white;
    min-height: 100vh;
    /* width: 100vw; */
    padding-top: 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
}
</style>
