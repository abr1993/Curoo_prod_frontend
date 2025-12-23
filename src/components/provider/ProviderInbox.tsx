import React, { useEffect, useState } from 'react';
import { Header } from '../shared/Header';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { useHeader } from '@/contexts/HeaderContext';
import Loader from '../shared/Loader';
import { ConsultDetail } from '@/types/consult';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
interface ProviderInboxProps {  
  onSelectConsult: (consultId: String) => void;
  onSettings: () => void;
}

export const ProviderInbox: React.FC<ProviderInboxProps> = ({  
  onSelectConsult,
  onSettings,
}) => {
  const [filter, setFilter] = useState<'pending' | 'accepted' | 'answered' | 'declined'| 'timed out' | 'all'>('pending');
  const [consults, setConsults] = useState<ConsultDetail[]>([]);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

  const filteredConsults = consults.filter((c) => {
    if (filter === 'all') return true;

      const statusMap: Record<string, 'pending' | 'accepted' | 'answered' | 'declined' | 'timed out'> = {
      SUBMITTED: 'pending',
      ACCEPTED: 'accepted',
      ANSWERED: 'answered',
      DECLINED: 'declined',
      AUTO_DECLINED: 'timed out',
      TIMEDOUT: 'timed out',
      
    };

    const mappedStatus = statusMap[c.status] || 'pending';
    return mappedStatus === filter;
    //return c.status === filter;
  });

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
          setConsults(data);
        } catch (err: any) {
          console.error("Error fetching consults:", err);
          setError("Unable to load consults. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchConsults();
    }, []);
  console.log("fetched consults", consults);

  //Helper to get color based on numeric value 
  const getSeverityColor = (value: number, type: string): string => { 
    if (value <= 0) return 'bg-gray-200 text-gray-700'; 
    if (value <= 3) return 'bg-green-100 text-green-700'; 
    if (value <= 6) return 'bg-yellow-100 text-yellow-700'; 
    if (value <= 10) return 'bg-orange-100 text-orange-700'; 
    return 'bg-red-100 text-red-700'; 
  };
  const getConsultDate = (consult: ConsultDetail): string => {
  switch (consult.status) {
    case 'ANSWERED':
      return consult.answered_date;
    case 'DECLINED':
      return consult.declined_date;
    case 'AUTO_DECLINED':
    case 'TIMEDOUT':
      return consult.timed_out_date;
    default:
      return consult.submitted_date;
  }
}

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
  const extractSixDigits = (input: string): string =>{
  // Extract all digits from the string
    const digits = input.replace(/\D/g, '');

    // Take only the first 6 digits
    const firstSix = digits.slice(0, 6);

    // If fewer than 6 digits, pad with zeros at the end
    return firstSix.padEnd(6, '0');
  }
  const { setTitle } = useHeader();
      useEffect(() => { setTitle("Inbox"); }, []);

  if (loading) return <Loader />;
  
  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['pending', 'accepted', 'answered', 'declined', 'timed out', 'all'] as const).map((f) => (
            <Chip
              key={f}
              label={f.charAt(0).toUpperCase() + f.slice(1)}
              selected={filter === f}
              onClick={() => setFilter(f)}
            />
          ))}
        </div>

        {filteredConsults.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500">No consults in this category</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredConsults.map((consult) => (
              <Card key={consult.id} onClick={() => onSelectConsult(consult.id)} className="cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {consult.topics.map((item)=>
                        item.name + " "
                      )                          
                      }
                    </p>
                    <p className="text-sm text-gray-600">{consult.state_at_service}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(getConsultDate(consult) || '').toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{consult.question_body}</p>

                
                 <div className="flex flex-wrap gap-2 mb-3"> 
                  {consult.consult_specialty_symptoms.map((item, index)=>(
                    <span key={index}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor( item.Value, item.specialty_symptom.symptom.name)}`} > 
                        {item.specialty_symptom.symptom.name}: {item.Value} 
                      </span> 
                  ))
                  }
                 </div>                
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          consult.status
                        )}`}
                      >
                        <strong>{consult.status.toUpperCase()}</strong>
                      </span>
                      <span className="text-xs text-gray-500">ID: {extractSixDigits(consult.id)}</span>
                    </div>
                {/* {Object.values(consult.medical_history?.data || {}).map((item, index) => (
                  <span key={index} className="block">
                    <strong>{item.field_name}:</strong>{" "}
                    {Array.isArray(item.value)
                      ? item.value.join(", ")
                      : item.value}
                  </span>
                ))} */}
                
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
