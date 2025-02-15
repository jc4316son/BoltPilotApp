import React, { useState } from 'react';
import { LogbookEntry } from './LogbookEntry';
import { LogbookTable } from './LogbookTable';
import type { Flight } from '../../types';

const MOCK_FLIGHTS: Flight[] = [
  {
    id: '1',
    date: '2024-03-10',
    aircraftType: 'B737-800',
    departureAirport: 'KLAX',
    arrivalAirport: 'KSFO',
    totalTime: 2.3,
    nightTime: 0,
    instrumentTime: 1.5,
    isIFR: true,
    remarks: 'Standard departure, smooth flight',
    pilotId: 'pilot1',
  },
  {
    id: '2',
    date: '2024-03-09',
    aircraftType: 'A320',
    departureAirport: 'KSFO',
    arrivalAirport: 'KLAS',
    totalTime: 1.8,
    nightTime: 1.8,
    instrumentTime: 0.5,
    isIFR: true,
    remarks: 'Night flight, moderate turbulence',
    pilotId: 'pilot1',
  },
];

export function LogbookPage() {
  const [flights, setFlights] = useState<Flight[]>(MOCK_FLIGHTS);

  const handleNewFlight = (flight: Omit<Flight, 'id' | 'pilotId'>) => {
    const newFlight: Flight = {
      ...flight,
      id: crypto.randomUUID(),
      pilotId: 'pilot1', // This would come from auth context in a real app
    };
    setFlights((prev) => [newFlight, ...prev]);
  };

  const handleExport = () => {
    const csv = [
      ['Date', 'Aircraft', 'From', 'To', 'Total Time', 'Night', 'Instrument', 'Type', 'Remarks'],
      ...flights.map((f) => [
        f.date,
        f.aircraftType,
        f.departureAirport,
        f.arrivalAirport,
        f.totalTime,
        f.nightTime,
        f.instrumentTime,
        f.isIFR ? 'IFR' : 'VFR',
        f.remarks,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flight-log.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Flight Logbook</h1>
        <p className="text-gray-600">Record and track your flight hours</p>
      </header>

      <LogbookEntry onSubmit={handleNewFlight} />
      <LogbookTable flights={flights} onExport={handleExport} />
    </div>
  );
}