export const mockTeacherCourses = [
  {
    id: 1,
    name: 'Matemática I',
    code: 'MAT-101',
    section: '5° Año - Sección A',
    studentsCount: 28,
    averageGrade: 15.8,
    trimesters: {
      1: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Funciones Reales de Variable Real',
              material: { title: 'Lectura: Introducción a Funciones.pdf', size: '1.2 MB' },
              task: { title: 'Práctica Dirigida: Gráficas de funciones', dueDate: 'Completado' }
            },
            {
              dayNum: 2,
              topic: 'Operaciones con Funciones',
              material: { title: 'Diapositiva: Composición de Funciones.pdf', size: '2.4 MB' },
              task: { title: 'Tarea Domiciliaria 1: Álgebra de funciones', dueDate: 'Completado' }
            }
          ]
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'Límites de Funciones',
              material: { title: 'Teoremas Fundamentales de Límites.pdf', size: '1.8 MB' },
              task: { title: 'Práctica Dirigida: Límites indeterminados', dueDate: '30 de Oct, 18:00' }
            },
            {
              dayNum: 2,
              topic: 'Límites al Infinito',
              material: { title: 'Clase 02: Continuidad de funciones.pdf', size: '4.1 MB' },
              task: { title: 'Cuestionario interactivo de continuidad', dueDate: '02 de Nov, 18:00' }
            }
          ]
        }
      ],
      2: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Introducción a la Derivada',
              material: { title: 'Lectura: Recta Tangente y Razón de Cambio.pdf', size: '1.5 MB' },
              task: { title: 'Práctica 1: Reglas de derivación', dueDate: '15 de Nov, 12:00' }
            },
            {
              dayNum: 2,
              topic: 'Regla de la Cadena',
              material: { title: 'Ejercicios Resueltos: Regla de la Cadena.pdf', size: '2.2 MB' },
              task: { title: 'Tarea 2: Derivación implícita', dueDate: '20 de Nov, 18:00' }
            }
          ]
        }
      ],
      3: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'La Integral Definida',
              material: { title: 'Guía: Teorema Fundamental del Cálculo.pdf', size: '1.1 MB' },
              task: { title: 'Práctica Dirigida: Integrales básicas', dueDate: '05 de Dic, 10:00' }
            },
            {
              dayNum: 2,
              topic: 'Métodos de Integración',
              material: { title: 'Lectura: Integración por sustitución.pdf', size: '2.5 MB' },
              task: { title: 'Portafolio Final: Aplicación de la Integral', dueDate: '12 de Dic, 23:59' }
            }
          ]
        }
      ]
    }
  },
  {
    id: 2,
    name: 'Álgebra Lineal',
    code: 'ALG-201',
    section: '5° Año - Sección A',
    studentsCount: 25,
    averageGrade: 14.2,
    trimesters: {
      1: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Matrices y Operaciones',
              material: { title: 'Álgebra de Matrices - Sílabo.pdf', size: '850 KB' },
              task: { title: 'Práctica Dirigida 1: Matrices simétricas', dueDate: 'Completado' }
            },
            {
              dayNum: 2,
              topic: 'Determinante de una Matrix',
              material: { title: 'Método de cofactores y determinantes.pdf', size: '1.9 MB' },
              task: { title: 'Guía de ejercicios: Propiedades de Determinantes', dueDate: '29 de Oct, 18:00' }
            }
          ]
        }
      ],
      2: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Espacios Vectoriales',
              material: { title: 'Definición y propiedades de Vectores.pdf', size: '1.3 MB' },
              task: { title: 'Práctica 3: Combinación lineal', dueDate: '12 de Nov, 12:00' }
            },
            {
              dayNum: 2,
              topic: 'Bases y Dimensión',
              material: { title: 'Lectura: Base Ortogonal y Gram-Schmidt.pdf', size: '2.1 MB' },
              task: { title: 'Tarea 3: Espacios generadores', dueDate: '19 de Nov, 18:00' }
            }
          ]
        }
      ],
      3: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Transformaciones Lineales',
              material: { title: 'Introducción a homomorfismos lineales.pdf', size: '1.1 MB' },
              task: { title: 'Práctica: Núcleo e Imagen', dueDate: '06 de Dic, 10:00' }
            },
            {
              dayNum: 2,
              topic: 'Valores y Vectores Propios',
              material: { title: 'Clase final: Autovalores y Diagonalización.pdf', size: '2.7 MB' },
              task: { title: 'Proyecto: Aplicación en gráficos 3D', dueDate: '14 de Dic, 23:59' }
            }
          ]
        }
      ]
    }
  },
  {
    id: 3,
    name: 'Matemática II',
    code: 'MAT-201',
    section: '4° Año - Sección B',
    studentsCount: 30,
    averageGrade: 16.1,
    trimesters: {
      1: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Ecuaciones Cuadráticas',
              material: { title: 'Fórmulas y Propiedades de Ecuaciones.pdf', size: '920 KB' },
              task: { title: 'Práctica Calificada: Raíces complejas', dueDate: 'Completado' }
            },
            {
              dayNum: 2,
              topic: 'Método de Factorización',
              material: { title: 'Diapositiva: Métodos de factorización.pdf', size: '1.5 MB' },
              task: { title: 'Tarea 1: Factorización de trinomios', dueDate: 'Completado' }
            }
          ]
        }
      ],
      2: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Trigonometría Básica',
              material: { title: 'Razones Trigonométricas en el Círculo.pdf', size: '1.1 MB' },
              task: { title: 'Práctica: Triángulos Rectángulos', dueDate: '10 de Jul, 12:00' }
            },
            {
              dayNum: 2,
              topic: 'Identidades Trigonométricas',
              material: { title: 'Guía: Identidades de Suma y Diferencia.pdf', size: '1.9 MB' },
              task: { title: 'Demostración de Identidades', dueDate: '17 de Jul, 18:00' }
            }
          ]
        }
      ],
      3: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Geometría Analítica',
              material: { title: 'Ecuación de la Recta y Pendiente.pdf', size: '1.4 MB' },
              task: { title: 'Práctica: Rectas paralelas y perpendiculares', dueDate: '02 de Dic, 10:00' }
            },
            {
              dayNum: 2,
              topic: 'La Circunferencia',
              material: { title: 'Guía de la Circunferencia con Centro H,K.pdf', size: '2.1 MB' },
              task: { title: 'Proyecto: Modelado de Trayectorias circulares', dueDate: '10 de Dic, 23:59' }
            }
          ]
        }
      ]
    }
  }
];

export const trimestersInfo = [
  {
    id: 1,
    title: 'Primer Trimestre',
    period: 'Marzo - Mayo',
  },
  {
    id: 2,
    title: 'Segundo Trimestre',
    period: 'Junio - Setiembre',
  },
  {
    id: 3,
    title: 'Tercer Trimestre',
    period: 'Setiembre - Diciembre',
  }
];
