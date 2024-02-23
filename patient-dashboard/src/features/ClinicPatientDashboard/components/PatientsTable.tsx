import { PropsWithChildren, useMemo, useRef, useState } from "react"
import { PatientInClinic } from "../data/patientWithClinics/types"

interface Props {
  patients: PatientInClinic[]
}

type SortByDirection = 'ASC' | 'DESC'
type SortKey = keyof Omit<PatientInClinic, 'id'>
type SortBy = {
  direction: SortByDirection,
  key: SortKey
}

interface SortableHeaderItemProps extends PropsWithChildren {
  sortBy?: SortBy,
  itemSortKey: SortKey,
  onSort: (sortBy: SortBy) => void
}

const SortableHeaderItem = ({ sortBy, itemSortKey, onSort, children }: SortableHeaderItemProps) => {
  const itemAlreadySorting = sortBy?.key == itemSortKey

  return (
    <th aria-sort={!itemAlreadySorting ? 'none' : sortBy?.direction === 'ASC' ? 'ascending' : 'descending'}>
      <button
        aria-pressed={itemAlreadySorting ? 'true' : 'false'}
        onClick={() => {
          onSort({
              key: itemSortKey,
              direction: !itemAlreadySorting ? 'ASC' : sortBy?.direction === 'ASC' ? 'DESC' : 'ASC'
          })
        }}
      >
        {children} {!itemAlreadySorting ? ' ' : (sortBy.direction === 'ASC' ? '↓' : '↑')}
      </button>
    </th>
  )
}

export const PatientsTable = ({ patients }: Props) => {
  const [sortBy, setSortBy] = useState<SortBy>();
  const sortedPatients = useMemo(() => {
    if (!sortBy) return patients
    return patients.sort((a, b) => {
      if (sortBy.direction === 'ASC') {
        return a[sortBy.key] < b[sortBy.key] ? -1 : 1
      } else {
        return a[sortBy.key] > b[sortBy.key] ? -1 : 1
      }
    })
  }, [sortBy, patients]);

  if (sortedPatients.length === 0) {
    return (<p>No patients are registered at this clinic.</p>)
  }

  return (
    <table>
      <thead>
        <tr>
          <SortableHeaderItem sortBy={sortBy} itemSortKey={'firstName'} onSort={setSortBy}>First Name</SortableHeaderItem>
          <SortableHeaderItem sortBy={sortBy} itemSortKey={'lastName'} onSort={setSortBy}>Last Name</SortableHeaderItem>
          <SortableHeaderItem sortBy={sortBy} itemSortKey={'dateOfBirth'} onSort={setSortBy}>Date of Birth</SortableHeaderItem>
        </tr>
      </thead>
      <tbody>
        {sortedPatients.map(patient =>
          <tr key={patient.id}>
            <td>{patient.firstName}</td>
            <td>{patient.lastName}</td>
            <td>{patient.dateOfBirth}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
