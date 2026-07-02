
export const classroomStatuses = [
  { value: 'DISPONIBLE', label: 'Disponible' },
  { value: 'OCUPADO', label: 'Ocupado' },
  { value: 'MANTENIMIENTO', label: 'En Mantenimiento' },
  { value: 'INACTIVO', label: 'Inactivo' }
];

export const classroomTypes = [
  { value: 'AULA_NORMAL', label: 'Aula Normal' },
  { value: 'LABORATORIO', label: 'Laboratorio' },
  { value: 'AUDITORIO', label: 'Auditorio' },
  { value: 'SALA_INFORMATICA', label: 'Sala de Informática' },
  { value: 'TALLER', label: 'Taller' }
];

export const buildings = [
  'Pabellón A',
  'Pabellón B',
  'Pabellón C',
  'Pabellón D',
  'Pabellón Principal'
];

export const initialClassrooms = [
  {
    id: '1',
    building: 'Pabellón A',
    roomNumber: '101',
    maxCapacity: 25,
    status: 'DISPONIBLE',
    type: 'AULA_NORMAL'
  },
  {
    id: '2',
    building: 'Pabellón A',
    roomNumber: '102',
    maxCapacity: 30,
    status: 'OCUPADO',
    type: 'AULA_NORMAL'
  },
  {
    id: '3',
    building: 'Pabellón B',
    roomNumber: '201',
    maxCapacity: 20,
    status: 'DISPONIBLE',
    type: 'LABORATORIO'
  },
  {
    id: '4',
    building: 'Pabellón C',
    roomNumber: '301',
    maxCapacity: 50,
    status: 'MANTENIMIENTO',
    type: 'AUDITORIO'
  },
  {
    id: '5',
    building: 'Pabellón Principal',
    roomNumber: '001',
    maxCapacity: 15,
    status: 'INACTIVO',
    type: 'SALA_INFORMATICA'
  }
];