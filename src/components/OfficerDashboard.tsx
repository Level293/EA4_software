/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VehicleRegistration, RegistrationStatus } from '../types';
import { 
  Search, Shield, AlertTriangle, CheckCircle2, Car, User, 
  FileText, RotateCcw, AlertCircle, Check, X, Lock, Eye, EyeOff
} from 'lucide-react';

interface OfficerDashboardProps {
  registrations: VehicleRegistration[];
  onUpdateStatus: (id: string, status: RegistrationStatus, comments: string, reviewerName: string) => void;
  onResetData: () => void;
}

export default function OfficerDashboard({ 
  registrations, 
  onUpdateStatus, 
  onResetData 
}: OfficerDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReg, setSelectedReg] = useState<VehicleRegistration | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  
  // Simulation Role: 'funcionario' (Aduana officer) or 'viajero' (Traveler)
  const [simulationRole, setSimulationRole] = useState<'funcionario' | 'viajero'>('funcionario');

  // Clean / normalize string for lookup (removes spaces, hyphens, case-insensitive)
  const normalizePlate = (str: string) => {
    return str.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  };

  // Perform search in real-time or when query changes
  useEffect(() => {
    const cleanQuery = normalizePlate(searchQuery);

    if (cleanQuery === '') {
      setSelectedReg(null);
      setWarningMessage(null);
      return;
    }

    // Rule 2: If plate is "XX-YY-99", display yellow alert
    if (cleanQuery === 'XXYY99') {
      setSelectedReg(null);
      setWarningMessage('Vehículo sin pre-declaración. Requiere digitación manual');
      return;
    }

    // Rule 1: If plate is "AA-BB-11", look up in registrations or mock immediately
    const found = registrations.find(r => normalizePlate(r.plate) === cleanQuery);

    if (found) {
      setSelectedReg(found);
      setWarningMessage(null);
    } else {
      setSelectedReg(null);
      if (cleanQuery.length >= 5) {
        setWarningMessage('No se encontraron registros activos para la patente ingresada.');
      } else {
        setWarningMessage(null);
      }
    }
  }, [searchQuery, registrations]);

  const handleQuickSearch = (plate: string) => {
    setSearchQuery(plate);
  };

  // Status helper badge
  const renderStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'aprobado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Autorizado
          </span>
        );
      case 'rechazado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 border border-red-100 rounded-lg text-xs font-bold uppercase tracking-wider">
            <X className="w-3.5 h-3.5" />
            Rechazado
          </span>
        );
      case 'observado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            Observado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
            Pre-Declarado
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto relative">
      
      {/* SIMULATION CONTROLLERS BAR */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-800 shadow-lg">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black tracking-wider text-blue-400 uppercase">Panel de Simulación de Aduanas</span>
          <p className="text-xs text-slate-300">
            Pruebe el bloqueo de permisos alternando el rol del usuario actual.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
          {/* Role Toggle Switch */}
          <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 w-full sm:w-auto justify-between">
            <button
              onClick={() => setSimulationRole('funcionario')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                simulationRole === 'funcionario'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Inspector (Funcionario)
            </button>
            <button
              onClick={() => setSimulationRole('viajero')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                simulationRole === 'viajero'
                  ? 'bg-red-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Viajero (Bloqueado)
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* CASE 1: ROLE IS VIAJERO -> BLOCKED VIEW */}
        {simulationRole === 'viajero' ? (
          <motion.div
            key="blocked-role-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="border border-red-200 bg-red-50/90 backdrop-blur-md rounded-2xl p-8 text-center space-y-6 shadow-xl max-w-lg mx-auto"
          >
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto border-2 border-red-200">
              <Lock className="w-8 h-8 stroke-[2.2]" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-md font-extrabold text-[#002F6C] uppercase tracking-wide">
                Mesa de Control Fronterizo
              </h3>
              <p className="text-sm font-extrabold text-red-700 leading-snug">
                Error de permisos: Acceso exclusivo para inspectores del Servicio Nacional de Aduanas
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Su rol actual de simulación está configurado como <strong className="text-red-600">Viajero</strong>. Los viajeros tienen prohibido el acceso a la mesa de fiscalización para resguardar la seguridad nacional de los registros de aduana.
              </p>
            </div>

            <div className="bg-white border border-red-100 p-3 rounded-xl max-w-xs mx-auto shadow-xs text-[11px]">
              <p className="font-bold text-slate-700">¿Cómo probar la aplicación?</p>
              <p className="text-slate-500 mt-0.5">Use el selector de arriba o el botón de abajo para cambiar su rol a <strong>Inspector (Funcionario)</strong> y visualizar el buscador de patentes.</p>
            </div>

            <div>
              <button
                onClick={() => setSimulationRole('funcionario')}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm inline-flex items-center gap-1.5"
              >
                <Shield className="w-4 h-4" />
                Cambiar a Rol Funcionario (Desbloquear)
              </button>
            </div>
          </motion.div>
        ) : (
          /* CASE 2: ROLE IS FUNCIONARIO -> FULL OFFICER ACCESS */
          <motion.div
            key="authorized-officer-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header / Title block */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#002F6C] flex items-center gap-2">
                  <Shield className="w-5.5 h-5.5 text-[#002F6C]" />
                  Mesa de Fiscalización Aduanera
                </h2>
                <p className="text-xs text-slate-500">
                  Control migratorio y verificación en tiempo real para el Paso Los Libertadores.
                </p>
              </div>
              
              {/* Quick Simulation Options */}
              <button
                onClick={onResetData}
                id="btn-officer-reset-db"
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restaurar Datos
              </button>
            </div>

            {/* SEARCH AND VERIFICATION PANEL */}
            <div className="glass-morphism rounded-2xl border border-white/50 p-6 shadow-xl space-y-6 bg-white">
              <div className="space-y-2">
                <label htmlFor="inspector-search" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Buscador por Patente del Vehículo
                </label>
                <p className="text-xs text-slate-500">
                  Ingrese la patente chilena para verificar si cuenta con una pre-declaración aduanera válida.
                </p>
                
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="inspector-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ej: AA-BB-11 o XX-YY-99..."
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 text-xs font-mono font-bold rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#002F6C] focus:border-transparent transition-all uppercase placeholder:font-sans placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Quick Shortcuts Helper */}
              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-200/50 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="font-bold text-slate-500 text-[10px] uppercase">Patentes de Control:</span>
                <button
                  onClick={() => handleQuickSearch('AA-BB-11')}
                  id="btn-shortcut-aabb11"
                  className="px-2.5 py-1 bg-[#002F6C]/10 text-[#002F6C] hover:bg-[#002F6C]/20 rounded-lg font-bold transition-all cursor-pointer font-mono text-[10px]"
                >
                  AA-BB-11 (Pre-Declarado)
                </button>
                <button
                  onClick={() => handleQuickSearch('XX-YY-99')}
                  id="btn-shortcut-xxyy99"
                  className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg font-bold transition-all cursor-pointer border border-amber-200/50 font-mono text-[10px]"
                >
                  XX-YY-99 (Sin Declaración)
                </button>
              </div>

              {/* RESULTS INTERACTIVE CONTAINER */}
              <AnimatePresence mode="wait">
                
                {/* Case A: Vehicle Found (e.g. AA-BB-11 or any active registration) */}
                {selectedReg && (
                  <motion.div
                    key="found-plate"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="border border-emerald-100/60 bg-emerald-50/10 rounded-xl overflow-hidden shadow-sm"
                  >
                    {/* Header card found */}
                    <div className="bg-emerald-600/10 border-b border-emerald-100 px-4 py-3 flex justify-between items-center flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                          Pre-Declaración Encontrada y Validada
                        </span>
                      </div>
                      <div>
                        {renderStatusBadge(selectedReg.status)}
                      </div>
                    </div>

                    {/* Data Grid */}
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                      
                      {/* Conductor Card */}
                      <div className="space-y-2 bg-white/50 backdrop-blur-xs p-4 rounded-xl border border-slate-100">
                        <h4 className="font-extrabold text-[#002F6C] uppercase tracking-wide text-[10px] flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          DATOS DEL CONDUCTOR
                        </h4>
                        <div className="space-y-1 text-slate-600">
                          <p><strong>Nombre Conductor:</strong> {selectedReg.driverName}</p>
                          <p><strong>RUT Conductor:</strong> {selectedReg.driverRut}</p>
                          <p><strong>Email:</strong> {selectedReg.driverEmail || 'No especificado'}</p>
                          <p><strong>Dirección:</strong> {selectedReg.driverAddress || 'No especificada'}</p>
                        </div>
                      </div>

                      {/* Vehículo Card */}
                      <div className="space-y-2 bg-white/50 backdrop-blur-xs p-4 rounded-xl border border-slate-100">
                        <h4 className="font-extrabold text-[#002F6C] uppercase tracking-wide text-[10px] flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                          <Car className="w-3.5 h-3.5 text-slate-500" />
                          DATOS DEL VEHÍCULO
                        </h4>
                        <div className="space-y-1 text-slate-600">
                          <p>
                            <strong>Patente:</strong>{' '}
                            <span className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded font-bold text-slate-900 shadow-2xs">
                              {selectedReg.plate}
                            </span>
                          </p>
                          <p><strong>Categoría:</strong> {selectedReg.vehicleType}</p>
                          <p><strong>Marca / Modelo:</strong> {selectedReg.brand} {selectedReg.model}</p>
                          <p><strong>Año Fabricación:</strong> {selectedReg.year}</p>
                        </div>
                      </div>

                      {/* Technical / Insurance Block */}
                      <div className="md:col-span-2 bg-[#002F6C]/5 p-4 rounded-xl border border-[#002F6C]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Vigencia del Permiso</span>
                          <p className="text-xs font-extrabold text-[#002F6C] mt-0.5">
                            {selectedReg.vehicleType === 'Particular' || selectedReg.vehicleType === 'Automóvil' || selectedReg.vehicleType === 'Station Wagon' || selectedReg.vehicleType === 'Camioneta'
                              ? '180 días de vigencia'
                              : '90 días de vigencia (Diplomático Especial)'}
                          </p>
                        </div>

                        {/* Actions for Inspector */}
                        <div className="flex gap-2 w-full sm:w-auto">
                          {selectedReg.status === 'pendiente' ? (
                            <>
                              <button
                                onClick={() => onUpdateStatus(selectedReg.id, 'aprobado', 'Autorizado para cruce', 'Inspector Carlos Valdés')}
                                className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer shadow-sm flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Autorizar
                              </button>
                              <button
                                onClick={() => onUpdateStatus(selectedReg.id, 'rechazado', 'Rechazado en inspección física', 'Inspector Carlos Valdés')}
                                className="flex-1 sm:flex-none px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer shadow-sm flex items-center gap-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                Rechazar
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-500 text-xs italic">
                              Fiscalizado por: {selectedReg.reviewedBy || 'Inspector Carlos Valdés'}
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* Case B: XX-YY-99 yellow alert or general warnings */}
                {warningMessage && !selectedReg && (
                  <motion.div
                    key="warning-plate"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-5 rounded-xl border flex gap-3.5 text-xs items-start ${
                      warningMessage.includes('digitación manual')
                        ? 'bg-amber-50 border-amber-200 text-amber-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {warningMessage.includes('digitación manual') ? (
                      <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-slate-500 shrink-0 mt-0.5" />
                    )}
                    
                    <div className="flex-1 space-y-1">
                      <p className="font-extrabold uppercase tracking-wider text-[10px] text-slate-800">
                        {warningMessage.includes('digitación manual') ? 'Alerta de Control Fronterizo' : 'Información de Búsqueda'}
                      </p>
                      <p className="font-bold text-xs leading-snug">
                        {warningMessage}
                      </p>
                      {warningMessage.includes('digitación manual') && (
                        <div className="pt-2 flex gap-2">
                          <button
                            onClick={() => {
                              const quickAdd: VehicleRegistration = {
                                id: 'ADU-CL-2026-99999',
                                createdAt: new Date().toISOString(),
                                driverName: 'Conductor Registrado en Ventanilla',
                                driverRut: '20.124.938-K',
                                driverEmail: 'ventanilla@aduanas.cl',
                                driverPhone: '+56 9 9999 9999',
                                driverAddress: 'Frontera Los Andes, Chile',
                                isOwner: true,
                                plate: 'XX-YY-99',
                                vehicleType: 'Particular',
                                brand: 'Nissan',
                                model: 'Kicks',
                                year: 2025,
                                chassisNumber: '9B3H5200M09284120',
                                motorNumber: 'ENG92841',
                                color: 'Rojo Metálico',
                                insuranceCompany: 'Consorcio SOAPEX',
                                insurancePolicyNumber: 'SPX-7482912',
                                departureDate: new Date().toISOString().split('T')[0],
                                returnDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
                                passengerCount: 2,
                                destination: 'Mendoza',
                                status: 'pendiente'
                              };
                              registrations.push(quickAdd);
                              setSearchQuery('XX-YY-99');
                            }}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[9px] uppercase font-bold transition-all shadow-sm cursor-pointer border-none"
                          >
                            Registrar en Ventanilla (Manual)
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Default neutral empty state */}
                {!selectedReg && !warningMessage && (
                  <motion.div
                    key="empty-plate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 space-y-2"
                  >
                    <Shield className="w-10 h-10 mx-auto text-slate-300 stroke-[1.2]" />
                    <p className="font-bold text-slate-600 text-xs">Esperando ingreso de patente...</p>
                    <p className="text-[11px] max-w-sm mx-auto leading-relaxed">
                      Ingrese una patente chilena en el buscador de arriba. Use los botones de acceso rápido para probar las simulaciones oficiales requeridas.
                    </p>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* COMPREHENSIVE OVERVIEW OF RECENT PRE-DECLARATIONS */}
            <div className="glass-morphism rounded-2xl border border-white/50 p-5 shadow-lg space-y-3 bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#002F6C] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                Planilla General de Pre-Declaraciones Activas ({registrations.length})
              </h3>
              <p className="text-[11px] text-slate-500">
                Haga clic sobre cualquier patente de la planilla para cargarla automáticamente en el buscador de fiscalización.
              </p>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead className="bg-[#002F6C]/5 text-[#002F6C] font-bold text-[9px] uppercase border-b border-slate-200/50">
                    <tr>
                      <th className="p-2.5">Patente</th>
                      <th className="p-2.5">Conductor</th>
                      <th className="p-2.5">RUT</th>
                      <th className="p-2.5">Categoría</th>
                      <th className="p-2.5">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white/40">
                    {registrations.map((reg) => (
                      <tr 
                        key={reg.id} 
                        onClick={() => handleQuickSearch(reg.plate)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                      >
                        <td className="p-2.5 font-mono font-bold text-slate-900">
                          <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
                            {reg.plate}
                          </span>
                        </td>
                        <td className="p-2.5 font-medium text-slate-800">{reg.driverName}</td>
                        <td className="p-2.5 font-mono text-[11px]">{reg.driverRut}</td>
                        <td className="p-2.5">{reg.vehicleType}</td>
                        <td className="p-2.5">{renderStatusBadge(reg.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
