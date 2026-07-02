import { LayoutDashboard, Award, CreditCard, Settings, Users } from 'lucide-react';

export const parentMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'children', label: 'Mis Hijos', icon: Users },
  { id: 'grades', label: 'Calificaciones', icon: Award },
  { id: 'billing', label: 'Pagos', icon: CreditCard },
  { id: 'settings', label: 'Ajustes', icon: Settings },
];
