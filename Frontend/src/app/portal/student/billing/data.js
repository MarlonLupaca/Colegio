export const mockBillingData = {
  currency: 'S/.',
  studentInfo: {
    name: 'Marlon Lupaca',
    grade: '5° Año - Sección A',
    totalOutstanding: 0.00
  },
  invoices: [
    {
      id: 'INV-2026-001',
      concept: 'Cuota de Matrícula 2026',
      amount: 450.00,
      dueDate: '28 de Feb, 2026',
      status: 'pagado',
      paymentDate: '26 de Feb, 2026',
      paymentMethod: 'Transferencia BCP',
      transactionId: 'TXN-9843210'
    },
    {
      id: 'INV-2026-002',
      concept: 'Pensión Escolar - Marzo',
      amount: 400.00,
      dueDate: '31 de Mar, 2026',
      status: 'pagado',
      paymentDate: '28 de Mar, 2026',
      paymentMethod: 'Tarjeta Visa',
      transactionId: 'TXN-9912043'
    },
    {
      id: 'INV-2026-003',
      concept: 'Pensión Escolar - Abril',
      amount: 400.00,
      dueDate: '30 de Abr, 2026',
      status: 'pagado',
      paymentDate: '29 de Abr, 2026',
      paymentMethod: 'Yape',
      transactionId: 'TXN-9988451'
    },
    {
      id: 'INV-2026-004',
      concept: 'Pensión Escolar - Mayo',
      amount: 400.00,
      dueDate: '31 de May, 2026',
      status: 'pagado',
      paymentDate: '30 de May, 2026',
      paymentMethod: 'Tarjeta Mastercard',
      transactionId: 'TXN-1002345'
    },
    {
      id: 'INV-2026-005',
      concept: 'Pensión Escolar - Junio',
      amount: 400.00,
      dueDate: '30 de Jun, 2026',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      transactionId: null
    },
    {
      id: 'INV-2026-006',
      concept: 'Pensión Escolar - Julio',
      amount: 400.00,
      dueDate: '31 de Jul, 2026',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      transactionId: null
    },
    {
      id: 'INV-2026-007',
      concept: 'Taller Extracurricular - Robótica (Trimestre 1)',
      amount: 150.00,
      dueDate: '15 de May, 2026',
      status: 'pagado',
      paymentDate: '12 de May, 2026',
      paymentMethod: 'Yape',
      transactionId: 'TXN-1005992'
    }
  ]
};
