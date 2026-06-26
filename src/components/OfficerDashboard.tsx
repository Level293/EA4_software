/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { VehicleRegistration, RegistrationStatus, VehicleType } from '../types';
import { 
  Search, Filter, Eye, Check, X, AlertTriangle, RefreshCw, 
  Car, FileText, CheckCircle, ChevronRight, User, Trash2, Shield, PlusCircle
} from 'lucide-react';
import { generateFolio } from '../data';

interface OfficerDashboardProps {
  registrations: VehicleRegistration[];
  onUpdateStatus: (id: string, status: RegistrationStatus, comments: string, reviewerName: string) => void;
  onDeleteRegistration?: (id: string) => void;
  onResetData: () => void;
}

export default function OfficerDashboard({ 
  registrations, 
  onUpdateStatus, 
  onDeleteRegistration,
  onResetData 
}: OfficerDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [typeFilter, setTypeFilter] = useState<string>('todos');
  
  // Selected registration for detailed view/review modal
  const [selectedRegId, setSelectedRegId] = useState<string | null>(null);
  
  // Review form state
  const [comments, setComments] = useState('');
  const [reviewerName, setReviewerName] = useState('Inspector Carlos Valdés');
  const [actionError, setActionError] = useState('');

  // Find currently selected registration details
  const selectedRegistration = registrations.find(r => r.id === selectedRegId);

  // Compute Statistics
  const total = registrations.length;
  const pending = registrations.filter(r => r.status === 'pendiente').length;
  const approved = registrations.filter(r => r.status === 'aprobado').length;
  const observed = registrations.filter(r => r.status === 'observado').length;
  const rejected = registrations.filter(r => r.status === 'rechazado').length;

  const approvedRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  // Filter registrations
  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      reg.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.driverRut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || reg.status === statusFilter;
    const matchesType = typeFilter === 'todos' || reg.vehicleType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle setting active registration for review
  const handleSelectForReview = (reg: VehicleRegistration) => {
    setSelectedRegId(reg.id);
    setComments(reg.officerComments || '');
    if (reg.reviewedBy) {
      setReviewerName(reg.reviewedBy);
    }
    setActionError('');
  };

  // Submit Status Update
  const handleApplyStatus = (status: RegistrationStatus) => {
    if (!selectedRegId) return;
    
    if ((status === 'rechazado' || status === 'observado') && !comments.trim()) {
      setActionError(`Debe ingresar observaciones/comentarios obligatorios para justificar el estado de ${status.toUpperCase()}`);
      return;
    }

    if (!reviewerName.trim()) {
      setActionError('Debe ingresar el nombre del inspector responsable de la revisión.');
      return;
    }

    // Default comment if empty and approving
    const finalComments = comments.trim() || (status === 'aprobado' ? 'Documentación válida. Autorizado para transitar.' : '');

    onUpdateStatus(selectedRegId, status, finalComments, reviewerName);
    setActionError('');
    
    // Auto-update local inputs or close/refresh selection
    const updated = registrations.find(r => r.id === selectedRegId);
    if (updated) {
      setSelectedRegId(null); // close detail or refresh
    }
  };

  // Status Badge Helper for Dashboard Table
  const renderStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'aprobado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Aprobado
          </span>
        );
      case 'rechazado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            Rechazado
          </span>
        );
      case 'observado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            Observado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
            Pendiente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Cards & Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        {/* Total card */}
        <div className="glass-morphism p-4 rounded-2xl border border-white/50 shadow-lg shadow-[#002F6C]/4 hover:bg-white/80 transition-all flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Registros Totales</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[#002F6C]">{total}</span>
            <span className="text-[10px] text-slate-400 font-medium">Fórmulas</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#002F6C] h-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Pending card */}
        <div className="glass-morphism p-4 rounded-2xl border border-white/50 shadow-lg shadow-[#002F6C]/4 hover:bg-white/80 transition-all flex flex-col justify-between">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Pendientes</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-blue-700">{pending}</span>
            <span className="text-[10px] text-blue-400 font-medium">Revisión</span>
          </div>
          <div className="w-full bg-blue-50/60 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${total > 0 ? (pending / total) * 100 : 0}%` }} />
          </div>
        </div>

        {/* Approved card */}
        <div className="glass-morphism p-4 rounded-2xl border border-white/50 shadow-lg shadow-[#002F6C]/4 hover:bg-white/80 transition-all flex flex-col justify-between">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Autorizados</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-emerald-700">{approved}</span>
            <span className="text-[10px] text-emerald-400 font-medium">{approvedRate}% Tasa</span>
          </div>
          <div className="w-full bg-emerald-50/60 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-600 h-full transition-all duration-500" style={{ width: `${approvedRate}%` }} />
          </div>
        </div>

        {/* Observed card */}
        <div className="glass-morphism p-4 rounded-2xl border border-white/50 shadow-lg shadow-[#002F6C]/4 hover:bg-white/80 transition-all flex flex-col justify-between">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Observados</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-amber-700">{observed}</span>
            <span className="text-[10px] text-amber-400 font-medium">Detenidos</span>
          </div>
          <div className="w-full bg-amber-50/60 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${total > 0 ? (observed / total) * 100 : 0}%` }} />
          </div>
        </div>

        {/* Rejected card */}
        <div className="glass-morphism p-4 rounded-2xl border border-white/50 shadow-lg shadow-[#002F6C]/4 hover:bg-white/80 transition-all flex flex-col justify-between col-span-2 md:col-span-1">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">Rechazados</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-red-700">{rejected}</span>
            <span className="text-[10px] text-red-400 font-medium">Sin Paso</span>
          </div>
          <div className="w-full bg-red-50/60 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${total > 0 ? (rejected / total) * 100 : 0}%` }} />
          </div>
        </div>

      </div>

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Search, Filters & Registration Table List */}
        <div className="lg:col-span-7 glass-morphism rounded-2xl border border-white/55 shadow-xl shadow-[#002F6C]/5 overflow-hidden p-5 space-y-4">
          
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Planilla de Control Fronterizo</h3>
              <p className="text-xs text-slate-500">Filtrado inteligente en tiempo real para inspectores en Los Libertadores.</p>
            </div>
            
            {/* Action panel triggers */}
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={onResetData}
                id="btn-officer-reset-data"
                title="Restaurar datos preestablecidos"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 text-slate-600 hover:text-red-700 hover:border-red-200 rounded-lg text-xs font-semibold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Restaurar
              </button>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Patente, RUT, conductor..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Filter className="w-3.5 h-3.5" />
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
              >
                <option value="todos">Todos los Estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="aprobado">Autorizados</option>
                <option value="observado">Observados</option>
                <option value="rechazado">Rechazados</option>
              </select>
            </div>

            {/* Vehicle Type Filter */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Car className="w-3.5 h-3.5" />
              </span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
              >
                <option value="todos">Todos los Vehículos</option>
                <option value="Automóvil">Automóviles</option>
                <option value="Camioneta">Camionetas</option>
                <option value="Station Wagon">Station Wagon</option>
                <option value="Motocicleta">Motocicletas</option>
                <option value="Otro">Otros</option>
              </select>
            </div>
          </div>

          {/* List Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-lg">
            {filteredRegistrations.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-600">No se encontraron registros</p>
                <p className="text-xs text-slate-400">Intente modificando sus filtros de búsqueda o registre un nuevo vehículo.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Folio / Fecha</th>
                    <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Conductor</th>
                    <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Patente / Móvil</th>
                    <th className="p-3 font-bold uppercase tracking-wider text-[10px] text-center">Estado</th>
                    <th className="p-3 font-bold uppercase tracking-wider text-[10px] text-center">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRegistrations.map((reg) => (
                    <tr 
                      key={reg.id}
                      onClick={() => handleSelectForReview(reg)}
                      className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedRegId === reg.id ? 'bg-blue-50/70 border-l-4 border-l-[#002F6C]' : ''}`}
                    >
                      <td className="p-3">
                        <span className="font-mono font-bold text-slate-700 block">{reg.id.split('-').pop()}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {new Date(reg.createdAt).toLocaleDateString('es-CL')}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-800 block truncate max-w-[150px]" title={reg.driverName}>
                          {reg.driverName.split(' ').slice(0, 2).join(' ')}
                        </span>
                        <span className="text-[10px] text-slate-500 block font-mono mt-0.5">{reg.driverRut}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-mono bg-slate-100 border border-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[11px] font-bold inline-block mb-1">
                          {reg.plate}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">
                          {reg.brand} {reg.model}
                        </span>
                      </td>
                      <td className="p-3 text-center align-middle">
                        {renderStatusBadge(reg.status)}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          id={`btn-review-${reg.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectForReview(reg);
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#002F6C] hover:bg-slate-100 rounded transition-colors inline-flex"
                          title="Revisar Solicitud"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>

        {/* Right Side: Detailed Review Panel */}
        <div className="lg:col-span-5">
          {selectedRegistration ? (
            <div className="glass-morphism rounded-2xl border border-white/55 shadow-xl shadow-[#002F6C]/5 overflow-hidden space-y-5 p-5">
              
              {/* Review Panel Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Panel de Control de Inspector</span>
                  <h3 className="font-extrabold text-[#002F6C] text-base flex items-center gap-1.5 mt-0.5">
                    <Shield className="w-5 h-5 text-[#002F6C] stroke-[1.5]" />
                    Ficha de Fiscalización
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedRegId(null)}
                  className="text-slate-500 hover:text-slate-700 hover:bg-white/50 text-xs px-2 py-1 border border-white/40 rounded-lg backdrop-blur-xs font-bold transition-all"
                >
                  Cerrar
                </button>
              </div>

              {/* Citizen & Vehicle Info Recaps */}
              <div className="space-y-4 text-xs">
                
                {/* ID section */}
                <div className="flex justify-between items-center bg-white/40 border border-white/50 p-2.5 rounded-xl backdrop-blur-sm shadow-sm">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Folio de Registro</span>
                    <span className="font-mono font-bold text-[#002F6C] text-sm">{selectedRegistration.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Estado Actual</span>
                    {renderStatusBadge(selectedRegistration.status)}
                  </div>
                </div>

                {/* Grid Details */}
                <div className="grid grid-cols-2 gap-3 bg-white/30 backdrop-blur-xs p-3.5 rounded-xl border border-white/40">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Conductor</span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedRegistration.driverName}</p>
                    <p className="font-mono text-slate-500 text-[11px] mt-0.5">{selectedRegistration.driverRut}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Contacto</span>
                    <p className="text-slate-700 mt-0.5">{selectedRegistration.driverPhone}</p>
                    <p className="text-slate-500 mt-0.5 truncate">{selectedRegistration.driverEmail}</p>
                  </div>
                  
                  <div className="col-span-2 border-t border-slate-200/40 pt-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Dirección Declarada</span>
                    <p className="text-slate-700 mt-0.5">{selectedRegistration.driverAddress}</p>
                  </div>

                  <div className="col-span-2 border-t border-slate-200/40 pt-2 grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Relación Titularidad</span>
                      <p className="font-semibold text-slate-700 mt-0.5">
                        {selectedRegistration.isOwner ? 'Es propietario legal' : 'NO es propietario'}
                      </p>
                    </div>
                    {!selectedRegistration.isOwner && (
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Propietario / RUT</span>
                        <p className="font-bold text-amber-800 mt-0.5 truncate">{selectedRegistration.ownerName}</p>
                        <p className="font-mono text-amber-700 text-[10px] mt-0.5">{selectedRegistration.ownerRut}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vehicle Block */}
                <div className="grid grid-cols-2 gap-3 bg-white/30 backdrop-blur-xs p-3.5 rounded-xl border border-white/40">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Patente (Chile)</span>
                    <p className="font-mono font-bold text-slate-900 mt-0.5 text-sm bg-white border border-slate-200/60 px-1.5 py-0.5 rounded w-max shadow-xs">
                      {selectedRegistration.plate}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Vehículo / Tipo</span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedRegistration.brand} {selectedRegistration.model}</p>
                    <p className="text-slate-500 mt-0.5">{selectedRegistration.vehicleType} ({selectedRegistration.year})</p>
                  </div>

                  <div className="col-span-2 border-t border-slate-200/40 pt-2 grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Nº Chasis / VIN</span>
                      <p className="font-mono text-slate-700 mt-0.5 break-all">{selectedRegistration.chassisNumber}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Nº Motor / Color</span>
                      <p className="font-mono text-slate-700 mt-0.5 truncate">{selectedRegistration.motorNumber}</p>
                      <p className="text-slate-500 mt-0.5">{selectedRegistration.color}</p>
                    </div>
                  </div>
                </div>

                {/* Insurance and Trip Block */}
                <div className="grid grid-cols-2 gap-3 bg-white/30 backdrop-blur-xs p-3.5 rounded-xl border border-white/40">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Seguro Internacional / SOAPEX</span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedRegistration.insuranceCompany}</p>
                    <p className="font-mono text-slate-500 text-[10px] mt-0.5">Póliza: {selectedRegistration.insurancePolicyNumber}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Ruta / Pasajeros</span>
                    <p className="font-bold text-slate-800 mt-0.5">Hacia: {selectedRegistration.destination}</p>
                    <p className="text-slate-500 mt-0.5">Cant. Pasajeros: {selectedRegistration.passengerCount}</p>
                  </div>

                  <div className="col-span-2 border-t border-slate-200/40 pt-2 grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Salida de Chile</span>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {new Date(selectedRegistration.departureDate + 'T12:00:00').toLocaleDateString('es-CL')}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Retorno Estimado</span>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {new Date(selectedRegistration.returnDate + 'T12:00:00').toLocaleDateString('es-CL')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Review Action Form Card */}
                <div className="border border-blue-100/50 rounded-2xl p-4 bg-blue-50/20 backdrop-blur-sm space-y-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#002F6C] block">
                    Ejecutar Acción de Fiscalización de Aduanas
                  </span>

                  <div className="space-y-1">
                    <label htmlFor="inspector-name" className="block text-[10px] font-bold text-slate-500 uppercase">Inspector Responsable</label>
                    <input
                      id="inspector-name"
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="Nombre de funcionario"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="inspector-comments" className="block text-[10px] font-bold text-slate-500 uppercase">
                      Observaciones / Comentarios del Funcionario
                    </label>
                    <textarea
                      id="inspector-comments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Escriba los motivos del rechazo, observaciones de documentos, o confirmaciones..."
                      rows={3}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none bg-white"
                    />
                    <p className="text-[10px] text-slate-400">
                      * Obligatorio si decide rechazar u observar la solicitud.
                    </p>
                  </div>

                  {actionError && (
                    <div className="p-2.5 bg-red-50 text-red-700 text-[11px] border border-red-200/50 rounded-lg font-semibold leading-normal">
                      {actionError}
                    </div>
                  )}

                  {/* Inspector Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {/* Approve button */}
                    <button
                      type="button"
                      id="btn-officer-approve"
                      onClick={() => handleApplyStatus('aprobado')}
                      className="flex flex-col items-center justify-center p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-center transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4 mb-1" />
                      <span className="text-[10px] uppercase">Autorizar</span>
                    </button>

                    {/* Observe button */}
                    <button
                      type="button"
                      id="btn-officer-observe"
                      onClick={() => handleApplyStatus('observado')}
                      className="flex flex-col items-center justify-center p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold text-center transition-colors cursor-pointer"
                    >
                      <AlertTriangle className="w-4 h-4 mb-1" />
                      <span className="text-[10px] uppercase">Observar</span>
                    </button>

                    {/* Reject button */}
                    <button
                      type="button"
                      id="btn-officer-reject"
                      onClick={() => handleApplyStatus('rechazado')}
                      className="flex flex-col items-center justify-center p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-center transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4 mb-1" />
                      <span className="text-[10px] uppercase">Rechazar</span>
                    </button>
                  </div>
                  
                  {/* Delete option for simulation management */}
                  {onDeleteRegistration && (
                    <div className="pt-2 text-right">
                      <button
                        type="button"
                        id="btn-officer-delete-item"
                        onClick={() => {
                          if (confirm('¿Está seguro de eliminar de forma permanente este registro del sistema?')) {
                            onDeleteRegistration(selectedRegistration.id);
                            setSelectedRegId(null);
                          }
                        }}
                        className="text-[10px] text-red-500 hover:text-red-700 hover:underline flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        Eliminar Registro
                      </button>
                    </div>
                  )}

                </div>

              </div>

            </div>
          ) : (
            <div className="glass-morphism border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-500 space-y-3 min-h-[350px] flex flex-col justify-center items-center">
              <Shield className="w-12 h-12 text-[#002F6C] opacity-40 stroke-[1.2]" />
              <div>
                <p className="font-extrabold text-slate-700 text-sm">Ficha Fiscalizadora Vacía</p>
                <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
                  Seleccione un formulario de la planilla izquierda para revisar los datos técnicos, verificar pólizas de seguro e inspeccionar de forma presencial u online.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
