import * as fs from 'fs'
import { parse } from '@fast-csv/parse'
import { type Patient, type PatientsDataSource } from '../../patientsTypes'
import path from 'path'

export const patientsCsvDataSource: PatientsDataSource = {
  name: 'patients_csv',
  getData: async () => {
    const buffer: Patient[] = []
    const patientCsvFileNames = await getCsvFileNames()
    await Promise.all(
      patientCsvFileNames.map(
        async (fileName): Promise<void> => {
          await processPatientCsv(fileName, buffer)
        }
      ))
    return buffer
  }
}

const CSV_DIR = '/csvSource/'
async function getCsvFileNames (): Promise<string[]> {
  const sourcePath = path.resolve(path.join(__dirname, CSV_DIR))
  return await new Promise((resolve, reject) => {
    if (!fs.existsSync(sourcePath)) {
      reject(new Error(`Missing ${CSV_DIR} directory`))
    }
    fs.readdir(sourcePath, (err, files) => {
      if (err !== null) reject(err)
      resolve(files)
    })
  })
}

async function processPatientCsv (fileName: string, buffer: Patient[]): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    try {
      fs.createReadStream(path.resolve(path.join(__dirname, CSV_DIR, fileName)))
        .pipe(parse({
          headers: true
        }))
        .on('error', error => {
          reject(error)
        })
        .on('data', row => {
          // @TODO Implement robust validation
          if (typeof row.id !== 'undefined' && typeof row.clinic_id !== 'undefined') {
            buffer.push({
              id: parseInt(row.id as string),
              clinicId: parseInt(row.clinic_id as string),
              firstName: row.first_name,
              lastName: row.last_name,
              dateOfBirth: row.date_of_birth
            })
          } else {
            throw new Error(`Invalid CSV fields for ${patientsCsvDataSource.name}`)
          }
        })
        .on('end', () => {
          resolve()
        })
    } catch (err) {
      reject(err)
    }
  })
}
