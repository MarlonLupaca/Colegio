export const mockGrades = {
  1: [
    {
      courseId: 1,
      name: 'Matemática I',
      code: 'MAT-101',
      teacher: 'Lic. Martha Wayne',
      average: 16,
      components: [
        {
          type: 'Exámenes (40%)',
          grades: [
            { name: 'Examen Parcial 1', mark: 15, date: '12 de Abr' },
            { name: 'Examen Bimestral 1', mark: 17, date: '22 de May' }
          ]
        },
        {
          type: 'Prácticas y Tareas (30%)',
          grades: [
            { name: 'Práctica Dirigida 1', mark: 18, date: '05 de Abr' },
            { name: 'Tarea Domiciliaria 1', mark: 16, date: '18 de Abr' },
            { name: 'Práctica Calificada 2', mark: 15, date: '10 de May' }
          ]
        },
        {
          type: 'Proyecto Final (20%)',
          grades: [
            { name: 'Proyecto: Aplicación de Funciones', mark: 16, date: '15 de May' }
          ]
        },
        {
          type: 'Nota Actitudinal (10%)',
          grades: [
            { name: 'Puntualidad y Participación', mark: 18, date: '25 de May' }
          ]
        }
      ]
    },
    {
      courseId: 2,
      name: 'Álgebra Lineal',
      code: 'ALG-201',
      teacher: 'Dr. James Brown',
      average: 14,
      components: [
        {
          type: 'Exámenes (40%)',
          grades: [
            { name: 'Examen Parcial 1', mark: 12, date: '14 de Abr' },
            { name: 'Examen Bimestral 1', mark: 15, date: '24 de May' }
          ]
        },
        {
          type: 'Prácticas y Tareas (30%)',
          grades: [
            { name: 'Práctica Dirigida 1', mark: 14, date: '08 de Abr' },
            { name: 'Tarea 1: Matrices', mark: 16, date: '22 de Abr' }
          ]
        },
        {
          type: 'Proyecto Final (20%)',
          grades: [
            { name: 'Resolución de Sistemas de Ecuaciones', mark: 13, date: '17 de May' }
          ]
        },
        {
          type: 'Nota Actitudinal (10%)',
          grades: [
            { name: 'Participación en Pizarra', mark: 16, date: '25 de May' }
          ]
        }
      ]
    },
    {
      courseId: 3,
      name: 'Física General',
      code: 'FIS-402',
      teacher: 'Msc. Albert Finch',
      average: 17,
      components: [
        {
          type: 'Exámenes (40%)',
          grades: [
            { name: 'Examen Parcial 1', mark: 16, date: '11 de Abr' },
            { name: 'Examen Bimestral 1', mark: 18, date: '20 de May' }
          ]
        },
        {
          type: 'Prácticas y Tareas (30%)',
          grades: [
            { name: 'Informe Laboratorio 1', mark: 19, date: '06 de Abr' },
            { name: 'Práctica Dirigida 1', mark: 15, date: '17 de Abr' }
          ]
        },
        {
          type: 'Proyecto Final (20%)',
          grades: [
            { name: 'Proyecto: Caída Libre Experimental', mark: 17, date: '12 de May' }
          ]
        },
        {
          type: 'Nota Actitudinal (10%)',
          grades: [
            { name: 'Responsabilidad y Puntualidad', mark: 18, date: '24 de May' }
          ]
        }
      ]
    },
    {
      courseId: 4,
      name: 'Computación e Informática',
      code: 'COM-302',
      teacher: 'Ing. Sarah Connor',
      average: 18,
      components: [
        {
          type: 'Exámenes (40%)',
          grades: [
            { name: 'Examen Bimestral 1', mark: 19, date: '21 de May' }
          ]
        },
        {
          type: 'Prácticas y Tareas (30%)',
          grades: [
            { name: 'Reto 1: Variables y Bucles', mark: 18, date: '10 de Abr' },
            { name: 'Reto 2: Programación Modular', mark: 17, date: '30 de Abr' }
          ]
        },
        {
          type: 'Proyecto Final (20%)',
          grades: [
            { name: 'Desarrollo de Algoritmo de Gestión', mark: 18, date: '14 de May' }
          ]
        },
        {
          type: 'Nota Actitudinal (10%)',
          grades: [
            { name: 'Trabajo en Equipo', mark: 19, date: '22 de May' }
          ]
        }
      ]
    },
    {
      courseId: 5,
      name: 'Química Orgánica',
      code: 'QUI-301',
      teacher: 'Dr. Bruce Banner',
      average: 10,
      components: [
        {
          type: 'Exámenes (40%)',
          grades: [
            { name: 'Examen Parcial 1', mark: 8, date: '15 de Abr' },
            { name: 'Examen Bimestral 1', mark: 11, date: '23 de May' }
          ]
        },
        {
          type: 'Prácticas y Tareas (30%)',
          grades: [
            { name: 'Práctica Laboratorio 1', mark: 12, date: '07 de Abr' },
            { name: 'Tarea: Estructuras Orgánicas', mark: 9, date: '21 de Abr' }
          ]
        },
        {
          type: 'Proyecto Final (20%)',
          grades: [
            { name: 'Maqueta de Enlaces de Carbono', mark: 10, date: '16 de May' }
          ]
        },
        {
          type: 'Nota Actitudinal (10%)',
          grades: [
            { name: 'Participación en Clase', mark: 12, date: '25 de May' }
          ]
        }
      ]
    },
    {
      courseId: 6,
      name: 'Literatura y Redacción',
      code: 'LIT-102',
      teacher: 'Msc. Emma Watson',
      average: 15,
      components: [
        {
          type: 'Exámenes (40%)',
          grades: [
            { name: 'Evaluación de Comprensión Lectora', mark: 14, date: '13 de Abr' },
            { name: 'Examen Bimestral 1', mark: 16, date: '20 de May' }
          ]
        },
        {
          type: 'Prácticas y Tareas (30%)',
          grades: [
            { name: 'Redacción de Artículo Crítico', mark: 15, date: '09 de Abr' },
            { name: 'Análisis Literario 1', mark: 16, date: '23 de Abr' }
          ]
        },
        {
          type: 'Proyecto Final (20%)',
          grades: [
            { name: 'Borrador y Presentación de Ensayo', mark: 15, date: '13 de May' }
          ]
        },
        {
          type: 'Nota Actitudinal (10%)',
          grades: [
            { name: 'Participación en Debates', mark: 17, date: '22 de May' }
          ]
        }
      ]
    }
  ],
  2: [
    {
      courseId: 1,
      name: 'Matemática I',
      code: 'MAT-101',
      teacher: 'Lic. Martha Wayne',
      average: 15,
      components: [
        { type: 'Exámenes (40%)', grades: [{ name: 'Examen Parcial 2', mark: 14, date: '15 de Jul' }] },
        { type: 'Prácticas y Tareas (30%)', grades: [{ name: 'Práctica 3', mark: 16, date: '02 de Jul' }] },
        { type: 'Proyecto Final (20%)', grades: [{ name: 'Proyecto Integrales', mark: 15, date: '20 de Ago' }] },
        { type: 'Nota Actitudinal (10%)', grades: [{ name: 'Participación 2', mark: 17, date: '01 de Set' }] }
      ]
    },
    {
      courseId: 2,
      name: 'Álgebra Lineal',
      code: 'ALG-201',
      teacher: 'Dr. James Brown',
      average: 15,
      components: [
        { type: 'Exámenes (40%)', grades: [{ name: 'Examen Parcial 2', mark: 15, date: '18 de Jul' }] },
        { type: 'Prácticas y Tareas (30%)', grades: [{ name: 'Práctica 3', mark: 14, date: '05 de Jul' }] },
        { type: 'Proyecto Final (20%)', grades: [{ name: 'Proyecto Matrices', mark: 16, date: '15 de Ago' }] },
        { type: 'Nota Actitudinal (10%)', grades: [{ name: 'Actitud', mark: 16, date: '01 de Set' }] }
      ]
    },
    {
      courseId: 3,
      name: 'Física General',
      code: 'FIS-402',
      teacher: 'Msc. Albert Finch',
      average: 16,
      components: [
        { type: 'Exámenes (40%)', grades: [{ name: 'Examen Parcial 2', mark: 16, date: '12 de Jul' }] },
        { type: 'Prácticas y Tareas (30%)', grades: [{ name: 'Informe Lab 2', mark: 17, date: '09 de Jul' }] },
        { type: 'Proyecto Final (20%)', grades: [{ name: 'Proyecto Dinámica', mark: 15, date: '14 de Ago' }] },
        { type: 'Nota Actitudinal (10%)', grades: [{ name: 'Actitud', mark: 18, date: '31 de Ago' }] }
      ]
    },
    {
      courseId: 4,
      name: 'Computación e Informática',
      code: 'COM-302',
      teacher: 'Ing. Sarah Connor',
      average: 17,
      components: [
        { type: 'Exámenes (40%)', grades: [{ name: 'Examen Parcial 2', mark: 17, date: '19 de Jul' }] },
        { type: 'Prácticas y Tareas (30%)', grades: [{ name: 'Reto OOP', mark: 16, date: '06 de Jul' }] },
        { type: 'Proyecto Final (20%)', grades: [{ name: 'Aplicación Django', mark: 18, date: '18 de Ago' }] },
        { type: 'Nota Actitudinal (10%)', grades: [{ name: 'Actitud', mark: 18, date: '02 de Set' }] }
      ]
    },
    {
      courseId: 5,
      name: 'Química Orgánica',
      code: 'QUI-301',
      teacher: 'Dr. Bruce Banner',
      average: 12,
      components: [
        { type: 'Exámenes (40%)', grades: [{ name: 'Examen Parcial 2', mark: 11, date: '14 de Jul' }] },
        { type: 'Prácticas y Tareas (30%)', grades: [{ name: 'Laboratorio 2', mark: 13, date: '08 de Jul' }] },
        { type: 'Proyecto Final (20%)', grades: [{ name: 'Proyecto Nomenclatura', mark: 12, date: '16 de Ago' }] },
        { type: 'Nota Actitudinal (10%)', grades: [{ name: 'Actitud', mark: 14, date: '01 de Set' }] }
      ]
    },
    {
      courseId: 6,
      name: 'Literatura y Redacción',
      code: 'LIT-102',
      teacher: 'Msc. Emma Watson',
      average: 16,
      components: [
        { type: 'Exámenes (40%)', grades: [{ name: 'Examen Parcial 2', mark: 15, date: '13 de Jul' }] },
        { type: 'Prácticas y Tareas (30%)', grades: [{ name: 'Borrador 2', mark: 17, date: '10 de Jul' }] },
        { type: 'Proyecto Final (20%)', grades: [{ name: 'Ensayo Barroco', mark: 16, date: '12 de Ago' }] },
        { type: 'Nota Actitudinal (10%)', grades: [{ name: 'Actitud', mark: 18, date: '02 de Set' }] }
      ]
    }
  ],
  3: [
    {
      courseId: 1,
      name: 'Matemática I',
      code: 'MAT-101',
      teacher: 'Lic. Martha Wayne',
      average: 17,
      components: [
        { type: 'Exámenes (40%)', grades: [{ name: 'Examen Final Anual', mark: 17, date: '10 de Dic' }] },
        { type: 'Prácticas y Tareas (30%)', grades: [{ name: 'Práctica final', mark: 18, date: '15 de Nov' }] },
        { type: 'Proyecto Final (20%)', grades: [{ name: 'Portafolio de Límites', mark: 16, date: '01 de Dic' }] },
        { type: 'Nota Actitudinal (10%)', grades: [{ name: 'Actitud Final', mark: 18, date: '12 de Dic' }] }
      ]
    },
    {
      courseId: 2,
      name: 'Álgebra Lineal',
      code: 'ALG-201',
      teacher: 'Dr. James Brown',
      average: 16,
      components: [
        { type: 'Exámenes (40%)', grades: [{ name: 'Examen Final Anual', mark: 16, date: '11 de Dic' }] },
        { type: 'Prácticas y Tareas (30%)', grades: [{ name: 'Práctica final', mark: 17, date: '16 de Nov' }] },
        { type: 'Proyecto Final (20%)', grades: [{ name: 'Portafolio Matrices', mark: 15, date: '02 de Dic' }] },
        { type: 'Nota Actitudinal (10%)', grades: [{ name: 'Actitud Final', mark: 17, date: '12 de Dic' }] }
      ]
    },
    {
      courseId: 3,
      name: 'Física General',
      code: 'FIS-402',
      teacher: 'Msc. Albert Finch',
      average: 18,
      components: [
        { type: 'Exámenes (40%)', grades: [{ name: 'Examen Final Anual', mark: 18, date: '09 de Dic' }] },
        { type: 'Prácticas y Tareas (30%)', grades: [{ name: 'Laboratorio Final', mark: 19, date: '14 de Nov' }] },
        { type: 'Proyecto Final (20%)', grades: [{ name: 'Feria de Ciencias', mark: 17, date: '30 de Nov' }] },
        { type: 'Nota Actitudinal (10%)', grades: [{ name: 'Actitud Final', mark: 19, date: '11 de Dic' }] }
      ]
    },
    {
      courseId: 4,
      name: 'Computación e Informática',
      code: 'COM-302',
      teacher: 'Ing. Sarah Connor',
      average: 19,
      components: [
        { type: 'Exámenes (40%)', grades: [{ name: 'Examen Final Anual', mark: 19, date: '08 de Dic' }] },
        { type: 'Prácticas y Tareas (30%)', grades: [{ name: 'Proyecto SQLite', mark: 18, date: '12 de Nov' }] },
        { type: 'Proyecto Final (20%)', grades: [{ name: 'Web Escolar', mark: 20, date: '29 de Nov' }] },
        { type: 'Nota Actitudinal (10%)', grades: [{ name: 'Actitud Final', mark: 20, date: '10 de Dic' }] }
      ]
    },
    {
      courseId: 5,
      name: 'Química Orgánica',
      code: 'QUI-301',
      teacher: 'Dr. Bruce Banner',
      average: 13,
      components: [
        { type: 'Exámenes (40%)', grades: [{ name: 'Examen Final Anual', mark: 12, date: '10 de Dic' }] },
        { type: 'Prácticas y Tareas (30%)', grades: [{ name: 'Laboratorio Final', mark: 14, date: '15 de Nov' }] },
        { type: 'Proyecto Final (20%)', grades: [{ name: 'Proyecto Proteínas', mark: 13, date: '01 de Dic' }] },
        { type: 'Nota Actitudinal (10%)', grades: [{ name: 'Actitud Final', mark: 15, date: '12 de Dic' }] }
      ]
    },
    {
      courseId: 6,
      name: 'Literatura y Redacción',
      code: 'LIT-102',
      teacher: 'Msc. Emma Watson',
      average: 17,
      components: [
        { type: 'Exámenes (40%)', grades: [{ name: 'Examen Final Anual', mark: 17, date: '08 de Dic' }] },
        { type: 'Prácticas y Tareas (30%)', grades: [{ name: 'Monografía', mark: 18, date: '13 de Nov' }] },
        { type: 'Proyecto Final (20%)', grades: [{ name: 'Ensayo Final', mark: 17, date: '28 de Nov' }] },
        { type: 'Nota Actitudinal (10%)', grades: [{ name: 'Actitud Final', mark: 18, date: '11 de Dic' }] }
      ]
    }
  ]
};

export const trimestersInfo = [
  {
    id: 1,
    title: 'Primer Trimestre',
    period: 'Marzo - Mayo',
    desc: 'Comienza con el inicio de clases (usualmente a principios de marzo) y se extiende hasta mediados o finales de mayo.'
  },
  {
    id: 2,
    title: 'Segundo Trimestre',
    period: 'Junio - Setiembre',
    desc: 'Inicia tras unas breves vacaciones en mayo, abarcando los meses de junio, julio y agosto, para terminar normalmente a principios de setiembre.'
  },
  {
    id: 3,
    title: 'Tercer Trimestre',
    period: 'Setiembre - Diciembre',
    desc: 'Comienza a mediados de setiembre y abarca hasta mediados de diciembre, cerrando con la clausura del año escolar.'
  }
];
