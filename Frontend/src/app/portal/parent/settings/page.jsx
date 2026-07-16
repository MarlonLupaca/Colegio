'use client';

import React from 'react';
import { User } from 'lucide-react';
import PasswordChangeForm from '@/components/shared/PasswordChangeForm';
import { cookies } from '@/config/api';

export default function SettingsPage() {
  const userCode = cookies.get('userCode') || 'PA20260001';
  const userName = cookies.get('userName') || 'Padre de Familia';

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-fade-in pb-12 text-xs text-[#031553]">
      {/* Tarjeta de Información de Usuario */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#031553]/10 text-[#031553] flex items-center justify-center font-bold">
          <User className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Perfil Activo</span>
          <h2 className="text-sm font-extrabold text-[#031553]">{userName}</h2>
          <p className="text-[10px] text-gray-500 font-mono mt-0.5">Código: {userCode}</p>
        </div>
      </div>

      {/* Formulario de Cambio de Contraseña con validaciones */}
      <PasswordChangeForm
        codigoUsuario={userCode}
        title="Cambiar Contraseña"
      />
    </div>
  );
}
