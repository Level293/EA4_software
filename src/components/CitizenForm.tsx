/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, User, CreditCard, Shield, QrCode, Sparkles, CheckCircle2, AlertTriangle, HelpCircle, Loader2 } from 'lucide-react';
import { VehicleRegistration, VehicleType } from '../types';
import { generateFolio } from '../data';

interface CitizenFormProps {
  onRegisterSuccess: (registration: VehicleRegistration) => void;
}

export default function CitizenForm({ onRegisterSuccess }: CitizenFormProps) {
  const [driverName, setDriverName] = useState('');
  const [driverRut, setDriverRut] = useState('');
  const [plate, setPlate] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Particular');
  const [submittedReg, setSubmittedReg] = useState<VehicleRegistration | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isValidating, setIsValidating] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const formatRut = (value: string) => {
    let clean = value.replace(/[^0-9kK]/g, '');
    if (clean.length === 0) return '';
    let dv = clean.slice(-1);
    let body = clean.slice(0, -1);
    let formattedBody = body;
    if (body.length > 3) {
      formattedBody = body.slice(0, -3) + '.' + body.slice(-3);
    }
    if (body.length > 6) {
      formattedBody = body.slice(0, -6) + '.' + body.slice(-6, -3) + '.' + body.slice(-3);
    }
    return formattedBody ? `${formattedBody}-${dv.toUpperCase()}` : dv.toUpperCase();
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDriverRut(formatRut(e.target.value));
  };

  const formatPlate = (value: string) => {
    // For diplomatic plates, we want to allow letters like C.D. or CC and hyphens
    // Let's clean up characters, keep alphanumeric and dots/hyphens but format nicely
    let upper = value.toUpperCase();
    return upper;
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlate(formatPlate(e.target.value));
  };

  // Check if plate contains CD or CC (ignoring dots/hyphens/spaces)
  const isDiplomaticPlateValid = (plateStr: string) => {
    const clean = plateStr.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return clean.includes('CD') || clean.includes('CC');
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!driverName.trim()) {
      newErrors.driverName = 'El nombre completo es requerido';
    } else if (driverName.trim().split(' ').length < 2) {
      newErrors.driverName = 'Por favor, ingrese nombre y apellido';
    }

    if (!driverRut.trim()) {
      newErrors.driverRut = 'El RUT es requerido';
    } else if (driverRut.length < 8) {
      newErrors.driverRut = 'RUT inválido (Debe incluir dígito verificador)';
    }

    if (!plate.trim()) {
      newErrors.plate = 'La patente es requerida';
    } else if (plate.length < 4) {
      newErrors.plate = 'Patente muy corta';
    }

    // Specific logic: if vehicle type is Diplomático, the plate MUST contain "C.D." or "CC"
    if (vehicleType === 'Diplomático') {
      if (!isDiplomaticPlateValid(plate)) {
        newErrors.plate = 'Para vehículos Diplomáticos, la patente debe contener las siglas "C.D." o "CC" (Ej: CD-12-34 o CC-12-34)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate validation in less than 2 seconds (1.2 seconds) to show an instant verified state
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      
      const assignedDays = vehicleType === 'Particular' ? 180 : 90;

      const newReg: VehicleRegistration = {
        id: generateFolio(),
        createdAt: new Date().toISOString(),
        driverName: driverName.trim(),
        driverRut: driverRut.trim(),
        driverEmail: `${driverName.toLowerCase().replace(/[^a-z]/g, '')}@aduanas.cl`,
        driverPhone: '+56 9 ' + Math.floor(10000000 + Math.random() * 90000000),
        driverAddress: 'Avenida del Libertador, Los Andes, Chile',
        isOwner: true,
        plate: plate.trim().toUpperCase(),
        vehicleType,
        brand: vehicleType === 'Diplomático' ? 'Mercedes-Benz' : 'Hyundai',
        model: vehicleType === 'Diplomático' ? 'E-Class' : 'Tucson',
        year: 2025,
        chassisNumber: '9B3H5200M0' + Math.floor(100000 + Math.random() * 900000),
        motorNumber: 'ENG' + Math.floor(100000 + Math.random() * 900000),
        color: vehicleType === 'Diplomático' ? 'Negro Oficial' : 'Azul Eléctrico',
        insuranceCompany: 'Consorcio Internacional SOAPEX',
        insurancePolicyNumber: 'SPX-' + Math.floor(100000 + Math.random() * 900000),
        departureDate: new Date().toISOString().split('T')[0],
        returnDate: new Date(Date.now() + 86400000 * assignedDays).toISOString().split('T')[0],
        passengerCount: 2,
        destination: 'Complejo Fronterizo Los Horcones',
        status: 'pendiente'
      };

      setSubmittedReg(newReg);
      onRegisterSuccess(newReg);
    }, 1200);
  };

  const handleReset = () => {
    setDriverName('');
    setDriverRut('');
    setPlate('');
    setVehicleType('Particular');
    setSubmittedReg(null);
    setErrors({});
  };

  const renderQRCodeSVG = (folio: string) => {
    return (
      <svg className="w-48 h-48 mx-auto shadow-md p-1 bg-white rounded-xl border border-slate-200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="12" fill="white" />
        <rect x="8" y="8" width="22" height="22" rx="3" fill="#002F6C" />
        <rect x="12" y="12" width="14" height="14" rx="1.5" fill="white" />
        <rect x="15" y="15" width="8" height="8" rx="0.5" fill="#002F6C" />

        <rect x="70" y="8" width="22" height="22" rx="3" fill="#002F6C" />
        <rect x="74" y="12" width="14" height="14" rx="1.5" fill="white" />
        <rect x="77" y="15" width="8" height="8" rx="0.5" fill="#002F6C" />

        <rect x="8" y="70" width="22" height="22" rx="3" fill="#002F6C" />
        <rect x="12" y="74" width="14" height="14" rx="1.5" fill="white" />
        <rect x="15" y="77" width="8" height="8" rx="0.5" fill="#002F6C" />

        <g fill="#1E293B">
          <rect x="36" y="8" width="4" height="4" rx="1" />
          <rect x="44" y="12" width="8" height="4" rx="1" />
          <rect x="36" y="20" width="12" height="4" rx="1" />
          <rect x="56" y="8" width="4" height="8" rx="1" />
          <rect x="52" y="20" width="8" height="4" rx="1" />

          <rect x="36" y="32" width="8" height="8" rx="1" />
          <rect x="48" y="36" width="12" height="4" rx="1" />
          <rect x="32" y="48" width="4" height="12" rx="1" />
          <rect x="40" y="44" width="16" height="4" rx="1" />
          <rect x="44" y="52" width="8" height="8" rx="1" fill="#D52B1E" />
          <rect x="56" y="48" width="4" height="12" rx="1" />
          
          <rect x="8" y="36" width="12" height="4" rx="1" />
          <rect x="16" y="44" width="4" height="12" rx="1" />
          <rect x="8" y="60" width="8" height="4" rx="1" />
          
          <rect x="72" y="36" width="8" height="4" rx="1" />
          <rect x="84" y="32" width="8" height="8" rx="1" />
          <rect x="72" y="48" width="16" height="4" rx="1" />
          <rect x="80" y="56" width="4" height="12" rx="1" />
          <rect x="88" y="60" width="4" height="4" rx="1" />

          <rect x="36" y="68" width="4" height="12" rx="1" />
          <rect x="44" y="76" width="12" height="4" rx="1" />
          <rect x="36" y="84" width="16" height="4" rx="1" />
          <rect x="56" y="68" width="8" height="4" rx="1" />
          <rect x="60" y="76" width="4" height="12" rx="1" />
          <rect x="72" y="76" width="12" height="4" rx="1" />
          <rect x="76" y="84" width="8" height="4" rx="1" />
        </g>

        <rect x="46" y="46" width="8" height="8" rx="1.5" fill="#002F6C" />
        <polygon points="50,47 51,49.5 53.5,50 51,50.5 50,53 49,50.5 46.5,50 49,49.5" fill="white" />
      </svg>
    );
  };

  return (
    <div className="max-w-xl mx-auto">
      {!submittedReg ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-2xl border border-white/50 shadow-xl overflow-hidden bg-white/95"
        >
          {/* Institutional Header Banner */}
          <div className="bg-gradient-to-r from-[#002F6C] to-blue-900 text-white p-6 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_rgba(255,255,255,0.08)_0%,_transparent_60%)] pointer-events-none" />
            <span className="text-[10px] uppercase tracking-wider font-black text-blue-200 bg-blue-950/40 px-2 py-0.5 rounded">
              Aduanas de Chile • Formulario Digital Oficial
            </span>
            <h2 className="text-xl font-extrabold mt-2 tracking-tight">Registro Viajero</h2>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              Complete la pre-declaración electrónica de salida temporal de su vehículo para agilizar su atención en frontera.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Input 1: Nombre Completo */}
            <div className="space-y-1.5 relative">
              <div className="flex justify-between items-center">
                <label htmlFor="driverName" className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                  Nombre Completo del Conductor <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === 'name' ? null : 'name')}
                  className="text-slate-400 hover:text-[#002F6C] transition-colors"
                  title="Ayuda"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Contextual tooltip */}
              {activeTooltip === 'name' && (
                <div className="bg-blue-50 border border-blue-200 text-slate-700 p-2.5 rounded-lg text-[11px] mb-2 leading-relaxed">
                  <strong>Indicación:</strong> Ingrese el nombre completo exactamente como figura en su Cédula de Identidad chilena. Debe contener al menos nombre y un apellido.
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="driverName"
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Ej: Juan Carlos Silva Castro"
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 border focus:outline-none focus:ring-2 focus:ring-[#002F6C] focus:border-transparent transition-all ${
                    errors.driverName ? 'border-red-500 focus:ring-red-400' : 'border-slate-200'
                  }`}
                />
              </div>
              <p className="text-[10px] text-slate-400 italic">Debe coincidir con la cédula del conductor oficial.</p>
              {errors.driverName && <p className="text-[10px] text-red-500 font-bold">{errors.driverName}</p>}
            </div>

            {/* Input 2: RUT Conductor */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="driverRut" className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                  RUT del Conductor <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === 'rut' ? null : 'rut')}
                  className="text-slate-400 hover:text-[#002F6C] transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Contextual tooltip */}
              {activeTooltip === 'rut' && (
                <div className="bg-blue-50 border border-blue-200 text-slate-700 p-2.5 rounded-lg text-[11px] mb-2 leading-relaxed">
                  <strong>Indicación:</strong> El RUT debe ser ingresado con puntos y guion. Por ejemplo, si su RUT es 154829012, digite "15.482.901-2" o deje que el sistema lo formatee automáticamente.
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="driverRut"
                  type="text"
                  value={driverRut}
                  onChange={handleRutChange}
                  placeholder="Ej: 15.482.901-2"
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 border focus:outline-none focus:ring-2 focus:ring-[#002F6C] focus:border-transparent transition-all ${
                    errors.driverRut ? 'border-red-500 focus:ring-red-400' : 'border-slate-200'
                  }`}
                />
              </div>
              <p className="text-[10px] text-slate-400 italic">Formato oficial con puntos, guion y dígito verificador.</p>
              {errors.driverRut && <p className="text-[10px] text-red-500 font-bold">{errors.driverRut}</p>}
            </div>

            {/* Input 3: Patente Vehículo */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="plate" className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                  Patente del Vehículo <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === 'plate' ? null : 'plate')}
                  className="text-slate-400 hover:text-[#002F6C] transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Contextual tooltip */}
              {activeTooltip === 'plate' && (
                <div className="bg-blue-50 border border-blue-200 text-slate-700 p-2.5 rounded-lg text-[11px] mb-2 leading-relaxed">
                  <strong>Indicación:</strong> Ingrese las letras y números de su placa patente única. 
                  <br />• Para <strong>Particulares</strong>, se aceptan formatos estándar chilenos (Ej: AA-BB-11 o ABCD-12).
                  <br />• Para <strong>Diplomáticos</strong>, es obligatorio incluir las siglas <strong>C.D.</strong> o <strong>CC</strong> en la patente para habilitar la vigencia especial de 90 días (Ej: "CD-42-15" o "CC-10-88").
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-200 px-1 py-0.5 rounded border border-slate-300">
                    CL
                  </span>
                </div>
                <input
                  id="plate"
                  type="text"
                  value={plate}
                  onChange={handlePlateChange}
                  placeholder="Ej: AA-BB-11 o CD-12-34..."
                  className={`w-full pl-10 pr-3 py-2 text-xs font-mono font-bold rounded-lg bg-slate-50 border focus:outline-none focus:ring-2 focus:ring-[#002F6C] focus:border-transparent transition-all uppercase ${
                    errors.plate ? 'border-red-500 focus:ring-red-400' : 'border-slate-200'
                  }`}
                />
              </div>
              <p className="text-[10px] text-slate-400 italic">Letras y números sin espacios o incluyendo las siglas C.D./CC para diplomáticos.</p>
              {errors.plate && <p className="text-[10px] text-red-500 font-bold">{errors.plate}</p>}
            </div>

            {/* Input 4: Tipo de Vehículo */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                Tipo de Vehículo <span className="text-red-500">*</span>
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Particular */}
                <div
                  id="vehicle-type-particular"
                  onClick={() => setVehicleType('Particular')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden select-none ${
                    vehicleType === 'Particular'
                      ? 'border-[#002F6C] bg-blue-50/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="vehicleType"
                      checked={vehicleType === 'Particular'}
                      onChange={() => setVehicleType('Particular')}
                      className="text-[#002F6C] focus:ring-[#002F6C] h-4 w-4"
                    />
                    <span className="text-xs font-bold text-slate-800">Particular</span>
                  </div>
                  <div className="mt-2.5 text-[10px] font-black text-emerald-800 bg-emerald-100/90 border border-emerald-200 px-2 py-0.5 rounded w-max">
                    180 días de vigencia
                  </div>
                </div>

                {/* Diplomático */}
                <div
                  id="vehicle-type-diplomatico"
                  onClick={() => setVehicleType('Diplomático')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden select-none ${
                    vehicleType === 'Diplomático'
                      ? 'border-[#002F6C] bg-blue-50/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="vehicleType"
                      checked={vehicleType === 'Diplomático'}
                      onChange={() => setVehicleType('Diplomático')}
                      className="text-[#002F6C] focus:ring-[#002F6C] h-4 w-4"
                    />
                    <span className="text-xs font-bold text-slate-800">Diplomático</span>
                  </div>
                  
                  {/* Dynamic Help Text based on current plate */}
                  {isDiplomaticPlateValid(plate) ? (
                    <div className="mt-2.5 text-[10px] font-black text-blue-800 bg-blue-100/90 border border-blue-200 px-2 py-0.5 rounded w-max">
                      90 días de vigencia
                    </div>
                  ) : (
                    <div className="mt-2.5 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded leading-tight">
                      Falta C.D. o CC en patente
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-slate-500 italic">
                El tipo "Particular" otorga automáticamente un período estándar de 180 días de vigencia. El tipo "Diplomático" otorga 90 días (requiere que la patente contenga las siglas "C.D." o "CC").
              </p>
            </div>

            {/* Validation Indicator or Button */}
            {isValidating ? (
              <div className="w-full bg-[#002F6C]/10 text-[#002F6C] border border-[#002F6C]/20 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-wider">
                <Loader2 className="w-4 h-4 animate-spin text-[#002F6C]" />
                Validando pre-declaración en Aduanas...
              </div>
            ) : (
              <button
                type="submit"
                id="btn-citizen-submit"
                className="w-full bg-[#002F6C] hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                <FileText className="w-4.5 h-4.5" />
                Enviar Pre-Declaración
              </button>
            )}
          </form>
        </motion.div>
      ) : (
        /* SUCCESS PORTAL WITH QR CODE */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-morphism rounded-2xl border border-white/50 shadow-xl overflow-hidden p-6 text-center space-y-6 bg-white"
        >
          <div className="space-y-2">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h2 className="text-lg font-extrabold text-[#002F6C] uppercase tracking-wide">
              ¡Pre-Declaración Exitosa!
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Su trámite electrónico ha sido registrado. Se ha generado un código QR oficial con la información de su viaje.
            </p>
          </div>

          {/* QR Code Container */}
          <div className="py-2 space-y-3">
            {renderQRCodeSVG(submittedReg.id)}
            <div className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 max-w-xs mx-auto">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Folio Oficial Aduanero</p>
              <p className="text-xs font-mono font-black text-[#002F6C]">
                {submittedReg.id}
              </p>
            </div>
          </div>

          {/* Detailed Summary Card */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 text-left space-y-3 text-xs">
            <p className="text-slate-500 font-extrabold uppercase text-[10px] border-b border-slate-200 pb-1.5 flex justify-between">
              <span>Ficha del Trámite Digital</span>
              <span className="text-blue-700 font-bold">Estado: REGISTRADO</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
              <p><strong>Conductor:</strong> {submittedReg.driverName}</p>
              <p><strong>RUT:</strong> {submittedReg.driverRut}</p>
              <p>
                <strong>Patente:</strong>{' '}
                <span className="font-mono bg-white border border-slate-300 px-1.5 py-0.5 rounded font-black text-slate-900 shadow-2xs">
                  {submittedReg.plate}
                </span>
              </p>
              <p><strong>Tipo Vehículo:</strong> {submittedReg.vehicleType}</p>
            </div>
            
            <div className="pt-2.5 border-t border-slate-200/60 flex justify-between items-center">
              <span className="font-extrabold text-slate-600 text-xs">Vigencia Asignada:</span>
              <span className={`px-3 py-1 font-black rounded-lg text-xs uppercase ${
                submittedReg.vehicleType === 'Particular' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {submittedReg.vehicleType === 'Particular' ? '180 DÍAS' : '90 DÍAS'}
              </span>
            </div>
          </div>

          {/* Security details note */}
          <div className="bg-[#002F6C]/5 p-3 rounded-xl border border-[#002F6C]/15 text-[11px] text-slate-600 text-left flex gap-2">
            <Shield className="w-5 h-5 text-[#002F6C] shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Procedimiento en Aduana:</strong> Al llegar al Complejo Los Libertadores, presente este código QR desde su celular o de forma impresa. El inspector de aduanas escaneará el folio para validar el cruce fronterizo.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleReset}
              id="btn-register-another"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-colors cursor-pointer border border-slate-200"
            >
              Registrar Nuevo Vehículo
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
