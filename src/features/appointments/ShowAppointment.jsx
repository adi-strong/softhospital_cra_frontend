import {useEffect, useState} from "react";
import {useUpdateAppointmentMutation} from "./appointmentApiSlice";
import {Button, Form, Spinner, Tab, Tabs} from "react-bootstrap";
import {AppointmentDetails} from "./AppointmentDetails";
import {AppointmentForm} from "./AppointmentForm";
import toast from "react-hot-toast";

const tabs = [
  {title: 'Voir', event: 'show'},
  {title: 'Modification', event: 'edit'},
]

const ShowAppointmentForm = ({ onSubmit, state, setState, loader, apiErrors, data }) => {
  return (
    <Form onSubmit={onSubmit}>
      <AppointmentForm
        data={data}
        state={state}
        setState={setState}
        loader={loader}
        apiErrors={apiErrors} />

      <div className='text-end mt-3'>
        <Button type='submit' disabled={loader || data?.isComplete}>
          {loader ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Modifier'}
        </Button>
      </div>
    </Form>
  )
}

export const ShowAppointment = ({ data, onHide, onRefresh }) => {
  const [key, setKey] = useState('show')
  const [appointment, setAppointment] = useState({
    doctor: null,
    patient: null,
    reason: '',
    description: '',
    isConsultation: false,
    appointmentDate: new Date(),
  })
  const [updateAppointment, {isLoading, isError, error}] = useUpdateAppointmentMutation()
  let apiErrors = {doctor: null, patient: null}

  useEffect(() => {
    if (data) {
      // Doctor
      const agent = data?.doctor
      const name = agent && agent?.name
      const lastName = agent && agent?.lastName ? agent.lastName : ''
      const firstName = agent && agent?.firstName ? agent.firstName : ''
      const office = agent && agent?.office ? `(${agent.office?.title})` : ''
      const doctor = {
        label: `${name} ${lastName} ${firstName} ${office}`,
        id: agent?.id,
        value: agent ? agent['@id'] : null
      } // End Doctor

      // Patient
      const patientData = data?.patient
      const patientName = patientData?.name
      const patientLastName = patientData?.lastName
      const patientFirstName = patientData?.firstName
      const patient = {
        label: `${patientName} ${patientLastName} ${patientFirstName}`,
        value: patientData['@id'],
        id: patientData?.id
      } // End Patient

      setAppointment(prev => {
        return {
          ...prev,
          id: data?.id,
          reason: data?.reason ? data.reason : '',
          description: data?.description ? data.description : '',
          appointmentDate: new Date(data?.appointmentDate),
          isConsultation: data?.isConsultation ? data.isConsultation : false,
          doctor,
          patient,
        }
      })
    }
  }, [data])

  const canSave = [appointment.patient, appointment.doctor].every(Boolean) || !isLoading

  async function onSubmit(e) {
    e.preventDefault()
    if (canSave) {
      if (data?.isComplete) toast.error('Rendez-vous déjà clôturé.')
      else {
        const formData = await updateAppointment(appointment)
        if (!formData?.error) {
          toast.success('Modification bien efféctuée.')
          onRefresh()
          onHide()
        }
      }
    }
    else alert('Veuillez renseigner les (⭐) champs obligatoires ❗')
  }

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
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        variant='tabs-bordered'>
        {tabs && tabs.map((tab, idx) =>
          <Tab key={idx} title={tab.title} eventKey={tab.event} className='mb-3'>
            {tab.event === 'edit'
              ? <ShowAppointmentForm
                  onSubmit={onSubmit}
                  data={data}
                  loader={isLoading}
                  state={appointment}
                  apiErrors={apiErrors}
                  setState={setAppointment}/>
              : <AppointmentDetails appointment={data}/>}
          </Tab>)}
      </Tabs>
    </>
  )
}
