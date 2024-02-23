import { type DataSource } from '../DataSourceType'

export interface Patient {
  id: number
  clinicId: number
  firstName: string
  lastName: string
  dateOfBirth: string
}

export type PatientsDataSource = DataSource<undefined, Patient[]>
