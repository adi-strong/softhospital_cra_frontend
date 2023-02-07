import {useCallback, useState} from "react";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {PatientForm} from "./PatientForm";

export const sexOptions = [
  {label: '-- Aucune valeur sélectionnée --', value: 'none'},
  {label: 'Masculin', value: 'M'},
  {label: 'Féminin', value: 'F'},
]

export const sexOptions_2 = [
  {label: '-- Aucune valeur sélectionnée --', value: 'none'},
  {label: 'Homme', value: 'H'},
  {label: 'Femme', value: 'F'},
]

export const maritalStatusOptions = [
  {label: '-- Aucune valeur sélectionnée --', value: 'none'},
  {label: 'Célibataire', value: 'single'},
  {label: 'Marié(e)', value: 'married'},
]

export const EditPatientTab = () => {
  const [patient, setPatient] = useState({
    wording: 'Lifwa',
    lastName: "Wan'etumba",
    firstName: 'Adivin',
    sex: 'none',
    birthDate: '1991-03-05',
    birthPlace: 'Kinshasa',
    maritalStatus: 'single',
    tel: '0904651464',
    email: 'adi.life91@gmail.com',
    father: 'JR Lifwa',
    mother: 'Jeanine Nkolo',
    address: 'Londolobe n°15',
  })

  const currentYear = new Date().getFullYear()
  const birthYear = patient.birthDate ? parseInt(patient.birthDate.split('-')[0]) : currentYear
  const age = currentYear - birthYear

  const handleChangeAge = useCallback((e) => {
    handleChange(e, patient, setPatient)
  }, [patient])

  function onSubmit(e) {
    e.preventDefault()
  }

  return (
    <>
      <PatientForm
        labelBtn='Modifier'
        isProfileExists
        onSubmit={onSubmit}
        patient={patient}
        handleChangeAge={handleChangeAge}
        age={age}
        setPatient={setPatient} />
    </>
  )
}
