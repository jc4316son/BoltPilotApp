export interface Flight {
  id: string;
  date: string;
  aircraftType: string;
  departureAirport: string;
  arrivalAirport: string;
  totalTime: number;
  nightTime: number;
  instrumentTime: number;
  isIFR: boolean;
  remarks: string;
  pilotId: string;
}

export interface Certification {
  id: string;
  type: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  pilotId: string;
  imageUrl?: string;
}

export interface PilotProfile {
  id: string;
  name: string;
  email: string;
  totalHours: number;
  certifications: Certification[];
  reliability: number;
}

export interface Availability {
  id: string;
  pilotId: string;
  startDate: string;
  endDate: string;
  isAvailable: boolean;
}