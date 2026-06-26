/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VehicleType = 'Particular' | 'Diplomático' | 'Automóvil' | 'Camioneta' | 'Station Wagon' | 'Motocicleta' | 'Otro';

export type RegistrationStatus = 'pendiente' | 'aprobado' | 'rechazado' | 'observado';

export interface VehicleRegistration {
  id: string; // Folio e.g., ADU-CL-2026-10492
  createdAt: string;
  
  // Propietario / Conductor
  driverName: string;
  driverRut: string;
  driverEmail: string;
  driverPhone: string;
  driverAddress: string;
  isOwner: boolean;
  ownerName?: string;
  ownerRut?: string;
  
  // Vehículo
  plate: string; // Patente
  vehicleType: VehicleType;
  brand: string;
  model: string;
  year: number;
  chassisNumber: string;
  motorNumber: string;
  color: string;
  
  // Seguro Obligatorio (SOAPEX es exigido para viajar a Argentina)
  insuranceCompany: string;
  insurancePolicyNumber: string;
  
  // Viaje
  departureDate: string;
  returnDate: string;
  passengerCount: number;
  destination: string;
  
  // Estado y Control de Aduana
  status: RegistrationStatus;
  officerComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  qrCodeData?: string;
}

export interface BorderControlStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  observed: number;
  byDate: { [key: string]: number };
  byVehicleType: { [key: string]: number };
}
