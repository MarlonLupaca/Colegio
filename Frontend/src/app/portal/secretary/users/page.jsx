'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Eye,
  Mail,
  Phone,
  ShieldCheck,
  X,
  Link2,
  UserCheck,
  Sparkles,
  Baby,
  Trash2,
  Edit3,
  Save
} from 'lucide-react';
import { apiFetch } from '@/config/api';
import { useToast } from '@/context/ToastContext';
import { useConfirmation } from '@/context/ConfirmationContext';
import { validateForm, isRequired, isDNI, isEmail, isPhone, minLength, maxLength } from '@/hooks/useFormValidation';

export default function UsersPage() {
  const { showToast } = useToast();
  const { askConfirmation } = useConfirmation();
  
  const [usuarios, setUsuarios] = useState([]);
  const [vinculaciones, setVinculaciones] = useState([]);
  const [activeTab, setActiveTab] = useState('ALUMNO'); // 'ALUMNO', 'PADRE', 'DOCENTE', 'VINCULAR'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados de errores de validación por formulario
  const [createErrors, setCreateErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [vinculoErrors, setVinculoErrors] = useState({});

  // Modo edición dentro del modal
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    grado: '',
    seccion: '',
    fechaNacimiento: '',
    especialidad: '',
    titulo: ''
  });

  // Form states (para nueva creación)
  const [newRol, setNewRol] = useState('ALUMNO');
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    email: '',
    telefono: '',
    grado: '1',
    seccion: 'A',
    fechaNacimiento: '2015-01-01',
    especialidad: '',
    titulo: ''
  });

  // Vinculación state
  const [vinculo, setVinculo] = useState({
    codigoPadre: '',
    codigoAlumno: ''
  });

  // Cargar usuarios y vinculaciones del backend
  const fetchDatos = async () => {
    try {
      const uData = await apiFetch('/api/user/usuarios');
      setUsuarios(uData || []);

      const vData = await apiFetch('/api/user/padre-alumno');
      setVinculaciones(vData || []);
    } catch (err) {
      console.error('Error cargando información:', err.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDatos();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const actual = usuarios.find(u => u.codigoUsuario === selectedUser.codigoUsuario);
      if (actual) {
        setTimeout(() => {
          setSelectedUser(actual);
        }, 0);
      }
    }
  }, [usuarios, vinculaciones, selectedUser]);

  // Activar modo edición cargando los valores actuales
  const startEditMode = () => {
    setEditFormData({
      nombres: selectedUser.nombres || '',
      apellidos: selectedUser.apellidos || '',
      email: selectedUser.email || '',
      telefono: selectedUser.telefono || '',
      grado: selectedUser.grado || '1',
      seccion: selectedUser.seccion || 'A',
      fechaNacimiento: selectedUser.fechaNacimiento || '',
      especialidad: selectedUser.especialidad || '',
      titulo: selectedUser.titulo || ''
    });
    setIsEditMode(true);
  };

  // Guardar cambios editados en el backend
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    // Construir reglas de validación dinámicas según el rol
    const editRules = {
      nombres: [
        { check: (v) => isRequired(v), msg: 'El nombre es obligatorio' },
        { check: (v) => minLength(v, 2), msg: 'Mínimo 2 caracteres' },
        { check: (v) => maxLength(v, 80), msg: 'Máximo 80 caracteres' }
      ],
      apellidos: [
        { check: (v) => isRequired(v), msg: 'Los apellidos son obligatorios' },
        { check: (v) => minLength(v, 2), msg: 'Mínimo 2 caracteres' },
        { check: (v) => maxLength(v, 80), msg: 'Máximo 80 caracteres' }
      ],
      telefono: [
        { check: (v) => isRequired(v), msg: 'El teléfono es obligatorio' },
        { check: (v) => isPhone(v), msg: 'Ingresa un número de teléfono válido (9 dígitos)' }
      ],
      ...(selectedUser.rol !== 'ALUMNO' && {
        email: [
          { check: (v) => isRequired(v), msg: 'El correo electrónico es obligatorio' },
          { check: (v) => isEmail(v), msg: 'Ingresa un correo electrónico válido (ej. nombre@dominio.com)' }
        ]
      }),
      ...(selectedUser.rol === 'DOCENTE' && {
        especialidad: [
          { check: (v) => isRequired(v), msg: 'La especialidad es obligatoria' },
          { check: (v) => minLength(v, 3), msg: 'Mínimo 3 caracteres' }
        ],
        titulo: [
          { check: (v) => isRequired(v), msg: 'El título profesional es obligatorio' },
          { check: (v) => minLength(v, 3), msg: 'Mínimo 3 caracteres' }
        ]
      }),
      ...(selectedUser.rol === 'ALUMNO' && {
        fechaNacimiento: [
          { check: (v) => isRequired(v), msg: 'La fecha de nacimiento es obligatoria' }
        ]
      })
    };

    const { isValid, errors } = validateForm(editFormData, editRules);
    setEditErrors(errors);
    if (!isValid) {
      showToast('Por favor corrige los errores en el formulario.', 'error');
      return;
    }

    const isConfirmed = await askConfirmation({
      title: 'Actualizar Perfil de Usuario',
      message: '¿Está seguro de que desea guardar los cambios en la ficha de este usuario?',
      confirmLabel: 'Guardar',
      cancelLabel: 'Cancelar'
    });

    if (!isConfirmed) return;
    setLoading(true);

    try {
      const requestBody = {
        nombres: editFormData.nombres,
        apellidos: editFormData.apellidos,
        email: selectedUser.rol === 'ALUMNO' ? null : editFormData.email,
        telefono: editFormData.telefono,
        ...(selectedUser.rol === 'ALUMNO' && {
          grado: editFormData.grado,
          seccion: editFormData.seccion,
          fechaNacimiento: editFormData.fechaNacimiento
        }),
        ...(selectedUser.rol === 'DOCENTE' && {
          especialidad: editFormData.especialidad,
          titulo: editFormData.titulo
        })
      };

      await apiFetch(`/api/user/usuarios/${selectedUser.codigoUsuario}`, {
        method: 'PUT',
        body: JSON.stringify(requestBody)
      });

      showToast('Ficha de usuario actualizada correctamente.', 'success');
      
      // Recargar datos y cerrar edición
      await fetchDatos();
      setIsEditMode(false);
      setEditErrors({});

    } catch (err) {
      showToast(err.message || 'Error al actualizar el usuario.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Obtener los datos dinámicos para los accesos rápidos de vinculación
  const ultimoPadre = usuarios
    .filter(u => u.rol === 'PADRE')
    .sort((a, b) => b.id - a.id)[0];

  const ultimosAlumnos = usuarios
    .filter(u => u.rol === 'ALUMNO')
    .slice(0, 5);

  // Encontrar hijos vinculados a un padre específico
  const getHijosDePadre = (codigoPadre) => {
    return vinculaciones
      .filter(v => v.codigoPadre === codigoPadre)
      .map(v => {
        const alumno = usuarios.find(u => u.codigoUsuario === v.codigoAlumno);
        return {
          idVinculacion: v.id,
          codigo: v.codigoAlumno,
          nombre: alumno ? `${alumno.nombres} ${alumno.apellidos}` : 'Estudiante Registrado'
        };
      });
  };

  // Encontrar nombre del apoderado por código
  const getNombreUsuario = (codigo) => {
    const user = usuarios.find(u => u.codigoUsuario === codigo);
    return user ? `${user.nombres} ${user.apellidos}` : 'Cargando...';
  };

  // Enviar creación de usuario al backend
  const handleCreateUser = async (e) => {
    e.preventDefault();

    // Construir reglas dinámicas según el rol
    const createRules = {
      nombres: [
        { check: (v) => isRequired(v), msg: 'El nombre es obligatorio' },
        { check: (v) => minLength(v, 2), msg: 'Mínimo 2 caracteres' },
        { check: (v) => maxLength(v, 80), msg: 'Máximo 80 caracteres' }
      ],
      apellidos: [
        { check: (v) => isRequired(v), msg: 'Los apellidos son obligatorios' },
        { check: (v) => minLength(v, 2), msg: 'Mínimo 2 caracteres' },
        { check: (v) => maxLength(v, 80), msg: 'Máximo 80 caracteres' }
      ],
      dni: [
        { check: (v) => isRequired(v), msg: 'El DNI es obligatorio' },
        { check: (v) => isDNI(v), msg: 'El DNI debe tener exactamente 8 dígitos numéricos' }
      ],
      telefono: [
        { check: (v) => isRequired(v), msg: 'El teléfono es obligatorio' },
        { check: (v) => isPhone(v), msg: 'Ingresa un número de teléfono válido (9 dígitos)' }
      ],
      ...(newRol !== 'ALUMNO' && {
        email: [
          { check: (v) => isRequired(v), msg: 'El correo electrónico es obligatorio' },
          { check: (v) => isEmail(v), msg: 'Ingresa un correo electrónico válido (ej. nombre@dominio.com)' }
        ]
      }),
      ...(newRol === 'DOCENTE' && {
        especialidad: [
          { check: (v) => isRequired(v), msg: 'La especialidad es obligatoria' },
          { check: (v) => minLength(v, 3), msg: 'Mínimo 3 caracteres' }
        ],
        titulo: [
          { check: (v) => isRequired(v), msg: 'El título profesional es obligatorio' },
          { check: (v) => minLength(v, 3), msg: 'Mínimo 3 caracteres' }
        ]
      }),
      ...(newRol === 'ALUMNO' && {
        fechaNacimiento: [
          { check: (v) => isRequired(v), msg: 'La fecha de nacimiento es obligatoria' }
        ]
      })
    };

    const { isValid, errors } = validateForm(formData, createRules);
    setCreateErrors(errors);
    if (!isValid) {
      showToast('Por favor corrige los errores antes de guardar.', 'error');
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        rol: newRol,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        dni: formData.dni,
        email: newRol === 'ALUMNO' ? null : formData.email,
        telefono: formData.telefono,
        ...(newRol === 'ALUMNO' && {
          grado: formData.grado,
          seccion: formData.seccion,
          fechaNacimiento: formData.fechaNacimiento
        }),
        ...(newRol === 'DOCENTE' && {
          especialidad: formData.especialidad,
          titulo: formData.titulo
        })
      };

      const result = await apiFetch('/api/user/usuarios', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      showToast(`Usuario registrado con éxito. Código: ${result.codigoUsuario}`, 'success');
      
      fetchDatos();
      setIsNewUserOpen(false);
      setCreateErrors({});

      setFormData({
        nombres: '',
        apellidos: '',
        dni: '',
        email: '',
        telefono: '',
        grado: '1',
        seccion: 'A',
        fechaNacimiento: '2015-01-01',
        especialidad: '',
        titulo: ''
      });

    } catch (err) {
      showToast(err.message || 'Error al registrar el usuario.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Enviar vinculación familiar al backend
  const handleVincular = async (e) => {
    e.preventDefault();

    const vinculoRules = {
      codigoPadre: [
        { check: (v) => isRequired(v), msg: 'El código del apoderado es obligatorio' },
        { check: (v) => /^PA\d{8}$/i.test(String(v).trim()), msg: 'Formato inválido. Debe ser PA seguido de 8 dígitos (ej: PA20260001)' }
      ],
      codigoAlumno: [
        { check: (v) => isRequired(v), msg: 'El código del estudiante es obligatorio' },
        { check: (v) => /^AL\d{8}$/i.test(String(v).trim()), msg: 'Formato inválido. Debe ser AL seguido de 8 dígitos (ej: AL20260001)' }
      ]
    };

    const { isValid, errors } = validateForm(vinculo, vinculoRules);
    setVinculoErrors(errors);
    if (!isValid) {
      showToast('Por favor corrige los errores en los códigos ingresados.', 'error');
      return;
    }

    setLoading(true);

    try {
      await apiFetch('/api/user/padre-alumno', {
        method: 'POST',
        body: JSON.stringify({
          codigoPadre: vinculo.codigoPadre,
          codigoAlumno: vinculo.codigoAlumno
        })
      });

      showToast(`Vinculación familiar guardada correctamente.`, 'success');
      
      fetchDatos();
      setVinculo({ codigoPadre: '', codigoAlumno: '' });
      setVinculoErrors({});

    } catch (err) {
      showToast(err.message || 'Error al vincular apoderado.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar vinculación familiar del backend
  const handleDesvincular = async (idVinculacion) => {
    const isConfirmed = await askConfirmation({
      title: 'Eliminar Vínculo Familiar',
      message: '¿Está seguro de que desea eliminar la vinculación de este estudiante con el apoderado? Esta acción no se puede deshacer.',
      confirmLabel: 'Desvincular',
      cancelLabel: 'Cancelar'
    });

    if (!isConfirmed) return;

    try {
      await apiFetch(`/api/user/padre-alumno/${idVinculacion}`, {
        method: 'DELETE'
      });

      showToast('Vinculación familiar eliminada correctamente.', 'success');
      fetchDatos(); // Recargar vinculaciones
    } catch (err) {
      showToast(err.message || 'Error al eliminar la vinculación.', 'error');
    }
  };

  const filteredUsers = usuarios
    .filter(u => u.rol === activeTab)
    .filter(u =>
      u.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.dni.includes(searchTerm) ||
      u.codigoUsuario.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="w-full animate-fade-in pb-12 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#031553]/10 rounded-xl text-[#031553]">
              <Users className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-bold text-[#031553]">Registro y Control de Perfiles</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Administración de matrículas, legajos de estudiantes, docentes y apoderados de la institución.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab !== 'VINCULAR' && (
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por DNI, código o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#031553] text-[#031553]"
              />
            </div>
          )}
          
          {activeTab !== 'VINCULAR' ? (
            <button
              onClick={() => {
                setNewRol(activeTab);
                setIsNewUserOpen(true);
              }}
              className="flex items-center gap-2 bg-[#031553] hover:bg-[#020d36] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" /> Registrar {activeTab.toLowerCase()}
            </button>
          ) : (
            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-2 rounded-xl">Módulo de Vinculación</span>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 gap-6">
        {['ALUMNO', 'PADRE', 'DOCENTE', 'VINCULAR'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearchTerm('');
            }}
            className={`pb-3 text-xs font-bold transition-all relative cursor-pointer uppercase ${
              activeTab === tab
                ? 'text-[#031553] font-extrabold border-b-2 border-[#031553]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab === 'VINCULAR' ? 'Vinculación Apoderado' : `${tab}s`}
          </button>
        ))}
      </div>

      {/* Conditional Rendering: VINCULAR Tab vs Tables */}
      {activeTab === 'VINCULAR' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-[#031553] flex items-center gap-1.5 border-b pb-3 border-gray-100">
                <Link2 className="w-4 h-4" /> Asociar Padre con Hijo
              </h2>
              <form onSubmit={handleVincular} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Código del Padre de Familia</label>
                    <input
                      required
                      type="text"
                      placeholder="Ej: PA20260001"
                      value={vinculo.codigoPadre}
                      onChange={(e) => {
                        setVinculo({ ...vinculo, codigoPadre: e.target.value.toUpperCase() });
                        if (vinculoErrors.codigoPadre) setVinculoErrors(prev => ({ ...prev, codigoPadre: null }));
                      }}
                      className={`w-full p-2.5 bg-gray-50 border rounded-xl focus:border-[#031553] outline-none text-[#031553] font-mono ${
                        vinculoErrors.codigoPadre ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200'
                      }`}
                    />
                    {vinculoErrors.codigoPadre && <p className="text-[10px] text-rose-600 font-bold mt-1">{vinculoErrors.codigoPadre}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Código del Estudiante (Hijo)</label>
                    <input
                      required
                      type="text"
                      placeholder="Ej: AL20260001"
                      value={vinculo.codigoAlumno}
                      onChange={(e) => {
                        setVinculo({ ...vinculo, codigoAlumno: e.target.value.toUpperCase() });
                        if (vinculoErrors.codigoAlumno) setVinculoErrors(prev => ({ ...prev, codigoAlumno: null }));
                      }}
                      className={`w-full p-2.5 bg-gray-50 border rounded-xl focus:border-[#031553] outline-none text-[#031553] font-mono ${
                        vinculoErrors.codigoAlumno ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200'
                      }`}
                    />
                    {vinculoErrors.codigoAlumno && <p className="text-[10px] text-rose-600 font-bold mt-1">{vinculoErrors.codigoAlumno}</p>}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-1.5 text-[#031553] font-bold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Asistente de Rellenado Rápido
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]">
                    <div className="space-y-1.5 border-r border-gray-200/60 pr-2">
                      <span className="text-gray-400 font-semibold block">Último Apoderado Creado:</span>
                      {ultimoPadre ? (
                        <button
                          type="button"
                          onClick={() => setVinculo(prev => ({ ...prev, codigoPadre: ultimoPadre.codigoUsuario }))}
                          className="w-full text-left bg-white hover:bg-[#031553]/5 border border-gray-200 p-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer group"
                        >
                          <div className="w-6 h-6 rounded-lg bg-[#031553]/10 text-[#031553] flex items-center justify-center font-bold text-[9px] group-hover:bg-[#031553] group-hover:text-white">
                            PA
                          </div>
                          <div>
                            <div className="font-bold text-gray-700">{ultimoPadre.nombres} {ultimoPadre.apellidos}</div>
                            <div className="text-[8px] text-gray-400 font-mono font-bold">{ultimoPadre.codigoUsuario}</div>
                          </div>
                        </button>
                      ) : (
                        <span className="text-gray-400 italic block py-1">No hay padres en el sistema escolar</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-gray-400 font-semibold block">Últimos Estudiantes Registrados:</span>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {ultimosAlumnos.map(al => (
                          <button
                            key={al.id}
                            type="button"
                            onClick={() => setVinculo(prev => ({ ...prev, codigoAlumno: al.codigoUsuario }))}
                            className="w-full text-left bg-white hover:bg-[#031553]/5 border border-gray-200 p-1.5 px-2 rounded-lg transition-all flex items-center justify-between cursor-pointer group"
                          >
                            <span className="font-bold text-gray-700 truncate max-w-[120px]">{al.nombres} {al.apellidos}</span>
                            <span className="text-[8px] text-gray-400 font-mono font-bold group-hover:text-[#031553]">{al.codigoUsuario}</span>
                          </button>
                        ))}
                        {ultimosAlumnos.length === 0 && (
                          <span className="text-gray-400 italic block py-1">No hay alumnos en el sistema escolar</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#031553] hover:bg-[#020d36] text-white font-semibold py-2.5 px-6 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 text-[11px]"
                  >
                    {loading ? 'Vinculando...' : 'Asociar Vínculo Familiar'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-[#031553] border-b pb-3 border-gray-100">
                Registro de Relaciones Apoderado - Alumno
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="py-2.5 px-4">Padre de Familia</th>
                      <th className="py-2.5 px-4">Hijo (Estudiante)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {vinculaciones.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#031553]">{getNombreUsuario(v.codigoPadre)}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{v.codigoPadre}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#031553]">{getNombreUsuario(v.codigoAlumno)}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{v.codigoAlumno}</div>
                        </td>
                      </tr>
                    ))}
                    {vinculaciones.length === 0 && (
                      <tr>
                        <td colSpan="2" className="text-center py-6 text-gray-400">
                          No hay vinculaciones registradas en la base de datos.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-fit space-y-4">
            <h2 className="text-sm font-bold text-[#031553] border-b pb-3 border-gray-100 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" /> Detalle del Vínculo a Crear
            </h2>
            <div className="text-xs space-y-3">
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <span className="text-gray-400 block font-bold text-[9px] uppercase tracking-wider">Padre Asignado</span>
                {vinculo.codigoPadre ? (
                  <div className="mt-1">
                    <span className="font-bold text-[#031553] block">
                      {getNombreUsuario(vinculo.codigoPadre)}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono font-bold block">{vinculo.codigoPadre}</span>
                  </div>
                ) : (
                  <span className="text-gray-400 italic mt-1 block">Ningún apoderado seleccionado</span>
                )}
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <span className="text-gray-400 block font-bold text-[9px] uppercase tracking-wider">Estudiante Asignado</span>
                {vinculo.codigoAlumno ? (
                  <div className="mt-1">
                    <span className="font-bold text-[#031553] block">
                      {getNombreUsuario(vinculo.codigoAlumno)}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono font-bold block">{vinculo.codigoAlumno}</span>
                  </div>
                ) : (
                  <span className="text-gray-400 italic mt-1 block">Ningún estudiante seleccionado</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Users Table List */
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Identificador / Nombre</th>
                  <th className="py-3.5 px-6">DNI</th>
                  <th className="py-3.5 px-6">Contacto</th>
                  {activeTab === 'ALUMNO' && <th className="py-3.5 px-6">Aula</th>}
                  {activeTab === 'PADRE' && <th className="py-3.5 px-6">Hijos Vinculados</th>}
                  {activeTab === 'DOCENTE' && <th className="py-3.5 px-6">Especialidad</th>}
                  <th className="py-3.5 px-6">Estado</th>
                  <th className="py-3.5 px-6 text-right">Ver Ficha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#031553] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {u.nombres[0]}{u.apellidos[0]}
                        </div>
                        <div>
                          <div className="font-bold text-[#031553] text-sm">
                            {u.nombres} {u.apellidos}
                          </div>
                          <div className="text-[10px] text-gray-400 font-bold font-mono">{u.codigoUsuario}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-600">{u.dni}</td>
                    <td className="py-4 px-6 space-y-0.5">
                      {u.rol !== 'ALUMNO' && (
                        <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                          <Mail className="w-3 h-3" /> {u.email}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Phone className="w-3 h-3" /> {u.telefono}
                      </div>
                    </td>
                    {activeTab === 'ALUMNO' && (
                      <td className="py-4 px-6">
                        <span className="bg-indigo-50 text-[#031553] px-2 py-0.5 rounded font-bold text-[10px]">
                          Grado {u.grado} - {u.seccion}
                        </span>
                      </td>
                    )}
                    {activeTab === 'PADRE' && (
                      <td className="py-4 px-6 max-w-[200px]">
                        <div className="flex flex-col gap-1 items-start">
                          {getHijosDePadre(u.codigoUsuario).length > 0 ? (
                            getHijosDePadre(u.codigoUsuario).map(h => (
                              <span 
                                key={h.codigo} 
                                className="inline-flex items-center gap-1 bg-emerald-50 text-[#031553] px-2 py-0.5 rounded-lg font-bold text-[10px] border border-emerald-100 animate-fade-in truncate max-w-full"
                                title={h.nombre}
                              >
                                <Baby className="w-3 h-3 text-[#031553] shrink-0" /> 
                                <span className="truncate max-w-[140px]">{h.nombre}</span>
                              </span>
                            ))
                          ) : (
                            <span className="text-rose-500 font-bold text-[10px]">Sin hijos vinculados</span>
                          )}
                        </div>
                      </td>
                    )}
                    {activeTab === 'DOCENTE' && (
                      <td className="py-4 px-6">
                        <span className="font-bold text-gray-600">{u.especialidad}</span>
                      </td>
                    )}
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right w-32 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setIsEditMode(false); // Reset mode al abrir
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-[#031553] hover:text-white text-[#031553] font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Eye className="w-3.5 h-3.5" /> Ver Ficha
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={activeTab === 'ALUMNO' || activeTab === 'DOCENTE' || activeTab === 'PADRE' ? 7 : 6} className="text-center py-12 text-gray-400">
                      No se encontraron registros en esta lista.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Record Detail Modal (Editable) */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="bg-[#031553] text-white p-6 relative">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                }}
                className="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 p-1.5 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white text-[#031553] font-extrabold text-xl flex items-center justify-center shadow-lg">
                  {selectedUser.nombres[0]}{selectedUser.apellidos[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {selectedUser.nombres} {selectedUser.apellidos}
                  </h3>
                  <p className="text-xs text-indigo-200 mt-0.5">Código: {selectedUser.codigoUsuario}</p>
                </div>
              </div>
            </div>

            {/* Formulario/Visualización */}
            <form onSubmit={handleUpdateUser}>
              <div className="p-6 space-y-6 text-xs max-h-[60vh] overflow-y-auto">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#031553]" /> Legajo / Información Ficha
                  </h4>
                  
                  {isEditMode ? (
                    /* MODO EDICIÓN FORMULARIO */
                    <div className="space-y-4 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                      <div>
                        <label className="block text-gray-400 font-bold mb-1">Nombres</label>
                        <input
                          required
                          type="text"
                          value={editFormData.nombres}
                          onChange={(e) => {
                            setEditFormData({ ...editFormData, nombres: e.target.value });
                            if (editErrors.nombres) setEditErrors(prev => ({ ...prev, nombres: null }));
                          }}
                          className={`w-full p-2 bg-white border rounded-lg outline-none focus:border-[#031553] text-[#031553] ${
                            editErrors.nombres ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200'
                          }`}
                        />
                        {editErrors.nombres && <p className="text-[10px] text-rose-600 font-bold mt-1">{editErrors.nombres}</p>}
                      </div>
                      <div>
                        <label className="block text-gray-400 font-bold mb-1">Apellidos</label>
                        <input
                          required
                          type="text"
                          value={editFormData.apellidos}
                          onChange={(e) => {
                            setEditFormData({ ...editFormData, apellidos: e.target.value });
                            if (editErrors.apellidos) setEditErrors(prev => ({ ...prev, apellidos: null }));
                          }}
                          className={`w-full p-2 bg-white border rounded-lg outline-none focus:border-[#031553] text-[#031553] ${
                            editErrors.apellidos ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200'
                          }`}
                        />
                        {editErrors.apellidos && <p className="text-[10px] text-rose-600 font-bold mt-1">{editErrors.apellidos}</p>}
                      </div>
                      {selectedUser.rol !== 'ALUMNO' && (
                        <div>
                          <label className="block text-gray-400 font-bold mb-1">Correo Electrónico</label>
                          <input
                            required
                            type="email"
                            value={editFormData.email}
                            onChange={(e) => {
                              setEditFormData({ ...editFormData, email: e.target.value });
                              if (editErrors.email) setEditErrors(prev => ({ ...prev, email: null }));
                            }}
                            className={`w-full p-2 bg-white border rounded-lg outline-none focus:border-[#031553] text-[#031553] ${
                              editErrors.email ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200'
                            }`}
                          />
                          {editErrors.email && <p className="text-[10px] text-rose-600 font-bold mt-1">{editErrors.email}</p>}
                        </div>
                      )}
                      <div>
                        <label className="block text-gray-400 font-bold mb-1">Teléfono</label>
                        <input
                          required
                          type="text"
                          value={editFormData.telefono}
                          onChange={(e) => {
                            setEditFormData({ ...editFormData, telefono: e.target.value });
                            if (editErrors.telefono) setEditErrors(prev => ({ ...prev, telefono: null }));
                          }}
                          className={`w-full p-2 bg-white border rounded-lg outline-none focus:border-[#031553] text-[#031553] ${
                            editErrors.telefono ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200'
                          }`}
                        />
                        {editErrors.telefono && <p className="text-[10px] text-rose-600 font-bold mt-1">{editErrors.telefono}</p>}
                      </div>

                      {/* ALUMNO EDICIÓN */}
                      {selectedUser.rol === 'ALUMNO' && (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-gray-400 font-bold mb-1">Grado</label>
                              <select
                                value={editFormData.grado}
                                onChange={(e) => setEditFormData({ ...editFormData, grado: e.target.value })}
                                className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#031553] text-[#031553]"
                              >
                                <option value="1">1ero</option>
                                <option value="2">2do</option>
                                <option value="3">3ero</option>
                                <option value="4">4to</option>
                                <option value="5">5to</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-gray-400 font-bold mb-1">Sección</label>
                              <select
                                value={editFormData.seccion}
                                onChange={(e) => setEditFormData({ ...editFormData, seccion: e.target.value })}
                                className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#031553] text-[#031553]"
                              >
                                <option value="A">A</option>
                                <option value="B">B</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-400 font-bold mb-1">Fecha Nacimiento</label>
                            <input
                              type="date"
                              value={editFormData.fechaNacimiento}
                              onChange={(e) => setEditFormData({ ...editFormData, fechaNacimiento: e.target.value })}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#031553] text-[#031553]"
                            />
                          </div>
                        </>
                      )}

                      {/* DOCENTE EDICIÓN */}
                      {selectedUser.rol === 'DOCENTE' && (
                        <>
                          <div>
                            <label className="block text-gray-400 font-bold mb-1">Especialidad</label>
                            <input
                              required
                              type="text"
                              value={editFormData.especialidad}
                              onChange={(e) => setEditFormData({ ...editFormData, especialidad: e.target.value })}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#031553] text-[#031553]"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 font-bold mb-1">Título</label>
                            <input
                              required
                              type="text"
                              value={editFormData.titulo}
                              onChange={(e) => setEditFormData({ ...editFormData, titulo: e.target.value })}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#031553] text-[#031553]"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    /* MODO SOLO LECTURA (VISTA) */
                    <div className="grid grid-cols-1 gap-2 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                      <div>
                        <span className="text-gray-400 block font-medium">Documento DNI:</span>
                        <span className="font-bold text-[#031553]">{selectedUser.dni}</span>
                      </div>
                      {selectedUser.rol !== 'ALUMNO' && (
                        <div>
                          <span className="text-gray-400 block font-medium">Correo Electrónico:</span>
                          <span className="font-bold text-[#031553]">{selectedUser.email}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-400 block font-medium">Teléfono / Celular:</span>
                        <span className="font-bold text-[#031553]">{selectedUser.telefono}</span>
                      </div>
                      {selectedUser.rol === 'ALUMNO' && (
                        <>
                          <div>
                            <span className="text-gray-400 block font-medium">Fecha de Nacimiento:</span>
                            <span className="font-bold text-[#031553]">{selectedUser.fechaNacimiento}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-medium">Grado y Sección:</span>
                            <span className="font-bold text-[#031553]">Grado {selectedUser.grado} - Sección {selectedUser.seccion}</span>
                          </div>
                        </>
                      )}
                      {selectedUser.rol === 'DOCENTE' && (
                        <>
                          <div>
                            <span className="text-gray-400 block font-medium">Especialidad:</span>
                            <span className="font-bold text-[#031553]">{selectedUser.especialidad}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-medium">Grado Académico:</span>
                            <span className="font-bold text-[#031553]">{selectedUser.titulo}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Hijos asociados en la Ficha del Padre */}
                {!isEditMode && selectedUser.rol === 'PADRE' && (
                  <div className="border-t pt-4 border-gray-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                      <Baby className="w-4 h-4 text-[#031553]" /> Hijos a su cargo en la Institución
                    </h4>
                    <div className="space-y-2">
                      {getHijosDePadre(selectedUser.codigoUsuario).length > 0 ? (
                        getHijosDePadre(selectedUser.codigoUsuario).map(h => (
                          <div key={h.codigo} className="bg-gray-50 border border-gray-100 p-2.5 rounded-xl flex justify-between items-center hover:bg-rose-50/20 transition-all group">
                            <div>
                              <span className="font-bold text-[#031553] block text-xs">{h.nombre}</span>
                              <span className="text-[9px] text-gray-400 font-mono font-bold block">{h.codigo}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDesvincular(h.idVinculacion)}
                              className="bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white p-2 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center opacity-70 group-hover:opacity-100 border border-rose-100"
                              title="Eliminar Vínculo Familiar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 italic text-[11px] bg-gray-50 p-3 rounded-xl border border-gray-100 animate-fade-in">
                          Este apoderado no tiene ningún estudiante asociado actualmente.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de Acción */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center gap-2">
                {isEditMode ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditMode(false)}
                      className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-1.5 bg-[#031553] hover:bg-[#020d36] text-white font-semibold text-xs px-5 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" /> {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={startEditMode}
                      className="flex items-center gap-1.5 bg-indigo-50 hover:bg-[#031553]/10 text-[#031553] font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer border border-[#031553]/5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#031553]" /> Editar Perfil
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="bg-[#031553] text-white font-semibold text-xs px-5 py-2 rounded-xl hover:bg-[#020d36] transition-all cursor-pointer"
                    >
                      Cerrar
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New User Modal */}
      {isNewUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateUser} className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
            <div className="bg-[#031553] text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-sm">Registrar Nuevo Perfil ({newRol.toLowerCase()})</h3>
              <button
                type="button"
                onClick={() => setIsNewUserOpen(false)}
                className="text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Nombres</label>
                <input
                  required
                  type="text"
                  value={formData.nombres}
                  onChange={(e) => {
                    setFormData({ ...formData, nombres: e.target.value });
                    if (createErrors.nombres) setCreateErrors(prev => ({ ...prev, nombres: null }));
                  }}
                  className={`w-full p-2.5 bg-gray-50 border rounded-xl focus:border-[#031553] outline-none text-[#031553] ${
                    createErrors.nombres ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200'
                  }`}
                />
                {createErrors.nombres && <p className="text-[10px] text-rose-600 font-bold mt-1">{createErrors.nombres}</p>}
              </div>
              <div>
                <label className="block text-gray-400 font-bold mb-1">Apellidos</label>
                <input
                  required
                  type="text"
                  value={formData.apellidos}
                  onChange={(e) => {
                    setFormData({ ...formData, apellidos: e.target.value });
                    if (createErrors.apellidos) setCreateErrors(prev => ({ ...prev, apellidos: null }));
                  }}
                  className={`w-full p-2.5 bg-gray-50 border rounded-xl focus:border-[#031553] outline-none text-[#031553] ${
                    createErrors.apellidos ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200'
                  }`}
                />
                {createErrors.apellidos && <p className="text-[10px] text-rose-600 font-bold mt-1">{createErrors.apellidos}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">DNI (8 dígitos)</label>
                  <input
                    required
                    type="text"
                    maxLength={8}
                    value={formData.dni}
                    onChange={(e) => {
                      setFormData({ ...formData, dni: e.target.value.replace(/\D/g, '') });
                      if (createErrors.dni) setCreateErrors(prev => ({ ...prev, dni: null }));
                    }}
                    className={`w-full p-2.5 bg-gray-50 border rounded-xl focus:border-[#031553] outline-none text-[#031553] ${
                      createErrors.dni ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200'
                    }`}
                  />
                  {createErrors.dni && <p className="text-[10px] text-rose-600 font-bold mt-1">{createErrors.dni}</p>}
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Celular / Teléfono</label>
                  <input
                    required
                    type="text"
                    maxLength={9}
                    value={formData.telefono}
                    onChange={(e) => {
                      setFormData({ ...formData, telefono: e.target.value.replace(/\D/g, '') });
                      if (createErrors.telefono) setCreateErrors(prev => ({ ...prev, telefono: null }));
                    }}
                    className={`w-full p-2.5 bg-gray-50 border rounded-xl focus:border-[#031553] outline-none text-[#031553] ${
                      createErrors.telefono ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200'
                    }`}
                  />
                  {createErrors.telefono && <p className="text-[10px] text-rose-600 font-bold mt-1">{createErrors.telefono}</p>}
                </div>
              </div>
              {newRol !== 'ALUMNO' && (
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Correo Electrónico</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (createErrors.email) setCreateErrors(prev => ({ ...prev, email: null }));
                    }}
                    className={`w-full p-2.5 bg-gray-50 border rounded-xl focus:border-[#031553] outline-none text-[#031553] ${
                      createErrors.email ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200'
                    }`}
                  />
                  {createErrors.email && <p className="text-[10px] text-rose-600 font-bold mt-1">{createErrors.email}</p>}
                </div>
              )}

              {/* Campos condicionales para ALUMNO */}
              {newRol === 'ALUMNO' && (
                <div className="space-y-4 border-t pt-4 border-gray-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-400 font-bold mb-1">Grado</label>
                      <select
                        value={formData.grado}
                        onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553]"
                      >
                        <option value="1">1ero de Primaria</option>
                        <option value="2">2do de Primaria</option>
                        <option value="3">3ero de Primaria</option>
                        <option value="4">4to de Primaria</option>
                        <option value="5">5to de Primaria</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 font-bold mb-1">Sección</label>
                      <select
                        value={formData.seccion}
                        onChange={(e) => setFormData({ ...formData, seccion: e.target.value })}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553]"
                      >
                        <option value="A">Sección A</option>
                        <option value="B">Sección B</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553]"
                    />
                  </div>
                </div>
              )}

              {/* Campos condicionales para DOCENTE */}
              {newRol === 'DOCENTE' && (
                <div className="space-y-4 border-t pt-4 border-gray-100">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Especialidad</label>
                    <input
                      required
                      type="text"
                      placeholder="Ej: Matemáticas, Ciencias, Lenguaje"
                      value={formData.especialidad}
                      onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Título Profesional</label>
                    <input
                      required
                      type="text"
                      placeholder="Ej: Licenciado en Educación"
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553]"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsNewUserOpen(false)}
                className="px-4 py-2 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#031553] text-white font-semibold px-5 py-2 rounded-xl shadow hover:bg-[#020d36] transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Ficha'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
