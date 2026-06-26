/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VehicleRegistration } from './types';

// Helper to generate a unique folio
export function generateFolio(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000); // 5 digits
  return `ADU-CL-${year}-${randomNum}`;
}

export const INITIAL_REGISTRATIONS: VehicleRegistration[] = [
  {
    id: 'ADU-CL-2026-84912',
    createdAt: '2026-06-24T09:15:30Z',
    driverName: 'Sebastián Ignacio Olivares Pinto',
    driverRut: '18.432.901-K',
    driverEmail: 's.olivares@gmail.com',
    driverPhone: '+56 9 8472 9102',
    driverAddress: 'Av. Providencia 1240, Depto 402, Santiago',
    isOwner: true,
    plate: 'HGPB-42',
    vehicleType: 'Automóvil',
    brand: 'Mazda',
    model: 'CX-5',
    year: 2021,
    chassisNumber: 'JM3KF2W70M0384912',
    motorNumber: 'PE3049182',
    color: 'Gris Grafito',
    insuranceCompany: 'HDI Seguros (SOAPEX)',
    insurancePolicyNumber: 'SPX-2026-948123',
    departureDate: '2026-06-26',
    returnDate: '2026-07-02',
    passengerCount: 3,
    destination: 'Mendoza (Ciudad)',
    status: 'aprobado',
    reviewedBy: 'Inspector R. Carrasco',
    reviewedAt: '2026-06-24T10:30:00Z',
    officerComments: 'Documentación al día. Póliza SOAPEX válida y vigente. Autorizado para salir.',
  },
  {
    id: 'ADU-CL-2026-30294',
    createdAt: '2026-06-24T11:20:15Z',
    driverName: 'Carolina Andrea Espinoza Vergara',
    driverRut: '15.783.224-5',
    driverEmail: 'caro.espinoza@outlook.cl',
    driverPhone: '+56 9 7291 3849',
    driverAddress: 'Condominio El Roble, Casa 14, Los Andes',
    isOwner: false,
    ownerName: 'Juan Bautista Espinoza Arancibia',
    ownerRut: '9.382.471-2',
    plate: 'KLLS-89',
    vehicleType: 'Station Wagon',
    brand: 'Subaru',
    model: 'Outback',
    year: 2023,
    chassisNumber: 'JF1BS9LC0L0293481',
    motorNumber: 'FB2539281',
    color: 'Azul Marino',
    insuranceCompany: 'Consorcio Seguros',
    insurancePolicyNumber: 'CON-SPX-394012',
    departureDate: '2026-06-27',
    returnDate: '2026-07-05',
    passengerCount: 4,
    destination: 'San Rafael, Mendoza',
    status: 'pendiente',
  },
  {
    id: 'ADU-CL-2026-10492',
    createdAt: '2026-06-23T14:45:10Z',
    driverName: 'Felipe Andrés Muñoz Castro',
    driverRut: '20.194.837-3',
    driverEmail: 'felipe.munoz@uc.cl',
    driverPhone: '+56 9 6183 2049',
    driverAddress: 'Pasaje Los Alerces 452, San Esteban',
    isOwner: true,
    plate: 'RRDW-34',
    vehicleType: 'Automóvil',
    brand: 'Suzuki',
    model: 'Swift',
    year: 2019,
    chassisNumber: 'JS3ZA83S0K0104921',
    motorNumber: 'K12M18293',
    color: 'Rojo Metálico',
    insuranceCompany: 'Liberty Seguros',
    insurancePolicyNumber: 'LIB-9034812',
    departureDate: '2026-06-25',
    returnDate: '2026-06-29',
    passengerCount: 1,
    destination: 'Uspallata, Las Heras',
    status: 'observado',
    reviewedBy: 'Inspector M. Fuentes',
    reviewedAt: '2026-06-23T16:15:00Z',
    officerComments: 'Falta adjuntar copia legible de la Póliza de Seguro Internacional. Por favor, verificar que el número de póliza corresponda a un SOAPEX válido para Argentina.',
  },
  {
    id: 'ADU-CL-2026-59201',
    createdAt: '2026-06-23T10:10:00Z',
    driverName: 'Gonzalo René Valenzuela Soto',
    driverRut: '17.204.912-8',
    driverEmail: 'gonzalo.valenzuela@yahoo.com',
    driverPhone: '+56 9 9384 1029',
    driverAddress: 'Calle Esmeralda 890, Valparaíso',
    isOwner: true,
    plate: 'FTYY-11',
    vehicleType: 'Motocicleta',
    brand: 'BMW',
    model: 'R 1250 GS',
    year: 2018,
    chassisNumber: 'WB10J5101J0293841',
    motorNumber: '122EN19203',
    color: 'Negro/Amarillo',
    insuranceCompany: 'Mapfre SOAPEX',
    insurancePolicyNumber: 'MAP-SPX-204912',
    departureDate: '2026-06-29',
    returnDate: '2026-07-12',
    passengerCount: 2,
    destination: 'Mendoza, Buenos Aires y Bariloche',
    status: 'aprobado',
    reviewedBy: 'Inspector R. Carrasco',
    reviewedAt: '2026-06-23T11:45:00Z',
    officerComments: 'Revisión técnica y SOAPEX vigentes. Patente coincide. Aprobado.',
  },
  {
    id: 'ADU-CL-2026-47391',
    createdAt: '2026-06-22T17:30:20Z',
    driverName: 'Patricio Alejandro Vera Lagos',
    driverRut: '12.459.201-4',
    driverEmail: 'p.vera@vtr.net',
    driverPhone: '+56 9 5554 3928',
    driverAddress: 'Avenida Alemania 01420, Temuco',
    isOwner: false,
    ownerName: 'Transportes Vera Limitada',
    ownerRut: '76.491.201-K',
    plate: 'HJJR-90',
    vehicleType: 'Camioneta',
    brand: 'Toyota',
    model: 'Hilux 4x4',
    year: 2020,
    chassisNumber: 'MROFR12G0K0392812',
    motorNumber: '1GD293812',
    color: 'Blanco',
    insuranceCompany: 'BCI Seguros',
    insurancePolicyNumber: 'BCI-9940294-12',
    departureDate: '2026-06-25',
    returnDate: '2026-07-05',
    passengerCount: 5,
    destination: 'Potrerillos, Mendoza',
    status: 'rechazado',
    reviewedBy: 'Inspector M. Fuentes',
    reviewedAt: '2026-06-23T09:05:00Z',
    officerComments: 'Rechazado debido a que el conductor no es el dueño y no presentó el Poder Notarial firmado por el representante legal de Transportes Vera Limitada que autorice la salida del vehículo del país. Deberá realizar un nuevo registro con el documento correspondiente.',
  }
];

// Helper to load registrations from LocalStorage or initialize with mock data
export function getRegistrations(): VehicleRegistration[] {
  if (typeof window === 'undefined') return INITIAL_REGISTRATIONS;
  const stored = localStorage.getItem('aduanas_registrations');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored registrations, using initial data', e);
    }
  }
  // Initialize storage
  localStorage.setItem('aduanas_registrations', JSON.stringify(INITIAL_REGISTRATIONS));
  return INITIAL_REGISTRATIONS;
}

// Helper to save registrations to LocalStorage
export function saveRegistrations(registrations: VehicleRegistration[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('aduanas_registrations', JSON.stringify(registrations));
  }
}
