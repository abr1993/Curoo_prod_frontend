import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { ConsultDetail, PreCheckData, QuestionDataNew } from "@/types/consult";
import { ProviderLicense } from "@/types/provider";

interface DraftConsultContextType {
  selectedConsult?: ConsultDetail, 
  handleSetSelectedConsult:(newState: ConsultDetail)=>void,
  preCheckData?: PreCheckData, 
  handleSetPreCheckData: (newState: PreCheckData)=>void,
  providerLicenseData?: ProviderLicense , 
  handleSetProviderLicenseData: (newState: ProviderLicense)=>void,
  draftQuestionData?: QuestionDataNew, 
  handleSetDraftQuestionData: (newState: QuestionDataNew)=>void,
//   turnbackReason: string, 
//   handleSetTurnbackReason: (newState: string)=>void
}

const defaultAppContext: DraftConsultContextType = {
  selectedConsult: null, 
  handleSetSelectedConsult:()=>{},
  preCheckData: null   , 
  handleSetPreCheckData: ()=>{},
  providerLicenseData: null , 
  handleSetProviderLicenseData: ()=>{},
  draftQuestionData: null, 
  handleSetDraftQuestionData: ()=>{},
//   turnbackReason: "coverage", 
//   handleSetTurnbackReason: ()=>{}
};

const DraftConsultContext =
  createContext<DraftConsultContextType>(defaultAppContext);

export const useDraftConsultContext = () => useContext(DraftConsultContext);

export const DraftConsultProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedConsult, setSelectedConsult] = useState<ConsultDetail | null>(
    null
  );
  const [preCheckData, setPreCheckData] = useState<PreCheckData | null>(null);
  const [providerLicenseData, setProviderLicenseData] =
    useState<ProviderLicense | null>(null);
  // const [questionData, setQuestionData] = useState<QuestionDataNew | null>(null);
  const [draftQuestionData, setDraftQuestionData] =
    useState<QuestionDataNew | null>(null);

//   const [turnbackReason, setTurnbackReason] = useState<
//     "coverage" | "redFlag" | "state" | "stripe"
//   >("coverage");
   const handleSetSelectedConsult = (newState: ConsultDetail) => {
    setSelectedConsult(newState);
  };
   const handleSetPreCheckData = (newState: PreCheckData) => {
    setPreCheckData(newState);
  };
   const handleSetProviderLicenseData = (newState: ProviderLicense) => {
    setProviderLicenseData(newState);
  };
   const handleSetDraftQuestionData = (newState: QuestionDataNew) => {
    setDraftQuestionData(newState);
  };
//    const handleSetTurnbackReason = (newState: string) => {
//     setTurnbackReason(newState);
//   };

  return (
    <DraftConsultContext.Provider
      value={{
selectedConsult, handleSetSelectedConsult,preCheckData, handleSetPreCheckData,providerLicenseData, handleSetProviderLicenseData,draftQuestionData, handleSetDraftQuestionData,
      }}
    >
      {children}
    </DraftConsultContext.Provider>
  );
};
