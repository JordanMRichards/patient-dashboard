import { patientsCsvDataSource } from './patientsCsvDataSource'

describe('patientsCsvDataSource', () => {
  test('can getData without error', async () => {
    const data = await patientsCsvDataSource.getData()
    expect(data.length).toBeGreaterThan(0)
    data.forEach((patient) => {
      expect(typeof patient.id === 'number').toBe(true)
      expect(typeof patient.firstName === 'string').toBe(true)
      expect(typeof patient.lastName === 'string').toBe(true)
      expect(typeof patient.dateOfBirth === 'string').toBe(true)
      expect(typeof patient.clinicId === 'number').toBe(true)
    })
  })
})
