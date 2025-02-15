import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { AvailabilityForm } from './AvailabilityForm';
import type { Availability } from '../../types';

const MOCK_EVENTS = [
  {
    id: '1',
    title: 'LAX → SFO',
    start: '2024-03-15T08:00:00',
    end: '2024-03-15T10:30:00',
    backgroundColor: '#3b82f6',
    extendedProps: {
      aircraft: 'B737-800',
      crew: ['John Smith', 'Sarah Johnson'],
    },
  },
  {
    id: '2',
    title: 'SFO → SEA',
    start: '2024-03-16T13:00:00',
    end: '2024-03-16T15:30:00',
    backgroundColor: '#3b82f6',
    extendedProps: {
      aircraft: 'B737-800',
      crew: ['John Smith', 'Michael Brown'],
    },
  },
];

const MOCK_AVAILABILITY: Availability[] = [
  {
    id: '1',
    pilotId: 'pilot1',
    startDate: '2024-03-20',
    endDate: '2024-03-25',
    isAvailable: true,
  },
  {
    id: '2',
    pilotId: 'pilot1',
    startDate: '2024-03-28',
    endDate: '2024-03-30',
    isAvailable: false,
  },
];

export function SchedulePage() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [availability, setAvailability] = useState<Availability[]>(MOCK_AVAILABILITY);

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event);
  };

  const handleNewAvailability = (newAvailability: Omit<Availability, 'id' | 'pilotId'>) => {
    const availabilityEntry: Availability = {
      ...newAvailability,
      id: crypto.randomUUID(),
      pilotId: 'pilot1',
    };
    setAvailability((prev) => [...prev, availabilityEntry]);
  };

  const availabilityEvents = availability.map((a) => ({
    start: a.startDate,
    end: a.endDate,
    display: 'background',
    backgroundColor: a.isAvailable ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
  }));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Schedule</h1>
        <p className="text-gray-600">Manage your flights and availability</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={[...MOCK_EVENTS, ...availabilityEvents]}
            eventClick={handleEventClick}
            height="auto"
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
          />
        </div>

        <div className="space-y-6">
          <AvailabilityForm onSubmit={handleNewAvailability} />

          {selectedEvent && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Flight Details</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CalendarIcon className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">
                      {format(new Date(selectedEvent.start), 'MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(selectedEvent.start), 'h:mm a')} - 
                      {format(new Date(selectedEvent.end), 'h:mm a')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <p className="text-gray-800">{selectedEvent.title}</p>
                </div>

                {selectedEvent.extendedProps.aircraft && (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <p className="text-gray-800">{selectedEvent.extendedProps.aircraft}</p>
                  </div>
                )}

                {selectedEvent.extendedProps.crew && (
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">Crew</p>
                      <ul className="text-sm text-gray-600">
                        {selectedEvent.extendedProps.crew.map((member: string) => (
                          <li key={member}>{member}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}