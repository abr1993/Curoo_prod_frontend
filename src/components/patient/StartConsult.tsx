import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Chip } from "../ui/Chip";
import { IMAGES } from "../../utils/constants";
import { useLocation, useParams } from "react-router-dom";
import { useHeader } from "@/contexts/HeaderContext";
import Loader from "../shared/Loader";
import { Provider, ProviderLicense } from "@/types/provider";
import { Condition } from "@/types/specialty";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CheckCircle, User } from "lucide-react";
import { TagCards } from "../ui/TagCards";

interface StartConsultProps {
  onStartConsult: (providerId: string, providerSpecialtyId: string ) => void;
  
}
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CONSULT_REPLY_HOURS = import.meta.env.VITE_CONSULT_REPLY_HOURS;
export const StartConsult: React.FC<StartConsultProps> = ({
  onStartConsult
}) => {
  const { providerId } = useParams<{ providerId: string }>();
  const { providerSpecialtyId } = useParams<{ providerSpecialtyId: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);
   const [expandedBio, setExpandedBio] = useState(false);
  const { setTitle } = useHeader();
  
const location = useLocation();
//const provLicenseData = location.state?.providerLicenseData;
  useEffect(() => {
    setTitle("Start Consult");
    localStorage.removeItem("precheckData");

    const fetchProvider = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT
        const res = await fetch(
          `${VITE_API_BASE_URL}/api/providers/${providerSpecialtyId}/licenses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          throw new Error(`Error fetching provider: ${res.statusText}`);
        }

        const data = await res.json();
        setProvider(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchConditions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${VITE_API_BASE_URL}/api/specialty/${providerSpecialtyId}/conditions`);
        const data: Condition[] = await res.json();
        //console.log(providers)
        const sortedConditions = [...data].sort((a, b) => {
          const aWords = a.name.trim().length;
          const bWords = b.name.trim().length;
          return bWords - aWords;
        });
        setConditions(sortedConditions);
      } catch (err) {
        console.error("Failed to fetch providers:", err);
      } finally {
        setLoading(false);
      }
    };

    if (providerSpecialtyId) fetchProvider();
    if(providerSpecialtyId) fetchConditions();
  }, [providerId, setTitle, providerSpecialtyId]);

  if (loading) return <Loader />;
  if (!provider) return <p className="text-center py-8">Provider not found</p>;

  const handleStartPrecheck = () => {
    onStartConsult(provider.user_id, providerSpecialtyId);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <Card>
          <div className="flex items-start gap-4 mb-6">
            {/* {(provider.avatar!==null)?          
              <img
                  src={ `${VITE_API_BASE_URL}/${provider.avatar}`}
                  alt={provider.display_name}
                  className="w-20 h-20 rounded-full object-cover"
                /> :
                 
                /*  */}
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={provider.avatar}
                alt={provider.display_name}
              />
              <AvatarFallback className="bg-gray-200">
                <User className="w-6 h-6 text-gray-500" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {provider.display_name}
              </h1>
              <p className="text-gray-600 mb-2">
                {/* {provider.specialties.map((s) => s.specialty.name).join(", ")} */}
                {provider.specialty}
              </p>
              <div className="inline-grid grid-flow-row sm:grid-flow-col auto-cols-max gap-2 sm:gap-3">
                <div className="flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm whitespace-nowrap">
                  Licensed in {provider.licenses.map((l) => l.state).join(", ")}
                </div>

                <div className="flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm whitespace-nowrap">
                  {provider.provider_experience_in_years} year(s) of Experience
                </div>
              </div>
              
              
            </div>
          </div>
          <div
            className="
                    mt-3
                    px-4
                    sm:px-6
                    lg:px-10
                    max-w-full
                  "
          >
            <h4 className="text-sm font-semibold text-gray-900 mb-1">About</h4>
            <p
              className={`
                          text-sm text-gray-700
                          w-full
                          overflow-hidden
                          ${
                            expandedBio
                              ? "whitespace-normal"
                              : "line-clamp-2 sm:line-clamp-1"
                          }
                        `}
            >
              {provider.professional_bio}
            </p>

            {provider.professional_bio.length > 120 && (
              <button
                onClick={() => setExpandedBio(!expandedBio)}
                className="mt-1 text-xs text-blue-600 hover:underline"
              >
                {expandedBio ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  $
                  {provider.licenses.length > 0
                    ? (
                        Math.min(
                          ...provider.licenses.map((l) => Number(l.price_cents))
                        ) / 100
                      ).toFixed(2)
                    : "No pricing available"}
                </p>
                <p className="text-sm text-gray-600">
                  Typical reply within {CONSULT_REPLY_HOURS} hours
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">
                  Board-Certified
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Common conditions
          </h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {conditions.slice(0, 8).map((topic, index) => (
              <TagCards key={index} label={topic.name} className="flex-auto sm:flex-none" />
            ))}
            
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            How it works
          </h2>
          <div className="space-y-4">
            {[
              {
                icon: "📝",
                title: "Ask your question",
                desc: "Share your questions securely",
              },
              {
                icon: "💳",
                title: "Pay if accepted",
                desc: "Charged only when doctor accepts",
              },
              {
                icon: "📋",
                title: "Get a signed report",
                desc: "Detailed guidance within hours",
              },
            ].map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-2xl">{step.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{step.title}</p>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-2xl mx-auto">
            <Button fullWidth onClick={handleStartPrecheck}>
              Ask a question
            </Button>
          </div>
        </div>

        {/* <div className="text-center text-sm text-gray-600">
          <p>
            ⚠️ Not for emergencies. Severe pain or sudden vision loss? Go now.
          </p>
        </div> */}
      </div>
    </div>
  );
};
