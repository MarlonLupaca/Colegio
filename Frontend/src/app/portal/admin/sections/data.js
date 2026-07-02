// app/portal/admin/sections/data.js

export const initialSections = {
  "2026": {
    primaria: {
      "1° A": {
        id: "sec-1a-2026",
        year: 2026,
        level: "primaria",
        grade: 1,
        section: "A",
        classroom: "101 - Pabellón A",
        courses: [
          { id: "c1", name: "Matemáticas", teacher: "María Pérez" },
          { id: "c2", name: "Comunicación", teacher: "Juan Gómez" },
          { id: "c3", name: "Ciencia", teacher: "Ana López" }
        ]
      },
      "1° B": {
        id: "sec-1b-2026",
        year: 2026,
        level: "primaria",
        grade: 1,
        section: "B",
        classroom: "102 - Pabellón A",
        courses: [
          { id: "c1", name: "Matemáticas", teacher: "Carlos Ruiz" },
          { id: "c2", name: "Comunicación", teacher: "Laura Díaz" }
        ]
      },
      "2° A": {
        id: "sec-2a-2026",
        year: 2026,
        level: "primaria",
        grade: 2,
        section: "A",
        classroom: "201 - Pabellón B",
        courses: []
      },
      "2° B": {
        id: "sec-2b-2026",
        year: 2026,
        level: "primaria",
        grade: 2,
        section: "B",
        classroom: "202 - Pabellón B",
        courses: []
      },
      "3° A": {
        id: "sec-3a-2026",
        year: 2026,
        level: "primaria",
        grade: 3,
        section: "A",
        classroom: "301 - Pabellón C",
        courses: []
      },
      "3° B": {
        id: "sec-3b-2026",
        year: 2026,
        level: "primaria",
        grade: 3,
        section: "B",
        classroom: "302 - Pabellón C",
        courses: [
          { id: "c4", name: "Historia", teacher: "Roberto Torres" },
          { id: "c5", name: "Arte", teacher: "Elena Vargas" },
          { id: "c6", name: "Inglés", teacher: "Patricia Soto" }
        ]
      }
    },
    secundaria: {
      "1° A": {
        id: "sec-1a-sec-2026",
        year: 2026,
        level: "secundaria",
        grade: 1,
        section: "A",
        classroom: "101 - Pabellón Principal",
        courses: []
      },
      "1° B": {
        id: "sec-1b-sec-2026",
        year: 2026,
        level: "secundaria",
        grade: 1,
        section: "B",
        classroom: "102 - Pabellón Principal",
        courses: []
      },
      "2° A": {
        id: "sec-2a-sec-2026",
        year: 2026,
        level: "secundaria",
        grade: 2,
        section: "A",
        classroom: "201 - Pabellón Principal",
        courses: []
      },
      "2° B": {
        id: "sec-2b-sec-2026",
        year: 2026,
        level: "secundaria",
        grade: 2,
        section: "B",
        classroom: "202 - Pabellón Principal",
        courses: []
      }
    }
  }
};

export const availableYears = ["2026", "2025", "2024"];

export const levels = [
  { value: "primaria", label: "Primaria" },
  { value: "secundaria", label: "Secundaria" }
];

export const grades = [
  { value: 1, label: "1° Grado" },
  { value: 2, label: "2° Grado" },
  { value: 3, label: "3° Grado" },
  { value: 4, label: "4° Grado" },
  { value: 5, label: "5° Grado" },
  { value: 6, label: "6° Grado" }
];

export const sectionLetters = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "E", label: "E" }
];