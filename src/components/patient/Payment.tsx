import React, { useEffect, useState } from 'react';
import { Header } from '../shared/Header';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { mockPhysician } from '../../utils/mockData';
import { PaymentSection } from '../patient/PaymentSection';
import { useHeader } from '@/contexts/HeaderContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useBackHandler } from '@/contexts/BackHandlerContext';
import { useAuth } from '@/hooks/useAuth';
import { TurnBack } from './TurnBack';
import { Loader } from 'lucide-react';
import { ConsultInput, QuestionDataNew } from '@/types/consult';

interface PaymentProps {
  onCancel: () => void;
  onSuccess: (consultId: String) => void;
  onFailure: (errmessage: string) => void;
}
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CONSULT_REPLY_HOURS = import.meta.env.VITE_CONSULT_REPLY_HOURS;
export const Payment: React.FC<PaymentProps> = ({  onSuccess, onFailure, onCancel }) => {
  const [consentChecked, setConsentChecked] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  const [consultId, setConsultId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);

  async function updateConsultStatus(consultId: String, newStatus: String) {
      //const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing authorized token");

      try {
            const response = await fetch(`${VITE_API_BASE_URL}/api/consults/${consultId}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
            body: JSON.stringify({ status: newStatus }),
          });

      
      if (!response.ok) {
        const errorText = await response.text();
        
        throw new Error(`Request failed: ${response.status} - ${errorText}`);
        
      }

      const updatedConsult = await response.json();
      return updatedConsult;
      

      } catch (error) {
        console.error("Error updating consult status:", error);
        throw error;
      }
    }

    const handlePaymentFailure = (message: string)=>{
      setShowErrorModal(true);
      setModalMessage(message);
    }

    const handlePayment = async () => {
      if (!consentChecked) return;

      setProcessing(true);

      try {
        // Update consult status in DB
        await updateConsultStatus(consultId, "SUBMITTED");

        // Simulate Stripe checkout delay
        setTimeout(() => {
          try {
            onSuccess(consultId); // Simulated payment success
          } finally {
            // Release button *after* checkout simulation completes
            setProcessing(false);
            localStorage.removeItem(`lastConsultId_${userId}`);
          }
        }, 1500);
      } catch (error) {
        console.error("Failed to update consult status:", error);
        setError("Database Update Failed");
        setProcessing(false); // release immediately on DB failure
      }
    };



  const { providerId } = useParams<{ providerId: string }>();
  const { providerSpecialtyId } = useParams<{ providerSpecialtyId: string }>();
  const {token, userId} = useAuth();
  //console.log("USER ID", userId);
  const location = useLocation();
  const navigate = useNavigate();

  const preCheckData = location.state?.preCheckData;
  const questionData = location.state?.questionData;

   
  const createConsult = async (precheckData:any, questionData:QuestionDataNew, providerId:string) => {
    const topicIds: string[] = questionData.topics.map(topic => topic.id);

    console.log("inside payment with existing consult id questiondata", questionData);
    const consultInput: ConsultInput = {
          patientId: userId, // get from token or context
          providerId: providerId,
          providerSpecialtyId: questionData.providerSpecialtyId,
          stateAtService: precheckData.state,
          topics: topicIds,
          questionBody: questionData.question,
          pronouns: questionData.pronouns || null,
          sexatbirth: questionData.sexatbirth || null,          
          dateOfBirth: new Date(precheckData.dob).toISOString(),
          legalName: questionData.legalName || null,
          showNameOptions: questionData.showFullName ? "FULL_NAME" : "INITIALS_ONLY",
          historyFields: questionData.historyFields,
          symptoms: questionData.symptoms,          
          created_by: userId,
          status: "ISDRAFT"
        };

        let response: Response = null;
        if(questionData.consultId !== undefined){
          console.log("inside payment with existing consult id questiondata", questionData);
          console.log("inside payment with existing consult id input", consultInput);
           response = await fetch(`${VITE_API_BASE_URL}/api/consults/${questionData.consultId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(consultInput),
          });
        }else{
           response = await fetch(`${VITE_API_BASE_URL}/api/consults`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(consultInput),
          });
        }
    

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);
      throw new Error(`Request failed: ${response.status}`);
    }

    const result = await response.json();
    console.log("Consult created:", result);
    return result.id;
  }; 

  
  const { setTitle } = useHeader();  
  const { setOnBack, onBack } = useBackHandler();   
   
    useEffect(() => {
      // Always set page title
      setTitle("Secure payment");
      console.log("Precheck inside payment",preCheckData);
        console.log("Question inside paymnet",questionData);
      if (!token) throw new Error("No auth token found");
      if (!preCheckData || !questionData) {
        // Missing required data → redirect behavior
        setOnBack(() => () => navigate(`/compose/${providerId}/${providerSpecialtyId}`, { replace: true }));
        navigate(`/compose/${providerId}/${providerSpecialtyId}`);
      } else {
        // Data is valid → normal flow
        console.log(preCheckData);
        console.log(questionData);

        const initConsult = async () => {
          try {

             //provider data
            const providerInfo = await fetch(`${VITE_API_BASE_URL}/api/providers/${providerId}/${providerSpecialtyId}?state=${preCheckData.state}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                
              });
              
              if(!providerInfo.ok) throw new Error("Failed to fetch provider");
                const providerData = await providerInfo.json();
                console.log("ProviderInfo", providerData);
                setProvider(providerData);

            const key = `lastConsultId_${userId}`;
            const savedConsultId = localStorage.getItem(key);
            

            if (savedConsultId) {
              console.log("Using existing consult:", savedConsultId);
              console.log("Using existing consult question data id:", questionData.consultId);
              if(savedConsultId === questionData.consultId){
                  await createConsult(preCheckData, questionData, providerId);
              }              
              setConsultId(savedConsultId);
              setLoading(false);
              return;
            }

            // Otherwise, create a new one
            const newId = await createConsult(preCheckData, questionData, providerId);
            localStorage.setItem(key, newId);
            setConsultId(newId);


           
          } catch (err) {
            console.error("Failed to initialize consult:", err);
          } finally {
            setLoading(false);
          }
        };
        
        initConsult();
        // Set normal back navigation
        setOnBack(() => () => navigate(`/compose/${providerId}/${questionData.providerSpecialtyId}`, { replace: true }));
      }

      // Cleanup on unmount
      return () => setOnBack(null);
    }, [preCheckData, questionData, navigate, providerId, setOnBack, setTitle, userId]);

  //console.log("onBack is set to:", onBack?.toString());

  if(loading) return <Loader />
  if(error) return <TurnBack reason={'dbupdate'} onBack={onBack} />

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <Card className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Consultation fee</span>
              <span className="text-2xl font-bold text-gray-900">
                ${(provider?.price_cents / 100).toFixed(0)}
              </span>
            </div>
            <p className="text-sm text-gray-600">Typical reply within {CONSULT_REPLY_HOURS} hours</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900">
              <strong>Good Faith Estimate:</strong> Your card will be authorized
              now and charged only if your question is accepted by the
              physician. If declined, you will receive an automatic refund.
            </p>
          </div>

          <Checkbox
            label="I understand this is non-emergency, asynchronous medical care. Care occurs where I am located. No prescriptions will be provided via this service."
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
          />
          {consentChecked && (
            <div className="mt-6 mb-20">
              <PaymentSection
                consultId={consultId}
                amount={provider?.price_cents}
                onFail={handlePaymentFailure}
                onSuccess={() => {
                  onSuccess(consultId);
                }}
              />
            </div>
          )}
          {/* <PaymentSection /> */}
          <div className="space-y-3">
            {/* <Button
              fullWidth
              onClick={handlePayment}
              disabled={!consentChecked || processing}
            >
              {processing ? 'Processing...' : 'Continue to payment'}
            </Button> */}
            <Button fullWidth variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Secured by Stripe • HIPAA Compliant
          </div>
        </Card>

        {/* <div className="sticky flex gap-3 z-50 bottom-0 bg-white p-4 border-t">
                    <Button type="button" variant="secondary" onClick={onFailure}>
                      Failed
                    </Button>
                    <Button type="submit" fullWidth>
                      Success
                    </Button>
                  </div>  */}
        {showErrorModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
            <div className="bg-white rounded-xl w-full max-w-sm p-6 text-center space-y-4 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800">
                {modalMessage}
              </h2>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => {
                    setShowErrorModal(false);
                    setModalMessage("");
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg w-24"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
