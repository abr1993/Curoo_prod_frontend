import { AnswerData, PreCheckData, QuestionDataNew } from "@/types/consult";
import { Card } from "../ui/Card";
import { Textarea } from "../ui/Textarea";
import { Pencil } from "lucide-react";

interface PreviewModalProps {  
  questionData: AnswerData;
  onEdit: (field:string) => void;
  onContinue: () => void;
}

export const Preview: React.FC<PreviewModalProps> = ({  
  questionData,
  onEdit,
  onContinue,
}) => {
  

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
            <Card className="space-y-6">
                {/* Overview */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Overview
                    </h2>

                    <button
                        onClick={() => onEdit("overview")}
                        className="flex items-center gap-1 text-blue-600"
                    >
                        <Pencil size={14} /> Edit
                    </button>
                    </div>

                    <Textarea
                    value={questionData.overview}
                    rows={5}
                    disabled
                    className="bg-gray-50"
                    />
                </div>
            <div className="border-t pt-4" />

                {/* Differential considerations */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Differential considerations (general)
                    </h2>

                    <button
                        onClick={() => onEdit("differential")}
                        className="flex items-center gap-1 text-blue-600"
                    >
                       <Pencil size={14} /> Edit
                    </button>
                    </div>

                    <Textarea
                    value={questionData.differentials_general}
                    rows={5}
                    disabled
                    className="bg-gray-50"
                    />
                </div>
            <div className="border-t pt-4" />

                {/* Self care */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        What’s reasonable at home
                    </h2>

                    <button
                        onClick={() => onEdit("selfcare")}
                        className="flex items-center gap-1 text-blue-600"
                    >
                       <Pencil size={14} /> Edit
                    </button>
                    </div>

                    <Textarea
                    value={questionData.self_care_general}
                    rows={5}
                    disabled
                    className="bg-gray-50"
                    />
                </div>
            <div className="border-t pt-4" />

                {/* When to seek care */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        When to seek in-person care
                    </h2>

                    <button
                        onClick={() => onEdit("seekcare")}
                        className="flex items-center gap-1 text-blue-600"
                    >
                       <Pencil size={14} /> Edit
                    </button>
                    </div>

                    <Textarea
                    value={questionData.when_to_seek_care}
                    rows={5}
                    disabled
                    className="bg-gray-50"
                    />
                </div>
                </Card>

                   

          
        </div>

        {/* Footer (fixed buttons) */}
        <div className="p-4 border-t bg-white flex gap-3">
          {/* <button
            onClick={onEdit}
            className="flex-1 border rounded p-2"
          >
            Edit
          </button> */}

          <button
            onClick={onContinue}
            className="flex-1 bg-blue-600 text-white rounded p-2"
          >
            Sign & Send
          </button>
        </div>
      </div>
    </div>
  );
};



