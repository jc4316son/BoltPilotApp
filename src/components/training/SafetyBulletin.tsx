import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface SafetyBulletinProps {
  bulletin: {
    id: string;
    title: string;
    source: string;
    date: string;
    priority: 'high' | 'medium' | 'low';
    summary: string;
  };
}

export function SafetyBulletin({ bulletin }: SafetyBulletinProps) {
  const priorityConfig = {
    high: {
      icon: AlertTriangle,
      color: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-100',
    },
    medium: {
      icon: AlertCircle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
      border: 'border-yellow-100',
    },
    low: {
      icon: Info,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
  };

  const config = priorityConfig[bulletin.priority];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-4`}>
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 ${config.color} mt-0.5`} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800">{bulletin.title}</h3>
            <span className="text-xs text-gray-500">{bulletin.source}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{bulletin.summary}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {new Date(bulletin.date).toLocaleDateString()}
            </span>
            <button className="text-sm text-blue-500 hover:text-blue-600">
              Read More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}