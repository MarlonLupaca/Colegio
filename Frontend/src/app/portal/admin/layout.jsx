'use client';

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { adminMenuItems } from './menuItems';

export default function AdminLayout({ children }) {
  return (
    <div className="h-screen bg-transparent text-text-primary flex justify-center items-center overflow-hidden ">
      {/* Unified Parent Container Card */}
      <div className="w-full h-screen shadow-2xl flex overflow-hidden">
        {/* Dynamic Sidebar */}
        <Sidebar menuItems={adminMenuItems} portalTitle="Director" basePath="/portal/admin" />

        {/* Main Content Area */}
        <main className="flex-1 px-8 flex flex-col h-full overflow-y-auto relative bg-bg-dark/15 rounded-l-[40px] bg-card-dark">
          {/* Dynamic Header */}
          <Header
            welcomeText="Consola de Control - Director"
            userName="Administrador Principal"
            userCode="DIR00001"
            avatarText="AD"
            searchPlaceholder="Buscar logs, transacciones, roles..."
          />

          {/* Children holds the current page content */}
          <div className="flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
}
