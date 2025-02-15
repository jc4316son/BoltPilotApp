import React from 'react';
import { BarChart, Clock, Award, Calendar as CalendarIcon } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, John</h1>
        <p className="text-gray-600">Here's your flight status overview</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Clock className="h-8 w-8 text-blue-500" />}
          title="Total Hours"
          value="1,234"
        />
        <StatCard
          icon={<BarChart className="h-8 w-8 text-green-500" />}
          title="Last 90 Days"
          value="87"
        />
        <StatCard
          icon={<Award className="h-8 w-8 text-purple-500" />}
          title="Certifications"
          value="4 Active"
        />
        <StatCard
          icon={<CalendarIcon className="h-8 w-8 text-red-500" />}
          title="Next Flight"
          value="Tomorrow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Flights</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <FlightCard key={i} />
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <EventCard key={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        {icon}
        <div className="text-right">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

function FlightCard() {
  return (
    <div className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">LAX → SFO</p>
          <p className="text-sm text-gray-600">Boeing 737-800</p>
        </div>
        <p className="text-sm text-gray-600">2h 15m</p>
      </div>
    </div>
  );
}

function EventCard() {
  return (
    <div className="border-l-4 border-purple-500 bg-gray-50 p-4 rounded">
      <p className="font-semibold">Annual Training</p>
      <p className="text-sm text-gray-600">March 15, 2024</p>
    </div>
  );
}