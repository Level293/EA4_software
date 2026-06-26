/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, CheckCircle, AlertOctagon, Info, Sparkles, MapPin, Calendar, Clock, HelpCircle } from 'lucide-react';
import { VehicleRegistration } from '../types';

interface StatusInquiryProps {
  registrations: VehicleRegistration[];
}

export default function StatusInquiry({ registrations }: StatusInquiryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{
    status: 'vigente' | 'vencido' | 'no_existe';
    plate: string;
    driverName?: string;
    daysRemaining?: number;
    message: string;
  } | null>(null);

  const normalizePlate = (str: string) => {
    return str.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  };

  useEffect(() => {
    const cleanQuery = normalizePlate(searchQuery);

    if (cleanQuery === '') {
      setSearchResult(null);
      return;
    }

    // Specific Rule 1: CH-12-34 -> Green box saying VIGENTE with days remaining (e.g. 120 days)
    if (cleanQuery === 'CH1234') {
      setSearchResult({
        status: 'vigente',
        plate: 'CH-12-34',
        driverName: 'Claudio Herrera Mendoza',
        daysRemaining: 120,
        message: 'Su permiso de salida temporal se encuentra vigente en los registros aduaneros chilenos.'
      });
      return;
    }

    // Check if the plate was registered during the current session
    const foundSessionReg = registrations.find(r => normalizePlate(r.plate) === cleanQuery);
    
    if (foundSessionReg) {
      // Calculate remaining days based on created date or default
      const days = foundSessionReg.vehicleType === 'Particular' ? 180 : 90;
      setSearchResult({
        status: 'vigente',
        plate: foundSessionReg.plate,
        driverName: foundSessionReg.driverName,
        daysRemaining: days,
        message: 'Su pre-declaración está registrada de manera exitosa y con vigencia autorizada.'
      });
      return;
    }

    // If it's anything else and they've typed at least 5-6 characters, show the required Red Alert:
    // "Dirigirse a la aduana más cercana. El plazo ha vencido"
    if (cleanQuery.length >= 5) {
      setSearchResult({
        status: 'vencido',
        plate: searchQuery.toUpperCase(),
        message: 'Dirigirse a la aduana más cercana. El plazo ha vencido'
      });
    } else {
      setSearchResult(null);
    }
  }, [searchQuery, registrations]);

  const handleShortcutClick = (plate: string) => {
    setSearchQuery(plate);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism rounded-2xl border border-white/50 shadow-xl overflow-hidden bg-white/95 p-6 space-y-6"
      >
        {/* Header Block */}
        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-wider text-blue-700 uppercase bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
            Módulo de Autoconsulta de Estado
          </span>
          <h2 className="text-xl font-extrabold text-[#002F6C] mt-2 tracking-tight flex items-center gap-2">
            Consulta de Estado de Permiso
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Consulte la vigencia de la autorización de salida de su vehículo ingresando su placa patente única chilena.
          </p>
        </div>

        {/* Input Block */}
        <div className="space-y-2">
          <label htmlFor="status-plate-search" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Patente a Consultar
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              id="status-plate-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ej: CH-12-34 o su propia patente..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 text-xs font-mono font-bold rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#002F6C] focus:border-transparent transition-all uppercase placeholder:font-sans placeholder:font-normal"
            />
          </div>
          <p className="text-[10px] text-slate-400 italic">
            Ingrese el formato oficial. No se requiere clave de acceso.
          </p>
        </div>

        {/* Shortcut Quick Buttons */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="font-bold text-slate-400 text-[9px] uppercase">Consultas Rápidas:</span>
          <button
            onClick={() => handleShortcutClick('CH-12-34')}
            className="px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg font-bold font-mono transition-all text-[10px] cursor-pointer border border-emerald-200/40"
          >
            CH-12-34 (Permiso Vigente)
          </button>
          <button
            onClick={() => handleShortcutClick('XX-ZZ-99')}
            className="px-2.5 py-1 bg-red-50 text-red-800 hover:bg-red-100 rounded-lg font-bold font-mono transition-all text-[10px] cursor-pointer border border-red-200/40"
          >
            XX-ZZ-99 (Permiso Vencido)
          </button>
        </div>

        {/* RESULTS INTERACTIVE AREA */}
        <AnimatePresence mode="wait">
          {searchResult && (
            <motion.div
              key={searchResult.status + searchResult.plate}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 pt-2"
            >
              {/* CASE A: VIGENTE (GREEN STATE) */}
              {searchResult.status === 'vigente' && (
                <div className="border border-emerald-200 bg-emerald-50/70 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-5.5 h-5.5 stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
                        Estado del Trámite
                      </span>
                      <h3 className="text-sm font-extrabold text-emerald-900 uppercase tracking-tight mt-0.5">
                        Permiso Vigente
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-emerald-200/50">
                    <div className="space-y-1">
                      <p className="text-slate-500 font-bold uppercase text-[9px] tracking-wide">Patente de Consulta</p>
                      <p className="font-mono font-extrabold text-slate-800 text-xs">
                        {searchResult.plate}
                      </p>
                    </div>
                    {searchResult.driverName && (
                      <div className="space-y-1">
                        <p className="text-slate-500 font-bold uppercase text-[9px] tracking-wide">Conductor Autorizado</p>
                        <p className="font-bold text-slate-800">
                          {searchResult.driverName}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* LARGE REVOLVING DURATION STATE PANEL */}
                  <div className="bg-white border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-black text-[#002F6C]">
                        <Clock className="w-4 h-4 text-[#002F6C]" />
                        <span>Vigencia Autorizada</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {searchResult.message}
                      </p>
                    </div>
                    
                    <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-center shadow-md w-full sm:w-auto shrink-0">
                      <span className="block text-[8px] font-bold uppercase tracking-widest text-emerald-100">Restante</span>
                      <span className="text-base font-extrabold tracking-tight">
                        {searchResult.daysRemaining} DÍAS
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* CASE B: VENCIDO / EXPIRED (RED STATE) */}
              {searchResult.status === 'vencido' && (
                <div className="border border-red-200 bg-red-50/70 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 border border-red-200 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertOctagon className="w-5.5 h-5.5 stroke-[2.2] animate-pulse" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-red-800 bg-red-200/60 px-2 py-0.5 rounded">
                        Alerta de Infracción
                      </span>
                      <h3 className="text-xs font-extrabold text-red-900 uppercase tracking-tight mt-0.5 leading-snug">
                        Plazo Excedido / Sin Permiso Activo
                      </h3>
                      <p className="text-xs font-bold text-red-700 leading-snug bg-white border border-red-100 rounded-lg p-3 shadow-3xs">
                        {searchResult.message}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-red-200/50 text-[11px] text-slate-600 space-y-1.5">
                    <p className="font-extrabold text-slate-700">Pasos a seguir de carácter obligatorio:</p>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
                      <li>No transite con el vehículo fuera de los límites autorizados.</li>
                      <li>Acuda presencialmente a la oficina de Aduanas de Cristo Redentor o la unidad de control más cercana.</li>
                      <li>La circulación con plazos vencidos constituye una infracción a las leyes aduaneras chilenas.</li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Empty search state */}
          {!searchResult && (
            <motion.div
              key="no-search-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 space-y-2 bg-slate-50/50"
            >
              <Calendar className="w-10 h-10 mx-auto text-slate-300 stroke-[1.2]" />
              <p className="font-bold text-slate-600 text-xs">Ingrese patente de consulta</p>
              <p className="text-[11px] max-w-xs mx-auto leading-relaxed">
                Utilice nuestro sistema seguro de verificación para conocer de inmediato si cuenta con autorización aduanera vigente.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
