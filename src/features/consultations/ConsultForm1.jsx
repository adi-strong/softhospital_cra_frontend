import {useMemo, useState} from "react";
import {requiredField} from "../covenants/addCovenant";
import {Button, Col, Row, Spinner} from "react-bootstrap";
import {useLazyHandleLoadAgentsQuery} from "../staff/agentApiSlice";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {useGetExamsQuery, useLazyHandleLoadExamsQuery} from "../exams/examApiSlice";
import {
  AppAsyncSelectOptions,
  AppDatePicker,
  AppFloatingTextAreaField,
  AppInputGroupField,
  AppRichText
} from "../../components";
import {useGetTreatmentsQuery, useLazyHandleLoadTreatmentsQuery} from "../treatments/treatmentApiSlice";
import {useGetActsQuery, useLazyHandleLoadActsQuery} from "../acts/actApiSlice";
import toast from "react-hot-toast";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";

const styles = {
  color: 'hsl(0, 0%, 40%)',
  display: 'inline-block',
  fontSize: 12,
  fontStyle: 'italic',
  marginTop: '1em',
}

export function ConsultForm1({data, isDataExists = false, consultation, setConsultation, apiErrors, onReset, loader = false}) {
  const [handleLoadAgents] = useLazyHandleLoadAgentsQuery()
  const [handleLoadExams] = useLazyHandleLoadExamsQuery()
  const [handleLoadTreatments] = useLazyHandleLoadTreatmentsQuery()
  const [handleLoadActs] = useLazyHandleLoadActsQuery()
  const [diagnostic, setDiagnostic] = useState('')

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
  examOptions = useMemo(() => isExamsSuccess && exams ? exams.map(exam => {
    return {
      id: exam?.id,
      label: exam?.wording,
      value: exam['@id'],
    }

  }) : [], [isExamsSuccess, exams])

  if (isTreatmentsError) alert('ERREUR: Erreur lors du chargement des traitements !!!')
  treatmentOptions = useMemo(() => isTreatmentsSuccess && treatments
    ? treatments.ids?.map(id => {
      const treatment = treatments?.entities[id]
      return {
        id: treatment?.id,
        label: treatment?.wording,
        value: treatment['@id'],
      }
    })
    : [], [isTreatmentsSuccess, treatments])

  if (isActsError) alert('ERREUR: Erreur lors du chargement des actes médicaux !!!')
  actOptions = useMemo(() => isActsSuccess && acts
    ? acts?.map(act => {
      return {
        id: act?.id,
        label: act?.wording,
        value: act['@id'],
      }
    })
    : [], [isActsSuccess, acts])

  async function onLoadAgents(keyword) {
    const agentsData = handleLoadAgents(keyword).unwrap()
    if (!agentsData.error) return agentsData
  }

  async function onLoadExams(keyword) {
    const examsData = await handleLoadExams(keyword).unwrap()
    if (!examsData?.error) return examsData
  }

  async function onLoadTreatments(keyword) {
    const examsData = await handleLoadTreatments(keyword).unwrap()
    if (!examsData?.error) return examsData
  }

  async function onLoadActs(keyword) {
    const examsData = await handleLoadActs(keyword).unwrap()
    if (!examsData?.error) return examsData
  }

  const handleChangeDiagnostic = (newValue) => {
    setDiagnostic(newValue)
    setConsultation({...consultation, diagnostic: newValue})
  }

  const handleBlur = () => setConsultation({...consultation, diagnostic})

  const onAddActItem = () => {
    if (acts && acts?.length > 0)
      setConsultation({ ...consultation, actsItems: [...consultation?.actsItems, null] })
    else toast.error("Aucun acte existant ❗")
  }

  const onRemoveActItem = index => {
    const values = [...consultation?.actsItems]
    values.splice(index, 1)
    setConsultation({...consultation, actsItems: values})
  }

  const handleChangeActItem = (event, index) => {
    const values = [...consultation?.actsItems]
    values[index] = event
    setConsultation({...consultation, actsItems: values})
  }

  return (
    <>
      <Row className='mb-3'>
        <Col>
          <AppInputGroupField
            autoFocus
            disabled={loader || (data ? data?.isComplete : false)}
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
            disabled={loader || (data ? data?.isComplete : false)}
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
            disabled={loader || (data ? data?.isComplete : false)}
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
            disabled={loader || (data ? data?.isComplete : false)}
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
            disabled={loader || (data ? data?.isComplete : false)}
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
            disabled={loader || (data ? data?.isComplete : false)}
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
            disabled={loader || (data ? !data?.isPublished : false)} />
        </Col>

        <Col md={6}>
          <AppAsyncSelectOptions
            disabled={loader || (data ? !data?.isPublished : false)}
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
          disabled={isExamsFetching || loader || (data ? !data?.isPublished : false)}
          placeholder='Examen(s)...'
          className='text-uppercase' />
      </Col>

      <Col className="mb-3 me-2" style={styles}>
        <AppAsyncSelectOptions
          isMulti
          label={<span style={{ color: 'blue' }}><i className='bi bi-plus-circle'/> Premier(s) soin(s)</span>}
          loadOptions={onLoadTreatments}
          defaultOptions={treatmentOptions}
          onChange={(e) => setConsultation({...consultation, treatments: e})}
          value={consultation?.treatments}
          disabled={isTreatmentsFetching || loader || (data ? !data?.isPublished : false)}
          placeholder='Premier(s) soin(s)...'
          className='text-uppercase' />
      </Col>

      <Col xl={12} className='mb-3 bg-light p-1' style={{ border: '1px solid lightgray', borderRadius: 6 }}>
        <h6><i className='bi bi-journal-plus'/> Actes médicaux</h6>
        {consultation?.actsItems && consultation.actsItems?.length > 0 &&
          <div id='inline-block-items'>
            {consultation.actsItems?.map((t, idx) =>
              <div key={idx} className='me-2' style={styles}>
                <AppAsyncSelectOptions
                  loadOptions={onLoadActs}
                  defaultOptions={actOptions}
                  onChange={(e) => handleChangeActItem(e, idx)}
                  value={t}
                  disabled={isActsFetching || loader || !!(data && data?.isComplete)}
                  placeholder='Acte...'
                  className='text-uppercase d-inline-block' />
                <i className='bi bi-x mx-1 text-danger' style={{ cursor: 'pointer' }} onClick={() => onRemoveActItem(idx)}/>
              </div>)}
          </div>}
        {acts && acts.length > 0 &&
          <Button
            type='button'
            variant='info'
            className='d-block w-100 mt-3'
            disabled={isActsFetching || loader || !!(data && data?.isComplete)}
            onClick={onAddActItem}>
            <i className='bi bi-plus-circle-fill'/>
          </Button>}
        {isActsFetching && <BarLoaderSpinner loading={isActsFetching}/>}
      </Col>

      {consultation?.exams && consultation.exams?.length > 0 && (
        <>
          <AppFloatingTextAreaField
            value={consultation?.note}
            name='note'
            label='Renseingement clinique'
            disabled={loader || (data ? !data?.isPublished : false)}
            onChange={(e) => handleChange(e, consultation, setConsultation)}
            placeholder='Renseingement clinique...' />
        </>
      )}

      <div className='mb-3'>
        <b>Plaintes & diagnostics</b>
        <AppRichText
          onChange={handleChangeDiagnostic}
          onBlur={handleBlur}
          value={consultation?.diagnostic}
          disabled={loader || (data ? data?.isComplete : false)} />
      </div>

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
