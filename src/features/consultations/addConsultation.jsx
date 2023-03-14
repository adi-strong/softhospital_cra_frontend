import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {Card, Col, Form, Row} from "react-bootstrap";
import {ConsultForm1} from "./ConsultForm1";
import {ConsultForm2} from "./ConsultForm2";
import {useAddNewConsultationMutation} from "./consultationApiSlice";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

const AddConsultation = () => {
  const dispatch = useDispatch(), navigate = useNavigate()
  const [addNewConsultation, {isLoading, isError, error}] = useAddNewConsultationMutation()

  const [consultation, setConsultation] = useState({
    comment: '',
    note: '',
    weight: 0.0,
    temperature: 0.0,
    arterialTension: '',
    cardiacFrequency: '',
    respiratoryFrequency: '',
    oxygenSaturation: '',
    diagnostic: '',
    file: null,
    agent: null,
    appointmentDate: new Date(),
    patient: null,
    acts: null,
    exams: null,
    treatments: null,
    bed: null,
  }) // state: consultation's fields

  let apiErrors = {
    comment: null,
    weight: null,
    temperature: null,
    arterialTension: null,
    cardiacFrequency: null,
    respiratoryFrequency: null,
    oxygenSaturation: null,
    diagnostic: null,
    doctor: null,
    patient: null,
    exams: null,
    treatments: null,
    acts: null,
    bed: null,
  }

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/consultations'))
  }, [dispatch]) // toggle dropdown treatments menu

  function onReset() {
    setConsultation({
      comment: '',
      note: '',
      oxygenSaturation: '',
      respiratoryFrequency: '',
      cardiacFrequency: '',
      arterialTension: '',
      temperature: 0.0,
      weight: 0.0,
      file: null,
      agent: null,
      diagnostic: '',
      appointmentDate: new Date(),
      patient: null,
      treatments: null,
      acts: null,
      exams: null,
      bed: null,
    })
  } // reset local state

  const canSave = [
    consultation.file,
    consultation.patient,
    consultation.agent,
    consultation.appointmentDate
  ].every(Boolean) || !isLoading

  async function onSubmit(e) {
    e.preventDefault()
    apiErrors = {
      comment: null,
      weight: null,
      temperature: null,
      arterialTension: null,
      cardiacFrequency: null,
      respiratoryFrequency: null,
      oxygenSaturation: null,
      diagnostic: null,
      doctor: null,
      patient: null,
      exams: null,
      treatments: null,
      acts: null,
      bed: null,
    }

    if (canSave) {
      const data = await addNewConsultation(consultation)
      if (!data?.error) {
        onReset()
        toast.success('Opération bien efféctuée.')
        navigate('/member/treatments/consultations')
      }
    }
    else alert('Veuillez renseigner les champs obligatoires !!!')
  } // handle submit data

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
      <AppHeadTitle title='Nouvelle Consultation' />
      <AppBreadcrumb title='Nouvelle consultation (Fiche)' links={[
        {label: 'Liste des consultations', path: '/member/treatments/consultations'}
      ]} />

      <Form onSubmit={onSubmit}>
        <Row>
          <Col md={5}>
            <ConsultForm2
              loader={isLoading}
              onReset={onReset}
              setConsultation={setConsultation}
              consultation={consultation}
              apiErrors={apiErrors}/>
          </Col>

          <Col>
            <Card className='border-0'>
              <Card.Body>
                <ConsultForm1
                  loader={isLoading}
                  onReset={onReset}
                  setConsultation={setConsultation}
                  consultation={consultation}
                  apiErrors={apiErrors}/>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default AddConsultation
