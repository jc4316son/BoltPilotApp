import React, { useState } from 'react';
import { MessageSquare, Users, Calendar, Award, Search, MapPin, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import { ForumPost } from './ForumPost';
import { EventCard } from './EventCard';
import { PilotCard } from './PilotCard';

const MOCK_POSTS = [
  {
    id: '1',
    author: {
      id: 'pilot1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
      role: 'Captain',
      airline: 'Delta Airlines',
    },
    title: 'Tips for Flying into KLGA during Peak Hours',
    content: 'After years of flying into LaGuardia, here are my top strategies for handling the congested airspace and tight approach patterns...',
    category: 'Operational Tips',
    timestamp: '2024-03-15T14:30:00Z',
    likes: 24,
    comments: 8,
    tags: ['KLGA', 'ATC', 'Peak Hours'],
  },
  {
    id: '2',
    author: {
      id: 'pilot2',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      role: 'First Officer',
      airline: 'United Airlines',
    },
    title: 'Best FBOs at KSFO - Personal Experience',
    content: 'A comprehensive review of all FBOs at San Francisco International, including amenities, service quality, and pricing...',
    category: 'FBO Reviews',
    timestamp: '2024-03-14T18:15:00Z',
    likes: 16,
    comments: 5,
    tags: ['KSFO', 'FBO', 'Reviews'],
  },
];

const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Advanced Weather Radar Workshop',
    date: '2024-04-10T09:00:00Z',
    location: 'Denver, CO',
    type: 'Training',
    organizer: 'NBAA',
    attendees: 45,
    thumbnail: 'https://images.unsplash.com/photo-1538724454784-14b4d34cb2c6?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '2',
    title: 'Regional Pilot Meetup',
    date: '2024-04-15T18:00:00Z',
    location: 'Atlanta, GA',
    type: 'Networking',
    organizer: 'ATP Flight School',
    attendees: 120,
    thumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=300',
  },
];

const MOCK_PILOTS = [
  {
    id: '1',
    name: 'David Wilson',
    role: 'Captain',
    airline: 'American Airlines',
    totalHours: 12500,
    ratings: ['ATP', 'B737', 'A320'],
    location: 'Dallas, TX',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    endorsements: 28,
  },
  {
    id: '2',
    name: 'Emily Rodriguez',
    role: 'First Officer',
    airline: 'Southwest Airlines',
    totalHours: 5800,
    ratings: ['Commercial', 'B737'],
    location: 'Houston, TX',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    endorsements: 15,
  },
];

export function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'forum' | 'events' | 'pilots'>('forum');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Pilot Community</h1>
        <p className="text-gray-600">Connect with fellow pilots, share experiences, and grow your network</p>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search posts, events, or pilots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('forum')}
              className={`pb-4 px-4 ${
                activeTab === 'forum'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Forum</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`pb-4 px-4 ${
                activeTab === 'events'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Events</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('pilots')}
              className={`pb-4 px-4 ${
                activeTab === 'pilots'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Pilots</span>
              </div>
            </button>
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {activeTab === 'forum' && (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Recent Discussions</h2>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    New Post
                  </button>
                </div>
                <div className="space-y-4">
                  {MOCK_POSTS.map((post) => (
                    <ForumPost key={post.id} post={post} />
                  ))}
                </div>
              </>
            )}

            {activeTab === 'events' && (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Create Event
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_EVENTS.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </>
            )}

            {activeTab === 'pilots' && (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Featured Pilots</h2>
                  <button className="text-blue-500 hover:text-blue-600">View All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_PILOTS.map((pilot) => (
                    <PilotCard key={pilot.id} pilot={pilot} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:w-80 space-y-6">
          {/* User Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Community Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-600">Posts</span>
                </div>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600">Connections</span>
                </div>
                <span className="font-semibold">45</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-600">Endorsements</span>
                </div>
                <span className="font-semibold">8</span>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Trending Topics</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50">
                #WeatherSafety
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50">
                #PilotLife
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50">
                #Aviation2024
              </button>
            </div>
          </div>

          {/* Upcoming Events Preview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Events</h2>
              <button className="text-blue-500 hover:text-blue-600 text-sm">View All</button>
            </div>
            <div className="space-y-4">
              {MOCK_EVENTS.slice(0, 2).map((event) => (
                <div key={event.id} className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}