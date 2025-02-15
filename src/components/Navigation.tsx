import React from 'react';
import { Menu, PlaneLanding, Calendar, Award, Users, Bell, LayoutDashboard, LogOut, LogIn } from 'lucide-react';
import { User } from '@supabase/supabase-js';

type Page = 'dashboard' | 'logbook' | 'certifications' | 'schedule' | 'training' | 'community';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  user: User | null;
  onSignInClick: () => void;
  onSignOutClick: () => void;
}

export function Navigation({ currentPage, onPageChange, user, onSignInClick, onSignOutClick }: NavigationProps) {
  return (
    <nav className="bg-slate-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onPageChange('dashboard')}>
          <PlaneLanding className="h-8 w-8" />
          <span className="text-xl font-bold">PilotHub</span>
        </div>
        
        <div className="hidden md:flex space-x-6">
          <NavLink 
            icon={<LayoutDashboard />} 
            text="Dashboard" 
            isActive={currentPage === 'dashboard'}
            onClick={() => onPageChange('dashboard')}
          />
          <NavLink 
            icon={<Menu />} 
            text="Logbook" 
            isActive={currentPage === 'logbook'}
            onClick={() => onPageChange('logbook')}
          />
          <NavLink 
            icon={<Award />} 
            text="Certifications" 
            isActive={currentPage === 'certifications'}
            onClick={() => onPageChange('certifications')}
          />
          <NavLink 
            icon={<Calendar />} 
            text="Schedule" 
            isActive={currentPage === 'schedule'}
            onClick={() => onPageChange('schedule')}
          />
          <NavLink 
            icon={<Users />} 
            text="Community" 
            isActive={currentPage === 'community'}
            onClick={() => onPageChange('community')}
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="hover:text-blue-300 transition-colors">
            <Bell className="h-6 w-6" />
          </button>
          {user ? (
            <button
              onClick={onSignOutClick}
              className="flex items-center space-x-2 hover:text-blue-300 transition-colors"
            >
              <LogOut className="h-6 w-6" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={onSignInClick}
              className="flex items-center space-x-2 hover:text-blue-300 transition-colors"
            >
              <LogIn className="h-6 w-6" />
              <span className="hidden md:inline">Sign In</span>
            </button>
          )}
          <button className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  onClick: () => void;
}

function NavLink({ icon, text, isActive, onClick }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-1 transition-colors ${
        isActive ? 'text-blue-300' : 'hover:text-blue-300'
      }`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}