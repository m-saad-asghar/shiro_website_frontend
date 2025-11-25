import useQueryGet from "@/hooks/useQueryGet";
import TypeServices from "@/Services/TypesServices";
import { createContext, type FC, type ReactNode } from "react";

export const TypesContext = createContext<{
  data: {
        types : {
    name: string;
    for_agent: boolean;
    for_developer: boolean;
    id: number;
    }[]
  } | undefined

  status: "pending" | "error" | "success";
}>({
  data:  undefined,
  status: "pending",
});

type TypesContextProviderProps = {
  children: ReactNode;
};

const TypesContextProvider: FC<TypesContextProviderProps> = ({ children }) => {
  const { data, status } = useQueryGet(["AllTypes"], TypeServices.type);
  return (
    <TypesContext.Provider
      value={{
        data,
        status,
      }}
    >
      {children}
    </TypesContext.Provider>
  );
};

export default TypesContextProvider;
