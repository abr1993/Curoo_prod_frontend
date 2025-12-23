import { useEffect, useState } from "react";
import { Chip } from '../ui/Chip';
import { Input } from "../ui/Input";
import { Checkbox } from "../ui/Checkbox";
import { Upload } from "lucide-react";
import { HistoryField, Topic } from "@/types/consult";
import { Textarea } from "../ui/Textarea";
 
interface Props {
  providerSpecialtyId: string;
  onChange?: (data: Record<string, any>) => void;
  onNoMedicationsChange?: (checked: boolean) => void;
  onTopicsChange: (topics: Topic[]) => void;
  initialHistoryFields?: { historyFieldId: string; fieldName: string; value: any }[];
  initialNoMedications?: boolean;
  initialTopics?: Topic[];
}
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function MedicalHistorySection({ providerSpecialtyId, onChange, onNoMedicationsChange, onTopicsChange, initialTopics, initialHistoryFields=[], initialNoMedications=false }: Props) {
  const [fields, setFields] = useState<HistoryField[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [noMedications, setNoMedications] = useState(initialNoMedications);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>(initialTopics || []);

  const uploadTopics = [/* 'Eyelid lesion or growth' */];
  const showPhotoUpload = selectedTopics.some(topic => uploadTopics.includes(topic.name));
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const MAX_CHARS = 1000;

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

  // Fetch the template from the API
  useEffect(() => {
    const fetchTopics = async () => {
      //setLoading(true);
      try {
        const res = await fetch(`${VITE_API_BASE_URL}/api/specialty/${providerSpecialtyId}/conditions`);
        const data: Topic[] = await res.json();
        //console.log(providers)
        setTopics(data);
      } catch (err) {
        console.error("Failed to fetch topics:", err);
      } finally {
        //setLoading(false);
      }
    };

    const fetchHistoryTemplate = async () => {
      const res = await fetch(`${VITE_API_BASE_URL}/api/specialty/${providerSpecialtyId}/historyfields`);
      const data = await res.json();
      setFields(data);
    };
    fetchHistoryTemplate();
    fetchTopics();
  }, [providerSpecialtyId]);

  console.log("fetched topics", topics);
  
  useEffect(() => {
  const formatted = fields.map((field) => ({
    id: field.history_field_id,
    name: field.field_name,
    value: formData[field.field_name] ?? (field.field_type === "MULTISELECT" ? [] : ""),
  }));

  onChange?.(formatted);
}, [formData, fields, onChange]);

useEffect(() => {
  if (initialHistoryFields?.length) {
    // Pre-fill formData or checkboxes based on saved values
    const initialFormData: Record<string, any> = {};
    initialHistoryFields.forEach(field => {
      initialFormData[field.fieldName] = field.value;
    });
    setFormData(initialFormData);
  }
}, [initialHistoryFields]);

 useEffect(() => {
  onTopicsChange(selectedTopics);
}, [selectedTopics]);


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

   // Toggle topic chip selection
  const toggleTopic = (topic: Topic) => {
    setSelectedTopics((prev) => {
        const exists = prev.some((t) => t.id === topic.id);
        if (exists) {
        return prev.filter((t) => t.id !== topic.id);
        } else {
        return [...prev, topic];
        }
    });
    };
  // Automatically clear medications field when “noMedications” is checked
    useEffect(() => {
        if (noMedications) {
        setFormData(prev => ({ ...prev, Medications: "No Medications" }));
        }
    }, [noMedications]);

    useEffect(() => {
        if (onNoMedicationsChange) onNoMedicationsChange(noMedications);
    }, [noMedications, onNoMedicationsChange]);


    const hasMedicationsField = fields.some(f => f.field_name === "Medications");

  return (
    
    <div className="bg-white rounded-xl shadow-sm p-5 mt-8">
        <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Topic</label>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((t, index) => (
                      <Chip
                        key={index}
                        label={t.name}
                        //selected={(formData[field.field_name] || []).includes(t.id)}
                        selected={selectedTopics.some((st) => st.id === t.id)}
                        onClick={() => toggleTopic(t)}
                      />
                    ))}
                  </div>
                  {/* Conditional upload section */}
                    {showPhotoUpload && (
                        <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload a clear photo of the eyelid area
                          </label>

                          <div className="flex items-center gap-3">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                            <Upload className="w-5 h-5 text-gray-500" />
                          </div>                          
                          {photoPreview && (
                            <div className="mt-4">
                              <p className="text-xs text-gray-500 mb-2">Preview:</p>
                              <img
                                src={photoPreview}
                                alt="Eyelid preview"
                                className="w-40 h-40 object-cover rounded-lg border"
                              />
                            </div>
                          )}

                          <p className="text-xs text-gray-500 mt-2">
                            Please make sure the photo is well-lit and focused.
                          </p>
                        </div>
                      )}
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5 mt-8">
      <h6 className="text-lg font-semibold mb-4">Medical History</h6>

      <div className="space-y-6">
        {hasMedicationsField && (
          <div className="pt-2">
            <Checkbox
              label="I take no daily medications"
              checked={noMedications}
              onChange={e => setNoMedications(e.target.checked)}
            />
          </div>
        )}
        {fields.map(field => (
          <div key={field.history_field_id}>           

            {field.field_type === "TEXT" && (
              <Input
              label={field.field_name}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"                
                value={formData[field.field_name] || ""}
                disabled={field.field_name === "Medications" && noMedications}
                onChange={e => handleTextChange(field.field_name, e.target.value)}
              />
            )}
            {field.field_type === "TEXTAREA" && (
              <>
              <Textarea
                            label={field.field_name}
                            placeholder="Any additional information you can provide..."
                            //className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" 
                            value={formData[field.field_name] || ""}
                            onChange={e => {
                                const value = e.target.value;
                                if (value.length <= MAX_CHARS) {
                                  handleTextChange(field.field_name, value);
                                }
                              }}
                            maxLength={MAX_CHARS}
                            helperText="Avoid personal identifiers"
                          />
                  <p className={`mt-1 text-sm text-right ${
                      MAX_CHARS - (formData[field.field_name]?.length || 0) < 100
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {/* {MAX_CHARS - (formData[field.field_name]?.length || 0)} characters remaining */}
                    {(formData[field.field_name]?.length || 0)}/{MAX_CHARS}
                  </p>                  
              </>
            )}

            {field.field_type === "MULTISELECT" && (
                <div>
                    <label className="block text-md font-medium text-gray-700 mb-2">{field.field_name}</label>
              <div className="flex flex-wrap gap-2">
                
                {field.options.map(opt => (
                  <Chip
                    key={opt.option_id}
                    label={opt.option_value}
                    selected={(formData[field.field_name] || []).includes(opt.option_value)}
                    onClick={() => toggleOption(field.field_name, opt.option_value)}
                  />
                ))}
              </div>
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
