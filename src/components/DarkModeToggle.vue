<script setup>
import { useDarkMode } from '@/composables/useDarkMode'

const { isDark, toggleDark } = useDarkMode()
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :class="{ 'is-dark': isDark }"
    @click="toggleDark"
    :aria-pressed="isDark"
    :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
    :title="isDark ? 'Modo claro' : 'Modo oscuro'"
  >
    <span class="theme-toggle-track">
      <span class="theme-toggle-icon sun">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="4.5" fill="currentColor" />
          <g stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <line x1="12" y1="1.5" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22.5" />
            <line x1="1.5" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22.5" y2="12" />
            <line x1="4.4" y1="4.4" x2="6.1" y2="6.1" />
            <line x1="17.9" y1="17.9" x2="19.6" y2="19.6" />
            <line x1="4.4" y1="19.6" x2="6.1" y2="17.9" />
            <line x1="17.9" y1="6.1" x2="19.6" y2="4.4" />
          </g>
        </svg>
      </span>
      <span class="theme-toggle-icon moon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span class="theme-toggle-knob"></span>
    </span>
  </button>
</template>

<style scoped>
.theme-toggle {
  --toggle-w: 54px;
  --toggle-h: 28px;
  --knob-size: 22px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
  line-height: 0;
  border-radius: 999px;
}

.theme-toggle:focus-visible {
  outline: 2px solid #ed1c24;
  outline-offset: 3px;
  border-radius: 999px;
}

.theme-toggle-track {
  position: relative;
  display: flex;
  align-items: center;
  width: var(--toggle-w);
  height: var(--toggle-h);
  border-radius: 999px;
  background: linear-gradient(135deg, #ffd97a, #ffb347);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
  transition: background 0.4s ease;
}

.theme-toggle.is-dark .theme-toggle-track {
  background: linear-gradient(135deg, #2b2d42, #12121a);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.theme-toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: var(--knob-size);
  height: var(--knob-size);
  border-radius: 50%;
  background: #fffdf5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  transition: transform 0.35s cubic-bezier(0.65, 0, 0.35, 1);
}

.theme-toggle.is-dark .theme-toggle-knob {
  transform: translateX(calc(var(--toggle-w) - var(--knob-size) - 6px));
  background: #e8e8f0;
}

.theme-toggle-icon {
  position: relative;
  z-index: 1;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition:
    opacity 0.3s ease,
    transform 0.35s ease;
}

.theme-toggle-icon svg {
  width: 15px;
  height: 15px;
}

.theme-toggle-icon.sun {
  opacity: 1;
  transform: scale(1) rotate(0deg);
  color: #fff4da;
}

.theme-toggle-icon.moon {
  opacity: 0.55;
  transform: scale(0.85) rotate(-40deg);
  color: #cfd3ff;
}

.theme-toggle.is-dark .theme-toggle-icon.sun {
  opacity: 0.5;
  transform: scale(0.85) rotate(40deg);
}

.theme-toggle.is-dark .theme-toggle-icon.moon {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}
</style>
