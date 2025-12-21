import { createContext, useState } from "react";

type ValueContextType = {
  values: any;
  setValues: React.Dispatch<React.SetStateAction<any>>;
  valueSearch: any[];
  setValueSearch: React.Dispatch<React.SetStateAction<any[]>>;
  searchId: number[];
  setSearchId: React.Dispatch<React.SetStateAction<number[]>>;
};

export const ValueContext = createContext<ValueContextType>({
  values: {}, // ✅ never undefined
  setValues: () => {},
  valueSearch: [], // ✅ never undefined
  setValueSearch: () => {},
  searchId: [], // ✅ never undefined
  setSearchId: () => {},
});

export const ValueProvider = ({ children }: { children: React.ReactNode }) => {
  // ✅ IMPORTANT: default must be object/arrays
  const [values, setValues] = useState<any>({});
  const [valueSearch, setValueSearch] = useState<any[]>([]);
  const [searchId, setSearchId] = useState<number[]>([]);

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
