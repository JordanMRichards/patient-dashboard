import * as fs from 'fs'
import { parse } from '@fast-csv/parse'
import { type Clinic, type ClinicsDataSource } from '../../clinicsTypes'
import path from 'path'

export const clinicCsvDataSource: ClinicsDataSource = {
  name: 'clinics_csv',
  getData: async () => {
    return await new Promise((resolve, reject) => {
      const data: Clinic[] = []

      fs.createReadStream(path.resolve(path.join(__dirname, 'csvSource/clinics.csv')))
        .pipe(parse({ headers: true }))
        .on('error', error => {
          reject(error)
        })
        .on('data', row => {
          // @TODO Robust validation
          if (typeof row.id !== 'undefined' && typeof row.name !== 'undefined') {
            data.push({
              id: parseInt(row.id as string),
              name: row.name
            })
          } else {
            throw new Error(`Invalid CSV fields for ${clinicCsvDataSource.name}`)
          }
        })
        .on('end', () => {
          resolve(data)
        })
    })
  }
}
