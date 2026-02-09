import React, { useEffect } from "react";
import { useHeader } from "@/contexts/HeaderContext";
import { Card } from "@/components/ui/Card";
import { ClipboardCheck } from "lucide-react";

export const TelemedicineAsynchronousCareConsent: React.FC = () => {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Telemedicine & Asynchronous Care Consent");
  }, [setTitle]);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-4 spacer-y-4">
        <Card>
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex items-center justify-center w-10 aspect-square rounded-full bg-blue-100 shrink-0">
              <ClipboardCheck className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Telemedicine and Asynchronous Care Consent
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-50 rounded-lg p-5 space-y-5 text-sm text-gray-700 leading-relaxed ">
            <p>
              This consent applies to your use of asynchronous telemedicine
              services through the CUROO platform. Please read this document
              carefully before submitting a request.
            </p>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                1. Provider and platform
              </h2>
              <p>
                Medical services are provided only by Consultation Specialists
                of Indiana, P.C., an Indiana professional corporation. The
                website and software platform are operated by CUROO
                Technologies, Inc. CUROO does not provide medical care and
                provides software and related support services only. All medical
                care is provided solely by physicians engaged by Consultation
                Specialists of Indiana, P.C.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                2. Nature of the service
              </h2>
              <p>
                This service provides medical evaluation through asynchronous
                telemedicine. There are no live visits, no video, no phone
                calls, and no real-time chat. You will submit a written question
                and brief medical history. If accepted, a physician will issue a
                signed written report posted to your account.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                3. Scope and limitations
              </h2>
              <p>
                This service is limited to ophthalmology and is not for
                emergencies or urgent conditions. Because there is no real-time
                interaction, the physician’s evaluation is limited to the
                information you provide in writing. You may be advised to seek
                in-person care.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                4. Eligibility and location
              </h2>
              <p>
                You must be at least 18 years old and physically located in
                Indiana at the time of submission. Medicare and Medicaid
                patients are not accepted.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                5. Submission and physician review
              </h2>
              <p>
                You will submit a structured written question and brief medical
                history. File uploads are not accepted. A physician may accept
                or decline your submission in their discretion. If declined, no
                medical report or care is provided.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                6. No guarantee of service or diagnosis
              </h2>
              <p>
                Submission does not guarantee acceptance, diagnosis, or outcome.
                Any written report is based solely on the information you
                provide and does not replace an in-person evaluation.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                7. Alternative care options
              </h2>
              <p>
                You may seek care from an in-person physician or another
                provider at any time.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                8. Not for emergencies
              </h2>
              <p>
                Do not use this service for emergencies. If you have an
                emergency, call 911 or go to the nearest emergency room.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                9. Payment and authorization
              </h2>
              <p>
                A pre-authorization hold will be placed on your payment method
                at submission. Your card is charged only if a physician accepts
                your request and issues a signed written report. No refunds are
                provided once a report is issued.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                10. Privacy and medical records
              </h2>
              <p>
                A medical record will be created and maintained by Consultation
                Specialists of Indiana, P.C. CUROO acts as a Business Associate.
                Medical information is governed by HIPAA. You will be provided a
                Notice of Privacy Practices.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                11. Communications
              </h2>
              <p>
                We will send service-related emails and notifications. These
                communications do not contain medical content.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                12. Consent and acknowledgement
              </h2>
              <p>
                By submitting a request through this platform, you confirm that
                you have read and understand this consent, agree to receive care
                through asynchronous telemedicine, understand its limitations,
                meet eligibility requirements, understand the payment and
                no-refund policy, and acknowledge receipt or availability of the
                Notice of Privacy Practices.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};
