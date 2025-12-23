import { createContext, useContext, useState, ReactNode } from "react";

type BackHandlerContextType = {
  onBack: (() => void) | null;
  setOnBack: (fn: (() => void) | null) => void;
};

const BackHandlerContext = createContext<BackHandlerContextType>({
  onBack: null,
  setOnBack: () => {},
});

export const useBackHandler = () => useContext(BackHandlerContext);

export const BackHandlerProvider = ({ children }: { children: ReactNode }) => {
  const [onBack, setOnBack] = useState<(() => void) | null>(null);
  return (
    <BackHandlerContext.Provider value={{ onBack, setOnBack }}>
      {children}
    </BackHandlerContext.Provider>
  );
};
