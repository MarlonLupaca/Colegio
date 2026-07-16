'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Key, Lock, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { apiFetch } from '@/config/api';
import { useToast } from '@/context/ToastContext';

// ── Helper: campo de contraseña (declarado fuera para evitar recreaciones en render) ──────────────────────────────────────────
const PasswordField = ({ label, value, onChange, show, onToggle, error, id }) => (
  <div className="space-y-1">
    <label className="block text-gray-400 font-bold text-[11px]">{label}</label>
    <div className={`relative flex items-center border rounded-xl overflow-hidden transition-all ${error ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200 focus-within:border-[#031553]/40 focus-within:ring-1 focus-within:ring-[#031553]/10'}`}>
      <input
        id={id}
        required
        type={show ? 'text' : 'password'}
        placeholder="••••••••"
        value={value}
        onChange={onChange}
        className="w-full p-2.5 bg-gray-50 outline-none text-[#031553] pr-10 text-xs"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 text-gray-400 hover:text-[#031553] transition-colors cursor-pointer"
        tabIndex={-1}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
    {error && <p className="text-[10px] text-rose-600 font-bold">{error}</p>}
  </div>
);

// ── Cálculo de fortaleza de contraseña ────────────────────────────────────
const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) return { score, label: 'Muy débil', color: 'bg-rose-500' };
  if (score === 2) return { score, label: 'Débil', color: 'bg-orange-400' };
  if (score === 3) return { score, label: 'Aceptable', color: 'bg-amber-400' };
  if (score === 4) return { score, label: 'Fuerte', color: 'bg-emerald-400' };
  return { score, label: 'Muy fuerte', color: 'bg-emerald-600' };
};

export default function PasswordChangeForm({ codigoUsuario, title = 'Cambiar Contraseña' }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [debeCambiar, setDebeCambiar] = useState(false);

  // Visibilidad de contraseñas
  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Estados del formulario
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados de errores
  const [errors, setErrors] = useState({});

  // Carga bandera de contraseña temporal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const flag = localStorage.getItem('debeActualizarPassword');
      setTimeout(() => {
        setDebeCambiar(flag === 'true');
      }, 0);
    }
  }, []);

  const strength = getPasswordStrength(nuevaPassword);

  // ── Validación ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!passwordActual.trim()) {
      e.passwordActual = 'La contraseña actual es obligatoria';
    } else if (passwordActual.length < 6) {
      e.passwordActual = 'Mínimo 6 caracteres';
    }

    if (!nuevaPassword) {
      e.nuevaPassword = 'La nueva contraseña es obligatoria';
    } else if (nuevaPassword.length < 6) {
      e.nuevaPassword = 'La contraseña debe tener al menos 6 caracteres';
    } else if (nuevaPassword === 'Colegio2024') {
      e.nuevaPassword = 'No puedes reutilizar la contraseña por defecto del sistema';
    }

    if (!confirmPassword) {
      e.confirmPassword = 'Confirma tu nueva contraseña';
    } else if (confirmPassword !== nuevaPassword) {
      e.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Por favor corrige los errores antes de continuar.', 'error');
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/api/auth/cambiar-password', {
        method: 'POST',
        body: JSON.stringify({ codigoUsuario, passwordActual, nuevaPassword })
      });

      showToast('¡Contraseña actualizada con éxito!', 'success');

      // Apagar bandera de contraseña temporal
      if (typeof window !== 'undefined') {
        localStorage.setItem('debeActualizarPassword', 'false');
      }
      setDebeCambiar(false);

      // Limpiar formulario y errores
      setPasswordActual('');
      setNuevaPassword('');
      setConfirmPassword('');
      setErrors({});

    } catch (err) {
      showToast(err.message || 'Error al actualizar la contraseña.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Banner de contraseña temporal */}
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

      {/* Formulario */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#031553] border-b pb-3 border-gray-100 flex items-center gap-1.5 mb-5">
          <Key className="w-4 h-4 text-[#031553]" /> {title}
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <PasswordField
            id="passwordActual"
            label="Contraseña Actual"
            value={passwordActual}
            onChange={(e) => {
              setPasswordActual(e.target.value);
              if (errors.passwordActual) setErrors(prev => ({ ...prev, passwordActual: null }));
            }}
            show={showActual}
            onToggle={() => setShowActual(!showActual)}
            error={errors.passwordActual}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <PasswordField
                id="nuevaPassword"
                label="Nueva Contraseña"
                value={nuevaPassword}
                onChange={(e) => {
                  setNuevaPassword(e.target.value);
                  if (errors.nuevaPassword) setErrors(prev => ({ ...prev, nuevaPassword: null }));
                }}
                show={showNueva}
                onToggle={() => setShowNueva(!showNueva)}
                error={errors.nuevaPassword}
              />

              {/* Barra de fortaleza */}
              {nuevaPassword && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-gray-100'}`}
                      />
                    ))}
                  </div>
                  <p className={`text-[9px] font-bold ${strength.score <= 2 ? 'text-rose-500' : strength.score === 3 ? 'text-amber-500' : 'text-emerald-600'}`}>
                    Fortaleza: {strength.label}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <PasswordField
                id="confirmPassword"
                label="Confirmar Nueva Contraseña"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: null }));
                }}
                show={showConfirm}
                onToggle={() => setShowConfirm(!showConfirm)}
                error={errors.confirmPassword}
              />

              {/* Indicador de coincidencia */}
              {confirmPassword && nuevaPassword && (
                <div className={`flex items-center gap-1.5 text-[10px] font-bold ${confirmPassword === nuevaPassword ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {confirmPassword === nuevaPassword
                    ? <><CheckCircle2 className="w-3.5 h-3.5" /> Las contraseñas coinciden</>
                    : <><XCircle className="w-3.5 h-3.5" /> No coinciden aún</>
                  }
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#031553] hover:bg-[#020d36] text-white font-semibold py-2.5 px-6 rounded-xl shadow transition-all cursor-pointer text-[11px] flex items-center gap-1.5 disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
