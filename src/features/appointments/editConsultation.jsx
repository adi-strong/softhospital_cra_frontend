import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useGetSingleConsultQuery, useUpdateConsultationMutation} from "../consultations/consultationApiSlice";
import {useEffect, useState} from "react";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import toast from "react-hot-toast";
import {AppBreadcrumb, AppDropdownFilerMenu, AppHeadTitle} from "../../components";
import {Card, Col, Form, Row, Tab, Tabs} from "react-bootstrap";
import {ConsultForm2} from "../consultations/ConsultForm2";
import {ConsultForm1} from "../consultations/ConsultForm1";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {selectCurrentUser} from "../auth/authSlice";
import {allowShowSingleAppointmentsPage} from "../../app/config";
import {SingleConsultTreatmentsTab} from "../consultations/SingleConsultTreatmentsTab";

const tabs = [{title: 'Avant première', eventKey: 'details'}, {title: 'Traitements', eventKey: 'treatments'}]

function EditConsultation() {
  const dispatch = useDispatch(), navigate = useNavigate()
  const { id } = useParams()
  const [updateConsultation, {isLoading, isError, error}] = useUpdateConsultationMutation()
  const {
    data: consult,
    isLoading: isConsultLoading,
    isFetching: isConsultFetching,
    isError: isConsultError,
    isSuccess,
    refetch} = useGetSingleConsultQuery(id)

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
    actsItems: [],
    file: null,
    agent: null,
    appointmentDate: new Date(),
    patient: null,
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
  }

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/consultations'))
  }, [dispatch]) // toggle dropdown treatments menu

  useEffect(() => {
    if (id && isSuccess && consult) {
      setConsultation(prevState => {
        return {
          id: id,
          ...prevState,
          isPublished: consult ? consult?.isPublished : true,
          comment: consult?.comment ? consult.comment : '',
          weight: consult?.weight ? consult.weight : 0.0,
          temperature: consult?.temperature ? consult.temperature : 0.0,
          arterialTension: consult?.arterialTension ? consult.arterialTension : '',
          cardiacFrequency: consult?.cardiacFrequency ? consult.cardiacFrequency : '',
          respiratoryFrequency: consult?.respiratoryFrequency ? consult.respiratoryFrequency : '',
          oxygenSaturation: consult?.oxygenSaturation ? consult.oxygenSaturation : '',
          appointmentDate: consult?.appointment
            ? new Date(consult.appointment?.appointmentDate)
            : new Date(),
          agent: consult?.doctor ? {
            id: consult?.doctor?.id,
            label: `${consult.doctor?.name} ${consult.doctor?.firstName} (${consult.doctor?.office?.title})`,
            value: consult.doctor['@id']
          } : null,
          note: consult?.note ? consult.note : '',
          diagnostic: consult?.diagnostic ? consult.diagnostic : '',
          file: consult?.file
            ? {
              id: consult.file?.id,
              label: consult.file?.wording,
              value: consult.file['@id'],
            }
            : null,
          patient: consult?.patient
            ? {
              id: consult.patient?.id,
              label: `${consult.patient?.name} ${consult.patient?.lastName} ${consult.patient?.firstName}`,
              value: consult.patient['@id'],
              data: consult.patient,
            }
            : null,
          acts: consult?.acts ? consult.acts?.map(act => {
            return {
              id: act?.id,
              label: act?.wording,
              value: act['@id'],
            }
          }) : null,
          exams: consult?.acts ? consult.exams?.map(exam => {
            return {
              id: exam?.id,
              label: exam?.wording,
              value: exam['@id'],
            }
          }) : null,
          treatments: consult?.acts ? consult.treatments?.map(treatment => {
            return {
              id: treatment?.id,
              label: treatment?.wording,
              value: treatment['@id'],
            }
          }) : null,
        }
      })
    }
  }, [isSuccess, consult, id]) // handle get existing data

  useEffect(() => {
    if (id && isSuccess && consult && consult?.hospitalization) {
      const bed = consult.hospitalization?.bed
      setConsultation(prev => {
        return {
          ...prev,
          bed: {
            id: bed?.id,
            label: bed?.number,
            value: bed['@id'],
            data: bed,
          }
        }
      })
    }
  }, [id, isSuccess, consult]) // get hospitalization

  useEffect(() => {
    if (consult && consult?.isComplete) toast.error('Ce dossier est clos 👌')
  }, [consult])

  if (isConsultError) alert('ERREUR: Erreur lors du chargement de la consultation ❗')

  const onRefresh = async () => await refetch()

  function onReset() {
    setConsultation({
      comment: '',
      oxygenSaturation: '',
      respiratoryFrequency: '',
      cardiacFrequency: '',
      arterialTension: '',
      temperature: 0.0,
      weight: 0.0,
      actsItems: [],
      file: null,
      agent: null,
      diagnostic: '',
      appointmentDate: new Date(),
      patient: null,
      treatments: null,
      acts: null,
      exams: null,
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
    }

    if (canSave && id) {
      if (consult && consult?.isComplete) {
        toast.error('Ce dossier est clos 👌')
        // navigate('/member/treatments/consultations', {replace: true})
      }
      else {
        const data = await updateConsultation(consultation)
        if (!data?.error) {
          onReset()
          toast.success('Modification bien efféctuée.')
          await refetch()
          // navigate(`/member/treatments/appointments`)
        }
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

  const onClick = name => onRefresh()

  const user = useSelector(selectCurrentUser)

  useEffect(() => {
    if (user && !allowShowSingleAppointmentsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  const [key, setKey] = useState('details')

  return (
    <div className='section dashboard'>
      <AppHeadTitle title='Fiche de consultation | Édition' />
      <AppBreadcrumb title='Fiche de consultation | Édition' links={[
        {label: 'Liste des consultations', path: '/member/treatments/consultations'}
      ]} />

      <Form onSubmit={onSubmit}>
        <Row>
          <Col md={5}>
            <ConsultForm2
              data={consult}
              loader={isLoading || isConsultLoading || isConsultFetching}
              onReset={onReset}
              setConsultation={setConsultation}
              consultation={consultation}
              apiErrors={apiErrors}/>
          </Col>

          <Col>
            <Card className='border-0'>
              {consult &&
                <AppDropdownFilerMenu
                  onClick={onClick}
                  items={[{label: <><i className='bi bi-arrow-clockwise' /> Actualiser</>, name: 'refresh', action: '#'}]}
                  heading='Actions' />}

              <Card.Body>
                {isConsultFetching && <BarLoaderSpinner loading={isConsultFetching}/>}
                <Tabs onSelect={k => setKey(k)} activeKey={key} variant='tabs-bordered'>
                  {tabs && tabs.length > 0 && tabs.map((tab, idx) =>
                    <Tab key={idx} title={tab.title} eventKey={tab.eventKey} className='pt-3'>
                      {tab.eventKey === 'details' &&
                        <ConsultForm1
                          isDataExists
                          data={consult}
                          onRefresh={onRefresh}
                          loader={isLoading || isConsultLoading || isConsultFetching}
                          onReset={onReset}
                          setConsultation={setConsultation}
                          consultation={consultation}
                          apiErrors={apiErrors}/>}

                      {tab.eventKey === 'treatments' &&
                        <SingleConsultTreatmentsTab
                          data={consult}
                          onRefresh={onRefresh}
                          loader={isLoading || isConsultLoading || isConsultFetching}/>}
                    </Tab>)}
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default EditConsultation
