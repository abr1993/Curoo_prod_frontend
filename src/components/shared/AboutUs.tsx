import React, { useEffect } from "react";
import { useHeader } from "@/contexts/HeaderContext";
import { Card } from "@/components/ui/Card";
import { Info } from "lucide-react";

export const AboutUs: React.FC = () => {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("About Us");
  }, [setTitle]);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-50">
      <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        <Card>
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                <Info className="w-5 h-5 text-blue-600" />
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  About CUROO
                </h1>
                <p className="text-sm text-gray-600">
                  Trusted medical answers, without the visit
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                <strong>CUROO</strong> is a simple way to ask a board-certified
                specialist a question and get a clear, signed answer without the
                hassle of an office visit. We partner with select clinics and
                specific physicians to make trusted expertise available to
                patients when it fits their schedule.
              </p>

              <p>
                Pricing is transparent: your card is held at submit and charged
                only if a physician accepts your case. Everything stays in one
                secure place, and we keep messages brief, respectful, and easy
                to understand.
              </p>

              <p>
                CUROO doesn’t replace in-person care and isn’t for emergencies.
                When hands-on care is best, we’ll say so and help point you to
                the right clinic.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

};
