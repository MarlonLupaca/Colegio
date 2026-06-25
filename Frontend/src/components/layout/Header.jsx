'use client';

import React from 'react';
import { Search, Mail, Bell } from 'lucide-react';

export default function Header({ welcomeText, userName, userCode, avatarText, searchPlaceholder = 'Buscar...' }) {
  return (
    <header className="flex justify-between items-center mb-8 pb-4 border-b border-white/5 shrink-0">
      {/* Left side: Welcome Message */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">{welcomeText}</h2>
      </div>

      {/* Right side: Search, Quick Icons & Avatar */}
      <div className="flex items-center gap-4 animate-fade-in">
        {/* Search Input */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="bg-bg-dark border border-white/10 rounded-xl px-4 py-2 pl-10 text-xs w-60 outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal transition-all text-text-primary placeholder:text-text-secondary/50"
          />
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/50" />
        </div>

        {/* Messaging Icon */}
        <button
          className="p-2 rounded-xl hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          title="Mensajes"
        >
          <Mail className="w-5 h-5" />
        </button>

        {/* Notifications Icon */}
        <button
          className="p-2 rounded-xl hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors relative cursor-pointer"
          title="Notificaciones"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-teal rounded-full" />
        </button>

        {/* User Info & Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-teal to-accent-indigo flex items-center justify-center font-bold text-white text-sm shadow-sm select-none">
            {avatarText}
          </div>
          <div className="hidden lg:block text-left select-none">
            <p className="text-xs font-bold text-text-primary">{userName}</p>
            <p className="text-[10px] text-text-secondary">Código: {userCode}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
