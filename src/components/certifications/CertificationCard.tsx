import React, { useState } from 'react';
import { Award, Calendar, AlertTriangle } from 'lucide-react';
import type { Certification } from '../../types';
import { CertificationModal } from './CertificationModal';

interface CertificationCardProps {
  certification: Certification;
}

export function CertificationCard({ certification }: CertificationCardProps) {
  const [showModal, setShowModal] = useState(false);
  const expiryDate = new Date(certification.expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysUntilExpiry <= 30;
  const isExpired = daysUntilExpiry <= 0;

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Award className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{certification.type}</h3>
              <p className="text-sm text-gray-600">#{certification.number}</p>
            </div>
          </div>
          {(isExpiringSoon || isExpired) && (
            <div className={`px-3 py-1 rounded-full flex items-center space-x-1 ${
              isExpired ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {isExpired ? 'Expired' : `${daysUntilExpiry} days left`}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Issued: {new Date(certification.issueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Expires: {new Date(certification.expiryDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>

      {showModal && (
        <CertificationModal
          certification={certification}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}