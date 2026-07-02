export const mockCourses = [
  {
    id: 1,
    name: 'Matemática I',
    code: 'MAT-101',
    teacher: {
      name: 'Lic. Martha Wayne',
      email: 'm.wayne@sauleazul.edu.pe',
      avatar: 'MW',
      avatarBg: 'bg-[#031553]',
    },
    progress: 75,
    trimesters: {
      1: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Funciones Reales de Variable Real',
              material: { title: 'Lectura: Introducción a Funciones.pdf', size: '1.2 MB' },
              task: { title: 'Práctica Dirigida: Gráficas de funciones', status: 'entregado', dueDate: 'Completado' },
            },
            {
              dayNum: 2,
              topic: 'Operaciones con Funciones',
              material: { title: 'Diapositiva: Composición de Funciones.pdf', size: '2.4 MB' },
              task: { title: 'Tarea Domiciliaria 1: Álgebra de funciones', status: 'entregado', dueDate: 'Completado' },
            },
          ],
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'Límites de Funciones',
              material: { title: 'Teoremas Fundamentales de Límites.pdf', size: '1.8 MB' },
              task: { title: 'Práctica Dirigida: Límites indeterminados', status: 'entregado', dueDate: 'Completado' },
            },
            {
              dayNum: 2,
              topic: 'Límites al Infinito',
              material: { title: 'Clase 02: Continuidad de funciones.pdf', size: '4.1 MB' },
              task: { title: 'Cuestionario interactivo de continuidad', status: 'entregado', dueDate: 'Completado' },
            },
          ],
        },
        {
          week: 3,
          days: [
            {
              dayNum: 1,
              topic: 'Asínclotas Horizontales y Verticales',
              material: { title: 'Guía: Análisis Asíntotico.pdf', size: '1.5 MB' },
              task: { title: 'Taller 1: Comportamiento en el infinito', status: 'entregado', dueDate: 'Completado' },
            },
            {
              dayNum: 2,
              topic: 'Introducción al Cálculo Diferencial',
              material: { title: 'Lectura: Paradoja de Zenón y el Cambio.pdf', size: '920 KB' },
              task: { title: 'Control de Lectura 1', status: 'entregado', dueDate: 'Completado' },
            },
          ],
        },
      ],
      2: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Introducción a la Derivada',
              material: { title: 'Lectura: Recta Tangente y Razón de Cambio.pdf', size: '1.5 MB' },
              task: { title: 'Práctica 1: Reglas de derivación', status: 'entregado', dueDate: 'Completado' },
            },
            {
              dayNum: 2,
              topic: 'Regla de la Cadena',
              material: { title: 'Ejercicios Resueltos: Regla de la Cadena.pdf', size: '2.2 MB' },
              task: { title: 'Tarea 2: Derivación implícita', status: 'entregado', dueDate: 'Completado' },
            },
          ],
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'Derivadas de Funciones Trascendentes',
              material: { title: 'Formulario: Funciones trigonométricas y exponenciales.pdf', size: '1.1 MB' },
              task: {
                title: 'Práctica Calificada: Derivadas complejas',
                status: 'pendiente',
                dueDate: '30 de Oct, 18:00',
              },
            },
            {
              dayNum: 2,
              topic: 'Teorema del Valor Medio y Rolle',
              material: { title: 'Clase: Teoremas Fundamentales del Diferencial.pdf', size: '3.0 MB' },
              task: { title: 'Cuestionario virtual 2', status: 'pendiente', dueDate: '02 de Nov, 18:00' },
            },
          ],
        },
        {
          week: 3,
          days: [
            {
              dayNum: 1,
              topic: 'Criterios de la Primera y Segunda Derivada',
              material: { title: 'Guía: Optimización de funciones.pdf', size: '2.6 MB' },
              task: {
                title: 'Problemario: Máximos y Mínimos locales',
                status: 'pendiente',
                dueDate: '15 de Nov, 12:00',
              },
            },
            {
              dayNum: 2,
              topic: 'Problemas de Tasas de Cambio Relacionadas',
              material: { title: 'Lectura: Aplicaciones del mundo real.pdf', size: '1.9 MB' },
              task: { title: 'Laboratorio de Modelado Matemático', status: 'pendiente', dueDate: '20 de Nov, 18:00' },
            },
          ],
        },
      ],
      3: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'La Integral Definida',
              material: { title: 'Guía: Teorema Fundamental del Cálculo.pdf', size: '1.1 MB' },
              task: {
                title: 'Práctica Dirigida: Integrales básicas',
                status: 'pendiente',
                dueDate: '05 de Dic, 10:00',
              },
            },
            {
              dayNum: 2,
              topic: 'Métodos de Integración: Sustitución',
              material: { title: 'Lectura: Integración por sustitución.pdf', size: '2.5 MB' },
              task: { title: 'Taller en clase: Cambio de variable', status: 'pendiente', dueDate: '08 de Dic, 14:00' },
            },
          ],
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'Integración por Partes',
              material: { title: 'Método ALPES para Integración por Partes.pdf', size: '1.4 MB' },
              task: {
                title: 'Hoja de trabajo 5: Ejercicios avanzados',
                status: 'pendiente',
                dueDate: '10 de Dic, 12:00',
              },
            },
            {
              dayNum: 2,
              topic: 'Áreas entre Curvas',
              material: { title: 'Visualización Geométrica de la Integral.pdf', size: '3.2 MB' },
              task: {
                title: 'Portafolio Final: Aplicación de la Integral',
                status: 'pendiente',
                dueDate: '12 de Dic, 23:59',
              },
            },
          ],
        },
      ],
    },
  },
  {
    id: 2,
    name: 'Álgebra Lineal',
    code: 'ALG-201',
    teacher: {
      name: 'Dr. James Brown',
      email: 'j.brown@sauleazul.edu.pe',
      avatar: 'JB',
      avatarBg: 'bg-indigo-600',
    },
    progress: 60,
    trimesters: {
      1: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Matrices y Operaciones',
              material: { title: 'Álgebra de Matrices - Sílabo.pdf', size: '850 KB' },
              task: { title: 'Práctica Dirigida 1: Matrices simétricas', status: 'entregado', dueDate: 'Completado' },
            },
            {
              dayNum: 2,
              topic: 'Determinante de una Matriz',
              material: { title: 'Método de cofactores y determinantes.pdf', size: '1.9 MB' },
              task: {
                title: 'Guía de ejercicios: Propiedades de Determinantes',
                status: 'entregado',
                dueDate: 'Completado',
              },
            },
          ],
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'Sistemas de Ecuaciones Lineales',
              material: { title: 'Clase: Eliminación de Gauss-Jordan.pdf', size: '1.7 MB' },
              task: { title: 'Laboratorio Matlab 1: Sistemas M×N', status: 'entregado', dueDate: 'Completado' },
            },
            {
              dayNum: 2,
              topic: 'Matriz Inversa y Regla de Cramer',
              material: { title: 'Lectura: Inversión por Adjunta y Operaciones Elementales.pdf', size: '2.1 MB' },
              task: {
                title: 'Práctica Dirigida 2: Modelos económicos lineales',
                status: 'entregado',
                dueDate: 'Completado',
              },
            },
          ],
        },
      ],
      2: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Espacios Vectoriales',
              material: { title: 'Definición y propiedades de Vectores.pdf', size: '1.3 MB' },
              task: { title: 'Práctica 3: Combinación lineal', status: 'entregado', dueDate: 'Completado' },
            },
            {
              dayNum: 2,
              topic: 'Bases y Dimensión',
              material: { title: 'Lectura: Base Ortogonal y Gram-Schmidt.pdf', size: '2.1 MB' },
              task: { title: 'Tarea 3: Espacios generadores', status: 'pendiente', dueDate: '29 de Oct, 18:00' },
            },
          ],
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'Espacios Euclidianos e Internos',
              material: { title: 'Producto Interno y Norma Vectorial.pdf', size: '1.6 MB' },
              task: { title: 'Hoja de Ejercicios: Ortogonalidad', status: 'pendiente', dueDate: '12 de Nov, 12:00' },
            },
            {
              dayNum: 2,
              topic: 'Subespacios Fundamentales de una Matriz',
              material: { title: 'Kernel, Imagen y Rango.pdf', size: '2.5 MB' },
              task: {
                title: 'Cuestionario Virtual: Teorema del Rango-Nulidad',
                status: 'pendiente',
                dueDate: '19 de Nov, 18:00',
              },
            },
          ],
        },
      ],
      3: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Transformaciones Lineales',
              material: { title: 'Introducción a homomorfismos lineales.pdf', size: '1.1 MB' },
              task: { title: 'Práctica: Núcleo e Imagen', status: 'pendiente', dueDate: '01 de Dic, 15:00' },
            },
            {
              dayNum: 2,
              topic: 'Representación Matricial de Transformaciones',
              material: { title: 'Matrices de cambio de base.pdf', size: '1.8 MB' },
              task: {
                title: 'Taller: Rotaciones y Traslaciones en R3',
                status: 'pendiente',
                dueDate: '06 de Dic, 10:00',
              },
            },
          ],
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'Valores y Vectores Propios',
              material: { title: 'Polinomio Característico y Autovalores.pdf', size: '2.2 MB' },
              task: { title: 'Práctica Dirigida 4: Diagonalización', status: 'pendiente', dueDate: '09 de Dic, 18:00' },
            },
            {
              dayNum: 2,
              topic: 'Aplicaciones de Álgebra Lineal',
              material: { title: 'Clase final: Autovalores y Diagonalización.pdf', size: '2.7 MB' },
              task: { title: 'Proyecto: Aplicación en gráficos 3D', status: 'pendiente', dueDate: '14 de Dic, 23:59' },
            },
          ],
        },
      ],
    },
  },
  {
    id: 3,
    name: 'Física General',
    code: 'FIS-402',
    teacher: {
      name: 'Msc. Albert Finch',
      email: 'a.finch@sauleazul.edu.pe',
      avatar: 'AF',
      avatarBg: 'bg-emerald-600',
    },
    progress: 85,
    trimesters: {
      1: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Análisis Dimensional y Vectores',
              material: { title: 'Manual de Vectores de Fuerza.pdf', size: '1.1 MB' },
              task: { title: 'Práctica 1: Vectores en 2D y 3D', status: 'entregado', dueDate: 'Completado' },
            },
            {
              dayNum: 2,
              topic: 'Cinemática de una Partícula',
              material: { title: 'Laboratorio: Movimiento parabólico de caída libre.pdf', size: '3.5 MB' },
              task: { title: 'Informe de Laboratorio 1', status: 'entregado', dueDate: 'Completado' },
            },
          ],
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'Movimiento Circular Uniforme (MCU)',
              material: { title: 'Aceleración centrípeta y velocidad angular.pdf', size: '1.9 MB' },
              task: { title: 'Ejercicios de Cinemática Rotacional', status: 'entregado', dueDate: 'Completado' },
            },
            {
              dayNum: 2,
              topic: 'Movimiento Relativo',
              material: { title: 'Lectura: Marcos de referencia inerciales.pdf', size: '1.3 MB' },
              task: { title: 'Test de conceptos vectoriales', status: 'entregado', dueDate: 'Completado' },
            },
          ],
        },
      ],
      2: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Leyes del Movimiento de Newton',
              material: { title: 'Dinámica: Diagrama de Cuerpo Libre.pdf', size: '1.6 MB' },
              task: { title: 'Práctica: Leyes de Newton con fricción', status: 'entregado', dueDate: 'Completado' },
            },
            {
              dayNum: 2,
              topic: 'Trabajo y Energía Mecánica',
              material: { title: 'Teorema del Trabajo y la Energía.pdf', size: '2.2 MB' },
              task: { title: 'Ejercicios de Fuerzas Conservativas', status: 'pendiente', dueDate: '28 de Oct, 18:00' },
            },
          ],
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'Conservación del Momento Lineal',
              material: { title: 'Guía: Choques elásticos e inelásticos.pdf', size: '2.0 MB' },
              task: { title: 'Informe de Laboratorio 2: Colisiones', status: 'pendiente', dueDate: '08 de Nov, 12:00' },
            },
            {
              dayNum: 2,
              topic: 'Estática y Equilibrio de Cuerpos Rígidos',
              material: { title: 'Clase: Torque y Momento de una Fuerza.pdf', size: '2.4 MB' },
              task: {
                title: 'Ficha práctica: Puentes y vigas en equilibrio',
                status: 'pendiente',
                dueDate: '15 de Nov, 18:00',
              },
            },
          ],
        },
      ],
      3: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Hidrostática y Principio de Arquímedes',
              material: { title: 'Manual: Densidad, Presión y Empuje.pdf', size: '1.8 MB' },
              task: {
                title: 'Práctica Dirigida: Ecuación de Bernoulli',
                status: 'pendiente',
                dueDate: '01 de Dic, 12:00',
              },
            },
            {
              dayNum: 2,
              topic: 'Termodinámica Básica',
              material: { title: 'Guía: Calor, Temperatura y Dilatación.pdf', size: '1.2 MB' },
              task: { title: 'Práctica: Leyes de la Termodinámica', status: 'pendiente', dueDate: '04 de Dic, 10:00' },
            },
          ],
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'Movimiento Armónico Simple (MAS)',
              material: { title: 'Sistemas Masa-Resorte y Péndulos.pdf', size: '1.5 MB' },
              task: {
                title: 'Simulación virtual: Oscilaciones amortiguadas',
                status: 'pendiente',
                dueDate: '07 de Dic, 18:00',
              },
            },
            {
              dayNum: 2,
              topic: 'Ondas y Sonido',
              material: { title: 'Clase: Propagación y Efecto Doppler.pdf', size: '2.4 MB' },
              task: { title: 'Evaluación final de Ondas', status: 'pendiente', dueDate: '11 de Dic, 23:59' },
            },
          ],
        },
      ],
    },
  },
  {
    id: 4,
    name: 'Computación e Informática',
    code: 'COM-302',
    teacher: {
      name: 'Ing. Sarah Connor',
      email: 's.connor@sauleazul.edu.pe',
      avatar: 'SC',
      avatarBg: 'bg-slate-700',
    },
    progress: 90,
    trimesters: {
      1: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Introducción a la Programación',
              material: { title: 'Sílabo Computación e Algoritmos.pdf', size: '1.4 MB' },
              task: { title: 'Configuración del Entorno de Python', status: 'entregado', dueDate: 'Completado' },
            },
            {
              dayNum: 2,
              topic: 'Estructuras de Control Lógicas',
              material: { title: 'Diapositiva: Bucles y Condicionales en Python.pdf', size: '2.9 MB' },
              task: { title: 'Práctica: Algoritmos iterativos básicos', status: 'entregado', dueDate: 'Completado' },
            },
          ],
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'Estructuras de Datos Nativas',
              material: { title: 'Guía: Listas, Tuplas y Diccionarios.pdf', size: '2.1 MB' },
              task: {
                title: 'Proyecto Corto: Agenda de contactos por consola',
                status: 'entregado',
                dueDate: 'Completado',
              },
            },
            {
              dayNum: 2,
              topic: 'Funciones y Modularidad',
              material: { title: 'Lectura: Paso por valor vs referencia, Scopes.pdf', size: '1.6 MB' },
              task: {
                title: 'Código Limpio: Refactorización de algoritmos',
                status: 'entregado',
                dueDate: 'Completado',
              },
            },
          ],
        },
      ],
      2: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Programación Orientada a Objetos',
              material: { title: 'Lectura: Clases, Objetos y Atributos.pdf', size: '1.7 MB' },
              task: { title: 'Práctica: Herencia y Polimorfismo', status: 'entregado', dueDate: 'Completado' },
            },
            {
              dayNum: 2,
              topic: 'Manejo de Excepciones',
              material: { title: 'Estructuras Try-Except en Python.pdf', size: '2.1 MB' },
              task: {
                title: 'Tarea: Depuración de errores en consola',
                status: 'pendiente',
                dueDate: '27 de Oct, 18:00',
              },
            },
          ],
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'Manipulación de Archivos I/O',
              material: { title: 'Guía: Lectura y escritura de TXT y CSV.pdf', size: '1.2 MB' },
              task: {
                title: 'Evaluación Práctica: Serializador JSON',
                status: 'pendiente',
                dueDate: '10 de Nov, 12:00',
              },
            },
            {
              dayNum: 2,
              topic: 'Estructuras Avanzadas de Datos',
              material: { title: 'Concepto de Pilas, Colas y Árboles básicos.pdf', size: '3.4 MB' },
              task: {
                title: 'Taller Grupal: Simulación de cola de impresión',
                status: 'pendiente',
                dueDate: '17 de Nov, 18:00',
              },
            },
          ],
        },
      ],
      3: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Bases de Datos Relacionales',
              material: { title: 'Guía: Sentencias SQL Básicas (DML).pdf', size: '1.3 MB' },
              task: { title: 'Práctica: Consultas SELECT complejas', status: 'pendiente', dueDate: '02 de Dic, 10:00' },
            },
            {
              dayNum: 2,
              topic: 'Diseño Entidad-Relación',
              material: { title: 'Manual: Normalización de BD (1NF, 2NF, 3NF).pdf', size: '2.0 MB' },
              task: {
                title: 'Caso de Estudio: Modelado de ERP Educativo',
                status: 'pendiente',
                dueDate: '05 de Dic, 23:59',
              },
            },
          ],
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'Conexión Python - SQL',
              material: { title: 'Clase: Librería SQLite en Python.pdf', size: '2.8 MB' },
              task: {
                title: 'Avance de Proyecto: CRUD con Base de Datos',
                status: 'pendiente',
                dueDate: '08 de Dic, 18:00',
              },
            },
            {
              dayNum: 2,
              topic: 'Despliegue e Interfaces de Usuario Básicas',
              material: { title: 'Diapositivas: Tkinter y CLI avanzadas.pdf', size: '1.9 MB' },
              task: {
                title: 'Proyecto Integrador final de Sistemas',
                status: 'pendiente',
                dueDate: '10 de Dic, 23:59',
              },
            },
          ],
        },
      ],
    },
  },
  {
    id: 5,
    name: 'Química Orgánica',
    code: 'QUI-301',
    teacher: {
      name: 'Dr. Bruce Banner',
      email: 'b.banner@sauleazul.edu.pe',
      avatar: 'BB',
      avatarBg: 'bg-teal-600',
    },
    progress: 50,
    trimesters: {
      1: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'El Carbono y sus Hibridaciones',
              material: { title: 'Sílabo Química Orgánica - 2026.pdf', size: '1.3 MB' },
              task: { title: 'Práctica: Hibridaciones sp, sp2, sp3', status: 'entregado', dueDate: 'Completado' },
            },
            {
              dayNum: 2,
              topic: 'Hidrocarburos Alifáticos',
              material: { title: 'Clase: Nomenclatura de Alcanos.pdf', size: '3.1 MB' },
              task: { title: 'Guía de nomenclatura de cadenas', status: 'entregado', dueDate: 'Completado' },
            },
          ],
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'Alquenos y Alquinos: Enlaces Múltiples',
              material: { title: 'Reacciones de Adición Electrofílica.pdf', size: '2.2 MB' },
              task: {
                title: 'Laboratorio Virtual 1: Modelado de Isómeros Cis/Trans',
                status: 'entregado',
                dueDate: 'Completado',
              },
            },
            {
              dayNum: 2,
              topic: 'Compuestos Aromáticos y Benceno',
              material: { title: 'Estructuras de Resonancia y Regla de Hückel.pdf', size: '1.7 MB' },
              task: { title: 'Práctica Dirigida: Derivados del Benceno', status: 'entregado', dueDate: 'Completado' },
            },
          ],
        },
      ],
      2: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Grupos Funcionales Oxigenados',
              material: { title: 'Lectura: Alcoholes, Éteres y Fenoles.pdf', size: '1.8 MB' },
              task: { title: 'Práctica: Reacciones de oxidación', status: 'pendiente', dueDate: '26 de Oct, 12:00' },
            },
            {
              dayNum: 2,
              topic: 'Aldehídos y Cetonas',
              material: { title: 'Reactores y Síntesis Orgánica.pdf', size: '2.5 MB' },
              task: {
                title: 'Tarea: Mecanismos de adición nucleofílica',
                status: 'pendiente',
                dueDate: '29 de Oct, 18:00',
              },
            },
          ],
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'Compuestos Nitrogenados',
              material: { title: 'Estructura de Aminas y Amidas.pdf', size: '1.4 MB' },
              task: {
                title: 'Problemario: Alcaloides en la naturaleza',
                status: 'pendiente',
                dueDate: '05 de Nov, 12:00',
              },
            },
            {
              dayNum: 2,
              topic: 'Estereoquímica y Enantiómeros',
              material: { title: 'Manual: Quiralidad y Luz Polarizada.pdf', size: '2.9 MB' },
              task: {
                title: 'Cuestionario de proyecciones de Fischer',
                status: 'pendiente',
                dueDate: '12 de Nov, 18:00',
              },
            },
          ],
        },
      ],
      3: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Ácidos Carboxílicos',
              material: { title: 'Guía: Esterificación e Hidrólisis.pdf', size: '1.2 MB' },
              task: { title: 'Práctica: Jabones y Saponificación', status: 'pendiente', dueDate: '03 de Dic, 10:00' },
            },
            {
              dayNum: 2,
              topic: 'Lípidos y Carbohidratos',
              material: { title: 'Estructuras de Monosacáridos y Triglicéridos.pdf', size: '2.1 MB' },
              task: { title: 'Taller: Biomoléculas Orgánicas', status: 'pendiente', dueDate: '06 de Dic, 18:00' },
            },
          ],
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'Aminoácidos y Enlaces Peptídicos',
              material: { title: 'Notas de clase: Síntesis de proteínas.pdf', size: '1.6 MB' },
              task: { title: 'Mapa Conceptual: Estructura proteica', status: 'pendiente', dueDate: '08 de Dic, 12:00' },
            },
            {
              dayNum: 2,
              topic: 'Polímeros y Macromoléculas',
              material: { title: 'Clase final: Estructura del ADN y Proteínas.pdf', size: '2.9 MB' },
              task: { title: 'Evaluación final Química Orgánica', status: 'pendiente', dueDate: '09 de Dic, 23:59' },
            },
          ],
        },
      ],
    },
  },
  {
    id: 6,
    name: 'Literatura y Redacción',
    code: 'LIT-102',
    teacher: {
      name: 'Msc. Emma Watson',
      email: 'e.watson@sauleazul.edu.pe',
      avatar: 'EW',
      avatarBg: 'bg-rose-600',
    },
    progress: 95,
    trimesters: {
      1: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'El Proceso de Redacción',
              material: { title: 'Manual de Redacción y APA 7.pdf', size: '850 KB' },
              task: { title: 'Ejercicios de Coherencia y Cohesión', status: 'entregado', dueDate: 'Completado' },
            },
            {
              dayNum: 2,
              topic: 'El Ensayo Argumentativo',
              material: { title: 'Guía práctica de Tesis y Argumentos.pdf', size: '1.9 MB' },
              task: { title: 'Entrega de Primer Borrador del Ensayo', status: 'entregado', dueDate: 'Completado' },
            },
          ],
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'Técnicas de Comprensión Lectora',
              material: { title: 'Estrategias de lectura crítica.pdf', size: '1.1 MB' },
              task: {
                title: 'Ficha de Análisis: Textos periodísticos modernos',
                status: 'entregado',
                dueDate: 'Completado',
              },
            },
            {
              dayNum: 2,
              topic: 'Vicios del Lenguaje',
              material: { title: 'Presentación: Pleonasmos, Solecismos y Cacofonías.pdf', size: '1.5 MB' },
              task: {
                title: 'Taller: Corrección de estilo en textos cortos',
                status: 'entregado',
                dueDate: 'Completado',
              },
            },
          ],
        },
      ],
      2: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'Literatura del Siglo de Oro Español',
              material: { title: 'Antología del Siglo de Oro.pdf', size: '1.4 MB' },
              task: { title: 'Ensayo crítico: El Quijote de la Mancha', status: 'entregado', dueDate: 'Completado' },
            },
            {
              dayNum: 2,
              topic: 'El Teatro Barroco',
              material: { title: 'Análisis literario: La Vida es Sueño.pdf', size: '2.2 MB' },
              task: { title: 'Práctica de análisis de versos teatrales', status: 'entregado', dueDate: 'Completado' },
            },
          ],
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'Romanticismo y Realismo en Hispanoamérica',
              material: { title: 'Lecturas obligatorias: Tradiciones Peruanas.pdf', size: '2.5 MB' },
              task: { title: 'Control de lectura 3', status: 'entregado', dueDate: 'Completado' },
            },
            {
              dayNum: 2,
              topic: 'El Modernismo y Rubén Darío',
              material: { title: 'Estudio de Azul... y Prosas Profanas.pdf', size: '1.8 MB' },
              task: { title: 'Análisis métrico de poemas modernistas', status: 'entregado', dueDate: 'Completado' },
            },
          ],
        },
      ],
      3: [
        {
          week: 1,
          days: [
            {
              dayNum: 1,
              topic: 'El Vanguardismo Latinoamericano',
              material: { title: 'Lecturas seleccionadas: Vallejo y Neruda.pdf', size: '1.1 MB' },
              task: { title: 'Análisis de poemas vanguardistas', status: 'pendiente', dueDate: '02 de Dic, 10:00' },
            },
            {
              dayNum: 2,
              topic: 'El Indigenismo en el Perú',
              material: { title: 'Lectura: El mundo es ancho y ajeno.pdf', size: '3.0 MB' },
              task: {
                title: 'Reseña Crítica: Ciro Alegría y Arguedas',
                status: 'pendiente',
                dueDate: '05 de Dic, 18:00',
              },
            },
          ],
        },
        {
          week: 2,
          days: [
            {
              dayNum: 1,
              topic: 'El Boom Latinoamericano',
              material: { title: 'Clase: Cien Años de Soledad.pdf', size: '2.8 MB' },
              task: { title: 'Avance de Investigación Monográfica', status: 'pendiente', dueDate: '08 de Dic, 12:00' },
            },
            {
              dayNum: 2,
              topic: 'Estrategias de Exposición Oral',
              material: { title: 'Manual: Preparación para Sustentaciones Académicas.pdf', size: '1.2 MB' },
              task: { title: 'Monografía Final de Literatura', status: 'pendiente', dueDate: '10 de Dic, 23:59' },
            },
          ],
        },
      ],
    },
  },
];
