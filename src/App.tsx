/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Car, FileText, UserCheck, AlertCircle, HelpCircle, 
  MapPin, CheckCircle2, ChevronRight, Moon, Sun, ArrowLeft, 
  RotateCcw, Sparkles, Info, Users, ExternalLink, RefreshCcw
} from 'lucide-react';

import { VehicleRegistration, RegistrationStatus } from './types';
import { getRegistrations, saveRegistrations, INITIAL_REGISTRATIONS } from './data';
import CitizenForm from './components/CitizenForm';
import OfficerDashboard from './components/OfficerDashboard';
import ReceiptView from './components/ReceiptView';

export default function App() {
  const [registrations, setRegistrations] = useState<VehicleRegistration[]>([]);
  const [currentTab, setCurrentTab] = useState<'welcome' | 'citizen' | 'officer' | 'receipt'>('welcome');
  const [activeReceipt, setActiveReceipt] = useState<VehicleRegistration | null>(null);
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
    
    // Set as active receipt and redirect to receipt view
    setActiveReceipt(newReg);
    setCurrentTab('receipt');
    
    showNotification(`¡Declaración Folio ${newReg.id} enviada con éxito!`, 'success');
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
    showNotification(`Solicitud ${id.substring(14)} actualizada a ${status.toUpperCase()}`, 'success');
  };

  // Officer delete handler
  const handleDeleteRegistration = (id: string) => {
    const updated = registrations.filter(reg => reg.id !== id);
    setRegistrations(updated);
    saveRegistrations(updated);
    showNotification(`Registro ${id.substring(14)} eliminado con éxito`, 'info');
  };

  // Reset data handler
  const handleResetData = () => {
    if (confirm('¿Desea restaurar las declaraciones iniciales del sistema de simulación? Se perderán los registros creados durante esta sesión.')) {
      localStorage.setItem('aduanas_registrations', JSON.stringify(INITIAL_REGISTRATIONS));
      setRegistrations(INITIAL_REGISTRATIONS);
      setActiveReceipt(null);
      if (currentTab === 'receipt') {
        setCurrentTab('officer');
      }
      showNotification('Sistema de control restaurado a valores por defecto.', 'info');
    }
  };

  // Quick action: simulated registration generator (makes testing the system extremely fun!)
  const handleAddQuickMockRegistration = () => {
    const mockNames = ['Diego Andrés Soto Lagos', 'Valentina Paz Muñoz Jara', 'Gabriel Ignacio Rojas Silva', 'Camila Belén Henríquez Castro'];
    const mockRuts = ['19.284.102-4', '16.942.381-K', '21.034.928-1', '18.391.204-6'];
    const mockPlates = ['KKZZ-44', 'GGYY-90', 'JJPW-12', 'RRTT-67'];
    const mockVehicles: {brand: string, model: string, type: 'Automóvil' | 'Camioneta' | 'Station Wagon' | 'Motocicleta'}[] = [
      { brand: 'Hyundai', model: 'Tucson', type: 'Station Wagon' },
      { brand: 'Ford', model: 'Ranger', type: 'Camioneta' },
      { brand: 'Chevrolet', model: 'Sail', type: 'Automóvil' },
      { brand: 'Honda', model: 'CB500X', type: 'Motocicleta' }
    ];
    const mockDestinations = ['Mendoza Centro', 'Las Leñas, Malargüe', 'Buenos Aires', 'Viña del Mar a Mendoza'];

    const randomIndex = Math.floor(Math.random() * mockNames.length);
    const mockVehicle = mockVehicles[Math.floor(Math.random() * mockVehicles.length)];
    const randomYear = 2017 + Math.floor(Math.random() * 8);

    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const mockId = `ADU-CL-${year}-${randomNum}`;

    const newMock: VehicleRegistration = {
      id: mockId,
      createdAt: new Date().toISOString(),
      driverName: mockNames[randomIndex],
      driverRut: mockRuts[randomIndex],
      driverEmail: `${mockNames[randomIndex].toLowerCase().replace(/ /g, '.')}@gmail.com`,
      driverPhone: '+56 9 9' + Math.floor(10000000 + Math.random() * 90000000),
      driverAddress: 'Calle Prat 450, Valparaíso',
      isOwner: Math.random() > 0.3,
      ownerName: 'Automotriz Chile S.A.',
      ownerRut: '76.104.903-K',
      plate: mockPlates[randomIndex],
      vehicleType: mockVehicle.type,
      brand: mockVehicle.brand,
      model: mockVehicle.model,
      year: randomYear,
      chassisNumber: '9B3H5200M0' + Math.floor(1000000 + Math.random() * 9000000),
      motorNumber: 'ENG' + Math.floor(1000000 + Math.random() * 9000000),
      color: 'Gris Metalizado',
      insuranceCompany: 'HDI Seguros (SOAPEX)',
      insurancePolicyNumber: 'SPX-MOCK-' + Math.floor(100000 + Math.random() * 900000),
      departureDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      returnDate: new Date(Date.now() + 86400000 * 9).toISOString().split('T')[0],
      passengerCount: 1 + Math.floor(Math.random() * 4),
      destination: mockDestinations[Math.floor(Math.random() * mockDestinations.length)],
      status: 'pendiente'
    };

    const updated = [newMock, ...registrations];
    setRegistrations(updated);
    saveRegistrations(updated);
    showNotification(`Simulación: Solicitud Folio ${newMock.id} registrada`, 'info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/60 text-slate-800 flex flex-col font-sans transition-colors duration-200 relative overflow-x-hidden">
      
      {/* Background Frosted Glass Floating Decorative Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 no-print" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/5 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-15%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-slate-400/10 blur-[140px] animate-pulse" style={{ animationDuration: '15s' }} />
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
                : notification.type === 'error'
                ? 'bg-red-50/90 border-red-200/60 text-red-900'
                : 'bg-blue-50/90 border-blue-200/60 text-blue-900'
            }`}>
              <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${
                notification.type === 'success' ? 'text-emerald-600' : notification.type === 'error' ? 'text-red-600' : 'text-blue-600'
              }`} />
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider">Aviso del Sistema</p>
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
      <header className="glass-morphism-header sticky top-0 z-30 shadow-[0_4px_30px_rgba(0,0,0,0.02)] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          
          {/* Logo / Brand */}
          <div 
            onClick={() => setCurrentTab('welcome')} 
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#002F6C] to-blue-800 flex items-center justify-center text-white shadow-md">
              <Shield className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Aduanas Chile</span>
                <span className="text-[10px] bg-red-50/80 text-red-700 border border-red-200/50 rounded px-1 font-semibold uppercase">Paso Libertadores</span>
              </div>
              <h1 className="text-sm font-extrabold text-[#002F6C] uppercase leading-tight tracking-wide">
                Servicio Nacional de Aduanas
              </h1>
            </div>
          </div>

          {/* Navigation/Roles Tabs */}
          <nav className="flex gap-1 bg-slate-200/50 backdrop-blur-md p-1 rounded-xl border border-white/40">
            <button
              onClick={() => setCurrentTab('welcome')}
              id="tab-welcome"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTab === 'welcome' 
                  ? 'bg-white text-[#002F6C] shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => setCurrentTab('citizen')}
              id="tab-citizen"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTab === 'citizen' 
                  ? 'bg-white text-[#002F6C] shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              Portal Ciudadano
            </button>
            <button
              onClick={() => setCurrentTab('officer')}
              id="tab-officer"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                currentTab === 'officer' 
                  ? 'bg-white text-[#002F6C] shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              Portal Aduanero
              {registrations.filter(r => r.status === 'pendiente').length > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse inline-block" />
              )}
            </button>
          </nav>

        </div>
      </header>

      {/* Interactive Helper Ribbon for Demonstration/Testing */}
      <div className="bg-gradient-to-r from-blue-950/90 to-slate-900/95 text-white text-xs py-2 px-4 shadow-inner backdrop-blur-md no-print z-20 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
            <span>
              <strong>Guía de Prueba:</strong> Registre un vehículo en el <strong>Portal Ciudadano</strong>. Luego, cambie al <strong>Portal Aduanero</strong> para inspeccionarlo, aprobarlo o rechazarlo como funcionario público.
            </span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleAddQuickMockRegistration}
              id="btn-quick-simulation"
              className="px-2.5 py-0.5 bg-blue-800/80 hover:bg-blue-700/90 active:bg-blue-950/95 text-[10px] font-bold uppercase rounded-md transition-colors border border-blue-600/40 flex items-center gap-1 cursor-pointer"
            >
              <Users className="w-3 h-3" />
              Simular Registro Ciudadano (+1)
            </button>
            <button
              onClick={handleResetData}
              id="btn-quick-reset"
              className="px-2.5 py-0.5 bg-slate-800/80 hover:bg-slate-700/90 active:bg-slate-950/95 text-[10px] font-bold uppercase rounded-md transition-colors border border-slate-600/40 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Resetear
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          
          {/* WELCOME SCREEN */}
          {currentTab === 'welcome' && (
            <motion.div
              key="welcome-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="glass-morphism rounded-3xl border border-white/50 p-6 sm:p-10 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center shadow-xl shadow-blue-900/5">
                <div className="space-y-4 md:w-3/5 z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/50 border border-blue-200/40 text-[#002F6C] text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                    <MapPin className="w-3.5 h-3.5 text-red-600 animate-bounce" />
                    Paso Internacional Los Libertadores
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002F6C] tracking-tight">
                    Declaración Digital de Salida de Vehículos Particulares
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Bienvenido a la plataforma web unificada del Servicio Nacional de Aduanas. Este sistema permite agilizar el cruce fronterizo hacia la República de Argentina para automóviles y motocicletas con patente chilena. Registre su vehículo de forma online antes de presentarse en el complejo de Los Libertadores.
                  </p>
                  
                  {/* Stats snippet */}
                  <div className="flex gap-4 pt-2">
                    <div className="border-l-4 border-[#002F6C] pl-3">
                      <p className="text-xs text-slate-500 uppercase font-semibold">Convenio Fronterizo</p>
                      <p className="text-sm font-bold text-slate-800">Chile - Argentina</p>
                    </div>
                    <div className="border-l-4 border-red-600 pl-3">
                      <p className="text-xs text-slate-500 uppercase font-semibold">Revisión Oficial</p>
                      <p className="text-sm font-bold text-slate-800">Presencial & Online</p>
                    </div>
                  </div>
                </div>

                <div className="md:w-2/5 flex justify-center z-10 w-full">
                  <div className="glass-morphism-dark p-6 rounded-2xl border border-white/30 w-full max-w-sm space-y-4 relative shadow-sm">
                    <div className="absolute top-3 right-3 bg-red-100/80 text-[#D52B1E] p-1.5 rounded-full backdrop-blur-xs">
                      <Shield className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Requisitos para Viajar</h4>
                    <ul className="text-xs text-slate-600 space-y-2.5">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Cédula de Identidad o Pasaporte vigente.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Padrón del vehículo (Certificado de Inscripción).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Seguro SOAPEX Internacional</strong> obligatorio.</span>
                      </li>
                      <li className="flex items-start gap-2 text-amber-800">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>Autorización Notarial (si el conductor no es dueño).</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Portal Selector Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Citizen portal option */}
                <div 
                  onClick={() => setCurrentTab('citizen')}
                  className="glass-morphism rounded-2xl border border-white/55 hover:border-blue-400 p-6 shadow-md glass-card-hover cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50/50 text-[#002F6C] border border-blue-100/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Car className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-lg text-slate-800 group-hover:text-[#002F6C] transition-colors">
                        Portal Ciudadano: Registro de Viaje
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Inicie aquí el trámite en línea. Complete la declaración de salida del vehículo, verifique la cobertura SOAPEX obligatoria y obtenga su <strong>Formulario FADTV Digital</strong> para el cruce.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold uppercase tracking-wider pt-6 border-t border-white/40 mt-6">
                    Comenzar Trámite
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Customs inspector portal option */}
                <div 
                  onClick={() => setCurrentTab('officer')}
                  className="glass-morphism rounded-2xl border border-white/55 hover:border-slate-400 p-6 shadow-md glass-card-hover cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100/50 text-slate-700 border border-slate-200/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UserCheck className="w-7 h-7 text-[#002F6C]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-lg text-slate-800 group-hover:text-[#002F6C] transition-colors">
                        Portal de Revisión Aduanera
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Acceso para inspectores oficiales y personal del Complejo Los Libertadores. Permite buscar formularios por patente chilena o RUT, validar seguros internacionales y autorizar o denegar tránsitos.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#002F6C] font-bold uppercase tracking-wider pt-6 border-t border-white/40 mt-6">
                    Ingresar a Mesa de Control
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>

              {/* Informative footer box */}
              <div className="glass-morphism-dark p-5 rounded-2xl border border-white/20 text-xs text-slate-600 leading-relaxed flex gap-3 shadow-sm">
                <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-700 uppercase tracking-wide text-[10px] mb-1">Información de Frontera - Paso Los Libertadores</p>
                  El paso internacional opera de forma continuada de acuerdo al factor climático invernal/estival. Recuerde siempre verificar el estado climatológico de la ruta CH-60 (Chile) y Ruta Nacional 7 (Argentina) antes de emprender su viaje. Para consultas o reclamos presenciales, puede dirigirse a la Oficina de Informaciones, Reclamos y Sugerencias (OIRS) ubicada en el mismo complejo.
                </div>
              </div>

            </motion.div>
          )}

          {/* CITIZEN PORTAL */}
          {currentTab === 'citizen' && (
            <motion.div
              key="citizen-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center no-print">
                <button
                  onClick={() => setCurrentTab('welcome')}
                  id="btn-citizen-back-welcome"
                  className="flex items-center gap-1.5 text-slate-600 hover:text-[#002F6C] text-xs font-semibold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver al Inicio
                </button>
                <span className="text-xs text-slate-500 font-medium italic">Paso Los Libertadores</span>
              </div>

              <CitizenForm onRegisterSuccess={handleRegisterSuccess} />
            </motion.div>
          )}

          {/* OFFICER PORTAL */}
          {currentTab === 'officer' && (
            <motion.div
              key="officer-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center no-print">
                <button
                  onClick={() => setCurrentTab('welcome')}
                  id="btn-officer-back-welcome"
                  className="flex items-center gap-1.5 text-slate-600 hover:text-[#002F6C] text-xs font-semibold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver al Inicio
                </button>
                <div className="flex gap-2 text-xs">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-2 py-0.5 font-bold uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Mesa de Control Activa
                  </span>
                </div>
              </div>

              <OfficerDashboard 
                registrations={registrations} 
                onUpdateStatus={handleUpdateStatus}
                onDeleteRegistration={handleDeleteRegistration}
                onResetData={handleResetData}
              />
            </motion.div>
          )}

          {/* RECEIPT VIEW PORTAL */}
          {currentTab === 'receipt' && activeReceipt && (
            <motion.div
              key="receipt-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <ReceiptView 
                registration={activeReceipt} 
                onBack={() => {
                  // If we came from citizen, go back to welcome/citizen. Otherwise, go to officer
                  const wasCitizen = registrations.find(r => r.id === activeReceipt.id)?.status === 'pendiente';
                  setCurrentTab(wasCitizen ? 'citizen' : 'officer');
                }} 
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Institutional Footer */}
      <footer className="bg-[#002F6C] text-white mt-auto py-8 px-4 sm:px-6 lg:px-8 border-t border-blue-900 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Servicio Nacional de Aduanas - Gobierno de Chile
            </h4>
            <p className="text-[11px] text-slate-300 max-w-md">
              Sistema de control integrado del Paso Fronterizo Cristo Redentor - Los Libertadores. Optimizado para el control migratorio y aduanero bilateral.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center text-[11px] text-slate-300">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              Ruta CH-60, Los Andes, Región de Valparaíso
            </span>
            <span className="hidden sm:inline">|</span>
            <span>Teléfono OIRS: (34) 249 2000</span>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-blue-800 text-center text-[10px] text-slate-400">
          © {new Date().getFullYear()} Servicio Nacional de Aduanas. Todos los derechos reservados. Acuerdo Bilateral de Cooperación de Transporte Terrestre.
        </div>
      </footer>

    </div>
  );
}
