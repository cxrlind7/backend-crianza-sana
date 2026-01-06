// src/data/courseData.js

export const courses = [
  {
    id: 'curso-psico-luis-01',
    // Título enfocado en psicología infanto-juvenil
    title: 'Crianza Consciente: Entendiendo el Mundo Emocional de tu Hijo',
    subtitle:
      'Herramientas prácticas para fortalecer el vínculo y gestionar los desafíos emocionales desde la infancia hasta la adolescencia.',
    description:
      'Este programa, diseñado por el Psicólogo Infanto-Juvenil Luis P. Galván Solís, te guiará para descifrar el comportamiento de tus hijos más allá de las palabras. Aprenderás a validar sus emociones, establecer límites sanos y fomentar una autoestima sólida, dejando de lado los gritos y castigos para conectar desde la empatía y el respeto mutuo.',
    presenter: {
      name: 'Luis P. Galván Solís',
      role: 'Psicólogo Infanto-Juvenil',
      image: '/LuisNoviembre1.jpeg', // Usando imagen de public
    },
    price: {
      original: 1500,
      discounted: 699,
      currency: 'MXN',
    },
    features: [
      'Acceso ilimitado de por vida',
      '4 Módulos Teórico-Prácticos en Video',
      'Cuaderno de trabajo descargable (PDF)',
      'Sesión grupal de preguntas y respuestas (Grabada)',
      'Certificado de participación digital',
    ],
    // Contenido actualizado a temas de psicología
    content: [
      {
        type: 'video',
        title: 'Módulo 1: El Cerebro del Niño y sus Emociones',
        duration: '50 min',
        // Video placeholder de YouTube (ejemplo: charla sobre emociones)
        videoId: 'cT9XQ6a6FzE',
      },
      {
        type: 'file',
        title: 'Workbook: Mapa de Identificación Emocional (PDF)',
        format: 'PDF',
        url: '#',
      },
      {
        type: 'video',
        title: 'Módulo 2: Gestión de Berrinches y Desbordes',
        duration: '65 min',
        videoId: 'M7lc1UVf-VE',
      },
      {
        type: 'file',
        title: 'Guía Práctica: Estableciendo Límites Sanos (PDF)',
        format: 'PDF',
        url: '#',
      },
      {
        type: 'video',
        title: 'Módulo 3: Conexión antes que Corrección',
        duration: '45 min',
        videoId: 'dQw4w9WgXcQ',
      },
    ],
  },
]

export const currentCourse = courses[0]
