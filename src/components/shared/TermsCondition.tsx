import React, { useEffect } from "react";
import { useHeader } from "@/contexts/HeaderContext";
import { Card } from "@/components/ui/Card";
import { FileText } from "lucide-react";

export const TermsConditions: React.FC = () => {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Terms of Service");
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-50">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <Card>
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Terms of Service
              </h1>
              <p className="text-sm text-gray-600">Last updated: Coming soon</p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 leading-relaxed text-justify">
              Our Terms of Service are currently under review and are being
              prepared by our attorneys. These terms will outline the rules and
              conditions for using this website and its services.
              <br />
              <br />
              Once finalized, the complete Terms of Service will be published
              here. We appreciate your patience while this process is completed.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
