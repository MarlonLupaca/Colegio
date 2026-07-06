'use client';

import React, { useState, useEffect,useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DoorOpen, Plus, ArrowLeft } from 'lucide-react';

import { apiFetch } from '@/config/api';
import ClassroomFilters from './components/ClassroomFilters';
import ClassroomTable from './components/ClassroomTable';
import ClassroomMobileList from './components/ClassroomMobileList';
import ClassroomModal from './components/ClassroomModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import ToastNotification from './components/ToastNotification';

const CLASSROOMS_ENDPOINT='/api/v1/classrooms';

export default function AdminClassroomsPage() {
  const router = useRouter();

  const [classrooms, setClassrooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // ── Toast ──
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchClassrooms = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await apiFetch(CLASSROOMS_ENDPOINT);
      setClassrooms(data);
    } catch (err) {
      setLoadError(err.message);
      showToast('Error al cargar las aulas', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);


  // ── Filters ──
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [buildingFilter, setBuildingFilter] = useState('todos');

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('todos');
    setTypeFilter('todos');
    setBuildingFilter('todos');
    showToast('Filtros reiniciados', 'info');
  }, [showToast]);

  const filteredClassrooms = classrooms.filter((c) => {
    const matchSearch = 
      c.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'todos' || c.status === statusFilter;
    const matchType = typeFilter === 'todos' || c.type === typeFilter;
    const matchBuilding = buildingFilter === 'todos' || c.building === buildingFilter;
    return matchSearch && matchStatus && matchType && matchBuilding;
  });

  // ── Form modal ──
  const [formModal, setFormModal] = useState({ isOpen: false, type: 'create', classroom: null });

  const openCreate = () => setFormModal({ isOpen: true, type: 'create', classroom: null });
  const openEdit = (classroom) => setFormModal({ isOpen: true, type: 'edit', classroom });
  const closeForm = () => setFormModal((prev) => ({ ...prev, isOpen: false }));

  const handleFormSubmit = async (formData) => {
  const payload = {
    building: formData.building,
    roomNumber: formData.roomNumber,
    maxCapacity: parseInt(formData.maxCapacity),
    status: formData.status,
    type: formData.type,
  };

  try {
    if (formModal.type === 'create') {
      const created = await apiFetch(CLASSROOMS_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setClassrooms((prev) => [created, ...prev]);
      showToast(`Aula "${created.roomNumber}" creada con éxito`);
    } else {
      const id = formModal.classroom.id;
      const updated = await apiFetch(`${CLASSROOMS_ENDPOINT}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      setClassrooms((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
      showToast(`Aula "${updated.roomNumber}" actualizada correctamente`);
    }
    closeForm();
  } catch (err) {
    const action = formModal.type === 'create' ? 'crear' : 'actualizar';
    showToast(err.message || `Error al ${action} el aula`, 'error');
    // No cerramos el modal si falló
  }
};

  // ── Delete modal ──
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, classroom: null });

  const openDelete = (classroom) => setDeleteModal({ isOpen: true, classroom });
  const closeDelete = () => setDeleteModal({ isOpen: false, classroom: null });

  const handleConfirmDelete = async () => {
  const { classroom } = deleteModal;
  try {
    // Ahora sí es un DELETE real: el aula desaparece de la BD
    await apiFetch(`${CLASSROOMS_ENDPOINT}/${classroom.id}`, {
      method: 'DELETE',
    });

    setClassrooms((prev) => prev.filter((c) => c.id !== classroom.id));
    showToast(`Aula "${classroom.roomNumber}" eliminada correctamente`);
    closeDelete();
  } catch (err) {
    showToast(err.message || 'Error al eliminar el aula', 'error');
    // modal abierto para que el usuario reintente
  }
};

  return (
    <div className="w-full pb-12 space-y-6 animate-fade-in relative">
      <ToastNotification toast={toast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="space-y-1.5 text-left">
          <button
            onClick={() => router.push('/portal/admin')}
            className="flex items-center gap-1.5 text-[10px] font-bold text-secondary hover:text-primary transition-colors cursor-pointer select-none"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Volver a Inicio</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/5 rounded-xl text-primary">
              <DoorOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary tracking-tight">Gestión de Aulas</h2>
              <p className="text-xs text-secondary mt-0.5">Administra las aulas físicas del colegio, capacidades y estados.</p>
            </div>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all hover:scale-[1.02] cursor-pointer select-none shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Aula</span>
        </button>
      </div>

      {/* Filters */}
      <ClassroomFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        buildingFilter={buildingFilter}
        setBuildingFilter={setBuildingFilter}
        resetFilters={resetFilters}
      />

      {/* Classroom list */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {filteredClassrooms.length > 0 ? (
          <>
            <ClassroomTable
              classrooms={filteredClassrooms}
              onEdit={openEdit}
              onDelete={openDelete}
            />
            <ClassroomMobileList
              classrooms={filteredClassrooms}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          </>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="p-4 bg-gray-50 rounded-full text-secondary/40">
              <DoorOpen className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-primary text-sm">No se encontraron aulas</h4>
            <p className="text-xs text-secondary max-w-xs">
              Intenta cambiar los filtros o agrega una nueva aula para comenzar.
            </p>
            <button onClick={resetFilters} className="text-xs font-bold text-primary hover:underline">
              Restablecer Filtros
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <ClassroomModal
        key={`${formModal.type}-${formModal.classroom?.id ?? 'new'}`}
        isOpen={formModal.isOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        formType={formModal.type}
        currentClassroom={formModal.classroom}
        classrooms={classrooms}
      />
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDelete}
        onConfirm={handleConfirmDelete}
        classroom={deleteModal.classroom}
      />
    </div>
  );
}