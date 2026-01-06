/**
 * Normaliza un nombre eliminando acentos, caracteres especiales,
 * títulos comunes y espacios extra.
 * @param {string} name - El nombre a normalizar.
 * @returns {string} El nombre normalizado.
 */
export function normalizeName(name) {
  if (!name) return ''
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/^(dra?|psic|lic|ing|arq|mtra?)\.?\s+/i, '') // Remover títulos comunes
    .replace(/[^a-z0-9\s]/g, '') // Remover caracteres especiales (puntos, comas, etc.)
    .trim()
}

/**
 * Compara dos nombres para ver si se refieren a la misma persona.
 * Utiliza una estrategia de coincidencia de tokens (palabras).
 * Retorna true si todos los tokens del nombre más corto están presentes en el nombre más largo.
 *
 * Ejemplos que dan true:
 * - "Luis Galván" vs "Luis A. Galván Solís"
 * - "Miriam Cervantes" vs "Miriam Cervantes Huerta"
 * - "Carina Lares" vs "Carina Lares Cervantes"
 *
 * @param {string} name1
 * @param {string} name2
 * @returns {boolean}
 */
export function areNamesEquivalent(name1, name2) {
  if (!name1 || !name2) return false

  const norm1 = normalizeName(name1)
  const norm2 = normalizeName(name2)

  // 1. Coincidencia exacta
  if (norm1 === norm2) return true

  // 2. Tokenización
  // Para "Luis A. Galván", "a" es un token. Si "Luis Galván" no tiene "a", fallaría si exigimos TODOS.
  // Mejor estrategia: El nombre MÁS CORTO debe ser un subconjunto del MÁS LARGO.

  // Vamos a filtrar tokens muy cortos (1 letra) para evitar falsos negativos por iniciales (ej. "A.")
  // a menos que el nombre sea muy corto.
  const filterTokens = (tokens) => tokens.filter((t) => t.length > 0)

  const t1 = filterTokens(norm1.split(/\s+/))
  const t2 = filterTokens(norm2.split(/\s+/))

  const set1 = new Set(t1)
  const set2 = new Set(t2)

  // Identificar cuál es el conjunto "menor" (o subset esperado) y cuál es el "mayor" (superset)
  // Pero cuidado: "Luis Galván" (2 tokens) vs "Luis A. Galván" (3 tokens).
  // "Luis" y "Galván" están en el segundo. "A" no está en el primero.
  // Entonces verificamos si TODOS los tokens de uno están en el otro.

  // Check if t1 is subset of t2
  const t1IsSubset = t1.every((token) => set2.has(token))

  // Check if t2 is subset of t1
  const t2IsSubset = t2.every((token) => set1.has(token))

  // Si uno es subconjunto del otro, asumimos match.
  // Excepción: Nombres muy comunes solo con un nombre. "Luis" vs "Luis Perez".
  // Pero en este contexto de especialistas, es seguro asumir que si coinciden "Luis" y "Galván", es la misma persona.

  return t1IsSubset || t2IsSubset
}
