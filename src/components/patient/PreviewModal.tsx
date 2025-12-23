import { PreCheckData, QuestionDataNew } from "@/types/consult";
import { Card } from "../ui/Card";
import { Textarea } from "../ui/Textarea";

interface PreviewModalProps {
  preCheckData: PreCheckData;
  questionData: QuestionDataNew;
  onEdit: () => void;
  onContinue: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  preCheckData,
  questionData,
  onEdit,
  onContinue,
}) => {
  const getFormatedDate = (dateOfBirth: string | Date): string => {
    const birthDate = new Date(dateOfBirth);
    return birthDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getSeverityColor = (value: number): string => {
    if (value <= 0) return "bg-gray-100 text-gray-700";
    if (value <= 3) return "bg-green-100 text-green-800";
    if (value <= 6) return "bg-yellow-100 text-yellow-800";
    if (value <= 8) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="
          relative bg-white w-full sm:max-w-md
          max-h-[85dvh] sm:max-h-[80vh]
          rounded-t-xl sm:rounded-xl
          flex flex-col
        "
      >
        {/* Header (fixed) */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            Review Your Information
          </h2>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 text-sm">         

          <Card>
            <div className="space-y-2">
                <p><strong>Name:</strong> {(questionData.legalName !== "")? questionData.legalName : "ANONYMOUS"}  </p>
              <p>
                <strong>Date of birth:</strong>{" "}
                {getFormatedDate(preCheckData.dob)}
              </p>
              <p>
                <strong>Pronouns:</strong>{" "}
                {questionData.pronouns}
              </p>
              <p>
                <strong>Sex at birth:</strong>{" "}
                {questionData.sexatbirth}
              </p>
              <p>
                <strong>State:</strong> {preCheckData.state}
              </p>
              <p>
                <strong>Topic:</strong>{" "}
                {questionData.topics?.map(t => t.name).join(", ") ||
                  "General concern"}
              </p>
            </div>
          </Card>

          <Textarea
            label="Question"
            value={questionData.question}
            disabled
          />

          <Card>
            <div className="grid grid-cols-2 gap-4">
              {questionData.symptoms.map(item => (
                <div
                  key={item.specialtySymptomId}
                  className={`p-3 rounded-lg ${getSeverityColor(
                    item.value ?? 0
                  )}`}
                >
                  <p className="text-xs text-gray-600">{item.symptomName}</p>
                  <p className="text-lg font-semibold">
                    {item.value ?? 0}/10
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="space-y-2">
              {Object.values(questionData.historyFields || {}).map(
                (item, index) => (
                  <p key={index}>
                    <strong>{item.fieldName}:</strong>{" "}
                    {Array.isArray(item.value)
                      ? item.value.join(", ")
                      : item.value}
                  </p>
                )
              )}
            </div>
          </Card>
        </div>

        {/* Footer (fixed buttons) */}
        <div className="p-4 border-t bg-white flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 border rounded p-2"
          >
            Edit
          </button>

          <button
            onClick={onContinue}
            className="flex-1 bg-blue-600 text-white rounded p-2"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};



