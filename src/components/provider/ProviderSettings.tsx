import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import {   PRICE_MIN, PRICE_MAX} from "../../utils/constants";
import { useHeader } from "@/contexts/HeaderContext";
import { useAuth } from "@/hooks/useAuth";
import { Specialty, SpecialtySetting } from "@/types/specialty";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";
//import { Avatar } from "@radix-ui/react-avatar";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
interface ProviderSettingsProps {  
  onBack: () => void;
  onSave: () => void;
}

export const ProviderSettings: React.FC<ProviderSettingsProps> = ({  
  onBack,
  onSave,
}) => {
  
const [photo, setPhoto] = useState<string | File | null>(null);
const [photoPreview, setPhotoPreview] = useState<string | null>(null);
const [name, setName] = useState("");
const [experienceInYears, setExperienceInYears] = useState(0);
const [allSpecialties, setAllSpecialties] = useState<Specialty[]>([]);
const [specialties, setSpecialties] = useState<SpecialtySetting[]>([]);
const [showSuccessModal, setShowSuccessModal] = useState(false);
const [modalMessage, setModalMessage] = useState('');
const [newSpecialty, setNewSpecialty] = useState<string>("");
const [unavailable, setUnavailable] = useState(false);
const [stateOptions, setStateOptions] = useState<string[]>([]);
const {token, userId} = useAuth();
const { setTitle } = useHeader();
useEffect(() => {
  setTitle("Provider Settings");
}, []);

useEffect(() => {
  const fetchSettings = async () => {
    try {
      
      const res = await fetch(`${VITE_API_BASE_URL}/api/providers/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      // 1️⃣ Set provider info
      setName(data.displayName);
      setPhoto(data.avatar);
      setUnavailable(data.unavailable);
      //setExperienceInYears(data.)
      // 2️⃣ Set provider specialties
      setSpecialties(data.specialties || []);
      console.log("fetched settings", data);
      // 3️⃣ Initialize allSpecialties for the dropdown
      setAllSpecialties(data.availableSpecialties || []);      

    } catch (err) {
      console.error("Failed to fetch provider settings", err);
    }
  };
  fetchStates();
  fetchSettings();
}, []);
console.log("fetched states", stateOptions);

const fetchStates = async () => {
      try {
        const res = await fetch(`${VITE_API_BASE_URL}/api/constants/states`);
        const data = await res.json();
        setStateOptions(data.states);

        
      } catch (err) {
        console.error("Failed to fetch states:", err);
      } 
    };

// Upload photo
const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setPhoto(file); // store the File for upload

    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }  
};

// Add specialty
const handleAddSpecialty = () => {
  if (!newSpecialty || specialties.some((s) => s.id === newSpecialty)) return;

  // Find the selected specialty object from allSpecialties
  const spec = allSpecialties.find((s) => s.id === newSpecialty);
  if (!spec) return;

  setSpecialties([
    ...specialties,
    { id: spec.id, name: spec.name, available: true, states: [], experience_in_years: 0 },
  ]);
  // Remove the specialty from the allSpecialties list
  setAllSpecialties((prev) => prev.filter((s) => s.id !== spec.id));

  setNewSpecialty("");
};


// Toggle specialty availability
const toggleAvailability = (name: string) => {
  setSpecialties((prev) =>
    prev.map((s) => (s.name === name ? { ...s, available: !s.available } : s))
  );
};

// Toggle state selection with defaults
const toggleState = (name: string, state: string) => {
  setSpecialties((prev) =>
    prev.map((s) => {
      if (s.name !== name) return s;
      const existing = s.states.find((st) => st.state === state);
      if (existing) {
        // Remove state
        return { ...s, states: s.states.filter((st) => st.state !== state) };
      } else {
        // Add state
        return {
          ...s,
          states: [...s.states, { state, price: 100, dailyCap: 10 }],
        };
      }
    })
  );
};

// Update state price
const handleStatePriceChange = (
  specialtyName: string,
  state: string,
  price: number
) => {
  setSpecialties((prev) =>
    prev.map((s) =>
      s.name === specialtyName
        ? {
            ...s,
            states: s.states.map((st) =>
              st.state === state ? { ...st, price } : st
            ),
          }
        : s
    )
  );
};

const handleExperienceChange = (
  specialtyName: string,  
  years: string
) => {
  setSpecialties((prev) =>
    prev.map((s) => (s.name === specialtyName ? { ...s, experience_in_years: parseInt(years) || 0 } : s))
  );  
};

// Update state daily cap
const handleStateCapChange = (
  specialtyName: string,
  state: string,
  cap: number
) => {
  setSpecialties((prev) =>
    prev.map((s) =>
      s.name === specialtyName
        ? {
            ...s,
            states: s.states.map((st) =>
              st.state === state ? { ...st, dailyCap: cap } : st
            ),
          }
        : s
    )
  );
};

// Remove specialty
/* const removeSpecialty = (name: string) => {
    setSpecialties((prev) => prev.filter((s) => s.name !== name));
}; */
const removeSpecialty = (name: string) => {
  setSpecialties((prevSpecialties) => {
    // Find the specialty being removed
    const removed = prevSpecialties.find((s) => s.name === name);
    if (!removed) return prevSpecialties; // nothing to remove

    // Remove it from specialties
    const updatedSpecialties = prevSpecialties.filter((s) => s.name !== name);

    // Add it back to allSpecialties
    setAllSpecialties((prevAll) => {
      // only add if not already present
      if (!prevAll.some((a) => a.id === removed.id)) {
        return [...prevAll, { id: removed.id, name: removed.name ?? '' }];
      }
      return prevAll;
    });

    return updatedSpecialties;
  });
};


// ✅ Save everything to API
const handleSave = async () => {
  try {
      let avatarPath = photo; // existing photo path

    // ✅ Step 1: Upload photo first if it's a File
      if (photo instanceof File) {
        const formData = new FormData();
        formData.append("photo", photo);

        const uploadRes = await fetch(
          `${VITE_API_BASE_URL}/api/providers/settings/upload-photo`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!uploadRes.ok) throw new Error("Photo upload failed");
        const uploadData = await uploadRes.json();
        avatarPath = uploadData.avatar; // the relative path saved by backend
      }

    const payload = {
      displayName: name.trim(),
      avatar: avatarPath || null,
      unavailable,
      specialties,
    };
    const res = await fetch(`${VITE_API_BASE_URL}/api/providers/settings`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
       },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(await res.text());
    const updated = await res.json();
    //alert("Changes saved successfully!");
    console.log("Updated profile:", updated);
    setShowSuccessModal(true);
    setModalMessage("✅ Your settings has been successfully changed!");
  } catch (err) {
    console.error(err);
    setShowSuccessModal(true);
    setModalMessage("❌ Failed to save changes.");
    //alert("");
  }
};
const handleconsolelog = () =>{
  console.log("Specialties:  ", specialties);
}

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Section */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28 rounded-full overflow-hidden bg-gray-100 border">
              <Avatar className="w-28 h-28">                
                      <AvatarImage
                          src={ 
                            (typeof photo === "string" && photo)
                              ? `${VITE_API_BASE_URL}/${photo}`
                              : photoPreview || ""
                            }
                          alt="Profile"
                      />
                      <AvatarFallback className="flex items-center justify-center h-full bg-gray-200">
                        <User className="w-8 h-8 text-gray-500" />
                      </AvatarFallback>
                  </Avatar>
              {/* {photo ? (
                <img
                  
                  src={
                        typeof photo === "string"
                          ? `${VITE_API_BASE_URL}/${photo}`
                          : photoPreview || ""
                      }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />                
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No photo
                </div>
              )} */}
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                onClick={() => document.getElementById("photo-upload")?.click()}
              >
                Upload Photo
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPhoto("")}
                disabled={!photo}
              >
                Remove
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>
        </Card>

        {/* Availability */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Availability</h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-700">
              Provider is {unavailable ? <b>unavailable</b> : <b>Available</b>}
            </span>
            <button           
              onClick={() => setUnavailable(!unavailable)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                unavailable ? "bg-gray-300":"bg-blue-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  unavailable ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Specialties */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Specialties & State Settings
          </h2>
          <div className="flex gap-2 mb-4">
            <select
                value={newSpecialty} // should store the specialty ID
                onChange={(e) => setNewSpecialty(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
                disabled={unavailable}
              >
                <option value="">Select specialty...</option>
                {allSpecialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))}
              </select>
              <Button onClick={handleAddSpecialty} disabled={unavailable}>
                Add
              </Button>

          </div>

          {specialties.map((spec) => (
            <div
              key={spec.name}
              className={`border rounded-lg p-4 mb-4 bg-white shadow-sm ${
                 unavailable ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{spec.name}</h3>
                <Button
                  variant="secondary"                  
                  onClick={() => removeSpecialty(spec.name)}
                  disabled={!spec.available}
                >
                  Remove
                </Button>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">
                  Accept consults for this specialty
                </span>
                <button
                  onClick={() => {toggleAvailability(spec.name); }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    spec.available ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      spec.available ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className="mt-3 space-y-3">
                <Input
                    label="Professional Experience (in years)"
                    value={spec.experience_in_years}
                    onChange={(e) => handleExperienceChange(spec.name, e.target.value)}
                    placeholder="Enter your experience in this field in years..."
                  />
              </div>
              <div
                    className={`mt-3 space-y-3 transition-opacity ${
                      !spec.available 
                        ? "opacity-50 pointer-events-none"
                        : "opacity-100"
                    }`}
                  >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Licensure States
              </label>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {stateOptions.map((state) => (
                  <button
                    key={state}
                    onClick={() => toggleState(spec.name, state)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      spec.states.some((s) => s.state === state)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>

              {spec.states.length > 0 && (
                <div className="mt-3 space-y-3">
                  {spec.states.map((st) => (
                    <div
                      key={st.state}
                      className="grid grid-cols-2 gap-3 items-center"
                    >
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          {st.state} — Price ($)
                        </label>
                        <input
                          type="number"
                          min={PRICE_MIN}
                          max={PRICE_MAX}
                          step={0.01}
                          value={st.price}
                          onChange={(e) =>
                            handleStatePriceChange(
                              spec.name,
                              st.state,
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Daily Consult Cap
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={st.dailyCap}
                          onChange={(e) =>
                            handleStateCapChange(
                              spec.name,
                              st.state,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </div>
          ))}
        </Card>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onBack}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleSave}>
            Save Changes
          </Button>
        </div>
          {showSuccessModal && (
           <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
              <div className="bg-white rounded-xl w-full max-w-sm p-6 text-center space-y-4 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800">{modalMessage}</h2>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={()=> setShowSuccessModal(false)}
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
