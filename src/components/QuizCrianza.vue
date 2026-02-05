<template>
  <div class="quiz-container">
    <div class="mesh-gradient-bg"></div>

    <div class="container d-flex flex-column align-items-center mt-5 position-relative">
      <!-- Card Principal -->
      <div class="card quiz-card shadow-lg border-0 rounded-4 animate__animated animate__fadeInUp">
        <div class="card-body p-4 p-md-5 text-center position-relative overflow-hidden">
          <!-- Elementos Decorativos Flotantes (Solo en Pasos 0 y 1) -->
          <div v-if="step < 2" class="floating-icons">
            <div class="float-icon icon-1">❓</div>
            <div class="float-icon icon-2">💭</div>
            <div class="float-icon icon-3">❔</div>
          </div>

          <!-- PASO 0: DASHBOARD (GRID DE TARJETAS) -->
          <div v-if="step === 0" class="step-dashboard fade-in">
            <!-- <h2 class="fw-bold mb-4" style="color: #4a1a1a">Tu Camino de Crianza</h2> -->
            <p class="text-muted mb-5">Descubre una nueva área de apoyo cada 2 días.</p>

            <div class="row row-cols-2 row-cols-md-3 g-4 justify-content-center">
              <div v-for="(cat, index) in categories" :key="cat.id" class="col">
                <div
                  class="card h-100 border-0 shadow-sm category-card"
                  :class="{ locked: !isUnlocked(index), unlocked: isUnlocked(index) }"
                  @click="startQuiz(cat, index)"
                >
                  <div
                    class="card-body d-flex flex-column align-items-center justify-content-center p-3"
                  >
                    <div class="card-icon mb-3">
                      <span v-if="isUnlocked(index)" style="font-size: 2.5rem">{{
                        cat.emoji
                      }}</span>
                      <span v-else style="font-size: 2.5rem">🔒</span>
                    </div>
                    <h6 class="card-title fw-bold text-dark mb-0" style="font-size: 0.9rem">
                      {{ cat.name }}
                    </h6>
                    <small
                      v-if="!isUnlocked(index)"
                      class="text-muted mt-2"
                      style="font-size: 0.7rem"
                    >
                      Disponible el {{ getUnlockDate(index) }}
                    </small>

                    <!-- Acciones de Compartir (Solo si desbloqueado o incluso bloqueado? Mejor solo desbloqueado para no spoilear o frustrar) -->
                    <!-- El usuario pidió "each one of the cards", así que lo pondremos en todas, pero el deep link validará si se puede abrir. -->
                    <div class="share-actions mt-3 d-flex gap-2" @click.stop>
                      <button
                        class="btn btn-sm btn-light rounded-circle shadow-sm share-btn"
                        @click="shareLink(cat.id)"
                        title="Copiar enlace"
                      >
                        🔗
                      </button>
                      <button
                        class="btn btn-sm btn-primary rounded-circle shadow-sm share-btn facebook-btn"
                        @click="shareFacebook(cat.id)"
                        title="Compartir en Facebook"
                        style="background-color: #1877f2; border: none"
                      >
                        f
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botón de reset para debug (Opcional, quitar en prod) -->
            <!-- <button @click="resetProgress" class="btn btn-link btn-sm text-muted mt-5">Reiniciar Progreso</button> -->
          </div>

          <!-- PASO 1: PREGUNTAS -->
          <div v-else-if="step === 1" class="step-questions fade-in">
            <!-- Barra de Progreso -->
            <div
              class="progress mb-4"
              style="height: 10px; border-radius: 5px; background-color: #f0f0f0"
            >
              <div
                class="progress-bar bg-gradient-primary"
                role="progressbar"
                :style="{ width: progressPercentage + '%' }"
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>

            <!-- Categoría Actual (Opcional mostrarla) -->
            <!-- <h6 class="text-uppercase text-muted letter-spacing-2 mb-3">{{ currentCategoryName }}</h6> -->

            <!-- Pregunta con Transición -->
            <transition name="fade" mode="out-in">
              <div :key="currentQuestionIdx" class="question-block mb-2">
                <h3 class="fw-bold mb-4" style="color: #2c3e50">
                  {{ currentQuestion }}
                </h3>

                <div class="d-grid gap-3 d-md-flex justify-content-center">
                  <button
                    @click="handleAnswer('si')"
                    class="btn btn-light btn-lg rounded-pill px-4 border shadow-sm answer-btn"
                  >
                    <span class="btn-letter">A.</span> Sí
                  </button>
                  <button
                    @click="handleAnswer('a_veces')"
                    class="btn btn-light btn-lg rounded-pill px-4 border shadow-sm answer-btn"
                  >
                    <span class="btn-letter">B.</span> A veces
                  </button>
                  <button
                    @click="handleAnswer('no')"
                    class="btn btn-light btn-lg rounded-pill px-4 border shadow-sm answer-btn"
                  >
                    <span class="btn-letter">C.</span> No
                  </button>
                </div>

                <!-- Navigation Buttons -->
                <div class="mt-5 d-flex justify-content-between align-items-center gap-2">
                  <button
                    @click="prevQuestion"
                    :disabled="currentQuestionIdx === 0"
                    class="btn-nav-prev rounded-pill px-4 py-2"
                  >
                    <i class="bi bi-arrow-left me-2"></i> Anterior
                  </button>
                  <button @click="resetQuiz" class="btn-nav-reset rounded-pill px-4 py-2">
                    <i class="bi bi-arrow-counterclockwise me-2"></i> Reiniciar
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <!-- PASO 2: RESULTADO -->
          <div v-else-if="step === 2 && finalResult" class="step-result fade-in">
            <h2 class="fw-bold mb-3" style="color: #2c3e50">{{ finalResult.name }}</h2>

            <!-- Icono del Resultado (Solo Emoji) -->
            <div class="result-image-container mb-4">
              <div
                class="rounded-circle d-flex align-items-center justify-content-center bg-light mx-auto shadow"
                style="width: 150px; height: 150px; font-size: 5rem"
              >
                {{ finalResult.emoji || '🧩' }}
              </div>
            </div>

            <p class="lead mb-4 px-md-4" style="font-size: 1.1rem; line-height: 1.6">
              {{ finalResult.resultMessage }}
            </p>

            <div class="cta-section mb-5">
              <span class="d-block fw-bold mb-2 text-uppercase letter-spacing-1"
                >Siguientes pasos</span
              >

              <!-- Opción 1: Enlace interno (Blogs) -->
              <router-link
                v-if="finalResult.ctaLink"
                :to="finalResult.ctaLink"
                class="btn btn-primary btn-lg rounded-pill px-4 shadow hover-scale d-inline-flex align-items-center gap-2"
                style="border: none"
              >
                <i class="bi bi-book fs-4"></i>
                <span>{{ finalResult.ctaText }}</span>
              </router-link>

              <!-- Opción 2: WhatsApp (Default) -->
              <a
                v-else
                :href="whatsappLink"
                target="_blank"
                class="btn btn-success btn-lg rounded-pill px-4 shadow hover-scale d-inline-flex align-items-center gap-2"
                style="background-color: #25d366; border: none"
              >
                <i class="bi bi-whatsapp fs-4"></i>
                <span>{{ finalResult.ctaText || 'Contactar Especialista' }}</span>
              </a>
            </div>

            <hr class="mx-auto w-50" style="opacity: 0.2" />

            <!-- Footer de Logos -->
            <div class="logos-footer mt-4 d-flex justify-content-center align-items-center gap-4">
              <div class="text-center">
                <img
                  src="@/assets/csbdk.png"
                  alt="Crianza Sana"
                  class="footer-logo"
                  style="height: 40px; object-fit: contain"
                />
              </div>
              <div v-if="finalResult.logo" class="text-center">
                <img
                  :src="finalResult.logo"
                  :alt="finalResult.contactName"
                  class="footer-logo"
                  style="height: 40px; object-fit: contain"
                />
                <small class="d-block text-muted mt-1" style="font-size: 0.7rem">{{
                  finalResult.contactName
                }}</small>
              </div>
            </div>

            <!-- Sección de Compartir en Resultados -->
            <div class="share-result-section mt-4 text-center">
              <p class="text-muted mb-2 small">Compartir este test:</p>
              <div class="d-flex justify-content-center gap-3">
                <button
                  class="btn btn-light rounded-circle shadow-sm share-btn p-2"
                  @click="shareLink(selectedCategory.id)"
                  title="Copiar enlace"
                  style="width: 45px; height: 45px; font-size: 1.2rem"
                >
                  🔗
                </button>
                <button
                  class="btn btn-primary rounded-circle shadow-sm share-btn facebook-btn p-2"
                  @click="shareFacebook(selectedCategory.id)"
                  title="Compartir en Facebook"
                  style="
                    background-color: #1877f2;
                    border: none;
                    width: 45px;
                    height: 45px;
                    font-size: 1.2rem;
                    color: white;
                  "
                >
                  f
                </button>
              </div>
            </div>

            <button
              @click="resetQuiz"
              class="btn btn-link text-muted mt-4 text-decoration-none sm-text"
            >
              <i class="bi bi-arrow-counterclockwise"></i> Volver a empezar
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Toast de Notificación -->
    <transition name="toast-fade">
      <div v-if="showToast" class="toast-notification">
        <div class="toast-content">
          <span class="toast-icon">✅</span>
          <span>Enlace copiado al portapapeles</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'QuizCrianza',
  data() {
    return {
      step: 0,
      currentQuestionIdx: 0,
      answers: {}, // { categoriaId: score }
      finalResult: null,
      selectedCategory: null,
      startDate: null,
      showToast: false, // Toast State

      categories: [
        {
          id: 'pediatria',
          name: 'Pediatría / Cardiología',
          emoji: '🩺',
          questions: [
            '¿Se enferma seguido de gripa, tos, garganta o estómago y tarda mucho en recuperarse?',
            '¿Lo notas más cansado de lo normal, con poco apetito o cambios en su sueño/energía?',
            '¿Sientes que algo “no te cuadra” en su salud, aunque no sepas explicar exactamente qué?',
          ],
          resultMessage:
            'Podría necesitar una valoración pediátrica general. Un chequeo oportuno ayuda a detectar a tiempo pequeños problemas antes de que se vuelvan grandes.',
          contactPhone: '526183711950', // Miriam Cervantes Huerta
          contactName: 'Miriam Cervantes Huerta',
          ctaText: 'Agenda su revisión pediátrica',
        },
        {
          id: 'psicologia',
          name: 'Psicología Infantil',
          emoji: '❤️',
          questions: [
            '¿Tu hijo tiene berrinches intensos o explosiones emocionales frecuentes?',
            '¿Le cuesta expresar lo que siente con palabras?',
            '¿Notas ansiedad, miedo, irritabilidad o cambios fuertes de ánimo?',
          ],
          resultMessage:
            'Tu hijo podría beneficiarse de acompañamiento emocional. Un psicólogo infantil puede ayudarle a regular sus emociones, mejorar su conducta y fortalecer su seguridad.',
          contactPhone: '526181875036', // Saraid Chávez
          contactName: 'Saraid Chávez',
        },
        {
          id: 'nutricion',
          name: 'Nutrición',
          emoji: '🍎',
          questions: [
            '¿Es muy selectivo con la comida o rechaza muchos alimentos?',
            '¿Las comidas se convierten en pelea o estrés diario?',
            '¿Tiene cambios de peso, estreñimiento o malestar frecuente?',
          ],
          resultMessage:
            'Podría beneficiarse de orientación nutricional. Un plan adecuado mejora energía, crecimiento y hábitos saludables.',
          contactPhone: '526182692637', // Silvia Andrea Soria Díaz
          contactName: 'Silvia Andrea Soria Díaz',
          ctaText: 'Agenda consulta nutricional',
        },
        {
          id: 'lenguaje',
          name: 'Lenguaje / Comunicación',
          emoji: '👅',
          questions: [
            '¿Le cuesta pronunciar palabras o solo la familia le entiende?',
            '¿Se frustra o evita hablar cuando quiere pedir algo?',
            '¿Comparado con niños de su edad, habla menos o forma frases cortas?',
          ],
          resultMessage:
            'La terapia de lenguaje fortalece su expresión y confianza al comunicarse.',
          contactPhone: '526181072514', // Ana Laura Sosa Nevárez
          contactName: 'Ana Laura Sosa Nevárez',
          image: null,
          ctaText: 'Agenda evaluación de lenguaje',
        },
        {
          id: 'fisioterapia',
          name: 'Fisioterapia',
          emoji: '🤸',
          questions: [
            '¿Se cae con frecuencia o parece torpe al correr/brincar?',
            '¿Se cansa rápido o evita actividades físicas?',
            '¿Notas mala postura o dificultad para coordinar movimientos?',
          ],
          resultMessage:
            'Puede requerir apoyo en desarrollo motor. La fisioterapia pediátrica mejora fuerza, equilibrio y coordinación.',
          contactPhone: '526181682977', // Karen Meraz Cardosa
          contactName: 'Karen Meraz Cardosa',
          ctaText: 'Agenda valoración física',
        },
        {
          id: 'odontopediatria',
          name: 'Odontopediatría',
          emoji: '🦷',
          questions: [
            '¿Evita masticar por dolor o sensibilidad?',
            '¿Notas caries, manchas o sangrado al cepillarse?',
            '¿Nunca ha tenido su primera revisión dental?',
          ],
          resultMessage:
            'Necesita valoración dental infantil. Cuidar los dientes de leche previene problemas futuros.',
          contactPhone: '526181515530', // Patricia Peña Raigosa
          contactName: 'Patricia Peña Raigosa',
          ctaText: 'Agenda consulta odontológica',
        },
        {
          id: 'tcc',
          name: 'Terapia Cognitivo-Conductual',
          emoji: '🧠',
          questions: [
            '¿Tu hijo se preocupa demasiado, piensa “lo peor” o se angustia por cosas pequeñas?',
            '¿Evita situaciones por miedo, inseguridad o vergüenza?',
            '¿Notas conductas repetitivas o difíciles de cambiar como enojo constante o baja autoestima?',
          ],
          resultMessage:
            'Tu hijo podría beneficiarse de Terapia Cognitivo-Conductual. Esta terapia le ayuda a entender lo que piensa y cambiar conductas.',
          contactPhone: '526188409000', // Luis A. Galván Solís
          contactName: 'Luis A. Galván Solís',
          ctaText: 'Agenda valoración terapéutica',
        },
        {
          id: 'legal',
          name: 'Orientación Legal Familiar',
          emoji: '⚖️',
          questions: [
            '¿Estás pasando por separación o conflicto y no sabes cómo organizar lo legal?',
            '¿Tienes dudas sobre pensión, convivencias o permisos escolares?',
            '¿Han hecho acuerdos sobre tu hijo, pero la otra parte no los respeta?',
          ],
          resultMessage:
            'Podría ayudarte una orientación legal familiar. Recibir asesoría te da claridad y respaldo legal.',
          contactPhone: '526181222244', // Roberto Bravo Romo
          contactName: 'Roberto Bravo Romo',
          ctaText: 'Agendar orientación familiar',
        },
      ],

      flattenedQuestions: [],
    }
  },
  computed: {
    currentQuestion() {
      if (!this.flattenedQuestions[this.currentQuestionIdx]) return ''
      return this.flattenedQuestions[this.currentQuestionIdx].text
    },
    progressPercentage() {
      if (this.flattenedQuestions.length === 0) return 0
      return (this.currentQuestionIdx / this.flattenedQuestions.length) * 100
    },
    whatsappLink() {
      if (!this.finalResult) return '#'
      const message = `Hola, realicé el test de Crianza Sana y me gustaría agendar una cita para el área de ${this.finalResult.name}.`
      return `https://wa.me/${this.finalResult.contactPhone}?text=${encodeURIComponent(message)}`
    },
  },
  mounted() {
    this.initSchedule()

    // Deep Linking: Check URL for category
    setTimeout(() => {
      const catId = this.$route.query.cat
      if (catId) {
        const index = this.categories.findIndex((c) => c.id === catId)
        if (index !== -1) {
          if (this.isUnlocked(index)) {
            this.startQuiz(this.categories[index], index)
          } else {
            // Opcional: Mostrar Toast o alerta de que aún no está disponible
            console.log('Categoría bloqueada o no disponible aún')
          }
        }
      }
    }, 500) // Pequeño delay para asegurar carga
  },
  methods: {
    initSchedule() {
      // FECHA DE INICIO GLOBAL: 5 de Febrero, 2026 (Mañana)
      // Ajusta esta fecha según lo requieras.
      this.startDate = new Date('2026-02-05T00:00:00')
    },
    daysPassed() {
      if (!this.startDate) return 0
      const now = new Date()
      // Diferencia en y milisegundos
      const diff = now - this.startDate
      // Convertir a días (permitimos negativos para "faltan X días")
      return Math.floor(diff / (1000 * 60 * 60 * 24))
    },
    isUnlocked(index) {
      const dp = this.daysPassed()
      // Si la fecha de inicio es futuro (dp < 0), todo está bloqueado.
      if (dp < 0) return false

      // Índice 0 se desbloquea en día 0
      // Índice 1 se desbloquea en día 2
      // Índice 2 se desbloquea en día 4
      return dp >= index * 2
    },
    daysToUnlock(index) {
      const dp = this.daysPassed()

      // Si aún no empieza el "día 1" global
      if (dp < 0) {
        const daysToStart = Math.abs(dp)
        return daysToStart + index * 2
      }

      const requiredDays = index * 2
      const left = requiredDays - dp
      return left > 0 ? left : 0
    },
    getUnlockDate(index) {
      if (!this.startDate) return ''
      // Fecha base de desbloqueo = startDate + (index * 2) días
      const unlockDate = new Date(this.startDate)
      unlockDate.setDate(unlockDate.getDate() + index * 2)

      // Formato bonito: "5 de feb."
      return unlockDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    },
    startQuiz(categoryData, index) {
      if (!this.isUnlocked(index)) return

      this.selectedCategory = categoryData
      this.step = 1
      this.currentQuestionIdx = 0
      this.answers = {}
      this.prepareQuestions(categoryData)
    },
    prepareQuestions(categoryData) {
      this.flattenedQuestions = []
      categoryData.questions.forEach((qText) => {
        this.flattenedQuestions.push({
          text: qText,
          categoryId: categoryData.id,
        })
      })
      // Mezclar preguntas aleatoriamente (solo las de esta categoría)
      this.flattenedQuestions.sort(() => 0.5 - Math.random())
    },
    handleAnswer(value) {
      const currentQ = this.flattenedQuestions[this.currentQuestionIdx]

      // Lógica de conteo (ponderación simple)
      if (value === 'si') {
        this.answers[currentQ.categoryId] = (this.answers[currentQ.categoryId] || 0) + 1
      } else if (value === 'a_veces') {
        this.answers[currentQ.categoryId] = (this.answers[currentQ.categoryId] || 0) + 0.5
      }

      this.nextQuestion()
    },
    prevQuestion() {
      if (this.currentQuestionIdx > 0) {
        this.currentQuestionIdx--
        // Optional: Remove last answer if tracking stack, or just let users overwrite
      }
    },
    nextQuestion() {
      if (this.currentQuestionIdx < this.flattenedQuestions.length - 1) {
        this.currentQuestionIdx++
      } else {
        this.calculateResult()
      }
    },
    calculateResult() {
      const cat = this.selectedCategory
      const score = this.answers[cat.id] || 0

      // SI TODO ESTÁ BIEN (Score < 2)
      if (score < 2) {
        this.finalResult = {
          name: '¡Excelente!',
          emoji: '💛',
          resultMessage:
            'Tu hijo va por buen camino 💛. Si quieres seguir fortaleciendo su desarrollo, te invitamos a seguir nuestro contenido y aprender herramientas prácticas para acompañarlo mejor.',
          ctaText: 'Ver contenido educativo',
          ctaLink: '/blog',
          contactPhone: null,
          contactName: 'Crianza Sana By D-Kids',
          logo: null,
          image: null,
        }
      } else {
        // SI NECESITA APOYO (Score >= 2)
        this.finalResult = cat
      }

      this.step = 2 // Ir a Resultados
    },
    resetQuiz() {
      this.step = 0
      this.finalResult = null
      this.answers = {}
      this.currentQuestionIdx = 0
      this.selectedCategory = null
    },
    resetProgress() {
      localStorage.removeItem('quiz_start_date')
      this.initSchedule()
    },
    shareLink(catId) {
      const url = `${window.location.origin}${window.location.pathname}?cat=${catId}`
      navigator.clipboard
        .writeText(url)
        .then(() => {
          this.showToast = true
          setTimeout(() => {
            this.showToast = false
          }, 3000)
        })
        .catch((err) => console.error('Error al copiar', err))
    },
    shareFacebook(catId) {
      // ✅ ASÍ DEBE SER (CORRECTO):
      // Fíjate en el orden: backend-crianza-sana
      const backendUrl = 'https://backend-crianza-sana-production.up.railway.app'
      // const backendUrl = 'http://localhost:8080'

      // Forzamos la ruta /quiz para asegurar que server.js genere los metadatos correctos
      const shareUrl = encodeURIComponent(`${backendUrl}/quiz?cat=${catId}`)
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`

      window.open(facebookShareUrl, 'facebook-share-dialog', 'width=626,height=436')
    },
  },
}
</script>

<style scoped>
/* 1. Asegúrate de que el body no tenga scroll blanco */
:host,
body {
  background-color: #f8f9fa; /* Color base similar al fondo */
  margin: 0;
}

/* 2. Ajusta el contenedor para que no fuerce el alto total si no es necesario */
.quiz-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 40px; /* Espacio extra para que la sombra no se corte */
}

/* 3. Mejora el degradado para que cubra todo el viewport sin importar el scroll */
.mesh-gradient-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background: radial-gradient(circle at 10% 10%, rgba(255, 100, 100, 0.15), transparent 40%),
    radial-gradient(circle at 90% 10%, rgba(100, 255, 255, 0.2), transparent 40%), #ffffff; /* Fondo sólido de respaldo */
}

/* 4. Suaviza la sombra de la tarjeta */
.quiz-card {
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  /* Sombra más difusa y hacia abajo */
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.05),
    0 5px 15px rgba(0, 0, 0, 0.03) !important;
  border-radius: 2rem !important;
  margin-bottom: 20px; /* Margen para que no toque el borde del navegador */
}

/* Animaciones de Entrada */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Botones de Respuesta */
.answer-btn {
  font-weight: 600;
  color: #4a4a4a;
  transition: all 0.2s ease;
  min-height: 55px; /* Altura táctil buena */
  display: flex;
  align-items: center;
  /* Cambio de justify-content: center a flex-start o space-between,
     o simplemente center con gap si quitamos el absolute */
  justify-content: flex-start;
  padding-left: 20px; /* Espacio para el contenido */
  position: relative;
}

.answer-btn:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05) !important;
  border-color: #d1d1d1 !important;
}

.answer-btn:active {
  transform: translateY(0);
}

.btn-letter {
  /* position: absolute;  <-- REMOVIDO para evitar overlap */
  /* left: 20px; */
  font-weight: 700;
  opacity: 0.4;
  margin-right: 12px; /* Separación del texto */
  min-width: 25px; /* Alineación vertical bonita */
}

/* floating icons decoration */
.floating-icons {
  position: absolute;
  top: -30px;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.float-icon {
  position: absolute;
  font-size: 2.5rem;
  opacity: 0.8;
  animation: float 6s ease-in-out infinite;
}

.icon-1 {
  top: -10px;
  left: 10%;
  animation-delay: 0s;
  color: #ff6b6b;
  transform: rotate(-15deg);
}
.icon-2 {
  top: 20px;
  right: 15%;
  animation-delay: 2s;
  color: #4ecdc4;
  font-size: 2rem;
}
.icon-3 {
  bottom: -20px;
  left: 20%;
  animation-delay: 4s;
  color: #ffe66d;
  transform: rotate(15deg);
}

.share-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  font-size: 0.9rem;
}

.share-btn:hover {
  transform: scale(1.1);
}

.facebook-btn {
  color: white;
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

/* Card Styles */
.category-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: white;
  cursor: pointer;
  border-radius: 1.5rem !important;
}

.category-card.unlocked:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.category-card.locked {
  cursor: not-allowed;
  opacity: 0.7;
  background: #f8f9fa;
  filter: grayscale(0.8);
}

.category-card.locked:hover {
  transform: none;
}

.bg-gradient-primary {
  background: linear-gradient(90deg, #4ecdc4 0%, #556270 100%); /* Ejemplo teal-grey */
}

/* Enhanced CTA Button */
.btn-cta {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white !important;
  border: none;
  height: 3rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(108, 92, 231, 0.3) !important;
  background: linear-gradient(135deg, #5f4dd0, #9188f0);
}

.btn-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hover-scale {
  transition: transform 0.2s;
}

/* --- TOAST STYLES --- */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: white;
  border-left: 4px solid #48bb78; /* Green accent */
  border-radius: 8px;
  padding: 1rem 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  z-index: 9999;
  font-family: 'Inter', sans-serif;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2d3748;
  font-weight: 500;
}

.toast-icon {
  font-size: 1.2rem;
}

/* Toast Transitions */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
/* Answer Button Colors on Hover */
/* Answer Button Colors on Hover - Unified */
.answer-btn:hover {
  background-color: #6c5ce7 !important; /* Unified Purple Color */
  border-color: #6c5ce7 !important;
  color: white !important;
  transform: translateY(-2px);
}

.answer-btn:hover .btn-letter {
  background-color: rgba(255, 255, 255, 0.3);
  color: inherit;
}

/* Navigation Buttons */
.btn-nav-prev {
  background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
  color: #4338ca;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(67, 56, 202, 0.15);
}

.btn-nav-prev:hover:not(:disabled) {
  background: linear-gradient(135deg, #c7d2fe, #a5b4fc);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 56, 202, 0.25);
}

.btn-nav-prev:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-nav-reset {
  background: rgba(255, 255, 255, 0.8);
  color: #6b7280;
  border: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.btn-nav-reset:hover {
  background: rgba(255, 255, 255, 1);
  color: #374151;
  border-color: #d1d5db;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.hover-scale:hover {
  transform: scale(1.03);
}

.footer-logo {
  filter: grayscale(100%);
  opacity: 0.7;
  transition: all 0.3s;
}

.footer-logo:hover {
  filter: grayscale(0%);
  opacity: 1;
}

/* Media Queries for better mobile fit */
@media (max-width: 576px) {
  .quiz-card {
    border-radius: 1.5rem !important;
  }
  .card-body {
    padding: 1.5rem !important;
  }
  .answer-btn {
    width: 100%;
  }
  .btn-letter {
    left: 15px;
  }
}

.object-fit-cover {
  object-fit: cover;
}
</style>
