<template>
  <div class="configuration-page-container pt-5">
    <!-- HEADER ESTILO BLOGVIEW -->
    <header class="text-center mb-5 fade-in mt-5">
      <h3
        class="text-uppercase letter-spacing-2 text-dark mb-2 mt-0"
        style="font-size: 1.5rem; opacity: 0.8"
      >
        Configuración
      </h3>
      <!-- <p class="text-muted">Administra el contenido de tu sitio</p> -->
    </header>

    <div class="container-fluid px-4 px-md-5">
      <div class="row">
        <!-- Sidebar de Colecciones -->
        <div class="col-md-3 col-lg-2 mb-4">
          <div class="list-group sticky-top" style="top: 100px; z-index: 1">
            <button
              v-for="collection in collections"
              :key="collection.key"
              class="list-group-item list-group-item-action border-0 shadow-sm mb-1"
              :class="{ 'active fw-bold': currentCollection === collection.key }"
              @click="currentCollection = collection.key"
            >
              {{ collection.label }}
            </button>
          </div>
        </div>

        <!-- Área Principal -->
        <div class="col-md-9 col-lg-10">
          <div class="card shadow border-0 rounded-4">
            <div class="card-header bg-white border-0 pt-4 px-4">
              <h2 class="h4 mb-0 fw-bold">{{ currentCollectionLabel }}</h2>
            </div>
            <div class="card-body p-4">
              <!-- VISTA DE BLOGS -->
              <div v-if="currentCollection === 'blogs'">
                <!-- Barra de Herramientas (Búsqueda y Crear) -->
                <div class="row mb-4 align-items-center">
                  <div class="col-md-6 mb-2 mb-md-0">
                    <div class="input-group">
                      <span class="input-group-text bg-white border-end-0">
                        <i class="bi bi-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        class="form-control border-start-0 ps-0"
                        placeholder="Buscar por título..."
                        v-model="searchQuery"
                      />
                    </div>
                  </div>
                  <div class="col-md-6 text-md-end">
                    <button class="btn btn-primary" @click="openCreateModal">
                      <i class="bi bi-plus-lg me-1"></i> Nuevo Blog
                    </button>
                  </div>
                </div>

                <div v-if="loading" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                  </div>
                </div>
                <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

                <div v-else>
                  <!-- Lista de Blogs -->
                  <div class="accordion" id="accordionBlogs">
                    <div
                      v-for="(blog, index) in paginatedBlogs"
                      :key="blog.id || index"
                      class="accordion-item mb-2 border rounded overflow-hidden"
                    >
                      <h2 class="accordion-header" :id="'heading' + index">
                        <button
                          class="accordion-button"
                          :class="{ collapsed: expandedIndex !== index }"
                          type="button"
                          @click="toggleExpand(index)"
                        >
                          <div class="d-flex justify-content-between w-100 me-3 align-items-center">
                            <span class="fw-bold text-truncate me-2">{{ blog.title }}</span>
                            <small class="text-muted text-nowrap">{{
                              formatDate(blog.date)
                            }}</small>
                          </div>
                        </button>
                      </h2>
                      <div
                        :id="'collapse' + index"
                        class="accordion-collapse collapse"
                        :class="{ show: expandedIndex === index }"
                      >
                        <div class="accordion-body bg-light">
                          <!-- Botones de Acción -->
                          <div class="d-flex justify-content-end mb-3">
                            <button
                              v-if="editingBlogId !== blog.id"
                              class="btn btn-outline-primary btn-sm"
                              @click="startEditing(blog)"
                            >
                              <i class="fas fa-edit me-1"></i> Editar
                            </button>
                            <div v-else class="d-flex gap-2">
                              <!-- Opcional: Cancelar -->
                              <!-- <button class="btn btn-secondary btn-sm" @click="cancelEditing">Cancelar</button> -->
                              <button
                                class="btn btn-success btn-sm"
                                @click="saveBlog(blog)"
                                :disabled="isSaving"
                              >
                                <span
                                  v-if="isSaving"
                                  class="spinner-border spinner-border-sm me-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                {{ isSaving ? 'Guardando...' : 'Guardar' }}
                              </button>
                            </div>
                          </div>

                          <!-- Campos de Edición -->
                          <div class="mb-3">
                            <label class="form-label fw-semibold">Título</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="blog.title"
                              :disabled="editingBlogId !== blog.id"
                            />
                          </div>

                          <div class="mb-3">
                            <label class="form-label fw-semibold">Descripción</label>
                            <textarea
                              class="form-control"
                              v-model="blog.description"
                              rows="3"
                              :disabled="editingBlogId !== blog.id"
                            ></textarea>
                          </div>

                          <div class="row">
                            <div class="col-md-6 mb-3">
                              <label class="form-label fw-semibold">Autor</label>
                              <input
                                type="text"
                                class="form-control"
                                v-model="blog.authorName"
                                :disabled="editingBlogId !== blog.id"
                              />
                            </div>
                            <div class="col-md-6 mb-3">
                              <label class="form-label fw-semibold">Fecha</label>
                              <input
                                type="date"
                                class="form-control"
                                :value="formatDateForInput(blog.date)"
                                @input="updateDate(blog, $event)"
                                :disabled="editingBlogId !== blog.id"
                              />
                            </div>
                          </div>

                          <div class="row">
                            <div class="col-md-6 mb-3">
                              <label class="form-label fw-semibold">Categoría</label>
                              <input
                                type="text"
                                class="form-control"
                                v-model="blog.category"
                                :disabled="editingBlogId !== blog.id"
                              />
                            </div>
                            <div class="col-md-6 mb-3">
                              <label class="form-label fw-semibold">Color Categoría</label>
                              <input
                                type="color"
                                class="form-control form-control-color w-100"
                                v-model="blog.categoryColor"
                                title="Elige un color"
                                :disabled="editingBlogId !== blog.id"
                              />
                            </div>
                          </div>

                          <div class="mb-3">
                            <label class="form-label fw-semibold">Imagen URL</label>
                            <input
                              type="text"
                              class="form-control mb-2"
                              v-model="blog.imageUrl"
                              :disabled="editingBlogId !== blog.id"
                            />
                            <div
                              v-if="blog.imageUrl"
                              class="text-center rounded border p-2 bg-white"
                            >
                              <img
                                :src="blog.imageUrl"
                                alt="Preview"
                                class="img-fluid rounded"
                                style="max-height: 200px"
                              />
                            </div>
                          </div>

                          <div class="mb-3">
                            <label class="form-label fw-semibold">Contenido (HTML)</label>
                            <textarea
                              class="form-control font-monospace bg-white"
                              v-model="blog.text"
                              rows="6"
                              style="font-size: 0.85rem"
                              :disabled="editingBlogId !== blog.id"
                            ></textarea>
                          </div>

                          <div class="mb-3">
                            <label class="form-label fw-semibold">Orden</label>
                            <input
                              type="number"
                              class="form-control"
                              v-model.number="blog.orden"
                              :disabled="editingBlogId !== blog.id"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Paginación -->
                  <nav v-if="totalPages > 1" class="mt-4">
                    <ul class="pagination justify-content-center">
                      <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <button class="page-link" @click="prevPage">Anterior</button>
                      </li>
                      <li class="page-item disabled">
                        <span class="page-link">Página {{ currentPage }} de {{ totalPages }}</span>
                      </li>
                      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <button class="page-link" @click="nextPage">Siguiente</button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

              <!-- VISTA DE TEMAS -->
              <div v-else-if="currentCollection === 'temas'">
                <div v-if="loading" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                  </div>
                </div>
                <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
                <div v-else>
                  <form @submit.prevent="saveTemas">
                    <!-- Temas List -->
                    <div class="mb-4">
                      <h5 class="fw-bold mb-3">Lista de Temas</h5>
                      <div
                        v-for="(tema, index) in temasData.temas"
                        :key="index"
                        class="input-group mb-2"
                      >
                        <input
                          type="text"
                          class="form-control"
                          v-model="temasData.temas[index]"
                          placeholder="Ingrese un tema"
                        />
                        <button
                          type="button"
                          class="btn btn-outline-danger"
                          @click="removeTema(index)"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                      <button
                        type="button"
                        class="btn btn-outline-primary btn-sm mt-2"
                        @click="addTema"
                      >
                        <i class="bi bi-plus-lg me-1"></i> Agregar Tema
                      </button>
                    </div>

                    <hr />

                    <!-- Configuración del Evento -->
                    <div class="mb-4">
                      <h5 class="fw-bold mb-3">Próximo Evento</h5>
                      <div class="row">
                        <div class="col-md-4 mb-3">
                          <label class="form-label">Fecha (YYYY-MM-DD)</label>
                          <input
                            type="date"
                            class="form-control"
                            v-model="temasData.evento.fecha"
                          />
                        </div>
                        <div class="col-md-4 mb-3">
                          <label class="form-label">Hora</label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="temasData.evento.hora"
                            placeholder="Ej: 7:00 PM"
                          />
                        </div>
                        <div class="col-md-4 mb-3">
                          <label class="form-label">Mensaje</label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="temasData.evento.mensaje"
                            placeholder="Ej: Sintonízanos en..."
                          />
                        </div>
                      </div>
                    </div>

                    <hr />

                    <!-- Colores -->
                    <div class="mb-4">
                      <h5 class="fw-bold mb-3">Colores del Tema</h5>
                      <div class="row">
                        <div class="col-md-4 mb-3">
                          <label class="form-label">Primario (Fondo)</label>
                          <input
                            type="color"
                            class="form-control form-control-color w-100"
                            v-model="temasData.colores.primario"
                          />
                        </div>
                        <div class="col-md-4 mb-3">
                          <label class="form-label">Secundario (Acentos)</label>
                          <input
                            type="color"
                            class="form-control form-control-color w-100"
                            v-model="temasData.colores.secundario"
                          />
                        </div>
                        <div class="col-md-4 mb-3">
                          <label class="form-label">Título (Texto)</label>
                          <input
                            type="color"
                            class="form-control form-control-color w-100"
                            v-model="temasData.colores.titulo"
                          />
                        </div>
                      </div>
                    </div>

                    <hr />

                    <!-- Participantes -->
                    <div class="mb-4">
                      <h5 class="fw-bold mb-3">Participantes</h5>
                      <div class="row">
                        <div
                          v-for="person in allPeople"
                          :key="person.id"
                          class="col-md-6 col-lg-4 mb-2"
                        >
                          <div
                            class="form-check border rounded p-2 d-flex align-items-center bg-white"
                          >
                            <input
                              class="form-check-input me-2 mt-0"
                              type="checkbox"
                              :value="person.id"
                              :checked="temasData.participantes.includes(person.id)"
                              @change="toggleParticipant(person.id)"
                              :id="'check-' + person.id"
                            />
                            <label
                              class="form-check-label d-flex align-items-center w-100 cursor-pointer"
                              :for="'check-' + person.id"
                            >
                              <img
                                :src="person.image"
                                class="rounded-circle me-2"
                                width="30"
                                height="30"
                                style="object-fit: cover"
                              />
                              <span class="small">{{ person.name }}</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="d-flex justify-content-end mb-5">
                      <button
                        type="submit"
                        class="btn btn-success btn-lg px-5"
                        :disabled="isSaving"
                      >
                        <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                        {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <!-- PLACEHOLDERS PARA OTRAS COLECCIONES -->
              <div v-else class="text-center py-5 text-muted">
                <i class="bi bi-folder2-open display-4 mb-3 d-block"></i>
                <p class="lead">
                  Gestor para <strong>{{ currentCollectionLabel }}</strong> próximamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Crear Blog -->
  <div v-if="showCreateModal" class="modal-backdrop fade show"></div>
  <div v-if="showCreateModal" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Nuevo Blog</h5>
          <button type="button" class="btn-close" @click="closeCreateModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Título *</label>
            <input type="text" class="form-control" v-model="newBlog.title" />
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción *</label>
            <textarea class="form-control" v-model="newBlog.description" rows="2"></textarea>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Autor</label>
              <input type="text" class="form-control" v-model="newBlog.authorName" />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Fecha</label>
              <input type="date" class="form-control" v-model="newBlog.dateInput" />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Categoría</label>
              <input type="text" class="form-control" v-model="newBlog.category" />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Color</label>
              <input
                type="color"
                class="form-control form-control-color w-100"
                v-model="newBlog.categoryColor"
              />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Imagen URL</label>
            <input type="text" class="form-control" v-model="newBlog.imageUrl" />
          </div>
          <div class="mb-3">
            <label class="form-label">Contenido HTML</label>
            <textarea
              class="form-control font-monospace"
              v-model="newBlog.text"
              rows="5"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeCreateModal">
            Cancelar
          </button>
          <button type="button" class="btn btn-primary" @click="createBlog" :disabled="isCreating">
            <span v-if="isCreating" class="spinner-border spinner-border-sm me-1"></span>
            Crear Blog
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getBlogs,
  updateBlog,
  createBlog,
  getPrograms,
  updateProgram,
} from '@/composables/useFirestore'
import people from '../../data'

export default {
  name: 'ConfigurationView',
  data() {
    return {
      currentCollection: 'blogs',
      collections: [
        { key: 'ad', label: 'Ads (Anuncios)' },
        { key: 'banner', label: 'Banners' },
        { key: 'blogs', label: 'Blogs' },
        { key: 'campana', label: 'Campañas' },
        { key: 'eventos', label: 'Eventos' },
        { key: 'galerias', label: 'Galerías' },
        { key: 'people', label: 'Equipo (People)' },
        { key: 'programas', label: 'Programas' },
        { key: 'reels', label: 'Reels' },
        { key: 'temas', label: 'Temas' },
      ],
      // Datos Específicos de Blog
      blogs: [],
      loading: true,
      error: null,
      expandedIndex: null,
      // Edición
      editingBlogId: null,
      isSaving: false,
      // Búsqueda y Paginación
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      // Creación
      showCreateModal: false,
      isCreating: false,
      newBlog: {
        title: '',
        description: '',
        authorName: '',
        dateInput: '', // YYYY-MM-DD
        category: '',
        categoryColor: '#000000',
        imageUrl: '',
        text: '',
        orden: 0,
      },
      // Datos Específicos de Temas (Programa)
      temasData: {
        id: null,
        temas: [], // Array de strings
        colores: { primario: '#4a1a1a', secundario: '#fcd34d', titulo: '#ffffff' },
        evento: { fecha: '', hora: '', mensaje: '' },
        participantes: [], // Array de IDs
      },
      allPeople: people, // Para el selector de participantes
    }
  },
  computed: {
    currentCollectionLabel() {
      const col = this.collections.find((c) => c.key === this.currentCollection)
      return col ? col.label : 'Generales'
    },
    filteredBlogs() {
      if (!this.searchQuery) return this.blogs
      const query = this.searchQuery.toLowerCase()
      return this.blogs.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(query) ||
          blog.description?.toLowerCase().includes(query),
      )
    },
    totalPages() {
      return Math.ceil(this.filteredBlogs.length / this.itemsPerPage)
    },
    paginatedBlogs() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredBlogs.slice(start, end)
    },
  },
  async mounted() {
    // Cargar datos iniciales (Blogs por defecto)
    await this.fetchBlogs()
  },
  watch: {
    // Si cambia la colección, podríamos cargar datos distintos
    currentCollection(newVal) {
      this.expandedIndex = null
      this.editingBlogId = null // Cancelar edición si cambia colección
      this.searchQuery = ''
      this.currentPage = 1
      if (newVal === 'blogs' && this.blogs.length === 0) {
        this.fetchBlogs()
      } else if (newVal === 'temas') {
        this.fetchTemas()
      }
    },
    searchQuery() {
      this.currentPage = 1 // Reset a pág 1 al buscar
    },
  },
  methods: {
    async fetchTemas() {
      try {
        this.loading = true
        const programs = await getPrograms()
        if (programs && programs.length > 0) {
          // Asumimos que es un singleton y tomamos el primero
          const program = programs[0]
          // Asegurar estructura
          this.temasData = {
            id: program.id,
            temas: program.temas || [],
            colores: program.colores || {
              primario: '#4a1a1a',
              secundario: '#fcd34d',
              titulo: '#ffffff',
            },
            evento: program.evento || { fecha: '', hora: '', mensaje: '' },
            participantes: program.participantes || [],
          }
        }
      } catch (e) {
        this.error = 'Error al cargar la configuración de temas.'
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    addTema() {
      this.temasData.temas.push('')
    },
    removeTema(index) {
      this.temasData.temas.splice(index, 1)
    },
    toggleParticipant(personId) {
      const index = this.temasData.participantes.indexOf(personId)
      if (index === -1) {
        this.temasData.participantes.push(personId)
      } else {
        this.temasData.participantes.splice(index, 1)
      }
    },
    async saveTemas() {
      if (!this.temasData.id) return
      this.isSaving = true
      try {
        // Limpiar temas vacíos
        const dataToSave = {
          ...this.temasData,
          temas: this.temasData.temas.filter((t) => t.trim() !== ''),
        }
        const success = await updateProgram(this.temasData.id, dataToSave)
        if (success) {
          alert('Configuración de Temas guardada correctamente')
        } else {
          alert('Error al guardar Temas')
        }
      } catch (e) {
        console.error(e)
        alert('Error inesperado al guardar Temas')
      } finally {
        this.isSaving = false
      }
    },
    async fetchBlogs() {
      try {
        this.loading = true
        this.blogs = await getBlogs()
      } catch (err) {
        this.error = 'Error al cargar los blogs.'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    toggleExpand(index) {
      if (this.expandedIndex === index) {
        this.expandedIndex = null
      } else {
        this.expandedIndex = index
      }
    },
    startEditing(blog) {
      // Solo editar uno a la vez
      this.editingBlogId = blog.id
    },
    async saveBlog(blog) {
      if (!blog.id) return
      this.isSaving = true
      try {
        const success = await updateBlog(blog.id, blog)
        if (success) {
          this.editingBlogId = null
          // Podríamos mostrar un mensaje de éxito
          alert('Blog guardado correctamente')
        } else {
          alert('Error al guardar el blog')
        }
      } catch (e) {
        console.error(e)
        alert('Error inesperado al guardar')
      } finally {
        this.isSaving = false
      }
    },
    // Paginación
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--
    },
    // Creación
    openCreateModal() {
      this.newBlog = {
        title: '',
        description: '',
        authorName: '',
        dateInput: new Date().toISOString().split('T')[0],
        category: '',
        categoryColor: '#000000',
        imageUrl: '',
        text: '',
        orden: 0,
      }
      this.showCreateModal = true
    },
    closeCreateModal() {
      this.showCreateModal = false
    },
    async createBlog() {
      this.isCreating = true
      try {
        // Preparar fecha
        const blogData = { ...this.newBlog }
        if (blogData.dateInput) {
          blogData.date = new Date(blogData.dateInput).toISOString()
        } else {
          blogData.date = new Date().toISOString()
        }
        delete blogData.dateInput

        const newId = await createBlog(blogData)
        if (newId) {
          alert('Blog creado con éxito')
          this.showCreateModal = false
          // Recargar lista
          await this.fetchBlogs()
        } else {
          alert('Error al crear el blog')
        }
      } catch (e) {
        console.error(e)
        alert('Error inesperado al crear')
      } finally {
        this.isCreating = false
      }
    },
    // Función auxiliar para parsear fechas de Firestore (Timestamp o String)
    parseDate(dateField) {
      if (!dateField) return null
      // Si es un objeto Timestamp de Firestore (tiene seconds)
      if (dateField.seconds || dateField._seconds) {
        const seconds = dateField.seconds || dateField._seconds
        return new Date(seconds * 1000)
      }
      // Intenta crear fecha estándar (ISO string, etc.)
      const date = new Date(dateField)
      return isNaN(date.getTime()) ? null : date
    },
    formatDate(dateString) {
      const date = this.parseDate(dateString)
      if (!date) return 'Sin fecha'
      return date.toLocaleDateString()
    },
    formatDateForInput(dateString) {
      const date = this.parseDate(dateString)
      if (!date) return ''
      return date.toISOString().split('T')[0]
    },
    updateDate(blog, event) {
      const val = event.target.value
      if (!val) return
      // Al editar desde el input type="date", obtenemos YYYY-MM-DD
      // Lo guardamos como string ISO para consistencia,
      // o el backend se encargará de convertirlo a Timestamp si es necesario.
      const newDate = new Date(val)
      if (!isNaN(newDate.getTime())) {
        blog.date = newDate.toISOString()
      }
    },
  },
}
</script>

<style scoped>
.configuration-page-container {
  padding-top: 60px;
  /* Fondo suave similar al BlogView o mantenemos el gradiente si el usuario lo prefiere */
  background-color: #f4f6f9;
  min-height: 100vh;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #343a40;
  display: flex;
  flex-direction: column;
}

.letter-spacing-2 {
  letter-spacing: 2px;
  font-weight: 600;
}

/* Ajustes para la lista activa */
.list-group-item.active {
  background-color: #0d6efd;
  color: white;
}

/* Transiciones visuales */
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
</style>
