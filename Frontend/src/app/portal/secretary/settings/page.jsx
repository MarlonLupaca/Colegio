'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Key, User, Lock, Eye, EyeOff } from 'lucide-react';
import { apiFetch } from '@/config/api';
import { useToast } from '@/context/ToastContext';

export default function SettingsPage() {
  const { showToast } = useToast();
  const [debeCambiar, setDebeCambiar] = useState(false);
  const [loading, setLoading] = useState(false);

  // Visibilidad de contraseñas
  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form states
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Cargar estado de contraseña temporal
  useEffect(() => {
    const flag = localStorage.getItem('debeActualizarPassword');
    setDebeCambiar(flag === 'true');
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (nuevaPassword !== confirmPassword) {
      showToast('Las contraseñas nuevas no coinciden.', 'error');
      return;
    }

    setLoading(true);

    try {
      const codigoUsuario = 'SE20260001'; 

      await apiFetch('/api/auth/cambiar-password', {
        method: 'POST',
        body: JSON.stringify({
          codigoUsuario,
          passwordActual,
          nuevaPassword
        })
      });

      showToast('Contraseña actualizada con éxito.', 'success');
      
      // Apagar bandera
      localStorage.setItem('debeActualizarPassword', 'false');
      setDebeCambiar(false);

      // Limpiar formulario
      setPasswordActual('');
      setNuevaPassword('');
      setConfirmPassword('');

    } catch (err) {
      showToast(err.message || 'Error al actualizar la contraseña.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-fade-in pb-12 text-xs text-[#031553]">
      
      {/* Banner Rojo de Advertencia (Demo) */}
      {debeCambiar && (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-3 text-rose-800 shadow-sm animate-pulse">
          <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold">⚠️ Contraseña Temporal Detectada</h4>
            <p className="text-[10px] text-rose-600 mt-0.5 leading-relaxed">
              Por razones de seguridad institucional, debe actualizar su contraseña por defecto antes de continuar navegando.
            </p>
          </div>
        </div>
      )}

      {/* Tarjeta de Información de Usuario */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#031553]/10 text-[#031553] flex items-center justify-center font-bold">
          <User className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Perfil Activo</span>
          <h2 className="text-sm font-extrabold text-[#031553]">Marlon Lupaca</h2>
          <p className="text-[10px] text-gray-500 font-mono mt-0.5">Código Secretaria: SE20260001</p>
        </div>
      </div>

      {/* Formulario de Cambio de Contraseña */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#031553] border-b pb-3 border-gray-100 flex items-center gap-1.5">
          <Key className="w-4 h-4 text-[#031553]" /> Cambiar Contraseña
        </h3>
        
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-gray-400 font-bold mb-1">Contraseña Actual</label>
            <div className="relative flex items-center">
              <input
                required
                type={showActual ? 'text' : 'password'}
                placeholder="••••••••"
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowActual(!showActual)}
                className="absolute right-3 text-gray-400 hover:text-[#031553] transition-colors cursor-pointer"
              >
                {showActual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 font-bold mb-1">Nueva Contraseña</label>
              <div className="relative flex items-center">
                <input
                  required
                  type={showNueva ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNueva(!showNueva)}
                  className="absolute right-3 text-gray-400 hover:text-[#031553] transition-colors cursor-pointer"
                >
                  {showNueva ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 font-bold mb-1">Confirmar Nueva Contraseña</label>
              <div className="relative flex items-center">
                <input
                  required
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 text-gray-400 hover:text-[#031553] transition-colors cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#031553] hover:bg-[#020d36] text-white font-semibold py-2.5 px-6 rounded-xl shadow transition-all cursor-pointer text-[11px] flex items-center gap-1.5 disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" /> {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
