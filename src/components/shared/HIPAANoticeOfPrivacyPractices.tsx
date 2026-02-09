import React, { useEffect } from "react";
import { useHeader } from "@/contexts/HeaderContext";
import { Card } from "@/components/ui/Card";
import { ShieldCheck } from "lucide-react";

export const HIPAANoticeOfPrivacyPractices: React.FC = () => {
  const { setTitle } = useHeader();

  const effectiveDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    setTitle("HIPAA Notice of Privacy Practices");
  }, [setTitle]);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Card>
          {/* Header */}
          <div className="flex items-start gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 shadow-sm shrink-0">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                HIPAA Notice of Privacy Practices
              </h1>
              <p className="text-sm text-gray-600">
                Effective Date: {effectiveDate}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-50 rounded-lg p-5 space-y-5 text-sm text-gray-700 leading-relaxed">
            <p>
              This Notice of Privacy Practices describes how medical information
              about you may be used and disclosed and how you can get access to
              this information. Please review it carefully.
            </p>

            <p>
              This notice applies to medical care provided by Consultation
              Specialists of Indiana, P.C. through the CUROO platform. It does
              not replace or modify the CUROO website Privacy Policy.
            </p>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                1. Our role and our responsibilities
              </h2>
              <p>
                Consultation Specialists of Indiana, P.C. is a Covered Entity
                under HIPAA. We are responsible for maintaining the privacy of
                your medical information and following the terms of this notice.
                We will notify you if a breach occurs as required by law.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                2. Our care model and the CUROO platform
              </h2>
              <p>
                We provide asynchronous telemedicine services in ophthalmology
                only. There are no live visits, video visits, phone calls, or
                real-time chat. CUROO Technologies, Inc. operates the platform
                and acts as our Business Associate.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                3. How we may use and disclose your medical information
              </h2>
              <p>
                We may use and disclose your medical information for treatment,
                payment, health care operations, and to our business associates
                as permitted by law.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                4. Other permitted and required disclosures
              </h2>
              <p>
                We may disclose information as required by law, including for
                public health activities, legal proceedings, law enforcement,
                and workers’ compensation programs.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                5. Uses and disclosures requiring authorization
              </h2>
              <p>
                We will obtain your written authorization for uses not described
                in this notice. We do not use medical information for marketing,
                sale, or fundraising.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                6. Your rights
              </h2>
              <p>
                You have rights under HIPAA, including access, amendment,
                restriction requests, confidential communications, and an
                accounting of disclosures.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                7. Our duties
              </h2>
              <p>
                We are required by law to protect your medical information and
                follow this notice currently in effect.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                8. Complaints
              </h2>
              <p>
                You may file a complaint with us or the U.S. Department of
                Health and Human Services Office for Civil Rights. We will not
                retaliate.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                9. Changes to this notice
              </h2>
              <p>
                We reserve the right to change this notice. Updated versions
                will be available on the platform.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                10. Contact information
              </h2>
              <p>
                Consultation Specialists of Indiana, P.C.
                <br />
                Address: 115 Arnt Street, Michigan City, IN 46360
                <br />
                Phone: 219-250-8233
                <br />
                Email: team@curooapp.com
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};
