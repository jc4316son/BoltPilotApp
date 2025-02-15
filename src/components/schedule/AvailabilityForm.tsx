import React from 'react';
import { Calendar } from 'lucide-react';
import type { Availability } from '../../types';

interface AvailabilityFormProps {
  onSubmit: (availability: Omit<Availability, 'id' | 'pilotId'>) => void;
}

export function AvailabilityForm({ onSubmit }: AvailabilityFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onSubmit({
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      isAvailable: formData.get('status') === 'available',
    });
    
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-800">Set Availability</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="available"
                defaultChecked
                className="text-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Available</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="unavailable"
                className="text-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Unavailable</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Set Availability
        </button>
      </div>
    </form>
  );
}