import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { AvailabilityForm } from './AvailabilityForm';
import type { Availability } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';

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

export function SchedulePage() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadAvailability();
    }
  }, [user]);

  const loadAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .eq('pilot_id', user?.id)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error loading availability:', error);
        return;
      }

      // Map database columns to our TypeScript interface
      const mappedAvailability: Availability[] = (data || []).map(avail => ({
        id: avail.id,
        pilotId: avail.pilot_id,
        startDate: avail.start_date,
        endDate: avail.end_date,
        isAvailable: avail.is_available
      }));

      setAvailability(mappedAvailability);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (info: any) => {
    // Only show details for flight events, not availability
    if (info.event.extendedProps.type !== 'availability') {
      setSelectedEvent(info.event);
    }
  };

  const handleNewAvailability = async (newAvailability: Omit<Availability, 'id' | 'pilotId'>) => {
    if (!user) {
      alert('Please sign in to set availability');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('availability')
        .insert([
          {
            start_date: newAvailability.startDate,
            end_date: newAvailability.endDate,
            is_available: newAvailability.isAvailable,
            pilot_id: user.id
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error saving availability:', error);
        throw error;
      }

      if (data) {
        const availabilityEntry: Availability = {
          id: data.id,
          pilotId: data.pilot_id,
          startDate: data.start_date,
          endDate: data.end_date,
          isAvailable: data.is_available
        };
        setAvailability((prev) => [...prev, availabilityEntry]);
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const availabilityEvents = availability.map((a) => ({
    start: a.startDate,
    end: a.endDate,
    display: 'background',
    backgroundColor: a.isAvailable ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.2)',
    extendedProps: {
      type: 'availability',
      isAvailable: a.isAvailable
    }
  }));

  const flightEvents = MOCK_EVENTS.map(event => ({
    ...event,
    extendedProps: {
      ...event.extendedProps,
      type: 'flight'
    }
  }));

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
                Please sign in to view and manage your schedule
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Schedule</h1>
        <p className="text-gray-600">Manage your flights and availability</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              events={[...flightEvents, ...availabilityEvents]}
              eventClick={handleEventClick}
              height="auto"
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
            />
          )}
        </div>

        <div className="space-y-6">
          <AvailabilityForm onSubmit={handleNewAvailability} />

          {selectedEvent && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CalendarIcon className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Flight Details</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Time</p>
                    <p className="text-gray-600">
                      {format(new Date(selectedEvent.start), 'h:mm a')} -{' '}
                      {format(new Date(selectedEvent.end), 'h:mm a')}
                    </p>
                  </div>
                </div>

                {selectedEvent.extendedProps.aircraft && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">Aircraft</p>
                      <p className="text-gray-600">{selectedEvent.extendedProps.aircraft}</p>
                    </div>
                  </div>
                )}

                {selectedEvent.extendedProps.crew && (
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">Crew</p>
                      <ul className="text-gray-600">
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