import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { IMAGES } from "../../utils/constants";
import { useHeader } from "@/contexts/HeaderContext";
import Loader from "../shared/Loader";
import { useAuth } from "@/hooks/useAuth";
import { Provider, ProviderLicense, ProviderSpecialty } from "@/types/provider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CONSULT_REPLY_HOURS = import.meta.env.VITE_CONSULT_REPLY_HOURS;
interface LandingProps {
  onStartConsult: (physicianId: string, provider_specialty_id: String) => void;
}

export const Landing: React.FC<LandingProps> = ({
  onStartConsult,
}) => {
  const navigate = useNavigate();
  const { setTitle, setDescription, setTitleLink } = useHeader();
  const [providers, setProviders] = useState<ProviderSpecialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  console.log(VITE_API_BASE_URL);
const {token, userId} = useAuth();
  useEffect(() => {
    setTitle("Curoo");
    setDescription("Ask a specialist in: OPHTHALMOLOGY");
    setTitleLink("/");
    

    const fetchProviders = async () => {
      try {
        const res = await fetch(`${VITE_API_BASE_URL}/api/providers`);
        const data: ProviderSpecialty[] = await res.json();

        // Allowed state abbreviations
      const allowedStates = [ "IN", ];

      // Filter providers based on state abbreviation
      
      const sortedProviders = [...data].sort((a, b) => {
            const specialtyA = a.specialty.toLowerCase();
            const specialtyB = b.specialty.toLowerCase();
            
            const nameA = a.display_name.toLowerCase();
            const nameB = b.display_name.toLowerCase();

            if (specialtyA < specialtyB) return -1;
            if (specialtyA > specialtyB) return 1;
            
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          });
          
          const filteredSpecialties = sortedProviders.filter(provider => 
            provider.states?.some(state => allowedStates.includes(state))
          );

          setProviders(filteredSpecialties);
        
        //setProviders(filteredProviders);
      } catch (err) {
        console.error("Failed to fetch providers:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
    return () => {
      setDescription(undefined); // cleanup for other pages
      setTitleLink(undefined);
    };
  }, [setTitle, setDescription]);

  console.log(providers);
  const handleStartConsult = (providerId: string, provider_Specialty_id: String, provider: ProviderSpecialty) => {
    if(userId)localStorage.removeItem(`lastConsultId_${userId}`);
    onStartConsult(providerId, provider_Specialty_id);
  };
  

  if (loading) return <Loader />;
  if (error) return <p className="text-center py-8">Failed to fetch providers from database!</p>;

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {providers.map((provider, index) => (
          <Card key={index}>
            <div className="flex items-start gap-4 ">
              {/* <img
                src={ (provider.avatar!==null) ? `${VITE_API_BASE_URL}/${provider.avatar}` : IMAGES.physician} 
                alt={provider.display_name}
                className="w-20 h-20 rounded-full object-cover"
              /> */}
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
                <p className="text-gray-600 mb-2">{provider.specialty}</p>
                {/* <div className="flex flex-wrap gap-2 sm:gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Licensed in {provider.states.join(", ")}
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {provider.provider_experience_in_years} year(s) of
                    Experience
                  </div>
                </div> */}
                <div className="inline-grid grid-flow-row sm:grid-flow-col auto-cols-max gap-2 sm:gap-3">
                  <div className="flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm whitespace-nowrap">
                    Licensed in {provider.states.join(", ")}
                  </div>

                  <div className="flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm whitespace-nowrap">
                    {provider.provider_experience_in_years} year(s) of Experience
                  </div>
                </div>




              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  $
                  {provider.price_cents.length > 0
                    ? (
                        Math.min(
                          ...provider.price_cents.map((p) => Number(p))
                        ) / 100
                      ).toFixed(2)
                    : "No pricing available"}
                </p>
                <p className="text-sm text-gray-600">
                  Typical reply within {CONSULT_REPLY_HOURS} hours
                </p>
              </div>
              <img
                src={IMAGES.securityBadge}
                alt="HIPAA Compliant"
                className="w-12 h-12"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() =>
                  handleStartConsult(
                    provider.user_id,
                    provider.provider_specialty_id,
                    provider
                  )
                }
                disabled={!provider.is_available}
                className={`${
                  provider.is_available
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                } text-white`}
              >
                {provider.is_available ? "View Details" : "Unavailable"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
