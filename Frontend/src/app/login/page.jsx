'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { apiFetch, cookies } from '@/config/api';

// Cuentas de prueba reales generadas por el DataSeeder del Backend (con contraseña Colegio2024)
const mockCredentials = {
  student: { code: 'AL20260001', pass: 'Colegio2024' },
  teacher: { code: 'DC20260001', pass: 'Colegio2024' },
  parent: { code: 'PA20260001', pass: 'Colegio2024' },
  admin: { code: 'DI20260001', pass: 'Colegio2024' }, // Director
  secretary: { code: 'SE20260001', pass: 'Colegio2024' }
};

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('student'); // 'student', 'teacher', 'parent', 'admin', 'secretary'
  const [username, setUsername] = useState(mockCredentials.student.code);
  const [password, setPassword] = useState(mockCredentials.student.pass);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill values when role tab changes
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setUsername(mockCredentials[newRole].code);
    setPassword(mockCredentials[newRole].pass);
    setErrorMsg('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Petición real al API Gateway /auth-service
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          codigoUsuario: username,
          password: password
        })
      });

      // Guardar el token en la cookie
      cookies.set('token', data.token);

      // Cargar información de perfil real
      try {
        const perfil = await apiFetch(`/api/user/usuarios/perfil/${username}`);
        if (perfil) {
          cookies.set('userName', `${perfil.nombres} ${perfil.apellidos}`);
          cookies.set('userCode', perfil.codigoUsuario);
        }
      } catch (profileErr) {
        console.warn("No se pudo cargar el perfil detallado:", profileErr.message);
        // Fallback genérico si falla el user-service
        cookies.set('userName', username);
        cookies.set('userCode', username);
      }
      
      // Guardar la bandera de cambio de contraseña obligatoria para la Demo
      localStorage.setItem('debeActualizarPassword', data.debeActualizarPassword.toString());

      // Redirigir dinámicamente al portal correspondiente según el rol real
      const redirectMap = {
        'ALUMNO': '/portal/student',
        'DOCENTE': '/portal/teacher',
        'PADRE': '/portal/parent',
        'DIRECTOR': '/portal/admin',
        'SECRETARIA': '/portal/secretary',
        'ADMIN_TIA': '/portal/admin'
      };

      const targetPath = redirectMap[data.rol] || '/portal/student';
      router.push(targetPath);

    } catch (err) {
      setErrorMsg(err.message || 'Credenciales inválidas o servidor no disponible');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex font-sans overflow-hidden bg-white">
      {/* Left Side: Mockup Image Panel */}
      <div className="w-1/2 relative hidden md:block h-full">
        <Image 
          src="/Img/login.png" 
          alt="Login Background" 
          fill 
          priority 
          className="object-cover"
        />
      </div>

      {/* Right Side: Login Form Panel */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center px-12 md:px-24 lg:px-32 xl:px-44 h-full relative">
        <div className="max-w-md mx-auto w-full space-y-8">
          {/* Logo & Login Title side-by-side */}
          <div className="flex items-center justify-start gap-4">
            <Image 
              src="/Img/logoColegio.png" 
              alt="Logo Colegio" 
              width={48} 
              height={48} 
              className="object-contain select-none" 
            />
            <h1 className="text-3xl font-semibold text-[#031553] tracking-tight">Institución El Sauce Azul</h1>
          </div>

          {/* Modern Role Selector Tabs (5 Columns) */}
          <div className="grid grid-cols-5 gap-1 bg-[#f1f3f5] p-1 rounded-xl border border-gray-100">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`py-2 px-1 text-[10px] font-medium rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer ${
                role === 'student'
                  ? 'bg-white text-[#031553] shadow-sm font-semibold'
                  : 'text-gray-500 hover:text-[#031553]'
              }`}
            >
              Alumno
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('teacher')}
              className={`py-2 px-1 text-[10px] font-medium rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer ${
                role === 'teacher'
                  ? 'bg-white text-[#031553] shadow-sm font-semibold'
                  : 'text-gray-500 hover:text-[#031553]'
              }`}
            >
              Docente
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('parent')}
              className={`py-2 px-1 text-[10px] font-medium rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer ${
                role === 'parent'
                  ? 'bg-white text-[#031553] shadow-sm font-semibold'
                  : 'text-gray-500 hover:text-[#031553]'
              }`}
            >
              Padre
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`py-2 px-1 text-[10px] font-medium rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer ${
                role === 'admin'
                  ? 'bg-white text-[#031553] shadow-sm font-semibold'
                  : 'text-gray-500 hover:text-[#031553]'
              }`}
            >
              Director
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('secretary')}
              className={`py-2 px-1 text-[10px] font-medium rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer ${
                role === 'secretary'
                  ? 'bg-white text-[#031553] shadow-sm font-semibold'
                  : 'text-gray-500 hover:text-[#031553]'
              }`}
            >
              Secretaría
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-xs py-2 px-3 rounded-lg border border-red-100 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Input with bottom border */}
            <div className="border-b border-[#031553]/20 focus-within:border-[#031553] transition-all duration-200 py-1">
              <label className="text-xs text-gray-400 block font-medium">Código</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu código"
                className="w-full bg-transparent text-[#031553] focus:outline-none text-sm py-1 placeholder:text-gray-300"
              />
            </div>

            {/* Password Input with bottom border and forgot link inline */}
            <div className="border-b border-[#031553]/20 focus-within:border-[#031553] transition-all duration-200 py-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-gray-400 block font-medium">Password</label>
                <a href="#" className="text-xs text-[#031553] hover:underline font-semibold">
                  Forgot password?
                </a>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-[#031553] focus:outline-none text-sm py-1 pr-8 placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 text-gray-400 hover:text-[#031553] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#031553] hover:bg-[#020d36] text-white font-medium py-3 px-4 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center text-sm disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                'Inicia sesión'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
