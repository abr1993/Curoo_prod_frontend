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
    <footer className="mt-8 border-t border-gray-200 bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">       
        
        <div className="space-y-3 text-sm text-gray-600">
          <p className="font-semibold text-red-600 text-[14px]">
            ⚠️ Not for emergencies. If you think you're having an emergency,
            call 911.
          </p>

          <p>
            Care provided by ABC Medical Group.</p>

          <p className="text-gray-500">
            Pilot supports self-pay and commercial insurance only.
            Medicare/Medicaid not currently available.
          </p>
        </div>
         <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span>Copy right © 2025</span>
            <span>|</span>
          <Link to="#" className="hover:text-blue-600">
            Privacy Policy
          </Link>
          <span>|</span>
          <Link to="#" className="hover:text-blue-600">
            Terms of Service
          </Link> 
          <span>|</span>         
          <Link to="/contactus" className="hover:text-blue-600">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};
