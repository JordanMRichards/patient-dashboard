import { useMemo, useState } from "react";
import { useClinicsWithPatientsQuery } from "./data/patientWithClinics/usePatientsWithClinics";
import { ClinicPicker } from "./components/ClinicPicker"
import { PatientsTable } from "./components/PatientsTable"

const RetryButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div style={styles.errorContainer}>
      <p>
        <span>Sorry, something went wrong fetching the latest data. Please check your internet connection and try again.</span>
      </p>
      <button
        style={styles.retryButton}
        onClick={onClick}
      >
        Retry
      </button>
    </div>
  )
}

export const ClinicPatientDashboard = () => {
  const { data: clinicsWithPatients, status, refetch, isFetching, error } = useClinicsWithPatientsQuery();
  const defaultClinicId = clinicsWithPatients?.[0]?.id;
  const [chosenClinicId, setChosenClinicId] = useState<number | undefined>();

  const clinicId = chosenClinicId || defaultClinicId
  const clinic = useMemo(() =>
    clinicsWithPatients?.find(
      clinic => clinic.id === clinicId
    ), [clinicId, clinicsWithPatients])
  
  if (!isFetching && !clinicsWithPatients && status === 'error') {
    return (<RetryButton onClick={refetch} />)
  }

  if (!isFetching && !clinicsWithPatients?.length) {
    return <p>No clinics registered.</p>
  }

  return (
    <>
      {isFetching &&
        (<p style={styles.loading}>Loading latest results...</p>)}
      {!isFetching && status === 'error' &&
        (<RetryButton onClick={refetch} />)}
      {!!clinic &&
        <>
          <ClinicPicker 
            selectedId={clinicId}
            onIdSelected={setChosenClinicId}
          />
          <PatientsTable patients={clinic.patients} />
        </>
      }
    </>
  )
}

const styles: { [key: string]: React.CSSProperties} = {
  loading: {
    backgroundColor: 'rgba(235,226,240,0.85)',
    boxShadow: '0px 0px 30px rgba(0,0,0,0.1)',
    borderRadius: 8,
    margin: '2em',
    padding: '1em',
    position: 'fixed',
    bottom: '2em',
  },
  errorContainer: {
    backgroundColor: 'rgba(235,226,240,0.85)',
    boxShadow: '0px 0px 30px rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: '1em',
    maxWidth: '300px',
    margin: '2em',
    flexDirection: 'column',
    display: 'flex',
  },
  retryButton: {
    marginTop: '1em',
    color: 'blue',
    background: 'none',
    border: 'none',
    alignSelf: 'flex-end'
  }
}
