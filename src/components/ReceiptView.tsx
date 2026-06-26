/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from 'react';
import { VehicleRegistration } from '../types';
import { Shield, QrCode, Printer, CheckCircle, AlertTriangle, XCircle, Info, FileText } from 'lucide-react';

interface ReceiptViewProps {
  registration: VehicleRegistration;
  onBack?: () => void;
}

export default function ReceiptView({ registration, onBack }: ReceiptViewProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprobado':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>AUTORIZADO</span>
          </div>
        );
      case 'rechazado':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            <span>RECHAZADO</span>
          </div>
        );
      case 'observado':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>CON OBSERVACIONES</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">
            <Info className="w-3.5 h-3.5" />
            <span>PENDIENTE DE REVISIÓN</span>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Action panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center glass-morphism p-4 rounded-2xl border border-white/50 shadow-lg gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#002F6C]/10 text-[#002F6C] rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#002F6C] text-sm sm:text-base">Documento de Viaje Digital</h3>
            <p className="text-xs text-slate-500 font-mono">Folio: {registration.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onBack && (
            <button
              onClick={onBack}
              id="btn-receipt-back"
              className="flex-1 sm:flex-none px-4 py-2 border border-white/40 text-slate-700 rounded-lg text-sm font-bold hover:bg-white/50 transition-all cursor-pointer"
            >
              Volver
            </button>
          )}
          <button
            onClick={handlePrint}
            id="btn-receipt-print"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#002F6C] hover:bg-blue-800 text-white rounded-lg text-sm font-bold transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir Formulario
          </button>
        </div>
      </div>

      {/* Warning/Info Box based on status */}
      <div className="glass-morphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-3 no-print">
        <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-700" />
          Indicaciones importantes para el viaje:
        </h4>
        <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5">
          <li>
            <strong>Presentación en Aduana:</strong> Debe presentar este documento impreso o en su dispositivo móvil junto a su cédula de identidad, padrón del vehículo y póliza de seguro SOAPEX en las ventanillas del Paso Los Libertadores.
          </li>
          {registration.status === 'aprobado' ? (
            <li className="text-emerald-700 font-semibold">
              <strong>Estado AUTORIZADO:</strong> Su registro digital ha sido validado previamente por inspectores de aduanas. Esto agilizará considerablemente su atención presencial en el control fronterizo.
            </li>
          ) : registration.status === 'observado' ? (
            <li className="text-amber-700 font-semibold">
              <strong>Estado CON OBSERVACIONES:</strong> {registration.officerComments || 'El inspector ha detectado inconsistencias. Por favor, revise el detalle y acérquese al personal aduanero.'}
            </li>
          ) : registration.status === 'rechazado' ? (
            <li className="text-red-700 font-semibold">
              <strong>Estado RECHAZADO:</strong> {registration.officerComments || 'Su solicitud de viaje ha sido rechazada. No se le permitirá cruzar la frontera con este registro. Debe corregir los problemas indicados y crear un nuevo formulario.'}
            </li>
          ) : (
            <li className="text-blue-700 font-semibold">
              <strong>Estado PENDIENTE:</strong> Su formulario está registrado en el sistema. El inspector aduanero revisará los datos en tiempo real al momento de su arribo al Paso Los Libertadores o previamente vía online.
            </li>
          )}
          {!registration.isOwner && (
            <li className="text-amber-700 font-semibold">
              <strong>Atención:</strong> Como usted no es el propietario registrado del vehículo, es REQUISITO OBLIGATORIO presentar una autorización notarial original otorgada por el propietario para salir del país.
            </li>
          )}
          <li>
            La vigencia máxima autorizada de admisión temporal en Argentina para vehículos particulares chilenos es habitualmente de hasta <strong>90 días</strong>, sujeto a la decisión de la aduana argentina (AFIP).
          </li>
        </ul>
      </div>

      {/* Official Form Document */}
      <div 
        ref={printRef} 
        id="official-document-sheet"
        className="bg-white border-2 border-slate-300 p-6 sm:p-10 rounded-none shadow-sm print:shadow-none print:border-none relative font-sans text-slate-800"
      >
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-5 mb-6">
          <div className="flex gap-4">
            {/* Minimalist Coat of Arms Shield Icon */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-14 border border-slate-800 flex flex-col justify-between p-1 bg-slate-50 relative">
                {/* Visual indicator of Chilean flag elements */}
                <div className="h-3 bg-[#002F6C] flex items-center justify-start px-0.5">
                  <div className="w-1.5 h-1.5 bg-white rotate-45 transform origin-center" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                </div>
                <div className="h-3 bg-red-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-slate-700 opacity-80" />
                </div>
              </div>
              <span className="text-[9px] font-bold text-center leading-tight mt-1">ADUANAS</span>
              <span className="text-[8px] text-center text-slate-500 font-medium uppercase tracking-wider">CHILE</span>
            </div>
            
            <div className="space-y-0.5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-900">Gobierno de Chile</p>
              <p className="text-[11px] font-medium uppercase text-slate-600">Servicio Nacional de Aduanas</p>
              <p className="text-[10px] text-slate-500">Dirección Regional de Valparaíso</p>
              <p className="text-[10px] text-slate-500">Aduana Los Andes - Paso Los Libertadores</p>
            </div>
          </div>
          
          <div className="text-right space-y-1">
            <div className="inline-block border-2 border-red-600 px-4 py-1.5 bg-red-50 text-red-700">
              <p className="text-[10px] font-bold uppercase text-center leading-none">FOLIO ÚNICO</p>
              <p className="text-sm font-mono font-bold mt-0.5">{registration.id}</p>
            </div>
            <p className="text-[10px] text-slate-500">Fecha Registro: {new Date(registration.createdAt).toLocaleString('es-CL')}</p>
          </div>
        </div>

        {/* Form Title */}
        <div className="text-center space-y-1.5 mb-8">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wide text-slate-900 leading-snug">
            Declaración Jurada Única de Salida y Admisión Temporal de Vehículos
          </h2>
          <p className="text-[11px] text-slate-600 font-medium italic">
            Convenio de Facilidades Fronterizas de Transporte Terrestre Chile - Argentina
          </p>
        </div>

        {/* Section 1: Conductor / Propietario */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 border-l-4 border-[#002F6C] text-slate-900">
            1. Identificación del Conductor y Propietario
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Nombre del Conductor:</span>
              <p className="font-semibold text-slate-900 mt-0.5">{registration.driverName}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">R.U.T. Conductor:</span>
              <p className="font-semibold text-slate-900 mt-0.5">{registration.driverRut}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Correo Electrónico:</span>
              <p className="font-semibold text-slate-900 mt-0.5">{registration.driverEmail}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Teléfono de Contacto:</span>
              <p className="font-semibold text-slate-900 mt-0.5">{registration.driverPhone}</p>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 font-medium">Dirección Particular:</span>
              <p className="font-semibold text-slate-900 mt-0.5">{registration.driverAddress}</p>
            </div>
            <div className="sm:col-span-2 border-t border-dashed border-slate-200 pt-2 mt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Relación con el Vehículo:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${registration.isOwner ? 'bg-blue-50 text-[#002F6C]' : 'bg-amber-50 text-amber-800'}`}>
                  {registration.isOwner ? 'Conductor es el Propietario' : 'Conductor Autorizado (No Propietario)'}
                </span>
              </div>
              {!registration.isOwner && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 bg-slate-50 p-2 border border-slate-200">
                  <div>
                    <span className="text-[11px] text-slate-500">Nombre Propietario Legal:</span>
                    <p className="text-xs font-semibold text-slate-800">{registration.ownerName || 'No especificado'}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">R.U.T. Propietario:</span>
                    <p className="text-xs font-semibold text-slate-800">{registration.ownerRut || 'No especificado'}</p>
                  </div>
                  <div className="sm:col-span-2 text-[10px] text-amber-700 italic flex items-start gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>Se requiere presentar obligatoriamente en frontera el poder notarial firmado por el propietario con vigencia no mayor a 90 días.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Datos del Vehículo */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 border-l-4 border-[#002F6C] text-slate-900">
            2. Características del Vehículo Particular
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Patente (Chile):</span>
              <p className="font-mono font-bold text-slate-900 mt-0.5 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 w-max text-sm uppercase">
                {registration.plate}
              </p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Tipo Vehículo:</span>
              <p className="font-semibold text-slate-900 mt-0.5">{registration.vehicleType}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Marca / Modelo:</span>
              <p className="font-semibold text-slate-900 mt-0.5">{registration.brand} {registration.model}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Año Fabricación:</span>
              <p className="font-semibold text-slate-900 mt-0.5">{registration.year}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Color:</span>
              <p className="font-semibold text-slate-900 mt-0.5">{registration.color}</p>
            </div>
            <div className="sm:col-span-1">
              <span className="text-slate-500 font-medium">N° de Chasis / VIN:</span>
              <p className="font-mono font-semibold text-slate-900 mt-0.5 truncate" title={registration.chassisNumber}>
                {registration.chassisNumber}
              </p>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 font-medium">N° de Motor:</span>
              <p className="font-mono font-semibold text-slate-900 mt-0.5">{registration.motorNumber}</p>
            </div>
          </div>
        </div>

        {/* Section 3: Seguro y Viaje */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 border-l-4 border-[#002F6C] text-slate-900">
            3. Seguro Obligatorio y Detalles del Viaje
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Compañía Aseguradora Internacional:</span>
              <p className="font-semibold text-slate-900 mt-0.5">{registration.insuranceCompany}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">N° de Póliza Internacional / SOAPEX:</span>
              <p className="font-mono font-semibold text-slate-900 mt-0.5">{registration.insurancePolicyNumber}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 font-medium">Salida Estimada:</span>
                <p className="font-semibold text-slate-900 mt-0.5">{new Date(registration.departureDate + 'T12:00:00').toLocaleDateString('es-CL')}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Retorno Estimado:</span>
                <p className="font-semibold text-slate-900 mt-0.5">{new Date(registration.returnDate + 'T12:00:00').toLocaleDateString('es-CL')}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 font-medium">Pasajeros a Bordo:</span>
                <p className="font-semibold text-slate-900 mt-0.5">{registration.passengerCount} {registration.passengerCount === 1 ? 'persona' : 'personas'}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Destino Declarado:</span>
                <p className="font-semibold text-slate-900 mt-0.5 truncate" title={registration.destination}>{registration.destination}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Aduanas Control Block */}
        <div className="mt-8 border-t-2 border-slate-800 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Stamp and Inspector Signature */}
            <div className="md:col-span-4 border border-slate-300 p-4 rounded-lg bg-slate-50 h-full flex flex-col justify-between min-h-[140px]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block mb-2">TIMBRE Y VALIDACIÓN INTERNA</span>
                {getStatusBadge(registration.status)}
              </div>
              <div className="text-[10px] text-slate-600 mt-4 border-t border-slate-200 pt-2">
                {registration.reviewedBy ? (
                  <>
                    <p className="font-semibold">{registration.reviewedBy}</p>
                    <p>Revisado: {new Date(registration.reviewedAt!).toLocaleString('es-CL')}</p>
                  </>
                ) : (
                  <p className="italic text-slate-400">Pendiente de revisión presencial</p>
                )}
              </div>
            </div>

            {/* Declaration of honor and signature */}
            <div className="md:col-span-5 text-center px-4 flex flex-col justify-between h-full min-h-[140px]">
              <p className="text-[9px] text-slate-500 leading-tight text-justify">
                Declaro bajo juramento que los datos contenidos en este formulario son fidedignos y que el vehículo que egresa temporalmente del territorio nacional retornará al país en el plazo que determine la autoridad competente, de acuerdo a la normativa legal vigente del Servicio Nacional de Aduanas de Chile.
              </p>
              
              <div className="mt-6 border-t border-slate-400 w-3/4 mx-auto pt-1.5">
                <span className="text-[10px] uppercase text-slate-600 block font-medium">Firma del Conductor</span>
                <span className="text-[8px] text-slate-400 block mt-0.5">{registration.driverRut}</span>
              </div>
            </div>

            {/* QR Code Validation */}
            <div className="md:col-span-3 flex flex-col items-center justify-center p-3 border border-slate-200 bg-white rounded-lg h-full min-h-[140px]">
              <QrCode className="w-18 h-18 text-[#002F6C] stroke-[1.5]" />
              <span className="text-[9px] font-bold font-mono text-slate-500 mt-2 text-center uppercase">
                VALIDACIÓN DIGITAL
              </span>
              <span className="text-[8px] font-mono text-slate-400 text-center select-none">
                {registration.id.substring(7)}
              </span>
            </div>

          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-8 pt-4 border-t border-dashed border-slate-300 text-center">
          <p className="text-[9px] text-slate-400">
            Formulario FADTV-V1. Generado electrónicamente en el Portal Aduanero Digital del Paso Los Libertadores.
          </p>
          <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
            IMPORTANTE: Documento de control internacional. Cualquier alteración de este documento constituye delito de falsificación.
          </p>
        </div>
      </div>
    </div>
  );
}
