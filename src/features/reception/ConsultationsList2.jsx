import {useAddNewConsultationMutation, useGetConsultationsQuery} from "../consultations/consultationApiSlice";
import {AppAddModal, AppDataTableStripped, AppLgModal, AppMainError, AppTHead} from "../../components";
import {useCallback, useMemo, useState} from "react";
import {ConsultationItem2} from "./ConsultationItem2";
import {Button, Col, Form} from "react-bootstrap";
import {AddPatientForm} from "./AddPatientForm";
import {useAddNewPatientMutation} from "../patients/patientApiSlice";
import toast from "react-hot-toast";
import {AddConsultForm} from "./AddConsultForm";

const thead = [
  {label: '#'},
  {label: 'Fiche'},
  {label: 'Patient(e)'},
  {label: <><i className='bi bi-calendar-event'/> Date</>},
]

export function ConsultationsList2() {
  const {
    data: consultations = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch} = useGetConsultationsQuery('Consultations')
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)
  const [patient, setPatient] = useState({name: '', firstName: '', sex: 'none', tel: ''})
  const [consult, setConsult] = useState({
    doctor: null,
    patient: null,
    file: null,
    treatments: null,
    bed: null,
    temperature: 0.0,
    weight: 0.0,
    arterialTension: '',
    cardiacFrequency: '',
    respiratoryFrequency: '',
    oxygenSaturation: '',
    comment: '',
  })

  const [addNewPatient, {
    isLoading: isPatientLoading,
    isError: isPatientError,
    error: patientError
  }] = useAddNewPatientMutation()

  const [addNewConsultation, {
    isLoading: isConsultLoading,
    isError: isConsultError,
    error: consultError
  }] = useAddNewConsultationMutation()

  let patientErrors = {name: null, firstName: null, tel: null}
  let consultErrors = {doctor: null, patient: null}

  let content, errors
  if (isError) errors = <AppMainError/>
  content = useMemo(() => {
    return (
      <tbody>
      {isSuccess && consultations && consultations.map(consult =>
        <ConsultationItem2 key={consult?.id} consult={consult}/>)}
      </tbody>
    )
  }, [isSuccess, consultations])

  const toggleShow = () => setShow(!show)
  const toggleShow2 = () => setShow2(!show2)

  const onRefresh = async () => await refetch()

  const handleSearch = useCallback(({ target }) => {
    const value = target.value
    setSearch(value)
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  // Handle submit patient's data
  const onResetPatientData = () => setPatient({tel: '', name: '', firstName: '', sex: 'none'})

  const isPatientValid = [patient.name].every(Boolean) || !isPatientLoading
  async function onSubmitPatientData(e) {
    e.preventDefault()
    if (isPatientValid) {
      const formData = await addNewPatient(patient)
      if (!formData.error) {
        toast.success('Enregistrement bien efféctuée.')
        onResetPatientData()
        toggleShow()
      }
    }
    else alert('Veuillez renseigner le nom du patient ❗')
  }
  // End Handle submit patient's data

  // Handle submit consultation's data
  const onResetConsultData = () => setConsult({
    doctor: null,
    patient: null,
    file: null,
    treatments: null,
    bed: null,
    temperature: 0.0,
    weight: 0.0,
    arterialTension: '',
    cardiacFrequency: '',
    respiratoryFrequency: '',
    oxygenSaturation: '',
    comment: '',
  })

  const isConsultValid = [consult.patient, consult.doctor].every(Boolean) || !isPatientLoading
  async function onSubmitConsultData(e) {
    e.preventDefault()
    if (isConsultValid) {
      const formData = await addNewConsultation(consult)
      if (!formData.error) {
        toast.success('Enregistrement bien efféctuée.')
        onResetConsultData()
        toggleShow2()
      }
    }
    else alert('Veuillez renseigner les champs obligatoires ❗')
  }
  // End Handle submit consultation's data

  if (isPatientError) {
    const { violations } = patientError.data
    if (violations) {
      violations.forEach(({ propertyPath, message }) => {
        patientErrors[propertyPath] = message;
      });
    }
  }

  if (isConsultError) {
    const { violations } = consultError.data
    if (violations) {
      violations.forEach(({ propertyPath, message }) => {
        consultErrors[propertyPath] = message;
      });
    }
  }

  return (
    <>
      <AppDataTableStripped
        loader={isLoading}
        title='Fiches de consultation'
        thead={<AppTHead loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={thead}/>}
        tbody={content}
        overview={
          <>
            <Col md={5} className='mb-2'>
              <Form onSubmit={onSubmit}>
                <Form.Control
                  name='search'
                  autoComplete='off'
                  value={search}
                  onChange={handleSearch}
                  placeholder='Rechercher' />
              </Form>
            </Col>

            <Col className='text-md-end'>
              <Button type='button' className='me-1 mb-2' onClick={toggleShow}>
                <i className='bi bi-person-plus'/> Patient(e)
              </Button>

              <Button type='button' variant='success' className='mb-2' onClick={toggleShow2}>
                <i className='bi bi-plus'/> Anamnèse & signes vitaux
              </Button>
            </Col>
          </>
        } />
      {errors && errors}

      <AppAddModal
        loader={isPatientLoading}
        className='bg-light'
        onHide={toggleShow}
        show={show}
        title={<><i className='bi bi-person-plus'/> Enregistrer un(e) patient(e)</>}>
        <AddPatientForm
          onReset={onResetPatientData}
          patient={patient}
          setPatient={setPatient}
          apiErrors={patientErrors}
          onSubmit={onSubmitPatientData}
          loader={isPatientLoading} />
      </AppAddModal>

      <AppLgModal
        loader={isConsultLoading}
        show={show2}
        onClick={onSubmitConsultData}
        onHide={toggleShow2}
        title={<><i className='bi bi-plus'/> Anamnèse & signes vitaux</>}
        className='bg-light'>
        <AddConsultForm
          loader={isConsultLoading}
          onReset={onResetConsultData}
          consult={consult}
          apiErrors={consultErrors}
          setConsult={setConsult} />
      </AppLgModal>
    </>
  )
}
