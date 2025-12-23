import React, { useEffect, useRef, useState } from "react";
import { Header } from "../shared/Header";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Select } from "../ui/Select";
import { Input } from "../ui/Input";
import { Checkbox } from "../ui/Checkbox";
import { useHeader } from "@/contexts/HeaderContext";
import { useLocation, useParams } from "react-router-dom";
import { PreCheckData } from "@/types/consult";
import { StateOption } from "@/types/specialty";
import Loader from "../shared/Loader";
import { Provider } from "@/types/provider";

interface PreCheckProps {
  onPass: (
    userId: string,
    providerSpecialtyId: String,
    data: PreCheckData
  ) => void;
  onFail: (
    reason: "coverage" | "redFlag" | "state" | "stateList" | "stateMismatch",
    data?: any
  ) => void;
}

interface RedFlagData {
  id: string;
  name: string;
}

const ALLOWED_STATES = [ "IN"];
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const PreCheck: React.FC<PreCheckProps> = ({ onPass, onFail }) => {
  const [state, setState] = useState("");
  const [dob, setDob] = useState("");
  const [coverageAttested, setCoverageAttested] = useState(false);
  const [selectedRedFlags, setSelectedRedFlags] = useState<string[]>([]);
  const [redFlags, setRedFlags] = useState<RedFlagData[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [options, setOptions] = useState<StateOption[]>([]);
  const [loading, setLoading] = useState(true);
  const { setTitle } = useHeader();
  const { providerId, providerSpecialtyId } = useParams<{
    providerId: string;
    providerSpecialtyId: string;
  }>();
  const location = useLocation();
  //const provLicenseData = location.state?.providerLicenseData;
  const [provider, setProvider] = useState<Provider | null>(null);

  // Refs for scroll-to-error
  const stateRef = useRef<HTMLDivElement | null>(null);
  const dobRef = useRef<HTMLDivElement | null>(null);
  const coverageRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Fetch red flags
  const fetchRedflags = async () => {
    try {
      const res = await fetch(
        `${VITE_API_BASE_URL}/api/specialty/${providerSpecialtyId}/redflags`
      );
      if (!res.ok) throw new Error("Failed to fetch red flags");
      const data = await res.json();
      setRedFlags(data);
    } catch (err) {
      console.error("Failed to fetch redflags:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch states + provider
  useEffect(() => {
    setTitle("Quick check");
    
    const fetchStatesAndProvider = async () => {
      try {
        const res = await fetch(`${VITE_API_BASE_URL}/api/constants/states`);
        const data = await res.json();
        setOptions([
          { value: "", label: "Select your state" },
          ...data.states.map((s: string) => ({ value: s, label: s })),
        ]);

        const providerRes = await fetch(
          `${VITE_API_BASE_URL}/api/providers/${providerSpecialtyId}/licenses`
        );
        if (!providerRes.ok) throw new Error("Failed to fetch provider");
        const providerData = await providerRes.json();
        setProvider(providerData);
      } catch (err) {
        console.error("Failed to fetch states or provider:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatesAndProvider();
    fetchRedflags();
  }, []);

  // 🟩 Load previously saved form data
  useEffect(() => {
    const saved = localStorage.getItem("precheckData");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.state) setState(parsed.state);
      if (parsed.dob) setDob(parsed.dob);
      if (parsed.coverageAttested) setCoverageAttested(parsed.coverageAttested);
      if (parsed.selectedRedFlags) setSelectedRedFlags(parsed.selectedRedFlags);
    }
  }, []);

  // 🟩 Save changes automatically
  useEffect(() => {
    const formData = { state, dob, coverageAttested, selectedRedFlags };
    localStorage.setItem("precheckData", JSON.stringify(formData));
  }, [state, dob, coverageAttested, selectedRedFlags]);

  if (loading) return <Loader />;

  // 🔹 Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!state) newErrors.state = "Please select your state";
    if (!dob) {
      newErrors.dob = "Please enter your date of birth";
    } else {
      const selectedDate = new Date(dob);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.dob = "Date of birth cannot be in the future";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.keys(newErrors)[0];
      if (firstError === "state" && stateRef.current)
        stateRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      if (firstError === "dob" && dobRef.current)
        dobRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (selectedRedFlags.length > 0) {
      onFail("redFlag");
      return;
    }

    if (!coverageAttested) {
      onFail("coverage");
      return;
    }
    const licensedStates = provider?.licenses?.map((l: any) => l.state);
    if (!licensedStates.includes(state) && !ALLOWED_STATES.includes(state)) {
      onFail("stateList", {
        providerId: provider?.user_id,
        providerName: provider?.display_name,
        licenseStates: provider?.licenses?.map((l: any) => l.state) || [],
        selectedState: state,
      });
      return;
    }
    // Condition 2: in licenses BUT NOT in allowed → error 2
    else if (licensedStates.includes(state) && !ALLOWED_STATES.includes(state)) {
      onFail("stateMismatch", {
        providerId: provider?.user_id,
        providerName: provider?.display_name,
        licenseStates: provider?.licenses?.map((l: any) => l.state) || [],
        selectedState: state,
      });
      return;
    }
    // Condition 1: NOT in licenses BUT in allowed → error 1
    else if (!licensedStates.includes(state) && ALLOWED_STATES.includes(state)) {
      onFail("state", {
        providerId: provider?.user_id,
        providerName: provider?.display_name,
        licenseStates: licensedStates || [],
        selectedState: state,
      });
      return;
    }
    if (!ALLOWED_STATES.includes(state)) {
      
    }

    
    if (!licensedStates?.includes(state)) {
      
    }
   /*  if (provLicenseData.state !== state) {
      onFail("stateMismatch", {
        providerId: provider?.id,
        providerName: provider?.display_name,
        licenseStates: licensedStates || [],
        selectedState: state,
      });
      return;
    } */

    onPass(providerId!, providerSpecialtyId!, {
      state,
      dob,
      coverageAttested,
      redFlags: selectedRedFlags,
    });
  };

  const toggleRedFlag = (flag: string) => {
    setSelectedRedFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-2">
        <Card>
          <p className="text-sm text-gray-600 mb-4">
            Takes &lt; 2 minutes. This helps us route safely.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div ref={stateRef}>
              <Select
                label="Where are you now?"
                options={options}
                value={state}
                onChange={(e) => setState(e.target.value)}
                error={errors.state}
              />
            </div>

            <div ref={dobRef}>
              <Input
                label="Date of birth"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                error={errors.dob}
              />
            </div>

            <div ref={coverageRef}>
              <Checkbox
                label="I am not enrolled in Medicare (including Medicare Advantage) or Medicaid."
                checked={coverageAttested}
                onChange={(e) => setCoverageAttested(e.target.checked)}
                error={errors.coverage}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Are you experiencing any of these now?
              </label>
              <div className="space-y-2">
                {redFlags.map((flag) => (
                  <Checkbox
                    key={flag.id}
                    label={flag.name}
                    checked={selectedRedFlags.includes(flag.name)}
                    onChange={() => toggleRedFlag(flag.name)}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
              <Button type="submit" fullWidth>
                Continue
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
