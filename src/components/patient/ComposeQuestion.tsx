import React, { useEffect, useState } from 'react';
import { Header } from '../shared/Header';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Textarea } from '../ui/Textarea';
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
  //const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>(questionData?.topics || []);
  const [showPreview, setShowPreview] = useState(false);

  //const [symptomValues, setSymptomValues] = useState<{ specialty_symptom_id: string; symptom_name: string }[]>([]);
  //const [values, setValues] = useState<Record<string, number>>({});
  /* const [values, setValues] = useState(() => {
        const initial: Record<string, number> = {};
        questionData.symptoms?.forEach((s) => {
          initial[s.specialtySymptomId] = s.value;
        });
        return initial; 
    }); */
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
  console.log("Draftquestion data consult id inside compose: ", questionData);
  //const preCheckData = location.state?.preCheckData;
  // You can now access any field from preCheckData
  if(preCheckData ){
console.log("Patient DOB:", preCheckData.dob);
  console.log("Patient state:", preCheckData.state);
  console.log("Coverage attested?", preCheckData.coverageAttested);
  }
  console.log("Selected pronouns:", pronouns);
  console.log("Selected Topics:", selectedTopics);  

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
  //console.log
  useEffect(() => {    
    
    if(loadedquestiondata){
    //console.log("Draft questionData:", loadedquestiondata);
    setQuestionData(loadedquestiondata)
    setDraftQuestionData(loadedquestiondata);
/* setValues(()=>{
        const initial: Record<string, number> = {};
        loadedquestiondata.symptoms?.forEach((s:any) => {
          initial[s.specialtySymptomId] = s.value;
        });
        return initial; 
    }) */
        // Populate form fields
        /* setQuestion(draftQuestionData.question);
        
        //setSelectedTopics(draftQuestionData.topic ? [draftQuestionData.topic] : []);
        //setSymptoms(draftQuestionData.symptoms);
        
        setNoMedications(draftQuestionData.noMedications);
        
        setLegalName(draftQuestionData.legalName);
        setShowFullName(draftQuestionData.showFullName);
        //setValues(draftQuestionData.symptoms);

        // Keep the state in sync
        setQuestionData(draftQuestionData); */
       // localStorage.setItem("draftQuestionData", JSON.stringify(draftQuestionData));
      }
      //console.log("Draft questionData:", draftQuestionData);

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

  const handleSubmit = (e: React.FormEvent) => {
    console.log(medicalHistory);
    console.log("SYMPTOMS", values);
    console.log("showFullName", showFullName);
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!question.trim()) newErrors.question = 'Please describe your concern';
    /* if (!medications.trim() && !noMedications) {
      newErrors.medications = 'Please list medications or check "no daily medications"';
    } */

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
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
        value: h.value,
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
    console.log(draft);
    if (setDraftQuestionData) setDraftQuestionData(draft);   
    setShowPreview(true);
    //onSubmit(providerId, providerSpecialtyId, preCheck, draft );
  };
  const handleContinueFromPreview = ()=>{
    console.log("draftquestiondata preview: ", draftQuestionData);
    console.log("precheckdata preview: ", preCheck);
    onSubmit(providerId, providerSpecialtyId, preCheck, draftQuestionData );
  }
  //const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
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
          console.log("Provider data:", data);

          if (data?.display_name) {
            setTitle(`Ask ${data.display_name}`);
          } else if (data?.user?.email) {
            // fallback if display_name missing
            setTitle(`Ask ${data.user.email}`);
          } else {
            setTitle("Ask Doctor");
          }
        } catch (error) {
          console.error("Error fetching provider name:", error);
          setTitle("Ask Doctor");
        }
      };

  fetchProviderName(); 

      if (!preCheck) {
        onFail();
        return;
      }

      console.log("Loaded preCheckData:", preCheck);
      console.log("Draft questionData:", questionData);
      questionData.providerSpecialtyId = providerSpecialtyId;

      if (draftQuestionData) {
        

        // Populate form fields
        setQuestion(draftQuestionData.question);
        //setMedicalHistory(questionData.historyFields);
        
        //setSelectedTopics(draftQuestionData.topic ? [draftQuestionData.topic] : []);
        //setSymptoms(draftQuestionData.symptoms);
        
        setNoMedications(draftQuestionData.noMedications);
        
        setLegalName(draftQuestionData.legalName);
        setShowFullName(draftQuestionData.showFullName);

        // Keep the state in sync
        setQuestionData(draftQuestionData);
       // localStorage.setItem("draftQuestionData", JSON.stringify(draftQuestionData));
      }
    }, [location.state, preCheck, onFail]);

    const onClickOk = () =>{

    }
    const handleSave = async () => {
    //alert("clicked!");
    //console.log("safsdfbjsdkfknsfnksdfnskdflmslmsdkfs");
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
                                value: h.value,
                              })),
              symptoms:  Object.entries(values).map(([id, value]) => ({
                          specialtySymptomId: id,
                          value,
                        })),       
              created_by: userId,
              status: "ISDRAFT"
            };

            //console.log("consule=t input: ", consultInput);
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
                    console.error("Backend error response:", errorText);
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
                    console.error("Backend error response:", errorText);
                    throw new Error(`Request failed: ${response.status}`);
                  }
                      
                  const result = await response.json();
                  questionData.consultId = result.id;
                
              }
                
                setModalMessage('✅ Your consult is successfuly saved as a draft.');
                setShowModal(true);
                //console.log("Consult created:", result);
                //return result.id;
            }catch(error){        
                setModalMessage('❌ Failed to save your consult as a draft.');
                setShowModal(true);
                //throw new Error('Failed to save draft');
            }      
    
  }


  

  return (
    <div className="min-h-screen bg-gray-50">      
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <Textarea
              label="Your question"
              placeholder="Briefly describe what's going on..."
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
              <h3 className="text-lg font-semibold text-gray-900">Add details</h3>
              <svg
                className={`w-5 h-5 transition-transform ${showDetails ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDetails && (
              <div className="mt-6 space-y-6">
                
                {symptoms.map(symptom => (
                  <Slider
                    key={symptom.specialty_symptom_id}
                    label={symptom.symptom_name}
                    value={values[symptom.specialty_symptom_id] || 0}
                    onChange={val => handleSliderChange(symptom.specialty_symptom_id, val)}
                  />
                ))}             

                <MedicalHistorySection
                    providerSpecialtyId={providerSpecialtyId}
                    onChange={setMedicalHistory}
                    onNoMedicationsChange={(val) => setNoMedications(val)}
                    onTopicsChange={setSelectedTopics}
                    initialHistoryFields={questionData.historyFields}
                    initialNoMedications={questionData.noMedications}
                    initialTopics={questionData.topics}
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
                        <span className="text-sm text-gray-700">Initials only</span>
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
                        { value: '', label: '' },
                        ...PRONOUNS,
                        ]}
                      value={pronouns}
                     onChange={(e) => setPronouns(e.target.value)}
                      error={errors.state}
                  />
                  <Select
                      label="Sex Assigned At Birth"
                      options={[
                        { value: '', label: '' },
                        ...SEX_ASSIGNED_AT_BIRTH.map((s) => ({ value: s, label: s })),
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
            <Button type="button" variant="secondary" className="whitespace-nowrap" onClick={handleSave}>
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
                <h2 className="text-lg font-semibold text-gray-800">{modalMessage}</h2>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => { setShowModal(false);                  
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
