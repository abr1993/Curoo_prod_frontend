import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Header } from '../shared/Header';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Textarea } from '../ui/TextAreaNew';
import { Checkbox } from '../ui/Checkbox';
import { Chip } from '../ui/Chip';
//import { Consult } from '../../utils/mockData';
import { useHeader } from '@/contexts/HeaderContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Loader from '../shared/Loader';
import { AnswerData, ConsultDetail, ReportBody} from '@/types/consult';
import { TurnBack } from '../patient/TurnBack';
import { Preview } from './Preview';
import { extractSixDigits, formatDateTime, getSeverityColor } from '@/utils/helpers';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
interface CaseReviewProps {   
  onAccept: (consultId: string) => void;
  onDecline: (consultId: string, reason: string) => void;
  onSubmitAnswer: () => void;
} 

export const CaseReview: React.FC<CaseReviewProps> = ({  
  onAccept,
  onDecline,
  onSubmitAnswer,
}) => {

  const statusConfig = {
    SUBMITTED: { label: 'Awaiting review', color: 'amber', icon: '⏳' },
    //SUBMITTED: { label: 'Awaiting review', color: 'amber', icon: '⏳' },
    ACCEPTED: { label: 'Accepted-In progress', color: 'blue', icon: '✓' },
    ANSWERED: { label: 'Report ready', color: 'green', icon: '✓' },
    DECLINED: { label: 'Consult declined', color: 'gray', icon: '✕' },
    AUTO_DECLINED: { label: 'Consult timed out', color: 'gray', icon: '✕' },
    TIMEDOUT: { label: 'Consult timed out', color: 'gray', icon: '✕' },
  };
  type EditableField =
  | "overview"
  | "differential"
  | "selfcare"
  | "seekcare";
  

  const overviewRef = useRef<HTMLTextAreaElement>(null);
  const differentialRef = useRef<HTMLTextAreaElement>(null);
  const selfcareRef = useRef<HTMLTextAreaElement>(null);
  const seekcareRef = useRef<HTMLTextAreaElement>(null);
  const [processing, setProcessing] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [consult, setConsult] = useState<ConsultDetail | null>(null);
  const [report, setReport] = useState<ReportBody>(null);
  const [loading, setLoading] = useState(true);
  const [consultAnswer, setConsultAnswer] = useState<AnswerData>(null);
  
   const [error, setError] = useState<string | null>(null);
   const[modalError, setModalError] = useState<string | null>(null);
   const [turnbackError, setTurnbackError] = useState<'dbfetch' | 'accessDenied'>('dbfetch');
   const [isAccepted, setIsAccepted] = useState(false);
   const [isAnswered, setIsAnswered] = useState(false);
   const [isDeclined, setIsDeclined] = useState(false);
   const [isTimedOut, setIsTimedOut] = useState(false)
  const [declineReason, setDeclineReason] = useState('');
  const [overview, setOverview] = useState('');
  const [differential, setDifferential] = useState('');
  const [selfcare, setSelfCare] = useState('');
  const [seekcare, setSeekCare] = useState('');
  const [safetyChecks, setSafetyChecks] = useState({
    withinScope: false,
    nonEmergency: false,
    redFlagsIncluded: false,
  });

  const fieldRefs: Record<EditableField, React.RefObject<any>> = {
  overview: overviewRef,
  differential: differentialRef,
  selfcare: selfcareRef,
  seekcare: seekcareRef,  
};
const setOverviewRef = useCallback((node: HTMLTextAreaElement | null) => {
  // Sync with your existing useRef so other parts of the code still work
  (overviewRef as any).current = node;

  if (node !== null) {
    // Small delay ensures the browser has finished the layout (essential for 'center' block)
    requestAnimationFrame(() => {
      node.scrollIntoView({ behavior: "smooth", block: "center" });
      
      // Focus without jumping (since we already handled the scroll)
      node.focus({ preventScroll: true });
    });
  }
}, []);
 console.log("ComposeConsult component loaded");

  const { consultId } = useParams<{ consultId: string }>();
  const linkToken = new URLSearchParams(window.location.search).get("linkToken");
  const {token} = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
        const fetchConsult = async () => {
          try {
            setLoading(true);
            setError(null);
    
            //const token = localStorage.getItem("token"); // assuming JWT stored here
            const res = await fetch(`${VITE_API_BASE_URL}/api/consults/${consultId}?linkToken=${linkToken ?? ""}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
    
            if (!res.ok) {
              throw {
                status: res.status,                
              };
            }
    
            const data = await res.json();
            setConsult(data);
            setIsAccepted(data.status === 'ACCEPTED');
            setIsAnswered(data.status === "ANSWERED");
            setIsDeclined(data.status === "DECLINED");
            setIsTimedOut(data.status === "AUTO_DECLINED" || data.status === "TIMEDOUT");
          } catch (err: any) {
            console.error("Error fetching consults:", err);
            if(err.status === 403){
              setTurnbackError("accessDenied")
              setError("You don't have permission to view this consult.")
              return null;
            }
            setTurnbackError("dbfetch")
            setError("Failed to retrieve consult from the database.")
            return null;

            setError("Unable to load consults. Please try again later.");
          } finally {
            setLoading(false);
          }
        };
    
        fetchConsult();
      }, [consultId]);
      console.log("fetched provider consult",consult);

    useEffect(() => {
      const fetchReport = async () => {
          try {
            setLoading(true);
            setError(null);
    
            //const token = localStorage.getItem("token"); // assuming JWT stored here
            const res = await fetch(`${VITE_API_BASE_URL}/api/report/${consultId}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
    
            if (!res.ok) {
              throw new Error(`Failed to fetch report (${res.status})`);
            }
    
            const data = await res.json();
            setReport(data);            
          } catch (err: any) {
            console.error("Error fetching report:", err);
            setError("Unable to load report. Please try again later.");
          } finally {
            setLoading(false);
          }
        };
    
        if(consult?.status === "ANSWERED" || consult?.status === "ACCEPTED")fetchReport();
    }, [consult]);

  console.log("fetched provider report",report);

  useEffect(()=>{
    setOverview(report?.overview);
    setDifferential(report?.differentials_general);
    setSelfCare(report?.self_care_general);
    setSeekCare(report?.when_to_seek_care);

  }, [report]);
  const handleAccept = async() => {

    setLoading(true);
    setProcessing(true);
    
     if (!token) throw new Error("Missing authorized token");

      try {
            const response = await fetch(`${VITE_API_BASE_URL}/api/consults/${consultId}/accept`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
            
          });

      
      if (!response.ok) {
        const errorText = await response.text();
        
        throw new Error(`Request failed: ${response.status} - ${errorText}`);
        
      }

      const updatedConsult = await response.json();
      setIsAccepted(true);      
      await saveDraft();     
      setLoading(false);
      setProcessing(false);
      return updatedConsult;
      

      } catch (error) {
        if ((error as any).type === "DRAFT_ERROR") {
          setModalMessage('❌ Failed to save this consult as a draft.');
          setModalError("Draft Failed");
          setShowSuccessModal(true);
        } else {
          console.error("Error updating consult status:", error);
          setError("Error updating consult status");
          setLoading(false);
          setProcessing(false);
          throw error;
        }
      }
  };

  async function declineConsult(consultId: String) {
      //const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing authorized token");

      try {
            const response = await fetch(`${VITE_API_BASE_URL}/api/consults/${consultId}/decline`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
            
          });

      
      if (!response.ok) {
        const errorText = await response.text();
       // console.error(`Request failed: ${response.status} - ${errorText}`)
        throw new Error(`Request failed: ${response.status} - ${errorText}`);
        
      }

      const updatedConsult = await response.json();
      return updatedConsult;
      

      } catch (error) {
        console.error("Error updating consult status:", error);
        throw error;
      }
  }
  const handleDecline = async () => {
    
    /* if (declineReason.trim()) {
      
      
    }else{
      setError("Please type a reason");
    } */
   setProcessing(true);
    try{
        await declineConsult(consult.id);        
        onDecline(consult.id, declineReason);
        setShowDeclineModal(false);
      }catch(error){
          setError("Database Update Failed");
          
          setProcessing(false);
      }
    setProcessing(false);
  };

  const saveDraft = async (): Promise<any> => {
      const draftAnswer: AnswerData = {
        overview: overview ?? "",
        differentials_general: differential ?? "",
        self_care_general: selfcare ?? "",
        when_to_seek_care: seekcare ?? "",
      };
      
        const response = await fetch(`${VITE_API_BASE_URL}/api/consults/${consultId}/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(draftAnswer),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Backend error response:", errorText);
          const error = new Error(`Draft save failed: ${response.status}`);
          (error as any).type = "DRAFT_ERROR"; // attach custom property
          throw error;
        }

        const result = await response.json();
        return result; // Return result to the caller
      
    };


  const handleSaveDraft = async()=> {
      
            try {
              await saveDraft();
              setModalMessage('✅ Your consult is successfully saved as a draft.');
              setShowSuccessModal(true);
            } catch (error) {
              setModalMessage('❌ Failed to save your consult as a draft.');
              setModalError("Draft Failed");
              setShowSuccessModal(true);
            }

  }
  const handleSignandSend = async() => {
    const allChecked = Object.values(safetyChecks).every((v) => v);
    const validationOrder: EditableField[] = [
      "overview",
      "differential",
      "selfcare",
      "seekcare",
    ];
    const fieldValues: Record<EditableField, any> = {
      overview,
      differential,
      selfcare,
      seekcare,
    };
    const firstInvalidField = validationOrder.find(field => {
      const value = fieldValues[field];
      return value == null || value === "";
    });
    if (firstInvalidField) {
        setModalError("Sign");
        setModalMessage("❌ Please complete all sections.");
        setShowSuccessModal(true);

        requestAnimationFrame(() => {
          const ref = fieldRefs[firstInvalidField];
          ref?.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          ref?.current?.focus?.();
        });

        return;
      }
    if (!allChecked) {
      //alert('Please complete all sections and safety checklist');
      
      setModalError("Sign");
      setModalMessage("❌ Please complete the safety checklist.");
      setShowSuccessModal(true);
      return;
    }
    const consultAnswer: AnswerData = {
      overview,
      differentials_general: differential,
      self_care_general: selfcare,
      when_to_seek_care: seekcare,
    };
    setConsultAnswer(consultAnswer);
    setShowPreview(true);

  }
  const handleEditField = (field: EditableField) => {
    setShowPreview(false);

    // wait for modal to unmount
    requestAnimationFrame(() => {
      const ref = fieldRefs[field];
      ref?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      ref?.current?.focus?.();
    });
  };

  const handleSubmitAnswer = async() => {
    /* const allChecked = Object.values(safetyChecks).every((v) => v);
    if (!allChecked || !overview || !differential || !selfcare || !seekcare) {
      alert('Please complete all sections and safety checklist');
      return;
    }
    const consultAnswer: AnswerData = {
      overview,
      differentials_general: differential,
      self_care_general: selfcare,
      when_to_seek_care: seekcare,
    }; */
    setLoading(true);
    try{
      const response = await fetch(`${VITE_API_BASE_URL}/api/consults/${consultId}/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(consultAnswer),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);
      throw new Error(`Request failed: ${response.status}`);
    }

    //const result = await response.json();
    //console.log("Consult created:", result);
    //return result.id;
    setModalError("");
    setModalMessage("✅ Your review has been successfully submitted. Thank you!");
    setLoading(false);
    setShowSuccessModal(true);
    //onSubmitAnswer( );

    }catch(err){
        console.error("Failed to initialize consult:", err);
        setError("Failed to create Provider Report.");
    }
    
  };

   const status = consult?.status ? statusConfig[consult.status] : statusConfig.SUBMITTED;

  

  const getFormatedDate = (dateOfBirth: string | Date): string =>{
    const birthDate = new Date(dateOfBirth);
    const formattedDOB = birthDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return formattedDOB;
  }

  const calculateAge = (dateOfBirth: string | Date): number =>{
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  
  const { setTitle } = useHeader();
    useEffect(() => { setTitle("Review case"); }, []);    


  if (loading) return <Loader />;  
   if (error) return <TurnBack reason={turnbackError} onBack={()=> navigate('/provider/inbox')} />
    
  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-50">
      <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{status.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {status.label}
                </h2>
                {/* <p className="text-sm text-gray-600">
                  Submitted {new Date(consult.submitted_date).toLocaleString()}
                </p> */}
              </div>
            </div>

            <span className="text-xs text-gray-500">
              <strong> ID: {extractSixDigits(consult.id)}</strong>
            </span>
          </div>

          <div className="space-y-4">
            {[
              {
                label: "Payment authorized",
                done: consult.status !== "ISDRAFT",
                date: consult.submitted_date,
              },
              { label: "Submitted", done: true, date: consult.submitted_date },
              ...(consult.status === "DECLINED"
                ? [
                    {
                      label: "Declined",
                      done: true,
                      date: consult.declined_date,
                    },
                  ]
                : consult.status === "AUTO_DECLINED" ||
                  consult.status === "TIMEDOUT"
                ? [
                    {
                      label: "Timed out",
                      done: true,
                      date: consult.timed_out_date,
                    },
                  ]
                : [
                    {
                      label: "Accepted",
                      done: ["ACCEPTED", "ANSWERED"].includes(consult.status),
                      date: consult.accepted_date,
                    },
                    {
                      label: "Report completed",
                      done: ["ANSWERED"].includes(consult.status),
                      date: consult.answered_date,
                    },
                  ]),
            ].map((step, i) => (
              <div key={i} className="grid grid-cols-[55%_45%] gap-3 text-left items-start">
                {/* Left side: status + icon */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step.done ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    {step.done && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      step.done ? "text-gray-900 font-medium" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Right side: date */}
                {step.date && (
                  <span className="text-xs text-gray-600 text-left break-words md:text-right">
                    <strong>{formatDateTime(new Date(step.date))}</strong>
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Patient summary
          </h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Name or Initials:</strong> {consult.legal_name}{" "}
            </p>
            <p>
              <strong>Date of birth:</strong>{" "}
              {getFormatedDate(consult.date_of_birth)}
            </p>
            <p>
              <strong>Age:</strong> {calculateAge(consult.date_of_birth)}
            </p>
            <p>
              <strong>State:</strong> {consult.state_at_service}
            </p>
            <p>
              <strong>Topic:</strong>{" "}
              {consult.topics.map((topic) => topic.name + " ") ||
                "General concern"}
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Question</h2>

          <p className="text-gray-700 mb-4">{consult.question_body}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {consult.consult_specialty_symptoms.map((item, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg shadow-sm ${getSeverityColor(
                  item.Value ?? 0
                )}`}
              >
                <p className="text-xs text-gray-600">
                  {item.specialty_symptom.symptom.name}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {item.Value ?? 0}/10
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm">
            {/* <p><strong>Medications:</strong> {consult.medications || 'None'}</p>
            <p><strong>Allergies:</strong> {consult.allergies || 'None'}</p> */}
            {Object.values(consult.medical_history).map((item, index) => (
              <span key={index} className="block">
                <strong>{item.fieldName}:</strong>{" "}
                {Array.isArray(item.value) ? item.value.join(", ") : item.value}
              </span>
            ))}
          </div>
        </Card>

        {!isAccepted && !isAnswered && !isDeclined && !isTimedOut && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowDeclineModal(true)}>
              Decline
            </Button>
            <Button fullWidth onClick={handleAccept} disabled={processing}>
              {processing ? "Processing…" : "Accept & Capture Payment"}
            </Button>
          </div>
        )}

        {isAccepted && (
          <>
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Compose answer
              </h2>
              <div className="space-y-4">
                <Textarea
                  label="Overview"
                  ref={setOverviewRef}
                  placeholder="Brief summary of the patient's concern..."
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                />
                <Textarea
                  label="Differential considerations (general)"
                  ref={differentialRef}
                  placeholder="Possible causes to consider..."
                  value={differential}
                  onChange={(e) => setDifferential(e.target.value)}
                />
                <Textarea
                  label="What's reasonable at home"
                  ref={selfcareRef}
                  placeholder="General self-care measures..."
                  value={selfcare}
                  onChange={(e) => setSelfCare(e.target.value)}
                />
                <Textarea
                  label="When to seek in-person care"
                  ref={seekcareRef}
                  placeholder="Red flags and when to escalate..."
                  value={seekcare}
                  onChange={(e) => setSeekCare(e.target.value)}
                />
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Safety checklist
              </h3>
              <div className="space-y-2">
                <Checkbox
                  label="Within scope & licensure"
                  checked={safetyChecks.withinScope}
                  onChange={(e) =>
                    setSafetyChecks({
                      ...safetyChecks,
                      withinScope: e.target.checked,
                    })
                  }
                />
                <Checkbox
                  label="Non-emergency confirmed"
                  checked={safetyChecks.nonEmergency}
                  onChange={(e) =>
                    setSafetyChecks({
                      ...safetyChecks,
                      nonEmergency: e.target.checked,
                    })
                  }
                />
                <Checkbox
                  label="Clear red-flag section included"
                  checked={safetyChecks.redFlagsIncluded}
                  onChange={(e) =>
                    setSafetyChecks({
                      ...safetyChecks,
                      redFlagsIncluded: e.target.checked,
                    })
                  }
                />
              </div>
            </Card>
            <div className="sticky flex gap-3 z-50 bottom-0 bg-white p-4 border-t">
              <Button
                type="button"
                variant="secondary"
                className="whitespace-nowrap"
                onClick={handleSaveDraft}
              >
                <span className="hidden sm:inline">Save/Finish Later</span>
                <span className="inline sm:hidden">Save</span>
              </Button>
              <Button fullWidth onClick={handleSignandSend}>
                Next
              </Button>
            </div>
          </>
        )}

        {isAnswered && (
          <>
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Report
              </h2>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Overview
                </h2>
                <p className="text-gray-700 mb-4">{report?.overview}</p>
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Differential considerations (general)
                </h2>
                <p className="text-gray-700 mb-4">
                  {report?.differentials_general}
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  What's reasonable at home
                </h2>
                <p className="text-gray-700 mb-4">
                  {report?.self_care_general}
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  When to seek in-person care
                </h2>
                <p className="text-gray-700 mb-4">
                  {report?.when_to_seek_care}
                </p>
              </div>
            </Card>
          </>
        )}

        {showDeclineModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Decline consult
              </h3>
              <Textarea
                label="Reason (internal)"
                placeholder="Why are you declining this consult?"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
              />
              <div className="flex gap-3 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeclineModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={handleDecline}
                  disabled={processing}
                >
                  {processing ? "Processing…" : "Decline & Refund"}
                </Button>
              </div>
            </Card>
          </div>
        )}
        {showPreview && (
          <Preview
            questionData={consultAnswer}
            onEdit={handleEditField}
            onContinue={handleSubmitAnswer}
          />
        )}
        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
            <div className="bg-white rounded-xl w-full max-w-sm p-6 text-center space-y-4 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800">
                {modalMessage}
              </h2>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => {
                    if (modalError === "Draft Failed") {
                      setShowSuccessModal(false);
                      setModalMessage("");
                    } else if (modalError === "Sign") {
                      setShowSuccessModal(false);
                      setModalMessage("");
                    } else {
                      onSubmitAnswer();
                    }
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
