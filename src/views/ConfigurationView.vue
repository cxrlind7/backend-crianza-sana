<template>
  <div class="cfg-root">
    <!-- ACCESS DENIED -->
    <div v-if="!isAdmin" class="cfg-denied-wrap">
      <div class="cfg-denied-card">
        <div class="cfg-denied-icon">🔒</div>
        <h3>Acceso restringido</h3>
        <p>Esta sección es solo para administradores. Inicia sesión con una cuenta autorizada.</p>
        <router-link to="/login" class="cfg-btn cfg-btn-primary">
          <i class="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión
        </router-link>
      </div>
    </div>

    <!-- ADMIN LAYOUT -->
    <div v-else class="cfg-page">
      <!-- SIDEBAR -->
      <aside class="cfg-sidebar">
        <div class="cfg-sidebar-brand">
          <div class="cfg-sidebar-brand-icon"><i class="bi bi-sliders2"></i></div>
          <div>
            <div class="cfg-sidebar-brand-title">Admin Panel</div>
            <div class="cfg-sidebar-brand-sub">Crianza Sana by D'Kids</div>
          </div>
        </div>

        <div class="cfg-sidebar-section-label">Colecciones</div>
        <button
          v-for="col in collections"
          :key="col.key"
          class="cfg-nav-item"
          :class="{ active: currentCollection === col.key }"
          @click="switchCollection(col.key)"
        >
          <span class="cfg-nav-icon">{{ col.icon }}</span>
          <span class="cfg-nav-label">{{ col.label }}</span>
          <span v-if="currentCollection === col.key" class="cfg-nav-dot"></span>
        </button>

        <div class="cfg-sidebar-footer">
          <i class="bi bi-shield-check-fill me-2"></i>
          <span>{{ currentUser?.email ?? 'Administrador' }}</span>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="cfg-main">
        <!-- Page header -->
        <div class="cfg-page-header">
          <span class="cfg-page-header-icon">{{ currentCollectionIcon }}</span>
          <div>
            <h1 class="cfg-page-title">{{ currentCollectionLabel }}</h1>
            <p class="cfg-page-sub">Gestiona el contenido de esta sección</p>
          </div>
        </div>

        <!-- Content card -->
        <div class="cfg-card">
          <!-- ======================== BLOGS ======================== -->
          <div v-if="currentCollection === 'blogs'">
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
                <button class="btn btn-primary" @click="openCreateModal('blog')">
                  <i class="bi bi-plus-lg me-1"></i> Nuevo Blog
                </button>
              </div>
            </div>
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
            <div v-else>
              <div class="accordion" id="accordionBlogs">
                <div
                  v-for="(blog, index) in paginatedBlogs"
                  :key="blog.id || index"
                  class="accordion-item mb-2 border rounded overflow-hidden"
                >
                  <h2 class="accordion-header">
                    <button
                      class="accordion-button"
                      :class="{ collapsed: expandedIndex !== index }"
                      type="button"
                      @click="toggleExpand(index)"
                    >
                      <div class="d-flex justify-content-between w-100 me-3 align-items-center">
                        <span class="fw-bold text-truncate me-2">{{ blog.title }}</span>
                        <small class="text-muted text-nowrap">{{ formatDate(blog.date) }}</small>
                      </div>
                    </button>
                  </h2>
                  <div
                    class="accordion-collapse collapse"
                    :class="{ show: expandedIndex === index }"
                  >
                    <div class="accordion-body bg-light">
                      <div class="d-flex justify-content-end mb-3 gap-2">
                        <button
                          v-if="editingId !== blog.id"
                          class="btn btn-outline-primary btn-sm"
                          @click="editingId = blog.id"
                        >
                          <i class="fas fa-edit me-1"></i> Editar
                        </button>
                        <button
                          v-else
                          class="btn btn-success btn-sm"
                          @click="saveBlog(blog)"
                          :disabled="isSaving"
                        >
                          <span
                            v-if="isSaving"
                            class="spinner-border spinner-border-sm me-1"
                          ></span>
                          {{ isSaving ? 'Guardando...' : 'Guardar' }}
                        </button>
                      </div>
                      <div class="mb-3">
                        <label class="form-label fw-semibold">Título</label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="blog.title"
                          :disabled="editingId !== blog.id"
                        />
                      </div>
                      <div class="mb-3">
                        <label class="form-label fw-semibold">Descripción</label>
                        <textarea
                          class="form-control"
                          v-model="blog.description"
                          rows="3"
                          :disabled="editingId !== blog.id"
                        ></textarea>
                      </div>
                      <div class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label fw-semibold">Autor</label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="blog.authorName"
                            :disabled="editingId !== blog.id"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label fw-semibold">Fecha</label>
                          <input
                            type="date"
                            class="form-control"
                            :value="formatDateForInput(blog.date)"
                            @input="updateDate(blog, $event)"
                            :disabled="editingId !== blog.id"
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
                            :disabled="editingId !== blog.id"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label fw-semibold">Color Categoría</label>
                          <input
                            type="color"
                            class="form-control form-control-color w-100"
                            v-model="blog.categoryColor"
                            :disabled="editingId !== blog.id"
                          />
                        </div>
                      </div>
                      <div class="mb-3">
                        <label class="form-label fw-semibold">Imagen URL</label>
                        <input
                          type="text"
                          class="form-control mb-2"
                          v-model="blog.imageUrl"
                          :disabled="editingId !== blog.id"
                        />
                        <div v-if="blog.imageUrl" class="text-center rounded border p-2 bg-white">
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
                          :disabled="editingId !== blog.id"
                        ></textarea>
                      </div>
                      <div class="mb-3">
                        <label class="form-label fw-semibold">Orden</label>
                        <input
                          type="number"
                          class="form-control"
                          v-model.number="blog.orden"
                          :disabled="editingId !== blog.id"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

          <!-- ======================== ADS ======================== -->
          <div v-else-if="currentCollection === 'ad'">
            <div class="text-end mb-3">
              <button class="btn btn-primary" @click="openCreateModal('ad')">
                <i class="bi bi-plus-lg me-1"></i> Nuevo Anuncio
              </button>
            </div>
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <div v-else class="row g-3">
              <div v-if="ads.length === 0" class="col-12 text-center text-muted py-5">
                <i class="bi bi-image display-4 d-block mb-2"></i>
                <p>No hay anuncios creados.</p>
              </div>
              <div v-for="ad in ads" :key="ad.id" class="col-md-6 col-lg-4">
                <div class="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
                  <img
                    v-if="ad.imageSrc"
                    :src="ad.imageSrc"
                    class="card-img-top"
                    style="height: 160px; object-fit: cover"
                    :alt="ad.altText"
                  />
                  <div
                    v-else
                    class="bg-light d-flex align-items-center justify-content-center"
                    style="height: 160px"
                  >
                    <i class="bi bi-image text-muted fs-1"></i>
                  </div>
                  <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <span
                        class="badge"
                        :class="ad.active === 'true' ? 'bg-success' : 'bg-secondary'"
                      >
                        {{ ad.active === 'true' ? 'Activo' : 'Inactivo' }}
                      </span>
                      <div class="d-flex gap-1">
                        <button
                          class="btn btn-outline-primary btn-sm"
                          @click="openEditModal('ad', ad)"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button
                          class="btn btn-outline-danger btn-sm"
                          @click="deleteItem('ad', ad.id)"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                    <p class="small text-muted mb-1">{{ ad.altText || 'Sin descripción' }}</p>
                    <p class="small text-truncate text-muted mb-0" style="font-size: 0.75rem">
                      {{ ad.imageSrc }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ======================== BANNERS ======================== -->
          <div v-else-if="currentCollection === 'banner'">
            <div class="text-end mb-3">
              <button class="btn btn-primary" @click="openCreateModal('banner')">
                <i class="bi bi-plus-lg me-1"></i> Nuevo Banner
              </button>
            </div>
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <div v-else class="row g-3">
              <div v-if="banners.length === 0" class="col-12 text-center text-muted py-5">
                <i class="bi bi-image display-4 d-block mb-2"></i>
                <p>No hay banners creados.</p>
              </div>
              <div v-for="banner in banners" :key="banner.id" class="col-md-6">
                <div class="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
                  <img
                    v-if="banner.imageSrc"
                    :src="banner.imageSrc"
                    class="card-img-top"
                    style="height: 180px; object-fit: cover"
                    :alt="banner.altText"
                  />
                  <div
                    v-else
                    class="bg-light d-flex align-items-center justify-content-center"
                    style="height: 180px"
                  >
                    <i class="bi bi-image text-muted fs-1"></i>
                  </div>
                  <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <span
                        class="badge"
                        :class="banner.active === 'true' ? 'bg-success' : 'bg-secondary'"
                      >
                        {{ banner.active === 'true' ? 'Activo' : 'Inactivo' }}
                      </span>
                      <div class="d-flex gap-1">
                        <button
                          class="btn btn-outline-primary btn-sm"
                          @click="openEditModal('banner', banner)"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button
                          class="btn btn-outline-danger btn-sm"
                          @click="deleteItem('banner', banner.id)"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                    <p class="small text-muted mb-0">{{ banner.altText || 'Sin descripción' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ======================== CAMPAÑAS ======================== -->
          <div v-else-if="currentCollection === 'campana'">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <div v-else>
              <div v-if="campanas.length === 0" class="text-center text-muted py-5">
                <p>No hay campañas en Firestore.</p>
              </div>
              <div
                v-for="camp in campanas"
                :key="camp.id"
                class="card border-0 shadow-sm rounded-3 mb-4"
              >
                <div class="card-body p-4">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <h6 class="fw-bold text-muted mb-0">ID: {{ camp.id }}</h6>
                    <button
                      class="btn btn-success btn-sm"
                      @click="saveCampana(camp)"
                      :disabled="isSaving"
                    >
                      <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
                      {{ isSaving ? 'Guardando...' : 'Guardar' }}
                    </button>
                  </div>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-semibold">Imagen URL</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="camp.img"
                        placeholder="https://..."
                      />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-semibold">Fecha Final (DD-MM-YYYY)</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="camp.finalDate"
                        placeholder="31-12-2025"
                      />
                    </div>
                  </div>
                  <div v-if="camp.img" class="text-center rounded border p-2 bg-light">
                    <img
                      :src="camp.img"
                      alt="Preview campaña"
                      class="img-fluid rounded"
                      style="max-height: 200px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ======================== EVENTOS ======================== -->
          <div v-else-if="currentCollection === 'eventos'">
            <div class="text-end mb-3">
              <button class="btn btn-primary" @click="openCreateModal('evento')">
                <i class="bi bi-plus-lg me-1"></i> Nuevo Evento
              </button>
            </div>
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <div v-else>
              <div v-if="eventos.length === 0" class="text-center text-muted py-5">
                <i class="bi bi-calendar-event display-4 d-block mb-2"></i>
                <p>No hay eventos creados.</p>
              </div>
              <div
                v-for="ev in eventos"
                :key="ev.id"
                class="card border-0 shadow-sm rounded-3 mb-3"
              >
                <div class="card-body p-4">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span class="badge bg-primary me-2">{{ ev.type || 'sin tipo' }}</span>
                      <span
                        class="badge"
                        :class="ev.showButton === 'true' ? 'bg-success' : 'bg-secondary'"
                      >
                        Botón {{ ev.showButton === 'true' ? 'visible' : 'oculto' }}
                      </span>
                    </div>
                    <div class="d-flex gap-2">
                      <button
                        class="btn btn-outline-primary btn-sm"
                        @click="openEditModal('evento', ev)"
                      >
                        <i class="bi bi-pencil me-1"></i>Editar
                      </button>
                      <button
                        class="btn btn-outline-danger btn-sm"
                        @click="deleteItem('evento', ev.id)"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div class="row g-2 small text-muted">
                    <div class="col-md-6"><strong>Mensaje:</strong> {{ ev.message }}</div>
                    <div class="col-md-6"><strong>Botón:</strong> {{ ev.buttonText }}</div>
                    <div class="col-md-6"><strong>Teléfono:</strong> {{ ev.phone }}</div>
                    <div class="col-md-6"><strong>Alt:</strong> {{ ev.altText }}</div>
                  </div>
                  <div v-if="ev.imageSrc" class="mt-3">
                    <img
                      :src="ev.imageSrc"
                      class="img-fluid rounded"
                      style="max-height: 120px"
                      :alt="ev.altText"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ======================== PROGRAMAS (VIDEOS) ======================== -->
          <div v-else-if="currentCollection === 'programas'">
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
                    v-model="videoSearch"
                  />
                </div>
              </div>
              <div class="col-md-6 text-md-end">
                <button class="btn btn-primary" @click="openCreateModal('video')">
                  <i class="bi bi-plus-lg me-1"></i> Nuevo Programa
                </button>
              </div>
            </div>
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <div v-else>
              <div class="accordion" id="accordionVideos">
                <div
                  v-for="(video, index) in filteredVideos"
                  :key="video.id || index"
                  class="accordion-item mb-2 border rounded overflow-hidden"
                >
                  <h2 class="accordion-header">
                    <button
                      class="accordion-button"
                      :class="{ collapsed: videoExpandedIndex !== index }"
                      type="button"
                      @click="videoExpandedIndex = videoExpandedIndex === index ? null : index"
                    >
                      <div class="d-flex justify-content-between w-100 me-3 align-items-center">
                        <span class="fw-bold text-truncate me-2">{{
                          video.title || 'Sin título'
                        }}</span>
                        <small class="text-muted text-nowrap">{{ video.date }}</small>
                      </div>
                    </button>
                  </h2>
                  <div
                    class="accordion-collapse collapse"
                    :class="{ show: videoExpandedIndex === index }"
                  >
                    <div class="accordion-body bg-light">
                      <div class="d-flex justify-content-end mb-3 gap-2">
                        <button
                          v-if="editingId !== video.id"
                          class="btn btn-outline-primary btn-sm"
                          @click="editingId = video.id"
                        >
                          <i class="fas fa-edit me-1"></i> Editar
                        </button>
                        <button
                          v-if="editingId !== video.id"
                          class="btn btn-outline-danger btn-sm"
                          @click="deleteItem('video', video.id)"
                        >
                          <i class="bi bi-trash me-1"></i> Eliminar
                        </button>
                        <button
                          v-else
                          class="btn btn-success btn-sm"
                          @click="saveVideo(video)"
                          :disabled="isSaving"
                        >
                          <span
                            v-if="isSaving"
                            class="spinner-border spinner-border-sm me-1"
                          ></span>
                          {{ isSaving ? 'Guardando...' : 'Guardar' }}
                        </button>
                        <button
                          v-if="editingId === video.id"
                          class="btn btn-secondary btn-sm"
                          @click="editingId = null"
                        >
                          Cancelar
                        </button>
                      </div>
                      <div class="mb-3">
                        <label class="form-label fw-semibold">Título</label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="video.title"
                          :disabled="editingId !== video.id"
                        />
                      </div>
                      <div class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label fw-semibold">Fecha (DD-MM-YYYY)</label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="video.date"
                            placeholder="01-01-2025"
                            :disabled="editingId !== video.id"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label fw-semibold">Participante</label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="video.participant"
                            :disabled="editingId !== video.id"
                          />
                        </div>
                      </div>
                      <div class="mb-3">
                        <label class="form-label fw-semibold">URL del Video (embed)</label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="video.url"
                          placeholder="https://www.youtube.com/embed/..."
                          :disabled="editingId !== video.id"
                        />
                      </div>
                      <div class="mb-3">
                        <label class="form-label fw-semibold">Thumbnail URL</label>
                        <input
                          type="text"
                          class="form-control mb-2"
                          v-model="video.thumbnail"
                          :disabled="editingId !== video.id"
                        />
                        <div v-if="video.thumbnail" class="text-center rounded border p-2 bg-white">
                          <img
                            :src="video.thumbnail"
                            alt="Thumbnail"
                            class="img-fluid rounded"
                            style="max-height: 160px"
                          />
                        </div>
                      </div>
                      <div class="mb-3">
                        <label class="form-label fw-semibold">Descripción</label>
                        <textarea
                          class="form-control"
                          v-model="video.description"
                          rows="3"
                          :disabled="editingId !== video.id"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="filteredVideos.length === 0" class="text-center text-muted py-5">
                <i class="bi bi-camera-video display-4 d-block mb-2"></i>
                <p>No se encontraron programas.</p>
              </div>
            </div>
          </div>

          <!-- ======================== TEMAS ======================== -->
          <div v-else-if="currentCollection === 'temas'">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
            <div v-else>
              <form @submit.prevent="saveTemas">
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
                    <button type="button" class="btn btn-outline-danger" @click="removeTema(index)">
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
                <div class="mb-4">
                  <h5 class="fw-bold mb-3">Próximo Evento</h5>
                  <div class="row">
                    <div class="col-md-4 mb-3">
                      <label class="form-label">Fecha (YYYY-MM-DD)</label>
                      <input type="date" class="form-control" v-model="temasData.evento.fecha" />
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
                <div class="mb-4">
                  <h5 class="fw-bold mb-3">Participantes</h5>
                  <div class="row">
                    <div
                      v-for="person in allPeople"
                      :key="person.id"
                      class="col-md-6 col-lg-4 mb-2"
                    >
                      <div class="form-check border rounded p-2 d-flex align-items-center bg-white">
                        <input
                          class="form-check-input me-2 mt-0"
                          type="checkbox"
                          :value="person.id"
                          :checked="temasData.participantes.includes(person.id)"
                          @change="toggleParticipant(person.id)"
                          :id="'check-' + person.id"
                        />
                        <label
                          class="form-check-label d-flex align-items-center w-100"
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
                  <button type="submit" class="btn btn-success btn-lg px-5" :disabled="isSaving">
                    <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- ======================== SUSCRIPTORES ======================== -->
          <div v-else-if="currentCollection === 'suscriptores'">
            <div v-if="subscribersLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <div v-else-if="subscribersError" class="alert alert-danger">
              {{ subscribersError }}
            </div>
            <div v-else>
              <div class="d-flex align-items-center gap-3 mb-4">
                <span class="badge bg-primary fs-6 px-3 py-2">
                  <i class="bi bi-people-fill me-1"></i>
                  {{ subscribers.length }} suscriptor{{ subscribers.length !== 1 ? 'es' : '' }}
                </span>
                <button class="btn btn-outline-secondary btn-sm" @click="fetchSubscribers">
                  <i class="bi bi-arrow-clockwise me-1"></i>Actualizar
                </button>
              </div>
              <div class="card border-0 shadow-sm rounded-4 mb-4">
                <div class="card-header bg-white border-0 pt-3 pb-2 px-4">
                  <h5 class="fw-bold mb-0">
                    <i class="bi bi-envelope-fill me-2 text-primary"></i>Lista de Suscriptores
                  </h5>
                </div>
                <div class="card-body p-0">
                  <div v-if="subscribers.length === 0" class="text-center py-5 text-muted">
                    <i class="bi bi-inbox display-5 d-block mb-2"></i>
                    <p>Aún no hay suscriptores registrados.</p>
                  </div>
                  <div v-else class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                      <thead class="table-light">
                        <tr>
                          <th class="ps-4">#</th>
                          <th>Correo</th>
                          <th>Fecha de suscripción</th>
                          <th class="text-end pe-4">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(sub, i) in subscribers" :key="sub.id">
                          <td class="ps-4 text-muted small">{{ i + 1 }}</td>
                          <td>
                            <i class="bi bi-envelope me-2 text-primary"></i
                            ><strong>{{ sub.email }}</strong>
                          </td>
                          <td class="text-muted small">
                            {{
                              sub.subscribedAt
                                ? new Date(sub.subscribedAt).toLocaleDateString('es-MX', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                : 'Sin fecha'
                            }}
                          </td>
                          <td class="text-end pe-4">
                            <button
                              class="btn btn-outline-danger btn-sm"
                              @click="removeSubscriber(sub.id)"
                            >
                              <i class="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <!-- Newsletter -->
              <div class="card border-0 shadow-sm rounded-4">
                <div class="card-header bg-white border-0 pt-3 pb-2 px-4">
                  <h5 class="fw-bold mb-0">
                    <i class="bi bi-send-fill me-2 text-success"></i>Enviar Newsletter
                  </h5>
                  <small class="text-muted"
                    >Se enviará a todos los suscriptores ({{ subscribers.length }})</small
                  >
                </div>
                <div class="card-body px-4 pb-4">
                  <div
                    v-if="newsletterResult"
                    class="alert mb-3"
                    :class="newsletterResult.success ? 'alert-success' : 'alert-danger'"
                  >
                    <template v-if="newsletterResult.success">
                      <i class="bi bi-check-circle-fill me-2"></i>
                      <strong>¡Enviado!</strong> {{ newsletterResult.sent }} correo(s) enviados.
                      <span v-if="newsletterResult.errors > 0" class="ms-1 text-warning"
                        >({{ newsletterResult.errors }} con errores)</span
                      >
                    </template>
                    <template v-else>
                      <i class="bi bi-exclamation-circle-fill me-2"></i>
                      {{ newsletterResult.error || 'Error al enviar' }}
                    </template>
                  </div>
                  <div class="row mb-3">
                    <div class="col-md-4 mb-3">
                      <label class="form-label fw-semibold">Tipo</label>
                      <select class="form-select" v-model="newsletter.type">
                        <option value="blog">📝 Nuevo Blog</option>
                        <option value="program">🎬 Nuevo Programa</option>
                      </select>
                    </div>
                    <div class="col-md-8 mb-3">
                      <label class="form-label fw-semibold">Título *</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="newsletter.title"
                        placeholder="Ej: 5 tips para el sueño de tu bebé"
                      />
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Descripción corta</label>
                    <textarea
                      class="form-control"
                      v-model="newsletter.description"
                      rows="3"
                      placeholder="Resumen breve..."
                    ></textarea>
                  </div>
                  <div class="mb-4">
                    <label class="form-label fw-semibold">Enlace (URL)</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="bi bi-link-45deg"></i></span>
                      <input
                        type="url"
                        class="form-control"
                        v-model="newsletter.link"
                        placeholder="https://crianzasanabydkids.mx/..."
                      />
                    </div>
                  </div>
                  <div class="d-flex justify-content-end">
                    <button
                      class="btn btn-success btn-lg px-5"
                      @click="triggerNewsletter"
                      :disabled="isSendingNewsletter || !newsletter.title"
                    >
                      <span
                        v-if="isSendingNewsletter"
                        class="spinner-border spinner-border-sm me-2"
                      ></span>
                      <i v-else class="bi bi-send-fill me-2"></i>
                      {{ isSendingNewsletter ? 'Enviando...' : 'Enviar a todos' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- PLACEHOLDER -->
          <div v-else class="cfg-placeholder">
            <div class="cfg-placeholder-icon">📁</div>
            <p>
              Gestor para <strong>{{ currentCollectionLabel }}</strong> próximamente.
            </p>
          </div>
        </div>
      </main>
    </div>

    <!-- ======================== MODAL CREAR / EDITAR ======================== -->
    <div v-if="showModal" class="modal-backdrop fade show"></div>
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
      <div :class="['modal-dialog', modalType === 'blog' ? 'modal-xl' : 'modal-lg']">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ modalMode === 'create' ? 'Nuevo' : 'Editar' }} {{ modalTypeLabel }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <!-- BLOG FORM -->
            <template v-if="modalType === 'blog'">
              <!-- Row 1: Title -->
              <div class="mb-3">
                <label class="blog-field-label">Título del artículo *</label>
                <input
                  type="text"
                  class="form-control blog-field-input"
                  v-model="modalData.title"
                  placeholder="Escribe un título atractivo..."
                />
              </div>

              <!-- Row 2: Description -->
              <div class="mb-3">
                <label class="blog-field-label">Descripción breve *</label>
                <textarea
                  class="form-control blog-field-input"
                  v-model="modalData.description"
                  rows="2"
                  placeholder="Resumen del artículo para vista previa..."
                ></textarea>
              </div>

              <!-- Row 3: Author + Date -->
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="blog-field-label">Autor</label>
                  <input
                    type="text"
                    class="form-control blog-field-input"
                    v-model="modalData.authorName"
                    placeholder="Nombre del autor..."
                  />
                </div>
                <div class="col-md-6">
                  <label class="blog-field-label">Fecha de publicación</label>
                  <input type="date" class="form-control blog-field-input" v-model="modalData.dateInput" />
                </div>
              </div>

              <!-- Row 4: Category + Color + Image URL -->
              <div class="row g-3 mb-3">
                <div class="col-md-5">
                  <label class="blog-field-label">Categoría</label>
                  <input
                    type="text"
                    class="form-control blog-field-input"
                    v-model="modalData.category"
                    placeholder="Ej: Crianza, Salud..."
                  />
                </div>
                <div class="col-md-2">
                  <label class="blog-field-label">Color</label>
                  <input
                    type="color"
                    class="form-control form-control-color w-100 blog-color-input"
                    v-model="modalData.categoryColor"
                  />
                </div>
                <div class="col-md-5">
                  <label class="blog-field-label">URL de imagen destacada</label>
                  <input
                    type="text"
                    class="form-control blog-field-input"
                    v-model="modalData.imageUrl"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <!-- Image preview strip -->
              <div v-if="modalData.imageUrl" class="blog-img-preview mb-3">
                <img :src="modalData.imageUrl" alt="Vista previa imagen" />
              </div>

              <!-- Rich Content Editor -->
              <div class="mb-1">
                <div class="blog-editor-header">
                  <label class="blog-field-label mb-0">Contenido del artículo</label>
                  <div class="blog-editor-tabs">
                    <button
                      type="button"
                      :class="['blog-tab-btn', editorTab === 'editor' && 'active']"
                      @click="editorTab = 'editor'"
                    >
                      <i class="bi bi-pencil me-1"></i>Editor
                    </button>
                    <button
                      type="button"
                      :class="['blog-tab-btn', editorTab === 'preview' && 'active']"
                      @click="editorTab = 'preview'"
                    >
                      <i class="bi bi-eye me-1"></i>Vista previa
                    </button>
                  </div>
                </div>

                <!-- Toolbar -->
                <div v-show="editorTab === 'editor'" class="blog-toolbar">
                  <button type="button" class="toolbar-btn" @click="execFormat('bold')" title="Negrita (Ctrl+B)">
                    <b>B</b>
                  </button>
                  <button type="button" class="toolbar-btn" @click="execFormat('italic')" title="Cursiva (Ctrl+I)">
                    <i>I</i>
                  </button>
                  <button type="button" class="toolbar-btn" @click="execFormat('underline')" title="Subrayado">
                    <u>U</u>
                  </button>
                  <span class="toolbar-sep"></span>
                  <button type="button" class="toolbar-btn toolbar-btn-text" @click="formatBlock('h2')" title="Título grande">H2</button>
                  <button type="button" class="toolbar-btn toolbar-btn-text" @click="formatBlock('h3')" title="Subtítulo">H3</button>
                  <button type="button" class="toolbar-btn toolbar-btn-text" @click="formatBlock('p')" title="Párrafo normal">P</button>
                  <span class="toolbar-sep"></span>
                  <button type="button" class="toolbar-btn toolbar-quote" @click="insertBlockquote" title="Cita destacada">
                    <i class="bi bi-quote"></i>
                  </button>
                  <button type="button" class="toolbar-btn" @click="execFormat('insertUnorderedList')" title="Lista con viñetas">
                    <i class="bi bi-list-ul"></i>
                  </button>
                  <button type="button" class="toolbar-btn" @click="execFormat('insertOrderedList')" title="Lista numerada">
                    <i class="bi bi-list-ol"></i>
                  </button>
                  <span class="toolbar-sep"></span>
                  <button type="button" class="toolbar-btn" @click="insertLink" title="Insertar enlace">
                    <i class="bi bi-link-45deg"></i>
                  </button>
                  <button type="button" class="toolbar-btn toolbar-btn-danger" @click="clearEditorFormat" title="Quitar formato">
                    <i class="bi bi-eraser"></i>
                  </button>
                </div>

                <!-- Editor contenteditable -->
                <div
                  v-show="editorTab === 'editor'"
                  ref="richEditor"
                  class="blog-rich-editor"
                  contenteditable="true"
                  @input="syncEditorContent"
                  @paste.prevent="handlePaste"
                ></div>

                <!-- Preview pane -->
                <div
                  v-show="editorTab === 'preview'"
                  class="blog-preview-pane blog-content-typography"
                  v-html="modalData.text || '<p style=\'color:#aaa\'>Sin contenido aún...</p>'"
                ></div>
              </div>
            </template>

            <!-- AD / BANNER FORM -->
            <template v-else-if="modalType === 'ad' || modalType === 'banner'">
              <div class="mb-3">
                <label class="form-label">Imagen URL *</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="modalData.imageSrc"
                  placeholder="https://..."
                />
                <div v-if="modalData.imageSrc" class="mt-2 text-center">
                  <img
                    :src="modalData.imageSrc"
                    class="img-fluid rounded border"
                    style="max-height: 180px"
                    alt="preview"
                  />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Texto alternativo (alt)</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="modalData.altText"
                  placeholder="Descripción de la imagen"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Estado</label>
                <select class="form-select" v-model="modalData.active">
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </template>

            <!-- EVENTO FORM -->
            <template v-else-if="modalType === 'evento'">
              <div class="mb-3">
                <label class="form-label">Imagen URL</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="modalData.imageSrc"
                  placeholder="https://..."
                />
                <div v-if="modalData.imageSrc" class="mt-2 text-center">
                  <img
                    :src="modalData.imageSrc"
                    class="img-fluid rounded border"
                    style="max-height: 140px"
                    alt="preview"
                  />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Texto alternativo (alt)</label>
                <input type="text" class="form-control" v-model="modalData.altText" />
              </div>
              <div class="mb-3">
                <label class="form-label">Mensaje</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="modalData.message"
                  placeholder="Texto del evento..."
                />
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Texto del Botón</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="modalData.buttonText"
                    placeholder="Ej: Contáctanos"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Teléfono</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="modalData.phone"
                    placeholder="Ej: 6181072514"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Tipo</label>
                  <select class="form-select" v-model="modalData.type">
                    <option value="call">Llamada (call)</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="link">Enlace</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Mostrar Botón</label>
                  <select class="form-select" v-model="modalData.showButton">
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            </template>

            <!-- VIDEO FORM -->
            <template v-else-if="modalType === 'video'">
              <div class="mb-3">
                <label class="form-label">Título *</label>
                <input type="text" class="form-control" v-model="modalData.title" />
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Fecha (DD-MM-YYYY) *</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="modalData.date"
                    placeholder="01-01-2025"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Participante</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="modalData.participant"
                    placeholder="Nombre del especialista"
                  />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">URL del Video (embed) *</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="modalData.url"
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Thumbnail URL</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="modalData.thumbnail"
                  placeholder="https://..."
                />
                <div v-if="modalData.thumbnail" class="mt-2 text-center">
                  <img
                    :src="modalData.thumbnail"
                    class="img-fluid rounded border"
                    style="max-height: 140px"
                    alt="thumbnail"
                  />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea class="form-control" v-model="modalData.description" rows="3"></textarea>
              </div>
            </template>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
            <button
              type="button"
              class="btn btn-primary"
              @click="submitModal"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
              {{ modalMode === 'create' ? 'Crear' : 'Guardar cambios' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /.cfg-root -->
</template>

<script>
import { inject, ref } from 'vue'
import {
  getBlogs,
  updateBlog,
  createBlog,
  getPrograms,
  updateProgram,
  getSubscribers,
  deleteSubscriber,
  sendNewsletter,
  getAllAds,
  updateAd,
  createAd,
  deleteAd,
  getAllBanners,
  updateBanner,
  createBanner,
  deleteBanner,
  getAllEventos,
  updateEvento,
  createEvento,
  deleteEvento,
  getAllCampanas,
  updateCampana,
  getVideos,
  updateVideo,
  createVideo,
  deleteVideo,
} from '@/composables/useFirestore'
import people from '../../data'

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim())
  .filter(Boolean)

export default {
  name: 'ConfigurationView',
  setup() {
    const currentUser = inject('currentUser', ref(null))
    return { currentUser }
  },
  data() {
    return {
      currentCollection: 'blogs',
      collections: [
        { key: 'ad', label: 'Anuncios', icon: '📢' },
        { key: 'banner', label: 'Banners', icon: '🖼️' },
        { key: 'blogs', label: 'Blogs', icon: '✍️' },
        { key: 'campana', label: 'Campañas', icon: '📣' },
        { key: 'eventos', label: 'Eventos', icon: '📅' },
        { key: 'programas', label: 'Programas', icon: '🎬' },
        { key: 'temas', label: 'Temas', icon: '🎨' },
        { key: 'suscriptores', label: 'Suscriptores', icon: '📧' },
      ],
      loading: false,
      error: null,
      isSaving: false,

      // Blogs
      blogs: [],
      expandedIndex: null,
      editingId: null,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,

      // Ads
      ads: [],

      // Banners
      banners: [],

      // Campañas
      campanas: [],

      // Eventos
      eventos: [],

      // Videos/Programas
      videos: [],
      videoExpandedIndex: null,
      videoSearch: '',

      // Temas
      temasData: {
        id: null,
        temas: [],
        colores: { primario: '#4a1a1a', secundario: '#fcd34d', titulo: '#ffffff' },
        evento: { fecha: '', hora: '', mensaje: '' },
        participantes: [],
      },
      allPeople: people,

      // Suscriptores
      subscribers: [],
      subscribersLoading: false,
      subscribersError: null,
      newsletter: { type: 'blog', title: '', description: '', link: '' },
      isSendingNewsletter: false,
      newsletterResult: null,

      // Modal genérico
      showModal: false,
      modalMode: 'create', // 'create' | 'edit'
      modalType: '', // 'blog' | 'ad' | 'banner' | 'evento' | 'video'
      modalData: {},
      isSubmitting: false,
      editorTab: 'editor',
    }
  },
  computed: {
    isAdmin() {
      const email = this.currentUser?.email
      return email && ADMIN_EMAILS.includes(email)
    },
    currentCollectionLabel() {
      const col = this.collections.find((c) => c.key === this.currentCollection)
      return col ? col.label : 'General'
    },
    currentCollectionIcon() {
      const col = this.collections.find((c) => c.key === this.currentCollection)
      return col ? col.icon : '📄'
    },
    filteredBlogs() {
      if (!this.searchQuery) return this.blogs
      const q = this.searchQuery.toLowerCase()
      return this.blogs.filter(
        (b) => b.title?.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q),
      )
    },
    totalPages() {
      return Math.ceil(this.filteredBlogs.length / this.itemsPerPage)
    },
    paginatedBlogs() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.filteredBlogs.slice(start, start + this.itemsPerPage)
    },
    filteredVideos() {
      if (!this.videoSearch) return this.videos
      const q = this.videoSearch.toLowerCase()
      return this.videos.filter((v) => v.title?.toLowerCase().includes(q))
    },
    modalTypeLabel() {
      const labels = {
        blog: 'Blog',
        ad: 'Anuncio',
        banner: 'Banner',
        evento: 'Evento',
        video: 'Programa',
      }
      return labels[this.modalType] || this.modalType
    },
  },
  async mounted() {
    if (this.isAdmin) {
      await this.fetchBlogs()
    }
  },
  watch: {
    currentUser() {
      if (this.isAdmin && this.blogs.length === 0) {
        this.fetchBlogs()
      }
    },
    currentCollection(newVal) {
      this.expandedIndex = null
      this.videoExpandedIndex = null
      this.editingId = null
      this.searchQuery = ''
      this.videoSearch = ''
      this.currentPage = 1
      this.loadCollection(newVal)
    },
    searchQuery() {
      this.currentPage = 1
    },
  },
  methods: {
    switchCollection(key) {
      this.currentCollection = key
    },
    async loadCollection(key) {
      switch (key) {
        case 'blogs':
          if (this.blogs.length === 0) await this.fetchBlogs()
          break
        case 'ad':
          await this.fetchAds()
          break
        case 'banner':
          await this.fetchBanners()
          break
        case 'campana':
          await this.fetchCampanas()
          break
        case 'eventos':
          await this.fetchEventos()
          break
        case 'programas':
          await this.fetchVideos()
          break
        case 'temas':
          await this.fetchTemas()
          break
        case 'suscriptores':
          await this.fetchSubscribers()
          break
      }
    },

    // --- BLOGS ---
    async fetchBlogs() {
      this.loading = true
      this.error = null
      try {
        this.blogs = await getBlogs()
      } catch {
        this.error = 'Error al cargar blogs.'
      } finally {
        this.loading = false
      }
    },
    async saveBlog(blog) {
      this.isSaving = true
      try {
        const ok = await updateBlog(blog.id, blog)
        if (ok) {
          this.editingId = null
          alert('Blog guardado correctamente')
        } else {
          alert('Error al guardar el blog')
        }
      } catch {
        alert('Error inesperado al guardar')
      } finally {
        this.isSaving = false
      }
    },

    // --- ADS ---
    async fetchAds() {
      this.loading = true
      try {
        this.ads = await getAllAds()
      } catch {
        this.error = 'Error al cargar anuncios.'
      } finally {
        this.loading = false
      }
    },

    // --- BANNERS ---
    async fetchBanners() {
      this.loading = true
      try {
        this.banners = await getAllBanners()
      } catch {
        this.error = 'Error al cargar banners.'
      } finally {
        this.loading = false
      }
    },

    // --- CAMPAÑAS ---
    async fetchCampanas() {
      this.loading = true
      try {
        this.campanas = await getAllCampanas()
      } catch {
        this.error = 'Error al cargar campañas.'
      } finally {
        this.loading = false
      }
    },
    async saveCampana(camp) {
      this.isSaving = true
      try {
        const ok = await updateCampana(camp.id, { img: camp.img, finalDate: camp.finalDate })
        if (ok) alert('Campaña guardada correctamente')
        else alert('Error al guardar campaña')
      } catch {
        alert('Error inesperado')
      } finally {
        this.isSaving = false
      }
    },

    // --- EVENTOS ---
    async fetchEventos() {
      this.loading = true
      try {
        this.eventos = await getAllEventos()
      } catch {
        this.error = 'Error al cargar eventos.'
      } finally {
        this.loading = false
      }
    },

    // --- VIDEOS ---
    async fetchVideos() {
      this.loading = true
      try {
        this.videos = await getVideos()
      } catch {
        this.error = 'Error al cargar programas.'
      } finally {
        this.loading = false
      }
    },
    async saveVideo(video) {
      this.isSaving = true
      try {
        const { ...data } = video
        const ok = await updateVideo(video.id, data)
        if (ok) {
          this.editingId = null
          alert('Programa guardado correctamente')
        } else {
          alert('Error al guardar')
        }
      } catch {
        alert('Error inesperado')
      } finally {
        this.isSaving = false
      }
    },

    // --- TEMAS ---
    async fetchTemas() {
      this.loading = true
      this.error = null
      try {
        const programs = await getPrograms()
        if (programs?.length > 0) {
          const p = programs[0]
          this.temasData = {
            id: p.id,
            temas: p.temas || [],
            colores: p.colores || { primario: '#4a1a1a', secundario: '#fcd34d', titulo: '#ffffff' },
            evento: p.evento || { fecha: '', hora: '', mensaje: '' },
            participantes: p.participantes || [],
          }
        }
      } catch {
        this.error = 'Error al cargar temas.'
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
      const idx = this.temasData.participantes.indexOf(personId)
      if (idx === -1) this.temasData.participantes.push(personId)
      else this.temasData.participantes.splice(idx, 1)
    },
    async saveTemas() {
      if (!this.temasData.id) return
      this.isSaving = true
      try {
        const data = { ...this.temasData, temas: this.temasData.temas.filter((t) => t.trim()) }
        const ok = await updateProgram(this.temasData.id, data)
        if (ok) alert('Temas guardados correctamente')
        else alert('Error al guardar Temas')
      } catch {
        alert('Error inesperado al guardar Temas')
      } finally {
        this.isSaving = false
      }
    },

    // --- SUSCRIPTORES ---
    async fetchSubscribers() {
      this.subscribersLoading = true
      this.subscribersError = null
      try {
        this.subscribers = await getSubscribers()
      } catch {
        this.subscribersError = 'Error al cargar suscriptores.'
      } finally {
        this.subscribersLoading = false
      }
    },
    async removeSubscriber(id) {
      if (!confirm('¿Eliminar este suscriptor?')) return
      const ok = await deleteSubscriber(id)
      if (ok) this.subscribers = this.subscribers.filter((s) => s.id !== id)
      else alert('Error al eliminar suscriptor')
    },
    async triggerNewsletter() {
      if (!this.newsletter.title.trim()) return alert('Escribe un título')
      this.isSendingNewsletter = true
      this.newsletterResult = null
      try {
        this.newsletterResult = await sendNewsletter(this.newsletter)
      } catch (e) {
        this.newsletterResult = {
          success: false,
          error: e?.response?.data?.error || 'Error al enviar',
        }
      } finally {
        this.isSendingNewsletter = false
      }
    },

    // --- GENERIC DELETE ---
    async deleteItem(type, id) {
      if (!confirm('¿Eliminar este elemento? Esta acción no se puede deshacer.')) return
      let ok = false
      if (type === 'ad') ok = await deleteAd(id)
      else if (type === 'banner') ok = await deleteBanner(id)
      else if (type === 'evento') ok = await deleteEvento(id)
      else if (type === 'video') ok = await deleteVideo(id)

      if (ok) {
        if (type === 'ad') this.ads = this.ads.filter((i) => i.id !== id)
        else if (type === 'banner') this.banners = this.banners.filter((i) => i.id !== id)
        else if (type === 'evento') this.eventos = this.eventos.filter((i) => i.id !== id)
        else if (type === 'video') this.videos = this.videos.filter((i) => i.id !== id)
      } else {
        alert('Error al eliminar')
      }
    },

    // --- MODAL ---
    openCreateModal(type) {
      this.modalMode = 'create'
      this.modalType = type
      const defaults = {
        blog: {
          title: '',
          description: '',
          authorName: '',
          dateInput: new Date().toISOString().split('T')[0],
          category: '',
          categoryColor: '#000000',
          imageUrl: '',
          text: '',
          orden: 0,
        },
        ad: { imageSrc: '', altText: '', active: 'true' },
        banner: { imageSrc: '', altText: '', active: 'true' },
        evento: {
          imageSrc: '',
          altText: '',
          message: '',
          buttonText: '',
          phone: '',
          type: 'call',
          showButton: 'true',
        },
        video: { title: '', date: '', url: '', thumbnail: '', participant: '', description: '' },
      }
      this.modalData = { ...defaults[type] }
      this.editorTab = 'editor'
      this.showModal = true
      if (type === 'blog') {
        this.$nextTick(() => {
          if (this.$refs.richEditor) this.$refs.richEditor.innerHTML = this.modalData.text || ''
        })
      }
    },
    openEditModal(type, item) {
      this.modalMode = 'edit'
      this.modalType = type
      this.modalData = { ...item }
      this.editorTab = 'editor'
      this.showModal = true
      if (type === 'blog') {
        this.$nextTick(() => {
          if (this.$refs.richEditor) this.$refs.richEditor.innerHTML = this.modalData.text || ''
        })
      }
    },
    closeModal() {
      this.showModal = false
      this.modalData = {}
    },
    // Rich editor helpers
    syncEditorContent() {
      if (this.$refs.richEditor) this.modalData.text = this.$refs.richEditor.innerHTML
    },
    execFormat(command) {
      this.$refs.richEditor?.focus()
      document.execCommand(command, false, null)
      this.syncEditorContent()
    },
    formatBlock(tag) {
      this.$refs.richEditor?.focus()
      document.execCommand('formatBlock', false, tag)
      this.syncEditorContent()
    },
    insertBlockquote() {
      this.$refs.richEditor?.focus()
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0)
        const selectedText = range.toString() || 'Escribe tu cita aquí...'
        const bq = document.createElement('blockquote')
        bq.textContent = selectedText
        range.deleteContents()
        range.insertNode(bq)
        // move cursor after blockquote
        const p = document.createElement('p')
        p.innerHTML = '<br>'
        bq.after(p)
        const newRange = document.createRange()
        newRange.setStart(p, 0)
        newRange.collapse(true)
        sel.removeAllRanges()
        sel.addRange(newRange)
      }
      this.syncEditorContent()
    },
    insertLink() {
      const url = prompt('URL del enlace:')
      if (url) {
        this.$refs.richEditor?.focus()
        document.execCommand('createLink', false, url)
        this.syncEditorContent()
      }
    },
    clearEditorFormat() {
      this.$refs.richEditor?.focus()
      document.execCommand('removeFormat', false, null)
      this.syncEditorContent()
    },
    handlePaste(e) {
      const text = e.clipboardData.getData('text/plain')
      document.execCommand('insertText', false, text)
      this.syncEditorContent()
    },
    async submitModal() {
      this.isSubmitting = true
      try {
        if (this.modalMode === 'create') {
          await this.createItem()
        } else {
          await this.editItem()
        }
      } finally {
        this.isSubmitting = false
      }
    },
    async createItem() {
      const type = this.modalType
      let newId = null

      if (type === 'blog') {
        const data = { ...this.modalData }
        data.date = data.dateInput
          ? new Date(data.dateInput).toISOString()
          : new Date().toISOString()
        delete data.dateInput
        newId = await createBlog(data)
        if (newId) await this.fetchBlogs()
      } else if (type === 'ad') {
        newId = await createAd(this.modalData)
        if (newId) await this.fetchAds()
      } else if (type === 'banner') {
        newId = await createBanner(this.modalData)
        if (newId) await this.fetchBanners()
      } else if (type === 'evento') {
        newId = await createEvento(this.modalData)
        if (newId) await this.fetchEventos()
      } else if (type === 'video') {
        newId = await createVideo(this.modalData)
        if (newId) await this.fetchVideos()
      }

      if (newId) {
        alert(`${this.modalTypeLabel} creado correctamente`)
        this.closeModal()
      } else {
        alert(`Error al crear ${this.modalTypeLabel}`)
      }
    },
    async editItem() {
      const type = this.modalType
      const id = this.modalData.id
      let ok = false

      if (type === 'ad') {
        ok = await updateAd(id, this.modalData)
        if (ok) {
          const i = this.ads.findIndex((a) => a.id === id)
          if (i !== -1) this.ads[i] = { ...this.modalData }
        }
      } else if (type === 'banner') {
        ok = await updateBanner(id, this.modalData)
        if (ok) {
          const i = this.banners.findIndex((b) => b.id === id)
          if (i !== -1) this.banners[i] = { ...this.modalData }
        }
      } else if (type === 'evento') {
        ok = await updateEvento(id, this.modalData)
        if (ok) {
          const i = this.eventos.findIndex((e) => e.id === id)
          if (i !== -1) this.eventos[i] = { ...this.modalData }
        }
      } else if (type === 'video') {
        ok = await updateVideo(id, this.modalData)
        if (ok) await this.fetchVideos()
      }

      if (ok) {
        alert(`${this.modalTypeLabel} actualizado correctamente`)
        this.closeModal()
      } else {
        alert(`Error al actualizar ${this.modalTypeLabel}`)
      }
    },

    // --- UTILS ---
    toggleExpand(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--
    },
    parseDate(dateField) {
      if (!dateField) return null
      if (dateField.seconds || dateField._seconds)
        return new Date((dateField.seconds || dateField._seconds) * 1000)
      const d = new Date(dateField)
      return isNaN(d.getTime()) ? null : d
    },
    formatDate(dateString) {
      const d = this.parseDate(dateString)
      return d ? d.toLocaleDateString() : 'Sin fecha'
    },
    formatDateForInput(dateString) {
      const d = this.parseDate(dateString)
      return d ? d.toISOString().split('T')[0] : ''
    },
    updateDate(blog, event) {
      const val = event.target.value
      if (!val) return
      const d = new Date(val)
      if (!isNaN(d.getTime())) blog.date = d.toISOString()
    },
  },
}
</script>

<style scoped>
/* ============================================================
   ROOT & LAYOUT
   ============================================================ */
.cfg-root {
  min-height: 100vh;
  background: var(--dm-surface-2);
  font-family:
    'Segoe UI',
    system-ui,
    -apple-system,
    sans-serif;
  padding-top: 76px; /* offset for sticky navbar */
}

.cfg-layout {
  display: flex;
  min-height: calc(100vh - 76px);
}

/* ============================================================
   TOP HEADER BAR
   ============================================================ */
.cfg-topbar {
  position: fixed;
  top: 62px; /* below the site navbar */
  left: 0;
  right: 0;
  height: 54px;
  background: linear-gradient(90deg, #2d1b69 0%, #7c3aed 60%, #a855f7 100%);
  z-index: 1000;
  box-shadow: 0 2px 16px rgba(124, 58, 237, 0.25);
}

.cfg-topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 2rem;
}

.cfg-topbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #fff;
}

.cfg-topbar-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #fff;
  flex-shrink: 0;
}

.cfg-topbar-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.02em;
}

.cfg-topbar-sub {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 1px;
}

.cfg-topbar-badge {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 50px;
  letter-spacing: 0.03em;
}

/* ============================================================
   SIDEBAR
   ============================================================ */
.cfg-sidebar {
  width: 230px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #1e1246 0%, #2d1b69 40%, #3b21a0 100%);
  min-height: calc(100vh - 130px); /* below topbar + navbar */
  padding: 1.5rem 0 2rem;
  overflow: hidden;
  box-shadow: 2px 0 20px rgba(45, 27, 105, 0.15);
}

.cfg-sidebar-scroll {
  height: 100%;
  overflow-y: auto;
  padding: 0 0.75rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.cfg-sidebar-scroll::-webkit-scrollbar {
  width: 5px;
}
.cfg-sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.cfg-sidebar-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.cfg-sidebar-section-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  padding: 0 0.75rem;
  margin-bottom: 0.5rem;
}

.cfg-nav-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.18s,
    color 0.18s,
    transform 0.12s;
  position: relative;
  margin-bottom: 2px;
  text-align: left;
}

.cfg-nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.cfg-nav-item.active {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.cfg-nav-icon {
  font-size: 1.05rem;
  width: 24px;
  flex-shrink: 0;
  text-align: center;
}

.cfg-nav-label {
  flex: 1;
}

.cfg-nav-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #a78bfa;
  flex-shrink: 0;
  box-shadow: 0 0 6px rgba(167, 139, 250, 0.8);
}

/* ============================================================
   MAIN CONTENT AREA
   ============================================================ */
.cfg-main {
  flex: 1;
  padding: 2rem 2rem 3rem;
  overflow-y: auto;
  min-width: 0;
}

/* === Section Header === */
.cfg-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.cfg-section-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cfg-section-icon {
  font-size: 2.2rem;
  line-height: 1;
}

.cfg-section-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e1246;
  margin: 0;
  line-height: 1.2;
}

.cfg-section-sub {
  font-size: 0.82rem;
  color: var(--dm-text-secondary);
  margin: 0;
}

/* === Content Card === */
.cfg-content-card {
  background: var(--dm-surface);
  border-radius: 20px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 8px 32px rgba(45, 27, 105, 0.07);
  padding: 2rem;
  animation: cfg-slide-in 0.25s ease;
}

@keyframes cfg-slide-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============================================================
   ACCESS DENIED PAGE
   ============================================================ */
.cfg-denied-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 130px);
  padding: 2rem;
}

.cfg-denied-card {
  background: var(--dm-surface);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  text-align: center;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
}

.cfg-denied-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.cfg-denied-card h3 {
  font-weight: 800;
  color: #1e1246;
  margin-bottom: 0.5rem;
}

.cfg-denied-card p {
  color: var(--dm-text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

/* ============================================================
   SHARED BUTTON STYLES
   ============================================================ */
.cfg-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.4rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition:
    opacity 0.2s,
    transform 0.15s,
    box-shadow 0.2s;
}

.cfg-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.cfg-btn-primary {
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: #fff;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
}

/* ============================================================
   PLACEHOLDER STATE
   ============================================================ */
.cfg-placeholder {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--dm-text-secondary);
}

.cfg-placeholder-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.cfg-placeholder p {
  font-size: 0.95rem;
}

.cfg-placeholder strong {
  color: #7c3aed;
}

/* ============================================================
   MODAL IMPROVEMENTS
   ============================================================ */
.modal-content {
  border-radius: 20px;
  border: none;
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #2d1b69, #7c3aed);
  color: #fff;
  border-bottom: none;
  padding: 1.25rem 1.5rem;
}

.modal-header .modal-title {
  font-weight: 700;
  font-size: 1.05rem;
}

.modal-header .btn-close {
  filter: invert(1) brightness(2);
  opacity: 0.8;
}

.modal-body {
  padding: 1.5rem;
}
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--dm-border);
  background: var(--dm-surface-2);
}

/* ============================================================
   ACCORDION TWEAKS
   ============================================================ */
.accordion-button:not(.collapsed) {
  background: linear-gradient(90deg, rgba(124, 58, 237, 0.06), rgba(168, 85, 247, 0.04));
  color: #4c1d95;
  box-shadow: none;
  border-left: 3px solid #7c3aed;
}

.accordion-button:focus {
  box-shadow: none;
}

.accordion-item {
  transition: box-shadow 0.2s;
}
.accordion-item:hover {
  box-shadow: 0 4px 14px rgba(45, 27, 105, 0.1) !important;
}

/* ============================================================
   TABLE TWEAKS
   ============================================================ */
.table th {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--dm-text-secondary);
}

.table tbody tr {
  transition: background 0.15s;
}

.table tbody tr:hover {
  background: rgba(124, 58, 237, 0.03);
}

/* ============================================================
   FORM CONTROLS
   ============================================================ */
.form-control:focus,
.form-select:focus {
  border-color: #a78bfa;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
}

<style scoped>
/* ===========================================================
   ROOT
   =========================================================== */
.cfg-root {
  min-height: 100vh;
  background: var(--dm-surface-2);
  font-family: 'Segoe UI', system-ui, sans-serif;
  padding-top: 62px; /* below the fixed site navbar */
}

/* ===========================================================
   PAGE GRID
   =========================================================== */
.cfg-page {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: calc(100vh - 62px);
  align-items: start;
}

/* ===========================================================
   SIDEBAR
   =========================================================== */
.cfg-sidebar {
  position: sticky;
  top: 62px;
  height: calc(100vh - 62px);
  overflow-y: auto;
  background: linear-gradient(175deg, #1e0f4e 0%, #2d1b69 55%, #3b1fa3 100%);
  display: flex;
  flex-direction: column;
  padding: 1.25rem 0.75rem 1rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
  box-shadow: 3px 0 20px rgba(29, 15, 78, 0.16);
}
.cfg-sidebar::-webkit-scrollbar {
  width: 4px;
}
.cfg-sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

.cfg-sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.4rem 0.5rem 1.1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1rem;
  flex-shrink: 0;
}
.cfg-sidebar-brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #fff;
  flex-shrink: 0;
}
.cfg-sidebar-brand-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}
.cfg-sidebar-brand-sub {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.45);
}

.cfg-sidebar-section-label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  padding: 0 0.5rem;
  margin-bottom: 0.4rem;
  flex-shrink: 0;
}

.cfg-nav-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
  margin-bottom: 2px;
  text-align: left;
  flex-shrink: 0;
}
.cfg-nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transform: translateX(2px);
}
.cfg-nav-item.active {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  font-weight: 700;
}
.cfg-nav-icon {
  font-size: 1rem;
  width: 22px;
  text-align: center;
  flex-shrink: 0;
}
.cfg-nav-label {
  flex: 1;
}
.cfg-nav-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #a78bfa;
  box-shadow: 0 0 8px rgba(167, 139, 250, 0.8);
  flex-shrink: 0;
}

.cfg-sidebar-footer {
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.73rem;
  display: flex;
  align-items: center;
  word-break: break-all;
  flex-shrink: 0;
}

/* ===========================================================
   MAIN
   =========================================================== */
.cfg-main {
  min-width: 0;
  padding: 2rem 2.5rem 3rem;
}

.cfg-page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.cfg-page-header-icon {
  font-size: 2.2rem;
  line-height: 1;
}
.cfg-page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e0f4e;
  margin: 0;
}
.cfg-page-sub {
  font-size: 0.8rem;
  color: var(--dm-text-secondary);
  margin: 0;
}

.cfg-card {
  background: var(--dm-surface);
  border-radius: 20px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 6px 28px rgba(29, 15, 78, 0.07);
  padding: 2rem;
  animation: cfg-fade 0.22s ease;
}
@keyframes cfg-fade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===========================================================
   ACCESS DENIED
   =========================================================== */
.cfg-denied-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 62px);
  padding: 2rem;
}
.cfg-denied-card {
  background: var(--dm-surface);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  text-align: center;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
}
.cfg-denied-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}
.cfg-denied-card h3 {
  font-weight: 800;
  color: #1e0f4e;
  margin-bottom: 0.5rem;
}
.cfg-denied-card p {
  color: var(--dm-text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

/* ===========================================================
   BUTTONS
   =========================================================== */
.cfg-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.65rem 1.5rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition:
    opacity 0.2s,
    transform 0.15s;
}
.cfg-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
.cfg-btn-primary {
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: #fff;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
}

/* ===========================================================
   PLACEHOLDER
   =========================================================== */
.cfg-placeholder {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--dm-text-secondary);
}
.cfg-placeholder-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}
.cfg-placeholder strong {
  color: #7c3aed;
}

/* ===========================================================
   MODAL
   =========================================================== */
.modal-content {
  border-radius: 20px;
  border: none;
  overflow: hidden;
}
.modal-header {
  background: linear-gradient(135deg, #2d1b69, #7c3aed);
  color: #fff;
  border-bottom: none;
  padding: 1.25rem 1.5rem;
}
.modal-header .modal-title {
  font-weight: 700;
  font-size: 1.05rem;
}
.modal-header .btn-close {
  filter: invert(1) brightness(2);
  opacity: 0.8;
}
.modal-body {
  padding: 1.5rem;
}
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--dm-border);
  background: var(--dm-surface-2);
}

/* ===========================================================
   ACCORDION
   =========================================================== */
.accordion-button:not(.collapsed) {
  background: rgba(124, 58, 237, 0.05);
  color: #4c1d95;
  box-shadow: none;
  border-left: 3px solid #7c3aed;
}
.accordion-button:focus {
  box-shadow: none;
}
.accordion-item:hover {
  box-shadow: 0 4px 14px rgba(29, 15, 78, 0.1) !important;
}

/* ===========================================================
   TABLE
   =========================================================== */
.table th {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--dm-text-secondary);
}
.table tbody tr:hover {
  background: rgba(124, 58, 237, 0.03);
}

/* ===========================================================
   FORMS
   =========================================================== */
.form-control:focus,
.form-select:focus {
  border-color: #a78bfa;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
}

/* ===========================================================
   BLOG MODAL – FIELD LABELS & INPUTS
   =========================================================== */
.blog-field-label {
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--dm-text-secondary);
  margin-bottom: 0.4rem;
}
.blog-field-input {
  border-radius: 10px;
  border: 1.5px solid var(--dm-border);
  font-size: 0.95rem;
  transition: border-color 0.2s;
}
.blog-field-input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}
.blog-color-input {
  height: 42px;
  border-radius: 10px;
  border: 1.5px solid var(--dm-border);
  cursor: pointer;
  padding: 4px;
}

/* Image preview strip */
.blog-img-preview {
  border-radius: 12px;
  overflow: hidden;
  max-height: 180px;
  border: 1.5px solid var(--dm-border);
}
.blog-img-preview img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

/* ===========================================================
   BLOG EDITOR HEADER & TABS
   =========================================================== */
.blog-editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.blog-editor-tabs {
  display: flex;
  gap: 4px;
  background: var(--dm-surface-2);
  border-radius: 8px;
  padding: 3px;
}
.blog-tab-btn {
  padding: 5px 14px;
  font-size: 0.82rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--dm-text-secondary);
  cursor: pointer;
  transition: all 0.18s;
}
.blog-tab-btn.active {
  background: var(--dm-surface);
  color: #4c1d95;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

/* ===========================================================
   BLOG TOOLBAR
   =========================================================== */
.blog-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;
  background: var(--dm-surface-2);
  border: 1.5px solid var(--dm-border);
  border-bottom: none;
  border-radius: 10px 10px 0 0;
  padding: 6px 10px;
}
.toolbar-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--dm-text-secondary);
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.toolbar-btn:hover {
  background: #ede9fe;
  color: #4c1d95;
}
.toolbar-btn-text {
  font-size: 0.8rem;
  font-weight: 700;
}
.toolbar-quote {
  font-size: 1.1rem;
  color: #7c3aed;
}
.toolbar-quote:hover {
  background: rgba(124, 58, 237, 0.15);
  color: #4c1d95;
}
.toolbar-btn-danger:hover {
  background: rgba(220, 38, 38, 0.15);
  color: #dc2626;
}
.toolbar-sep {
  width: 1px;
  height: 22px;
  background: #d1d5db;
  margin: 0 4px;
  flex-shrink: 0;
}

/* ===========================================================
   RICH EDITOR & PREVIEW
   =========================================================== */
.blog-rich-editor {
  min-height: 280px;
  max-height: 420px;
  overflow-y: auto;
  border: 1.5px solid var(--dm-border);
  border-radius: 0 0 10px 10px;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  line-height: 1.75;
  color: var(--dm-text);
  background: var(--dm-surface);
  outline: none;
  font-family: 'Segoe UI', system-ui, sans-serif;
}
.blog-rich-editor:focus {
  border-color: #a78bfa;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}
.blog-rich-editor:empty::before {
  content: 'Empieza a escribir el contenido del artículo...';
  color: var(--dm-text-secondary);
  pointer-events: none;
}

/* Typography inside the editor and preview */
.blog-rich-editor h2,
.blog-preview-pane h2 {
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--dm-text);
  margin: 1.2rem 0 0.5rem;
  line-height: 1.25;
}
.blog-rich-editor h3,
.blog-preview-pane h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--dm-text);
  margin: 1rem 0 0.4rem;
}
.blog-rich-editor blockquote,
.blog-preview-pane blockquote {
  position: relative;
  margin: 1.25rem 0;
  padding: 1rem 1.25rem 1rem 1.5rem;
  background: rgba(124, 58, 237, 0.1);
  border-left: 4px solid #7c3aed;
  border-radius: 0 10px 10px 0;
  font-style: italic;
  font-size: 1.05rem;
  color: #4c1d95;
  line-height: 1.7;
  quotes: none;
}
.blog-rich-editor blockquote::before,
.blog-preview-pane blockquote::before {
  content: '\201C';
  position: absolute;
  top: -8px;
  left: 12px;
  font-size: 3rem;
  font-style: normal;
  color: #7c3aed;
  opacity: 0.35;
  line-height: 1;
  font-family: Georgia, serif;
}
.blog-rich-editor ul,
.blog-preview-pane ul,
.blog-rich-editor ol,
.blog-preview-pane ol {
  padding-left: 1.5rem;
  margin: 0.5rem 0 1rem;
}
.blog-rich-editor li,
.blog-preview-pane li {
  margin-bottom: 0.35rem;
}
.blog-rich-editor a,
.blog-preview-pane a {
  color: #7c3aed;
  text-decoration: underline;
}
.blog-rich-editor strong,
.blog-preview-pane strong {
  font-weight: 700;
  color: #111827;
}

/* Preview pane */
.blog-preview-pane {
  min-height: 280px;
  max-height: 420px;
  overflow-y: auto;
  border: 1.5px solid var(--dm-border);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  background: var(--dm-surface);
  font-size: 1rem;
  line-height: 1.75;
  color: var(--dm-text);
}
</style>
