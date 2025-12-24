import { useHeader } from '@/contexts/HeaderContext';
import React, { useEffect } from 'react';

export const TermsConditions: React.FC = () => {
    const { setTitle } = useHeader();
    useEffect(() => {
        setTitle("Terms of service");
    },[]);
  return (
    <div className="max-w-md mx-auto mt-4 px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
        {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Terms of service
        </h2> */}

        <div className="space-y-3">
          {/* Owner name */}
          <div>
            <p className="text-[14px] text-justify text-gray-500">
            Our Terms of Service are currently under review and are being prepared by our attorneys. These terms will outline the rules and conditions for using this website and its services. Once finalized, the complete Terms of Service will be published here. We appreciate your patience while this process is completed.
          </p>
          </div>

          
        </div>
      </div>
    </div>
  );
}
