import { type DataSource } from '../DataSourceType'

export interface Clinic {
  id: number
  name: string
}

export type ClinicsDataSource = DataSource<undefined, Clinic[]>
