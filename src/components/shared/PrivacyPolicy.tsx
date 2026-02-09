import React, { useEffect } from "react";
import { useHeader } from "@/contexts/HeaderContext";
import { Card } from "@/components/ui/Card";
import { ShieldCheck } from "lucide-react";

export const PrivacyPolicy: React.FC = () => {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Privacy Policy");
  }, [setTitle]);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-50 min-h-screen">
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
              
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-50 rounded-lg p-5 space-y-5 text-sm text-gray-700 leading-relaxed">
            <p>
              This Privacy Policy explains how information is collected, used,
              and shared when you use the CUROO website and platform.
            </p>

            <p>
              This policy applies to information collected through the CUROO
              website and platform. It does not replace or modify the Notice of
              Privacy Practices provided by Consultation Specialists of Indiana,
              P.C. for medical care.
            </p>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                1. Roles and responsibilities
              </h2>
              <p>
                Medical services are provided only by Consultation Specialists
                of Indiana, P.C., an Indiana professional corporation.
                Consultation Specialists of Indiana, P.C. is the Covered Entity
                responsible for your medical records and medical information
                under HIPAA.
              </p>
              <p className="mt-2">
                The website and software platform are operated by CUROO
                Technologies, Inc. CUROO does not provide medical care and does
                not practice medicine. CUROO provides the technology platform
                and related support services only.
              </p>
              <p className="mt-2">
                For purposes of HIPAA, CUROO acts as a Business Associate and
                processes protected health information only on behalf of the
                medical provider and as permitted by law.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                2. Information we collect
              </h2>

              <h3 className="font-medium mt-2 mb-1">
                a. Information you provide
              </h3>
              <p>
                When you use the platform, you may provide identifying
                information such as your name, email address, date of birth, a
                written question and brief medical history, and payment
                information.
              </p>
              <p className="mt-2">
                Medical information you submit through the platform is provided
                to Consultation Specialists of Indiana, P.C.
              </p>

              <h3 className="font-medium mt-3 mb-1">
                b. Operational and technical information
              </h3>
              <p>
                We collect limited technical and operational information,
                including IP address, timestamps, device and browser
                information, and log and error data, for security, audit, and
                platform operations.
              </p>

              <h3 className="font-medium mt-3 mb-1">
                c. Cookies and similar technologies
              </h3>
              <p>
                The website may use cookies and similar technologies to operate
                the site, maintain sessions, and support analytics. You may be
                able to control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                3. How we use information
              </h2>
              <p>
                We use information to operate and maintain the platform,
                authenticate users, deliver submissions and reports, process
                payments through Stripe, send service-related communications,
                maintain security and audit logs, and comply with legal and
                regulatory requirements.
              </p>
              <p className="mt-2">
                We do not use your medical information for advertising or
                marketing.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                4. Medical information and HIPAA
              </h2>
              <p>
                Medical information collected through the platform is governed
                by HIPAA and the Notice of Privacy Practices of Consultation
                Specialists of Indiana, P.C.
              </p>
              <p className="mt-2">
                Consultation Specialists of Indiana, P.C. controls how your
                medical information is used and disclosed. CUROO processes
                medical information only as a Business Associate and only as
                permitted by law.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                5. How we share information
              </h2>

              <p>
                <strong>a. With the medical provider:</strong> Information is
                shared with Consultation Specialists of Indiana, P.C. and its
                physicians to provide medical care.
              </p>

              <p className="mt-2">
                <strong>b. With service providers:</strong> We share information
                with vendors that help operate the platform, including hosting,
                security, and payment processors.
              </p>

              <p className="mt-2">
                <strong>c. Payments:</strong> Payments are processed through
                Stripe and are subject to Stripe’s privacy practices.
              </p>

              <p className="mt-2">
                <strong>d. Legal and regulatory:</strong> Information may be
                disclosed as required by law or governmental request.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                6. Emails and communications
              </h2>
              <p>
                We send service-related emails and notifications that do not
                contain medical content. You are responsible for maintaining a
                current and accurate email address.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">7. Security</h2>
              <p>
                We use reasonable safeguards to protect information, but no
                system can be guaranteed to be completely secure.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">8. Retention</h2>
              <p>
                Information is retained as necessary to operate the platform,
                comply with legal obligations, and support the medical provider.
                Medical records are retained by Consultation Specialists of
                Indiana, P.C. in accordance with law.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                9. Your rights
              </h2>
              <p>
                Rights related to medical information are governed by HIPAA and
                described in the Notice of Privacy Practices. You may also
                contact us to update certain non-medical account information.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                10. Adult use only
              </h2>
              <p>
                The platform is intended for adults only. We do not knowingly
                collect information from anyone under 18 years old.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                11. Changes to this policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Changes
                will be posted and apply prospectively.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">
                12. Contact information
              </h2>
              <p>
                For questions about this Privacy Policy or the CUROO platform,
                contact CUROO using the information on the website. For medical
                privacy questions, contact Consultation Specialists of Indiana,
                P.C. through the platform.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};
