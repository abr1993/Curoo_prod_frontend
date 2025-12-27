import { ConsultDetail } from "@/types/consult";

//Helper to get color based on numeric value 
  export const getSeverityColor = (value: number): string => { 
    if (value <= 0) return 'bg-gray-100 text-gray-700'; 
    if (value <= 3) return 'bg-green-100 text-green-700'; 
    if (value <= 6) return 'bg-yellow-100 text-yellow-700'; 
    if (value <= 10) return 'bg-orange-100 text-orange-800'; 
    return 'bg-red-100 text-red-700'; 
  };

  export const formatDateTime = (date: Date) =>{
    return date.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  export const getConsultDate = (consult: ConsultDetail): string => {
    switch (consult.status) {
      case 'ANSWERED':
        return consult.answered_date;
      case 'ACCEPTED':
        return consult.accepted_date;
      case 'DECLINED':
        return consult.declined_date;
      case 'AUTO_DECLINED':
      case 'TIMEDOUT':
        return consult.timed_out_date;
      default:
        return consult.submitted_date;
    }
  }

  export const extractSixDigits = (input: string): string =>{
  // Extract all digits from the string
    const digits = input.replace(/\D/g, '');

    // Take only the first 6 digits
    const firstSix = digits.slice(0, 6);

    // If fewer than 6 digits, pad with zeros at the end
    return firstSix.padEnd(6, '0');
  }
