import request from 'supertest'
import app from '../app'
import { type ClinicWithPatients } from './clinicsWithPatients'
import { type Patient } from '../data/patients/patientsTypes'

describe('clinicsWithPatients route', () => {
  test('It should respond with correct structure and without error', async () => {
    const response = await request(app).get('/clinicsWithPatients')
    expect(response.body.length).toBeGreaterThan(0)
    response.body.forEach((clinicWithPatients: ClinicWithPatients) => {
      expect(typeof clinicWithPatients.id === 'number').toBe(true)
      expect(typeof clinicWithPatients.name === 'string').toBe(true)
      expect(Array.isArray(clinicWithPatients.patients)).toBe(true)
      clinicWithPatients.patients.forEach((patient) => {
        expect(typeof patient.id === 'number').toBe(true)
        expect(typeof patient.firstName === 'string').toBe(true)
        expect(typeof patient.lastName === 'string').toBe(true)
        expect(typeof patient.dateOfBirth === 'string').toBe(true)
        expect(typeof (patient as Patient).clinicId === 'undefined').toBe(true)
      })
    })
    expect(response.statusCode).toBe(200)
  })
})
