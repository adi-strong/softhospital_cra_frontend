import {useGetAgentsQuery, useLazyHandleLoadAgentsQuery} from "../staff/agentApiSlice";
import {useGetPatientsQuery, useLazyHandleLoadPatientsQuery} from "../patients/patientApiSlice";
import {useMemo} from "react";
import {AppAsyncSelectOptions, AppDatePicker, AppFloatingInputField, AppFloatingTextAreaField} from "../../components";
import {requiredField} from "../covenants/addCovenant";
import {Button, Col, Form, Row} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";

export const AppointmentForm = ({ state, setState, onReset, loader, apiErrors, data }) => {
  const {
    data: agents = [],
    isFetching: isAgentsFetching,
    isSuccess: isAgentsSuccess,
    isError: isAgentsError
  } = useGetAgentsQuery('Agents')
  const {
    data: patients = [],
    isFetching: isPatientsFetching,
    isSuccess: isPatientsSuccess,
    isError: isPatientsError
  } = useGetPatientsQuery('Patient')

  const [handleLoadAgents] = useLazyHandleLoadAgentsQuery()
  const [handleLoadPatients] = useLazyHandleLoadPatientsQuery()

  if (isAgentsError) alert('ERREUR: Erreur lors du chargement des médecin ❗')
  if (isPatientsError) alert('ERREUR: Erreur lors du chargement des patients ❗')

  let agentOptions, patientOptions, isComplete

  isComplete = useMemo(() => !!(data && data?.isComplete), [data])

  // get agent's data
  agentOptions = useMemo(() => isAgentsSuccess && agents
    ? agents?.ids.map(id => {
      const agent = agents?.entities[id]
      const name = agent?.name
      const lastName = agent?.lastName ? agent.lastName : ''
      const firstName = agent?.firstName ? agent.firstName : ''

      const office = agent?.office ? `(${agent.office?.title})` : ''

      const label = `${name} ${lastName} ${firstName} ${office}`

      return {
        label,
        value: agent['@id'],
        id: agent?.id,
      }

    })
    : [], [isAgentsSuccess, agents])
  // end get agent's data

  // get patient's data
  patientOptions = useMemo(() => isPatientsSuccess && patients
    ? patients.map(patient => {
      const name = patient?.name
      const lastName = patient?.lastName ? patient.lastName : ''
      const firstName = patient?.firstName ? patient.firstName : ''
      const label = `${name} ${lastName} ${firstName}`

      return {
        label,
        id: patient?.id,
        value: patient['@id']
      }
    })
    : [], [isPatientsSuccess, patients])
  // end get patient's data

  // handle change agent
  const onAgentChange = (event) => setState({...state, doctor: event})
  async function onLoadAgents(keyword) {
    const agentsData = handleLoadAgents(keyword).unwrap()
    if (!agentsData?.error) return agentsData
  }
  // end handle change agent

  // handle change patient
  const onPatientChange = (event) => setState({...state, patient: event})
  async function onLoadPatients(keyword) {
    const patientsData = handleLoadPatients(keyword).unwrap()
    if (!patientsData?.error) return patientsData
  }
  // end handle change patient

  return (
    <>
      <p className='text-center'>Veuillez renseigner les (<i className='text-danger'>*</i>) champs obligatoires :</p>

      <Row>
        <Col md={7}>
          <Row className='mb-3'>
            <Col md={5}>Médecin / Docteur {requiredField}</Col>
            <Col>
              <AppAsyncSelectOptions
                onChange={(e) => onAgentChange(e)}
                error={apiErrors?.doctor}
                value={state?.doctor}
                disabled={isAgentsFetching || loader || isComplete}
                defaultOptions={agentOptions}
                loadOptions={onLoadAgents}
                placeholder='-- Médecin --'
                className='text-capitalize' />
            </Col>
          </Row>

          <Row className='mb-3'>
            <Col md={5}>Patient(e) {requiredField}</Col>
            <Col>
              <AppAsyncSelectOptions
                error={apiErrors?.patient}
                loadOptions={onLoadPatients}
                defaultOptions={patientOptions}
                disabled={isPatientsFetching || loader || isComplete}
                value={state?.patient}
                onChange={(e) => onPatientChange(e)}
                placeholder='-- Patient(e) --'
                className='text-uppercase' />
            </Col>
          </Row>

          <AppDatePicker
            disabled={loader || isComplete}
            onChange={(date) => setState({...state, appointmentDate: date})}
            value={state?.appointmentDate}
            label={<><i className='bi bi-calendar-event'/> Heure & date du rendez-vous {requiredField}</>} />
          {data && !data?.consultation && (
            <>
              <Form.Check
                className='mt-3'
                name='isConsultation'
                value={state?.isConsultation}
                onChange={(e) => handleChange(e, state, setState)}
                disabled={loader || isComplete}
                checked={state?.isConsultation}
                id='isConsultation'
                label={<>Faire de ce rendez-vous une consultation <i className='bi bi-question-circle'/></>} />
            </>
          )}
        </Col>

        <Col>
          <AppFloatingInputField
            label='Motif'
            value={state?.reason}
            disabled={loader || isComplete}
            onChange={(e) => handleChange(e, state, setState)}
            name='reason'
            text='Champs facultatif.'
            placeholder='Motif'
            maxLength={255} />

          <AppFloatingTextAreaField
            label='Détail :'
            value={state?.description}
            disabled={loader || isComplete}
            onChange={(e) => handleChange(e, state, setState)}
            text='Champs facultatif.'
            name='description'
            placeholder='Détails du rendez-vous' />
        </Col>
      </Row>

      {!data &&
        <div className='text-end mt-3'>
          <Button type='button' className='bg-transparent border-0' onClick={onReset} disabled={loader || isComplete}>
            <i className='bi bi-arrow-clockwise text-dark'/>
          </Button>
        </div>}
    </>
  )
}
