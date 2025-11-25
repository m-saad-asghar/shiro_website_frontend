import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type AreaUnit = "sq ft" | "sq m";

interface AreaUnitContextType {
  currentUnit: AreaUnit;
  setCurrentUnit: (unit: AreaUnit) => void;
  convertArea: (area: number) => number;
  formatArea: (area: number) => string;
}

const AreaUnitContext = createContext<AreaUnitContextType | undefined>(
  undefined
);

export const useAreaUnit = () => {
  const context = useContext(AreaUnitContext);
  if (context === undefined) {
    throw new Error("useAreaUnit must be used within an AreaUnitProvider");
  }
  return context;
};

interface AreaUnitProviderProps {
  children: ReactNode;
}

export const AreaUnitProvider: React.FC<AreaUnitProviderProps> = ({
  children,
}) => {
  const [currentUnit, setCurrentUnitState] = useState<AreaUnit>("sq ft");

  // Load saved unit on app start
  useEffect(() => {
    const savedUnit = localStorage.getItem("areaUnit") as AreaUnit;
    if (savedUnit && (savedUnit === "sq ft" || savedUnit === "sq m")) {
      setCurrentUnitState(savedUnit);
    }
  }, []);

  const setCurrentUnit = (unit: AreaUnit) => {
    setCurrentUnitState(unit);
    localStorage.setItem("areaUnit", unit);
  };

  // Convert area from sq ft to sq m or vice versa
  const convertArea = (area: number): number => {
    if (currentUnit === "sq m") {
      // Convert from sq ft to sq m
      return Math.round(area * 0.092903 * 100) / 100;
    }
    // If unit is sq ft, return value as is (because backend data comes in sq ft)
    return area;
  };

  // Format area with unit
  const formatArea = (area: number): string => {
    const convertedArea = convertArea(area);
    return `${convertedArea} ${currentUnit}`;
  };

  const value: AreaUnitContextType = {
    currentUnit,
    setCurrentUnit,
    convertArea,
    formatArea,
  };

  return (
    <AreaUnitContext.Provider value={value}>
      {children}
    </AreaUnitContext.Provider>
  );
};
