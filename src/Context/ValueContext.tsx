import { createContext, useState } from "react";

export const ValueContext = createContext<any>(null);

export const ValueProvider = ({ children }: { children: React.ReactNode }) => {
  const [values, setValues] = useState<any>();
  const [valueSearch, setValueSearch] = useState<any>([]);
  const [searchId, setSearchId] = useState<any>([]);

  return (
    <ValueContext.Provider
      value={{
        values,
        setValues,
        valueSearch,
        setValueSearch,
        searchId,
        setSearchId,
      }}
    >
      {children}
    </ValueContext.Provider>
  );
};
