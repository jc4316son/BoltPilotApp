import React, { useState, useRef } from 'react';
import { Award, Calendar, Upload } from 'lucide-react';
import type { Certification } from '../../types';
import { supabase } from '../../lib/supabase';

interface CertificationFormProps {
  onSubmit: (certification: Omit<Certification, 'id' | 'pilotId'>) => void;
}

export function CertificationForm({ onSubmit }: CertificationFormProps) {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let imageUrl = '';
    const file = fileInputRef.current?.files?.[0];
    
    if (file) {
      setUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        // Get the current user's ID
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User not authenticated');
        }

        const { error: uploadError, data } = await supabase.storage
          .from('certificates')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
            duplex: 'half'
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        if (data) {
          imageUrl = fileName;
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setUploading(false);
      }
    }
    
    const certificationData = {
      type: formData.get('type') as string,
      number: formData.get('number') as string,
      issueDate: formData.get('issueDate') as string,
      expiryDate: formData.get('expiryDate') as string,
      imageUrl
    };

    onSubmit(certificationData);
    
    if (formRef.current) {
      formRef.current.reset();
      setImagePreview(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Validate file type
      if (!file.type.match(/^image\/(jpeg|png|gif)$/)) {
        alert('File must be an image (JPEG, PNG, or GIF)');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Award className="h-6 w-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-800">Add New Certification</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certification Type
          </label>
          <select
            name="type"
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select type...</option>
            <option value="Private Pilot License">Private Pilot License</option>
            <option value="Commercial Pilot License">Commercial Pilot License</option>
            <option value="Airline Transport Pilot License">Airline Transport Pilot License</option>
            <option value="Flight Instructor Certificate">Flight Instructor Certificate</option>
            <option value="Medical Certificate">Medical Certificate</option>
            <option value="Instrument Rating">Instrument Rating</option>
            <option value="Multi-Engine Rating">Multi-Engine Rating</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certificate Number
          </label>
          <input
            type="text"
            name="number"
            required
            placeholder="Enter certificate number"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 mr-2" />
            Issue Date
          </label>
          <input
            type="date"
            name="issueDate"
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 mr-2" />
            Expiry Date
          </label>
          <input
            type="date"
            name="expiryDate"
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Upload className="w-4 h-4 mr-2" />
            Certificate Image
          </label>
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleImageChange}
            className="hidden"
            id="certificate-image"
          />
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative">
            {imagePreview ? (
              <div className="space-y-2">
                <img
                  src={imagePreview}
                  alt="Certificate preview"
                  className="max-h-48 rounded"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <label
                    htmlFor="certificate-image"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">JPEG, PNG, or GIF up to 5MB</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300"
        >
          {uploading ? 'Uploading...' : 'Add Certification'}
        </button>
      </div>
    </form>
  );
}