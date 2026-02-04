import 'dotenv/config'

console.log('🔍 Analizando configuración...')

const key = process.env.FIREBASE_SERVICE_ACCOUNT

if (!key) {
  console.error('❌ ERROR: No se encontró la variable FIREBASE_SERVICE_ACCOUNT en .env')
  process.exit(1)
}

console.log(`📏 Longitud de la cadena: ${key.length} caracteres`)
console.log(`🔎 Comienza con: ${key.substring(0, 20)}...`)
console.log(`🔎 Termina con: ...${key.substring(key.length - 20)}`)

try {
  JSON.parse(key)
  console.log('✅ JSON VÁLIDO. El problema podría estar en otro lado.')
} catch (error) {
  console.error('❌ ERROR DE SINTAXIS JSON:', error.message)

  // Try to hint where it's broken
  if (key.includes('\n')) {
    console.warn(
      '⚠️ ADVERTENCIA: La variable tiene saltos de línea. Asegúrate de que esté todo en una sola línea o entre comillas dobles.',
    )
  }
}
