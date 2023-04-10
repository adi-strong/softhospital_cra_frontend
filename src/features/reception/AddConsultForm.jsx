import {useMemo} from "react";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import {useGetPatientsQuery, useLazyHandleLoadPatientsQuery} from "../patients/patientApiSlice";
import {useGetBedsQuery, useLazyLoadBedsQuery} from "../beds/bedApiSlice";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {requiredField} from "../covenants/addCovenant";
import {AppAsyncSelectOptions, AppDatePicker, AppFloatingTextAreaField} from "../../components";
import PatientInfos from "../patients/PatientInfos";
import {useGetConsultationTypesQuery, useLazyHandleLoadConsultTypesQuery} from "../files/consultationTypeApiSlice";
import {BedDetails} from "../consultations/BedDetails";
import {useLazyHandleLoadAgentsQuery} from "../staff/agentApiSlice";
import {useGetTreatmentsQuery, useLazyHandleLoadTreatmentsQuery} from "../treatments/treatmentApiSlice";
import {handleChange} from "../../services/handleFormsFieldsServices";

export const AddConsultForm = ({ loader = false, consult, setConsult, apiErrors, onReset }) => {
  const {
    data: patients = [],
    isFetching: isPatientsFetching,
    isSuccess: isPatientsSuccess,
    isError: isPatientsError} = useGetPatientsQuery('Patient')

  const {
    data: files = [],
    isFetching: isFilesFetching,
    isSuccess: isFilesSuccess,
    isError: isFilesError} = useGetConsultationTypesQuery('ConsultationType')

  const {
    data: beds = [],
    isFetching: isBedsFetching,
    isSuccess: isBedsSuccess,
    isError: isBedsError} = useGetBedsQuery('Bed')

  const {
    data: treatments = [],
    isFetching: isTreatmentsFetching,
    isSuccess: isTreatmentsSuccess,
    isError: isTreatmentsError} = useGetTreatmentsQuery('Treatment')

  const [handleLoadPatients] = useLazyHandleLoadPatientsQuery()
  const [handleLoadConsultTypes] = useLazyHandleLoadConsultTypesQuery()
  const [loadBedsQuery] = useLazyLoadBedsQuery()
  const [handleLoadAgents] = useLazyHandleLoadAgentsQuery()
  const [handleLoadTreatments] = useLazyHandleLoadTreatmentsQuery()

  let patientOptions, filesOptions, bedOptions, treatmentOptions
  if (isPatientsError) alert('ERREUR: Erreur lors du chargement des patients !!!')
  patientOptions = useMemo(() => isPatientsSuccess && patients ? patients.map(patient => {
    const name = patient?.name
    const lastName = patient?.lastName ? patient.lastName : ''
    const firstName = patient?.firstName ? patient.firstName : ''

    // const profile = patient?.profile ? entrypoint+patient.profile?.contentUrl : img
    const label = `${name} ${lastName} ${firstName}`

    return {
      label,
      value: patient['@id'],
      id: patient?.id,
      data: patient,
    }
  }) : [], [isPatientsSuccess, patients])

  if (isFilesError)  alert('ERREUR: Erreur lors du chargement des types de fiches !!!')
  filesOptions = useMemo(() => isFilesSuccess && files ? files.map(file => {
    return {
      label: file?.wording,
      value: file['@id'],
    }
  }) : [], [isFilesSuccess, files])

  if (isBedsError) alert('ERREUR: Erreur lors du chargement des lits !!!')
  bedOptions = useMemo(() => isBedsSuccess && beds ? beds.ids?.map(id => {
    const bed = beds.entities[id]
    return {
      id: bed?.id,
      label: bed?.number,
      value: bed['@id'],
      data: bed,
    }
  }) : [], [isBedsSuccess, beds])

  if (isTreatmentsError) alert('ERREUR: Erreur lors du chargement des traitements !!!')
  treatmentOptions = useMemo(() => isTreatmentsSuccess && treatments ? treatments.ids.map(id => {
    const treatment = treatments?.entities[id]

    return {
      id: treatment?.id,
      label: treatment?.wording,
      value: treatment['@id'],
    }

  }) : [], [isTreatmentsSuccess, treatments])

  async function onLoadConsultFiles(keyword) {
    const filesData = await handleLoadConsultTypes(keyword).unwrap()
    if (!filesData.error) return filesData
  }

  async function onLoadPatients(keyword) {
    const patientsData = await handleLoadPatients(keyword).unwrap()
    if (!patientsData.error) return patientsData
  }

  async function onLoadBeds(keyword) {
    const bedsData = await loadBedsQuery(keyword).unwrap()
    if (!bedsData.error) return bedsData
  }

  async function onLoadAgents(keyword) {
    const agentsData = handleLoadAgents(keyword).unwrap()
    if (!agentsData.error) return agentsData
  }

  async function onLoadTreatments(keyword) {
    const treatmentsData = await handleLoadTreatments(keyword).unwrap()
    if (!treatmentsData?.error) return treatmentsData
  }

  return (
    <>
      <p>Veuillez renseigner les (<i className='text-danger'>*</i>) champs obligatoires</p>

      <Row className='mb-3'>
        <Col md={6}>
          <h2 className='card-title' style={cardTitleStyle}><i className='bi bi-person'/> Patient(e) {requiredField}</h2>
          <div className="mb-3">
            <AppAsyncSelectOptions
              disabled={loader || isPatientsFetching}
              className='text-uppercase'
              onChange={(e) => setConsult({...consult, patient: e})}
              value={consult?.patient}
              loadOptions={onLoadPatients}
              defaultOptions={patientOptions}
              placeholder='Patient(e)...'
              error={apiErrors?.patient} />
          </div>
          {consult?.patient && <PatientInfos patient={consult.patient?.data} />}

          <div className='mb-3'>
            <AppAsyncSelectOptions
              disabled={loader}
              loadOptions={onLoadAgents}
              onChange={(e) => setConsult({...consult, agent: e})}
              value={consult?.agent}
              error={apiErrors?.doctor}
              label={<>Médecin {requiredField}</>}
              placeholder='Médecin'
              className='text-capitalize' />
          </div>

          <div className='mb-3'>
            <h2 className='card-title' style={cardTitleStyle}>
              <i className='bi bi-hospital'/> Hospitalisation
            </h2>
            <AppAsyncSelectOptions
              defaultOptions={bedOptions}
              value={consult?.bed}
              onChange={(e) => setConsult({...consult, bed: e})}
              disabled={isBedsFetching || loader}
              loadOptions={onLoadBeds}
              placeholder="-- Lit d'hospitalisation --"
              className='text-capitalize' />
            <BedDetails bed={consult.bed}/>
          </div>

          <Col>
            <AppDatePicker
              onChange={(d) => setConsult({...consult, hospReleasedAt: new Date(d)})}
              value={consult?.hospReleasedAt}
              disabled={isBedsFetching || loader || !consult?.bed}
              label="Heure & date d'arrivé" />
          </Col>
        </Col>

        <Col>
          <div className='mb-3'>
            <h5 className='card-title' style={cardTitleStyle}>Premier(s) soin(s)</h5>
            <AppAsyncSelectOptions
              isMulti
              loadOptions={onLoadTreatments}
              defaultOptions={treatmentOptions}
              onChange={(e) => setConsult({...consult, treatments: e})}
              value={consult?.treatments}
              disabled={isTreatmentsFetching || loader}
              placeholder='Premier(s) soin(s)...'
              className='text-uppercase' />
          </div>

          <div className='mb-3'>
            <InputGroup>
              <InputGroup.Text>T°</InputGroup.Text>
              <Form.Control
                disabled={loader}
                type='number'
                label='Température (°)'
                name='temperature'
                value={consult.temperature}
                onChange={(e) => handleChange(e, consult, setConsult)} />

              <Form.Control
                disabled={loader}
                type='number'
                label='Poids (Kg)'
                name='weight'
                value={consult.weight}
                onChange={(e) => handleChange(e, consult, setConsult)} />
              <InputGroup.Text>Poids</InputGroup.Text>
            </InputGroup>
          </div>

          <div className='mb-3'>
            <InputGroup>
              <InputGroup.Text>T. Art.</InputGroup.Text>
              <Form.Control
                disabled={loader}
                label='Tenseion artérielle (Cm Hg | ...)'
                name='arterialTension'
                value={consult.arterialTension}
                onChange={(e) => handleChange(e, consult, setConsult)} />

              <Form.Control
                disabled={loader}
                label='Fréquence cardiaque (bpm | ...)'
                name='cardiacFrequency'
                value={consult.cardiacFrequency}
                onChange={(e) => handleChange(e, consult, setConsult)} />
              <InputGroup.Text>F. Card.</InputGroup.Text>
            </InputGroup>
          </div>

          <div className='mb-3'>
            <InputGroup>
              <InputGroup.Text>F. Resp.</InputGroup.Text>
              <Form.Control
                disabled={loader}
                label='Fréquence respiratoire (Pm | ...)'
                name='respiratoryFrequency'
                value={consult.respiratoryFrequency}
                onChange={(e) => handleChange(e, consult, setConsult)} />

              <Form.Control
                disabled={loader}
                label='Saturation en oxygène (SpO2 | ...)'
                name='oxygenSaturation'
                value={consult.oxygenSaturation}
                onChange={(e) => handleChange(e, consult, setConsult)} />
              <InputGroup.Text>S. Oxy.</InputGroup.Text>
            </InputGroup>
          </div>

          <AppFloatingTextAreaField
            name='comment'
            value={consult?.comment}
            onChange={(e) => handleChange(e, consult, setConsult)}
            disabled={loader}
            label='Commentaire'
            placeholder='Commentaire'
            text='Champs facultatif.' />

          <div className='mb-3'>
            <h2 className='card-title' style={cardTitleStyle}>
              <i className='bi bi-file-earmark-text'/> Fiche {requiredField}
            </h2>
            <AppAsyncSelectOptions
              defaultOptions={filesOptions}
              value={consult?.file}
              onChange={(e) => setConsult({...consult, file: e})}
              disabled={isFilesFetching || loader}
              loadOptions={onLoadConsultFiles}
              placeholder='-- Fiche de consult --'
              className='text-capitalize' />
          </div>

          <div className='text-end'>
            <Button type='button' disabled={loader} onClick={onReset} className='bg-transparent border-0 text-dark'>
              <i className='bi bi-trash3 text-danger'/>
            </Button>
          </div>
        </Col>
      </Row>
    </>
  )
}
