import { clinicCsvDataSource } from './clinicCsvDataSource'

describe('clinicCsvDataSource', () => {
  test('can getData without error', async () => {
    const data = await clinicCsvDataSource.getData()
    expect(data.length).toBeGreaterThan(0)
    data.forEach((clinic) => {
      expect(typeof clinic.id === 'number').toBe(true)
      expect(typeof clinic.name === 'string').toBe(true)
    })
  })
})
