import { LayoutDashboard, Users, BookOpen, FolderKanban, UserPlus, DoorOpen, Settings } from 'lucide-react';

export const secretaryMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Gestión Usuarios', icon: Users },
  { id: 'courses', label: 'Cursos', icon: BookOpen },
  { id: 'classrooms', label: 'Aulas', icon: DoorOpen }, 
  { id: 'sections', label: 'Secciones', icon: FolderKanban },
  { id: 'enrollment', label: 'Matrículas', icon: UserPlus },
  { id: 'settings', label: 'Ajustes', icon: Settings }
];
