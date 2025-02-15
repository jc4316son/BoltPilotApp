import React from 'react';
import { X } from 'lucide-react';
import type { Certification } from '../../types';

interface CertificationModalProps {
  certification: Certification;
  onClose: () => void;
}

export function CertificationModal({ certification, onClose }: CertificationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{certification.type}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Certificate Number</label>
                <p className="text-gray-800 font-medium">{certification.number}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">Issue Date</label>
                <p className="text-gray-800 font-medium">
                  {new Date(certification.issueDate).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">Expiry Date</label>
                <p className="text-gray-800 font-medium">
                  {new Date(certification.expiryDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div>
              {certification.imageUrl ? (
                <div className="aspect-[3/4] rounded-lg overflow-hidden">
                  <img
                    src={certification.imageUrl}
                    alt={`${certification.type} Certificate`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[3/4] rounded-lg bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}