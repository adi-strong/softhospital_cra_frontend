import {Card} from "react-bootstrap";
import {useGetPatientsQuery, useLazyHandleLoadPatientsQuery} from "../patients/patientApiSlice";
import {useMemo} from "react";
import {AppAsyncSelectOptions} from "../../components";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {requiredField} from "../covenants/addCovenant";
import PatientInfos from "../patients/PatientInfos";
import {useGetConsultationTypesQuery, useLazyHandleLoadConsultTypesQuery} from "../files/consultationTypeApiSlice";
import {useGetBedsQuery, useLazyLoadBedsQuery} from "../beds/bedApiSlice";
import {BedDetails} from "./BedDetails";
// import {entrypoint} from "../../app/store";
// import img from '../../assets/app/img/default_profile.jpg';

export const ConsultForm2 = ({ consultation, setConsultation, onReset, apiErrors, loader = false }) => {
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

  const [handleLoadPatients] = useLazyHandleLoadPatientsQuery()
  const [handleLoadConsultTypes] = useLazyHandleLoadConsultTypesQuery()
  const [loadBedsQuery] = useLazyLoadBedsQuery()

  let patientOptions, filesOptions, bedOptions
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

  async function onLoadConsultationFiles(keyword) {
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

  return (
    <>
      <Card className='border-0 pb-3'>
        <Card.Body>
          <h2 className='card-title' style={cardTitleStyle}>
            <i className='bi bi-file-earmark-text'/> Fiche {requiredField}
          </h2>
          <AppAsyncSelectOptions
            defaultOptions={filesOptions}
            value={consultation?.file}
            onChange={(e) => setConsultation({...consultation, file: e})}
            disabled={isFilesFetching || loader}
            loadOptions={onLoadConsultationFiles}
            placeholder='-- Fiche de consultation --'
            className='text-capitalize' />
        </Card.Body>
      </Card>

      <Card className='border-0'>
        <Card.Body>
          <h2 className='card-title' style={cardTitleStyle}><i className='bi bi-person'/> Patient(e) {requiredField}</h2>
          <div className="mb-3">
            <AppAsyncSelectOptions
              disabled={loader || isPatientsFetching}
              className='text-uppercase'
              onChange={(e) => setConsultation({...consultation, patient: e})}
              value={consultation?.patient}
              loadOptions={onLoadPatients}
              defaultOptions={patientOptions}
              placeholder='Patient(e)...'
              error={apiErrors?.patient} />
          </div>
          {consultation?.patient && <PatientInfos patient={consultation.patient?.data} />}
        </Card.Body>
      </Card>

      <Card className='border-0'>
        <Card.Body>
          <h2 className='card-title' style={cardTitleStyle}>
            <i className='bi bi-hospital'/> Hospitalisation
          </h2>
          <AppAsyncSelectOptions
            defaultOptions={bedOptions}
            value={consultation?.bed}
            onChange={(e) => setConsultation({...consultation, bed: e})}
            disabled={isBedsFetching || loader}
            loadOptions={onLoadBeds}
            placeholder="-- Lit d'hospitalisation --"
            className='text-capitalize' />
          <BedDetails bed={consultation.bed}/>
        </Card.Body>
      </Card>
    </>
  )
}
