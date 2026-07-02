'use client';

import React, { useState } from 'react';
import { CreditCard, DollarSign, Download, CheckCircle, Clock, Calendar, AlertCircle, ShoppingBag, Receipt, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { mockBillingData } from './data';

export default function BillingPage() {
  const [invoices, setInvoices] = useState(mockBillingData.invoices);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('visa'); // visa, mastercard, yape
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Calculate calculations based on local state
  const pendingInvoices = invoices.filter((i) => i.status === 'pendiente');
  const paidInvoices = invoices.filter((i) => i.status === 'pagado');
  
  const totalPaid = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPending = pendingInvoices.reduce((sum, i) => sum + i.amount, 0);
  
  const nextDueInvoice = pendingInvoices.length > 0 
    ? pendingInvoices.reduce((earliest, current) => {
        return new Date(current.dueDate) < new Date(earliest.dueDate) ? current : earliest;
      })
    : null;

  const handleOpenPaymentModal = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleClosePaymentModal = () => {
    setSelectedInvoice(null);
  };

  const handleProcessPayment = () => {
    if (!selectedInvoice) return;

    // Simulate payment processing and update status in state
    setInvoices((prev) => 
      prev.map((inv) => {
        if (inv.id === selectedInvoice.id) {
          const methodLabel = paymentMethod === 'visa' 
            ? 'Tarjeta Visa' 
            : paymentMethod === 'mastercard' 
            ? 'Tarjeta Mastercard' 
            : 'Yape';
          return {
            ...inv,
            status: 'pagado',
            paymentDate: 'Hoy (Simulación)',
            paymentMethod: methodLabel,
            transactionId: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`
          };
        }
        return inv;
      })
    );

    setSelectedInvoice(null);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  return (
    <div className="w-full animate-fade-in pb-12 space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-3 text-left">
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-primary flex items-center gap-2 select-none">
            <CreditCard className="w-4 h-4" /> Pagos y Pensiones
          </h3>
          <p className="text-[10px] text-gray-400 font-extrabold uppercase">
            Estado de cuenta y comprobantes electrónicos
          </p>
        </div>
      </div>

      {/* Success toast notification */}
      {showSuccessToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#031553] text-white border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-3 animate-fade-in max-w-sm text-left">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h5 className="font-bold text-xs">¡Pago Procesado Exitosamente!</h5>
            <p className="text-[10px] text-white/80 mt-0.5">El comprobante ha sido generado e incluido en tu historial de pagos.</p>
          </div>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Status card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4 text-left">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${totalPending > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {totalPending > 0 ? <Clock className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Estado Financiero</p>
            <h4 className={`text-sm font-extrabold mt-1.5 leading-none ${totalPending > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {totalPending > 0 ? `Deuda Pendiente: S/. ${totalPending.toFixed(2)}` : 'Al día con tus pagos'}
            </h4>
          </div>
        </div>

        {/* Total paid card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#031553]">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Total Pagado del Año</p>
            <h4 className="text-sm font-extrabold text-[#031553] mt-1.5 leading-none">
              S/. {totalPaid.toFixed(2)}
            </h4>
          </div>
        </div>

        {/* Next payment card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Próximo Vencimiento</p>
            <h4 className="text-sm font-extrabold text-primary mt-1.5 leading-none">
              {nextDueInvoice ? nextDueInvoice.dueDate : 'No hay vencimientos'}
            </h4>
          </div>
        </div>

      </div>

      {/* Main Billing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Pending payments */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <div className="border-b border-gray-50 pb-3">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Pensiones y Conceptos Pendientes
              </span>
            </div>
            
            <div className="space-y-3">
              {pendingInvoices.length > 0 ? (
                pendingInvoices.map((inv) => (
                  <div 
                    key={inv.id}
                    className="border border-gray-100 hover:border-gray-250 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:shadow-sm transition-all duration-200"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full uppercase">
                        Pendiente
                      </span>
                      <h4 className="font-bold text-xs text-primary pt-1 leading-snug">{inv.concept}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold flex items-center gap-1.5 leading-none">
                        <Clock className="w-3 h-3 shrink-0 text-gray-300" /> Vence el: {inv.dueDate}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0">
                      <span className="font-extrabold text-sm text-primary">S/. {inv.amount.toFixed(2)}</span>
                      <button 
                        onClick={() => handleOpenPaymentModal(inv)}
                        className="bg-[#031553] text-white hover:bg-[#031553]/90 text-[10px] font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-sm select-none"
                      >
                        Pagar Online <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-48 border border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 text-center gap-2 p-6">
                  <CheckCircle className="w-8 h-8 text-emerald-500 fill-emerald-50" />
                  <div>
                    <h5 className="font-bold text-xs text-primary">¡Estás al día!</h5>
                    <p className="text-[10px] text-gray-400 mt-0.5">No registras pensiones ni cargos pendientes en el sistema.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Paid invoices history */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <div className="border-b border-gray-50 pb-3">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Historial de Pagos Realizados
              </span>
            </div>

            <div className="space-y-3">
              {paidInvoices.length > 0 ? (
                paidInvoices.map((inv) => (
                  <div 
                    key={inv.id}
                    className="border border-gray-50 bg-gray-50/10 hover:bg-gray-50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase leading-none">
                          Pagado
                        </span>
                        <span className="text-[8px] font-semibold text-gray-400 tracking-wide uppercase">
                          {inv.id}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-primary pt-1 leading-snug">{inv.concept}</h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-gray-400 font-semibold leading-none pt-0.5">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-500" /> Pago: {inv.paymentDate}
                        </span>
                        <span>•</span>
                        <span>Método: {inv.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0">
                      <span className="font-extrabold text-sm text-[#031553]">S/. {inv.amount.toFixed(2)}</span>
                      <button className="p-1.5 bg-white border border-gray-100 hover:bg-gray-100 hover:shadow-sm rounded-xl text-primary flex items-center justify-center cursor-pointer transition-all">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-48 border border-dashed border-gray-200 rounded-3xl flex items-center justify-center text-gray-400 text-xs">
                  No hay historial de pagos registrados.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Payment simulation modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-[#031553]/40 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-gray-100 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-5 text-left">
            
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <h4 className="font-bold text-sm text-primary flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#031553]" /> Confirmar Pago
              </h4>
              <button 
                onClick={handleClosePaymentModal}
                className="p-1.5 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-primary transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Invoice summary */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-semibold">Concepto:</span>
                <span className="font-bold text-primary text-right max-w-[250px] truncate">{selectedInvoice.concept}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-semibold">Fecha Vencimiento:</span>
                <span className="font-bold text-primary">{selectedInvoice.dueDate}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200/50 pt-2 text-sm">
                <span className="text-primary font-bold">Total a Pagar:</span>
                <span className="font-extrabold text-[#031553]">S/. {selectedInvoice.amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment method selector */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                Selecciona Método de Pago (Simulación)
              </span>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'visa', label: 'Visa', logo: '💳' },
                  { id: 'mastercard', label: 'Mastercard', logo: '💳' },
                  { id: 'yape', label: 'Yape', logo: '📱' }
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`border p-3 rounded-2xl cursor-pointer text-center space-y-1 select-none transition-all ${
                      paymentMethod === m.id
                        ? 'border-[#031553] bg-[#031553]/5 text-[#031553] shadow-sm font-bold scale-[1.02]'
                        : 'border-gray-150 bg-white hover:border-gray-300 text-gray-500'
                    }`}
                  >
                    <span className="text-base block">{m.logo}</span>
                    <span className="text-[10px] font-bold block">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alert info */}
            <div className="flex gap-2 items-start bg-amber-50 border border-amber-100 rounded-xl p-3 text-[10px] text-amber-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
              <p className="leading-snug">
                Esta es una <strong>simulación de pasarela de pago escolar</strong>. No se realizarán cargos reales a ninguna tarjeta o cuenta financiera.
              </p>
            </div>

            {/* Modal actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleClosePaymentModal}
                className="flex-1 bg-gray-50 hover:bg-gray-100 text-primary border border-gray-100 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer select-none text-center"
              >
                Cancelar
              </button>
              <button
                onClick={handleProcessPayment}
                className="flex-1 bg-[#031553] hover:bg-[#031553]/90 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-colors cursor-pointer select-none text-center"
              >
                Pagar S/. {selectedInvoice.amount.toFixed(2)}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
