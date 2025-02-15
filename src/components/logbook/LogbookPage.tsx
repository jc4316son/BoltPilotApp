import React, { useState, useEffect } from 'react';
import { LogbookEntry } from './LogbookEntry';
import { LogbookTable } from './LogbookTable';
import type { Flight } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';

export function LogbookPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadFlights();
    }
  }, [user]);

  const loadFlights = async () => {
    try {
      const { data, error } = await supabase
        .from('flights')
        .select('*')
        .eq('pilot_id', user?.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading flights:', error);
        return;
      }

      // Map database columns to our TypeScript interface
      const mappedFlights: Flight[] = (data || []).map(flight => ({
        id: flight.id,
        date: flight.date,
        aircraftType: flight.aircraft_type,
        departureAirport: flight.departure_airport,
        arrivalAirport: flight.arrival_airport,
        totalTime: flight.total_time,
        nightTime: flight.night_time,
        instrumentTime: flight.instrument_time,
        isIFR: flight.is_ifr,
        remarks: flight.remarks,
        pilotId: flight.pilot_id
      }));

      setFlights(mappedFlights);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewFlight = async (flight: Omit<Flight, 'id' | 'pilotId'>) => {
    if (!user) {
      alert('Please sign in to add flights');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('flights')
        .insert([
          {
            date: flight.date,
            aircraft_type: flight.aircraftType,
            departure_airport: flight.departureAirport,
            arrival_airport: flight.arrivalAirport,
            total_time: flight.totalTime,
            night_time: flight.nightTime,
            instrument_time: flight.instrumentTime,
            is_ifr: flight.isIFR,
            remarks: flight.remarks,
            pilot_id: user.id
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error saving flight:', error);
        throw error;
      }

      if (data) {
        const newFlight: Flight = {
          id: data.id,
          date: data.date,
          aircraftType: data.aircraft_type,
          departureAirport: data.departure_airport,
          arrivalAirport: data.arrival_airport,
          totalTime: data.total_time,
          nightTime: data.night_time,
          instrumentTime: data.instrument_time,
          isIFR: data.is_ifr,
          remarks: data.remarks,
          pilotId: data.pilot_id
        };
        setFlights((prev) => [newFlight, ...prev]);
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
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
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'logbook.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please sign in to view and manage your logbook entries
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Flight Logbook</h1>
      <LogbookEntry onSubmit={handleNewFlight} />
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Flight History</h2>
          <button
            onClick={handleExport}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Export to CSV
          </button>
        </div>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <LogbookTable flights={flights} />
        )}
      </div>
    </div>
  );
}