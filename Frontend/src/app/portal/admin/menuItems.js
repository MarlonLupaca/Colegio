import { LayoutDashboard, Users, BookOpen, FolderKanban, UserPlus, FileCode, Settings } from 'lucide-react';

export const adminMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Usuarios', icon: Users },
  { id: 'courses', label: 'Cursos', icon: BookOpen },
  { id: 'sections', label: 'Secciones', icon: FolderKanban },
  { id: 'enrollment', label: 'Matrículas', icon: UserPlus },
  { id: 'audit', label: 'Auditoría', icon: FileCode },
  { id: 'settings', label: 'Ajustes', icon: Settings }
];
