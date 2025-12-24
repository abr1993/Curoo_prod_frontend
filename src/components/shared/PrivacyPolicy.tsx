import React, { useEffect } from "react";
import { useHeader } from "@/contexts/HeaderContext";
import { Card } from "@/components/ui/Card";
import { ShieldCheck } from "lucide-react";

export const PrivacyPolicy: React.FC = () => {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Privacy Policy");
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-50">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <Card>
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Privacy Policy
              </h1>
              <p className="text-sm text-gray-600">Last updated: Coming soon</p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 leading-relaxed text-justify">
              Our Privacy Policy is currently being reviewed and finalized by
              our legal counsel. We take your privacy seriously and are
              committed to protecting your personal information.
              <br />
              <br />
              This policy will be made available on this page as soon as it has
              been completed and approved. Please check back soon for the full
              details.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
