import React from 'react';
import { Calendar, Clock, Plane, CloudSun, Moon, Navigation } from 'lucide-react';
import type { Flight } from '../../types';

interface LogbookEntryProps {
  onSubmit: (flight: Omit<Flight, 'id' | 'pilotId'>) => void;
}

export function LogbookEntry({ onSubmit }: LogbookEntryProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onSubmit({
      date: formData.get('date') as string,
      aircraftType: formData.get('aircraftType') as string,
      departureAirport: formData.get('departureAirport') as string,
      arrivalAirport: formData.get('arrivalAirport') as string,
      totalTime: parseFloat(formData.get('totalTime') as string),
      nightTime: parseFloat(formData.get('nightTime') as string),
      instrumentTime: parseFloat(formData.get('instrumentTime') as string),
      isIFR: formData.get('isIFR') === 'true',
      remarks: formData.get('remarks') as string,
    });
    
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Log New Flight</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 mr-2" />
              Date
            </label>
            <input
              type="date"
              name="date"
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Plane className="w-4 h-4 mr-2" />
              Aircraft Type
            </label>
            <input
              type="text"
              name="aircraftType"
              placeholder="e.g., B737, A320"
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Navigation className="w-4 h-4 mr-2" />
                From
              </label>
              <input
                type="text"
                name="departureAirport"
                placeholder="ICAO code"
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Navigation className="w-4 h-4 mr-2" />
                To
              </label>
              <input
                type="text"
                name="arrivalAirport"
                placeholder="ICAO code"
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Clock className="w-4 h-4 mr-2" />
              Total Time
            </label>
            <input
              type="number"
              name="totalTime"
              step="0.1"
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Moon className="w-4 h-4 mr-2" />
                Night Time
              </label>
              <input
                type="number"
                name="nightTime"
                step="0.1"
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <CloudSun className="w-4 h-4 mr-2" />
                Instrument
              </label>
              <input
                type="number"
                name="instrumentTime"
                step="0.1"
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="isIFR"
                value="true"
                className="text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">IFR</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="isIFR"
                value="false"
                defaultChecked
                className="text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">VFR</span>
            </label>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Remarks
          </label>
          <textarea
            name="remarks"
            rows={3}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Add any notes about the flight..."
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Log Flight
        </button>
      </div>
    </form>
  );
}