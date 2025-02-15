import React from 'react';
import { MapPin, Award } from 'lucide-react';

interface PilotCardProps {
  pilot: {
    id: string;
    name: string;
    role: string;
    airline: string;
    totalHours: number;
    ratings: string[];
    location: string;
    avatar: string;
    endorsements: number;
  };
}

export function PilotCard({ pilot }: PilotCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start space-x-4">
        <img
          src={pilot.avatar}
          alt={pilot.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">{pilot.name}</h3>
              <p className="text-sm text-gray-600">
                {pilot.role} at {pilot.airline}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-600">{pilot.endorsements}</span>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500 mt-2">
            <MapPin className="h-4 w-4 mr-1" />
            {pilot.location}
          </div>

          <div className="mt-3">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{pilot.totalHours.toLocaleString()}</span> total hours
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {pilot.ratings.map((rating) => (
                <span
                  key={rating}
                  className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                >
                  {rating}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
              Connect
            </button>
            <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}