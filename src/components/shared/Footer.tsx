import React, { useEffect } from 'react';
import { useTheme } from '../theme-provider';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  /* const theme = useTheme();
  useEffect(()=>{
    fetch("lasjd",).then(()=>{
      const newTheme = {};
      theme.setTheme({theme: newTheme})
    })
  },[]) */
  return (
    <footer className="border-t border-gray-200 bg-gray-50 px-4 py-4">
      <div className="max-w-3xl mx-auto space-y-6">       
        
        <div className="space-y-3 text-sm text-gray-600">
          <p className="font-semibold text-red-600 text-[14px]">
            ⚠️ Not for emergencies. If you are experiencing a medical emergency, call 911.
          </p>

          <p>
            CUROO Technologies, Inc. provides the platform. Medical services are provided solely by Consultation Specialists of Indiana, P.C.</p>

          <p className="text-gray-600">
            CUROO does not provide medical care and does not practice medicine.
          </p>
        </div>
         <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">            
          <Link to="/privacy" className="hover:text-blue-600">
            Privacy Policy
          </Link>
          <span>|</span>         
          <Link to="/hippanotice" className="hover:text-blue-600">
            HIPAA Notice of Privacy Practices
          </Link>
          <span>|</span>         
          <Link to="/telemedicine" className="hover:text-blue-600">
            Telemedicine and Asynchronous Care Consent
          </Link>
          <span>|</span>
          <Link to="/terms" className="hover:text-blue-600">
            Terms of Service
          </Link>           
          <span>|</span>         
          <Link to="/aboutus" className="hover:text-blue-600">
            About Us
          </Link>
          <span>|</span>         
          <Link to="/contactus" className="hover:text-blue-600">
            Contact Us
          </Link>
        </div>
         <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span>©{new Date().getFullYear()} CUROO Technologies, Inc. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
