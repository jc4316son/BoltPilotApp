import React from 'react';
import { Play, Clock, Award } from 'lucide-react';

interface TrainingModuleProps {
  module: {
    id: string;
    title: string;
    description: string;
    duration: string;
    category: string;
    progress: number;
    dueDate?: string;
    completedDate?: string;
    thumbnail: string;
  };
}

export function TrainingModule({ module }: TrainingModuleProps) {
  return (
    <div className="flex flex-col md:flex-row bg-gray-50 rounded-lg overflow-hidden">
      <div className="w-full md:w-48 h-32 relative">
        <img
          src={module.thumbnail}
          alt={module.title}
          className="w-full h-full object-cover"
        />
        {module.progress === 100 && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-80 flex items-center justify-center">
            <Award className="h-12 w-12 text-white" />
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{module.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{module.description}</p>
          </div>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            {module.category}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              {module.duration}
            </div>
            {module.dueDate && (
              <div className="text-sm text-gray-600">
                Due: {new Date(module.dueDate).toLocaleDateString()}
              </div>
            )}
            {module.completedDate && (
              <div className="text-sm text-green-600">
                Completed: {new Date(module.completedDate).toLocaleDateString()}
              </div>
            )}
          </div>

          {module.progress < 100 && (
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              <Play className="h-4 w-4 mr-2" />
              {module.progress > 0 ? 'Continue' : 'Start'}
            </button>
          )}
        </div>

        {module.progress > 0 && module.progress < 100 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{module.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${module.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}