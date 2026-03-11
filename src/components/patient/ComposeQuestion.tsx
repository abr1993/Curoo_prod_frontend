import React, { useEffect, useRef, useState } from 'react';
import { Header } from '../shared/Header';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Textarea } from '../ui/TextAreaNew';
import { Input } from '../ui/Input';
import { Slider } from '../ui/Slider';
import { PRONOUNS, SEX_ASSIGNED_AT_BIRTH } from '../../utils/constants';
import { Select } from '../ui/Select';
import { useAuth } from '@/hooks/useAuth';

import { useHeader } from '@/contexts/HeaderContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MedicalHistorySection from './MedicalHistory';
import { ConsultInput, HistoryField, PreCheckData, QuestionDataNew, Symptom, Topic } from '@/types/consult';
import { PreviewModal } from './PreviewModal';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
interface ComposeQuestionProps {  
  onSubmit: (userId: string, providerSpecialtyId: string, preCheckData: PreCheckData, data: QuestionDataNew) => void;
  onFail: ()=> void;
  preCheckData: PreCheckData;  
  draftQuestionData: QuestionDataNew;
  setDraftQuestionData?: React.Dispatch<React.SetStateAction<QuestionDataNew>>;
}

export const ComposeQuestion: React.FC<ComposeQuestionProps> = ({  
  onSubmit,
  preCheckData,
  onFail,  
  draftQuestionData,
  setDraftQuestionData
}) => {
  const [questionData, setQuestionData] = useState<QuestionDataNew>(
    draftQuestionData || {
      
      question: "",
      noMedications: false,
      historyFields: [],      
      providerSpecialtyId: null,
      symptoms: [],
      showNameOptions: "",
      topics:[],
      legalName: "",
      showFullName: false,
      pronouns:"",
      sexatbirth:""
    }
  );
  // Individual form fields
  const [question, setQuestion] = useState(questionData.question); 
  const questionRef = useRef<HTMLTextAreaElement>(null); 
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [noMedications, setNoMedications] = useState(questionData.noMedications);
  //const [allergies, setAllergies] = useState(questionData.allergies);
  const [legalName, setLegalName] = useState(questionData.legalName);
  const [showFullName, setShowFullName] = useState(questionData.showFullName);
  const [pronouns, setPronouns] = useState<string>(
    questionData.pronouns ? questionData.pronouns.toString() : ""
  );
  const [sexatbirth, setSexAtBirth] = useState<string>(
    questionData.sexatbirth ? questionData.sexatbirth.toString() : ""
  );
  
  const [showDetails, setShowDetails] = useState(true);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {token, userId} = useAuth();
  
  const { providerId } = useParams<{ providerId: string }>();
  const { providerSpecialtyId } = useParams<{ providerSpecialtyId: string }>();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>(questionData?.topics || []);
  const [showPreview, setShowPreview] = useState(false);
  const [medicationError, setMedicationError] = useState(false);
  
  const [values, setValues] = useState<Record<string, number>>({});
  useEffect(() => {
      if (questionData?.symptoms) {
        const updatedValues: Record<string, number> = {};
        questionData.symptoms.forEach((s) => {
          updatedValues[s.specialtySymptomId] = s.value;
        });
        setValues(updatedValues);
      }
    }, [questionData.symptoms]);
    
  const [medicalHistory, setMedicalHistory] = useState<{ id: string; name: string; value: any }[]>([]);
  const location = useLocation();
  const navigate = useNavigate();     

  // Fetch symptoms dynamically
  useEffect(() => {
    const fetchSymptoms = async () => {
      const res = await fetch(`${VITE_API_BASE_URL}/api/specialty/${providerSpecialtyId}/symptoms`);
      const data: Symptom[] = await res.json();
      setSymptoms(data);

      // Step 1: build a map of saved symptom values from draftQuestionData
      const savedValues = draftQuestionData.symptoms.reduce((acc, s) => {
        acc[s.specialtySymptomId] = s.value;
        return acc;
      }, {} as Record<string, number>);

      // Step 2: merge with fetched data
      const mergedValues = data.reduce((acc: Record<string, number>, s: Symptom) => {
        acc[s.specialty_symptom_id] = savedValues[s.specialty_symptom_id] ?? 0;
        return acc;
      }, {});

      setValues(mergedValues);
    };
    fetchSymptoms();    

  }, [draftQuestionData, providerSpecialtyId]);
  const loadedquestiondata = location.state?.questionData;  
  useEffect(() => {    
    
    if(loadedquestiondata){
    
    setQuestionData(loadedquestiondata)
    setDraftQuestionData(loadedquestiondata);

      }      

  }, [loadedquestiondata]);

  const [fields, setFields] = useState<HistoryField[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Fetch the template from the API
  useEffect(() => {
    const fetchHistoryTemplate = async () => {
      const res = await fetch(`${VITE_API_BASE_URL}/api/specialty/${providerSpecialtyId}/historyfields`);
      const data = await res.json();
      setFields(data);
    };
    fetchHistoryTemplate();
  }, [providerSpecialtyId]);

  const handleTextChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const toggleOption = (fieldName: string, optionValue: string) => {
    setFormData(prev => {
      const current = prev[fieldName] || [];
      return {
        ...prev,
        [fieldName]: current.includes(optionValue)
          ? current.filter((o: string) => o !== optionValue)
          : [...current, optionValue],
      };
    });
  };

  const handleNoMedicationsChange = (val: boolean) => {
    setNoMedications(val);
    //setMedicationError(false); // clear error if checkbox checked
  };

  const handleMedicalHistoryChange = (fields) => {
    setMedicalHistory(fields);

    const medsField = fields.find(f => f.name === "Medications");
    const hasValue = medsField?.value?.trim().length > 0;

    // ONLY clear the error if the user has actually provided a value or checked the box
    if (hasValue || noMedications) {
      setMedicationError(false);
    }
  };

  useEffect(() => {
    // If user provides a value OR checks the "No medications" box, hide the error
    if (noMedications || formData["Medications"]?.trim()) {
      setMedicationError(false);
    }
  }, [noMedications, formData["Medications"]]);
  

  const normalizeValue = (fieldName: string, value: string) => {
    
    // 1. Handle Array-based fields (MULTISELECT)
    if (Array.isArray(value)) {
      // If the array is empty, return ["None"]
      if (value.length === 0) {
        return ["None"];
      }
      return value;
    }

    if (typeof value === "string" && value.trim() === "") {
      return "None";
    }

    return value;
  };

  const handleSubmit = (e: React.FormEvent) => {
    
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!question.trim()) {
        
        setModalMessage("❌ Please describe your concern.");
        setShowModal(true);

        requestAnimationFrame(() => {
          const ref = questionRef;
          ref?.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          ref?.current?.focus?.();
        });

        return;
      }

      const medsField = medicalHistory.find(field => field.name === "Medications");

        // 2. Safely get the value and trim it
        const medsValue = medsField?.value?.trim();

        // 3. Validation Logic
       if (!noMedications && !medsValue) {
          setMedicationError(true);

          // We use setTimeout(0) to push the scroll to the end of the execution queue.
          // This ensures the error message is actually rendered before we scroll to it.
          setTimeout(() => {
            const errorEl = document.getElementById("medication-error-zone");
            if (errorEl) {
              errorEl.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center', // 'center' is usually best, but 'nearest' works if center fails
                inline: 'nearest' 
              });
            }
          }, 10);

          return;
        }

      // If validation passes, reset error
      setMedicationError(false);
      
    const formattedSymptoms = symptoms.map(symptom => ({
      specialtySymptomId: symptom.specialty_symptom_id,
      symptomName: symptom.symptom_name,   // 👈 add label
      value: values[symptom.specialty_symptom_id] ?? 0,
    }));

    const draft: QuestionDataNew = {
      consultId: questionData.consultId,
      providerSpecialtyId: providerSpecialtyId,
      question,      
      historyFields: medicalHistory.map((h) => ({
        historyFieldId: h.id,
        fieldName: h.name,
        value: normalizeValue(h.name, h.value),
      })),
      topics: selectedTopics,
      showNameOptions: showFullName?  "FULL_NAME" : "INITIALS_ONLY",
      symptoms: formattedSymptoms,
      noMedications: noMedications,
      legalName,
      showFullName,
      pronouns,
      sexatbirth

    };
    
    if (setDraftQuestionData) setDraftQuestionData(draft);   
    setShowPreview(true);
    //onSubmit(providerId, providerSpecialtyId, preCheck, draft );
  };
  const handleContinueFromPreview = ()=>{    
    onSubmit(providerId, providerSpecialtyId, preCheck, draftQuestionData );
  }
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null); 

  const handleSliderChange = (id: string, newValue: number) => {
    setValues(prev => ({ ...prev, [id]: newValue }));
  };

  //const showPhotoUpload = selectedTopics.includes('Eyelid lesion or growth');
  const showPhotoUpload = false;
  const { role } = useAuth();
  // Handle photo upload + preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    } else {
      setPhotoPreview(null);
    }
  };
  


  const { setTitle } = useHeader();
  const preCheck = location.state?.preCheckData;
  
  //const { questionData: initialQuestionData } = location.state || {};    

    useEffect(() => { 
      const fetchProviderName = async () => {
        try {
          if (!providerId) return;

          const response = await fetch(
            `${VITE_API_BASE_URL}/api/providers/${providerId}`
          );
          if (!response.ok) throw new Error("Failed to fetch provider name");

          const data = await response.json();          

          if (data?.display_name) {
            setTitle(`Ask ${data.display_name}`);
          } else if (data?.user?.email) {
            // fallback if display_name missing
            setTitle(`Ask ${data.user.email}`);
          } else {
            setTitle("Ask Doctor");
          }
        } catch (error) {
          
          setTitle("Ask Doctor");
        }
      };

  fetchProviderName(); 

      if (!preCheck) {
        onFail();
        return;
      }
      
      questionData.providerSpecialtyId = providerSpecialtyId;

      if (draftQuestionData) {
        

        // Populate form fields
        setQuestion(draftQuestionData.question);        
        
        setNoMedications(draftQuestionData.noMedications);
        
        setLegalName(draftQuestionData.legalName);
        setShowFullName(draftQuestionData.showFullName);

        // Keep the state in sync
        setQuestionData(draftQuestionData);
       
      }
    }, [location.state, preCheck, onFail]);

    const onClickOk = () =>{

    }
    const handleSave = async () => {
    
        const topicIds: string[] = selectedTopics.map(topic => topic.id);
    
        const consultInput: ConsultInput = {         
         
              patientId: userId, // get from token or context
              providerId: providerId,
              providerSpecialtyId: providerSpecialtyId,
              stateAtService: preCheck.state,
              topics: topicIds,
              questionBody: question,
              pronouns,
              sexatbirth,
              
              dateOfBirth: new Date(preCheck.dob).toISOString(),
              legalName: legalName || "",
              showNameOptions: showFullName ? "FULL_NAME" : "INITIALS_ONLY",
              historyFields: medicalHistory.map((h) => ({
                                historyFieldId: h.id,
                                fieldName: h.name,
                                value: normalizeValue(h.name, h.value),
                              })),
              symptoms:  Object.entries(values).map(([id, value]) => ({
                          specialtySymptomId: id,
                          value,
                        })),       
              created_by: userId,
              status: "ISDRAFT"
            };

            
            try{
              if(questionData.consultId !== undefined){
                const response = await fetch(`${VITE_API_BASE_URL}/api/consults/${questionData.consultId}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(consultInput),
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    
                    throw new Error(`Request failed: ${response.status}`);
                  }
                      
                  const result = await response.json();

              }else{
                const response = await fetch(`${VITE_API_BASE_URL}/api/consults`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(consultInput),
                  });
              
                  if (!response.ok) {
                    const errorText = await response.text();
                    
                    throw new Error(`Request failed: ${response.status}`);
                  }
                      
                  const result = await response.json();
                  questionData.consultId = result.id;
                
              }
                
                setModalMessage('✅ Your consult is successfuly saved as a draft.');
                setShowModal(true);
                
            }catch(error){        
                setModalMessage('❌ Failed to save your consult as a draft.');
                setShowModal(true);
                //throw new Error('Failed to save draft');
            }      
    
  }


  

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <Textarea
              label="Your question"
              placeholder="Briefly describe what's going on..."
              ref={questionRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              error={errors.question}
              helperText="Avoid personal identifiers"
            />
          </Card>

          <Card>
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Add details
              </h3>
              <svg
                className={`w-5 h-5 transition-transform ${
                  showDetails ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showDetails && (
              <div className="mt-6 space-y-6">
                {symptoms.map((symptom) => (
                  <Slider
                    key={symptom.specialty_symptom_id}
                    label={symptom.symptom_name}
                    value={values[symptom.specialty_symptom_id] || 0}
                    onChange={(val) =>
                      handleSliderChange(symptom.specialty_symptom_id, val)
                    }
                  />
                ))}

                <MedicalHistorySection
                  providerSpecialtyId={providerSpecialtyId}
                  onChange={handleMedicalHistoryChange}
                  onNoMedicationsChange={handleNoMedicationsChange}
                  onTopicsChange={setSelectedTopics}
                  initialHistoryFields={questionData.historyFields}
                  initialNoMedications={questionData.noMedications}
                  initialTopics={questionData.topics}
                  medicationError={medicationError}
                />
              </div>
            )}
          </Card>

          <Card>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Identity & Privacy
              </label>

              <div className="border-t pt-4">
                <Input
                  label="Legal name (optional)"
                  placeholder="First Last"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  helperText="Stored securely. Doctor sees initials by default."
                />

                {/* 🔽 New radio button group */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Show my name to the doctor as
                  </p>

                  <div className="flex flex-row items-center gap-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="displayNamePreference"
                        value="initials"
                        checked={!showFullName}
                        onChange={() => setShowFullName(false)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Initials only
                      </span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="displayNamePreference"
                        value="full"
                        checked={showFullName}
                        onChange={() => setShowFullName(true)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Full name</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <Select
                  label="Pronouns"
                  options={[
                    /* { value: '', label: 'Select your pronouns' }, */
                    { value: "", label: "" },
                    ...PRONOUNS,
                  ]}
                  value={pronouns}
                  onChange={(e) => setPronouns(e.target.value)}
                  error={errors.state}
                />
                <Select
                  label="Sex Assigned At Birth"
                  options={[
                    { value: "", label: "" },
                    ...SEX_ASSIGNED_AT_BIRTH.map((s) => ({
                      value: s,
                      label: s,
                    })),
                  ]}
                  value={sexatbirth}
                  onChange={(e) => setSexAtBirth(e.target.value)}
                  error={errors.state}
                />
              </div>
            </div>
          </Card>

          <div className="sticky flex gap-3 z-50 bottom-0 bg-white p-4 border-t">
            {role === "PATIENT" && (
              <Button
                type="button"
                variant="secondary"
                className="whitespace-nowrap"
                onClick={handleSave}
              >
                <span className="hidden sm:inline">Save/Finish Later</span>
                <span className="inline sm:hidden">Save</span>
              </Button>
            )}
            <Button type="submit" fullWidth className="flex-1">
              Next
            </Button>
          </div>

          {showPreview && (
            <PreviewModal
              preCheckData={preCheck}
              questionData={draftQuestionData}
              onEdit={() => setShowPreview(false)}
              onContinue={handleContinueFromPreview}
            />
          )}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
              <div className="bg-white rounded-xl w-full max-w-sm p-6 text-center space-y-4 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800">
                  {modalMessage}
                </h2>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => {
                      setShowModal(false);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg w-24"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
