import React, { useEffect, useRef, useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
//import { QuestionData } from './ComposeQuestion';
import {jwtDecode} from 'jwt-decode';
import { Header } from '../shared/Header';
import {useAuth} from '../../hooks/useAuth'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useHeader } from '@/contexts/HeaderContext';

interface VerificationProps {
  onBack: () => void;
  //onSuccess: (providerId?: String, role?: String) => void;
  onSuccess: (args: { providerId?: string; providerSpecialtyId?: string; role?: string; redirect?: string }) => void;
  
}

interface JwtPayload {
  accountId: string;
  exp: number; // expiration in seconds
}
interface AuthData {
  token: string;
  email: string;
  role: string;
}
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const VerifyAccount: React.FC<VerificationProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirect");
  const linkToken = params.get("linkToken");
  const [showModal, setShowModal] = useState(false);
   const [showErrorModal, setShowErrorModal] = useState(false);
const [modalMessage, setModalMessage] = useState('');

  const preCheckData = location.state?.preCheckData;
  const questionData = location.state?.questionData;
 const { login, token, email,role } = useAuth();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { providerId } = useParams<{ providerId?: string }>();
  const { providerSpecialtyId } = useParams<{ providerSpecialtyId?: string }>()
  // You can now access any field from preCheckData
  if(questionData){
    console.log("blur:", questionData.blur);
  console.log("Medication:", questionData.noMedications);
  console.log("Question", questionData.question);
  //console.log("topic", questionData.topic);
  }
  
    
  // 🧩 Helper: Check if JWT is valid & not expired
  const isTokenValid = (token: string) => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };   
  
   const [hasToken, setHasToken] = useState(isTokenValid(token));
   const handleVerifiedNavigation = ()=>{
    
   }

   const handleSendOtp = async () => {
      if (!contact.trim()) {
        console.log('Please enter your email');
        setShowErrorModal(true);
        setModalMessage('Please enter your email');

        return;
      }

      setLoading(true);

      const savedToken = localStorage.getItem('token');
      const normalizedContact = contact.trim().toLowerCase(); // normalize email for comparison

      if (savedToken && isTokenValid(savedToken)) {
        try {
          const decoded = JSON.parse(atob(savedToken.split('.')[1]));
          const tokenEmail = decoded.email?.toLowerCase(); // normalize token email

          if (tokenEmail === normalizedContact) {
            console.log(' Valid token found, skipping OTP step');
            console.log(' Valid token found, redirect to', redirectTo);
            if (providerId) {
              onSuccess({ providerId, providerSpecialtyId });
            }else if(redirectTo){
              onSuccess({redirect: `${redirectTo}?linkToken=${linkToken}`})
            }
             else {
              onSuccess({ role });
            }
            return;
          }
        } catch (err) {
          console.error(' Error decoding token:', err);
        }
      }

      try {
        const res = await fetch(`${VITE_API_BASE_URL}/api/auth/otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: normalizedContact }),
        });

        const data = await res.json();
        console.log(' OTP API response:', res.status, data);

        if (
          typeof data?.message === 'string' &&
          data.message.toLowerCase().includes('not registered')
        ) {
          setModalMessage('This email is not registered. Register now?');
          setShowModal(true);
        } else if (res.ok) {
          resetOtp();
          setStep('otp');
          console.log(`✅ OTP sent to ${normalizedContact}`);
        } else {
          console.log('⚠️', data?.message || 'Something went wrong.');
        }

        if (!res.ok) throw new Error('Failed to send OTP');
      } catch (err) {
        console.error('❌ Error sending OTP:', err);
      } finally {
        setLoading(false);
      }
    };


  /* const handleSendOtp = async () => {
    if (!contact.trim()) return alert('Please enter your email');

    setLoading(true);
    
    const savedToken = localStorage.getItem('token');

    if (savedToken && isTokenValid(savedToken)) {
      const decoded = JSON.parse(atob(savedToken.split('.')[1]));
      if (decoded.email === contact) {
        console.log('✅ Valid token found, skipping OTP step');
        if (providerId) {
          onSuccess({ providerId, providerSpecialtyId });
        } else {
          onSuccess({ role });
        }   
        return;
      }
}

    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/auth/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: contact }),
      });
      const data = await res.json();
      console.log(data.message);
      console.log('Response:', res.status, data);

      if (
      typeof data?.message === 'string' &&
      data.message.toLowerCase().includes('not registered')
    ) {
      setModalMessage('This email is not registered. Register now?');
      setShowModal(true);
    } 
    // ✅ Otherwise, assume success
    else if (res.ok) {
      setStep('otp');
    } 
    // ✅ Fallback for unexpected responses
    else {
      alert(data?.message || 'Something went wrong.');
    }
      if (!res.ok) throw new Error('Failed to send OTP');
      console.log(`OTP sent to ${contact}`);
      //setStep('otp');
    } catch (err) {
      console.error(err);
      alert('Error sending OTP');
    } finally {
      setLoading(false);
    }
   
  }; */

  const resetOtp = () => {
    setOtp(Array(6).fill(""));
    inputRefs.current.forEach((ref) => {
      if (ref) ref.value = "";
    });
  };



  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) { inputRefs.current[index + 1]?.focus(); }

    //If last box filled, automatically trigger verification
    if (index === otp.length - 1 && value) {
      setLoading(true);
      setTimeout(() => {
        handleVerifyOtp(updatedOtp.join("")); // Call verify after a short delay
      }, 2000);
    }
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").trim();

    if (!/^\d{6}$/.test(pasted)) return; // must be 6 digits

    const digits = pasted.split("");
    setOtp(digits);

    // Fill the inputs visually
    digits.forEach((d, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = d;
      }
    });

    // Auto verify
    handleVerifyOtp(pasted);
  };


const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
   //Move back on backspace if empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
       }
     };
  

  const handleVerifyOtp = async (otpValue?: string) => {
    const code = otpValue || otp.join('');
    if (code.length !== 6) return alert('Please enter all 6 digits.');

   /*  if(otpValue !== '212223'){
      setShowErrorModal(true);
      setModalMessage("Invalid OTP");
      return;
    } */

    setLoading(true);
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: contact, otp: code }),
      });

      console.log("🔹 Response status:", res.status);
      
      console.log("🔹 Response headers:", res.headers);
      const text = await res.text(); // use text() first to catch non-JSON errors
      console.log("🔹 Raw response text:", text);


      let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      console.error("❌ Failed to parse JSON:", parseErr);
      setShowErrorModal(true);
      setModalMessage("❌You have entered an incorrect code!");
      
      return;
    }

    console.log("🔹 Parsed response data:", data);
      
      if (res.ok && data.token) {
        console.log('✅ Token received:', data.token);
        // Save JWT token locally
        //localStorage.setItem('authData', JSON.stringify({ email: contact, token: data.token }));
        
        login(data.token); // stores token, decodes role/email/userId
       /*  setTimeout(() => {
          onSuccess();
        }, 1000);
        if (data.role === "PHYSICIAN") {
          navigate("/inbox");
        } */
        console.log('JWT token saved');
        const decoded = JSON.parse(atob(data.token.split('.')[1]));
        const role = decoded.role?.toUpperCase();
        //const fromNav = location.state?.from === "nav";
        console.log("physician id:", providerId);
        if (providerId) {
          onSuccess({ providerId, providerSpecialtyId });
        } else if(redirectTo){
           onSuccess({redirect: `${redirectTo}?linkToken=${linkToken}`})
        }
        else {
          onSuccess({ role });
        }

      

      } else {
        //alert(data.error || 'Invalid OTP');
        setShowErrorModal(true);
        setModalMessage("Invalid OTP!");
      }
    } catch (err) {
      console.error(err);
      setShowErrorModal(true);
        setModalMessage("Verification failed!");
      //alert('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUseAnotherAccount = () => {
    setHasToken(false);
    setContact("");
  };
  const { setTitle } = useHeader();
  useEffect(() => {
    
    setTitle("Verfiy to Continue");
    if (providerId && (!preCheckData || !questionData)) {
      console.log('Missing precheck or question data, redirecting back to compose...');
      navigate(`/compose/${providerId}`, {state:{preCheckData, questionData}});
    }
    if (isTokenValid(token)){
      setHasToken(true);
      setContact(email);
      console.log("there is token");
      console.log("PhysicianID:", providerId);
      console.log("PrecheckData", preCheckData);
      console.log("questionData", questionData);
    }
  }, [providerId, preCheckData, questionData, navigate, token]);
    

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white ">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Card className="w-full max-w-md p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-900">
            Verify your account
          </h1>

          {hasToken ? (
            <div className="space-y-4 text-center">
              <p className="text-gray-700 text-lg font-medium">{contact}</p>
              <Button
                fullWidth
                onClick={() =>
                  onSuccess({
                    providerId: providerId,
                    providerSpecialtyId: providerSpecialtyId,
                    role: role,
                    redirect:
                      redirectTo == null
                        ? undefined
                        : linkToken
                        ? `${redirectTo}?linkToken=${linkToken}`
                        : redirectTo,
                  })
                }
                className="bg-blue-600 text-white"
              >
                Continue as {contact}
              </Button>
              <Button
                fullWidth
                onClick={handleUseAnotherAccount}
                variant="secondary"
              >
                Use another account
              </Button>
            </div>
          ) : step === "input" ? (
            <>
              <Input
                label="Email or Mobile Number"
                placeholder="example@email.com or +15551234567"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              <Button fullWidth onClick={handleSendOtp} disabled={loading}>
                {loading ? "Sending OTP..." : "Verify"}
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 text-center">
                Enter the 6-digit code sent to <br />
                <span className="font-medium text-gray-900">{contact}</span>
              </p>

              {/* OTP boxes */}
              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    value={digit}
                    maxLength={1}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={handlePaste}
                    className="w-10 h-12 text-center text-lg font-semibold border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ))}
              </div>

              <Button fullWidth disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>

              <button
                onClick={() => {
                  resetOtp();
                  setStep("input");
                }}
                className="block text-center text-sm text-blue-600 hover:underline mt-2"
              >
                Resend or change contact
              </button>
            </>
          )}
        </Card>
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
                    setStep("otp"); // go to otp page
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg w-24"
                >
                  OK
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg w-24"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {showErrorModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
            <div className="bg-white rounded-xl w-full max-w-sm p-6 text-center space-y-4 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800">
                {modalMessage}
              </h2>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => {
                    setShowErrorModal(false);
                    setModalMessage("");
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
