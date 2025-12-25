import React, { useEffect } from "react";
import { useHeader } from "@/contexts/HeaderContext";
import { Card } from "@/components/ui/Card";

import { Mail, User } from "lucide-react";

export const ContactUs: React.FC = () => {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Contact Us");
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-50">
      <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        <Card>
          <div className="flex items-start gap-4">
            {/* Content */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Get in touch
              </h1>
              <p className="text-gray-600 mb-4">
                Have questions, feedback, or need support? We’re here to help.
              </p>

              {/* Contact chips */}
              <div className="inline-grid grid-flow-row sm:grid-flow-col auto-cols-max gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  <Mail className="w-4 h-4" />
                  Email Support
                </div>
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <a
              href="mailto:team@curooapp.com"
              className="text-lg font-medium text-blue-600 hover:underline break-all"
            >
              team@curooapp.com
            </a>

            <p className="text-sm text-gray-600 mt-2">
              Typical response within 24 hours
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
