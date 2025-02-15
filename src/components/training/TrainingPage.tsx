import React, { useState } from 'react';
import { Book, CheckCircle, Clock, Play, Award } from 'lucide-react';
import { TrainingModule } from './TrainingModule';
import { SafetyBulletin } from './SafetyBulletin';

const MOCK_MODULES = [
  {
    id: '1',
    title: 'Emergency Procedures Review',
    description: 'Comprehensive review of emergency procedures for commercial operations',
    duration: '45 minutes',
    category: 'Safety',
    progress: 0,
    dueDate: '2024-04-15',
    thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2069',
  },
  {
    id: '2',
    title: 'Weather Pattern Analysis',
    description: 'Advanced techniques for analyzing and interpreting weather patterns',
    duration: '60 minutes',
    category: 'Operations',
    progress: 75,
    dueDate: '2024-03-30',
    thumbnail: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&q=80&w=2069',
  },
  {
    id: '3',
    title: 'Crew Resource Management',
    description: 'Best practices for effective crew communication and coordination',
    duration: '90 minutes',
    category: 'Communication',
    progress: 100,
    completedDate: '2024-02-28',
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2069',
  },
];

const MOCK_BULLETINS = [
  {
    id: '1',
    title: 'Updated De-icing Procedures',
    source: 'FAA',
    date: '2024-03-10',
    priority: 'high',
    summary: 'New guidelines for winter operations and de-icing procedures',
  },
  {
    id: '2',
    title: 'ATC Communication Protocol Update',
    source: 'NBAA',
    date: '2024-03-08',
    priority: 'medium',
    summary: 'Revised communication protocols for high-traffic airspace',
  },
];

export function TrainingPage() {
  const [activeTab, setActiveTab] = useState<'required' | 'completed'>('required');
  
  const requiredModules = MOCK_MODULES.filter(m => m.progress < 100);
  const completedModules = MOCK_MODULES.filter(m => m.progress === 100);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Training & Safety</h1>
        <p className="text-gray-600">Stay current with required training and safety updates</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Training Progress Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Training Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={<Book className="h-8 w-8 text-blue-500" />}
                title="Required Modules"
                value={requiredModules.length.toString()}
              />
              <StatCard
                icon={<CheckCircle className="h-8 w-8 text-green-500" />}
                title="Completed"
                value={completedModules.length.toString()}
              />
              <StatCard
                icon={<Clock className="h-8 w-8 text-purple-500" />}
                title="Hours This Month"
                value="4.5"
              />
            </div>
          </div>

          {/* Training Modules */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Training Modules</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('required')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'required'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Required
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'completed'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {(activeTab === 'required' ? requiredModules : completedModules).map((module) => (
                <TrainingModule key={module.id} module={module} />
              ))}
            </div>
          </div>
        </div>

        {/* Safety Bulletins */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Safety Bulletins</h2>
              <button className="text-blue-500 hover:text-blue-600">View All</button>
            </div>
            <div className="space-y-4">
              {MOCK_BULLETINS.map((bulletin) => (
                <SafetyBulletin key={bulletin.id} bulletin={bulletin} />
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Award className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Recent Achievements</h2>
            </div>
            <div className="space-y-4">
              <AchievementCard
                title="Safety Champion"
                description="Completed all safety modules for Q1 2024"
                date="March 1, 2024"
              />
              <AchievementCard
                title="Perfect Attendance"
                description="Completed all required training on time"
                date="February 15, 2024"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
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

function AchievementCard({ title, description, date }: { title: string; description: string; date: string }) {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
      <Award className="h-5 w-5 text-yellow-500 mt-0.5" />
      <div>
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-500 mt-1">{date}</p>
      </div>
    </div>
  );
}