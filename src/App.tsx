/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Car, FileText, CheckCircle2, MapPin, 
  RotateCcw, Sparkles, Info, Users, Search, AlertTriangle, Eye, HelpCircle
} from 'lucide-react';

import { VehicleRegistration, RegistrationStatus } from './types';
import { getRegistrations, saveRegistrations, INITIAL_REGISTRATIONS } from './data';
import CitizenForm from './components/CitizenForm';
import OfficerDashboard from './components/OfficerDashboard';
import StatusInquiry from './components/StatusInquiry';

export default function App() {
  const [registrations, setRegistrations] = useState<VehicleRegistration[]>([]);
  const [currentTab, setCurrentTab] = useState<'citizen' | 'officer' | 'status'>('citizen');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Initialize data on mount
  useEffect(() => {
    setRegistrations(getRegistrations());
  }, []);

  // Show auto-dismiss notifications
  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Citizen registration handler
  const handleRegisterSuccess = (newReg: VehicleRegistration) => {
    const updated = [newReg, ...registrations];
    setRegistrations(updated);
    saveRegistrations(updated);
    showNotification(`¡Pre-Declaración Folio ${newReg.id} registrada con éxito!`, 'success');
  };

  // Officer status update handler
  const handleUpdateStatus = (
    id: string, 
    status: RegistrationStatus, 
    comments: string, 
    reviewerName: string
  ) => {
    const updated = registrations.map(reg => {
      if (reg.id === id) {
        return {
          ...reg,
          status,
          officerComments: comments,
          reviewedBy: reviewerName,
          reviewedAt: new Date().toISOString()
        };
      }
      return reg;
    });

    setRegistrations(updated);
    saveRegistrations(updated);
    showNotification(`Solicitud de patente actualizada a ${status.toUpperCase()}`, 'success');
  };

  // Reset data handler
  const handleResetData = () => {
    if (confirm('¿Desea restaurar las declaraciones iniciales del sistema de simulación? Se perderán los registros creados durante esta sesión.')) {
      localStorage.setItem('aduanas_registrations', JSON.stringify(INITIAL_REGISTRATIONS));
      setRegistrations(INITIAL_REGISTRATIONS);
      showNotification('Sistema de control restaurado a valores por defecto.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/60 text-slate-800 flex flex-col font-sans transition-colors duration-200 relative overflow-x-hidden">
      
      {/* Background Frosted Glass Floating Decorative Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 no-print" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-slate-400/10 blur-[140px]" />
        <div className="absolute top-[35%] right-[25%] w-[30vw] h-[30vw] rounded-full bg-red-500/3 blur-[100px]" />
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4 no-print"
          >
            <div className={`p-4 rounded-xl shadow-xl border backdrop-blur-md flex gap-3 items-start ${
              notification.type === 'success' 
                ? 'bg-emerald-50/90 border-emerald-200/60 text-emerald-900' 
                : 'bg-blue-50/90 border-blue-200/60 text-blue-900'
            }`}>
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider">Aviso de Aduanas</p>
                <p className="text-xs mt-0.5 leading-relaxed">{notification.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flag Colored Institutional Accent Stripe (Chilean Colors) */}
      <div className="h-1.5 w-full flex no-print z-30 relative">
        <div className="w-1/3 bg-[#002F6C]" /> {/* Blue */}
        <div className="w-1/3 bg-white" />     {/* White */}
        <div className="w-1/3 bg-[#D52B1E]" /> {/* Red */}
      </div>

      {/* Main Header */}
      <header className="glass-morphism-header sticky top-0 z-30 shadow-[0_4px_30px_rgba(0,0,0,0.02)] no-print bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 select-none w-full md:w-auto justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#002F6C] to-blue-800 flex items-center justify-center text-white shadow-md shrink-0">
              <Shield className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center gap-1.5 justify-center md:justify-start">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aduanas de Chile</span>
                <span className="text-[9px] bg-red-50 text-red-700 border border-red-200/50 rounded px-1.5 font-bold uppercase">Los Libertadores</span>
              </div>
              <h1 className="text-xs font-black text-[#002F6C] uppercase leading-tight tracking-wide">
                Sistema de Tramitación Vehicular Digital
              </h1>
            </div>
          </div>

          {/* Navigation/Roles Tabs with 3 selectable tabs */}
          <nav className="flex flex-wrap justify-center gap-1 bg-slate-200/60 p-1.5 rounded-2xl border border-slate-300/30 w-full md:w-auto shadow-inner">
            {/* Tab 1: Registro Viajero */}
            <button
              onClick={() => setCurrentTab('citizen')}
              id="tab-citizen"
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'citizen' 
                  ? 'bg-[#002F6C] text-white shadow-md shadow-blue-900/10' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <Car className="w-4 h-4" />
              Registro Viajero
            </button>

            {/* Tab 2: Verificación Aduana */}
            <button
              onClick={() => setCurrentTab('officer')}
              id="tab-officer"
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'officer' 
                  ? 'bg-[#002F6C] text-white shadow-md shadow-blue-900/10' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <Search className="w-4 h-4" />
              Verificación Aduana
            </button>

            {/* Tab 3: Consulta de Estado */}
            <button
              onClick={() => setCurrentTab('status')}
              id="tab-status"
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'status' 
                  ? 'bg-[#002F6C] text-white shadow-md shadow-blue-900/10' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Consulta de Estado
            </button>
          </nav>

        </div>
      </header>

      {/* Guide Helper Stripe */}
      <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white text-[11px] py-2 px-4 shadow-inner no-print z-20 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="flex items-center gap-1.5 text-center sm:text-left leading-relaxed">
            <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
            <span>
              <strong>Guía de Simulación:</strong> Pruebe el registro, busque <strong>AA-BB-11</strong> o <strong>XX-YY-99</strong> en Verificación, o verifique vigencias con <strong>CH-12-34</strong> en Consulta de Estado.
            </span>
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: REGISTER PORTAL */}
          {currentTab === 'citizen' && (
            <motion.div
              key="citizen-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <CitizenForm onRegisterSuccess={handleRegisterSuccess} />
            </motion.div>
          )}

          {/* TAB 2: VERIFICATION PORTAL */}
          {currentTab === 'officer' && (
            <motion.div
              key="officer-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <OfficerDashboard 
                registrations={registrations} 
                onUpdateStatus={handleUpdateStatus}
                onResetData={handleResetData}
              />
            </motion.div>
          )}

          {/* TAB 3: STATUS INQUIRY PORTAL */}
          {currentTab === 'status' && (
            <motion.div
              key="status-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <StatusInquiry registrations={registrations} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Institutional Footer */}
      <footer className="bg-[#002F6C] text-white mt-auto py-8 px-4 sm:px-6 lg:px-8 border-t border-blue-900 no-print z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Servicio Nacional de Aduanas - Gobierno de Chile
            </h4>
            <p className="text-[11px] text-slate-300 max-w-md">
              Sistema unificado de control de salida temporal para el Complejo Fronterizo Cristo Redentor - Los Libertadores.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center text-[11px] text-slate-300">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              Paso Los Libertadores, Región de Valparaíso
            </span>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-blue-800 text-center text-[10px] text-slate-400">
          © {new Date().getFullYear()} Servicio Nacional de Aduanas. Todos los derechos reservados.
        </div>
      </footer>

    </div>
  );
}
