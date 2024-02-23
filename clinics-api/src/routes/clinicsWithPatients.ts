import { type Request, type Response } from 'express'
import { clinicCsvDataSource } from '../data/clinics/dataSource/csv/clinicCsvDataSource'
import { patientsCsvDataSource } from '../data/patients/dataSource/csv/patientsCsvDataSource'
import { type Clinic } from '../data/clinics/clinicsTypes'
import { type Patient } from '../data/patients/patientsTypes'

export interface ClinicWithPatients extends Clinic {
  patients: Array<Omit<Patient, 'clinicId'>>
}
type ResponseData = ClinicWithPatients[]

export const clinicsWithPatients = (req: Request, res: Response): void => {
  (async () => {
    const clinics = await clinicCsvDataSource.getData()
    const patients = await patientsCsvDataSource.getData()

    const responseData: ResponseData = clinics.map(clinic => (
      {
        ...clinic,
        patients:
          patients
            .filter(patient => patient.clinicId === clinic.id)
            .map(patient => {
              const { clinicId, ...releventFields } = patient
              return releventFields
            })
      }
    ))
    res.json(responseData)
  })().catch((e) => {
    res.sendStatus(500)
  })
}
