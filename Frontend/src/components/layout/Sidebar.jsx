'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function Sidebar({ menuItems, portalTitle, basePath }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <aside
      className={`h-full bg-sidebar-bg rounded-l-[32px] rounded-r-none py-8 flex flex-col justify-between relative z-10 transition-all duration-300 shrink-0 ${
        isCollapsed ? 'w-16 px-2' : 'w-50 px-4'
      }`}
    >
      {/* Floating Collapse/Expand Button on the right border */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-8 -right-3.5 w-7 h-7 rounded-full bg-white border border-white/10 hover:border-primary flex items-center justify-center text-primary hover:scale-105 transition-all duration-200 shadow-md z-30 cursor-pointer"
        title={isCollapsed ? 'Expandir' : 'Contraer'}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className="space-y-8">
        {/* Brand / Portal Header (School logo image) */}
        <div className={`flex items-center px-1 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <Image src="/Img/logoColegio.png" alt="Logo Colegio" width={25} height={25} className="object-contain" />
          {!isCollapsed && (
            <div className="transition-opacity duration-200">
              <span className="text-[9px] font-bold text-white/60 tracking-widest uppercase block">Portal</span>
              <h1 className="text-sm font-extrabold text-white tracking-tight whitespace-nowrap">{portalTitle}</h1>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const itemPath = item.id === 'dashboard' ? basePath : `${basePath}/${item.id}`;
            const isActive = pathname === itemPath;

            return (
              <button
                key={item.id}
                onClick={() => router.push(itemPath)}
                className={`w-full flex items-center py-2.5 transition-all duration-200 group rounded-xl cursor-pointer ${
                  isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'
                } ${
                  isActive
                    ? 'bg-white text-primary font-bold shadow-md'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? 'text-primary' : 'text-white/80 group-hover:text-white'
                  }`}
                />
                {!isCollapsed && <span className="text-sm tracking-tight whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center py-2.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-200 group cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'
          }`}
          title={isCollapsed ? 'Cerrar Sesión' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
          {!isCollapsed && <span className="text-sm font-semibold whitespace-nowrap">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}
