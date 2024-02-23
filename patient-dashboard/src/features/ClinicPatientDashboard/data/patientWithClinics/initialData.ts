import React, { useContext } from "react";
import { ClinicsWithPatients } from "./types";

export const ClinicsWithPatientsInitialDataContext = React.createContext<ClinicsWithPatients | undefined>(undefined);

export function useClinicsWithPatientsInitialData() {
  return useContext(ClinicsWithPatientsInitialDataContext)
}