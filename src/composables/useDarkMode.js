import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'theme-preference'

function getStoredPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function prefersDarkSystem() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

const stored = getStoredPreference()
const isDark = ref(stored ? stored === 'dark' : prefersDarkSystem())

function applyTheme(dark) {
  const root = document.documentElement
  root.setAttribute('data-theme', dark ? 'dark' : 'light')
  root.setAttribute('data-bs-theme', dark ? 'dark' : 'light')
}

// Keep in sync with the OS preference when the user hasn't chosen manually.
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!getStoredPreference()) {
      isDark.value = e.matches
    }
  })
}

watchEffect(() => {
  applyTheme(isDark.value)
})

export function useDarkMode() {
  function toggleDark() {
    isDark.value = !isDark.value
    try {
      localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    } catch {
      /* localStorage unavailable (private mode, etc.) — theme still works for this session */
    }
  }

  function setDark(value) {
    isDark.value = value
    try {
      localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    } catch {
      /* ignore */
    }
  }

  return { isDark, toggleDark, setDark }
}
