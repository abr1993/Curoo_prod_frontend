import React, { useEffect, useState } from 'react';
import { Header } from '../shared/Header';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { useHeader } from '@/contexts/HeaderContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useBackHandler } from '@/contexts/BackHandlerContext';
import { useAuth } from '@/hooks/useAuth';
import Loader from '../shared/Loader';
import { TurnBack } from './TurnBack';
import { ConsultDetail, ReportBody } from '@/types/consult';

interface StatusViewProps { 
  onViewReport?: () => void;
}
 const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const StatusView: React.FC<StatusViewProps> = ({ onViewReport }) => {
  const statusConfig = {
    SUBMITTED: { label: 'Awaiting review', color: 'amber', icon: '⏳' },
    //SUBMITTED: { label: 'Awaiting review', color: 'amber', icon: '⏳' },
    ACCEPTED: { label: 'Accepted-In progress', color: 'blue', icon: '✓' },
    ANSWERED: { label: 'Report ready', color: 'green', icon: '✓' },
    DECLINED: { label: 'Consult declined', color: 'gray', icon: '✕' },
    TIMEDOUT: { label: 'Consult timed out', color: 'gray', icon: '✕' },
    AUTO_DECLINED: { label: 'Consult timed out', color: 'gray', icon: '✕' },
    
  };
  //console.log("consult", consult);
  const answerplace = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem.";
  const question = "I have a small painful bump on my upper eyelid. what should i do?"

  const longAnswer =
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.";
  const longQuestion =
    "I have a small painful bump on my upper eyelid. It’s red and tender, and it has been getting slightly bigger over the past two days. What should I do?";
  
  const [showFullAnswer, setShowFullAnswer] = useState(false);
  const [showFullAnswer2, setShowFullAnswer2] = useState(false);
  const [viewAnswer, setViewAnswer] = useState(false);
  const [viewQuestion, setViewQuestion] = useState(false);
  
  //const status = statusConfig.preauthorized;
  const { consultId } = useParams<{ consultId: string }>();
  const linkToken = new URLSearchParams(window.location.search).get("linkToken");
  const {token} = useAuth();
  const [consult, setConsult] = useState<ConsultDetail | null>(null);
  const [report, setReport] = useState<ReportBody | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [turnbackError, setTurnbackError] = useState<'dbfetch' | 'accessDenied'>('dbfetch');

  
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

  async function getConsultById(consultId: string, token: string): Promise<ConsultDetail | null> {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/consults/${consultId}?linkToken=${linkToken ?? ""}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // pass your JWT here
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw {
          status: response.status,
          message: text || "Something went wrong"
        };
        //throw new Error(`Error ${response.status}: ${text}`);
      }

      const data: ConsultDetail = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch consult:", error.status);
      if(error.status === 403){
        setTurnbackError("accessDenied")
        setError("You don't have permission to view this consult.")
        return null;
      }
      setTurnbackError("dbfetch")
      setError("Failed to retrieve consult from the database.")
      return null;
    }
  }

  const getSeverityColor = (value: number): string => { 
    if (value <= 0) return 'bg-gray-100 text-gray-700'; 
    if (value <= 3) return 'bg-green-100 text-green-800'; 
    if (value <= 6) return 'bg-yellow-100 text-yellow-800'; 
    if (value <= 8) return 'bg-orange-100 text-orange-800'; 
    return 'bg-red-100 text-red-700'; 
  };
  const { setTitle } = useHeader();
  const { setOnBack, onBack } = useBackHandler();
  const navigate = useNavigate();
  useEffect(() => { 

    async function fetchConsult() {
      const result = await getConsultById(consultId, token);
      setConsult(result);
      setLoading(false);
    }

    fetchConsult();
    /* getConsultById(consultId, token).then((consult) => {
      if (consult) {
        console.log("Consult data:", consult);
      } else {
        console.log("Consult not found or failed to fetch");
      }
    }); */
    setTitle("Consult status"); 
    const searchParams = new URLSearchParams(location.search);
    const previousTab = searchParams.get("tab") || "all";
    setOnBack(() => () => navigate(`/myconsults?tab=${previousTab}`, { replace: true }));
    return () => setOnBack(null);
  }, [navigate, setOnBack, consultId]);

  console.log("Consult data:", consult);  

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
      
          if(consult?.status === "ANSWERED")fetchReport();
      }, [consult]);
    console.log("fetched provider report",report);
    const extractSixDigits = (input: string): string =>{
      // Extract all digits from the string
      const digits = input.replace(/\D/g, '');

      // Take only the first 6 digits
      const firstSix = digits.slice(0, 6);

      // If fewer than 6 digits, pad with zeros at the end
      return firstSix.padEnd(6, '0');
    }
    const status = consult?.status ? statusConfig[consult.status] : statusConfig.SUBMITTED;

  if (loading) return <Loader />;
  if (error) return <TurnBack reason={turnbackError} onBack={onBack} />

  return (
    <div className="min-h-screen bg-gray-50">
           
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{status.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{status.label}</h2>
              <p className="text-sm text-gray-600">
                Submitted {new Date(consult.submitted_date).toLocaleString()}
              </p>
            </div>
          </div>

          <span className="text-xs text-gray-500">
            <strong>ID: {extractSixDigits(consult.id)}</strong>
          </span>
        </div>


          <div className="space-y-3">
                {[
                    { label: 'Payment authorized', done: consult.status !== 'ISDRAFT', date: consult.submitted_date },
                    { label: 'Submitted', done: true, date: consult.submitted_date },
                    ...(consult.status === 'DECLINED'
                      ? [
                          { label: 'Declined', done: true, date: consult.declined_date },
                        ]
                      : consult.status === 'AUTO_DECLINED' || consult.status === 'TIMEDOUT'
                      ? [
                          { label: 'Timed out', done: true, date: consult.timed_out_date },
                        ]
                      : [
                          { label: 'Accepted by physician', done: ['ACCEPTED', 'ANSWERED'].includes(consult.status), date: consult.accepted_date },
                          { label: 'Report completed', done: ['ANSWERED'].includes(consult.status), date: consult.answered_date },
                        ]),
                  ].map((step, i) => (
                      <div key={i} className="flex justify-between items-center">
                        {/* Left side: status + icon */}
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              step.done ? 'bg-green-500' : 'bg-gray-300'
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
                              step.done ? 'text-gray-900 font-medium' : 'text-gray-500'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>

                        {/* Right side: date */}
                        {step.date && (
                          <span className="text-sm text-black-500">
                            {new Date(step.date).toLocaleString()}
                          </span>
                        )}
                      </div>
                    ))}
              </div>
        </Card>

        {/* {consult.status === 'ANSWERED' && onViewReport && (
          <Button fullWidth onClick={onViewReport}>
            View your report
          </Button>
        )} */}
        { (consult.status === 'ANSWERED') && (
        <Card>
            <button
              type="button"
              onClick={() => setViewAnswer(!viewAnswer)}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900">View Physician Answer</h3>
              <svg
                className={`w-5 h-5 transition-transform ${viewAnswer ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {viewAnswer && (
              <div className="mt-6 space-y-6">        
              {/* <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Differential Considerations
                </p>
                <div className="relative">
                  <div
                    className={`p-3 rounded-lg bg-gray-100 text-gray-800 whitespace-pre-line transition-all ${
                      showFullAnswer ? "max-h-none" : "max-h-32 overflow-hidden"
                    }`}
                  >
                    {longAnswer}
                  </div>
                  {!showFullAnswer && (
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-100 to-transparent" />
                  )}
                </div>
                {longAnswer.length > 100 && (
                  <button
                    onClick={() => setShowFullAnswer(!showFullAnswer)}
                    className="text-blue-600 text-sm mt-2 font-semibold hover:text-blue-800 transition-colors"
                  >
                    {showFullAnswer ? "▲ Read less" : "▼ Read more"}
                  </button>
                )}
              </div> */}

              {/* <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  What's reasonable at home
                </p>
                <div className="relative">
                  <div
                    className={`p-3 rounded-lg bg-gray-100 text-gray-800 whitespace-pre-line transition-all ${
                      showFullAnswer2 ? "max-h-none" : "max-h-32 overflow-hidden"
                    }`}
                  >
                    {longAnswer}
                  </div>
                  {!showFullAnswer2 && (
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-100 to-transparent" />
                  )}
                  {longAnswer.length > 100 && (
                  <button
                    onClick={() => setShowFullAnswer2(!showFullAnswer2)}
                    className="text-blue-600 text-sm mt-2 font-semibold hover:text-blue-800 transition-colors"
                  >
                    {showFullAnswer2 ? "▲ Read less" : "▼ Read more"}
                  </button>
                )}
                </div>
              </div> */}
                          
          <Card className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Report</h2>

              <div className="space-y-8 divide-y divide-gray-100">
                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Overview</h3>
                  <p className="text-gray-700 leading-relaxed">{report?.overview}</p>
                </section>

                <section className="pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Differential Considerations (General)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {report?.differentials_general}
                  </p>
                </section>

                <section className="pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    What’s Reasonable at Home
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{report?.self_care_general}</p>
                </section>

                <section className="pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    When to Seek In-Person Care
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{report?.when_to_seek_care}</p>
                </section>
              </div>
            </Card>
                         
              </div>
            )}
          </Card>)}
          <Card>
            <button
              type="button"
              onClick={() => setViewQuestion(!viewQuestion)}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900">View Question</h3>
              <svg
                className={`w-5 h-5 transition-transform ${viewQuestion ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {viewQuestion && (
              <div className="mt-6 space-y-6">               
                             

                <div>
                  <Textarea
                                label="Question"                                
                                value={consult.question_body}
                                disabled={true}                                
                                
                              />

                  <Card>                            
                            <div className="space-y-4 text-sm">
                              <p><strong>Date of birth:</strong> {getFormatedDate(consult.date_of_birth)}</p>                              
                              <p><strong>Age:</strong> {calculateAge(consult.date_of_birth)}</p>
                              <p><strong>State:</strong> { consult.state_at_service }</p>
                              <p><strong>Topic:</strong> { consult.topics.map(topic=> ( topic.name + " ")) || 'General concern'}</p>
                            </div>
                      </Card>
                      <Card>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 ">
                    {consult.consult_specialty_symptoms.map((item) => (
                      <div key={item.specialty_symptom.id} className={`p-3 rounded-lg shadow-sm ${getSeverityColor( item.Value ?? 0 )}`}>
                        <p className="text-xs text-gray-600">{item.specialty_symptom.symptom.name}</p>
                        <p className="text-lg font-semibold text-gray-900">{item.Value ?? 0}/10</p>
                      </div>
                    ))}
                  </div>
                  </Card>
                  <Card>
                  <div className="space-y-2 text-sm">
                    {Object.values(consult.medical_history || {}).map((item, index) => (
                      <span key={index} className="block">
                        <strong>{item.fieldName}:</strong>{" "}
                        {Array.isArray(item.value)
                          ? item.value.join(", ")
                          : item.value}
                      </span>
                    ))}
                  </div>
                  </Card>
                </div>

                         
              </div>
            )}
          </Card>
        {consult.status === 'DECLINED' && (
          <Card className="bg-gray-50">
            <p className="text-sm text-gray-700">
              Your question was declined. A full refund has been processed to your original payment method. You should see it within 5-7 business days.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
