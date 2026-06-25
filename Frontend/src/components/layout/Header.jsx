'use client';

import React, { useState } from 'react';
import { Search, Bell, X, BookOpen, FileText, Calendar, Award } from 'lucide-react';

const mockNotifications = [
  {
    id: 1,
    type: 'material',
    title: 'Nuevo Material de Estudio',
    description: 'Se ha subido la diapositiva de "Introducción a la Electrónica" en tu curso.',
    time: 'Hace 10 min',
    icon: BookOpen,
    iconColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    id: 2,
    type: 'task',
    title: 'Nueva Tarea Asignada',
    description: 'Entregar la tarea de "Laboratorio de Sensores" antes del viernes 18:00.',
    time: 'Hace 1 hora',
    icon: FileText,
    iconColor: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    id: 3,
    type: 'meeting',
    title: 'Evento Programado',
    description: 'Clase extra de reforzamiento programada para este sábado a las 09:00.',
    time: 'Hace 4 horas',
    icon: Calendar,
    iconColor: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    id: 4,
    type: 'grade',
    title: 'Calificación Publicada',
    description: 'Ya puedes revisar tu nota del examen parcial de Robótica.',
    time: 'Hace 1 día',
    icon: Award,
    iconColor: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  },
];

export default function Header({ welcomeText, userName, userCode, avatarText, searchPlaceholder = 'Buscar...' }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <header className="flex justify-between items-center mb-4  py-4 border-b border-gray-300 shrink-0 sticky top-0 bg-white z-20">
      {/* Left side: Welcome Message */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">{welcomeText}</h2>
      </div>

      {/* Right side: Search, Quick Icons & Avatar */}
      <div className="flex items-center gap-4">
        {/* Search Input (Improved Contrast and Visibility) */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="bg-gray-100 border border-gray-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2 pl-10 text-xs w-60 outline-none transition-all text-text-primary placeholder:text-gray-400 font-medium"
          />
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Notifications Icon (Bell Only) */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="p-2 rounded-xl hover:bg-gray-100 text-text-secondary hover:text-text-primary transition-all relative cursor-pointer active:scale-95"
          title="Notificaciones"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-red rounded-full animate-pulse" />
        </button>

        {/* User Info & Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
          <div className="w-9 h-9 rounded-xl bg-[#031553] flex items-center justify-center font-bold text-white text-sm shadow-sm select-none">
            {avatarText}
          </div>
          <div className="hidden lg:block text-left select-none">
            <p className="text-xs font-bold text-text-primary">{userName}</p>
            <p className="text-[10px] text-text-secondary">Código: {userCode}</p>
          </div>
        </div>
      </div>

      {/* Slide-in Notifications Drawer overlay and panel */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50 transition-opacity duration-300"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out p-4 flex flex-col ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-text-primary">Notificaciones</h3>
            <span className="bg-accent-red/10 text-accent-red text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {mockNotifications.length}
            </span>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-text-primary transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List (Tighter, Prettier List Spacing) */}
        <div className="flex-1 overflow-y-auto space-y-0.5 pr-1">
          {mockNotifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                className="flex gap-3 py-3 border-b border-gray-50 hover:bg-gray-50/50 transition-all duration-200 px-1"
              >
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${notif.iconColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <h4 className="font-bold text-[11px] text-text-primary leading-tight">{notif.title}</h4>
                  <p className="text-[10px] text-text-secondary leading-snug">{notif.description}</p>
                  <span className="text-[8px] text-gray-400 block pt-0.5">{notif.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="pt-3 border-t border-gray-100 mt-4">
          <button className="w-full py-2 text-center text-xs font-bold text-primary hover:bg-gray-50 rounded-xl border border-gray-200 transition-all cursor-pointer">
            Marcar todas como leídas
          </button>
        </div>
      </div>
    </header>
  );
}
