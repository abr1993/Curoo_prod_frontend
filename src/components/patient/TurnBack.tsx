import React, { useEffect } from 'react';
import { Header } from '../shared/Header';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useHeader } from '@/contexts/HeaderContext';
import { useLocation, useNavigate } from 'react-router-dom';

interface TurnBackProps {
  reason: 'coverage' | 'redFlag' | 'state' | 'stripe' | 'dbfetch' | 'dbupdate' | 'stateList' | 'accessDenied';
  onBack: () => void;
}
const allowedStates = ["IN"];
export const TurnBack: React.FC<TurnBackProps> = ({ reason, onBack }) => {

  const sortedStates = [...allowedStates].sort(); // make a copy and sort alphabetically
  const formattedStates =
  sortedStates.length === 1
    ? sortedStates[0] // just one state, no 'and'
    : sortedStates.slice(0, -1).join(", ") + " and " + sortedStates.slice(-1);

  /* const content = {
    coverage: {
      title: 'Not available in the pilot',
      message:
        "We currently support self-pay and commercial insurance only. We're working to expand coverage options in the future.",
      cta: 'Go back',
    },
    redFlag: {
      title: 'Please be seen today',
      message:
        'Your answers suggest symptoms that are best evaluated in person. For urgent issues, call 911. For same-day care, visit an urgent care or emergency room.',
      cta: 'Find urgent care',
    },
    state: {
      title: 'Not available in your state',
      message:
        "Dr. Chen is currently licensed in CA, NY, TX, and FL. We're working to expand to more states soon.",
      cta: 'Go back',
    },
    stripe: {
      title: 'Transaction Failed',
      message:
        "The transaction for id s324345465u34sgg have failed",
      cta: 'Go back',
    },
    dbfetch: {
      title: 'Database Fetch Failed',
      message:
        "Failed to retrieve data from the database.",
      cta: 'Go back',
    },
    dbupdate: {
      title: 'Database Update Failed',
      message:
        "Failed to update data on the database.",
      cta: 'Go back',
    },
  }; */

  const location = useLocation();
  const navigate = useNavigate();

  // Get state from navigation
  const { providerData } = location.state || {};
  const { providerName, licenseStates, selectedState } = providerData || {};

  //const { title, message, cta } = content[reason];
  const { setTitle } = useHeader();
  useEffect(() => {
    if (reason === "state" && providerName && selectedState) {

      setTitle(`Not available in your state`);
    } else {
      setTitle("We can't complete this online");
    }
  }, [reason, providerName, selectedState, setTitle]);

  const finalData = providerData;
  const finalProviderName = finalData?.providerName;
  const finalLicenseStates = finalData?.licenseStates;
  const finalSelectedState = finalData?.selectedState;
  const stripeErrorData = location.state?.stripeErrorData;
  const content = {
    coverage: {
      title: "Not available in the pilot",
      message:
        "We currently support self-pay and commercial insurance only. We're working to expand coverage options in the future.",
      cta: "Go back",
    },
    redFlag: {
      title: "Please be seen today",
      message:
        "Your answers suggest symptoms that are best evaluated in person. For urgent issues, call 911. For same-day care, visit an urgent care or emergency room.",
      cta: "Find urgent care",
    },    
    stripe: {
      title: 'Transaction Failed',
      message:
        `${stripeErrorData}`,
      cta: 'Go back',
    },
    dbfetch: {
      title: 'Database Fetch Failed',
      message:
        "Failed to retrieve data from the database.",
      cta: 'Go back',
    },
    accessDenied: {
      title: 'Access Denied',
      message:
        "You don't have permission to view this consult.",
      cta: 'Go back',
    },
    dbupdate: {
      title: 'Database Update Failed',
      message:
        "Failed to update data on the database.",
      cta: 'Go back',
    },
    state: {
      title: "Not available in your state",
      message: finalProviderName
        ? `${finalProviderName} isn't licensed in ${finalSelectedState}.`
        : "This provider isn't licensed in your selected state.",
      subMessage:
        finalLicenseStates && finalLicenseStates.length > 0
          ? `Licensed states: ${finalLicenseStates.join(", ")}`
          : undefined,
      cta: "Go back",
    },
    stateList: {
      title: `Not available in ${finalSelectedState}`,
      message:
        `Curoo is currently licensed in ${formattedStates}. We're working to expand to more states soon.`,
      cta: "Go back",
    },
    stateMismatch: {
      title: `Not available in ${finalSelectedState}`,
      message:
        `Even though ${finalProviderName || "the provider"} is licensed in ${finalSelectedState}, Curoo is currently not licensed in ${finalSelectedState}. Its only available in ${formattedStates}. We're working to expand to more states soon.`,
      cta: "Go back",
    },
  };

  
  const { title, message, cta, subMessage } = (content[reason] || content.state) as {
    title: string;
    message: string;
    cta: string;
    subMessage?: string;
  }; 

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <Card>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600">{message}</p>
            {subMessage && (
              <p className="text-sm text-gray-500 italic">{subMessage}</p>
            )}

            {reason === "redFlag" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                <p className="text-sm text-red-800 font-semibold mb-2">
                  ⚠️ Emergency warning signs:
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Severe eye pain</li>
                  <li>• Sudden vision loss</li>
                  <li>• Chemical exposure or trauma</li>
                </ul>
                <p className="text-sm text-red-800 font-semibold mt-3">
                  If you're experiencing these, call 911 or go to the ER
                  immediately.
                </p>
              </div>
            )}

            <Button fullWidth onClick={onBack}>
              {cta}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
