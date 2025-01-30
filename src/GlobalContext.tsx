// context/GlobalContext.tsx
import React, { createContext, useContext, ReactNode, useState } from "react";

// Define the shape of the context's value
interface GlobalContextType {
  count: number;
  setCount: (count: number) => void;
}

// Create a default value for the context
const defaultContextValue: GlobalContextType = {
  count: 0, // Default value set to 0
  setCount: () => {},
};

// Create the context
const GlobalContext = createContext<GlobalContextType>(defaultContextValue);

// Create a provider component
export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [count, setCount] = useState<number>(0);

  return (
    <GlobalContext.Provider value={{ count, setCount }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Create a custom hook to use the context
export const useGlobalContext = () => useContext(GlobalContext);
