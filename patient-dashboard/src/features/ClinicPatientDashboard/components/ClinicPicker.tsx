import { useId } from "react";
import { Clinic } from "../data/patientWithClinics/types";
import { useClinicsWithPatientsQuery } from "../data/patientWithClinics/usePatientsWithClinics";

interface Props {
  selectedId?: Clinic['id'],
  onIdSelected: (id: Clinic['id']) => void
}

export const ClinicPicker = ({ selectedId, onIdSelected }: Props) => {
  const { data: clinicsWithPatients } = useClinicsWithPatientsQuery();
  const inputId = useId();
  return (
    <div style={styles.containerStyle}>
      <label style={styles.labelStyle} htmlFor={inputId}>Display patients for clinic:</label>
      <select
        value={selectedId}
        onChange={(e) => onIdSelected(parseInt(e.target.value))}
        id={inputId}
      >
        {
          clinicsWithPatients?.map((c) =>
            <option key={c.id} value={c.id}>{c.name}</option>
          )
        }
      </select>
    </div>)
}

const styles = {
  containerStyle: {
    display: 'flex',
    marginBottom: '1em'
  },
  labelStyle: {
    marginRight: 6,
  }
}