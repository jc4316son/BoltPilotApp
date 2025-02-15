import React, { useState, useEffect } from 'react';
import { CertificationCard } from './CertificationCard';
import { CertificationForm } from './CertificationForm';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Certification } from '../../types';

export function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCertifications();
    }
  }, [user]);

  const loadCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('pilot_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading certifications:', error);
        return;
      }

      // Map database columns to our TypeScript interface
      const mappedCertifications: Certification[] = (data || []).map(cert => ({
        id: cert.id,
        type: cert.type,
        number: cert.number,
        issueDate: cert.issue_date,
        expiryDate: cert.expiry_date,
        pilotId: cert.pilot_id,
        imageUrl: cert.image_url
      }));

      // Get public URLs for all images
      const certificationsWithUrls = await Promise.all(
        mappedCertifications.map(async (cert) => {
          if (cert.imageUrl) {
            const { data } = supabase.storage
              .from('certificates')
              .getPublicUrl(cert.imageUrl);
            return {
              ...cert,
              imageUrl: data.publicUrl
            };
          }
          return cert;
        })
      );

      setCertifications(certificationsWithUrls);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewCertification = async (certification: Omit<Certification, 'id' | 'pilotId'>) => {
    if (!user) {
      alert('Please sign in to add certifications');
      return;
    }

    try {
      // Insert certification with image_url (which is now the storage path)
      const { data, error } = await supabase
        .from('certifications')
        .insert([
          {
            type: certification.type,
            number: certification.number,
            issue_date: new Date(certification.issueDate).toISOString().split('T')[0],
            expiry_date: new Date(certification.expiryDate).toISOString().split('T')[0],
            pilot_id: user.id,
            image_url: certification.imageUrl || null
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error saving certification:', error);
        throw error;
      }

      if (data) {
        // Get the public URL for display if we have an image
        let publicUrl = null;
        if (data.image_url) {
          const { data: urlData } = supabase.storage
            .from('certificates')
            .getPublicUrl(data.image_url);
          publicUrl = urlData.publicUrl;
        }

        // Map the response back to our TypeScript interface
        const newCertification: Certification = {
          id: data.id,
          type: data.type,
          number: data.number,
          issueDate: data.issue_date,
          expiryDate: data.expiry_date,
          pilotId: data.pilot_id,
          imageUrl: publicUrl
        };
        setCertifications((prev) => [newCertification, ...prev]);
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleDeleteCertification = async (id: string) => {
    if (!user) {
      alert('Please sign in to delete certifications');
      return;
    }

    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting certification:', error);
        throw error;
      }

      setCertifications((prev) => prev.filter(cert => cert.id !== id));
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

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
                Please sign in to view and manage your certifications
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
        <h1 className="text-3xl font-bold text-gray-800">Certifications</h1>
        <p className="text-gray-600">Manage your pilot certifications and ratings</p>
      </header>

      <CertificationForm onSubmit={handleNewCertification} />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((certification) => (
            <CertificationCard
              key={certification.id}
              certification={certification}
              onDelete={handleDeleteCertification}
            />
          ))}
        </div>
      )}
    </div>
  );
}