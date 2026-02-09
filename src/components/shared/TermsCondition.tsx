import React, { useEffect } from "react";
import { useHeader } from "@/contexts/HeaderContext";
import { Card } from "@/components/ui/Card";
import { FileText } from "lucide-react";

export const TermsConditions: React.FC = () => {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Terms of Service");
  }, [setTitle]);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-50 min-h-screen">
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
             
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-50 rounded-lg p-5 space-y-5 text-sm text-gray-700 leading-relaxed ">
            <p>
              These Terms of Service (“Terms”) govern your use of the CUROO
              website and platform. By accessing or using the platform, you
              agree to these Terms. If you do not agree, do not use the
              platform.
            </p>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                1. Provider and platform
              </h2>
              <p>
                Medical services are provided only by Consultation Specialists
                of Indiana, P.C., an Indiana professional corporation. The
                website and software platform are operated by CUROO
                Technologies, Inc. CUROO does not provide medical care and does
                not practice medicine. CUROO provides software and related
                support services only. All medical care is provided solely by
                physicians engaged by Consultation Specialists of Indiana, P.C.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                2. Eligibility and location
              </h2>
              <p>
                You must be at least 18 years old to use the platform. You must
                be physically located in Indiana at the time you submit a
                request for medical services. The platform does not serve
                Medicare or Medicaid beneficiaries at launch.
              </p>
              <p className="mt-2">
                You are responsible for confirming that you meet these
                requirements before submitting a request.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                3. Nature of service
              </h2>
              <p>
                The platform provides access to asynchronous telemedicine
                services in ophthalmology only. There are no live visits, no
                video visits, no phone calls, and no real-time chat.
              </p>
              <p className="mt-2">
                You submit a written question and brief medical history. A
                physician reviews your submission and may accept or decline it
                in the physician’s discretion. If accepted, the physician will
                issue a signed written report that is posted in your account
                through the platform.
              </p>
              <p className="mt-2">
                This service does not create an ongoing physician-patient
                relationship beyond the issuance of the signed written report.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                4. Not for emergencies
              </h2>
              <p>
                The platform is not for emergencies or urgent conditions. If you
                have an emergency, call 911 or go to the nearest emergency room.
                Do not use the platform to seek emergency care.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                5. User submissions
              </h2>
              <p>
                You must provide complete and accurate information when
                submitting a request. File uploads are not accepted.
              </p>
              <p className="mt-2">
                A physician may accept or decline your submission in the
                physician’s discretion. If your submission is declined, no
                medical care is provided.
              </p>
              <p className="mt-2">
                We may suspend or terminate your access to the platform at any
                time if you violate these Terms or misuse the platform.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                6. No guarantee of service or outcome
              </h2>
              <p>
                Submission of a request does not guarantee acceptance. No
                guarantee is made regarding results, outcomes, response time, or
                clinical conclusions. Any signed written report is based on the
                information you provide.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                7. Payment and authorization
              </h2>
              <p>
                When you submit a request for medical services through the
                platform, a pre-authorization hold will be placed on your
                payment method. Your card will be charged only if a physician
                accepts your request and issues a signed written report.
              </p>
              <p className="mt-2">
                If your request is declined, the authorization will be released
                and no charge will be made. The timing of the release depends on
                your bank.
              </p>
              <p className="mt-2">
                Once a signed written report is issued, the service is complete.
                No refunds are provided after a report is issued.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                8. Account access and authentication
              </h2>
              <p>
                You access the platform using a one-time passcode sent to your
                email address. You are responsible for maintaining the
                confidentiality of your access credentials and for all activity
                that occurs through your account.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                9. Communications
              </h2>
              <p>
                We will send service-related emails and notifications. We do not
                include medical content in these emails. You are responsible for
                maintaining a current and accurate email address.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                10. Privacy and HIPAA
              </h2>
              <p>
                Your use of the platform is subject to the CUROO Privacy Policy.
                Medical information is governed by HIPAA.
              </p>
              <p className="mt-2">
                Consultation Specialists of Indiana, P.C. is the Covered Entity
                responsible for your medical records. CUROO acts as a Business
                Associate.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                11. Intellectual property and acceptable use
              </h2>
              <p>
                The platform and all content on it are owned by CUROO or its
                licensors. You are granted a limited, non-exclusive right to use
                the platform for personal use.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                12–18. Disclaimers, liability, indemnification, governing law,
                and miscellaneous
              </h2>
              <p>
                The platform is provided on an “as is” basis. Liability is
                limited to the fullest extent permitted by law. These Terms are
                governed by Indiana law. Additional provisions on
                indemnification, venue, changes, contact information, and
                survival apply as stated in the full Terms.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};
