'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User, Lock, GraduationCap, Award, Settings } from 'lucide-react';

// Simulated credentials without hyphens
const mockCredentials = {
  student: { code: 'ALU10024', pass: 'estudiante123' },
  teacher: { code: 'DOC20415', pass: 'docente123' },
  admin: { code: 'DIR00001', pass: 'director123' }
};

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('student'); // 'student', 'teacher', 'admin'
  const [username, setUsername] = useState(mockCredentials.student.code);
  const [password, setPassword] = useState(mockCredentials.student.pass);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-fill values when role tab changes
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setUsername(mockCredentials[newRole].code);
    setPassword(mockCredentials[newRole].pass);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulating authentication logic and redirecting
    setTimeout(() => {
      setLoading(false);
      router.push(`/portal/${role}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* Decorative background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary-teal/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-accent-indigo/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-card-dark border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 backdrop-blur-md transition-all duration-300">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary-teal to-accent-indigo rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary-teal/20 animate-pulse">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Colegio Smart</h1>
          <p className="text-text-secondary mt-2 text-sm">Bienvenido al portal inteligente de la familia</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-bg-dark p-1.5 rounded-xl mb-8 border border-white/5">
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
              role === 'student'
                ? 'bg-card-active text-primary-teal shadow-md'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Estudiante
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('teacher')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
              role === 'teacher'
                ? 'bg-card-active text-primary-teal shadow-md'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Docente
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
              role === 'admin'
                ? 'bg-card-active text-primary-teal shadow-md'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Director
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary tracking-wider uppercase block">Código</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu código"
                className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-text-primary placeholder:text-text-secondary/50 focus:border-primary-teal focus:ring-1 focus:ring-primary-teal outline-none transition-all duration-200 text-sm"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50">
                <User className="w-5 h-5" />
              </span>
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-text-secondary tracking-wider uppercase block">Contraseña</label>
              <a href="#" className="text-xs text-accent-indigo hover:text-accent-indigo/80 hover:underline transition duration-150">¿La olvidaste?</a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3.5 pl-11 pr-11 text-text-primary placeholder:text-text-secondary/50 focus:border-primary-teal focus:ring-1 focus:ring-primary-teal outline-none transition-all duration-200 text-sm"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50">
                <Lock className="w-5 h-5" />
              </span>
              {/* Toggle Password Visibility */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary/50 hover:text-text-primary transition duration-150"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-teal hover:bg-primary-hover text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary-teal/20 transition-all duration-200 transform hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.99] flex items-center justify-center text-sm disabled:opacity-75 disabled:pointer-events-none"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Ingresar al Portal'
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center text-xs text-text-secondary/50">
          <p>© 2026 Colegio Smart. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
