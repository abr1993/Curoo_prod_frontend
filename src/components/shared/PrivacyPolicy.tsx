import { useHeader } from '@/contexts/HeaderContext';
import React, { useEffect } from 'react';

export const PrivacyPolicy: React.FC = () => {
    const { setTitle } = useHeader();
    useEffect(() => {
        setTitle("Privacy Policy");
    },[]);
  return (
    <div className="max-w-md mx-auto mt-4 px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
        {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Privacy Policy
        </h2> */}

        <div className="space-y-3">
          {/* Owner name */}
          <div>
            <p className="text-[14px] text-justify text-gray-500">
            Our Privacy Policy is currently being reviewed and finalized by our legal counsel. We take your privacy seriously and are committed to protecting your personal information. This policy will be made available on this page as soon as it has been completed and approved. Please check back soon for the full details.
          </p>
          </div>

          
        </div>
      </div>
    </div>
  );
}
