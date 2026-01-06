<template>
  <div class="analytics-page-container">
    <!-- Loading Overlay -->
    <transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem">
          <span class="visually-hidden">Cargando datos...</span>
        </div>
        <p class="mt-3 fw-bold text-muted">Analizando datos...</p>
      </div>
    </transition>

    <!-- Botón de Regresar -->
    <div class="container-fluid px-4 mb-2 fade-in" style="align-self: flex-start">
      <button @click="goBack" class="btn-back">
        <i class="fas fa-arrow-left me-2"></i>
        <span class="d-none d-sm-inline">Regresar al Inicio</span>
      </button>
    </div>

    <div class="content-wrapper" :class="{ 'blur-content': isLoading }">
      <!-- Cabecera -->
      <header class="analytics-header text-center fade-in delay-1">
        <h3
          class="text-uppercase letter-spacing-2 text-dark mb-3 mt-0"
          style="font-size: 1.5rem; opacity: 0.8"
        >
          Panel de Analíticas
        </h3>
        <p class="section-subtitle mb-4">Rendimiento de contenido y comportamiento de audiencia.</p>

        <button class="btn-toggle-filters" @click="showFilters = !showFilters">
          <i class="fas fa-sliders-h me-2"></i>
          {{ showFilters ? 'Ocultar Filtros' : 'Filtrar Datos' }}
        </button>
      </header>

      <!-- Sección de Filtros Desplegable -->
      <transition name="slide-down">
        <section v-if="showFilters" class="controls-section mb-4">
          <div class="controls-container">
            <!-- Filtro de Fechas -->
            <div class="filter-group mb-3">
              <label class="control-label">
                <i class="far fa-calendar-alt me-2"></i>Rango de Fechas:
              </label>
              <div class="date-selector-wrapper">
                <select
                  v-model="selectedTimeRange"
                  class="form-select modern-select"
                  @change="fetchAllData"
                >
                  <option value="7daysAgo">Últimos 7 días</option>
                  <option value="30daysAgo">Últimos 30 días</option>
                  <option value="90daysAgo">Últimos 90 días</option>
                  <option value="2023-01-01">Año actual (desde Ene 1)</option>
                  <option value="2020-08-15">Histórico Completo</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>
              <!-- Custom Date Inputs -->
              <div v-if="selectedTimeRange === 'custom'" class="mt-3 d-flex gap-2">
                <div class="flex-grow-1">
                  <label class="form-label small text-muted">Desde:</label>
                  <input
                    type="date"
                    v-model="customStartDate"
                    class="form-control form-control-sm"
                    @change="fetchAllData"
                  />
                </div>
                <div class="flex-grow-1">
                  <label class="form-label small text-muted">Hasta:</label>
                  <input
                    type="date"
                    v-model="customEndDate"
                    class="form-control form-control-sm"
                    @change="fetchAllData"
                  />
                </div>
              </div>
            </div>

            <!-- Filtro de Especialista -->
            <div class="filter-group">
              <label class="control-label">
                <i class="fas fa-user-md me-2"></i>Filtrar por Especialista:
              </label>
              <div class="date-selector-wrapper">
                <select
                  v-model="selectedPersonId"
                  class="form-select modern-select"
                  @change="fetchAllData"
                >
                  <option value="">Mostrar Todos</option>
                  <option v-for="person in filteredPeopleList" :key="person.id" :value="person.id">
                    {{ person.name }}
                  </option>
                </select>
                <span class="filter-badge mt-2">
                  {{
                    selectedPersonId
                      ? 'Mostrando rendimiento exclusivo del especialista seleccionado.'
                      : 'Mostrando datos globales de todos los especialistas.'
                  }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </transition>

      <!-- Nivel 1: KPIs Resumen (Se actualizan según el filtro de especialista) -->
      <div class="row mb-4 fade-in delay-2 g-3">
        <!-- KPI 1: Visitas Totales -->
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="kpi-card">
            <div class="kpi-icon bg-blue-soft text-blue"><i class="fas fa-eye"></i></div>
            <div class="kpi-data">
              <h3>{{ formatNumber(totalVisits) }}</h3>
              <p>{{ selectedPersonId ? 'Visitas a sus Blogs' : 'Visitas Totales a Blogs' }}</p>
            </div>
          </div>
        </div>
        <!-- KPI 2: Tasa de Interacción -->
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="kpi-card" title="% de sesiones con interacción significativa">
            <div class="kpi-icon bg-purple-soft text-purple"><i class="fas fa-chart-pie"></i></div>
            <div class="kpi-data">
              <h3>{{ avgEngagementRate }}%</h3>
              <p>Tasa de Interacción Prom.</p>
            </div>
          </div>
        </div>
        <!-- KPI 3: Tiempo Promedio -->
        <div class="col-12 col-sm-6 col-lg-3">
          <!-- <div class="kpi-card">
            <div class="kpi-icon bg-orange-soft text-orange"><i class="far fa-clock"></i></div>
            <div class="kpi-data">
              <h3>{{ formatTime(avgEngagementTimeTotal) }}</h3>
              <p>Duración Promedio de Sesión</p>
            </div>
          </div> -->
        </div>
        <!-- KPI 4: Tarjeta del Mejor Blog -->
        <div class="col-12 col-sm-6 col-lg-3" v-if="topBlogData">
          <div class="kpi-card highlight-card">
            <div class="kpi-data w-100">
              <p class="mb-2 text-muted font-small text-uppercase ls-1">
                <i class="fas fa-trophy text-warning me-1"></i>
                {{ selectedPersonId ? 'Su Mejor Blog' : 'Mejor Blog Global' }}
              </p>
              <h5 class="text-truncate fw-bold mb-2" :title="topBlogName">{{ topBlogName }}</h5>
              <div class="d-flex justify-content-between align-items-center">
                <span class="badge bg-primary rounded-pill px-3"
                  >{{ formatNumber(topBlogData.visits) }} visitas</span
                >
                <small class="text-muted"
                  ><i class="far fa-clock me-1"></i
                  >{{ formatTime(topBlogData.avgSessionDuration) }}</small
                >
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3" v-else-if="selectedPersonId && !isLoading">
          <div class="kpi-card bg-light justify-content-center text-muted">
            <small>Este especialista no tiene blogs con visitas en el periodo.</small>
          </div>
        </div>
      </div>

      <!-- Nivel 2: Gráficos Principales -->
      <div class="row mb-4 fade-in delay-3 g-4">
        <!-- Gráfico Principal: Visitas Diarias (Siempre Global) -->
        <div class="col-12 col-lg-8">
          <div class="chart-card h-100">
            <div class="card-header-clean">
              <h4 class="card-title">
                {{
                  selectedPersonId
                    ? 'Tendencia de Visitas (Blogs del Especialista)'
                    : 'Tendencia de Visitas (Sitio Completo)'
                }}
              </h4>
            </div>
            <div class="chart-container-large">
              <canvas ref="totalChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Top 5 Blogs (Se actualiza según el filtro) -->
        <div class="col-12 col-lg-4">
          <div class="chart-card h-100">
            <div class="card-header-clean">
              <h4 class="card-title">
                {{ selectedPersonId ? 'Top 5 Blogs del Especialista' : 'Top 5 Blogs Globales' }}
              </h4>
            </div>
            <div class="chart-container-medium">
              <canvas ref="topBlogsChart"></canvas>
            </div>
            <div
              v-if="Object.keys(stats).length === 0 && !isLoading"
              class="text-center text-muted mt-4"
            >
              No hay datos de blogs para mostrar.
            </div>
          </div>
        </div>
      </div>

      <!-- Nivel 3: Desglose -->
      <div class="row mb-5 fade-in delay-3 g-4">
        <!-- Secciones (Siempre Global) -->
        <div class="col-12 col-md-6">
          <div class="chart-card">
            <div class="card-header-clean">
              <h4 class="card-title">Visitas por Sección Principal</h4>
            </div>
            <div class="chart-container-medium">
              <canvas ref="sectionsChart"></canvas>
            </div>
            <!-- Tabla de Secciones -->
            <div class="mt-4 table-responsive">
              <table class="table table-sm table-hover mb-0" style="font-size: 0.9rem">
                <thead>
                  <tr>
                    <th>Sección</th>
                    <th class="text-center">Visitas</th>
                    <th class="text-center">Tasa Int.</th>
                    <th class="text-center">Tiempo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="[path, stat] in sectionStats" :key="path">
                    <td class="text-capitalize">{{ path.replace('/', '') || 'Inicio' }}</td>
                    <td class="text-center fw-bold">{{ formatNumber(stat.views) }}</td>
                    <td class="text-center">
                      <span class="badge" :class="getEngagementClass(stat.engagementRate)"
                        >{{ stat.engagementRate }}%</span
                      >
                    </td>
                    <td class="text-center text-muted">
                      {{ formatTime(stat.avgSessionDuration) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Perfiles (Se actualiza según el filtro) -->
        <div class="col-12 col-md-6">
          <div class="chart-card">
            <div class="card-header-clean d-flex justify-content-between align-items-center">
              <h4 class="card-title mb-0">
                {{ selectedPersonId ? 'Visitas a su Perfil' : 'Comparativa de Especialistas' }}
              </h4>
              <span class="badge bg-info text-white rounded-pill"
                >{{ formatNumber(personViewsTotal) }} visitas</span
              >
            </div>
            <div
              class="chart-container-medium d-flex justify-content-center align-items-center"
              v-if="personViews.length > 0"
            >
              <canvas ref="personPieChart" style="max-height: 260px"></canvas>
            </div>
            <div v-else class="d-flex justify-content-center align-items-center h-100 text-muted">
              {{
                selectedPersonId
                  ? 'El perfil de este especialista no tiene visitas en el periodo.'
                  : 'No hay datos de visitas a perfiles.'
              }}
            </div>
            <!-- Tabla de Perfiles -->
            <div class="mt-4 table-responsive" v-if="personViews.length > 0">
              <table class="table table-sm table-hover mb-0" style="font-size: 0.9rem">
                <thead>
                  <tr>
                    <th>Especialista</th>
                    <th class="text-center">Visitas</th>
                    <th class="text-center">Tasa Int.</th>
                    <th class="text-center">Tiempo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="person in personViews" :key="person.name">
                    <td>
                      <div class="d-flex align-items-center">
                        <div
                          class="category-indicator me-2"
                          :style="{ backgroundColor: person.color }"
                        ></div>
                        {{ person.name }}
                      </div>
                    </td>
                    <td class="text-center fw-bold">{{ formatNumber(person.views) }}</td>
                    <td class="text-center">
                      <span class="badge" :class="getEngagementClass(person.engagementRate)"
                        >{{ person.engagementRate }}%</span
                      >
                    </td>
                    <td class="text-center text-muted">
                      {{ formatTime(person.avgSessionDuration) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Nivel 4: Tabla Detallada (Se actualiza según el filtro) -->
      <div class="detail-section fade-in delay-3 mb-5" v-if="Object.keys(stats).length > 0">
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h3 class="section-title">
            {{
              selectedPersonId
                ? 'Detalle de Blogs del Especialista'
                : 'Rendimiento Detallado de Blogs'
            }}
          </h3>
          <button
            class="btn btn-outline-primary btn-sm rounded-pill px-3"
            @click="showStatsTable = !showStatsTable"
          >
            {{ showStatsTable ? 'Ocultar Tabla' : 'Ver Tabla Completa' }}
          </button>
        </div>

        <transition name="slide-fade">
          <div v-if="showStatsTable" class="table-responsive modern-table-wrapper">
            <!-- Leyenda de Métricas (Movid al inicio) -->
            <div class="p-3 bg-light border-bottom small text-muted d-flex gap-4 flex-wrap">
              <div class="d-flex align-items-center">
                <i class="fas fa-info-circle me-2 text-primary"></i>
                <span
                  ><strong>Tasa de Interacción:</strong> % de sesiones > 10s, con conversión o > 2
                  vistas.</span
                >
              </div>
              <div class="d-flex align-items-center">
                <i class="far fa-clock me-2 text-primary"></i>
                <span
                  ><strong>Duración de Sesión:</strong> Tiempo promedio que dura una sesión (incluye
                  tiempos inactivos).</span
                >
              </div>
            </div>

            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th style="width: 35%">Título del Blog</th>
                  <th class="text-center cursor-pointer" @click="toggleSort('visits')">
                    Visitas <i class="fas fa-sort small text-muted"></i>
                  </th>
                  <th class="text-center cursor-pointer" @click="toggleSort('engagementRate')">
                    Tasa Int. <i class="fas fa-sort small text-muted"></i>
                  </th>
                  <!-- <th class="text-center cursor-pointer" @click="toggleSort('avgSessionDuration')">
                    Duración Sesión <i class="fas fa-sort small text-muted"></i>
                  </th> -->
                  <th class="text-center cursor-pointer" @click="toggleSort('shares')">
                    Compartidos <i class="fas fa-sort small text-muted"></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(stat, path) in sortedStatsList" :key="path">
                  <td>
                    <div class="d-flex align-items-center">
                      <div
                        class="category-indicator me-2"
                        :style="{ backgroundColor: colors[path] || '#ccc' }"
                      ></div>
                      <a
                        :href="path"
                        target="_blank"
                        class="fw-bold text-dark text-decoration-none text-truncate d-block"
                        style="max-width: 300px"
                        :title="titles[path] || path"
                      >
                        {{ titles[path] || path }}
                      </a>
                    </div>
                  </td>
                  <td class="text-center fw-bold">{{ formatNumber(stat.visits) }}</td>
                  <td class="text-center">
                    <span class="badge" :class="getEngagementClass(stat.engagementRate)"
                      >{{ stat.engagementRate }}%</span
                    >
                  </td>

                  <td class="text-center">{{ formatNumber(stat.shares) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'
// Asegúrate de que estas rutas sean correctas en tu proyecto
import peopleData from '../../data'
import { getCollection } from '../composables/useFirestore'
import { areNamesEquivalent } from '@/utils/stringUtils'

export default {
  data() {
    return {
      isLoading: true,
      showFilters: false,
      showStatsTable: true,
      selectedTimeRange: '30daysAgo',
      customStartDate: '',
      customEndDate: '',
      selectedPersonId: '', // ID del especialista seleccionado (vacío = todos)
      peopleList: peopleData,

      // Sorting
      sortColumn: 'visits',
      sortDirection: 'desc',

      // Datos
      stats: {}, // Esta variable almacenará los datos YA FILTRADOS por especialista
      titles: {}, // Mapa: path -> título
      colors: {}, // Mapa: path -> color
      blogAuthors: {}, // NUEVO Mapa: path -> authorName (para filtrar por nombre)

      homepageLabels: [],
      homepageData: [],
      sectionLabels: [],
      sectionData: [],
      sectionStats: [], // NUEVO: Para la tabla de secciones
      personViews: [],

      // Referencias a gráficos
      charts: {
        totalChart: null,
        topBlogsChart: null,
        sectionsChart: null,
        personPieChart: null,
      },
    }
  },
  computed: {
    // Filtrar lista de personas para excluir a Martha Elena
    filteredPeopleList() {
      return this.peopleList.filter((p) => !p.name.toLowerCase().includes('martha elena'))
    },
    // --- KPIs Calculados (Se basan en 'this.stats' que ya estará filtrado) ---
    totalVisits() {
      return Object.values(this.stats).reduce((acc, curr) => acc + (curr.visits || 0), 0)
    },
    avgEngagementRate() {
      const blogs = Object.values(this.stats).filter((b) => b.visits > 0)
      if (blogs.length === 0) return 0
      const totalRate = blogs.reduce((acc, curr) => acc + parseFloat(curr.engagementRate || 0), 0)
      return (totalRate / blogs.length).toFixed(0)
    },
    avgEngagementTimeTotal() {
      const blogs = Object.values(this.stats).filter((b) => b.visits > 0)
      if (blogs.length === 0) return 0
      // Usamos avgSessionDuration (Duración de Sesión)
      const totalTime = blogs.reduce(
        (acc, curr) => acc + (parseFloat(curr.avgSessionDuration) || 0),
        0,
      )
      return Math.round(totalTime / blogs.length)
    },
    personViewsTotal() {
      return this.personViews.reduce((acc, p) => acc + p.views, 0)
    },

    // --- Lógica del "Mejor Blog" (Basado en 'this.stats' filtrado) ---
    topBlogData() {
      const entries = Object.entries(this.stats)
      if (entries.length === 0) return null
      const top = entries.sort(([, a], [, b]) => b.visits - a.visits)[0]
      return top ? top[1] : null
    },
    topBlogName() {
      if (!this.topBlogData) return ''
      const path = Object.keys(this.stats).find((key) => this.stats[key] === this.topBlogData)
      return this.titles[path] || 'Blog'
    },

    // --- Utilidades para la UI ---
    sortedStatsList() {
      // Ordenar para la tabla detallada y el gráfico de Top Blogs
      return Object.entries(this.stats)
        .sort(([, a], [, b]) => {
          let valA = a[this.sortColumn]
          let valB = b[this.sortColumn]

          // Convertir a número si es string numérico
          if (typeof valA === 'string' && !isNaN(valA)) valA = parseFloat(valA)
          if (typeof valB === 'string' && !isNaN(valB)) valB = parseFloat(valB)

          if (this.sortDirection === 'desc') {
            return valB - valA
          } else {
            return valA - valB
          }
        })
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    },
  },
  async mounted() {
    // 1. Cargar metadatos (títulos, colores y AUTORES)
    await this.fetchFirestoreMetadata()
    // 2. Cargar y filtrar datos iniciales
    await this.fetchAllData()
  },
  methods: {
    // --- Navegación ---
    goBack() {
      if (window.history.length > 1) {
        window.history.back()
      } else {
        this.$router.push('/')
      }
    },

    // --- Formateo ---
    formatNumber(num) {
      return new Intl.NumberFormat('es-MX', {
        notation: 'compact',
        compactDisplay: 'short',
      }).format(num || 0)
    },
    formatTime(seconds) {
      if (!seconds) return '0s'
      if (seconds < 60) return `${seconds}s`
      const mins = Math.floor(seconds / 60)
      return `${mins}m ${seconds % 60}s`
    },
    getEngagementClass(rate) {
      const r = parseFloat(rate)
      if (r >= 60) return 'bg-success-soft text-success'
      if (r >= 40) return 'bg-warning-soft text-warning'
      return 'bg-danger-soft text-danger'
    },

    toggleSort(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc'
      } else {
        this.sortColumn = column
        this.sortDirection = 'desc'
      }
    },

    // --- Obtención de Datos (Core) ---
    async fetchFirestoreMetadata() {
      try {
        const blogs = await getCollection('blogs')
        const pathToTitle = {}
        const pathToColor = {}
        const pathToAuthor = {} // Nuevo mapa

        blogs.forEach((b) => {
          const path = `/blog/${b.id}`
          pathToTitle[path] = b.title
          pathToColor[path] = b.categoryColor || '#6c757d'
          // Guardamos el NOMBRE del autor para filtrar
          pathToAuthor[path] = b.authorName
        })
        this.titles = pathToTitle
        this.colors = pathToColor
        this.blogAuthors = pathToAuthor // Guardamos el mapa de autores
      } catch (e) {
        console.error('Error cargando metadatos de Firestore:', e)
      }
    },

    async fetchAllData() {
      this.isLoading = true

      // Construir Query String
      let dateQueryParams = ''
      if (this.selectedTimeRange === 'custom') {
        if (!this.customStartDate || !this.customEndDate) {
          this.isLoading = false
          return // No hacer nada si faltan fechas
        }
        dateQueryParams = `?startDate=${this.customStartDate}&endDate=${this.customEndDate}`
      } else {
        dateQueryParams = `?startDate=${this.selectedTimeRange}&endDate=today`
      }

      // Query String específico para el endpoint de personas (que sí acepta filtro en backend)
      let personQueryParams = dateQueryParams
      if (this.selectedPersonId) {
        personQueryParams += `&personId=${this.selectedPersonId}`
      }

      // URL base de Railway (Asegúrate de que sea la correcta y esté desplegada)
      const API_BASE = 'https://ga4-backend-production.up.railway.app/api'
      // const API_BASE = 'http://localhost:3001/api'

      try {
        // Ejecutar peticiones en paralelo
        const [blogStatsRes, homepageRes, routesRes, personRes] = await Promise.all([
          fetch(`${API_BASE}/blog-views${dateQueryParams}`), // Pedimos TODOS los blogs del periodo
          fetch(`${API_BASE}/homepage-views${dateQueryParams}`),
          fetch(`${API_BASE}/routes-views${dateQueryParams}`),
          fetch(`${API_BASE}/person-views${personQueryParams}`), // Este sí va filtrado al backend
        ])

        const rawBlogStats = await blogStatsRes.json()
        const homepageDataRaw = await homepageRes.json()
        const routesDataRaw = await routesRes.json()
        const personDataRaw = await personRes.json()

        // --- PROCESAMIENTO Y FILTRADO EN FRONTEND ---

        // 1. Filtrado de Blogs por Especialista (NUEVO)
        let finalBlogStats = rawBlogStats
        if (this.selectedPersonId) {
          finalBlogStats = {}
          // Encontrar el objeto persona seleccionado para obtener su nombre
          const selectedPerson = this.peopleList.find((p) => p.id === Number(this.selectedPersonId))
          const selectedName = selectedPerson ? selectedPerson.name : ''

          console.log('Filtro seleccionado:', selectedName) // DEBUG

          // Iteramos sobre todos los blogs devueltos por GA
          Object.entries(rawBlogStats).forEach(([path, stat]) => {
            // Obtenemos el NOMBRE del autor de nuestro mapa de metadatos
            const authorName = this.blogAuthors[path]

            // DEBUG: Ver qué estamos comparando
            // console.log(`Blog: ${path}, Autor: ${authorName}, Match: ${this.normalizeName(authorName) === this.normalizeName(selectedName)}`)

            // Comparamos usando la utilidad robusta
            const isMatch = areNamesEquivalent(authorName, selectedName)

            if (isMatch) {
              // Si coincide, lo añadimos a los resultados finales
              finalBlogStats[path] = stat
            }
          })
        }
        // Asignamos los datos filtrados a la variable principal.
        // Esto actualizará automáticamente los KPIs, la tabla y el gráfico de Top Blogs.
        this.stats = finalBlogStats

        // 2. Homepage / Trend Chart
        // Si hay filtro de especialista, calculamos la tendencia sumando los 'daily' de sus blogs
        if (this.selectedPersonId) {
          const dailyTotals = {}
          Object.values(this.stats).forEach((blog) => {
            if (blog.daily) {
              Object.entries(blog.daily).forEach(([date, count]) => {
                dailyTotals[date] = (dailyTotals[date] || 0) + count
              })
            }
          })
          const sortedDates = Object.keys(dailyTotals).sort()
          this.homepageLabels = sortedDates.map((d) => `${d.slice(6, 8)}/${d.slice(4, 6)}`)
          this.homepageData = sortedDates.map((d) => dailyTotals[d])
        } else {
          // Si no hay filtro, usamos los datos globales de homepage (o del sitio completo)
          const sortedDates = Object.keys(homepageDataRaw).sort()
          this.homepageLabels = sortedDates.map((d) => `${d.slice(6, 8)}/${d.slice(4, 6)}`)
          this.homepageData = sortedDates.map((d) => homepageDataRaw[d])
        }

        // 3. Secciones (Datos globales)
        // Ahora routesDataRaw es un objeto { path: { views, users, ... } }
        const sortedSections = Object.entries(routesDataRaw)
          .filter(([path]) => path !== '/' && !path.startsWith('/blog/'))
          .sort(([, a], [, b]) => b.views - a.views) // Ordenar por vistas
          .slice(0, 8)

        this.sectionLabels = sortedSections.map(([path]) => path.replace('/', '') || 'Inicio')
        this.sectionData = sortedSections.map(([, stat]) => stat.views)
        this.sectionStats = sortedSections // Guardamos todo el objeto para la tabla

        // 4. Personas (Ya viene filtrado del backend si se seleccionó uno)
        // Ahora personDataRaw es un objeto { path: { views, users, ... } }
        this.personViews = Object.entries(personDataRaw)
          .map(([path, stat]) => {
            const id = Number(path.split('/person/')[1])
            const person = this.peopleList.find((p) => p.id === id)
            return {
              name: person?.name || `Especialista ${id}`,
              views: stat.views,
              engagementRate: stat.engagementRate,
              avgSessionDuration: stat.avgSessionDuration,
              color: person?.color || '#999',
            }
          })
          .filter((p) => p.views > 0)
      } catch (error) {
        console.error('Error crítico obteniendo analíticas:', error)
        // Opcional: Mostrar un mensaje de error en la UI
      } finally {
        this.isLoading = false
        // Esperamos a que Vue actualice el DOM con los nuevos datos antes de renderizar gráficos
        this.$nextTick(() => {
          this.renderCharts()
        })
      }
    },

    // --- Renderizado de Gráficos (Chart.js) ---
    renderCharts() {
      // Destruir gráficos previos para evitar superposiciones y fugas de memoria
      Object.values(this.charts).forEach((chart) => {
        if (chart) chart.destroy()
      })

      this.renderTotalChart()
      this.renderTopBlogsChart()
      this.renderSectionChart()
      this.renderPersonPieChart()
    },

    renderTotalChart() {
      const ctx = this.$refs.totalChart?.getContext('2d')
      if (!ctx) return

      const gradient = ctx.createLinearGradient(0, 0, 0, 300)
      gradient.addColorStop(0, 'rgba(13, 110, 253, 0.25)')
      gradient.addColorStop(1, 'rgba(13, 110, 253, 0.0)')

      this.charts.totalChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.homepageLabels,
          datasets: [
            {
              label: this.selectedPersonId ? 'Visitas Blogs' : 'Visitas Inicio',
              data: this.homepageData,
              borderColor: '#0d6efd',
              backgroundColor: gradient,
              fill: true,
              tension: 0.3,
              pointRadius: 0,
              pointHoverRadius: 6,
              borderWidth: 2.5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: '#f0f2f5' }, ticks: { font: { size: 11 } } },
            x: { grid: { display: false }, ticks: { maxTicksLimit: 8, font: { size: 11 } } },
          },
        },
      })
    },

    renderTopBlogsChart() {
      const ctx = this.$refs.topBlogsChart?.getContext('2d')
      if (!ctx) return

      // Usamos sortedStatsList que YA ESTÁ FILTRADA por especialista si corresponde
      const topEntries = Object.entries(this.sortedStatsList).slice(0, 5)

      if (topEntries.length === 0) {
        // Si no hay datos después del filtro, no renderizamos nada (el template mostrará un mensaje)
        return
      }

      const truncate = (text) => (text.length > 20 ? text.slice(0, 18) + '...' : text)

      this.charts.topBlogsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: topEntries.map(([path]) => truncate(this.titles[path] || path)),
          datasets: [
            {
              label: 'Visitas',
              data: topEntries.map(([, stat]) => stat.visits),
              backgroundColor: topEntries.map(([path]) => this.colors[path] || '#6c757d'),
              borderRadius: 4,
              barPercentage: 0.7,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { beginAtZero: true, grid: { color: '#f0f2f5' }, ticks: { font: { size: 10 } } },
            y: { grid: { display: false }, ticks: { font: { size: 11, weight: '500' } } },
          },
        },
      })
    },

    renderSectionChart() {
      const ctx = this.$refs.sectionsChart?.getContext('2d')
      if (!ctx || this.sectionData.length === 0) return

      this.charts.sectionsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.sectionLabels,
          datasets: [
            {
              label: 'Visitas',
              data: this.sectionData,
              backgroundColor: 'rgba(111, 66, 193, 0.7)',
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: '#f0f2f5' } },
            x: {
              grid: { display: false },
              ticks: { autoSkip: false, maxRotation: 35, minRotation: 35, font: { size: 10 } },
            },
          },
        },
      })
    },

    renderPersonPieChart() {
      const ctx = this.$refs.personPieChart?.getContext('2d')
      if (!ctx || this.personViews.length === 0) return

      this.charts.personPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.personViews.map((p) => p.name),
          datasets: [
            {
              data: this.personViews.map((p) => p.views),
              backgroundColor: this.personViews.map((p) => p.color),
              borderWidth: 2,
              borderColor: '#ffffff',
              hoverOffset: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'right',
              labels: { boxWidth: 12, font: { size: 11 }, padding: 15 },
            },
          },
        },
      })
    },
  },
}
</script>

<style scoped>
/* =========================================
   Variables y Estilos Base
   ========================================= */
:root {
  --analytics-bg: #f4f7fc; /* Fondo ligeramente azulado/gris */
  --card-bg: #ffffff;
  --text-dark: #2c3e50;
  --text-muted: #7f8c8d;
  --primary-color: #0d6efd;
  --radius-lg: 16px;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 10px 25px rgba(0, 0, 0, 0.07);
}

.analytics-page-container {
  padding-top: 80px; /* Espacio para navbar fija si existe */
  min-height: 100vh;
  background-color: var(--analytics-bg);
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: var(--text-dark);
  position: relative; /* Para el loading overlay */
}

.content-wrapper {
  max-width: 1250px;
  margin: 0 auto;
  padding: 20px;
  transition: filter 0.3s ease;
}
.blur-content {
  filter: blur(4px);
  pointer-events: none;
}

/* =========================================
   Loading Overlay
   ========================================= */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(244, 247, 252, 0.9); /* Mismo tono que el fondo pero transparente */
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
}

/* =========================================
   Header y Navegación (Estilo Blogs)
   ========================================= */
.btn-back {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  background-color: var(--card-bg);
  border: none;
  border-radius: 30px;
  color: #555;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}
.btn-back:hover {
  background-color: #fff;
  color: var(--primary-color);
  transform: translateX(-3px);
  box-shadow: var(--shadow-md);
}

.analytics-header {
  margin-bottom: 30px;
}
.letter-spacing-2 {
  letter-spacing: 1.5px;
  font-weight: 700;
}
.section-subtitle {
  color: var(--text-muted);
  font-size: 1.05rem;
}

.btn-toggle-filters {
  background: var(--card-bg);
  color: var(--text-dark);
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}
.btn-toggle-filters:hover {
  box-shadow: var(--shadow-md);
  color: var(--primary-color);
}

/* =========================================
   Sección de Filtros
   ========================================= */
.controls-section {
  overflow: hidden;
}
.controls-container {
  background: var(--card-bg);
  padding: 20px 25px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  max-width: 500px;
  margin: 0 auto;
}
.control-label {
  display: block;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-dark);
  margin-bottom: 10px;
}

.date-selector-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.modern-select {
  width: 100%;
  padding: 12px 15px;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  background-color: #f8f9fa;
  font-weight: 600;
  color: var(--text-dark);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}
.modern-select:focus {
  border-color: var(--primary-color);
  background-color: #fff;
  outline: none;
}
.filter-badge {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
}

/* =========================================
   KPI Cards (Nivel 1)
   ========================================= */
.kpi-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.03);
}
.kpi-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.kpi-icon {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  margin-right: 18px;
  flex-shrink: 0;
}
.kpi-data h3 {
  font-size: 1.7rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
}
.kpi-data p {
  margin: 0;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.9rem;
}

/* Colores KPI */
.bg-blue-soft {
  background: rgba(13, 110, 253, 0.12);
}
.text-blue {
  color: #0d6efd;
}
.bg-purple-soft {
  background: rgba(111, 66, 193, 0.12);
}
.text-purple {
  color: #6f42c1;
}
.bg-orange-soft {
  background: rgba(253, 126, 20, 0.12);
}
.text-orange {
  color: #fd7e14;
}

.highlight-card {
  background: linear-gradient(145deg, #ffffff, #f0f7ff);
  border: 1px solid rgba(13, 110, 253, 0.15);
}
.font-small {
  font-size: 0.75rem;
}
.ls-1 {
  letter-spacing: 1px;
}

/* =========================================
   Gráficos y Tablas
   ========================================= */
.chart-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
}
.card-header-clean {
  margin-bottom: 20px;
}
.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.chart-container-large {
  position: relative;
  height: 350px;
  width: 100%;
}
.chart-container-medium {
  position: relative;
  height: 300px;
  width: 100%;
}

/* Tablas */
.modern-table-wrapper {
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.03);
}
.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.category-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
  max-height: 500px;
  opacity: 1;
}
.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

/* Animación de entrada */
.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
  opacity: 0;
}
.delay-1 {
  animation-delay: 0.1s;
}
.delay-2 {
  animation-delay: 0.2s;
}
.delay-3 {
  animation-delay: 0.3s;
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

/* Responsivo */
@media (max-width: 768px) {
  .kpi-card {
    padding: 15px;
  }
  .kpi-icon {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }
  .kpi-data h3 {
    font-size: 1.4rem;
  }
  .chart-container-large {
    height: 250px;
  }
  .chart-container-medium {
    height: 250px;
  }
}
</style>
