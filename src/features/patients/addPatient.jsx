import {useEffect, useState} from "react";
import {useCallback} from "react";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {useDispatch} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {PatientForm} from "./PatientForm";
import {Row, Spinner} from "react-bootstrap";
import {useAddNewPatientMutation} from "./patientApiSlice";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

const AddPatient = () => {
  const dispatch = useDispatch(), navigate = useNavigate()
  const [covenant, setCovenant] = useState(null)
  const [addNewPatient, {isLoading, isError, error}] = useAddNewPatientMutation()
  const [patient, setPatient] = useState({
    name: '',
    nationality: '',
    lastName: '',
    firstName: '',
    sex: 'none',
    birthDate: '',
    birthPlace: '',
    maritalStatus: 'none',
    tel: '',
    email: '',
    father: '',
    mother: '',
    address: '',
    profile: null,
  }) // patient's local state

  let apiErrors = {
    name: null,
    nationality: null,
    lastName: null,
    firstName: null,
    sex: null,
    birthDate: null,
    birthPlace: null,
    maritalStatus: null,
    tel: null,
    email: null,
    father: null,
    mother: null,
    address: null,
    profile: null,
  }

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/patients'))
  }, [dispatch]) // toggle dropdown patients menu

  const currentYear = new Date().getFullYear()
  const birthYear = patient.birthDate ? parseInt(patient.birthDate.split('-')[0]) : currentYear
  const age = currentYear - birthYear

  const handleChangeAge = useCallback((e) => {
    handleChange(e, patient, setPatient)
  }, [patient]) // handle change birthDate and patient's age

  function handleReset() {
    setPatient({
      name: '',
      nationality: '',
      lastName: '',
      firstName: '',
      sex: 'none',
      birthDate: '',
      birthPlace: '',
      maritalStatus: 'none',
      tel: '',
      email: '',
      father: '',
      mother: '',
      address: '',
      profile: null,
    })
    setCovenant(null)
  } // handle reset fields

  async function onSubmit(e) {
    e.preventDefault()
    apiErrors = {
      name: null,
      nationality: null,
      lastName: null,
      firstName: null,
      sex: null,
      birthDate: null,
      birthPlace: null,
      maritalStatus: null,
      tel: null,
      email: null,
      father: null,
      mother: null,
      address: null,
      profile: null,}
    try {
      const formData = await addNewPatient({...patient,
        age: age,
        covenant: covenant ? covenant.value : null,
        profile: patient.profile ? patient.profile.id : null,
      })
      if (!formData.error) {
        toast.success('Enregistrement bien efféctué.')
        handleReset()
        navigate('/member/patients')
      }
    }
    catch (e) { toast.error(e.message) }
  } // on submit

  if (isError) {
    const { violations } = error.data
    if (violations) {
      violations.forEach(({ propertyPath, message }) => {
        apiErrors[propertyPath] = message;
      });
    }
  }

  return (
    <>
      <AppHeadTitle title='Enregistrement du patient' />
      <AppBreadcrumb title='Enregistrement du patient' links={[{label: 'Patients', path: '/member/patients'}]} />
      <Row className='section'>
        <PatientForm
          covenant={covenant}
          setCovenant={setCovenant}
          apiErrors={apiErrors}
          isLoading={isLoading}
          labelBtn={isLoading ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Enregistrer'}
          labelResetBtn='Effacer'
          handleReset={handleReset}
          age={age}
          handleChangeAge={handleChangeAge}
          setPatient={setPatient}
          patient={patient}
          onSubmit={onSubmit} />
      </Row>
    </>
  )
}

export default AddPatient
