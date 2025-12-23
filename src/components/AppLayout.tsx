// src/AppLayout.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Footer } from "./shared/Footer";
import { Landing } from "./patient/Landing";
import { PreCheck } from "./patient/PreCheck";
import { VerifyAccount } from "./patient/VerifyAccount";
import { TurnBack } from "./patient/TurnBack";
import { ComposeQuestion } from "./patient/ComposeQuestion";
import { Payment } from "./patient/Payment";
import { Confirmation } from "./patient/Confirmation";
import { StatusView } from "./patient/StatusView";
import { ProviderInbox } from "./provider/ProviderInbox";
import { CaseReview } from "./provider/CaseReview";
import { ProviderSettings } from "./provider/ProviderSettings";
import { isTokenValid } from "../utils/auth";
import { Button } from "./ui/Button";
import { Header } from "./shared/Header";
import { StartConsult } from "./patient/StartConsult";
import { MyQuestions } from "./patient/ListQuestions";
import { ProtectedRoute } from "./ProtectedRoute";
import { useSmartBackNavigation } from "@/hooks/useBackNavigation";
import { useHeader } from "@/contexts/HeaderContext";
import { useBackHandler } from "@/contexts/BackHandlerContext";
import { ConsultDetail, PreCheckData, QuestionDataNew } from "@/types/consult";
import { ProviderLicense } from "@/types/provider";
import { useDraftConsultContext } from "@/contexts/DraftConsultContext";
import { Contact } from "lucide-react";
import { ContactUs } from "./shared/Contact";

export default function AppLayout() {
  return (
    
      <AppRoutes />
    
  );
}

function AppRoutes() {
  //const [consults, setConsults] = useState<Consult[]>();
  // const [selectedConsult, setSelectedConsult] = useState<ConsultDetail | null>(null);  
  // const [preCheckData, setPreCheckData] = useState<PreCheckData | null>(null);
  // const [providerLicenseData, setProviderLicenseData] = useState<ProviderLicense | null>(null);
  // // const [questionData, setQuestionData] = useState<QuestionDataNew | null>(null);  
  // const [draftQuestionData, setDraftQuestionData] = useState<QuestionDataNew | null>(null);
  
  const [turnbackReason, setTurnbackReason] = useState<'coverage' | 'redFlag' | 'state' | 'stripe'>('coverage');
   const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
// console.log("Draft in applayout",draftQuestionData)
  useEffect(() => {
    setIsLoggedIn(isTokenValid());
  }, []);
  const {preCheckData,providerLicenseData,draftQuestionData,handleSetDraftQuestionData,handleSetPreCheckData,handleSetProviderLicenseData,handleSetSelectedConsult,selectedConsult}=useDraftConsultContext();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    handleSetDraftQuestionData(null);
    setIsLoggedIn(false);
    navigate("/");
  };
console.log("JWT in localStorage on startup:", localStorage.getItem("token"));
  const headerRight = isLoggedIn ? (
    <Button
      onClick={handleSignOut}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
    >
      Sign Out
    </Button>
  ) : null;

  // Flow handlers
   const handleSelectDoctor = (providerId: string, provider_specialty_id: String) => {
    //handleSetProviderLicenseData(data);
    navigate(`/provider/${providerId}/${provider_specialty_id}`/* , { state: { providerLicenseData: data } } */ );
   }
  const handleStartConsult = (providerId: string, providerSpecialtyId: String) => {
    navigate(`/precheck/${providerId}/${providerSpecialtyId}`/* , { state: { providerLicenseData: providerLicenseData } } */);
    handleSetDraftQuestionData(null);
  }

  const handlePreCheckPass = (providerId: string, providerSpecialtyId: String, data: PreCheckData) => {
    handleSetPreCheckData(data);
    navigate(`/compose/${providerId}/${providerSpecialtyId}`, { state: { preCheckData: data } });
  };
  
 const handleVerifiedNav = ({
      providerId,
      providerSpecialtyId,
      role,
      redirect
    }: {
      providerId?: string;
      providerSpecialtyId?: string;
      role?: string;
      redirect?: string;
    }) => {
      console.log("redirect page: ", redirect);
      if (providerId) {
        navigate(`/payment/${providerId}/${providerSpecialtyId}`, {
          state: { preCheckData, questionData: draftQuestionData },
        });
      }  else if(redirect){
        navigate(redirect);
      }else if (role === "PROVIDER") {
        navigate("/provider/inbox");
      }
      else if (role === "PATIENT") {
        navigate("/myconsults");
      }
      else {
        navigate("/");
      }
};


  const handlePreCheckFail = (reason: 'coverage' | 'redFlag' | 'state', data:any) => {
    setTurnbackReason(reason);
    navigate("/turnback", { state: { providerData: data}});
  };

  const handleQuestionSubmit = (providerId: string, providerSpecialtyId: string, preCheckData:PreCheckData, data: QuestionDataNew) => {
    // setQuestionData(data);
    handleSetDraftQuestionData(data);
    handleSetPreCheckData(preCheckData);
    //localStorage.removeItem("draftQuestionData");
    navigate(`/verify/account/${providerId}/${providerSpecialtyId}`, { state: {preCheckData: preCheckData, questionData: data } });
  };

  const handlePaymentSuccess = (consultId: string) => {
    
    navigate(`/confirmation/${consultId}`);
  };

  const handlePaymentFailure = (errmessage: string) => {
    //console.log("ERRORMESSAGE INSIDE APPLAYOUT: ", errmessage);
    setTurnbackReason("stripe");
    navigate("/turnback", {state: { stripeErrorData: errmessage}});
  };

  const handleCancelPayment = () => {
    navigate("/myconsults")
  }
  const handleSelectConsult = (consult: ConsultDetail, destination: string, preCheckData?: any, questionData?:any) => {
      console.log("selected consult", consult);
    handleSetSelectedConsult(consult);
    console.log("Navigating to", destination);
    console.log("Navigating questiondata", questionData);
    navigate(destination, { state: { preCheckData, questionData } });
  };

  const handleReviewConsult = (consultId: String)=>{
      navigate(`/review/${consultId}`);      
              
  }

  const handleViewStatus = (consultId: String) => navigate(`/status/${consultId}`);
  const handleViewReport = ()=> {};

  const handleAcceptConsult = (consultId: string) => {
    
  };

  const handleDeclineConsult = (consultId: string) => {
    
    navigate("/provider/inbox");
  };

  const handleSubmitAnswer = () => {
    
    navigate("/provider/inbox");
  };

  const handleSaveSettings = () => {
    //setPhysicianProfile({ ...physicianProfile, ...updates });
    navigate("/provider/inbox");
  };
  const handleBack = useSmartBackNavigation("/home", true);
  const { onBack } = useBackHandler();
  const showBackButton = location.pathname !== "/";
  const { title } = useHeader();

  return (
    <div className="min-h-screen bg-white">
      <Header onBack={showBackButton? (onBack || handleBack) : undefined} title={title}  />
      <main className="flex-grow">
      <Routes>
        <Route path="/" element={<Landing onStartConsult={handleSelectDoctor} />} />
        <Route path="/provider/:providerId/:providerSpecialtyId" element={<StartConsult onStartConsult={handleStartConsult}  />} />
        <Route
          path="/precheck/:providerId/:providerSpecialtyId"
          element={<PreCheck onPass={handlePreCheckPass} onFail={handlePreCheckFail} />}
        />
        <Route path="/turnback" 
        element={<TurnBack reason={turnbackReason} 
        onBack={() => {
        if (window.history.state && window.history.state.idx > 0) {
          navigate(-1); // go back if there's history
        } else {
          navigate("/"); // fallback to landing
        }
      }}
         />} />
        <Route
          path="/compose/:providerId/:providerSpecialtyId"
          element= {
            <ComposeQuestion 
             onSubmit={handleQuestionSubmit} onFail={handleBack} 
            preCheckData={preCheckData} 
            draftQuestionData={draftQuestionData}
            setDraftQuestionData={handleSetDraftQuestionData}/>
          }
            
          
        
        />
        <Route
          path="/verify/account/:providerId?/:providerSpecialtyId?"
          element={<VerifyAccount onBack={() => {
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1); // go back if there's history
            } else {
              navigate("/"); // fallback to landing
            }
          }}  onSuccess={handleVerifiedNav} />}
        />
        <Route path="/payment/:providerId/:providerSpecialtyId" element={<ProtectedRoute allowedRoles={["PATIENT"]}><Payment  onFailure={handlePaymentFailure} onSuccess={handlePaymentSuccess} onCancel={handleCancelPayment}  /></ProtectedRoute>} />
        <Route path="/confirmation/:consultId" element={<ProtectedRoute allowedRoles={["PATIENT"]}><Confirmation onViewStatus={handleViewStatus} onClose={() => navigate("/myconsults")} /></ProtectedRoute>} />
        <Route path="/myconsults" element={<ProtectedRoute allowedRoles={["PATIENT"]}><MyQuestions  onSelectConsult={handleSelectConsult} onViewStatus={handleViewStatus} /></ProtectedRoute>} />
        <Route
          path="/status/:consultId"
          element={           
              <ProtectedRoute allowedRoles={["PATIENT"]}><StatusView onViewReport={handleViewReport}  /></ProtectedRoute>
            
          }
        />
        <Route
          path="/provider/inbox"
          element={
            <ProtectedRoute allowedRoles={["PROVIDER"]}>
            <ProviderInbox              
              onSelectConsult={handleReviewConsult}
              onSettings={() => navigate("/provider/settings")}
            />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/:consultId"
          element={
           
              <ProtectedRoute allowedRoles={["PROVIDER"]}>
              <CaseReview                
                
                onAccept={handleAcceptConsult}
                onDecline={handleDeclineConsult}
                onSubmitAnswer={handleSubmitAnswer}
              />
              </ProtectedRoute>
            
          }
        />
        <Route
          path="/provider/settings"
          element={<ProtectedRoute allowedRoles={["PROVIDER"]}><ProviderSettings onBack={() => navigate("/provider/inbox")} onSave={handleSubmitAnswer} /></ProtectedRoute>}
        />
        <Route
          path="/contactus"
          element={ <ContactUs />}
        />
      </Routes>
          </main>
      <Footer />
    </div>
  );
}


