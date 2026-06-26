/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VehicleRegistration, VehicleType } from '../types';
import { generateFolio } from '../data';
import { 
  User, Car, ShieldAlert, Calendar, FileText, CheckCircle, 
  ArrowRight, ArrowLeft, HelpCircle, ShieldAlert as AlertIcon, Info
} from 'lucide-react';

interface CitizenFormProps {
  onRegisterSuccess: (registration: VehicleRegistration) => void;
}

export default function CitizenForm({ onRegisterSuccess }: CitizenFormProps) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Form State
  const [driverName, setDriverName] = useState('');
  const [driverRut, setDriverRut] = useState('');
  const [driverEmail, setDriverEmail] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverAddress, setDriverAddress] = useState('');
  const [isOwner, setIsOwner] = useState(true);
  const [ownerName, setOwnerName] = useState('');
  const [ownerRut, setOwnerRut] = useState('');

  const [plate, setPlate] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Automóvil');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [chassisNumber, setChassisNumber] = useState('');
  const [motorNumber, setMotorNumber] = useState('');
  const [color, setColor] = useState('');

  const [insuranceCompany, setInsuranceCompany] = useState('HDI Seguros (SOAPEX)');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [destination, setDestination] = useState('');

  // Helpers
  const formatRut = (value: string) => {
    // Basic Chilean RUT formatter
    let clean = value.replace(/[^0-9kK]/g, '');
    if (clean.length === 0) return '';
    
    let dv = clean.slice(-1);
    let body = clean.slice(0, -1);
    
    // Format body with dots
    let formattedBody = body;
    if (body.length > 3) {
      formattedBody = body.slice(0, -3) + '.' + body.slice(-3);
    }
    if (body.length > 6) {
      formattedBody = body.slice(0, -6) + '.' + body.slice(-6, -3) + '.' + body.slice(-3);
    }
    
    return formattedBody ? `${formattedBody}-${dv.toUpperCase()}` : dv.toUpperCase();
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'driver' | 'owner') => {
    const formatted = formatRut(e.target.value);
    if (type === 'driver') {
      setDriverRut(formatted);
    } else {
      setOwnerRut(formatted);
    }
  };

  const formatPlate = (value: string) => {
    // Chilean plate has 4 letters and 2 digits (e.g. ABCD-12) or 2 letters and 4 digits (e.g. AB-1234)
    let clean = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (clean.length > 6) clean = clean.slice(0, 6);
    
    if (clean.length > 4) {
      return `${clean.slice(0, 4)}-${clean.slice(4)}`;
    }
    return clean;
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlate(formatPlate(e.target.value));
  };

  // Step validation
  const validateStep = (currentStep: number) => {
    const stepErrors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!driverName.trim()) stepErrors.driverName = 'El nombre completo es requerido';
      if (!driverRut.trim()) stepErrors.driverRut = 'El RUT es requerido';
      else if (driverRut.length < 8) stepErrors.driverRut = 'RUT inválido';
      
      if (!driverEmail.trim()) stepErrors.driverEmail = 'El correo electrónico es requerido';
      else if (!/\S+@\S+\.\S+/.test(driverEmail)) stepErrors.driverEmail = 'Correo electrónico inválido';
      
      if (!driverPhone.trim()) stepErrors.driverPhone = 'El teléfono es requerido';
      if (!driverAddress.trim()) stepErrors.driverAddress = 'La dirección es requerida';
      
      if (!isOwner) {
        if (!ownerName.trim()) stepErrors.ownerName = 'Nombre del propietario es requerido';
        if (!ownerRut.trim()) stepErrors.ownerRut = 'RUT del propietario es requerido';
      }
    }

    if (currentStep === 2) {
      if (!plate.trim()) stepErrors.plate = 'La patente es requerida';
      else if (plate.length < 6) stepErrors.plate = 'Patente inválida (Ej: ABCD-12 o AB-1234)';
      
      if (!brand.trim()) stepErrors.brand = 'La marca es requerida';
      if (!model.trim()) stepErrors.model = 'El modelo es requerido';
      
      const currentYear = new Date().getFullYear();
      if (!year || year < 1920 || year > currentYear + 1) {
        stepErrors.year = `Año inválido (Rango: 1920 - ${currentYear + 1})`;
      }
      
      if (!chassisNumber.trim()) stepErrors.chassisNumber = 'El número de chasis (VIN) es requerido';
      else if (chassisNumber.length < 10) stepErrors.chassisNumber = 'VIN debe tener al menos 10 caracteres';
      
      if (!motorNumber.trim()) stepErrors.motorNumber = 'El número de motor es requerido';
      if (!color.trim()) stepErrors.color = 'El color es requerido';
    }

    if (currentStep === 3) {
      if (!insuranceCompany.trim()) stepErrors.insuranceCompany = 'La compañía de seguros es requerida';
      if (!insurancePolicyNumber.trim()) stepErrors.insurancePolicyNumber = 'El número de póliza es requerido';
      
      if (!departureDate) stepErrors.departureDate = 'La fecha de salida es requerida';
      if (!returnDate) stepErrors.returnDate = 'La fecha de retorno es requerida';
      
      if (departureDate && returnDate) {
        const dep = new Date(departureDate);
        const ret = new Date(returnDate);
        if (ret < dep) {
          stepErrors.returnDate = 'La fecha de retorno no puede ser anterior a la salida';
        }
      }
      
      if (!passengerCount || passengerCount < 1) {
        stepErrors.passengerCount = 'Debe viajar al menos 1 persona (el conductor)';
      }
      
      if (!destination.trim()) stepErrors.destination = 'El destino en Argentina es requerido';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    const newRegistration: VehicleRegistration = {
      id: generateFolio(),
      createdAt: new Date().toISOString(),
      driverName,
      driverRut,
      driverEmail,
      driverPhone,
      driverAddress,
      isOwner,
      ownerName: isOwner ? undefined : ownerName,
      ownerRut: isOwner ? undefined : ownerRut,
      plate,
      vehicleType,
      brand,
      model,
      year: Number(year),
      chassisNumber,
      motorNumber,
      color,
      insuranceCompany,
      insurancePolicyNumber,
      departureDate,
      returnDate,
      passengerCount: Number(passengerCount),
      destination,
      status: 'pendiente',
    };

    onRegisterSuccess(newRegistration);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step Progress Bar */}
      <div className="glass-morphism p-4 rounded-2xl border border-white/50 mb-6 shadow-md shadow-[#002F6C]/3">
        <div className="flex justify-between items-center relative">
          {/* Connector Line */}
          <div className="absolute left-[8%] right-[8%] top-1/2 h-0.5 bg-slate-200/60 -translate-y-1/2 z-0" />
          <div 
            className="absolute left-[8%] top-1/2 h-0.5 bg-[#002F6C] -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 84}%` }}
          />

          {/* Step 1 */}
          <div className="flex flex-col items-center z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm ${step >= 1 ? 'bg-[#002F6C] text-white' : 'bg-slate-200 text-slate-500'}`}>
              <User className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold mt-1 text-slate-700">Conductor</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm ${step >= 2 ? 'bg-[#002F6C] text-white' : 'bg-slate-200 text-slate-500'}`}>
              <Car className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold mt-1 text-slate-700">Vehículo</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm ${step >= 3 ? 'bg-[#002F6C] text-white' : 'bg-slate-200 text-slate-500'}`}>
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold mt-1 text-slate-700">Seguro y Viaje</span>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm ${step >= 4 ? 'bg-[#002F6C] text-white' : 'bg-slate-200 text-slate-500'}`}>
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold mt-1 text-slate-700">Resumen</span>
          </div>
        </div>
      </div>

      {/* Main Form container */}
      <div className="glass-morphism rounded-2xl border border-white/55 shadow-xl shadow-[#002F6C]/4 overflow-hidden">
        
        {/* Banner Institucional del Formulario */}
        <div className="bg-gradient-to-r from-[#002F6C]/90 to-[#002F6C] text-white p-5 border-b border-white/10 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_rgba(255,255,255,0.1)_0%,_transparent_60%)] pointer-events-none" />
          <p className="text-[11px] uppercase tracking-wider font-bold text-blue-200">Trámite Aduanero Oficial en Línea</p>
          <h2 className="text-lg font-extrabold">Formulario FADTV: Declaración de Salida Temporal de Vehículo</h2>
          <p className="text-xs text-slate-200 mt-1 leading-relaxed">Completa los datos fidedignos de tu vehículo para viajar a Argentina por el Paso Los Libertadores.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: CONDUCTOR Y PROPIETARIO */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#002F6C]">1. Datos Personales del Conductor</h3>
                  <p className="text-xs text-slate-500">Registre la información de la persona que conducirá el vehículo a través del paso fronterizo.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label htmlFor="driver-name" className="block text-xs font-bold text-slate-700 uppercase">Nombre Completo <span className="text-red-500">*</span></label>
                    <input
                      id="driver-name"
                      type="text"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      placeholder="Ej: Juan Antonio Pérez González"
                      className={`w-full px-3 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.driverName ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.driverName && <p className="text-[11px] text-red-600">{errors.driverName}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="driver-rut" className="block text-xs font-bold text-slate-700 uppercase">R.U.T. Conductor <span className="text-red-500">*</span></label>
                    <input
                      id="driver-rut"
                      type="text"
                      value={driverRut}
                      onChange={(e) => handleRutChange(e, 'driver')}
                      placeholder="Ej: 12.345.678-9"
                      className={`w-full px-3 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.driverRut ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.driverRut && <p className="text-[11px] text-red-600">{errors.driverRut}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="driver-email" className="block text-xs font-bold text-slate-700 uppercase">Correo Electrónico <span className="text-red-500">*</span></label>
                    <input
                      id="driver-email"
                      type="email"
                      value={driverEmail}
                      onChange={(e) => setDriverEmail(e.target.value)}
                      placeholder="Ej: juan.perez@correo.cl"
                      className={`w-full px-3 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.driverEmail ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.driverEmail && <p className="text-[11px] text-red-600">{errors.driverEmail}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="driver-phone" className="block text-xs font-bold text-slate-700 uppercase">Teléfono Móvil <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">+56 9</span>
                      <input
                        id="driver-phone"
                        type="tel"
                        value={driverPhone.replace('+56 9 ', '')}
                        onChange={(e) => setDriverPhone('+56 9 ' + e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={9}
                        placeholder="87654321"
                        className={`w-full pl-14 pr-3 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.driverPhone ? 'border-red-500' : 'border-slate-300'}`}
                      />
                    </div>
                    {errors.driverPhone && <p className="text-[11px] text-red-600">{errors.driverPhone}</p>}
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label htmlFor="driver-address" className="block text-xs font-bold text-slate-700 uppercase">Dirección de Residencia Habitual <span className="text-red-500">*</span></label>
                    <input
                      id="driver-address"
                      type="text"
                      value={driverAddress}
                      onChange={(e) => setDriverAddress(e.target.value)}
                      placeholder="Calle, número, departamento, comuna y región"
                      className={`w-full px-3 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.driverAddress ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.driverAddress && <p className="text-[11px] text-red-600">{errors.driverAddress}</p>}
                  </div>
                </div>

                {/* Owner relation toggle */}
                <div className="glass-morphism-dark p-5 rounded-2xl border border-white/30 mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase">¿El conductor es el propietario del vehículo?</h4>
                      <p className="text-[11px] text-slate-500">Indique si el vehículo está a su nombre en el Certificado de Inscripción (Padrón).</p>
                    </div>
                    <button
                      type="button"
                      id="btn-is-owner-toggle"
                      onClick={() => setIsOwner(!isOwner)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isOwner ? 'bg-[#002F6C]' : 'bg-slate-300'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOwner ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {!isOwner && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-slate-200/50 pt-3 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      <div className="sm:col-span-2 bg-amber-50/60 backdrop-blur-sm p-3.5 rounded-xl border border-amber-200/50 text-xs text-amber-900 flex gap-2">
                        <AlertIcon className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                        <div>
                          <strong>Atención:</strong> Si usted no es el propietario, la ley exige que presente una <strong>Autorización Notarial</strong> firmada por el dueño legal del vehículo para salir de Chile en el control aduanero presencial.
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="owner-name" className="block text-xs font-bold text-slate-700 uppercase">Nombre Completo del Propietario <span className="text-red-500">*</span></label>
                        <input
                          id="owner-name"
                          type="text"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="Ej: Inversiones o Nombre Persona Natural"
                          className="w-full px-3 py-2 border border-slate-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                        {errors.ownerName && <p className="text-[11px] text-red-600">{errors.ownerName}</p>}
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="owner-rut" className="block text-xs font-bold text-slate-700 uppercase">R.U.T. del Propietario <span className="text-red-500">*</span></label>
                        <input
                          id="owner-rut"
                          type="text"
                          value={ownerRut}
                          onChange={(e) => handleRutChange(e, 'owner')}
                          placeholder="Ej: 76.543.210-K o 10.987.654-3"
                          className="w-full px-3 py-2 border border-slate-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                        {errors.ownerRut && <p className="text-[11px] text-red-600">{errors.ownerRut}</p>}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 2: VEHÍCULO */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#002F6C]">2. Datos Técnicos del Vehículo</h3>
                  <p className="text-xs text-slate-500">Ingrese las características exactas del móvil que constan en el padrón del Registro Civil.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-1">
                    <label htmlFor="plate" className="block text-xs font-bold text-slate-700 uppercase">Patente (Chile) <span className="text-red-500">*</span></label>
                    <input
                      id="plate"
                      type="text"
                      value={plate}
                      onChange={handlePlateChange}
                      placeholder="Ej: HGPB-42 o BB-1234"
                      className={`w-full px-3 py-2 border text-sm font-mono rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.plate ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.plate && <p className="text-[11px] text-red-600">{errors.plate}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="vehicle-type" className="block text-xs font-bold text-slate-700 uppercase">Tipo de Vehículo <span className="text-red-500">*</span></label>
                    <select
                      id="vehicle-type"
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                      className="w-full px-3 py-2 border border-slate-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                    >
                      <option value="Automóvil">Automóvil</option>
                      <option value="Camioneta">Camioneta</option>
                      <option value="Station Wagon">Station Wagon</option>
                      <option value="Motocicleta">Motocicleta</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="brand" className="block text-xs font-bold text-slate-700 uppercase">Marca <span className="text-red-500">*</span></label>
                    <input
                      id="brand"
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="Ej: Hyundai, Toyota, Suzuki"
                      className={`w-full px-3 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.brand ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.brand && <p className="text-[11px] text-red-600">{errors.brand}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="model" className="block text-xs font-bold text-slate-700 uppercase">Modelo <span className="text-red-500">*</span></label>
                    <input
                      id="model"
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Ej: Accent, Rav4, Swift"
                      className={`w-full px-3 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.model ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.model && <p className="text-[11px] text-red-600">{errors.model}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="year" className="block text-xs font-bold text-slate-700 uppercase">Año Fabricación <span className="text-red-500">*</span></label>
                    <input
                      id="year"
                      type="number"
                      value={year || ''}
                      onChange={(e) => setYear(Number(e.target.value))}
                      placeholder="Ej: 2022"
                      className={`w-full px-3 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.year ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.year && <p className="text-[11px] text-red-600">{errors.year}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="color" className="block text-xs font-bold text-slate-700 uppercase">Color Predominante <span className="text-red-500">*</span></label>
                    <input
                      id="color"
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="Ej: Blanco, Rojo Metálico, Gris"
                      className={`w-full px-3 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.color ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.color && <p className="text-[11px] text-red-600">{errors.color}</p>}
                  </div>

                  <div className="sm:col-span-1 space-y-1">
                    <label htmlFor="chassis" className="block text-xs font-bold text-slate-700 uppercase">Nº Chasis / VIN <span className="text-red-500">*</span></label>
                    <input
                      id="chassis"
                      type="text"
                      value={chassisNumber}
                      onChange={(e) => setChassisNumber(e.target.value.toUpperCase())}
                      placeholder="17 dígitos alfanuméricos"
                      className={`w-full px-3 py-2 border text-sm font-mono rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.chassisNumber ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.chassisNumber && <p className="text-[11px] text-red-600">{errors.chassisNumber}</p>}
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label htmlFor="motor" className="block text-xs font-bold text-slate-700 uppercase">Nº Motor <span className="text-red-500">*</span></label>
                    <input
                      id="motor"
                      type="text"
                      value={motorNumber}
                      onChange={(e) => setMotorNumber(e.target.value.toUpperCase())}
                      placeholder="Ej: K12M182937"
                      className={`w-full px-3 py-2 border text-sm font-mono rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.motorNumber ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.motorNumber && <p className="text-[11px] text-red-600">{errors.motorNumber}</p>}
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex items-start gap-2.5 mt-2 text-xs text-blue-800">
                  <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Consejo:</strong> Todos estos datos figuran detalladamente en tu padrón. Asegúrate de digitarlos idénticamente para evitar observaciones o demoras en la revisión por parte de los funcionarios de Aduanas en Los Libertadores.
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: SEGURO Y VIAJE */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#002F6C]">3. Cobertura de Seguro y Plan de Viaje</h3>
                  <p className="text-xs text-slate-500">De acuerdo con convenios internacionales, es obligatorio contar con seguro vigente para circular en Argentina.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label htmlFor="insurance-company" className="block text-xs font-bold text-slate-700 uppercase">Compañía Aseguradora SOAPEX <span className="text-red-500">*</span></label>
                    <select
                      id="insurance-company"
                      value={insuranceCompany}
                      onChange={(e) => setInsuranceCompany(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                    >
                      <option value="HDI Seguros (SOAPEX)">HDI Seguros</option>
                      <option value="Consorcio Seguros">Consorcio Seguros</option>
                      <option value="Liberty Seguros">Liberty Seguros</option>
                      <option value="Mapfre SOAPEX">Mapfre Seguros</option>
                      <option value="BCI Seguros">BCI Seguros</option>
                      <option value="Sura SOAPEX">Seguros SURA</option>
                      <option value="Otra Compañía Certificada">Otra Compañía / Corredor</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="insurance-policy" className="block text-xs font-bold text-slate-700 uppercase">Número Póliza de Seguro <span className="text-red-500">*</span></label>
                    <input
                      id="insurance-policy"
                      type="text"
                      value={insurancePolicyNumber}
                      onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                      placeholder="Ej: SPX-2026-104928"
                      className={`w-full px-3 py-2 border text-sm font-mono rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.insurancePolicyNumber ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.insurancePolicyNumber && <p className="text-[11px] text-red-600">{errors.insurancePolicyNumber}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="departure-date" className="block text-xs font-bold text-slate-700 uppercase">Fecha Salida de Chile <span className="text-red-500">*</span></label>
                    <input
                      id="departure-date"
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className={`w-full px-3 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.departureDate ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.departureDate && <p className="text-[11px] text-red-600">{errors.departureDate}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="return-date" className="block text-xs font-bold text-slate-700 uppercase">Fecha Retorno a Chile <span className="text-red-500">*</span></label>
                    <input
                      id="return-date"
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className={`w-full px-3 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.returnDate ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.returnDate && <p className="text-[11px] text-red-600">{errors.returnDate}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="passenger-count" className="block text-xs font-bold text-slate-700 uppercase">Total de Pasajeros <span className="text-red-500">*</span></label>
                    <input
                      id="passenger-count"
                      type="number"
                      min={1}
                      max={15}
                      value={passengerCount || ''}
                      onChange={(e) => setPassengerCount(Number(e.target.value))}
                      placeholder="Conductor incluido (Ej: 4)"
                      className={`w-full px-3 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.passengerCount ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.passengerCount && <p className="text-[11px] text-red-600">{errors.passengerCount}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="destination" className="block text-xs font-bold text-slate-700 uppercase">Destino en Argentina <span className="text-red-500">*</span></label>
                    <input
                      id="destination"
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Ej: Mendoza Capital, Bariloche, San Rafael"
                      className={`w-full px-3 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.destination ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.destination && <p className="text-[11px] text-red-600">{errors.destination}</p>}
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-2 space-y-1 text-xs text-amber-800">
                  <h5 className="font-bold uppercase flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                    Advertencia Legal de Aduanas:
                  </h5>
                  <p>
                    La admisión temporal autorizada de un vehículo chileno en Argentina está condicionada a fines exclusivamente turísticos. Queda estrictamente prohibido arrendar, ceder o utilizar el vehículo registrado para fines comerciales o de carga en territorio argentino sin los permisos especiales de transporte internacional correspondientes.
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 4: RESUMEN DE REGISTRO */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#002F6C]">4. Confirmación de Declaración Jurada</h3>
                  <p className="text-xs text-slate-500">Revise detalladamente la información consolidada antes de proceder con el envío oficial.</p>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Driver Summary */}
                  <div className="border border-white/50 bg-white/40 backdrop-blur-sm rounded-xl overflow-hidden">
                    <div className="bg-[#002F6C]/5 px-3 py-2.5 font-bold border-b border-white/40 text-[#002F6C] flex justify-between items-center">
                      <span>DATOS DEL CONDUCTOR</span>
                      <button type="button" id="btn-edit-step-1" onClick={() => setStep(1)} className="text-[11px] text-blue-700 hover:underline font-bold">Editar</button>
                    </div>
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                      <p><strong>Nombre Conductor:</strong> {driverName}</p>
                      <p><strong>RUT Conductor:</strong> {driverRut}</p>
                      <p><strong>Email:</strong> {driverEmail}</p>
                      <p><strong>Teléfono:</strong> {driverPhone}</p>
                      <p className="sm:col-span-2"><strong>Dirección:</strong> {driverAddress}</p>
                      <p className="sm:col-span-2 mt-1 pt-1 border-t border-white/40 font-semibold text-slate-800">
                        Propietario del Vehículo: {isOwner ? 'SÍ, el conductor es propietario legal' : `NO (Dueño legal: ${ownerName}, RUT: ${ownerRut})`}
                      </p>
                    </div>
                  </div>

                  {/* Vehicle Summary */}
                  <div className="border border-white/50 bg-white/40 backdrop-blur-sm rounded-xl overflow-hidden">
                    <div className="bg-[#002F6C]/5 px-3 py-2.5 font-bold border-b border-white/40 text-[#002F6C] flex justify-between items-center">
                      <span>DATOS DEL VEHÍCULO</span>
                      <button type="button" id="btn-edit-step-2" onClick={() => setStep(2)} className="text-[11px] text-blue-700 hover:underline font-bold">Editar</button>
                    </div>
                    <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                      <p><strong>Patente:</strong> <span className="font-mono bg-white/60 border border-slate-200/40 px-1 rounded font-bold">{plate}</span></p>
                      <p><strong>Tipo:</strong> {vehicleType}</p>
                      <p className="col-span-2"><strong>Marca/Modelo:</strong> {brand} {model}</p>
                      <p><strong>Año:</strong> {year}</p>
                      <p><strong>Color:</strong> {color}</p>
                      <p className="col-span-2"><strong>VIN/Chasis:</strong> <span className="font-mono">{chassisNumber}</span></p>
                      <p className="col-span-2"><strong>Nº Motor:</strong> <span className="font-mono">{motorNumber}</span></p>
                    </div>
                  </div>

                  {/* Insurance & Trip Summary */}
                  <div className="border border-white/50 bg-white/40 backdrop-blur-sm rounded-xl overflow-hidden">
                    <div className="bg-[#002F6C]/5 px-3 py-2.5 font-bold border-b border-white/40 text-[#002F6C] flex justify-between items-center">
                      <span>SEGURO Y PLAN DE VIAJE</span>
                      <button type="button" id="btn-edit-step-3" onClick={() => setStep(3)} className="text-[11px] text-blue-700 hover:underline font-bold">Editar</button>
                    </div>
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                      <p><strong>Aseguradora:</strong> {insuranceCompany}</p>
                      <p><strong>Póliza Seguro:</strong> <span className="font-mono">{insurancePolicyNumber}</span></p>
                      <p><strong>Fecha Salida:</strong> {departureDate ? new Date(departureDate + 'T12:00:00').toLocaleDateString('es-CL') : ''}</p>
                      <p><strong>Fecha Retorno:</strong> {returnDate ? new Date(returnDate + 'T12:00:00').toLocaleDateString('es-CL') : ''}</p>
                      <p><strong>Nº Pasajeros:</strong> {passengerCount}</p>
                      <p><strong>Destino:</strong> {destination}</p>
                    </div>
                  </div>

                  {/* Honor Declaration Checkbox */}
                  <div className="p-4 bg-slate-50/50 backdrop-blur-xs rounded-xl border border-white/30 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="declaration-checkbox"
                        required
                        className="mt-1 w-4 h-4 text-blue-900 border-slate-300 rounded focus:ring-blue-600 focus:outline-none cursor-pointer"
                      />
                      <label htmlFor="declaration-checkbox" className="text-slate-600 leading-snug cursor-pointer select-none">
                        Declaro bajo juramento que los datos ingresados en este formulario son totalmente fidedignos y exactos. Entiendo que la falsificación de esta información constituye un delito aduanero y de fe pública, sancionado por las leyes chilenas.
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Form Navigation Buttons */}
          <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-6 no-print">
            {step > 1 ? (
              <button
                type="button"
                id="btn-form-prev"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </button>
            ) : (
              <div /> // spacer
            )}

            {step < 4 ? (
              <button
                type="button"
                id="btn-form-next"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#002F6C] text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors shadow-sm"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                id="btn-form-submit"
                className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Enviar Registro Digital
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
