import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ClinicPatientDashboard } from './ClinicPatientDashboard'
import { createQueryClientWrapper } from '@/testUtils/testUtils'
import { clinicsWithPatientsTestData } from './data/patientWithClinics/testData'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
 
import { config } from '@/config/config'

const server = setupServer()

describe('ClinicPatientDashboard', () => {
  beforeAll(() => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    });
    server.listen()
  })

  describe('on successful request', () => {
    beforeEach(() => {
      server.resetHandlers()
      server.use(http.get(`${config.clinicApiUrl}/clinicsWithPatients`, () => {
        // And respond with a "text/plain" response
        // with a "Hello world!" text response body.
        return HttpResponse.json(clinicsWithPatientsTestData)
      }))
    })
    it('shows loading state successfully when fetching', async () => {
      render(<ClinicPatientDashboard />, { wrapper: createQueryClientWrapper() })
      await waitFor(() => {
        expect(screen.getByText("Loading latest results...")).toBeInTheDocument()
      })
    })

    it('successfully defaults to first clinic', async () => {
      render(<ClinicPatientDashboard />, { wrapper: createQueryClientWrapper() })
      await waitFor(() => {
        expect(screen.getByText("Display patients for clinic:")).toBeInTheDocument()
        expect(screen.getByDisplayValue(clinicsWithPatientsTestData[0].name)).toBeInTheDocument()
      })

      await waitFor(() => {
        clinicsWithPatientsTestData[0].patients.forEach((patient) => {
          expect(screen.getByText(patient.firstName)).toBeInTheDocument()
          expect(screen.getByText(patient.lastName)).toBeInTheDocument()
          expect(screen.getByText(patient.dateOfBirth)).toBeInTheDocument()
        })

        clinicsWithPatientsTestData[1].patients.forEach((patient) => {
          expect(screen.queryByText(patient.firstName)).not.toBeInTheDocument()
          expect(screen.queryByText(patient.lastName)).not.toBeInTheDocument()
          expect(screen.queryByText(patient.dateOfBirth)).not.toBeInTheDocument()
        })
      })
    })

    it('when clicking First Name it orders by that header, pressing again then orders it back', async () => {
      render(<ClinicPatientDashboard />, { wrapper: createQueryClientWrapper() })
      await waitFor(() => {
        expect(screen.getByText("Display patients for clinic:")).toBeInTheDocument()
        expect(screen.getByDisplayValue(clinicsWithPatientsTestData[0].name)).toBeInTheDocument()
      })

      let firstNameHeader
      await waitFor(() => {
        firstNameHeader = screen.getByText("First Name")
      })

      fireEvent.click(firstNameHeader!)

      await waitFor(() => {
        const startsWithH = screen.getByText(clinicsWithPatientsTestData[0].patients[0].firstName)
        const startsWithG = screen.getByText(clinicsWithPatientsTestData[0].patients[1].firstName)
        expect(startsWithG.compareDocumentPosition(startsWithH) > startsWithH.compareDocumentPosition(startsWithG)).toBe(true);
      })

      // order it back
      fireEvent.click(firstNameHeader!)

      await waitFor(() => {
        const startsWithH = screen.getByText(clinicsWithPatientsTestData[0].patients[0].firstName)
        const startsWithG = screen.getByText(clinicsWithPatientsTestData[0].patients[1].firstName)
        expect(startsWithG.compareDocumentPosition(startsWithH) > startsWithH.compareDocumentPosition(startsWithG)).toBe(false);
      })
    })

    it('when selecting other clinic, it successfully shows new results', async () => {
      render(<ClinicPatientDashboard />, { wrapper: createQueryClientWrapper() })
      let inputElm
      await waitFor(() => {
        inputElm = screen.getByDisplayValue(clinicsWithPatientsTestData[0].name)
      })
      await fireEvent.change(inputElm!, { target: { value: `${clinicsWithPatientsTestData[1].id}` }})

      await waitFor(() => screen.getByDisplayValue(clinicsWithPatientsTestData[1].name))
      await waitFor(() => {
        clinicsWithPatientsTestData[1].patients.forEach((patient) => {
          expect(screen.queryByText(patient.firstName)).toBeInTheDocument()
          expect(screen.queryByText(patient.lastName)).toBeInTheDocument()
          expect(screen.queryByText(patient.dateOfBirth)).toBeInTheDocument()
        })
      })
    })
  })

  describe('on request error', () => {
    beforeAll(() => server.listen())

    beforeEach(() => {
      server.resetHandlers()
      server.use(http.get(`${config.clinicApiUrl}/clinicsWithPatients`, async () => {
        return new HttpResponse(null, { status: 500 })
      }))
    })

    it('renders friendly error message', async () => {
      render(<ClinicPatientDashboard />, { wrapper: createQueryClientWrapper() })
      await waitFor(() => {
        expect(screen.getByText("Sorry, something went wrong fetching the latest data. Please check your internet connection and try again.")).toBeInTheDocument()
      })
    })
  })

  afterAll(() => {
    server.close()
  })
})
