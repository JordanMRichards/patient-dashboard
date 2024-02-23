export interface PatientInClinic {
  id: number
  firstName: string
  lastName: string
  dateOfBirth: string
}

export interface Clinic  {
  id: number,
  name: string,
}

interface ClinicWithPatient extends Clinic  {
  patients: PatientInClinic[]
}

export type ClinicsWithPatients = ClinicWithPatient[]
