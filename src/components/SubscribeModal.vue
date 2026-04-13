<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="subscribe-overlay" @click.self="dismiss">
        <div
          class="subscribe-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="subscribe-title"
        >
          <!-- Close button -->
          <button class="subscribe-close" @click="dismiss" aria-label="Cerrar">
            <i class="bi bi-x-lg"></i>
          </button>

          <!-- Icon -->
          <div class="subscribe-icon-wrap">
            <div class="subscribe-icon">🌱</div>
          </div>

          <!-- Content -->
          <h2 id="subscribe-title" class="subscribe-title">¡Mantente al día!</h2>
          <p class="subscribe-desc">
            Recibe en tu correo los nuevos <strong>blogs</strong> y <strong>programas</strong> de
            Crianza Sana by D&apos;Kids.
          </p>

          <!-- Form -->
          <div v-if="!submitted">
            <div class="subscribe-input-wrap">
              <i class="bi bi-envelope subscribe-input-icon"></i>
              <input
                id="subscribe-email-input"
                v-model="email"
                type="email"
                class="subscribe-input"
                placeholder="tu@correo.com"
                @keyup.enter="subscribe"
                :disabled="loading"
              />
            </div>

            <p v-if="errorMsg" class="subscribe-error">
              <i class="bi bi-exclamation-circle me-1"></i>{{ errorMsg }}
            </p>

            <button class="subscribe-btn" @click="subscribe" :disabled="loading || !email">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'Suscribiendo...' : 'Suscribirme gratis' }}
            </button>

            <button class="subscribe-skip" @click="dismiss">No, gracias</button>
          </div>

          <!-- Success state -->
          <div v-else class="subscribe-success">
            <div class="success-check">✅</div>
            <h3>¡Listo!</h3>
            <p>Te hemos enviado un correo de bienvenida. Revisa tu bandeja de entrada.</p>
            <button class="subscribe-btn" @click="dismiss">Cerrar</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { subscribeEmail } from '@/composables/useFirestore'

const STORAGE_KEY = 'csdkids_subscribe_dismissed'

export default {
  name: 'SubscribeModal',
  data() {
    return {
      visible: false,
      email: '',
      loading: false,
      submitted: false,
      errorMsg: '',
    }
  },
  mounted() {
    // Show modal after 4 seconds only on first visit
    const alreadySeen = localStorage.getItem(STORAGE_KEY)
    if (!alreadySeen) {
      setTimeout(() => {
        this.visible = true
      }, 4000)
    }
  },
  methods: {
    dismiss() {
      this.visible = false
      localStorage.setItem(STORAGE_KEY, '1')
    },
    async subscribe() {
      this.errorMsg = ''
      if (!this.email || !this.email.includes('@')) {
        this.errorMsg = 'Por favor ingresa un correo válido.'
        return
      }
      this.loading = true
      try {
        const result = await subscribeEmail(this.email)
        if (result.success) {
          this.submitted = true
          localStorage.setItem(STORAGE_KEY, '1')
        } else if (result.alreadyExists) {
          this.errorMsg = '¡Ya estás suscrito/a con ese correo!'
        } else {
          this.errorMsg = result.error || 'Ocurrió un error. Intente de nuevo.'
        }
      } catch {
        this.errorMsg = 'Ocurrió un error. Intente de nuevo.'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
/* Overlay */
.subscribe-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* Modal card */
.subscribe-modal {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  max-width: 440px;
  width: 100%;
  text-align: center;
  box-shadow:
    0 25px 60px rgba(124, 58, 237, 0.2),
    0 0 0 1px rgba(124, 58, 237, 0.1);
}

/* Close */
.subscribe-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.1rem;
  color: #9ca3af;
  cursor: pointer;
  line-height: 1;
  padding: 4px;
  border-radius: 50%;
  transition:
    color 0.2s,
    background 0.2s;
}
.subscribe-close:hover {
  color: #374151;
  background: #f3f4f6;
}

/* Icon bubble */
.subscribe-icon-wrap {
  margin-bottom: 1rem;
}
.subscribe-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  border-radius: 50%;
  font-size: 2rem;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.35);
}

/* Typography */
.subscribe-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}
.subscribe-desc {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}
.subscribe-desc strong {
  color: #7c3aed;
}

/* Input */
.subscribe-input-wrap {
  position: relative;
  margin-bottom: 1rem;
}
.subscribe-input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1rem;
}
.subscribe-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.95rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  outline: none;
  background: #f9fafb;
}
.subscribe-input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  background: #fff;
}

/* Error */
.subscribe-error {
  color: #dc2626;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
  text-align: left;
}

/* Primary button */
.subscribe-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35);
  margin-bottom: 0.75rem;
}
.subscribe-btn:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45);
}
.subscribe-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Skip link */
.subscribe-skip {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  transition: color 0.2s;
}
.subscribe-skip:hover {
  color: #6b7280;
}

/* Success */
.subscribe-success {
  text-align: center;
}
.success-check {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}
.subscribe-success h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}
.subscribe-success p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

/* Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-active .subscribe-modal,
.modal-fade-leave-active .subscribe-modal {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .subscribe-modal {
  transform: scale(0.92) translateY(20px);
}
.modal-fade-leave-to .subscribe-modal {
  transform: scale(0.92) translateY(10px);
  opacity: 0;
}
</style>
