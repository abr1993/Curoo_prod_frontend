import { useHeader } from '@/contexts/HeaderContext';
import React, { useEffect } from 'react';

export const ContactUs: React.FC = () => {
    const { setTitle } = useHeader();
    useEffect(() => {
        setTitle("Contact Us");
    },[]);
  return (
    <div className="max-w-md mx-auto mt-4 px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Contact
        </h2>

        <div className="space-y-3">
          {/* Owner name */}
          {/* <div>
            <p className="text-sm text-gray-500">Website owner</p>
            <p className="text-base font-medium text-gray-900">
              Dr. Enoch Kassa, MD
            </p>
            <p className="text-sm text-gray-600">
              Ophthalmologist
            </p>
          </div> */}

          {/* Email */}
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <a
              href="mailto:contact@example.com"
              className="text-blue-600 font-medium hover:underline break-all"
            >
              team@curooapp.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
