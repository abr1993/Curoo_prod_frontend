// HeaderContext.tsx
import { createContext, useContext, useState } from "react";

const HeaderContext = createContext({
  title: "",
  setTitle: (t: string) => {},
  setDescription: (description?: string) => {},
  description: undefined,
  titleLink: undefined,
  setTitleLink: (titleLink?: string) => {},
});

export const useHeader = () => useContext(HeaderContext);

export const HeaderProvider = ({ children }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [titleLink, setTitleLink] = useState<string | undefined>(undefined);
  //const [onBack, setOnBack] = useState<(() => void) | undefined>();
  return (
    <HeaderContext.Provider value={{ title, setTitle, description, setDescription, titleLink, setTitleLink }}>
      {children}
    </HeaderContext.Provider>
  );
};
