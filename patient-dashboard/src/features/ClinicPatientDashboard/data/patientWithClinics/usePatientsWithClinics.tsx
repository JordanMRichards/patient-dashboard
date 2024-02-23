import { useQuery } from "@tanstack/react-query"
import { ClinicsWithPatients } from "./types"
import { config } from "@/config/config"
import { useClinicsWithPatientsInitialData } from "./initialData"

export function useClinicsWithPatientsQuery() {
  const initialData = useClinicsWithPatientsInitialData();
  const query = useQuery<ClinicsWithPatients>({
      queryKey: ['clinicsWithPatients'],
      queryFn: async () => {
          const res = await fetch(`${config.clinicApiUrl}/clinicsWithPatients`, {})
          return await res.json()
      },
      initialData,
  })
  return query
}
