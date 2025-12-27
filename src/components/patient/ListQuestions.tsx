import React, { useEffect, useState } from "react";
import { Header } from "../shared/Header";
import { Card } from "../ui/Card";
import { Chip } from "../ui/Chip";
import { useHeader } from "@/contexts/HeaderContext";
import { useAuth } from "@/hooks/useAuth";
import { ConsultDetail, PreCheckData, QuestionDataNew } from "@/types/consult";
import { useSearchParams } from "react-router-dom";
import { extractSixDigits, formatDateTime, getConsultDate } from "@/utils/helpers";


interface MyQuestionsProps {
  onViewStatus: (consultId: String) => void;
  //consults: Consult[];
  onSelectConsult: (consult: ConsultDetail, destination: string, preCheckData?: PreCheckData, questionData?: QuestionDataNew) => void;
}
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const tabs = ["all", "pending", "completed", "accepted", "declined", "timed-out", "draft"] as const;
export const MyQuestions: React.FC<MyQuestionsProps> = ({
  onSelectConsult,
  onViewStatus,
 
}) => {
  const [filter, setFilter] = useState<
    "all" | "pending" | "completed" | "accepted" | "declined" | "timed-out" |  "draft"
  >("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "all";

  const setTab = (tab: typeof tabs[number]) => {
    setSearchParams({ tab }); // updates URL ?tab=pending
  };

  console.log(currentTab);

  const [consultdetails, setConsultDetailss] = useState<ConsultDetail[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [consultToDelete, setConsultToDelete] = useState<ConsultDetail>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {token, userId} = useAuth();
    console.log("USER ID", userId);
  //console.log("filtered consults", filteredConsults);

   // ✅ Fetch consults from your API
  useEffect(() => {
    const fetchConsults = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token"); // assuming JWT stored here
        const res = await fetch(`${VITE_API_BASE_URL}/api/consults`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch consults (${res.status})`);
        }

        const data = await res.json();
        setConsultDetailss(data);
      } catch (err: any) {
        console.error("Error fetching consults:", err);
        setError("Unable to load consults. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsults();
  }, []);
console.log("fetched consults", consultdetails);

const filteredConsultDetails = (consultdetails || []).filter((c) => {
    if (currentTab === "all") return true;

    switch (currentTab) {
      case "draft":
        return c.status === "ISDRAFT";
      case "pending":
        return ["pending", "SUBMITTED"].includes(c.status);
      case "declined":
        return ["DECLINED", "declined"].includes(c.status);
      case "timed-out":
        return ["TIMEDOUT", "AUTO_DECLINED"].includes(c.status);
      case "completed":
        return ["ANSWERED", "completed"].includes(c.status);
      case "accepted":
        return ["ACCEPTED", "completed"].includes(c.status);
      default:
        return true;
    }
  });
  
  // Color logic
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "ISDRAFT":
        return "bg-gray-100 text-gray-700";
      case "SUBMITTED":
        return "bg-yellow-100 text-yellow-700";
      case "DECLINED":
      case "AUTO_DECLINED":
      case "TIMEDOUT":
        return "bg-red-100 text-red-700";
      case "ACCEPTED":
      case "ANSWERED":      
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Handle card clicks — navigate via callback
  const handleConsultClick = async(selectedConsult: ConsultDetail) => {
  
    if(selectedConsult.status === "ISDRAFT"){
      handleContinue(selectedConsult);
    }else{
      const destination = `/status/${selectedConsult.id}?tab=${currentTab}`;
      onSelectConsult(selectedConsult, destination);
    }    
    
  };
  const getConsultDraft = async (consultId: string) => {
    try {
      //const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token");

      const res = await fetch(`${VITE_API_BASE_URL}/api/consults/${consultId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch draft: ${errorText}`);
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const mapConsultToQuestionData = (consult: ConsultDetail): QuestionDataNew => {
      const historyFields = consult.medical_history?.data ? Object.entries(consult.medical_history.data).map(([historyFieldId, field]) => ({
        historyFieldId,
        fieldName: field.fieldName,
        value: field.value,
      }))
    : [];   
   const historyFields2 = Array.isArray(consult.medical_history)
    ? consult.medical_history.map(h => ({
        historyFieldId: h.historyFieldId || '', // optional if available
        fieldName: h.fieldName || h.field_name,
        value: h.value,
      }))
    : Object.values(consult.medical_history?.data || {}).map(h => ({
        historyFieldId: '', // optional
        fieldName: h.fieldName,
        value: h.value,
      }));


      const symptoms = consult.consult_specialty_symptoms?.map((s) => ({
          specialtySymptomId: s.specialty_symptom.id,
          symptomName: s.specialty_symptom?.symptom?.name || "",
          value: s.Value ?? 0,
        })) || [];
  
        return {  
          consultId: consult.id,  
          question: consult.question_body || '',
          historyFields: historyFields2,
          symptoms: symptoms,          
          //noMedications: consult.me,
          topics: consult.topics || [],
          legalName: consult.legal_name || '',
          showFullName: consult.show_name_options === 'FULL_NAME',
          providerSpecialtyId: "",
          noMedications: false,
          pronouns: consult.pronoun || "",
          sexatbirth: consult.sex_at_birth || "",
          showNameOptions: consult.show_name_options || "",          
  };
  };

  const handleContinue = async(consult: ConsultDetail) => {
    const draft = await getConsultDraft(consult.id);
    console.log("Draft consult id inside handlecontinue: ", draft.id);
    if (!draft) return;
    const preCheckData: PreCheckData = {
      state: consult.state_at_service,
      dob: consult.date_of_birth, // or another date field if appropriate
      coverageAttested: true, // or pull from consult if available
      redFlags: [], // or populate based on consult data
    };
    console.log("draft when continue", draft);
    const questionData = mapConsultToQuestionData(draft);
    
    console.log("questionData when continue", questionData);

    onSelectConsult(consult, `/compose/${consult.provider_id}/${consult.provider_specialty_id}`, preCheckData, questionData);
  };

  const handleDeleteClick = (consult: ConsultDetail) => {
    setConsultToDelete(consult);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
      if (!consultToDelete) return;
      try {
        const res = await fetch(
          `${VITE_API_BASE_URL}/api/consults/${consultToDelete.id}/delete`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to delete consult");
        setConsultDetailss((prev) =>
          prev.filter((c) => c.id !== consultToDelete.id)
        );
        //alert("Consult soft deleted successfully");
      } catch (err) {
        console.error(err);
        alert("Failed to delete consult");
      } finally {
        setShowDeleteModal(false);
        setConsultToDelete(null);
      }
    };
  const cancelDelete = () => {
      setShowDeleteModal(false);
      setConsultToDelete(null);
    };
  const { setTitle } = useHeader();
  useEffect(() => { setTitle("My Consults"); localStorage.removeItem(`lastConsultId_${userId}`); }, []);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((f) => (
            <Chip
              key={f}
              label={f.charAt(0).toUpperCase() + f.slice(1)}
              selected={currentTab === f}
              onClick={() => setTab(f)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredConsultDetails.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500">No consults in this category</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredConsultDetails.map((consult) => (
              <Card
                key={consult.id}
                className="cursor-pointer hover:bg-gray-50 transition"
                onClick={() => handleConsultClick(consult)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Topic:{" "}
                      <span>
                        {consult.topics.map((topic) => topic.name + " ")}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600">
                      State: {consult.state_at_service}
                    </p>
                  </div>
                  
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {consult.question_body}
                </p>

                <div className="flex justify-between items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      consult.status
                    )}`}
                  >
                    {consult.status === "ISDRAFT"
                      ? "DRAFT"
                      : consult.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    <strong>{formatDateTime(new Date(
                      getConsultDate(consult) || ""
                    )) }</strong>
                  </span>
                  <span className="text-xs text-gray-500">
                   <strong>ID: {extractSixDigits(consult.id)}</strong> 
                  </span>
                </div>

                {/* Only show buttons for draft consults */}
                {filter === "draft" && consult.status === "ISDRAFT" && (
                  <div className="flex justify-end mt-4 gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContinue(consult);
                      }}
                      className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Continue
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(consult);
                      }}
                      className="px-4 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
            <div className="bg-white rounded-xl w-full max-w-sm p-6 text-center space-y-4 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800">
                Are you sure you want to delete this draft?
              </h2>
              <p className="text-sm text-gray-600">
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg w-24 hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg w-24 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
