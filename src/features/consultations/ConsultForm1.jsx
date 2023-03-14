import {useMemo} from "react";
import {requiredField} from "../covenants/addCovenant";
import {Button, Col, Row, Spinner} from "react-bootstrap";
import {useLazyHandleLoadAgentsQuery} from "../staff/agentApiSlice";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {useGetActsQuery, useLazyHandleLoadActsQuery} from "../acts/actApiSlice";
import {useGetExamsQuery, useLazyHandleLoadExamsQuery} from "../exams/examApiSlice";
import {useGetTreatmentsQuery, useLazyHandleLoadTreatmentsQuery} from "../treatments/treatmentApiSlice";
import {AppAsyncSelectOptions, AppDatePicker, AppFloatingTextAreaField, AppInputGroupField} from "../../components";

const styles = {
  color: 'hsl(0, 0%, 40%)',
  display: 'inline-block',
  fontSize: 12,
  fontStyle: 'italic',
  marginTop: '1em',
}

export function ConsultForm1({isDataExists = false, consultation, setConsultation, apiErrors, onReset, loader = false, onRefresh}) {
  const [handleLoadAgents] = useLazyHandleLoadAgentsQuery()
  const [handleLoadExams] = useLazyHandleLoadExamsQuery()
  const [handleLoadTreatments] = useLazyHandleLoadTreatmentsQuery()
  const [handleLoadActs] = useLazyHandleLoadActsQuery()

  const {
    data: exams = [],
    isFetching: isExamsFetching,
    isSuccess: isExamsSuccess,
    isError: isExamsError} = useGetExamsQuery('Exam')
  const {
    data: acts = [],
    isFetching: isActsFetching,
    isSuccess: isActsSuccess,
    isError: isActsError} = useGetActsQuery('Act')
  const {
    data: treatments = [],
    isFetching: isTreatmentsFetching,
    isSuccess: isTreatmentsSuccess,
    isError: isTreatmentsError} = useGetTreatmentsQuery('Treatment')

  let examOptions, treatmentOptions, actOptions
  if (isExamsError) alert('ERREUR: Erreur lors du chargement des examens !!!')
  examOptions = useMemo(() => isExamsSuccess && exams ? exams.ids.map(id => {
    const exam = exams?.entities[id]

    return {
      id: exam?.id,
      label: exam?.wording,
      value: exam['@id'],
    }

  }) : [], [isExamsSuccess, exams])

  if (isTreatmentsError) alert('ERREUR: Erreur lors du chargement des traitements !!!')
  treatmentOptions = useMemo(() => isTreatmentsSuccess && treatments ? treatments.ids.map(id => {
    const treatment = treatments?.entities[id]

    return {
      id: treatment?.id,
      label: treatment?.wording,
      value: treatment['@id'],
    }

  }) : [], [isTreatmentsSuccess, treatments])

  if (isActsError) alert('ERREUR: Erreur lors du chargement des actes !!!')
  actOptions = useMemo(() => isActsSuccess && acts ? acts.ids.map(id => {
    const act = acts?.entities[id]

    return {
      id: act?.id,
      label: act?.wording,
      value: act['@id'],
    }

  }) : [], [isActsSuccess, acts])

  async function onLoadAgents(keyword) {
    const agentsData = handleLoadAgents(keyword).unwrap()
    if (!agentsData.error) return agentsData
  }

  async function onLoadExams(keyword) {
    const examsData = await handleLoadExams(keyword).unwrap()
    if (!examsData?.error) return examsData
  }

  async function onLoadTreatments(keyword) {
    const treatmentsData = await handleLoadTreatments(keyword).unwrap()
    if (!treatmentsData?.error) return treatmentsData
  }

  async function onLoadActs(keyword) {
    const actsData = await handleLoadActs(keyword).unwrap()
    if (!actsData?.error) return actsData
  }

  return (
    <>
      <div className='mb-3 text-end'>
        <Button type='button' variant='outline-secondary' disabled={loader} onClick={onRefresh}>
          {!loader
            ? <>Actualiser <i className='bi bi-arrow-clockwise'/></>
            : <>Chargement en cours <Spinner animation='grow' size='sm'/></>}
        </Button>
      </div>

      <Row className='mb-3'>
        <Col>
          <AppInputGroupField
            autoFocus
            disabled={loader}
            type='number'
            label='Température (°)'
            name='temperature'
            value={consultation.temperature}
            onChange={(e) => handleChange(e, consultation, setConsultation)}
            error={apiErrors.temperature}
            isTextBefore
            textBefore='T°' />
        </Col>

        <Col md={6}>
          <AppInputGroupField
            disabled={loader}
            type='number'
            label='Poids (Kg)'
            name='weight'
            value={consultation.weight}
            onChange={(e) => handleChange(e, consultation, setConsultation)}
            error={apiErrors.weight}
            isTextAfter
            textAfter='Kg' />
        </Col>

        <Col md={6}>
          <AppInputGroupField
            disabled={loader}
            label='Tenseion artérielle (Cm Hg | ...)'
            name='arterialTension'
            value={consultation.arterialTension}
            onChange={(e) => handleChange(e, consultation, setConsultation)}
            error={apiErrors.arterialTension}
            isTextBefore
            textBefore='Cm Hg' />
        </Col>

        <Col md={6}>
          <AppInputGroupField
            disabled={loader}
            label='Fréquence cardiaque (bpm | ...)'
            name='cardiacFrequency'
            value={consultation.cardiacFrequency}
            onChange={(e) => handleChange(e, consultation, setConsultation)}
            error={apiErrors.cardiacFrequency}
            isTextAfter
            textAfter='bpm' />
        </Col>

        <Col md={6}>
          <AppInputGroupField
            disabled={loader}
            label='Fréquence respiratoire (Pm | ...)'
            name='respiratoryFrequency'
            value={consultation.respiratoryFrequency}
            onChange={(e) => handleChange(e, consultation, setConsultation)}
            error={apiErrors.respiratoryFrequency}
            isTextBefore
            textBefore='Pm' />
        </Col>

        <Col md={6}>
          <AppInputGroupField
            disabled={loader}
            label='Saturation en oxygène (SpO2 | ...)'
            name='oxygenSaturation'
            value={consultation.oxygenSaturation}
            onChange={(e) => handleChange(e, consultation, setConsultation)}
            error={apiErrors.oxygenSaturation}
            isTextAfter
            textAfter='SpO2' />
        </Col>

        <Col md={6}>
          <AppDatePicker
            label={<>Heure &amp; date du rendez-vous {requiredField}</>}
            value={consultation.appointmentDate}
            onChange={(date) => setConsultation({...consultation, appointmentDate: date})}
            disabled={loader} />
        </Col>

        <Col md={6}>
          <AppAsyncSelectOptions
            disabled={loader}
            loadOptions={onLoadAgents}
            onChange={(e) => setConsultation({...consultation, agent: e})}
            value={consultation?.agent}
            error={apiErrors?.doctor}
            label={<>Médecin {requiredField}</>}
            placeholder='Médecin'
            className='text-capitalize' />
        </Col>
      </Row>

      <Col className="mb-3 me-2" style={styles}>
        <AppAsyncSelectOptions
          isMulti
          label={<span style={{ color: 'maroon' }}><i className='bi bi-journal-medical'/> Examen(s)</span>}
          loadOptions={onLoadExams}
          defaultOptions={examOptions}
          onChange={(e) => setConsultation({...consultation, exams: e})}
          value={consultation?.exams}
          disabled={isExamsFetching || loader}
          placeholder='Examen(s)...'
          className='text-uppercase' />
      </Col>

      <Col className="mb-3 me-2" style={styles}>
        <AppAsyncSelectOptions
          isMulti
          label={<span className='text-primary'><i className='bi bi-hospital'/> Premiers soins</span>}
          loadOptions={onLoadTreatments}
          defaultOptions={treatmentOptions}
          onChange={(e) => setConsultation({...consultation, treatments: e})}
          value={consultation?.treatments}
          disabled={isTreatmentsFetching || loader}
          placeholder='Premier(s) soin(s)...'
          className='text-uppercase' />
      </Col>

      <Col className="mb-3 me-2" style={styles}>
        <AppAsyncSelectOptions
          isMulti
          label={<span className='text-dark'><i className='bi bi-file-earmark-medical'/> Actes médicaux</span>}
          loadOptions={onLoadActs}
          defaultOptions={actOptions}
          onChange={(e) => setConsultation({...consultation, acts: e})}
          value={consultation?.acts}
          disabled={isActsFetching || loader}
          placeholder='Actes médicaux..'
          className='text-uppercase' />
      </Col>

      {consultation?.exams && consultation.exams?.length > 0 && (
        <>
          <AppFloatingTextAreaField
            value={consultation?.note}
            name='note'
            label='Renseingement clinique'
            disabled={loader}
            onChange={(e) => handleChange(e, consultation, setConsultation)}
            placeholder='Renseingement clinique...' />
        </>
      )}

      <AppFloatingTextAreaField
        disabled={loader}
        placeholder='Votre diagnostic ici...'
        value={consultation?.diagnostic}
        onChange={(e) => handleChange(e, consultation, setConsultation)}
        label='Diagnostic'
        error={apiErrors?.diagnostic}
        name='diagnostic' />

      <hr/>

      <div className="text-md-center text-sm-end mt-4">
        {!isDataExists &&
          <Button type='button' variant='light' onClick={onReset} className='me-1' disabled={loader}>
            <i className='bi bi-arrow-clockwise'/> Réinitialiser
          </Button>}

        <Button type='submit' className='me-1' disabled={loader}>
          {loader ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Valider'}
        </Button>
      </div>
    </>
  )
}
